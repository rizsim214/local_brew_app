// src/app/admin/analytics.ts
"use server";

import { prisma } from "@/src/lib/db";

export type AdminMetrics = {
  totalRevenue: number;
  totalOrders: number;
  popularProducts: Array<{
    name: string;
    unitsSold: number;
  }>;
};

export async function getAdminMetrics(): Promise<AdminMetrics> {
  // Protect route logic inside production deployments here using NextAuth

  const salesSummary = await prisma.order.aggregate({
    where: { status: "COMPLETED" },
    _sum: { totalAmount: true },
    _count: { id: true },
  });

  // Calculate top-selling items using relation aggregation groups
  const popularItemsRaw = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { order: { status: "COMPLETED" } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  // Hydrate product identity definitions cleanly
  const popularProducts = await Promise.all(
    popularItemsRaw.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      return {
        name: product?.name || "Unknown Item",
        unitsSold: item._sum.quantity || 0,
      };
    }),
  );

  return {
    totalRevenue: Number(salesSummary._sum.totalAmount || 0),
    totalOrders: salesSummary._count.id,
    popularProducts,
  };
}
