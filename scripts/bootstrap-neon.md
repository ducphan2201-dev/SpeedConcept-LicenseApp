# Bootstrap Neon

Run the whole licensing stack from a clean environment:

```powershell
.\scripts\bootstrap-neon.ps1
```

Optional install step:

```powershell
.\scripts\bootstrap-neon.ps1 -InstallDependencies
```

Required variables can be passed as parameters or inherited from the environment:

- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_BASIC_USER`
- `ADMIN_BASIC_PASS`
- `JWT_PRIVATE_KEY_PEM`
- `JWT_PUBLIC_KEY_PEM`
