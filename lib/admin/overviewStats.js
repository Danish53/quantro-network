import User from "@/lib/models/User";
import WalletTransaction from "@/lib/models/WalletTransaction";

/** Matches users that are not soft-deleted (field missing or null). */
export const ACTIVE_USER_FILTER = {
  $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
};

/** Admin user list: all non-admin members, including soft-deleted (so they can be reactivated). */
export const ADMIN_MEMBER_LIST_FILTER = { role: { $ne: "admin" } };

const ETH_USD = 3200;

export function txToUsd(tx) {
  if (tx.asset === "ETH") return Number(tx.amount) * ETH_USD;
  return Number(tx.amount);
}

const USD_ADD_FIELDS = {
  $addFields: {
    usd: {
      $switch: {
        branches: [
          { case: { $eq: ["$asset", "USDT_BNB"] }, then: "$amount" },
          { case: { $eq: ["$asset", "USDC_BNB"] }, then: "$amount" },
          { case: { $eq: ["$asset", "ETH"] }, then: { $multiply: ["$amount", ETH_USD] } },
        ],
        default: 0,
      },
    },
  },
};

async function sumCompletedByType(type) {
  const [row] = await WalletTransaction.aggregate([
    { $match: { type, status: "completed" } },
    USD_ADD_FIELDS,
    { $group: { _id: null, total: { $sum: "$usd" } } },
  ]);
  return row?.total ?? 0;
}

/**
 * @param {"7d" | "8w" | "12m"} range
 */
export function getBucketIntervals(range) {
  const now = new Date();
  const labels = [];
  const intervals = [];

  if (range === "7d") {
    for (let i = 6; i >= 0; i--) {
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      labels.push(`${String(start.getUTCMonth() + 1).padStart(2, "0")}/${String(start.getUTCDate()).padStart(2, "0")}`);
      intervals.push({ start, end });
    }
    return { labels, intervals };
  }

  if (range === "8w") {
    const dayEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    for (let w = 0; w < 8; w++) {
      const end = new Date(dayEnd);
      end.setUTCDate(end.getUTCDate() - w * 7);
      const start = new Date(end);
      start.setUTCDate(start.getUTCDate() - 7);
      intervals.unshift({ start, end });
      labels.unshift(`${String(start.getUTCMonth() + 1).padStart(2, "0")}/${String(start.getUTCDate()).padStart(2, "0")}`);
    }
    return { labels, intervals };
  }

  for (let i = 11; i >= 0; i--) {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i + 1, 1));
    labels.push(`${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, "0")}`);
    intervals.push({ start, end });
  }
  return { labels, intervals };
}

async function countNewUsers(start, end) {
  return User.countDocuments({
    ...ACTIVE_USER_FILTER,
    createdAt: { $gte: start, $lt: end },
  });
}

async function sumDepositsUsd(start, end) {
  const txs = await WalletTransaction.find({
    type: "deposit",
    status: "completed",
    createdAt: { $gte: start, $lt: end },
  }).lean();
  return txs.reduce((s, tx) => s + txToUsd(tx), 0);
}

async function sumWithdrawalsUsd(start, end) {
  const txs = await WalletTransaction.find({
    type: "withdrawal",
    status: "completed",
    createdAt: { $gte: start, $lt: end },
  }).lean();
  return txs.reduce((s, tx) => s + txToUsd(tx), 0);
}

export async function buildAdminOverview(range) {
  const { labels, intervals } = getBucketIntervals(range);

  const [totalUsers, pendingKyc, totalDepositsUsd, totalWithdrawalsUsd, ...bucketResults] = await Promise.all([
    User.countDocuments(ACTIVE_USER_FILTER),
    User.countDocuments({ ...ACTIVE_USER_FILTER, kycStatus: "pending" }),
    sumCompletedByType("deposit"),
    sumCompletedByType("withdrawal"),
    ...intervals.map(({ start, end }) =>
      Promise.all([countNewUsers(start, end), sumDepositsUsd(start, end), sumWithdrawalsUsd(start, end)]).then(
        ([newUsers, deposits, withdrawals]) => ({ newUsers, deposits, withdrawals }),
      ),
    ),
  ]);

  const newUsersSeries = bucketResults.map((b) => b.newUsers);
  const depositsSeries = bucketResults.map((b) => Number(b.deposits.toFixed(2)));
  const withdrawalsSeries = bucketResults.map((b) => Number(b.withdrawals.toFixed(2)));

  return {
    range,
    labels,
    stats: {
      totalUsers,
      totalDepositsUsd: Number(totalDepositsUsd.toFixed(2)),
      totalWithdrawalsUsd: Number(totalWithdrawalsUsd.toFixed(2)),
      netFlowUsd: Number((totalDepositsUsd - totalWithdrawalsUsd).toFixed(2)),
      pendingKyc,
    },
    series: {
      newUsers: newUsersSeries,
      deposits: depositsSeries,
      withdrawals: withdrawalsSeries,
    },
  };
}
