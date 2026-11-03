# Setup and troubleshooting

## Explore before connecting

Run `npm ci`, then `npm start`, and open http://127.0.0.1:4317. **Example** plays the included eight-second scene without generating anything. **Try the demo song** loads its music into the sound deck. No provider key is needed.

## Comfy is connected, but a run fails

The badge confirms authentication. The workspace selected during sign-in also needs workflow execution access and enough credits; a credit balance alone may not provide execution access. Read the run error and check that workspace in Comfy. Studio does not purchase a plan or use a maintainer-funded fallback. Cost varies; review each run before approving it.

## Sign-in does not open

Allow popups for the local studio and try connecting again. A blocked popup keeps the existing connection and draft. Use the exact 127.0.0.1 address printed by the server. Sign-in happens with Comfy; do not paste tokens into the studio or a GitHub issue.

## Review and create asks for a source

Choose a frame in the library, then add sound. A frame is a still image; a scene combines it with sound and movement. Select a 2–16 second audio passage that fits inside the track and add a movement direction. Appearance changes start with a different frame. Blank scene names receive a default.

## The microphone does not record

Use localhost or HTTPS and allow microphone permission. Record at least two seconds; recording stops after 30 seconds. Check your browser's selected input device, or upload an audio file instead. Automated QA uses a synthetic microphone; real-device compatibility remains an acceptance check.

## The server restarted or the browser refreshed

Refresh restores browser-saved drafts and library metadata when storage is available. Restarting the Node server clears its memory-only OAuth credentials, so reconnect Comfy. Known job records and downloaded results remain in ignored `local/`. Keep using the existing run rather than starting another one.

If submission is marked uncertain, inspect the Comfy queue before trying again. Do not erase `local/jobs.json` to bypass recovery protection. A cancellation request does not prove the provider stopped execution; wait for its terminal state.

## Files or names disappeared

Drafts, frames and scene names belong to this browser profile and origin. Changing the port/browser or clearing site data gives a different or empty library. Imported videos are session-only. Download important results and frames. Clearing a local draft does not delete Comfy-hosted assets.

## An agent cannot discover the tools

WebMCP support is experimental and browser-dependent. Use **Use an agent** to copy a brief into Codex or Claude, or download the native workflow through **Other ways to create**. No Soundscape-specific agent plugin is required. The brief does not grant file access or spending permission.

## Report a problem

Include the browser/Node versions, steps, expected behavior and a redacted error in [GitHub Issues](https://github.com/Zuberverse/soundscape-studio/issues). Exclude credentials, account identifiers, private media and signed URLs. For implemented behavior and open limits, see [verification](IMPLEMENTATION.md).
