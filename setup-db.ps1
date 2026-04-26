param(
    [string]$HostName = "localhost",
    [int]$Port = 5432,
    [string]$Database = "db_reservify",
    [string]$User = "postgres",
    [string]$Password = "",
    [switch]$WithSeed,
    [switch]$IncludeMigrations
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "[setup-db] $Message" -ForegroundColor Cyan
}

function Resolve-PsqlPath {
    $cmd = Get-Command "psql" -ErrorAction SilentlyContinue
    if ($cmd) {
        return $cmd.Source
    }

    $candidatePaths = @()

    if ($env:ProgramFiles) {
        $candidatePaths += Join-Path $env:ProgramFiles "PostgreSQL"
    }
    if (${env:ProgramFiles(x86)}) {
        $candidatePaths += Join-Path ${env:ProgramFiles(x86)} "PostgreSQL"
    }

    foreach ($basePath in $candidatePaths) {
        if (-not (Test-Path $basePath)) {
            continue
        }

        $found = Get-ChildItem -Path $basePath -Filter "psql.exe" -Recurse -File -ErrorAction SilentlyContinue |
            Sort-Object FullName -Descending |
            Select-Object -First 1

        if ($found) {
            return $found.FullName
        }
    }

    throw "No se encontro 'psql'. Agrega PostgreSQL\bin al PATH o instala PostgreSQL client."
}

function Invoke-SqlFile {
    param(
        [string]$FilePath,
        [string]$ConnectionString,
        [string]$PsqlPath
    )

    Write-Step "Ejecutando: $FilePath"
    & $PsqlPath $ConnectionString -v ON_ERROR_STOP=1 -f $FilePath
    if ($LASTEXITCODE -ne 0) {
        throw "Fallo al ejecutar: $FilePath"
    }
}

$psqlPath = Resolve-PsqlPath
Write-Step "Usando psql en: $psqlPath"

$projectRoot = $PSScriptRoot
$dbRoot = Join-Path $projectRoot "db"

if (-not (Test-Path $dbRoot)) {
    throw "No se encontro la carpeta db en: $dbRoot"
}

$connectionString = "postgresql://$User@$HostName`:$Port/$Database"

if (-not [string]::IsNullOrWhiteSpace($Password)) {
    $env:PGPASSWORD = $Password
}

# Evita errores de conversion WIN1252 -> UTF8 al ejecutar scripts SQL.
$previousClientEncoding = $env:PGCLIENTENCODING
$env:PGCLIENTENCODING = "UTF8"

$baseFiles = @(
    (Join-Path $dbRoot "creacion_tablas.sql"),
    (Join-Path $dbRoot "auditoria.sql")
)

foreach ($baseFile in $baseFiles) {
    if (-not (Test-Path $baseFile)) {
        throw "No se encontro archivo requerido: $baseFile"
    }
}

$functionFiles = @()
$functionsRoot = Join-Path $dbRoot "scripts\funciones"
if (Test-Path $functionsRoot) {
    $functionFiles = Get-ChildItem -Path $functionsRoot -Filter "*.sql" -Recurse -File |
        Sort-Object FullName |
        Select-Object -ExpandProperty FullName
}

$extensionFiles = @()
$extensionsRoot = Join-Path $dbRoot "scripts\extenciones"
if (Test-Path $extensionsRoot) {
    $extensionFiles = Get-ChildItem -Path $extensionsRoot -Filter "*.sql" -Recurse -File |
        Sort-Object FullName |
        Select-Object -ExpandProperty FullName
}

$migrationFiles = @()
if ($IncludeMigrations) {
    $migrationsRoot = Join-Path $dbRoot "scripts\migrations"
    if (Test-Path $migrationsRoot) {
        $migrationFiles = Get-ChildItem -Path $migrationsRoot -Filter "*.sql" -Recurse -File |
            Sort-Object FullName |
            Select-Object -ExpandProperty FullName
    }
}

$seedFiles = @()
if ($WithSeed) {
    $seedPath = Join-Path $dbRoot "scripts\poblar_tablas.sql"
    if (-not (Test-Path $seedPath)) {
        throw "Pediste -WithSeed pero no existe: $seedPath"
    }
    $seedFiles = @($seedPath)
}

$executionPlan = @()
$executionPlan += $baseFiles
$executionPlan += $extensionFiles
$executionPlan += $functionFiles
$executionPlan += $migrationFiles
$executionPlan += $seedFiles

if ($executionPlan.Count -eq 0) {
    throw "No hay archivos SQL para ejecutar."
}

Write-Step "Iniciando creacion automatica de base de datos '$Database'..."
Write-Step "Total de scripts a ejecutar: $($executionPlan.Count)"

try {
    foreach ($file in $executionPlan) {
        Invoke-SqlFile -FilePath $file -ConnectionString $connectionString -PsqlPath $psqlPath
    }
    Write-Host "`nBase de datos creada/actualizada correctamente." -ForegroundColor Green
}
finally {
    if ($null -ne $previousClientEncoding) {
        $env:PGCLIENTENCODING = $previousClientEncoding
    }
    else {
        Remove-Item Env:PGCLIENTENCODING -ErrorAction SilentlyContinue
    }

    if (-not [string]::IsNullOrWhiteSpace($Password)) {
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
    }
}
