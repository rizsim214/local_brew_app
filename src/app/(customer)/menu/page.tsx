import { prisma } from "@/src/lib/db";

import { MenuClient } from "@/src/components/customer/menu-client";

export default async function MenuPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return <MenuClient products={products} />;
}
