const DEFAULT_AUTO_ACTIVATE_SECONDS = 30;

function getAutoActivateMs() {
  const raw = Number(process.env.MOCK_CARD_AUTO_ACTIVATE_SECONDS ?? DEFAULT_AUTO_ACTIVATE_SECONDS);
  const sec = Number.isFinite(raw) && raw >= 0 ? raw : DEFAULT_AUTO_ACTIVATE_SECONDS;
  return sec * 1000;
}

export function serializeCard(card) {
  return {
    id: card._id.toString(),
    status: card.status,
    provider: card.provider,
    mode: card.mode,
    networkLabel: card.networkLabel,
    maskedPan: card.maskedPan,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
    balanceUsd: card.balanceUsd,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
  };
}

function buildMaskedPan() {
  const last4 = Math.floor(1000 + Math.random() * 9000);
  return `•••• •••• •••• ${last4}`;
}

export async function createMockStripeCard({ userId }) {
  const now = new Date();
  const expiryYear = now.getFullYear() + 3;
  const expiryMonth = ((now.getMonth() + 5) % 12) || 12;

  return {
    userId,
    provider: "stripe-mock",
    mode: "mock",
    status: "pending",
    networkLabel: "Quantro Debit Card",
    maskedPan: buildMaskedPan(),
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
