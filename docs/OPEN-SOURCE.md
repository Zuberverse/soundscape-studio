# Open source and possible commercial offerings

**State:** current policy, November 2, 2026. No paid product is available.

## Repository license

Original code and documentation in this repository use the [MIT License](../LICENSE). MIT permits use, modification, redistribution, sublicensing and sale subject to its notice requirements. It has no noncommercial restriction. Recipients may build their own commercial versions or services. [MIT text from the Open Source Initiative](https://opensource.org/license/mit)

The project can therefore remain an open-source tool while exploring a paid service or edition later. A future business model does not cancel an existing recipient's license or turn already published MIT code into exclusive proprietary material.

## Possible future offerings

Unselected options include a paid interface or workflow-management layer, team collaboration, support, separately licensed additions, or an explicitly designed managed-compute service. The initial distribution uses the user's own Comfy account/hardware, without subsidized compute. Each would need a concrete offer, operating costs and a clear boundary before launch. No paid account system, pricing, billing integration or commercial offer is implemented. Comfy OAuth connects the local operator to their existing workspace.

If an open-core approach is later selected, document exactly what remains in the open tool, what a paid addition supplies, and how each is licensed. Do not advertise a self-hostable tool whose central documented workflow secretly depends on an unavailable private service. No exclusive relicensing rights are implied over outside contributors' work.

See [delivery and costs](DELIVERY-AND-COSTS.md) for account ownership, optional MCP and the no-shared-credential contract.

## Competition compatibility

The current challenge requires an open-source app, license and setup instructions. A possible future paid edition does not change those delivery requirements. The submitted version must genuinely work from the published materials and disclosed external requirements. Commercial eligibility beyond the published brief remains subject to the organizer's actual terms; see [COMPETITION.md](COMPETITION.md).

## Third-party boundaries

| Material | Handling |
|---|---|
| ComfyUI and custom nodes | External runtime dependencies with their own licenses; record versions and notices before distribution |
| Model weights, encoders and adapters | Separate model terms and access; do not relabel them MIT or redistribute by assumption |
| Partner nodes and services | Disclose remote execution, costs and terms; using Comfy does not make every node open-weight |
| FFmpeg or other runtime binaries | Verify exact build/configuration and distribution obligations before bundling; [FFmpeg licensing](https://ffmpeg.org/legal.html) |
| Music, images and demonstration media | Rights must be recorded separately; uploads are not automatically licensed under the repository's MIT grant |
| Brand marks and names | No claim of exclusive ownership or third-party trademark rights from the software license |

The repository includes attributed Comfy workflow adaptations, OFL fonts, a project icon and original AI-generated demo media. Runtime packages are installed through the lockfile; model weights and runtime binaries are not bundled. [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md), the font notices and [demo provenance](../demo/README.md) describe the shipped material. User uploads are never covered by the repository license automatically.
