# WARP sources and access

Locations checked on **8 September 2026**. Revalidate live content, issue status, access, and API capabilities at the start of a run. Do not persist credentials, personal assignments, expiring export URLs, or copies of internal ticket discussions in this shared skill bundle.

## Repositories and published documentation

| Source | Location | Purpose |
| --- | --- | --- |
| Documentation | https://github.com/warp-ds/docs | VitePress pages, rendering components, and final exported assets |
| Published site | https://warp-ds.github.io/docs/ | Check the published result separately from a local draft |
| This skill | https://github.com/warp-ds/warp-docs-skills/tree/main/skills/codex-document-component | Portable instructions and role briefs |
| Elements | https://github.com/warp-ds/elements | Web implementation, package exports, and component accessibility source |
| React | https://github.com/warp-ds/react | Verify legacy React behaviour when that implementation is in scope |
| Vue | https://github.com/warp-ds/vue | Verify Vue behaviour when in scope |
| iOS | https://github.com/warp-ds/warp-ios | Swift implementations and accessibility semantics |
| Android | https://github.com/warp-ds/warp-android | Compose implementations and accessibility semantics |

Find the docs checkout by its git remote, not a hard-coded home directory. Common local names are `docs` and `warp-docs`. In it, content lives under `docs/components/<slug>/`, assets under `docs/public/components/<slug>/`, and rendering helpers under `docs/.vitepress/`. Check the installed dependency version and lockfile before comparing implementation tags. Do not assume repository HEAD matches the site's installed release.

Read package layouts rather than assuming every platform uses the same slug. Elements usually has `packages/<slug>/`; iOS components are under `Sources/Components/`; Android components are under `warp/src/main/java/com/schibsted/nmp/warp/components/`. React 19 wrappers may be exported from `@warp-ds/elements/react/*`; check package exports before documenting support. The docs framework status matrix describes support, not documentation completion.

Use GitHub tools, authenticated `gh`, or the repositories directly. Follow the host's identity instructions for `warp-ds/*`; do not change the user's default GitHub identity permanently. Missing repo access is a missing evidence source, not permission to guess its API.

## Google Sheets: documentation progress

- **Name:** Warp Portal Design Documentation Progress (2026)
- **URL:** https://docs.google.com/spreadsheets/d/1yYDW8zpxnZQ5cHvrzV8Jc3x-3wcc1m0O5dkMDrJ0eis/edit#gid=0
- **Spreadsheet ID:** `1yYDW8zpxnZQ5cHvrzV8Jc3x-3wcc1m0O5dkMDrJ0eis`
- **Worksheet:** `Status Benchmark`, sheet ID `0`
- **Shared drive ID:** `0ABMePaaXNKBpUk9PVA`

Read the header and locate rows by component name on every run. Never retain a row number for later writes. Current columns:

| Column | Meaning |
| --- | --- |
| A | Components |
| B | Working on it — assignment; preserve unless changing it is requested |
| C | Overview |
| D | Usage |
| E | Do's and dont's |
| F | Unlabelled; preserve |
| G | Accessibility |
| H | Unlabelled notes; preserve |
| I | Available in Fabric — separate system, not a documentation status |

Rows may contain further notes. Preserve all unrelated cells. Observed values include `Done`, `WIP`, `Incomplete`, `Missing`, and `Doesn't exist`; blank is not automatically Missing. Radio and Radio buttons (Group) are separate rows. Confirm row-to-page mapping before writing.

Use the host's Google connector or authenticated `gws`. With the CLI, first check `gws --version` and `gws auth status`; follow installed authentication/security guidance without printing tokens or creating credentials. Shared-drive ownership/permission checks through Drive need `supportsAllDrives: true`; listing files also needs `includeItemsFromAllDrives: true`. The Sheets API needs neither flag.

```sh
gws sheets spreadsheets values get --params '{"spreadsheetId":"1yYDW8zpxnZQ5cHvrzV8Jc3x-3wcc1m0O5dkMDrJ0eis","range":"Status Benchmark!A1:K1000"}'
```

Use the returned headers and exact component row to prepare narrow cell updates. Read cells again immediately before an authorized write and stop that write if the row or values changed. Read back the result afterward. See [workflow.md](workflow.md) for what each stage means.

Session-specific residency exceptions must be documented in the run's handoff when active. The research session used `VEND_PII_OVERRIDE=1`; **do not set or assume that override in a new session**. Apply the new session's policy and report a blocked connector if necessary.

## Jira: WARP board

- **Site:** https://nmp-jira.atlassian.net
- **Project key:** `WARP`
- **Board:** `WARP board`, ID `15`, type `simple`, location `Warp (WARP)`
- **Board URL:** https://nmp-jira.atlassian.net/jira/software/projects/WARP/boards/15

Use the host's Jira connector or authenticated Atlassian CLI. With `acli`, check its version and authentication, then search before choosing an issue:

```sh
acli jira auth status
acli jira board search --project WARP --json
acli jira workitem search --jql 'project = WARP AND (summary ~ "Select" OR summary ~ "documentation") ORDER BY updated DESC' --fields key,summary,status --limit 50 --json
acli jira workitem view WARP-1426 --fields summary,status,description,parent --json
```

Replace the sample component with the actual component. Narrow results to the correct documentation work, not an implementation/refactor ticket with a similar title. Read its description, acceptance criteria, parent, relevant comments, and linked issues. Comments require JSON issue output; CLI search cannot retrieve them. Use `--help` for the installed CLI before mutations. `board view` replaces the deprecated `board get` in newer versions.

`WARP-1426` is an existing epic for an eight-component docs/source accuracy audit (Alert, Button, Modal, Text field, Select, Tabs, Snackbar, Tooltip). It is a **candidate only for matching remediation work**, not the parent for every new documentation task. `WARP-1390` covers a Slider/Range slider documentation update. Re-read scope/status instead of treating these as blanket assignments. Find the appropriate existing component epic for new issues; if none can be established, highlight the missing parent and continue the documentation work.

Observed issue statuses include `Backlog`, `TODO`, `Doing`, `Design review`, `Done`, and `Won't do`. Discover the transitions available for the chosen issue. `statusCategory = Done` can also include `Won't do`, so it is not evidence that documentation shipped. The sheet and Jira measure different things; retain discrepancies for reconciliation.

## Figma: library and documentation

| File | URL / key | Use |
| --- | --- | --- |
| **WARP - Components** | https://www.figma.com/design/oHBCzDdJxHQ6fmFLYWUltf — key `oHBCzDdJxHQ6fmFLYWUltf` | Real component variants, properties, styles, and library assets; file name and main branch verified |
| **Warp Portal - Documentation** | https://www.figma.com/design/pLorEdyAMCZXoxkaCSgREO/Warp-Portal---Documentation?node-id=5449-8890 — key `pLorEdyAMCZXoxkaCSgREO` | Documentation layouts and existing illustrated guidance; link comes from the existing WARP skill, revalidate file access and target nodes |

The org/team administration URL and a dedicated agent-editing page are **not verified**. The file links are enough to start reading and exporting. Identify the intended page/frame with the user or from an explicit task before creating/editing artwork; do not guess an organisation URL or edit the published library masters by default.

The custom `figma-design-system` MCP in this repository defaults to the Components file. Search/read/export tools work, and it can post comments. Its frame-creation and node-editing functions are placeholders. It stores its active branch as shared mutable state. Establish the file/branch once and do not let parallel agents switch it.

For native authoring, use the **official remote Figma MCP** when its `use_figma` tool is available: https://mcp.figma.com/mcp. It supports native frames, instances, variants, variables, and auto layout in supported clients, including Codex. Writing requires a Full seat and edit permission for the destination file. A connected export-only MCP does not establish either capability. See [write to canvas](https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/) and [remote setup](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/).

Check the live tool list, file access, library access, fonts, and applicable export limitations. Do not install a connector or change a subscription as an implicit step. If native writing is unavailable, reuse/export existing assets or compose truthful local illustrations, following [illustrations.md](illustrations.md). Disclose that fallback. Never report a locally composed SVG as a newly authored Figma frame.
