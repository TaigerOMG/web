param(
  [int]$Port = 8123
)

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Address = [System.Net.IPAddress]::Parse("127.0.0.1")

$MimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".svg"  = "image/svg+xml"
  ".pdf"  = "application/pdf"
  ".mp4"  = "video/mp4"
}

function Send-Response {
  param(
    [System.Net.Sockets.NetworkStream]$Stream,
    [string]$Status,
    [string]$ContentType,
    [byte[]]$Body,
    [bool]$HeadOnly = $false
  )

  $Header = "HTTP/1.1 $Status`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nConnection: close`r`nCache-Control: no-store`r`n`r`n"
  $HeaderBytes = [Text.Encoding]::ASCII.GetBytes($Header)
  $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
  if (-not $HeadOnly -and $Body.Length -gt 0) {
    $Stream.Write($Body, 0, $Body.Length)
  }
}

$Server = [System.Net.Sockets.TcpListener]::new($Address, $Port)

try {
  $Server.Start()
  Write-Host "BetaTest activo en http://127.0.0.1:$Port/"
  Write-Host "Abre: http://127.0.0.1:$Port/BetaTest/"
  Write-Host "Deja esta terminal abierta. Pulsa Ctrl+C para parar."

  while ($true) {
    $Client = $Server.AcceptTcpClient()
    try {
      $Stream = $Client.GetStream()
      $Reader = [IO.StreamReader]::new($Stream, [Text.Encoding]::ASCII, $false, 1024, $true)
      $RequestLine = $Reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($RequestLine)) {
        $Client.Close()
        continue
      }

      while (($Line = $Reader.ReadLine()) -ne $null -and $Line -ne "") {}

      $Parts = $RequestLine.Split(" ")
      $Method = $Parts[0]
      $UrlPath = if ($Parts.Length -gt 1) { $Parts[1].Split("?")[0] } else { "/" }
      $HeadOnly = $Method -eq "HEAD"

      if ($Method -ne "GET" -and $Method -ne "HEAD") {
        Send-Response $Stream "405 Method Not Allowed" "text/plain; charset=utf-8" ([Text.Encoding]::UTF8.GetBytes("Metodo no permitido")) $HeadOnly
        $Client.Close()
        continue
      }

      $RequestPath = [Uri]::UnescapeDataString($UrlPath.TrimStart("/")).Replace("/", [IO.Path]::DirectorySeparatorChar)
      if ([string]::IsNullOrWhiteSpace($RequestPath)) {
        $RequestPath = "BetaTest"
      }

      $Candidate = Join-Path $Root $RequestPath
      if ([IO.Directory]::Exists($Candidate)) {
        $Candidate = Join-Path $Candidate "index.html"
      }

      $FullPath = [IO.Path]::GetFullPath($Candidate)
      if (-not $FullPath.StartsWith($Root, [StringComparison]::OrdinalIgnoreCase)) {
        Send-Response $Stream "403 Forbidden" "text/plain; charset=utf-8" ([Text.Encoding]::UTF8.GetBytes("Acceso no permitido")) $HeadOnly
        $Client.Close()
        continue
      }

      if (-not [IO.File]::Exists($FullPath)) {
        Send-Response $Stream "404 Not Found" "text/plain; charset=utf-8" ([Text.Encoding]::UTF8.GetBytes("No encontrado")) $HeadOnly
        $Client.Close()
        continue
      }

      $Extension = [IO.Path]::GetExtension($FullPath).ToLowerInvariant()
      $ContentType = if ($MimeTypes.ContainsKey($Extension)) { $MimeTypes[$Extension] } else { "application/octet-stream" }
      $Bytes = [IO.File]::ReadAllBytes($FullPath)
      Send-Response $Stream "200 OK" $ContentType $Bytes $HeadOnly
    }
    catch {
      if ($Stream) {
        Send-Response $Stream "500 Internal Server Error" "text/plain; charset=utf-8" ([Text.Encoding]::UTF8.GetBytes("Error interno")) $false
      }
    }
    finally {
      $Client.Close()
    }
  }
}
finally {
  $Server.Stop()
}
