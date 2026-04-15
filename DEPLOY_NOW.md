# Bắt đầu ngay

Làm đúng 3 việc này:

1. Vào Neon, tạo 1 database mới.
2. Lấy 2 chuỗi kết nối và dán vào Vercel:
   - `DATABASE_URL`
   - `DIRECT_URL`
3. Dán thêm các giá trị sau vào Vercel:
   - `ADMIN_BASIC_USER`
   - `ADMIN_BASIC_PASS`
   - `JWT_PRIVATE_KEY_PEM`
   - `JWT_PUBLIC_KEY_PEM`

Sau đó:

1. Push code lên GitHub.
2. Vercel tự lấy code mới.
3. Vercel tự build và deploy lại.

Nếu chạy local:

```powershell
.\scripts\bootstrap-neon.ps1 -InstallDependencies
```

PhiÃªn báº£n theo [RULE.md](../RULE.md): `1.0` lÃ  báº£n Ä‘áº§u, cáº­p nháº­t nhá» tÄƒng `1.1`, `1.2`, `1.3`, `1.4`, ... vÃ  tÃ­nh nÄƒng lá»›n tÄƒng `2.0`, `3.0`, ...
