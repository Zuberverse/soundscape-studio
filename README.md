# Soundscape Studio

**Give your music a world.**

An open-source Comfy app for turning music and an image into a short, music-driven visual world.

**Status: specification and research foundation. There is no runnable application yet.** The features below describe the proposed product. No generation workflow, benchmark, demo or contest entry has been completed.

## The idea

Bring a track, choose a passage and give it a visual starting point. Soundscape Studio will help you direct a world whose motion and pacing respond to that music, then export a short film or a finished visual loop with its underlying Comfy workflow.

The first milestone is deliberately focused: **one audio excerpt, one image, one world and one trustworthy export**. Three starting directions are proposed: Celestial Cathedral, Aurora Portal and Luminous Abstraction. They are art directions, not existing assets or trained models.

Comfy is the required creation backend. All generated music, images and video must pass through inspectable Comfy workflows. Partner nodes may be used when clearly identified; direct generation through unrelated provider SDKs is outside the design. The first version uses the supplied music rather than generating a replacement soundtrack.

## How it will be delivered

Start with a simple **Comfy App Mode** interface that users run in their own Comfy workspace or supported self-hosted instance. A separate agent is optional; a future companion can use the user's own Comfy MCP connection. No shared generation endpoint, maintainer API key or subsidized public compute service is part of the design. A richer custom studio interface is a later option if native controls prove limiting. See [delivery and costs](docs/DELIVERY-AND-COSTS.md).

## Planned experience

1. Import music and select an 8–16 second passage.
2. Add an image and choose or describe a world.
3. Inspect the proposed musical timing and adjust its energy or beat markers.
4. Run the selected Comfy workflow and review the result.
5. Finish a short clip or evaluate a loop, then export video and a portable recipe.

Native audio-conditioned generation is the preferred research path. Exact beat alignment, identity retention and seamless looping still need proof. An ordinary video with background music will never be described as proven audio-conditioned generation.

## Start here

| Document | Purpose |
|---|---|
| [Specification](SPEC.md) | Audience, proposed experience, scope and acceptance criteria |
| [Build plan](PLAN.md) | Ordered proof gates and implementation milestones |
| [Delivery and costs](docs/DELIVERY-AND-COSTS.md) | App Mode, optional MCP companion and user-owned compute |
| [Architecture](docs/ARCHITECTURE.md) | Comfy boundary, components, job lifecycle and data |
| [Research](docs/RESEARCH.md) | Primary sources, technical options and remaining uncertainty |
| [Competition](docs/COMPETITION.md) | Dated contest brief and submission readiness |
| [Open source and commercial options](docs/OPEN-SOURCE.md) | MIT licensing and possible future paid offerings |
| [Development](docs/DEVELOPMENT.md) | What exists, checks and future setup decisions |

The [GitHub issue tracker](https://github.com/Zuberverse/soundscape-studio/issues) owns tasks, defects and unresolved technical investigations. [ROADMAP.md](ROADMAP.md) describes the larger sequence; [WORKSTREAM.md](WORKSTREAM.md) holds current execution context.

## Open source

Original repository code and documentation are offered under the [MIT License](LICENSE). Commercial use is allowed. A future paid hosted service or edition is possible; none is currently available or promised. Models, runtime dependencies, contributed media and user uploads retain their own licenses and rights.

Soundscape Studio is an independent project by Zuberant. It is not an official Comfy, LTX or Higgsfield product and is unrelated to the OpenSoundscape bioacoustics library.
