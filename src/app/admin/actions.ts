"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/src/lib/db";
import {
  buildAddOnOptions,
  buildSizeOptions,
  getCategoryLabel,
  getPrimaryImageUrl,
  parseJsonArray,
  type ProductAddOnOption,
  type ProductCategoryValue,
  type ProductSizeName,
  type ProductSizeOption,
} from "@/src/lib/product-catalog";
import { getAdminMetrics, type AdminMetrics } from "@/src/app/admin/analytics";

type AdminCredentials = {
  username: string;
  password: string;
};

export type AdminProductRecord = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageUrls: string[];
  category: ProductCategoryValue;
  categoryLabel: string;
  sizeOptions: ProductSizeOption[];
  addOnOptions: ProductAddOnOption[];
  isActive: boolean;
  createdAt: string;
};

export type AdminOverview = {
  metrics: AdminMetrics;
  products: AdminProductRecord[];
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  category: ProductCategoryValue;
  imageUrls: string[];
  sizePrices: Partial<Record<ProductSizeName, number>>;
  espressoShotPrice: number;
  syrupPrice: number;
};

function isValidAdminCredentials(credentials: AdminCredentials): boolean {
  return (
    credentials.username === process.env.ADMIN_USERNAME &&
    credentials.password === process.env.ADMIN_PASSWORD
  );
}

function normalizeUrlList(imageUrls: string[]): string[] {
  return imageUrls
    .map((value) => value.trim())
    .filter(Boolean);
}

function mapProductRecord(product: {
  id: string;
  name: string;
  description: string;
  price: { toString(): string } | number;
  imageUrl: string;
  imageUrls: unknown;
  category: ProductCategoryValue;
  sizeOptions: unknown;
  addOnOptions: unknown;
  isActive: boolean;
  createdAt: Date;
}): AdminProductRecord {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    imageUrl: getPrimaryImageUrl(product),
    imageUrls: parseJsonArray<string>(product.imageUrls),
    category: product.category,
    categoryLabel: getCategoryLabel(product.category),
    sizeOptions: parseJsonArray<ProductSizeOption>(product.sizeOptions),
    addOnOptions: parseJsonArray<ProductAddOnOption>(product.addOnOptions),
    isActive: product.isActive,
    createdAt: product.createdAt.toISOString(),
  };
}

async function getAdminProducts(): Promise<AdminProductRecord[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return products.map(mapProductRecord);
}

export async function authenticateAdmin(username: string, password: string): Promise<boolean> {
  return isValidAdminCredentials({ username, password });
}

export async function getAdminOverview(
  credentials: AdminCredentials,
): Promise<
  | { success: true; data: AdminOverview }
  | { success: false; error: string }
> {
  if (!isValidAdminCredentials(credentials)) {
    return {
      success: false,
      error: "Invalid credentials.",
    };
  }

  const [metrics, products] = await Promise.all([
    getAdminMetrics(),
    getAdminProducts(),
  ]);

  return {
    success: true,
    data: {
      metrics,
      products,
    },
  };
}

export async function createAdminProduct(
  credentials: AdminCredentials,
  input: CreateProductInput,
): Promise<
  | {
      success: true;
      product: AdminProductRecord;
      metrics: AdminMetrics;
    }
  | { success: false; error: string }
> {
  if (!isValidAdminCredentials(credentials)) {
    return {
      success: false,
      error: "Unauthorized request.",
    };
  }

  const name = input.name.trim();
  const description = input.description.trim();
  const imageUrls = normalizeUrlList(input.imageUrls);
  const price = Number(input.price);
  const espressoShotPrice = Number(input.espressoShotPrice);
  const syrupPrice = Number(input.syrupPrice);

  if (!name || !description) {
    return {
      success: false,
      error: "Name and description are required.",
    };
  }

  if (!Number.isFinite(price) || price <= 0) {
    return {
      success: false,
      error: "Base price must be greater than zero.",
    };
  }

  if (imageUrls.length === 0) {
    return {
      success: false,
      error: "Add at least one image URL.",
    };
  }

  const sizeOptions = buildSizeOptions(input.category, input.sizePrices);
  if (sizeOptions.some((option) => !Number.isFinite(option.price) || option.price <= 0)) {
    return {
      success: false,
      error: "Every visible size needs a valid price.",
    };
  }

  const addOnOptions = buildAddOnOptions(
    input.category,
    espressoShotPrice,
    syrupPrice,
  );
  if (
    addOnOptions.some((option) => !Number.isFinite(option.price) || option.price < 0)
  ) {
    return {
      success: false,
      error: "Add-on prices must be zero or greater.",
    };
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      imageUrl: imageUrls[0],
      imageUrls,
      category: input.category,
      sizeOptions,
      addOnOptions,
      isActive: true,
    },
  });

  revalidatePath("/menu");
  revalidatePath("/admin");

  return {
    success: true,
    product: mapProductRecord(product),
    metrics: await getAdminMetrics(),
  };
}
