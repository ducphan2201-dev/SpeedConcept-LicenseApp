-- CreateTable
CREATE TABLE "LicenseKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "machineIds" TEXT NOT NULL DEFAULT '[]',
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LicenseKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LicenseKey_key_key" ON "LicenseKey"("key");
