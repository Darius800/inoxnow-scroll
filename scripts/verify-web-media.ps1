param(
	[string]$FfprobePath = "ffprobe"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$videoRoot = Join-Path $projectRoot "public/media/videos"
$videos = Get-ChildItem -LiteralPath $videoRoot -File -Filter "scene-*.mp4" | Sort-Object Name

if ($videos.Count -ne 6) {
	throw "Se esperaban 6 derivados web y se encontraron $($videos.Count)."
}

foreach ($video in $videos) {
	$probe = & $FfprobePath -v error -show_entries stream=codec_name,codec_type,width,height -show_entries format=duration -of json $video.FullName | ConvertFrom-Json
	if ($LASTEXITCODE -ne 0) { throw "FFprobe no pudo leer $($video.Name)." }
	$videoStream = @($probe.streams | Where-Object codec_type -eq "video")[0]
	$audioStreams = @($probe.streams | Where-Object codec_type -eq "audio")
	$keyframes = @(& $FfprobePath -v error -select_streams v:0 -skip_frame nokey -show_entries frame=pts_time -of csv=p=0 $video.FullName)
	$atoms = [Text.Encoding]::ASCII.GetString([IO.File]::ReadAllBytes($video.FullName))

	if ($videoStream.codec_name -ne "h264" -or $videoStream.width -ne 1920 -or $videoStream.height -ne 1080) {
		throw "$($video.Name) no es H.264 1920x1080."
	}
	if ($audioStreams.Count -ne 0) { throw "$($video.Name) todavía contiene audio." }
	if ($keyframes.Count -ne 16) { throw "$($video.Name) no conserva el GOP esperado de 8 fotogramas." }
	if ($atoms.IndexOf("moov") -gt $atoms.IndexOf("mdat")) { throw "$($video.Name) no tiene faststart." }
}

Write-Output "OK: 6 vídeos H.264 1080p, sin audio, 16 keyframes y faststart."
