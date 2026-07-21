-- CreateTable
CREATE TABLE "core"."store_item" (
    "store_item_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "price" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_item_pkey" PRIMARY KEY ("store_item_id")
);

-- CreateTable
CREATE TABLE "core"."user_inventory" (
    "inventory_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "store_item_id" UUID NOT NULL,
    "acquired_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_inventory_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "core"."purchase_transaction" (
    "purchase_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "store_item_id" UUID NOT NULL,
    "credits_spent" INTEGER NOT NULL,
    "balance_before" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_transaction_pkey" PRIMARY KEY ("purchase_id")
);

-- CreateTable
CREATE TABLE "auth"."user_profile" (
    "id" UUID NOT NULL,
    "theme" VARCHAR(20) NOT NULL DEFAULT 'dark',
    "language" VARCHAR(10) NOT NULL DEFAULT 'es',
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "user_id" UUID NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."ai_prompt" (
    "prompt_id" UUID NOT NULL,
    "game_type" VARCHAR(50) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_prompt_pkey" PRIMARY KEY ("prompt_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_inventory_user_id_store_item_id_key" ON "core"."user_inventory"("user_id", "store_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_user_id_key" ON "auth"."user_profile"("user_id");

-- CreateIndex
CREATE INDEX "ai_prompt_game_type_category_is_active_idx" ON "core"."ai_prompt"("game_type", "category", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "ai_prompt_game_type_category_version_key" ON "core"."ai_prompt"("game_type", "category", "version");

-- AddForeignKey
ALTER TABLE "core"."user_inventory" ADD CONSTRAINT "user_inventory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_inventory" ADD CONSTRAINT "user_inventory_store_item_id_fkey" FOREIGN KEY ("store_item_id") REFERENCES "core"."store_item"("store_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."purchase_transaction" ADD CONSTRAINT "purchase_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."purchase_transaction" ADD CONSTRAINT "purchase_transaction_store_item_id_fkey" FOREIGN KEY ("store_item_id") REFERENCES "core"."store_item"("store_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_profile" ADD CONSTRAINT "user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
