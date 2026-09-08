# Coordination, evidence, and completion

## Preflight and missing information

Read [warp-context.md](warp-context.md) for the actual source locations. Inspect the user's request and existing authorization before asking anything again. A normal run needs a component, requested outcome, docs checkout, appropriate source access, and agreed scope. A targeted prose edit does not need every illustration tool.

Report a compact capability/missing-input table early. State what was checked rather than assuming an installed integration is authenticated:

| Check | If missing |
| --- | --- |
| Component identity and requested sections | Ask a focused question; do not merge Radio and Radio group or other distinct components |
| Docs checkout and applicable instructions | Locate by git remote; prepare an isolated checkout if needed; never overwrite existing work |
| Implementation source/version for a claim | Flag that claim as unverified; obtain evidence before publishing it; work on independent sections |
| Sheet or Jira access | Continue local drafting with the available evidence; label status/assignment unverified and leave precise proposed updates |
| Matching documentation issue/epic | Search and read candidates; avoid creating duplicates; highlight ambiguity without blocking local writing |
| Figma read/export access | Use traceable existing assets if adequate; identify any unavailable visual evidence |
| Native Figma write tool, Full seat, file edit permission, target page | Block native writes only; reuse assets or prepare local artwork/briefs within the authorized scope |
| Font/library/required design asset | Report which illustration is affected and what a designer needs to provide |
| Subagent tools/concurrency | Run available roles in batches or sequentially; disclose loss of independent review |
| Build, browser, or screen-reader access | State which checks remain unperformed; do not turn an inspection into a claimed test |

Classify each missing item as **blocks this claim/action**, **blocks completion**, or **non-blocking context**. For example, an unknown Figma organisation URL does not block exporting from a known accessible file, while an unknown editing destination blocks canvas writes. Do not repeatedly retry an authentication or permission failure without a changed condition.

## Shared component brief

Gather sources once. Keep a concise working brief in the session or an untracked working location outside the published docs; give all workers the same revision. Do not commit internal ticket text or personal assignment data into public documentation.

Include:

- Component name, docs slug, sheet row identity, chosen Jira key/parent, task scope, intended completion stage.
- Docs checkout root, branch, applicable repository instructions, existing changes to preserve, and exclusive file ownership.
- Current sheet values and Jira status with retrieval time; conflicts or active assignments that affect the work.
- Supported implementations, installed versions or source commits, source files, and claims that need verification.
- Reference pages and **which aspect** to follow; Radio is a starting point, not evidence for another component's behaviour.
- Figma file/branch/page/node URLs, available variants/assets, authorized editing destination, and export/authoring capability.
- Shared terminology and platform naming differences.
- Requested anatomy parts and each Do/Don't lesson, scenario, expected contrast, caption intent, and asset names.
- Missing inputs, unresolved product decisions, and checks that require user/designer/device involvement.

For important implementation claims, retain an evidence row:

| Claim | Platform/version | Source file/commit or standard URL | Verification method | Result or uncertainty |
| --- | --- | --- | --- | --- |
| Example: how a radio group moves focus | Exact package/tag under review | Implementation and test locations | Source inspection / keyboard test / screen-reader test | Describe only what that method establishes |

Standards and platform guidance require authoritative current sources. Source inspection can establish a default or handler but cannot establish exact announcements across all browser/screen-reader combinations. Keep normative requirements, implementation behaviour, recommendations, and observed test results distinct.

## Dispatch and integration

The role files are bundled Markdown prompts, not custom agent types requiring installation. Resolve their absolute paths from the skill directory. Use the host's actual delegation API and available worker/default types. When passing only paths, explicitly instruct the worker to read its role file and relevant shared references before starting; do not assume it inherited the lead's loaded skills.

A dispatch message should state:

> Act as the role in `<absolute role-file path>`. Read these shared references: `<relevant absolute paths>`. Work from this component brief: `<brief>`. You own `<files/assets>` and must not change other workers' files. Other agents share this checkout; preserve their edits and accommodate their outputs. Return the result, source evidence, checks actually performed, and unresolved items. Do not commit, publish, post comments, or update trackers. The lead coordinates Figma writes and final integration.

Use full-role specialization for a substantial component assignment; skip irrelevant roles for a small edit. With only three worker slots, accessibility, anatomy, and Do/Don't run while the lead writes overview/usage. Start the independent reviewer after those workers finish. Avoid nested delegation unless a bounded subtask materially helps and fits the live concurrency budget.

Anatomy and Do/Don't workers may prepare local assets concurrently in disjoint paths. Figma canvas writes are serialized: the lead establishes the target, delegates one bounded write batch, waits for verification, and then allows the next. Do not switch the custom MCP's shared branch during another worker's reads/exports. Preserve node IDs and an asset manifest so the next worker uses the same evidence.

Every worker returns:

1. Result and owned files/artifacts; proposed snippets for shared pages.
2. Source links/versions supporting its claims or artwork provenance.
3. Checks performed and their results, with source inspection separate from interaction testing.
4. Missing inputs, remaining work, and any decision that affects another role.

Integrate consistent definitions, terminology, numbering, captions, alt text, and platform caveats. Verify images exist and show the intended lesson before adding the final reference. Review disputed claims against source; do not decide by which agent sounds most certain.

Apply the two editorial passes in [writing.md](writing.md). Use the review role on the assembled pages and rendered output, not isolated drafts. Resolve findings with the responsible worker, then recheck affected results only.

## Verification and stages

Use the docs checkout's current package scripts. The established commands are `pnpm build` and `pnpm lint:check`; the latter is read-only. Avoid `pnpm check` as a routine gate because it auto-fixes unrelated files. Run `pnpm generate-frameworks` only when framework files changed and inspect its output. A dev server starting is not proof that the production build passes.

Inspect the actual changed pages in a browser: images and links, Do/Don't pairing, diagram numbers, clipping, readable text at the rendered column width, narrow layouts, and light/dark themes where relevant. Compare artwork to Figma/reference components. A build cannot verify the image's teaching value. Never claim screen-reader/device testing unless it was actually performed.

| Stage | Meaning |
| --- | --- |
| Draft in progress | Some required content, illustrations, verification, or product decisions remain |
| Draft ready for review | Requested content and final artwork exist, applicable checks passed, evidence is recorded, and remaining limits are explicit |
| Reviewed | Required editorial/design/technical review has occurred and findings are resolved; identify what review actually happened |
| Published | The approved change is merged/deployed and the published pages have been checked |

An agent review does not substitute for a Jira acceptance criterion requiring DS/design sign-off. Placeholders and omitted required work cannot be hidden by labelling the rest complete. Report incomplete documentation internally; preserve truthful product limitations and workarounds on the public pages.

## Jira, sheet, and publication actions

The **lead alone** updates external state. Read-only planning/auditing does not transition tickets. During execution, honour tracking actions requested by the user or already authorized in the session; do not re-ask. If tracking writes are outside the request, return exact proposed changes and identify that limit. A skill does not grant new authority to send messages or publish.

For authorized Jira updates:

1. Re-read the selected issue, acceptance criteria, assignee, parent, and status. Confirm it is the correct documentation issue; preserve unrelated fields and human assignments.
2. Check available transitions. `Doing` may fit active work and `Design review` may fit a ready draft, but use only transitions actually supported by that issue. Do not reopen a completed ticket solely because the sheet differs.
3. Update only the requested fields/state. Re-read afterward. Do not blindly retry an uncertain write; first check whether it succeeded. Include the PR/review link where requested. Posting a comment requires message authorization; a status-update request alone does not imply a comment.
4. Set `Done` only when that issue's acceptance criteria, including required human review/publication, are satisfied. New issues require a matching epic and creation authorization; reuse an existing issue when appropriate. Do not attach everything to the example audit epic.

For authorized sheet updates, locate the exact component row and current headers afresh. Modify only the relevant section cells. Preserve ownership, notes, blank columns, and Fabric availability. Use existing values such as `WIP`; set `Done` only for sections whose agreed completion criteria are satisfied. If the sheet's meaning of Done is unclear, retain its current value and report the ambiguity instead of choosing a new definition. A draft PR is not sufficient evidence on its own.

When a write fails, record the attempted update and current state without blocking unrelated local work. If a permission/approval boundary genuinely prevents an action, state which action and why; do not repeatedly ask about work already authorized.

For an authorized PR, stage only the intended documentation and assets, check the diff, and provide the concrete problem/result plus validation and outstanding review needs. Follow repository commit/PR attribution rules. Do not include credentials, internal discussions, or fabricated verification. A request to open a PR authorizes opening it; merging and deploying require their own applicable authorization.

Finish with a usable preview or PR link, changed sections, validation, asset provenance location, missing items and their impact, review/publication stage, and the exact tracker updates made or still needed. If everything required is present, say that explicitly.
