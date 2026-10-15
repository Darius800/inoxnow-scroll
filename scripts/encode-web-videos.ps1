param(
	[string]$FfmpegPath = "ffmpeg"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$sourceRoot = Join-Path $projectRoot "media/generated-clips"
$outputRoot = Join-Path $projectRoot "public/media/videos"

$sources = @(
	"scene-01-internal-motion-minimax-h3-2k-original.mp4",
	"scene-02-internal-motion-minimax-h3-2k-original.mp4",
	"scene-03-internal-motion-corrected-minimax-h3-2k-original.mp4",
	"scene-04-internal-motion-minimax-h3-2k-original.mp4",
	"scene-05-installation-motion-minimax-h3-2k-original.mp4",
	"scene-06-internal-motion-minimax-h3-2k-original.mp4"
)

New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null

for ($index = 0; $index -lt $sources.Count; $index += 1) {
	$inputPath = Join-Path $sourceRoot $sources[$index]
	$outputPath = Join-Path $outputRoot ("scene-{0:D2}.mp4" -f ($index + 1))
	$tempPath = "$outputPath.encoding"

	& $FfmpegPath -y -i $inputPath -an `
		-vf "scale=1920:1080:flags=lanczos" `
		-c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p `
		-g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart `
		-f mp4 $tempPath

	if ($LASTEXITCODE -ne 0) {
		throw "FFmpeg no pudo codificar $($sources[$index])"
	}

	Move-Item -LiteralPath $tempPath -Destination $outputPath -Force
}

Write-Output "Creados 6 derivados H.264 1080p, sin audio, GOP 8 y faststart."
