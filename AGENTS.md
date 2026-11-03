# Project instructions

Soundscape Studio is a public open-source Music to World tool. Start with
README.md, SPEC.md, PLAN.md and WORKSTREAM.md. Technical design and evidence
live in docs/ARCHITECTURE.md and docs/RESEARCH.md. DESIGN.md owns the studio interface. GitHub Issues is the
canonical task/defect owner; check it before relevant work and reuse existing IDs.

The local app and native Comfy workflows are implemented. Read docs/IMPLEMENTATION.md
for actual behavior and proof. Validate with npm test; browser tests use npm run
test:e2e with the local server running. All paid generation needs a task-specific
budget. Preserve existing native workflow versions and local user data.

The current delivery is a single-user local studio with Comfy OAuth and native
workflow/App Mode exports; agent access is optional. Never ship maintainer credentials, a creator-funded public
inference endpoint or an invitation into a shared credit pool as default access.
Read docs/DELIVERY-AND-COSTS.md before connection or distribution changes.

Comfy is required for all generative music, image and video paths. Keep creation
and finishing workflows inspectable. No silent direct-provider fallback. Read
SPEC.md for analysis, export and soundtrack boundaries.

Preserve distinctions between proposed, implemented and verified behavior.
Never describe a repeated clip as seamless, deterministic finishing as native
audio conditioning, or a partner-node route as open-weights-only without proof.

Keep this repository independent: no private maintainer context, local absolute
paths, account state, real environment values, private source, model weights or
unlicensed media. Read current files and claims before editing; preserve peer
work. Use scoped commits and never rewrite published history. Public publication,
spend, credentials and deployment require task-specific authorization.

Original code/docs are MIT; external dependencies and media retain their own
terms. Future monetization is possible, not an implemented offer.

Validation: npm test, relevant browser checks, git diff --check, secret/private
data scan and consistency across spec, plan and current state. docs/DEVELOPMENT.md owns setup and future validation requirements.
