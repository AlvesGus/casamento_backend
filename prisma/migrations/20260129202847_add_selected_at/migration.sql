-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "selected_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_selected_by_id_fkey" FOREIGN KEY ("selected_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
