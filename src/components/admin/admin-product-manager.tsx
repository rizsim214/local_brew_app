"use client";

import { useState } from "react";

import {
  PRODUCT_CATEGORY_OPTIONS,
  categorySupportsAddOns,
  getSizeNamesForCategory,
  type ProductCategoryValue,
  type ProductSizeName,
} from "@/src/lib/product-catalog";
import {
  createAdminProduct,
  type AdminProductRecord,
  type CreateProductInput,
} from "@/src/app/admin/actions";

type AdminProductManagerProps = {
  credentials: {
    username: string;
    password: string;
  };
  products: AdminProductRecord[];
  onProductCreated: (product: AdminProductRecord) => void;
};

const DEFAULT_CATEGORY: ProductCategoryValue = "HOT_ESPRESSO";

export function AdminProductManager({
  credentials,
  products,
  onProductCreated,
}: Readonly<AdminProductManagerProps>) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<ProductCategoryValue>(DEFAULT_CATEGORY);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [sizePrices, setSizePrices] = useState<Partial<Record<ProductSizeName, string>>>({
    Small: "",
    Medium: "",
    Large: "",
  });
  const [espressoShotPrice, setEspressoShotPrice] = useState("25");
  const [syrupPrice, setSyrupPrice] = useState("20");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sizeNames = getSizeNamesForCategory(category);
  const supportsAddOns = categorySupportsAddOns(category);

  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setCategory(DEFAULT_CATEGORY);
    setImageUrlInput("");
    setSizePrices({ Small: "", Medium: "", Large: "" });
    setEspressoShotPrice("25");
    setSyrupPrice("20");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);

    const payload: CreateProductInput = {
      name,
      description,
      price: Number(price),
      category,
      imageUrls: imageUrlInput
        .split(/\r?\n|,/)
        .map((value) => value.trim())
        .filter(Boolean),
      sizePrices: {
        Small: Number(sizePrices.Small),
        Medium: Number(sizePrices.Medium),
        Large: Number(sizePrices.Large),
      },
      espressoShotPrice: Number(espressoShotPrice),
      syrupPrice: Number(syrupPrice),
    };

    const result = await createAdminProduct(credentials, payload);

    if (!result.success) {
      setError(result.error);
      setPending(false);
      return;
    }

    onProductCreated(result.product);
    setMessage(`${result.product.name} added to the menu.`);
    resetForm();
    setPending(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Catalog</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Add a product</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Build drinks, pastries, and sandwiches with category-based sizes and coffee add-ons.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="productName" className="mb-1 block text-sm font-medium text-foreground">
                Name
              </label>
              <input
                id="productName"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Spanish latte"
              />
            </div>
            <div>
              <label htmlFor="productCategory" className="mb-1 block text-sm font-medium text-foreground">
                Category
              </label>
              <select
                id="productCategory"
                value={category}
                onChange={(event) => setCategory(event.target.value as ProductCategoryValue)}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {PRODUCT_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="productDescription" className="mb-1 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="productDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Velvety espresso with condensed milk and a creamy finish."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="basePrice" className="mb-1 block text-sm font-medium text-foreground">
                Base price
              </label>
              <input
                id="basePrice"
                type="number"
                min="1"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="140"
              />
            </div>
            <div>
              <label htmlFor="imageUrls" className="mb-1 block text-sm font-medium text-foreground">
                Image URLs
              </label>
              <textarea
                id="imageUrls"
                value={imageUrlInput}
                onChange={(event) => setImageUrlInput(event.target.value)}
                rows={2}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="One URL per line or comma-separated"
              />
            </div>
          </div>

          {sizeNames.length > 0 ? (
            <div className="rounded-2xl border border-border bg-background/60 p-4">
              <p className="text-sm font-medium text-foreground">Size pricing</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {sizeNames.map((sizeName) => (
                  <div key={sizeName}>
                    <label htmlFor={`size-${sizeName}`} className="mb-1 block text-sm text-muted-foreground">
                      {sizeName}
                    </label>
                    <input
                      id={`size-${sizeName}`}
                      type="number"
                      min="1"
                      step="0.01"
                      value={sizePrices[sizeName] ?? ""}
                      onChange={(event) =>
                        setSizePrices((current) => ({
                          ...current,
                          [sizeName]: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder={sizeName === "Large" ? "180" : "150"}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {supportsAddOns ? (
            <div className="rounded-2xl border border-border bg-background/60 p-4">
              <p className="text-sm font-medium text-foreground">Add-on pricing</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="espressoShotPrice" className="mb-1 block text-sm text-muted-foreground">
                    Espresso shot
                  </label>
                  <input
                    id="espressoShotPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={espressoShotPrice}
                    onChange={(event) => setEspressoShotPrice(event.target.value)}
                    className="w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="syrupPrice" className="mb-1 block text-sm text-muted-foreground">
                    Syrups
                  </label>
                  <input
                    id="syrupPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={syrupPrice}
                    onChange={(event) => setSyrupPrice(event.target.value)}
                    className="w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {pending ? "Saving product..." : "Add product"}
          </button>
        </form>
      </div>

      <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Menu inventory</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">Products</h2>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {products.length} item{products.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background/70 p-4 text-sm text-muted-foreground">
              No products yet. Use the form to publish your first item.
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="rounded-[1.25rem] border border-border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {product.categoryLabel}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">{product.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border border-border px-3 py-1">
                    PHP {product.price.toFixed(2)}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1">
                    {product.imageUrls.length} image URL{product.imageUrls.length === 1 ? "" : "s"}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1">
                    {product.sizeOptions.length} size option{product.sizeOptions.length === 1 ? "" : "s"}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1">
                    {product.addOnOptions.length} add-on{product.addOnOptions.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
