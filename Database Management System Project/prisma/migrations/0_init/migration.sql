-- CreateTable
CREATE TABLE "favourites" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" DATE DEFAULT CURRENT_DATE,
    "updated_at" DATE DEFAULT CURRENT_DATE,

    CONSTRAINT "favourites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "dob" DATE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" INTEGER NOT NULL,
    "gender" CHAR(1) NOT NULL,
    "last_login_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "clv" DECIMAL(10,3),
    "running_total_spending" DECIMAL(10,3),
    "total_spending" DECIMAL(10,3),

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25),

    CONSTRAINT "member_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" TEXT,
    "unit_price" DECIMAL NOT NULL,
    "stock_quantity" DECIMAL NOT NULL DEFAULT 0,
    "country" VARCHAR(100),
    "product_type" VARCHAR(50),
    "image_url" VARCHAR(255) DEFAULT '/images/product.png',
    "manufactured_on" TIMESTAMP(6),

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "review_id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "sale_order_item_id" INTEGER NOT NULL,
    "rating" INTEGER,
    "review_text" TEXT,
    "created_at" DATE DEFAULT CURRENT_DATE,
    "updated_at" DATE DEFAULT CURRENT_DATE,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "sale_order" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER,
    "order_datetime" TIMESTAMP(6) NOT NULL,
    "status" VARCHAR(10),

    CONSTRAINT "sale_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_order_item" (
    "id" SERIAL NOT NULL,
    "sale_order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" DECIMAL NOT NULL,

    CONSTRAINT "sale_order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier" (
    "id" SERIAL NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "descriptor" TEXT,
    "address" VARCHAR(255),
    "country" VARCHAR(100) NOT NULL,
    "contact_email" VARCHAR(50) NOT NULL,
    "company_url" VARCHAR(255),
    "founded_date" DATE,
    "staff_size" INTEGER,
    "specialization" VARCHAR(100),
    "is_active" BOOLEAN,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favourites_member_id_product_id_key" ON "favourites"("member_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_username_key" ON "member"("username");

-- CreateIndex
CREATE UNIQUE INDEX "member_email_key" ON "member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_member_id_product_id_sale_order_item_id_key" ON "reviews"("member_id", "product_id", "sale_order_item_id");

-- AddForeignKey
ALTER TABLE "favourites" ADD CONSTRAINT "fk_member" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favourites" ADD CONSTRAINT "fk_product" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "fk_member_role_id" FOREIGN KEY ("role") REFERENCES "member_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_sale_order_item_id_fkey" FOREIGN KEY ("sale_order_item_id") REFERENCES "sale_order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sale_order" ADD CONSTRAINT "fk_sale_order_member" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sale_order_item" ADD CONSTRAINT "fk_sale_order_item_product" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sale_order_item" ADD CONSTRAINT "fk_sale_order_item_sale_order" FOREIGN KEY ("sale_order_id") REFERENCES "sale_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

