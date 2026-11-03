# Delivery, optional agents and who pays

**Decision:** a standalone local mini app, with native Comfy workflows and optional agent access. Each user connects their own Comfy workspace.

**As of:** November 2, 2026. Local v0.1 implemented; independent recipient billing remains untested.

## Current delivery

Users run the Node app locally, open its browser studio and connect their own Comfy account through OAuth. The studio uploads only approved sources, submits a saved workflow, polls the existing job and retrieves results. Its runtime has no shared maintainer credential or public generation endpoint. One process serves one local user; do not deploy it as a hosted multi-user service.

An agent is optional. WebMCP tools prepare the browser when supported; a clipboard brief works with Codex or Claude. No Soundscape plugin is required. Native workflow/App Mode downloads are an alternate route: import into the user's own workspace, supply source files and run there.

| Delivery | Agent required? | Execution owner | State |
|---|---|---|---|
| Local studio + OAuth | No | Account/workspace selected by the local user | Implemented; one-account live proof |
| Native Comfy workflow/App Mode | No | User's own imported copy/workspace | Implemented and executed |
| WebMCP / clipboard handoff | Optional | Same user-approved Comfy route | Experimental browser tools + handoff |
| Local self-hosted Comfy target | No | User's hardware and model rights | Not integrated or verified |
| Hosted managed compute | No | Requires a separate funded service design | Not implemented |

OAuth tokens remain in server memory, never in the page or repository. Restart requires reconnecting. The connection badge indicates authentication only; credits and execution entitlement are separate. Costs are currently marked variable rather than estimated. Each generation opens a review with explicit unchecked credit consent. Runs are not automatically retried.

## Costs and account boundaries

Comfy's published pricing describes credits for Cloud runtime and partner execution. The external agent a user chooses may have its own usage costs. Installing this repository does not include either service. Rates and entitlements must be checked at use time. [Comfy pricing](https://comfy.org/pricing)

| Path | What the user supplies | Who bears execution cost |
|---|---|---|
| Own Comfy Cloud workspace | Their account, applicable access and credits | That workspace |
| Own local Comfy, native models | Compatible hardware, model access and runtime | Their hardware/energy; rented hardware is their bill |
| Partner node, including in local Comfy | Their authorized Comfy/partner billing arrangement | Their selected account/arrangement; local UI does not make a partner call free |
| Optional external agent via MCP | Their agent access and own Comfy connection | Agent usage under their arrangement; Comfy execution separately |

Comfy workspaces own plans and credits; team members share a credit pool. Therefore the starter must not invite public users into the maintainer's team workspace. This is a design inference from the documented workspace model, not a billing test performed here. [Workspace and shared-credit guide](https://support.comfy.org/articles/1707576471-team-workspaces-create-invite-and-manage)

The MCP documentation supports account-based Cloud connection, OAuth in supported interactive clients, and a distinct local route. The currently exposed hosted Cloud connector cannot control a local Comfy installation. A local path needs its own documented connector/runtime. [Comfy MCP](https://docs.comfy.org/agent-tools/mcp)

Comfy's built-in Agent is another optional control surface and spends credits for its own conversations as well as workflow runs. It is not required by Soundscape Studio. [Comfy Agent cost explanation](https://support.comfy.org/articles/4013072355-comfy-agent)

## Safeguards for experimental source distribution

- No bundled API key, OAuth token, creator-workspace invitation or creator-funded run endpoint.
- Users identify their execution target and own it before a job starts. Never use a hidden default maintainer target when sign-in fails.
- A share link opens a copy/configuration; never assume it confers independent billing. Verify the actual recipient flow.
- Before a paid run, show the selected route and cost estimate when available, or mark the cost unknown. Cap variants/retries under the user's explicit budget.
- Fail closed on missing access or credits. Do not invite a maintainer-funded fallback, buy credits or auto-create a deployment.
- Keep credentials inside the user's supported client or runtime. Never ask for secrets in a public issue, repository or chat transcript.

## Billing acceptance test

Before claiming independently verified recipient billing isolation, test with two separately authorized workspaces/users. The experimental source uses local operator OAuth by design; one-account live execution is the current evidence. Share the actual candidate app/graph without credentials. Have the recipient sign in, import their own copy, run one bounded job and retrieve its output. Record the recipient's job/workspace and usage evidence, and verify no matching job or usage landed in the author's workspace. Use only redacted evidence in public documentation.

Also test missing sign-in, missing credits and reconnect/retry. The product must fail visibly rather than spend from a hidden fallback. This test needs a separately authorized recipient/workspace and bounded spend; the development operator’s successful run does not satisfy it.

## Later monetization

A paid UI, project-management layer, team tooling, support or premium additions can sit above user-owned Comfy compute. If managed compute is ever offered, it needs its own funded limits, pricing and operating contract; it cannot inherit an open-ended subsidy from this public repo. [Open-source and commercial policy](OPEN-SOURCE.md) owns the license boundary.
