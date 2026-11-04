function Concat-DirFiles {
    param (
        [string]$InputDir,
        [string]$Extension
    )

    if (-not $Extension.StartsWith(".")) {
        $Extension = ".$Extension"
    }

    Get-ChildItem -Path $InputDir -File -Recurse |
        Where-Object { $_.Extension -eq $Extension } |
        ForEach-Object {
            Get-Content -LiteralPath $_.FullName -Raw
            "`n`n`n`n`n"
        }
}


function Copy-FileToDir {
    param (
        [string]$FilePath,
        [string]$OutputDir
    )

    New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

    Copy-Item -LiteralPath $FilePath -Destination $OutputDir -Force
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$outDir = Join-Path $ScriptDir "combined"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

Concat-DirFiles (Join-Path $ScriptDir "backend/app") ".py" |
    Set-Content -Path (Join-Path $outDir "app.txt")
	
Concat-DirFiles (Join-Path $ScriptDir "backend/tests") ".py" |
    Set-Content -Path (Join-Path $outDir "tests.txt")
	
Copy-FileToDir "frontend/index.html" $outDir

Copy-FileToDir "frontend/src/main.jsx" $outDir

Copy-FileToDir "frontend/src/styles.css" $outDir

Copy-FileToDir "frontend/src/content/portfolio.json" $outDir