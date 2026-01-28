-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Cozinha', 'Sala', 'Ferramentas', 'Banheiro', 'Outros');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "suggestion_price" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "link_shopee" TEXT NOT NULL,
    "category_product" "Category" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_category_product_idx" ON "Product"("category_product");

-- CreateIndex
CREATE INDEX "Product_is_active_idx" ON "Product"("is_active");
