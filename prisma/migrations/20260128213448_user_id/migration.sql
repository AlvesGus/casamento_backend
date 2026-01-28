-- DropIndex
DROP INDEX "Product_category_product_idx";

-- DropIndex
DROP INDEX "Product_is_active_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "selected_by_id" TEXT;
