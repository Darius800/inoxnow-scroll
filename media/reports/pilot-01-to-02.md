# INOXNOW — Pilot 01 → 02

## Generation record

- Date: 2026-10-14 (Europe/Madrid)
- Model: MiniMax H3 (`minimax_h3`)
- Higgsfield job: `7e6e9caf-2391-468f-82ca-2eec8db9252c`
- Start image: `media/source-images/scene-01-warehouse.webp`
- End image: `media/source-images/scene-02-showroom.webp`
- Duration: 5 seconds
- Aspect ratio: 16:9
- Resolution: 2K (2560 × 1440)
- Container/video: MP4, H.264/AVC
- Audio: present in the source MP4; the current MiniMax H3 CLI schema exposes no disable-audio parameter
- Estimated credits: 10
- Actual credits consumed: 10 (workspace balance 280 → 270)
- Original result: `media/generated-clips/pilot-01-to-02-minimax-h3-2k-original.mp4`
- Status: generated; technically rejected as a final connector; awaiting user review

## Prompt

> Single continuous stabilized cinematic camera move through one connected premium stylized isometric 3D diorama world. Begin from the provided INOXNOW warehouse frame and travel smoothly toward the equipment showroom, arriving exactly at the provided ending frame. Preserve the fixed high isometric orientation, floating-island architecture, cream and pastel palette, miniature characters, stainless-steel kitchen equipment, warm soft lighting, consistent geometry, scale and visual identity. Use a slow controlled architectural-visualization dolly with gentle forward travel and subtle lateral parallax; ease smoothly into the final framing. No cuts, no crossfades, no dissolves, no morphing, no flicker, no camera shake, no abrupt zoom, no orbit, no tilt, no violent turn, no camera teleportation, no architectural deformation, no warped furniture, no duplicated or random objects, no deformed characters, no lighting or style change, and do not alter or invent logos or text.

MiniMax H3 exposes no separate negative-prompt field in the installed integration, so the negative constraints were appended to the main prompt.

## QA artifacts

- Near-start frame: `media/keyframes/pilot-01-to-02-start.png`
- Middle frame (~2.5 s): `media/keyframes/pilot-01-to-02-middle.png`
- Near-end frame (~4.96 s): `media/keyframes/pilot-01-to-02-end.png`
- Higgsfield thumbnail: `media/keyframes/pilot-01-to-02-higgsfield-thumbnail.webp`
- Original file size: 8,662,192 bytes

## Visual evaluation

- Start fidelity: good. The warehouse, palette, island, equipment and INOXNOW sign remain recognizable.
- End fidelity: good. The final composition lands close to the supplied showroom reference.
- Camera/orientation continuity: insufficient. The middle frame rotates toward a more frontal view instead of maintaining the requested high isometric orientation.
- Architectural continuity: failed. The warehouse geometry visibly reconstructs and flattens during the transition.
- Object continuity: failed. Shelving, equipment and structural elements shift, disappear or are replaced during the middle of the clip.
- Style/lighting continuity: broadly consistent in palette and lighting.
- Logo stability: acceptable in the sampled frames, but not sufficient to offset the geometry failure.
- Cuts/fades: no artificial cut or dissolve is visible in the sampled frames.

## Decision

Do not move this file to `media/approved-clips/` without explicit user approval. The result is useful as a diagnostic: directly interpolating between the two original scene stills encourages semantic morphing. For the production chain, the Scroll World handoff method should be followed: generate scene camera legs first, extract their actual rendered boundary frames, and only then generate the connector between those frame-matched endpoints.

No regeneration was performed.
