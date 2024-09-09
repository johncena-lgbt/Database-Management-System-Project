/*
  Warnings:

  - You are about to drop the `cartItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cartItem" DROP CONSTRAINT "fk_cart_item_cart";

-- DropForeignKey
ALTER TABLE "cartItem" DROP CONSTRAINT "fk_cart_item_product";

-- DropTable
DROP TABLE "cartItem";

-- CreateTable
CREATE TABLE "cart_item" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "fk_cart_item_cart" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "fk_cart_item_product" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
