# Demo walkthrough guide

The included [First Light MP4 download](https://github.com/Zuberverse/soundscape-studio/raw/refs/heads/main/demo/world.mp4) is a real Comfy-generated output. GitHub’s file view does not play this binary; download it or use **Example** inside the running studio. It is eight seconds long; it does not by itself show how the app works. For an entry, record a concise studio walkthrough within the organizer's two-minute limit. This guide is a proposed sequence, not a claim that a walkthrough has been recorded.

## Suggested 75–100 second sequence

| Time | Show | Explain |
|---|---|---|
| 0–10s | Studio with the included frame | Soundscape Studio is a local mini app. A reusable frame, sound and movement become a named scene. |
| 10–25s | Try the demo song, waveform and passage controls | Upload, record, describe a song with MiniMax Music 3, or use the original example. Preview only the passage needed for the scene. |
| 25–40s | Frame library and frame creation form | Frames set the visual starting point and can be reused. Descriptions create still images through Comfy. Close the form if not running it. |
| 40–55s | Movement direction and optional scene name | Camera, atmosphere and light are directed around the chosen frame. Names can change later without another generation. |
| 55–70s | Review dialog with approval unchecked | Connect a personal Comfy workspace. New creation uses its access and credits; the app supplies no shared paid key. |
| 70–85s | Example playback or a clearly identified completed scene | Show a real result. Label the bundled example as previously generated; do not present it as a new run. |
| 85–100s | Native workflow export, public repo and diagram | Z-Image-Turbo creates frames, MiniMax Music 3 creates songs, and LTX-2.3 conditions scenes on audio/image. Generation and final media composition remain in Comfy. |

If a new run is recorded, obtain a current spend allowance, preserve its identity and disclose any waiting-time edit. Use the actual output, not a mocked QA response. Keep account identifiers, private media and signed URLs out of the recording. Never expose the local server publicly to provide a try-it link.

## Technical story

The app is a plain browser studio plus a loopback Node server. The official MCP client connects to Comfy using OAuth. A scene uploads only its chosen audio passage and frame after review, submits one saved workflow and retrieves the known result. The bundled example has matching eight-second audio/video at 1280×704 and 24 fps. It demonstrates native audio-conditioned generation and Comfy finishing; it does not prove exact beat placement or a seamless loop.

Experimental WebMCP and a clipboard handoff provide optional agent access. The app also works without an agent. See [setup](../README.md#run-the-studio), [verification](IMPLEMENTATION.md), and the [current submission note](COMPETITION.md).
