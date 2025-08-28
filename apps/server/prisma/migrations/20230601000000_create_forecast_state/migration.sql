-- CreateTable
CREATE TABLE "forecast_state" (
    "id" SERIAL NOT NULL,
    "site_id" INTEGER NOT NULL,
    "equipment_type" TEXT NOT NULL,
    "model_state" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forecast_state_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forecast_state_site_id_equipment_type_key" ON "forecast_state"("site_id", "equipment_type");