# Implementation and verification

**As of:** November 2, 2026. Experimental v0.1 source release. Published source is distinct from a hosted deployment or independently validated recipient release.

## Current behavior

Soundscape Studio is a standalone browser mini app with a single-user loopback Node server. It connects to Comfy Cloud through the official MCP client's OAuth support. Approved frame, song and scene runs are submitted through Comfy, polled by their saved identity and downloaded to the local app. Native Comfy App Mode remains an export route; an agent is optional.

The desktop layout is a viewport workspace with a frame/scene library, central preview, full-height scene inspector and sound deck beneath the preview. Each panel scrolls independently. Phones use Library / Stage / Sound / Controls tabs. Fixed 176px prompts scroll internally. Real run states and a spinner indicate generation; percentages are not invented. The steady green connection badge confirms authentication, not subscription or credit availability.

Frames can be created through Z-Image-Turbo, uploaded, selected, renamed, downloaded and removed from the local library. A generated frame is reviewed before replacing the selected reference. Appearance presets are Open Vault, Tidal Glass and Ribbon Study, plus custom. Scene movement presets are Slow drift, Wide orbit and Steady view, plus custom direction. Still descriptions set the frame; scene directions influence motion and light around that frame. Image conditioning constrains large setting changes, so changing a setting starts with a different frame.

Audio options are an included original song, upload, explicit microphone recording with PCM WAV conversion, and MiniMax Music 3 generation with prompt, optional lyrics and duration. Waveform preview and validated start/length fields select a 2–16 second passage. Only that passage and the selected image are uploaded for a scene.

Scene names are optional before generation, default to Scene N and can be renamed afterward without another run. Existing scenes open on the stage. Browser IndexedDB stores reusable frames, scene names and source drafts; localStorage stores creative settings. Backend recovery records and result files use ignored local storage. Imported videos last for the browser session. Renaming affects local metadata and download filenames, not a Cloud workflow's title.

The optional clipboard handoff carries current choices without credentials or spending authority. Fourteen experimental WebMCP tools inspect and prepare the app. They cannot submit generation or record audio. Native workflow and recipe downloads remain available.

## Actual Comfy proof

First Light comprises an original Z-Image-Turbo image, MiniMax Music 3 instrumental and LTX-2.3 audio-conditioned video. All generation, exact-frame finishing and icon generation/resizing ran through Comfy. The saved integrated native app was executed successfully. The bundled output is **8.000 seconds**, **1280 × 704**, **24 fps**, with an **8.000-second** audio track. Decoded audio correlation with the original passage is approximately **0.9963**. Dimensions are reported as measured; no seamless loop or exact generative beat synchronization is claimed.

The actual local studio was separately exercised through browser sign-in, approved scene submission, polling, download and playback. A second live frame-generation check produced a 1280 × 720 image while retaining the prior reference until explicit acceptance. These were real Comfy runs; the regression suite uses mocked runs and does not spend credits.

## Regression evidence

Eighteen unit/integration checks cover native workflow parameters/link preservation, excerpt bounds, PCM WAV encoding, portable recipes, protected file paths, OAuth scope/state, fixed upload hosts, explicit credit consent, concurrent-submit exclusion, uncertain-submit handling and review release, interrupted-run recovery, run recovery, unreadable-history failure, and static serving (byte ranges for Safari/iOS media, revalidation, path-free errors, localhost redirect, CSP).

The isolated Chromium browser suite exercises frame create/select/import/rename/removal recovery with distinct image bytes; blocked-popup connection preservation; hidden-result playback pause; custom and default scene names; rename persistence and result viewing; progress and explicit review; workflow downloads; sign-in draft recovery; synthetic microphone conversion and released tracks; MiniMax song preparation/use; actual bundled video playback; native registration/invocation of all 14 WebMCP tools; and desktop, compact and phone panel geometry. WebMCP was tested in Chromium 153 with its experimental feature enabled. Ordinary browsers retain the handoff fallback.

## Material limits

Only the development operator's Comfy account has completed live execution. Independent recipient billing isolation remains [#2](https://github.com/Zuberverse/soundscape-studio/issues/2), a gate before claiming independently verified recipient execution. The server is local and single-user; do not expose it as multi-tenant infrastructure. Native Comfy microphone variants are packaged but untested with a real device; browser mic QA used synthetic input. One source scene has a creative review; movement presets share its graph and are not a broad aesthetic benchmark.

Cost varies and is not estimated by the studio. Reconnection confirms sign-in, not execution entitlement. Tokens are memory-only and reconnect is required after restart. Completed files and known jobs survive in local storage, but ambiguous submissions without a Cloud ID require checking the Comfy queue; the app does not automatically retry them. Scene metadata is local, not a synchronized Cloud project system. Recipe import, long arrangements, portrait output, beat editing, seamless loops and live diffusion are future work.
