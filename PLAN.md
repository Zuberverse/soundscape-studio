# Initial build plan

**As of:** November 2, 2026

**Status:** proposal for a later implementation task

**Current boundary:** research, specification and repository setup only

## Recommendation

Prove one Comfy audio-to-video path before building the application around it. Start with an uploaded music excerpt, an opening image and one world. Add editable musical timing and a documented Comfy finishing graph only after the raw generation has been evaluated.

The product's distinctive contribution should be an inspectable **world score**: a small, editable description of how musical passages guide visual intention, generation and finishing. It is a design concept, not an existing model or a claim that music-to-video is new.

## Phase 0 — Prove the workflow, user-owned execution and access

**Owner:** generation/integration maintainer. **Precondition:** a separate instruction to begin implementation and a bounded generation budget.

1. Inspect the selected Comfy environment's supported models, nodes, limits and access. Start with App Mode in the user's own workspace. Verify sign-in, imported-copy ownership and the absence of a creator-funded endpoint. Distinguish optional MCP access from standalone SDK authentication.
2. Select an official LTX audio-to-video graph or Comfy LTX partner-node graph. Record the exact upstream revision and required model/node versions before adapting it.
3. Use one authorized, redistribution-cleared audio excerpt and image. Run a plain baseline, then a bounded comparison holding the visual direction as stable as the backend allows.
4. Listen and inspect motion, image retention, timing, artifacts, actual duration, elapsed time and real credit/GPU cost. Record failures as well as selected takes.
5. Check whether the music drives useful motion rather than only plausible generic activity. Seek a second listener's judgment when available; do not convert one subjective example into a general benchmark.

**Exit:** one replayable Comfy graph, exact backend/model inventory, one actual output, measured resource use and an explicit route decision. Before any public runnable distribution, verify with a separately authorized user/workspace that their run is billed to them and creates no owner-workspace job. If native conditioning is unusable, evaluate a separately labeled Comfy image/video-plus-finishing route. Do not silently switch providers or describe the fallback as native audio conditioning.

**Stop:** missing access, unsupported nodes, unknown license applicability or no bounded budget. Keep the spec; do not build a speculative integration around unverified capability.

## Phase 1 — Establish music and export contracts

**Owner:** audio/workflow maintainer. **Dependency:** Phase 0 route decision.

- Verify excerpt timing, sample rate conversion and soundtrack preservation. Beat markers are editable proposals with tempo/offset correction and a free-timing path.
- Define the world-score and recipe formats in prose, then implement versioned schemas when code starts.
- Resolve music duration versus the model's frame grid. Generate enough frames and trim through Comfy finishing rather than stretching the music to fit.
- Prove a short-clip export first. Evaluate a visual loop separately; inspect repeated playback and retain the finishing method in metadata.
- Test finishing-node availability on the selected Comfy host. Avoid requiring an unsupported custom node in the advertised first path.

**Exit:** measured trim accuracy, a stable timebase, a valid export with source music and a candid decision about loop support.

## Phase 2 — Build the intuitive Comfy app

**Owner:** application/workflow maintainer. **Dependency:** Phases 0–1.

Expose the validated workflow through Comfy App Mode: music, excerpt start/duration, image, world, motion amount and an explicit Run action, with preview and export outputs. Prefer native controls. Make opening and running a user's own copy the documented default. Keep the graph available for editing and reproduction.

Verify what App Mode can actually present: audio preview, accepted file inputs, timing controls, job/error handling and download behavior. Do not promise a custom waveform editor or comparison timeline from the existing native control surface. Keep successful takes and confirm that a reconnect does not create another job.

**Exit:** a fresh user can follow the documented import → own workspace → configure → run → preview/export journey without an agent or access to the maintainer's account. The underlying graph and costs are visible.

A richer local TypeScript/React studio is a subsequent option if native controls obstruct the creative journey. It must keep user-owned Comfy execution and avoid a shared funded proxy. Do not add that service before demonstrating the need.

## Phase 3 — Make the result worth sharing

**Owner:** creative/product maintainer. **Dependency:** Phase 2.

Develop the three world directions on the same cleared excerpt. Improve motion restraint, framing, lighting and musical phrasing. Add portrait output only after landscape export is reliable. Expose concise controls and keep workflow detail available without requiring it in the main flow.

An optional companion skill/plugin can then operate the same proven workflow via the user's own Comfy MCP connection. Package only for explicitly tested hosts and preserve per-host consent, file handling and cost controls. The actual app remains usable without an agent.

Run the acceptance checks in [SPEC.md](SPEC.md). Compare raw output with finished output and demonstrate the exact role of each. Check keyboard operation, reduced motion, unreadable states, source-image cropping and repeat playback.

**Exit:** three coherent worlds, a reproducible example and a concise real product demo. If only one world is proven, ship and describe one.

## Phase 4 — Release and competition review

**Owner:** maintainer. **Dependency:** a working app and documented proof.

Verify a clean checkout, supported backend setup, exact model/node inventory, license notices, safe configuration, input rights and export reproduction. Create a release only when these checks support it. Recheck the live competition page and submission form; [COMPETITION.md](docs/COMPETITION.md) is a dated brief, not proof of registration or eligibility.

A deadline is not a reason to mark an unimplemented feature complete. The current repository is not a submission-ready application. Enter only after the actual app and demo meet the rules and publication/submission is authorized.

## Time and cost

No reliable build-time or generation-cost estimate exists before Phase 0. Keep that first spike small: one baseline and at most two deliberate comparisons under an approved budget, stopping early if the path fails. Three worlds and high-resolution retries multiply generation cost. Finishing edits should reuse a successful generation where possible.

For planning, estimate separately: backend generation units × current rate, GPU time if self-hosted, storage, and any hosting. Record both the estimate and actual use. This task purchases nothing and runs no generation.

## Definition of planning complete

- Public repository contains standalone spec, plan, research, license and contribution guidance.
- Comfy-only creation, current implementation status and future commercial options are explicit.
- Canonical issues name the first proof gates and their acceptance criteria.
- Local files and remote repository are verified; no platform code or media generation has started.

## Initial investigation issues

- [#1 — Prove native audio-conditioned Comfy generation](https://github.com/Zuberverse/soundscape-studio/issues/1)
- [#2 — Verify recipient-owned execution and billing isolation](https://github.com/Zuberverse/soundscape-studio/issues/2)
- [#3 — Validate soundtrack timing and Comfy finishing](https://github.com/Zuberverse/soundscape-studio/issues/3)
- [#4 — Build the first App Mode journey after those proof gates](https://github.com/Zuberverse/soundscape-studio/issues/4)

These issue records own progress and acceptance updates. They do not authorize implementation or generation by themselves.
