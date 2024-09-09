-- CreateTable
CREATE TABLE "cartItem" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cartItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cartItem" ADD CONSTRAINT "fk_cart_item_cart" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartItem" ADD CONSTRAINT "fk_cart_item_product" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
