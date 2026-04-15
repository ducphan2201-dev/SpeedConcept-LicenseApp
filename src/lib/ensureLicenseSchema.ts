import prisma from '@/lib/prisma';

let schemaReady: Promise<void> | null = null;

export function ensureLicenseSchema() {
    if (!schemaReady) {
        schemaReady = (async () => {
            await prisma.$executeRawUnsafe(`
                CREATE TABLE IF NOT EXISTS "LicenseKey" (
                    "id" TEXT NOT NULL,
                    "key" TEXT NOT NULL,
                    "duration" INTEGER NOT NULL,
                    "machineIds" TEXT NOT NULL DEFAULT '[]',
                    "isActivated" BOOLEAN NOT NULL DEFAULT false,
                    "activatedAt" TIMESTAMP(3),
                    "expiresAt" TIMESTAMP(3),
                    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT "LicenseKey_pkey" PRIMARY KEY ("id")
                )
            `);

            await prisma.$executeRawUnsafe(`
                CREATE UNIQUE INDEX IF NOT EXISTS "LicenseKey_key_key" ON "LicenseKey"("key")
            `);
        })();
    }

    return schemaReady;
}
