"use client";

import Link from "next/link";
import { useState } from "react";
import { type Product } from "@prisma/client";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/src/lib/store/useCart";
import {
  buildCartItemId,
  getCategoryLabel,
  getPrimaryImageUrl,
  parseJsonArray,
  type ProductAddOnOption,
  type ProductCategoryValue,
  type ProductSizeOption,
} from "@/src/lib/product-catalog";

type MenuClientProps = {
  products: Product[];
};

export function MenuClient({ products }: Readonly<MenuClientProps>) {
  const { items } = useCart();

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
            products.map((product) => <ProductCard key={product.id} product={product} />)
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

        <div className="mt-8 border-t border-border pt-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">PHP {subtotal.toFixed(2)}</span>
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

function ProductCard({ product }: Readonly<{ product: Product }>) {
  const { addItem } = useCart();
  const sizeOptions = parseJsonArray<ProductSizeOption>(product.sizeOptions);
  const addOnOptions = parseJsonArray<ProductAddOnOption>(product.addOnOptions);
  const primaryImageUrl = getPrimaryImageUrl(product);
  const [selectedSize, setSelectedSize] = useState<string>(sizeOptions[0]?.name ?? "");
  const [selectedAddOnNames, setSelectedAddOnNames] = useState<string[]>([]);

  const chosenSize = sizeOptions.find((option) => option.name === selectedSize);
  const chosenAddOns = addOnOptions.filter((option) =>
    selectedAddOnNames.includes(option.name),
  );
  const unitPrice =
    (chosenSize?.price ?? Number(product.price)) +
    chosenAddOns.reduce((total, addOn) => total + addOn.price, 0);
  const categoryLabel = getCategoryLabel(product.category as ProductCategoryValue);

  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-1">
      <div className="mb-5 aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primaryImageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {categoryLabel}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">{product.name}</h2>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          PHP {unitPrice.toFixed(2)}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">{product.description}</p>

      {sizeOptions.length > 0 ? (
        <div className="mt-4">
          <label htmlFor={`size-${product.id}`} className="mb-2 block text-sm font-medium text-foreground">
            Size
          </label>
          <select
            id={`size-${product.id}`}
            value={selectedSize}
            onChange={(event) => setSelectedSize(event.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {sizeOptions.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name} - PHP {option.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {addOnOptions.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-foreground">Add-ons</p>
          <div className="space-y-2">
            {addOnOptions.map((option) => {
              const checked = selectedAddOnNames.includes(option.name);
              return (
                <label
                  key={option.name}
                  className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-3 py-2 text-sm"
                >
                  <span>{option.name}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-muted-foreground">PHP {option.price.toFixed(2)}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) =>
                        setSelectedAddOnNames((current) =>
                          event.target.checked
                            ? [...current, option.name]
                            : current.filter((name) => name !== option.name),
                        )
                      }
                    />
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() =>
          addItem({
            id: buildCartItemId(product.id, selectedSize || null, chosenAddOns),
            productId: product.id,
            name: selectedSize ? `${product.name} (${selectedSize})` : product.name,
            price: unitPrice,
            selectedSize: selectedSize || undefined,
            addOns: chosenAddOns,
          })
        }
        className="mt-5 inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
      >
        <ShoppingBag className="mr-2 size-4" />
        Add to cart
      </button>
    </article>
  );
}
