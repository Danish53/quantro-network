const DEFAULT_AUTO_APPROVE_SECONDS = 20;

function getAutoApproveMs() {
  const raw = Number(process.env.MOCK_KYC_AUTO_APPROVE_SECONDS ?? DEFAULT_AUTO_APPROVE_SECONDS);
  const sec = Number.isFinite(raw) && raw >= 0 ? raw : DEFAULT_AUTO_APPROVE_SECONDS;
  return sec * 1000;
}

export async function reconcileMockKycStatus(user) {
  if (!user) return null;
  if (user.kycStatus !== "pending" || !user.kycSubmittedAt) return user;

  const elapsed = Date.now() - new Date(user.kycSubmittedAt).getTime();
  if (elapsed < getAutoApproveMs()) return user;

  user.kycStatus = "approved";
  user.kycApprovedAt = new Date();
  user.kycRejectedReason = "";
  await user.save();
  return user;
}
