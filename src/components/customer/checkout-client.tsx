"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { createOrder } from "@/src/app/(customer)/checkout/actions";
import { useCart } from "@/src/lib/store/useCart";

export function CheckoutClient() {
  const { items, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const result = await createOrder({
        customerName,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedAddOns: item.addOns,
        })),
      });

      if (!result.success) {
        setError(result.error || "We could not place your order right now.");
        return;
      }

      clearCart();
      setMessage("Order placed successfully. We'll send you to Local Brew's Facebook page to finish the conversation.");
      window.location.assign(result.redirectUrl || "");
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:flex-row">
      <div className="flex-1 rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <Link href="/menu" className="mb-6 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80">
          <ArrowLeft className="mr-2 size-4" />
          Back to menu
        </Link>

        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Checkout</p>
          <h1 className="text-3xl font-semibold text-foreground">Almost there.</h1>
          <p className="text-sm text-muted-foreground">
            Share your name and we&apos;ll turn your cart into a quick message for the Local Brew team.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="customerName" className="mb-2 block text-sm font-medium text-foreground">
              Your name
            </label>
            <input
              id="customerName"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Ava"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none ring-offset-background focus:border-primary focus:ring-2 focus:ring-ring"
            />
          </div>

          {error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          {message ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                <span>{message}</span>
              </div>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting || items.length === 0 || !customerName.trim()}
            className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>
      </div>

      <aside className="w-full max-w-md rounded-[2rem] border border-border bg-card p-6 shadow-sm lg:max-w-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Order summary</p>
        <div className="mt-5 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background/70 p-4 text-sm text-muted-foreground">
              Your cart is empty. Visit the menu and add a few favorites first.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                  {item.addOns.length > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {item.addOns.map((addOn) => addOn.name).join(", ")}
                    </p>
                  ) : null}
                </div>
                <p className="font-medium text-foreground">PHP {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold text-foreground">PHP {subtotal.toFixed(2)}</span>
        </div>
      </aside>
    </div>
  );
}
