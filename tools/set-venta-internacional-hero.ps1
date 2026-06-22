param(
  [Parameter(Mandatory = $true)]
  [string]$ImagePath
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$source = Resolve-Path $ImagePath
$assetName = "articulo-venta-internacional-hero.png"
$destination = Join-Path $projectRoot "assets\$assetName"

$allowedExtensions = @(".png", ".jpg", ".jpeg", ".webp")
$extension = [System.IO.Path]::GetExtension($source.Path).ToLowerInvariant()
if ($allowedExtensions -notcontains $extension) {
  throw "Formato no admitido. Usa PNG, JPG, JPEG o WEBP."
}

Copy-Item -LiteralPath $source.Path -Destination $destination -Force

$version = "venta-hero-" + (Get-Date -Format "yyyyMMddHHmmss")
Get-ChildItem -Path $projectRoot -Recurse -Filter *.html | ForEach-Object {
  $path = $_.FullName
  $text = Get-Content -LiteralPath $path -Raw -Encoding UTF8
  $text = $text -replace 'style\.css(?:\?v=[^"'' ]+)?', "style.css?v=$version"
  $text = $text -replace 'script\.js(?:\?v=[^"'' ]+)?', "script.js?v=$version"
  Set-Content -LiteralPath $path -Value $text -Encoding UTF8 -NoNewline
}

Write-Host "Imagen instalada como assets/$assetName"
Write-Host "Version actualizada: $version"
