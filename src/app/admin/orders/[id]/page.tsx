import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/src/lib/db";
import { parseJsonArray, type ProductAddOnOption } from "@/src/lib/product-catalog";

type Params = Promise<{ readonly id: string }>;

export default async function AdminOrderDetailPage({ params }: Readonly<{ params: Params }>) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background p-6 text-muted-foreground">
        Order not found.
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-card p-8 shadow-sm">
        <Link href="/admin/orders" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80">
          <ArrowLeft className="mr-2 size-4" />
          Back to orders
        </Link>

        <div className="mt-6 flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Order detail</p>
            <h1 className="text-3xl font-semibold text-foreground">{order.customerName}</h1>
          </div>
          <div className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground">
            {order.status}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.45fr]">
          <div className="space-y-3">
            {order.items.map((item) => {
              const addOns = parseJsonArray<ProductAddOnOption>(item.selectedAddOns);

              return (
                <div key={item.id} className="flex items-center justify-between rounded-[1.2rem] border border-border bg-background/70 px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                    {item.selectedSize ? (
                      <p className="text-sm text-muted-foreground">Size: {item.selectedSize}</p>
                    ) : null}
                    {addOns.length > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Add-ons: {addOns.map((addOn) => addOn.name).join(", ")}
                      </p>
                    ) : null}
                  </div>
                  <p className="font-medium text-foreground">PHP {(Number(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background/70 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Summary</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Order ID</span>
                <span className="font-medium text-foreground">{order.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Placed</span>
                <span className="font-medium text-foreground">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="font-medium text-foreground">PHP {Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
