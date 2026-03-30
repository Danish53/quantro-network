const DEFAULT_AUTO_ACTIVATE_SECONDS = 30;

function getAutoActivateMs() {
  const raw = Number(process.env.MOCK_CARD_AUTO_ACTIVATE_SECONDS ?? DEFAULT_AUTO_ACTIVATE_SECONDS);
  const sec = Number.isFinite(raw) && raw >= 0 ? raw : DEFAULT_AUTO_ACTIVATE_SECONDS;
  return sec * 1000;
}

export function serializeCard(card) {
  const panDigits = String(card.panFull ?? "").replace(/\D/g, "");
  return {
    id: card._id.toString(),
    status: card.status,
    provider: card.provider,
    mode: card.mode,
    networkLabel: card.networkLabel,
    maskedPan: card.maskedPan,
    panCopyable: panDigits.length >= 13 && panDigits.length <= 19 ? panDigits : undefined,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
    balanceUsd: card.balanceUsd,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
  };
}

function buildFullPan16() {
  const n = () => Math.floor(Math.random() * 10);
  let out = "4";
  while (out.length < 16) out += String(n());
  return out;
}

function buildFullPanWithLast4(last4) {
  const safeLast4 = String(last4 ?? "").replace(/\D/g, "").slice(-4).padStart(4, "0");
  const n = () => Math.floor(Math.random() * 10);
  let out = "4";
  while (out.length < 12) out += String(n());
  return `${out}${safeLast4}`;
}

function maskPan(pan) {
  const digits = String(pan ?? "").replace(/\D/g, "");
  if (digits.length < 4) return "•••• •••• •••• ••••";
  const last4 = digits.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export async function ensureCardPanStorage(card) {
  if (!card) return card;
  const digits = String(card.panFull ?? "").replace(/\D/g, "");
  if (digits.length >= 13 && digits.length <= 19) {
    if (!card.maskedPan) card.maskedPan = maskPan(digits);
    return card;
  }

  const last4 = String(card.maskedPan ?? "").replace(/\D/g, "").slice(-4);
  const generated = buildFullPanWithLast4(last4);
  card.panFull = generated;
  card.maskedPan = maskPan(generated);
  await card.save();
  return card;
}

export async function createMockStripeCard({ userId }) {
  const now = new Date();
  const expiryYear = now.getFullYear() + 3;
  const expiryMonth = ((now.getMonth() + 5) % 12) || 12;
  const panFull = buildFullPan16();

  return {
    userId,
    provider: "stripe-mock",
    mode: "mock",
    status: "pending",
    networkLabel: "Quantro Debit Card",
    panFull,
    maskedPan: maskPan(panFull),
    expiryMonth,
    expiryYear,
    balanceUsd: 0,
  };
}

export async function reconcileMockCardLifecycle(card) {
  if (!card) return null;
  if (card.status !== "pending_review" && card.status !== "pending") return card;

  const elapsed = Date.now() - new Date(card.createdAt).getTime();
  if (elapsed < getAutoActivateMs()) return card;

  card.status = "active";
  await card.save();
  return card;
}
