# Browser agent interface

**As of:** November 2, 2026. Experimental WebMCP support; an agent/plugin is optional.

The studio registers browser tools when a native `document.modelContext` is present, with a compatibility check for the earlier navigator API. It installs no global polyfill. Browsers without support show the clipboard **Use an agent** route. Comfy MCP and browser WebMCP have different roles: browser tools prepare the studio; the loopback server uses Comfy MCP to execute explicitly approved media workflows.

| Tool | Behavior |
|---|---|
| `get_studio_state` | Read current source readiness, name, direction, timing, connection and run state |
| `list_scene_presets` | Read movement presets and custom option |
| `select_scene_preset` | Choose a movement preset |
| `set_scene_direction` | Edit movement, camera and light |
| `load_demo_song` | Load the included original song locally |
| `set_audio_passage` | Validate and set excerpt timing |
| `prepare_song_generation` | Fill the MiniMax form and open its review |
| `list_frames` | Read reusable local frame metadata |
| `select_frame` | Select a saved frame |
| `prepare_frame_creation` | Fill a still-image description/name and open review |
| `list_scenes` | Read local scene names and states |
| `set_scene_name` | Name the next scene or leave blank for default |
| `rename_scene` | Rename an existing scene without generation |
| `review_scene_generation` | Open the scene review with credit consent unchecked |

Inputs have explicit schemas, bounds and validation. Read-only tools are annotated. Tool return values are JSON strings for the tested native interface. Errors return a message and `submitted:false`. The tools do not transmit tokens or media bytes, submit paid work, approve spending, change accounts or start recording. Browser-local IDs and filenames do not grant an external agent access to files.

Registration and calls were tested in isolated Chromium 153.0.8010.12 with `WebMCP` enabled. That proves this experimental interface in that browser version, not universal agent-host discovery or current production-browser availability. The test uses the native `getTools`/`executeTool` API and JSON-encoded inputs. Host discovery/UI and future browser API changes need their own acceptance test.

The clipboard brief includes scene/frame names, source filename, direction, timing and local studio origin. Copying is an explicit action. It contains no credentials and grants no spending permission. Review before pasting it into an external agent when filenames or creative direction are sensitive. No Soundscape-specific Codex or Claude plugin is required.
