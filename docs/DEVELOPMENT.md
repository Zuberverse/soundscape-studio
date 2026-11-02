# Development setup

**Stage:** documentation foundation, November 2, 2026.

There is nothing to install or launch yet. No package manager, application
dependency set, model files, workflow JSON or CI build has been added. The
architecture is a proposal, not a working starter application.

## Read and contribute

Read [AGENTS.md](../AGENTS.md), [SPEC.md](../SPEC.md) and [PLAN.md](../PLAN.md).
Use ordinary Markdown tooling and `git diff --check` for documentation work.
Check local relative links, factual citations, stage labels and the public-data
boundary. Code tests and model-backed QA are not applicable to this foundation.

GitHub Issues owns implementation work and unresolved defects. Planned features
are described as planned. No recorded software defects would imply little here,
because no executable application has been inspected.

## First workflow implementation

Start with a versioned Comfy graph and App Mode configuration in the user's own
workspace. Record graph provenance, required nodes/models, run instructions and
a verified separate-user billing check. An agent companion is optional; no
plugin package or custom MCP server is created in this foundation.

## If a custom application becomes necessary

The implementation task must record and test:

- Supported Node/Python versions, dependency pins, package manager and lockfiles.
- Reproducible install, start, check, build and clean-clone smoke commands.
- A safe environment example with names only; no real secrets in browser code.
- Comfy target and protocol, exact models/nodes, source revisions and licenses.
- Local service ports, media storage, job recovery and deletion behavior.
- One verified import → Comfy job → export path and its actual resource use.
- Appropriate unit/integration checks and CI after code exists.

Do not publish guessed commands or imply SDK compatibility from documentation
presence alone. Check the current upstream docs when selecting the stack.

## Developer-agent setup

AGENTS.md is the single repository instruction source. Codex is the initial
document-authoring consumer; native loading in a future fresh clone is a
separate verification step. Other hosts may use their native AGENTS.md support;
no duplicated adapter, global skill library, private memory, MCP configuration or
persistent agent role is shipped. No product agent or automatic generation loop
is part of the initial architecture.

Local maintainer hooks are machine configuration, not a repository dependency.
This stage has no executable CI workflow. Add portable repository checks with
the first implementation; passing a documentation check never proves the app
or Comfy backend works.
