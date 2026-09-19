# Guarded `next dev`: kills ONLY the process tree it started if it runs away.
# Usage: npm run dev:safe
$MaxProcesses = 40      # root + descendants
$MaxMemoryGB  = 2       # total working set of the tree
$StartupSec   = 90      # port must accept connections by then
$Port         = 3000
$PollSec      = 1

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$next = Join-Path $repo 'node_modules\next\dist\bin\next'
$node = (Get-Command node).Source

# Root PID -> all descendants, from one snapshot. Only follows ParentProcessId links from our root.
function Get-Tree($rootId) {
  $all = Get-CimInstance Win32_Process
  $ids = [System.Collections.Generic.HashSet[uint32]]::new()
  [void]$ids.Add([uint32]$rootId)
  do {
    $before = $ids.Count
    foreach ($p in $all) { if ($ids.Contains($p.ParentProcessId)) { [void]$ids.Add($p.ProcessId) } }
  } while ($ids.Count -gt $before)
  $all | Where-Object { $ids.Contains($_.ProcessId) }
}

function Stop-Tree($rootId) {
  # Kill by explicit PID from our tree only. /T also follows the root's live children.
  $pids = @(Get-Tree $rootId | ForEach-Object ProcessId)
  & taskkill.exe /T /F /PID $rootId 2>&1 | Out-Null
  foreach ($id in $pids) { Stop-Process -Id $id -Force -ErrorAction SilentlyContinue }
}

# Turbopack PostCSS workers of THIS repo only: command line must contain the repo path AND .next\dev\build.
function Get-RepoWorkers {
  Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object {
    $c = $_.CommandLine
    $c -and $c.IndexOf($repo, [StringComparison]::OrdinalIgnoreCase) -ge 0 -and
      $c.IndexOf('.next\dev\build', [StringComparison]::OrdinalIgnoreCase) -ge 0
  }
}

function Test-Port {
  $c = [System.Net.Sockets.TcpClient]::new()
  try { $c.ConnectAsync('127.0.0.1', $Port).Wait(300) -and $c.Connected } catch { $false } finally { $c.Dispose() }
}

Set-Location $repo
$stale = @(Get-RepoWorkers)
if ($stale.Count -gt 0) {
  Write-Host "[dev-guard] REFUSING TO START: $($stale.Count) existing .next\dev\build worker(s) for this repo, PIDs: $(($stale.ProcessId) -join ', '). Stop them yourself, then retry." -ForegroundColor Red
  exit 2
}
$root = Start-Process -FilePath $node -ArgumentList "`"$next`"", 'dev', '-p', $Port -NoNewWindow -PassThru
$start = Get-Date
$ready = $false
$exit = 0
try {
  while (-not $root.HasExited) {
    Start-Sleep -Seconds $PollSec
    $tree = @(Get-Tree $root.Id)
    $memGB = [math]::Round((($tree | Measure-Object WorkingSetSize -Sum).Sum) / 1GB, 2)
    $secs = [int]((Get-Date) - $start).TotalSeconds
    if (-not $ready -and (Test-Port)) { $ready = $true }

    $why = $null
    if ($tree.Count -gt $MaxProcesses) { $why = "process count > $MaxProcesses" }
    elseif ($memGB -gt $MaxMemoryGB)   { $why = "tree memory > $MaxMemoryGB GB" }
    elseif (-not $ready -and $secs -gt $StartupSec) { $why = "not listening on :$Port after $StartupSec s" }

    if ($why) {
      Write-Host "[dev-guard] RUNAWAY: $why | processes=$($tree.Count) memory=${memGB}GB elapsed=${secs}s. Killing guarded tree (root PID $($root.Id))." -ForegroundColor Red
      $exit = 1
      break
    }
  }
  if ($exit -eq 0) { $exit = $root.ExitCode }
} finally {
  # Runs on Ctrl+C, runaway, or normal exit.
  Stop-Tree $root.Id
  # Workers can escape the tree walk; sweep this repo's leftovers by exact PID.
  Start-Sleep -Seconds 1
  $orphans = @(Get-RepoWorkers)
  if ($orphans.Count -gt 0) {
    Write-Host "[dev-guard] $($orphans.Count) orphaned worker(s) after shutdown, PIDs: $(($orphans.ProcessId) -join ', '). Terminating." -ForegroundColor Yellow
    foreach ($o in $orphans) { Stop-Process -Id $o.ProcessId -Force -ErrorAction SilentlyContinue }
    Start-Sleep -Seconds 1
    $left = @(Get-RepoWorkers)
    if ($left.Count -gt 0) { Write-Host "[dev-guard] WARNING: $($left.Count) worker(s) still alive, PIDs: $(($left.ProcessId) -join ', ')" -ForegroundColor Red }
    else { Write-Host "[dev-guard] Orphan cleanup complete." }
  }
}
exit $exit
