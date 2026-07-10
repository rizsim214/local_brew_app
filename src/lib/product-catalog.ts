export const PRODUCT_CATEGORY_OPTIONS = [
  { value: "HOT_ESPRESSO", label: "Hot espresso" },
  { value: "COLD_ESPRESSO", label: "Cold espresso" },
  { value: "PASTRY", label: "Pastry" },
  { value: "SANDWICH", label: "Sandwich" },
] as const;

export type ProductCategoryValue = (typeof PRODUCT_CATEGORY_OPTIONS)[number]["value"];
export type ProductSizeName = "Small" | "Medium" | "Large";

export type ProductSizeOption = {
  name: ProductSizeName;
  price: number;
};

export type ProductAddOnOption = {
  name: string;
  price: number;
};

type ProductWithMedia = {
  imageUrl: string;
  imageUrls?: unknown;
};

const CATEGORY_LABELS: Record<ProductCategoryValue, string> = {
  HOT_ESPRESSO: "Hot espresso",
  COLD_ESPRESSO: "Cold espresso",
  PASTRY: "Pastry",
  SANDWICH: "Sandwich",
};

export function getCategoryLabel(category: ProductCategoryValue): string {
  return CATEGORY_LABELS[category];
}

export function getSizeNamesForCategory(category: ProductCategoryValue): ProductSizeName[] {
  if (category === "HOT_ESPRESSO") {
    return ["Small", "Medium"];
  }

  if (category === "COLD_ESPRESSO") {
    return ["Small", "Medium", "Large"];
  }

  return [];
}

export function categorySupportsAddOns(category: ProductCategoryValue): boolean {
  return category === "HOT_ESPRESSO" || category === "COLD_ESPRESSO";
}

export function parseJsonArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function getPrimaryImageUrl(product: ProductWithMedia): string {
  return parseJsonArray<string>(product.imageUrls)[0] || product.imageUrl;
}

export function buildSizeOptions(
  category: ProductCategoryValue,
  prices: Partial<Record<ProductSizeName, number>>,
): ProductSizeOption[] {
  return getSizeNamesForCategory(category).map((name) => ({
    name,
    price: prices[name] ?? 0,
  }));
}

export function buildAddOnOptions(
  category: ProductCategoryValue,
  espressoShotPrice: number,
  syrupPrice: number,
): ProductAddOnOption[] {
  if (!categorySupportsAddOns(category)) {
    return [];
  }

  return [
    { name: "Espresso shot", price: espressoShotPrice },
    { name: "Vanilla syrup", price: syrupPrice },
    { name: "Caramel syrup", price: syrupPrice },
    { name: "Hazelnut syrup", price: syrupPrice },
  ];
}

export function buildCartItemId(
  productId: string,
  selectedSize: string | null,
  addOns: ProductAddOnOption[],
): string {
  const addOnKey = addOns
    .map((addOn) => addOn.name)
    .sort()
    .join("|");

  return [productId, selectedSize || "default", addOnKey || "plain"].join("::");
}
