"use client";

import Link from "next/link";
import { type Product } from "@prisma/client";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/src/lib/store/useCart";

type MenuClientProps = {
  products: Product[];
};

export function MenuClient({ products }: Readonly<MenuClientProps>) {
  const { addItem, items } = useCart();

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Seasonal menu
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Crafted for slow mornings and bright afternoons.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Choose your favorite coffee, pastry, or refreshment and send it straight to the bar.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/70 p-8 text-center text-muted-foreground md:col-span-2">
              No products are available right now. Add a few products in the database to populate this menu.
            </div>
          ) : (
            products.map((product) => (
              <article
                key={product.id}
                className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {product.category}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-foreground">{product.name}</h2>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    ₱{Number(product.price).toFixed(2)}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">{product.description}</p>

                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: Number(product.price),
                    })
                  }
                  className="mt-5 inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  <ShoppingBag className="mr-2 size-4" />
                  Add to cart
                </button>
              </article>
            ))
          )}
        </div>
      </section>

      <aside className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Your order
            </p>
            <h2 className="text-2xl font-semibold text-foreground">Cart</h2>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {cartCount} item{cartCount === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background/70 p-4 text-sm text-muted-foreground">
              Your cart is empty. Start with a favorite drink or pastry.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <p className="font-medium text-foreground">₱{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 border-t border-border pt-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">₱{subtotal.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Continue to checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
