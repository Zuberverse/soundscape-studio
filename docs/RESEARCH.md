# Research and technical direction

**Decision/use:** choose a credible Comfy-based Music to World workflow and a later build sequence.

**As of:** November 2, 2026. Public primary-source documentation review only.

**Freshness:** recheck contest details before entry; recheck models, nodes, APIs, pricing and licenses before implementation.

**Evidence limit:** no model download, paid request, generation, benchmark or integration test was performed.

## What changed the direction

The initial concept could have used generated scenery followed by beat-timed effects. A stronger candidate is available: LTX documents audio-conditioned video generation in ComfyUI. That makes native music-driven generation worth testing first. It does not establish that the model will respond well to a particular track or land events on exact beats.

Our proposed contribution is musician-directed control and reproducible workflows: select a passage, shape a world score, inspect timing, generate through Comfy and finish an export honestly. Audio-to-video itself is existing prior art.

## Source-backed findings

### R1 — Native audio conditioning exists

LTX's official guide describes a Comfy audio-to-video graph that conditions on supplied audio and accepts an optional opening image. Its mechanism fixes the input audio representation while sampling video. This supports evaluating genuine conditioning rather than only soundtrack muxing. Actual music synchronization and image retention remain untested. [LTX audio-to-video guide](https://docs.ltx.io/open-source-model/usage-guides/audio-to-video)

### R2 — There is an upstream graph to inspect

The vendor's workflow collection includes an audio-to-video example alongside image/text generation. It documents model frame-count constraints, which matters when fitting a selected musical passage. Adapt a pinned revision during implementation, preserving its license and provenance; no upstream workflow is copied into this foundation. [Official LTX workflow collection](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/example_workflows/2.5/README.md)

### R3 — A partner node is a different execution route

Comfy's LTX 2.5 Audio To Video node documentation describes an API-backed node with a 2–20 second audio input and optional first image. It is a useful Comfy-contained candidate if the native graph is unavailable, but is not evidence of open-weight execution. [Official node documentation](https://github.com/Comfy-Org/embedded-docs/blob/main/comfyui_embedded_docs/docs/LtxApi25AudioToVideo/en.md)

### R4 — Runtime access must be proven separately

The Cloud quickstart requires a paid Cloud subscription and an API key, and instructs developers to validate a graph in the editor before exporting API format. An agent's MCP sign-in is not proof that a standalone application has the required runtime access. Budget, entitlement and credential decisions remain implementation preconditions. [Comfy workflow quickstart](https://docs.comfy.org/development/api-development/quickstart)

### R5 — Music analysis is useful but fallible

librosa exposes beat tracking and manual tempo input; its docs explicitly describe an empty-beat result when no onset strength is detected. Treat its output as a suggestion, not song understanding. A user must be able to correct tempo and offset or choose free timing. [librosa beat tracker](https://librosa.org/doc/0.11.0/generated/librosa.beat.beat_track.html)

An RMS curve measures local signal energy. It can propose restrained intensity changes; it does not establish emotional meaning or a song's formal sections. [librosa RMS reference](https://librosa.org/doc/0.11.0/generated/librosa.feature.rms.html)

### R6 — Native execution has substantial hardware needs

The vendor's documented reference setup lists NVIDIA/CUDA hardware, substantial VRAM and model storage. Use that as a planning floor for the documented reference configuration, not proof that every optimization or Apple backend has the same requirements. Do not promise laptop-native performance from a model listing. [LTX reference system requirements](https://docs.ltx.io/open-source-model/getting-started/system-requirements)

### R7 — Code and model licenses are separate

LTX's license index identifies different model-license generations, including a separate LTX-2.x agreement for later weights. Resolve the exact weights' terms, gated access and applicable use before running or redistributing them. The application's MIT license cannot grant rights to third-party models. [LTX license index](https://github.com/Lightricks/LTX-2/blob/main/LICENSE)

### R8 — Loop finishing is an engineering task

FFmpeg documents transitions, trims and frame operations that can inform finishing design. The product requirement is to expose finishing through Comfy nodes supported on the chosen host. FFmpeg's existence does not prove that a Cloud graph permits a particular filter or custom node. A visual crossfade and an audio crossfade also have different artistic effects. [FFmpeg filter reference](https://ffmpeg.org/ffmpeg-filters.html)

### R9 — Native app presentation can avoid a custom service

Comfy documents App Mode as an interface over the existing workflow and queue, with selected inputs and outputs. This supports a simpler initial product than building a separate hosted studio. Native control coverage and the recipient-run billing boundary still need direct acceptance checks. [Official App Mode introduction](https://blog.comfy.org/p/from-workflow-to-app-introducing)

### R10 — MCP is optional control, not free compute

Comfy documents a Cloud MCP connection authenticated to a user's Comfy account, plus a separate local connection. Supported interactive clients can use OAuth. The product recommendation is an optional agent companion over the user's connection, not a new shared MCP execution service. [Official Comfy MCP documentation](https://docs.comfy.org/agent-tools/mcp)

### R11 — Workspace ownership determines the cost risk

Comfy's support material places plan/credits and runs in workspaces and explains that team members share credits. Therefore a public starter should be copied into each user's own workspace, not delivered by inviting everyone to the maintainer's team. This is an architecture inference to verify with a separate-user run. [Official workspace guide](https://support.comfy.org/articles/1707576471-team-workspaces-create-invite-and-manage)

## Route comparison

This is a design assessment, not a measured ranking.

| Candidate | Value | Main uncertainty | Disposition |
|---|---|---|---|
| Native LTX audio-conditioned Comfy graph | Most direct fit; inspectable model path | Host support, access, resources and musical response | First proof target |
| Comfy LTX partner A2V node | Keeps Comfy as the creation boundary | Runtime access, charges and result quality; excludes open-weights-only path | Explicit alternative |
| Comfy image/video generation + music-timed finishing | More predictable intentional event timing | May feel like effects over generic footage | Honest fallback to evaluate |
| Real-time diffusion or live VJ engine | Potential future performance use | Different latency, hardware and interaction problem | Outside initial scope |
| Direct model-provider SDK | Could bypass workflow limitations | Breaks the required Comfy creation boundary | Excluded |

## Questions that can change the plan

1. Does the chosen Comfy host actually support the exact native A2V graph and finishing nodes?
2. Is the target account entitled to the needed runtime route, with an authorized bounded budget?
3. Does conditioning create a visibly useful musical response on a cleared excerpt?
4. Can the soundtrack retain its intended timing through generation and export?
5. Can a short scene close visually without an objectionable transition? Is a separate audio loop artistically appropriate?
6. Can a fresh contributor reproduce the supported path without private services or restricted demo assets?
7. Which model/node licenses and service terms apply to the exact selected configuration, including commercial use?

These are proof gates in [PLAN.md](../PLAN.md), not claims of product failure or completed integration.

## Research stopping point

The first route, meaningful alternative, creation boundary and major access/export risks are sufficiently clear for an initial specification. More provider shopping will not resolve the main uncertainty: the actual result from the selected Comfy graph. The next evidence should come from a bounded, separately authorized implementation spike.
