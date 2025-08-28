/*
  Warnings:

  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `equipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `maintenance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `operators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rentals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `revenue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `telemetry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `weather_cache` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "maintenance" DROP CONSTRAINT "maintenance_equipment_id_fkey";

-- DropForeignKey
ALTER TABLE "rentals" DROP CONSTRAINT "rentals_company_id_fkey";

-- DropForeignKey
ALTER TABLE "rentals" DROP CONSTRAINT "rentals_equipment_id_fkey";

-- DropForeignKey
ALTER TABLE "rentals" DROP CONSTRAINT "rentals_operator_id_fkey";

-- DropForeignKey
ALTER TABLE "rentals" DROP CONSTRAINT "rentals_site_id_fkey";

-- DropForeignKey
ALTER TABLE "revenue" DROP CONSTRAINT "revenue_equipment_id_fkey";

-- DropForeignKey
ALTER TABLE "revenue" DROP CONSTRAINT "revenue_rental_id_fkey";

-- DropForeignKey
ALTER TABLE "telemetry" DROP CONSTRAINT "telemetry_equipment_id_fkey";

-- DropForeignKey
ALTER TABLE "weather_cache" DROP CONSTRAINT "weather_cache_site_id_fkey";

-- DropTable
DROP TABLE "companies";

-- DropTable
DROP TABLE "equipment";

-- DropTable
DROP TABLE "maintenance";

-- DropTable
DROP TABLE "operators";

-- DropTable
DROP TABLE "rentals";

-- DropTable
DROP TABLE "revenue";

-- DropTable
DROP TABLE "sites";

-- DropTable
DROP TABLE "telemetry";

-- DropTable
DROP TABLE "weather_cache";

-- CreateTable
CREATE TABLE "Equipment" (
    "equipment_id" SERIAL NOT NULL,
    "equipment_code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "site_id" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'idle',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("equipment_id")
);

-- CreateTable
CREATE TABLE "Site" (
    "site_id" SERIAL NOT NULL,
    "site_code" TEXT NOT NULL,
    "site_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("site_id")
);

-- CreateTable
CREATE TABLE "Operator" (
    "operator_id" SERIAL NOT NULL,
    "operator_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("operator_id")
);

-- CreateTable
CREATE TABLE "Company" (
    "company_id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "reliability_score" INTEGER NOT NULL DEFAULT 100,
    "past_delays_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "rental_id" SERIAL NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "site_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "operator_id" INTEGER NOT NULL,
    "check_out_date" TIMESTAMP(3) NOT NULL,
    "check_in_date" TIMESTAMP(3),
    "expected_return_date" TIMESTAMP(3) NOT NULL,
    "engine_hours_per_day" DOUBLE PRECISION,
    "idle_hours_per_day" DOUBLE PRECISION,
    "operating_days" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("rental_id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "maintenance_id" SERIAL NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL,
    "service_type" TEXT NOT NULL,
    "issue_reported" TEXT,
    "downtime_days" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("maintenance_id")
);

-- CreateTable
CREATE TABLE "Revenue" (
    "revenue_id" SERIAL NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "rental_id" INTEGER NOT NULL,
    "rental_rate" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Revenue_pkey" PRIMARY KEY ("revenue_id")
);

-- CreateTable
CREATE TABLE "WeatherCache" (
    "id" SERIAL NOT NULL,
    "site_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "temp_c" DOUBLE PRECISION,
    "precipitation_mm" DOUBLE PRECISION,
    "wind_kph" DOUBLE PRECISION,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeatherCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telemetry" (
    "id" SERIAL NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "engine_rpm" INTEGER,
    "fuel_rate_lph" DOUBLE PRECISION,
    "gps_lat" DOUBLE PRECISION,
    "gps_lng" DOUBLE PRECISION,
    "is_idle" BOOLEAN,

    CONSTRAINT "Telemetry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_equipment_code_key" ON "Equipment"("equipment_code");

-- CreateIndex
CREATE UNIQUE INDEX "Site_site_code_key" ON "Site"("site_code");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_operator_code_key" ON "Operator"("operator_code");

-- CreateIndex
CREATE UNIQUE INDEX "Revenue_rental_id_key" ON "Revenue"("rental_id");

-- CreateIndex
CREATE UNIQUE INDEX "WeatherCache_site_id_date_key" ON "WeatherCache"("site_id", "date");

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("site_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operator" ADD CONSTRAINT "Operator_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("site_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "Operator"("operator_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "Rental"("rental_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeatherCache" ADD CONSTRAINT "WeatherCache_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("site_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telemetry" ADD CONSTRAINT "Telemetry_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;
