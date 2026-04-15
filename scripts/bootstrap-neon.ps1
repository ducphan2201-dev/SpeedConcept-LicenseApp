param(
    [switch]$InstallDependencies,
    [string]$DatabaseUrl = $env:DATABASE_URL,
    [string]$DirectUrl = $env:DIRECT_URL,
    [string]$AdminUser = $env:ADMIN_BASIC_USER,
    [string]$AdminPass = $env:ADMIN_BASIC_PASS,
    [string]$JwtPrivateKey = $env:JWT_PRIVATE_KEY_PEM,
    [string]$JwtPublicKey = $env:JWT_PUBLIC_KEY_PEM
)

$ErrorActionPreference = 'Stop'

function Test-Required([string]$Name, [string]$Value) {
    if ([string]::IsNullOrWhiteSpace($Value)) {
        throw "Missing required env var: $Name"
    }
}

Test-Required 'DATABASE_URL' $DatabaseUrl
Test-Required 'DIRECT_URL' $DirectUrl
Test-Required 'ADMIN_BASIC_USER' $AdminUser
Test-Required 'ADMIN_BASIC_PASS' $AdminPass
Test-Required 'JWT_PRIVATE_KEY_PEM' $JwtPrivateKey
Test-Required 'JWT_PUBLIC_KEY_PEM' $JwtPublicKey

$env:DATABASE_URL = $DatabaseUrl
$env:DIRECT_URL = $DirectUrl
$env:ADMIN_BASIC_USER = $AdminUser
$env:ADMIN_BASIC_PASS = $AdminPass
$env:JWT_PRIVATE_KEY_PEM = $JwtPrivateKey
$env:JWT_PUBLIC_KEY_PEM = $JwtPublicKey

if ($InstallDependencies) {
    npm install
}

npm run db:generate
npm run db:migrate
npm run build
