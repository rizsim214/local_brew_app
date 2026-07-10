"use server";

import { prisma } from "@/src/lib/db";
import {
  parseJsonArray,
  type ProductAddOnOption,
  type ProductSizeOption,
} from "@/src/lib/product-catalog";

interface CheckoutInput {
  customerName: string;
  items: Array<{
    productId: string;
    quantity: number;
    selectedSize?: string;
    selectedAddOns?: ProductAddOnOption[];
  }>;
}

export async function createOrder(input: CheckoutInput) {
  try {
    const normalizedName = input.customerName?.trim();
    const validItems = (input.items ?? []).filter(
      (item) =>
        typeof item?.productId === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );

    if (!normalizedName || validItems.length === 0) {
      throw new Error("Please provide a valid name and at least one item.");
    }

    const productIds = [...new Set(validItems.map((item) => item.productId))];
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (dbProducts.length !== productIds.length) {
      throw new Error("One or more selected items are no longer available.");
    }

    let total = 0;
    const transactionItems = validItems.map((item) => {
      const target = dbProducts.find((product) => product.id === item.productId);
      if (!target) {
        throw new Error(`Product reference ${item.productId} invalid.`);
      }

      const sizeOptions = parseJsonArray<ProductSizeOption>(target.sizeOptions);
      const addOnOptions = parseJsonArray<ProductAddOnOption>(target.addOnOptions);
      const selectedSizeOption = item.selectedSize
        ? sizeOptions.find((option) => option.name === item.selectedSize)
        : null;

      if (item.selectedSize && !selectedSizeOption) {
        throw new Error(`Selected size for ${target.name} is unavailable.`);
      }

      const selectedAddOns = (item.selectedAddOns ?? []).map((selectedAddOn) => {
        const matched = addOnOptions.find((option) => option.name === selectedAddOn.name);
        if (!matched) {
          throw new Error(`Selected add-on for ${target.name} is unavailable.`);
        }

        return matched;
      });

      const unitPrice =
        (selectedSizeOption?.price ?? Number(target.price)) +
        selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
      const itemTotal = unitPrice * item.quantity;
      total += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: unitPrice,
        selectedSize: item.selectedSize,
        selectedAddOns,
      };
    });

    const order = await prisma.order.create({
      data: {
        customerName: normalizedName,
        totalAmount: total,
        status: "PENDING",
        items: { create: transactionItems },
      },
      include: { items: { include: { product: true } } },
    });

    const itemSummary = order.items
      .map((item) => {
        const selectedAddOns = parseJsonArray<ProductAddOnOption>(item.selectedAddOns);
        const addOnSummary =
          selectedAddOns.length > 0
            ? ` + ${selectedAddOns.map((addOn) => addOn.name).join(", ")}`
            : "";
        const sizeSummary = item.selectedSize ? ` (${item.selectedSize})` : "";
        return `- ${item.product.name}${sizeSummary}${addOnSummary} x${item.quantity}`;
      })
      .join("\n");

    const messagePayload = `Hello Local Brew! I'd like to place an order.\n\nOrder ID: ${order.id}\nName: ${order.customerName}\n\nItems:\n${itemSummary}\n\nTotal: PHP ${total.toFixed(2)}`;

    return {
      success: true,
      orderId: order.id,
      redirectUrl: `https://m.me/localbrewpage?text=${encodeURIComponent(messagePayload)}`,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Execution exception error.";
    return {
      success: false,
      error: message,
    };
  }
}
