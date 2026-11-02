# Delivery, optional agents and who pays

**Decision:** start with Comfy App Mode; use each user's own Comfy workspace or compute.

**As of:** November 2, 2026. Architecture recommendation; separate-user execution is untested.

## The intuitive first version

The user opens Soundscape Studio in Comfy, signs in to their own account, opens/imports their own copy, supplies music and an image, adjusts a few controls, then runs and reviews the result. The workflow and App Mode configuration are public source.

An agent is **optional**. A companion skill/plugin could later let someone say, “Make this passage feel like an aurora portal,” and have their existing agent operate the same graph through their own Comfy MCP connection. A plugin supplies method and controls; it does not include free inference or a shared model credential.

| Delivery | Is an agent required? | Intended execution owner | Decision |
|---|---|---|---|
| Comfy App Mode + public workflows | No | User's own workspace/Comfy instance | First product target |
| Companion skill/plugin using Comfy MCP | Yes, user's chosen supported agent | User's authenticated Comfy connection | Optional later front door |
| Custom local studio UI | No | User-configured Comfy target | Later if native controls limit usability |
| Public service using a maintainer key/deployment | No | Maintainer's billed infrastructure | Excluded from initial distribution |

Do not build a new MCP server when the existing official connection can operate the workflow. Packaging for different agent hosts requires separate capability/install verification; there is no universal plugin promised by this foundation.

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

## Required safeguards before runnable distribution

- No bundled API key, OAuth token, creator-workspace invitation or creator-funded run endpoint.
- Users identify their execution target and own it before a job starts. Never use a hidden default maintainer target when sign-in fails.
- A share link opens a copy/configuration; never assume it confers independent billing. Verify the actual recipient flow.
- Before a paid run, show the selected route and cost estimate when available, or mark the cost unknown. Cap variants/retries under the user's explicit budget.
- Fail closed on missing access or credits. Do not invite a maintainer-funded fallback, buy credits or auto-create a deployment.
- Keep credentials inside the user's supported client or runtime. Never ask for secrets in a public issue, repository or chat transcript.

## Billing acceptance test

Before advertising “runs on your own account,” test with two separately authorized workspaces/users. Share the actual candidate app/graph without credentials. Have the recipient sign in, import their own copy, run one bounded job and retrieve its output. Record the recipient's job/workspace and usage evidence, and verify no matching job or usage landed in the author's workspace. Use only redacted evidence in public documentation.

Also test missing sign-in, missing credits and reconnect/retry. The product must fail visibly rather than spend from a hidden fallback. Do not create accounts, invite people, spend or run this test as part of the documentation foundation.

## Later monetization

A paid UI, project-management layer, team tooling, support or premium additions can sit above user-owned Comfy compute. If managed compute is ever offered, it needs its own funded limits, pricing and operating contract; it cannot inherit an open-ended subsidy from this public repo. [Open-source and commercial policy](OPEN-SOURCE.md) owns the license boundary.
