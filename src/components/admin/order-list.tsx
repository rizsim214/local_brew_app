import Link from "next/link";
import { type Order, type Product, type OrderItem } from "@prisma/client";

import { parseJsonArray, type ProductAddOnOption } from "@/src/lib/product-catalog";

type OrderWithRelations = Order & {
  items: Array<OrderItem & { product: Product }>;
};

type OrderListProps = {
  orders: OrderWithRelations[];
};

export function OrderList({ orders }: Readonly<OrderListProps>) {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Recent orders</p>
          <h2 className="text-2xl font-semibold text-foreground">Order history</h2>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/70 p-4 text-sm text-muted-foreground">
            No orders yet. Once customers place an order, it will appear here.
          </div>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex flex-col gap-2 rounded-[1.25rem] border border-border bg-background/70 p-4 transition-colors hover:bg-accent/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
                <p className="text-sm text-muted-foreground">
                  {order.items
                    .map((item) => {
                      const addOns = parseJsonArray<ProductAddOnOption>(item.selectedAddOns);
                      const addOnSummary =
                        addOns.length > 0
                          ? ` + ${addOns.map((addOn) => addOn.name).join(", ")}`
                          : "";
                      const sizeSummary = item.selectedSize ? ` (${item.selectedSize})` : "";
                      return `${item.product.name}${sizeSummary}${addOnSummary}`;
                    })
                    .join(" | ")}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>PHP {Number(order.totalAmount).toFixed(2)}</p>
                <p className="font-medium text-foreground">{order.status}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
