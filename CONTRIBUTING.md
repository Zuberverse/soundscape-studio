# Contributing

Soundscape Studio is an experimental, working local app. Useful contributions include reproducible bug reports, beginner usability improvements, Comfy workflow compatibility and documentation corrections.

Check the [issues](https://github.com/Zuberverse/soundscape-studio/issues) before starting work. Discuss large changes first. Keep pull requests focused: explain the user-visible problem, resulting behavior, checks and remaining limits.

## Work locally

Follow [README.md](README.md) to install and start the studio, then use [development](docs/DEVELOPMENT.md) for the test commands and workflow generator. Run `npm test`, relevant browser checks and `git diff --check`. Browser tests mock paid endpoints and use a synthetic microphone. New tests must not silently spend credits or record a person.

Keep generated workflow variants reproducible with `python3 scripts/build-workflows.py`. Add regression coverage for meaningful bugs; use distinct fixture media when testing frame identity, deduplication and removal. Record the browser/backend versions needed to reproduce a failure.

## Preserve the product contract

All media generation and creative finishing use inspectable Comfy workflows. Identify native versus partner/API nodes, model/node versions, costs and licenses. Preserve explicit credit review and known job identities; never blindly retry an uncertain submission. Agents remain optional, and browser agent tools must not approve spending or start recording.

Never commit credentials, account state, private input media, signed output URLs or model weights. User uploads stay private by default. Only contribute media you may publish, with its origin and applicable terms. The original bundled demo is explicitly attributed in `demo/README.md`.

Original contributions use MIT unless a different arrangement is explicitly agreed. Retain third-party notices. No contributor license agreement or exclusive relicensing grant is requested. See [the license](LICENSE), [notices](THIRD_PARTY_NOTICES.md) and [commercial policy](docs/OPEN-SOURCE.md).
