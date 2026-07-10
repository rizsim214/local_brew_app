import { prisma } from "@/src/lib/db";

import { OrderList } from "@/src/components/admin/order-list";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  return (
    <div className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Admin</p>
          <h1 className="text-3xl font-semibold text-foreground">Order history</h1>
        </div>
        <OrderList orders={orders} />
      </div>
    </div>
  );
}
