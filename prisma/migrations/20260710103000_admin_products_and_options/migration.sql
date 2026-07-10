CREATE TYPE "ProductCategory" AS ENUM ('HOT_ESPRESSO', 'COLD_ESPRESSO', 'PASTRY', 'SANDWICH');

ALTER TABLE "Product"
ADD COLUMN "imageUrls" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "sizeOptions" JSONB,
ADD COLUMN "addOnOptions" JSONB;

UPDATE "Product"
SET "imageUrls" = jsonb_build_array("imageUrl")
WHERE "imageUrl" IS NOT NULL;

ALTER TABLE "Product"
ALTER COLUMN "category" TYPE "ProductCategory"
USING (
  CASE
    WHEN LOWER("category") IN ('hot espresso', 'espresso', 'hot coffee') THEN 'HOT_ESPRESSO'::"ProductCategory"
    WHEN LOWER("category") IN ('cold espresso', 'cold brew', 'iced coffee') THEN 'COLD_ESPRESSO'::"ProductCategory"
    WHEN LOWER("category") IN ('pastry', 'pastries') THEN 'PASTRY'::"ProductCategory"
    WHEN LOWER("category") IN ('sandwich', 'sandwiches') THEN 'SANDWICH'::"ProductCategory"
    ELSE 'HOT_ESPRESSO'::"ProductCategory"
  END
);

ALTER TABLE "OrderItem"
ADD COLUMN "selectedSize" TEXT,
ADD COLUMN "selectedAddOns" JSONB;
