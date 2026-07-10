"use server";

import { prisma } from "@/src/lib/db";

interface CheckoutInput {
  customerName: string;
  items: { id: string; quantity: number }[];
}

export async function createOrder(input: CheckoutInput) {
  try {
    const normalizedName = input.customerName?.trim();
    const validItems = input.items?.filter(
      (item) =>
        typeof item?.id === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );

    if (!normalizedName || validItems.length === 0) {
      throw new Error("Please provide a valid name and at least one item.");
    }

    const productIds = [...new Set(validItems.map((item) => item.id))];
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (dbProducts.length !== productIds.length) {
      throw new Error("One or more selected items are no longer available.");
    }

    let total = 0;
    const transactionItems = validItems.map((item) => {
      const target = dbProducts.find((product) => product.id === item.id);
      if (!target) {
        throw new Error(`Product reference ${item.id} invalid.`);
      }

      const itemTotal = Number(target.price) * item.quantity;
      total += itemTotal;

      return {
        productId: item.id,
        quantity: item.quantity,
        price: target.price,
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
      .map((item) => `- ${item.product.name} x${item.quantity}`)
      .join("\n");

    const messagePayload = `Hello Local Brew! I'd like to place an order.\n\nOrder ID: ${order.id}\nName: ${order.customerName}\n\nItems:\n${itemSummary}\n\nTotal: ₱${total.toFixed(2)}`;

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
