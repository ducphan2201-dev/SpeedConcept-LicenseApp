This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Neon + Prisma

This project uses Neon as the PostgreSQL backend for licensing data.

### Required environment variables

- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_BASIC_USER`
- `ADMIN_BASIC_PASS`
- `JWT_PRIVATE_KEY_PEM`
- `JWT_PUBLIC_KEY_PEM`

### Setup

1. Create a Neon project and copy the pooled connection string into `DATABASE_URL`.
2. Copy the direct connection string into `DIRECT_URL`.
3. Run `npm install`.
4. Apply the initial schema with `npm run db:migrate`.
5. Run `npm run build` before deploying.

### One-command bootstrap

If the env vars are already set, you can run the full setup in one shot:

```powershell
.\scripts\bootstrap-neon.ps1
```

To include dependency install:

```powershell
.\scripts\bootstrap-neon.ps1 -InstallDependencies
```

### Notes

- `DATABASE_URL` is used by the app at runtime.
- `DIRECT_URL` is used by Prisma migrations.
- The initial Prisma migration lives in `prisma/migrations/20260415000000_init/migration.sql`.

## Bắt đầu nhanh

Nếu bạn chỉ muốn làm nhanh, mở file này:

- [DEPLOY_NOW.md](./DEPLOY_NOW.md)
