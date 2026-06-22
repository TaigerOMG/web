param(
  [Parameter(Mandatory = $true)]
  [string]$InputFile
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$TemplateFile = Join-Path $Root "templates\property-page.html"
$RegistryFile = Join-Path $Root "data\properties.json"
$PropertiesDir = Join-Path $Root "data\properties"
$Languages = @("es", "en", "fr", "de", "ru")

function ConvertTo-PlainObject {
  param([Parameter(ValueFromPipeline = $true)]$Value)

  if ($null -eq $Value) { return $null }

  if ($Value -is [System.Management.Automation.PSCustomObject]) {
    $hash = [ordered]@{}
    foreach ($property in $Value.PSObject.Properties) {
      $hash[$property.Name] = ConvertTo-PlainObject $property.Value
    }
    return $hash
  }

  if ($Value -is [System.Collections.IEnumerable] -and $Value -isnot [string]) {
    $items = @()
    foreach ($item in $Value) {
      $items += ,(ConvertTo-PlainObject $item)
    }
    return $items
  }

  return $Value
}

function Get-ObjectProperty {
  param($Object, [string]$Name)
  if ($null -eq $Object) { return $null }
  if ($Object -is [hashtable] -or $Object -is [System.Collections.Specialized.OrderedDictionary]) {
    if ($Object.Contains($Name)) { return $Object[$Name] }
    return $null
  }
  return $Object.$Name
}

function Strip-Html {
  param([string]$Text)
  if ([string]::IsNullOrWhiteSpace($Text)) { return "" }
  return (($Text -replace "<[^>]+>", "") -replace "\s+", " ").Trim()
}

function Shorten {
  param([string]$Text, [int]$Length = 150)
  $clean = Strip-Html $Text
  if ($clean.Length -le $Length) { return $clean }
  return $clean.Substring(0, $Length).TrimEnd() + "..."
}

function Prepend-Unique {
  param($List, [string]$Id)
  $result = @($Id)
  foreach ($item in @($List)) {
    if ($item -and $item -ne $Id) { $result += $item }
  }
  return $result
}

if (!(Test-Path $InputFile)) {
  throw "No encuentro el archivo de entrada: $InputFile"
}

if (!(Test-Path $TemplateFile)) {
  throw "No encuentro la plantilla: $TemplateFile"
}

$draft = Get-Content -LiteralPath $InputFile -Raw -Encoding UTF8 | ConvertFrom-Json | ConvertTo-PlainObject
$id = Get-ObjectProperty $draft "id"
$route = Get-ObjectProperty $draft "route"
$image = Get-ObjectProperty $draft "image"
$types = Get-ObjectProperty $draft "types"
$translations = Get-ObjectProperty $draft "translations"
$es = Get-ObjectProperty $translations "es"

if ([string]::IsNullOrWhiteSpace($id)) { throw "Falta id." }
if ([string]::IsNullOrWhiteSpace($route)) { $route = "$id/" }
if ([string]::IsNullOrWhiteSpace($image)) { throw "Falta image." }
if (!$types -or @($types).Count -eq 0) { throw "Falta types." }
if (!$es) { throw "Falta translations.es." }
if ([string]::IsNullOrWhiteSpace((Get-ObjectProperty $es "title"))) { throw "Falta translations.es.title." }
if ([string]::IsNullOrWhiteSpace((Get-ObjectProperty $es "price"))) { throw "Falta translations.es.price." }
if (!(Get-ObjectProperty $es "description")) { throw "Falta translations.es.description." }

New-Item -ItemType Directory -Force -Path $PropertiesDir | Out-Null

$propertyTranslations = [ordered]@{}
foreach ($language in $Languages) {
  $text = Get-ObjectProperty $translations $language
  if (!$text) { $text = $es }
  $propertyTranslations[$language] = $text
}

$propertyJson = [ordered]@{
  media = Get-ObjectProperty $draft "media"
  translations = $propertyTranslations
}

$propertyFile = Join-Path $PropertiesDir "$id.json"
$propertyJson | ConvertTo-Json -Depth 60 | Set-Content -LiteralPath $propertyFile -Encoding UTF8

$registry = Get-Content -LiteralPath $RegistryFile -Raw -Encoding UTF8 | ConvertFrom-Json | ConvertTo-PlainObject
$registryProperties = @()
foreach ($property in @($registry["properties"])) {
  if ((Get-ObjectProperty $property "id") -ne $id) { $registryProperties += $property }
}

$cardInput = Get-ObjectProperty $draft "card"
$cardTranslations = [ordered]@{}
foreach ($language in $Languages) {
  $propertyText = $propertyTranslations[$language]
  $cardText = Get-ObjectProperty $cardInput $language
  if (!$cardText) { $cardText = Get-ObjectProperty $cardInput "es" }

  $description = Get-ObjectProperty $propertyText "description"
  $firstParagraph = ""
  if ($description -and @($description).Count -gt 0) { $firstParagraph = @($description)[0] }

  $cardTranslations[$language] = [ordered]@{
    tag = if (Get-ObjectProperty $cardText "tag") { Get-ObjectProperty $cardText "tag" } else { "Nuevo" }
    title = if (Get-ObjectProperty $cardText "title") { Get-ObjectProperty $cardText "title" } else { Get-ObjectProperty $propertyText "title" }
    location = if (Get-ObjectProperty $cardText "location") { Get-ObjectProperty $cardText "location" } else { Get-ObjectProperty $propertyText "location_text" }
    price = if (Get-ObjectProperty $cardText "price") { Get-ObjectProperty $cardText "price" } else { Get-ObjectProperty $propertyText "price" }
    excerpt = if (Get-ObjectProperty $cardText "excerpt") { Get-ObjectProperty $cardText "excerpt" } else { Shorten $firstParagraph }
  }
}

$registryProperties += [ordered]@{
  id = $id
  route = $route
  data = "data/properties/$id.json"
  image = $image
  types = @($types)
  translations = $cardTranslations
}

$addToCatalog = (Get-ObjectProperty $draft "addToCatalog")
if ($null -eq $addToCatalog -or $addToCatalog -eq $true) {
  $registry["catalog"] = Prepend-Unique $registry["catalog"] $id
}

$addToHome = (Get-ObjectProperty $draft "addToHome")
if ($null -eq $addToHome -or $addToHome -eq $true) {
  $registry["homeFeatured"] = Prepend-Unique $registry["homeFeatured"] $id
}

$homeHero = Get-ObjectProperty $draft "homeHero"
if ($homeHero -eq $true) {
  $registry["homeHeroProperty"] = $id
}

$registry["properties"] = $registryProperties
$registry | ConvertTo-Json -Depth 60 | Set-Content -LiteralPath $RegistryFile -Encoding UTF8

$pageDir = Join-Path $Root ($route.Trim("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar))
New-Item -ItemType Directory -Force -Path $pageDir | Out-Null
$template = Get-Content -LiteralPath $TemplateFile -Raw -Encoding UTF8
$template.Replace("__PROPERTY_ID__", $id) | Set-Content -LiteralPath (Join-Path $pageDir "index.html") -Encoding UTF8

Write-Host "Inmueble generado: $id"
Write-Host "Ficha: $route"
Write-Host "Datos: data/properties/$id.json"
