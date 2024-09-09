-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_member_id_key" ON "cart"("member_id");

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "fk_cart_member" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
