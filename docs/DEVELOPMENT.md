# Development

Requires Node.js 22+ and npm; verified with Node 24.21.0. Runtime dependency: official MCP client 2.4.0. The frontend is plain HTML/CSS/modules; no build step.

```sh
npm ci
npm start
```

Open http://127.0.0.1:4317. `PORT` can select another local port, but use the displayed 127.0.0.1 URL for OAuth and actions. Keep one local server per person. Stop with Ctrl-C. A server restart requires reconnecting Comfy; known job/result files remain under ignored `local/`.

Viewing the demo, choosing local media, editing names and exporting workflows need no Comfy connection. Creating media needs OAuth, execution access and credits. Never add a provider key to source or `.env` as a shortcut. All creation remains Comfy-contained.

## Verification

```sh
npm test
npx playwright install chromium
npm run test:e2e
```

Keep the server running for browser checks. Playwright 1.63.0 is a pinned development dependency. The suite intercepts generation endpoints, uses a synthetic microphone and writes evidence to a temporary directory printed on completion. It spends no Comfy credits and records no person. Chromium's experimental WebMCP feature is enabled only in that isolated test browser, not in the user's browser.

The suite covers the viewport layout, progress, consent, frame/scene libraries and naming, OAuth draft recovery, workflow exports, synthetic microphone release, real bundled playback and all 14 native WebMCP tools. Generated-frame fixtures use different image bytes from the included example so deduplication cannot hide selection/removal recovery bugs. Blocked-popup and hidden-preview playback checks preserve connection and listening behavior. Separate real Comfy execution evidence is documented in [IMPLEMENTATION.md](IMPLEMENTATION.md).

## Workflow source

```sh
python3 scripts/build-workflows.py
```

`vendor/comfy/world-base.json` is the inspected integrated native LTX/finishing graph. `worlds.json` owns movement prompts; the generator produces ordinary and native-microphone variants. Legacy appearance-preset workflow IDs remain for older clients. Root `frame-presets.json` owns still-image appearance recipes; the generator copies its served projection into `studio/`. Z-Image and MiniMax workflow sources are separately retained in `workflows/`. The rebuild performs no inference.

## Storage and debugging

Browser localStorage holds settings. IndexedDB holds drafts, frames and scene metadata. Clear browser draft is in **How it works** and preserves the frame/scene library. Site-data deletion removes browser-owned data. Run history and downloaded outputs belong to `local/`; do not delete it to work around uncertain submissions. Inspect the existing Comfy queue/job identity first.

Never commit `local/`, credentials, real environment files, private prompts or local absolute paths. The bundled original demo is an explicit exception to generated-media exclusion. Do not expose the local server as a public service; hosted tenancy is unimplemented.

`AGENTS.md` owns project instructions; GitHub Issues owns tasks/defects; `SPEC.md` owns scope; `DESIGN.md` owns the interface; `docs/IMPLEMENTATION.md` owns actual proof and limits.
