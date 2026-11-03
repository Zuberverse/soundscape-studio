# Security

Soundscape Studio is an experimental, runnable local application. It has not received an independent security audit and is not designed as a hosted multi-user service.

## Current boundaries

- The Node server binds to loopback and checks Host, Origin and a local session before actions.
- Comfy OAuth credentials stay in server memory; the page does not receive them. Restarting requires reconnecting. No maintainer key is distributed.
- Scene approval uploads the selected passage and frame to Comfy. Frame/song descriptions and optional lyrics are sent only when their generation is approved.
- Browser storage holds drafts and library metadata; ignored `local/` holds upload copies, run history and results. These are local files, not an encrypted vault. Local deletion does not erase provider-hosted media.
- Known job identities are recovered, and uncertain submissions are not automatically retried. Review and explicit credit consent remain required.

Use one local server per person. Do not expose it through a public tunnel or deploy it as multi-tenant infrastructure. Keep dependencies current and download important media before clearing site data. See [architecture](docs/ARCHITECTURE.md) and [implemented checks and limits](docs/IMPLEMENTATION.md).

## Report a vulnerability

Do not include credentials, private media, signed URLs or account diagnostics in public issues or pull requests. Use GitHub private vulnerability reporting when available; otherwise contact the maintainer through the public profile to arrange a private channel before sharing details. For ordinary non-sensitive bugs, use the issue tracker with redacted reproduction steps.
