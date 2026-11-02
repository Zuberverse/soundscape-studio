# Soundscape Studio specification

**As of:** November 2, 2026

**State:** initial product proposal; application unimplemented

**Product owner:** this document

## Purpose and audience

Help musicians, visual artists and small creative teams give a piece of music a visual world they can direct, reproduce and reuse. The output is initially a short video or loop for a track preview, performance backdrop or social clip. It is not an explorable 3D environment.

The defining behavior is a visible connection between musical timing, visual intention and the resulting Comfy workflow. A user can inspect and change that relationship. The project must offer more than a prompt box and a downloaded video.

## Delivery and who pays

The first interface is a Comfy-native App Mode app, not a separately hosted AI service. Users run a copy in their own Comfy workspace or on a supported Comfy installation they control. No separate agent is required. A companion skill/plugin can later direct the same workflows through the user's own MCP connection; it is optional and requires host-specific proof before release.

There is no project-funded generation endpoint, bundled credential, shared creator workspace or automatic credit subsidy. The user's selected workspace/hardware owns compute costs. Agent usage, if chosen, belongs to the user's agent plan or provider arrangement. Being open source does not make hosted inference free. [Delivery and cost contract](docs/DELIVERY-AND-COSTS.md) owns the detail and the required separate-user verification.

## Creation boundary

**Comfy is mandatory for all generative media.** Music generation, image generation/editing, video generation and generative finishing use Comfy workflows, including explicitly identified partner nodes where selected. No direct model-provider generation fallback is permitted. Backend execution may be Comfy Cloud or a separately supported Comfy installation; changing the host does not change the workflow requirement.

Import, audio analysis, waveform display, project persistence, metadata inspection and technical QA can run locally. Creative finishing and export should remain visible in the Comfy graph. If a required finishing node is unavailable on the selected host, expose that limitation and resolve it before claiming the feature. Do not silently route the work through another media service.

## First complete journey

### 1. Bring the music

Import a WAV or MP3 file and choose an 8–16 second excerpt. Proposed initial bounds are one file up to 50 MB and five minutes, with larger inputs rejected before decoding. These are product limits to validate, not backend limits. Keep the original intact; derived analysis audio and trimmed media are separate assets.

The intended studio experience shows a waveform and plays the selected passage. The first App Mode version may instead use audio preview plus explicit start/duration fields; verify its controls before promising a draggable timeline. Report duration and proposed beat locations. Offer manual tempo and first-beat offset, half/double tempo and a free-timing mode. Silence, ambient music and irregular meter are valid inputs; the app must not invent confident rhythmic structure.

For the first release, the user supplies music. Generating music within Comfy is a later optional workflow, not an automatic step.

### 2. Establish the world

Import one PNG or JPEG, proposed maximum 20 MB and 25 megapixels. Choose a starting direction or write a scene description. Preserve the distinction between an opening-frame reference and a guarantee that the image's subject will stay unchanged.

Initial directions:

| World | Visual intention | Musical interpretation |
|---|---|---|
| Celestial Cathedral | Monumental arches, luminous depth, patient forward movement | Sustained passages open space; selected accents reveal light |
| Aurora Portal | A traversable-looking field of ribbons, color and distant thresholds | Phrases guide changes in movement and atmosphere |
| Luminous Abstraction | Sculptural forms and flowing material in a coherent space | Energy shapes intensity; transients punctuate restrained changes |

These are editable prompt recipes and motion intentions. No preset should require a private asset, personal identity, unlicensed font or hidden prompt service.

### 3. Direct the relationship

The proposed mature preview shows the music, timing markers, prompt and a short description of the intended motion. The first native interface exposes a compact subset and explains any manual timing fields. Expose a small control set: world, motion amount, musical responsiveness, camera direction and seed. Keep model-specific controls under optional detail.

Audio-conditioned generation and exact timeline controls are separate mechanisms. A model may respond musically without placing an event on a precise beat. Deterministic finishing may align an event without proving the model followed the audio. The interface and export manifest must label the mechanism used.

### 4. Generate and review

Identify the Comfy host, workflow, model and whether partner/API nodes are present. Show an estimate when supported, or explicitly mark cost unknown. Require an explicit generation action. One initial job at a time; no automatic variations, retries, spending or provider substitution.

Provide real job state, elapsed time, cancellation when the backend supports it and recovery after refresh. Never show invented percentage progress. A failed job retains its inputs, stage and actionable error. An ambiguous submission remains unresolved rather than being resubmitted and potentially billed twice.

Review with original music, mute, replay and a toggle for any finishing effects. Allow changing direction without discarding a successful take. The app does not claim to infer emotion, genre, song structure or artistic intent from scalar audio features.

### 5. Finish and export

Start with a 16:9 result; portrait is a subsequent milestone. Preserve the original musical performance. Output encoding may change sample representation, so do not promise bit-identical audio in a compressed MP4. Store source and trim metadata separately.

Offer two honest result types:

- **Short clip:** exact chosen passage, ordinary start and end; no seamless claim.
- **Loop candidate:** a visual wrap that has been reviewed over repeated playback. Audio-loop quality is a separate choice and check.

A repeated file is not automatically a seamless loop. A crossfade may create ghosting; reversing a clip may make motion unnatural. Expose the finishing method. Do not alter the music's tempo or crossfade its seam without user choice.

Export the final video, a portable recipe manifest and the exact executed Comfy API graph. Also retain the editable authoring graph when available. Generated files and private inputs are excluded from Git by default. A portable recipe uses asset hashes and relative references, not local machine paths or signed output URLs.

## Acceptance for the first working milestone

| Area | Required evidence |
|---|---|
| Cost isolation | A separate user can run the shared app in their own workspace; the owner workspace receives no job or usage charge |
| Complete path | Fresh project → imported excerpt/image → actual Comfy job → playable exported file |
| Music relationship | Original soundtrack retained; reviewers can identify whether conditioning or finishing caused the visible relationship |
| Timing | Trim boundaries and intentional timeline events within one output frame of their specified positions; model timing judged separately |
| Repeatability | Saved recipe can be reopened with the same assets and settings; identical model pixels are not promised |
| Honest status | Job failures, unknown cost, missing models and absent loop proof are visible |
| Recovery | Refresh or reconnect finds the existing job without silently submitting another |
| Loop | If labeled seamless, inspect at least five wraps at normal speed, with and without audio, and record the result |
| Access | Main controls work by keyboard; progress and errors are readable; reduced-motion presentation is available |
| Public usability | Clean-clone instructions and an actually tested backend are documented; no private maintainer tooling is required |

## Scope after the first milestone

Add three polished worlds, portrait export, saved projects, comparative takes and workflow portability after the single-world path works. Explore music-conditioned scene planning, multi-shot arrangements, generated music and visual stem controls later. Live streaming, full-song music videos, collaboration, subscriptions and hosted accounts are outside the first build.

## Commercial posture

This is an open-source tool with possible future monetization. A paid managed service, collaboration features, support or separately licensed additions may be considered. The initial MIT grant remains valid for recipients, including commercial users. No paid feature, price, account system or purchase flow is part of this specification milestone.
