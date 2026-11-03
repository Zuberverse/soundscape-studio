# Open source and third-party boundaries

## Repository license

Original code and documentation in this repository use the [MIT License](../LICENSE). MIT permits use, modification, redistribution, sublicensing and sale subject to its notice requirements. It has no noncommercial restriction. Recipients may build their own commercial versions or services. [MIT text from the Open Source Initiative](https://opensource.org/license/mit)

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
