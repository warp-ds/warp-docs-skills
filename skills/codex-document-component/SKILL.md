---
name: codex-document-component
description: Coordinates specialist agents to write, illustrate, and review WARP component documentation using implementation source, Figma, the documentation progress sheet, and Jira. Use when creating or improving WARP overview, usage, or accessibility pages, including anatomy and Do/Don't illustrations.
---

# Document a WARP component

Deliver documentation that explains real component behaviour, teaches useful design decisions, and matches the current WARP documentation site. Act as the documentation lead; delegate bounded work to the specialist roles below.

## Start here

This directory is a complete skill bundle. A user can point a Codex session at this `SKILL.md` and name the component, for example:

> Read skills/codex-document-component/SKILL.md. Improve Select's missing Do/Don't illustrations, using Radio as a reference, and update its documentation ticket.

Resolve all bundled paths relative to this file's directory, regardless of the session's working directory. Locate the `warp-ds/docs` checkout separately. Read the applicable repository instructions in both locations. Keep edits in the documentation checkout; this skill repository supplies instructions.

For installed discovery, copy this **entire directory** into an appropriate Codex skills directory, such as `~/.agents/skills/codex-document-component/`. The repository's older installer copies only `SKILL.md` and does not install this bundle. Direct-path invocation needs no installation. No global agent configuration or other installed writing skill is required.

## Establish the assignment

1. Read [WARP context](references/warp-context.md) to find the repositories, progress sheet, Jira board, and Figma files. Check live status and access; those links are starting points, not a cached completion report.
2. Read [workflow and handoffs](references/workflow.md). Identify the component, requested sections, supported platforms, linked documentation issue, reference pages, and the requested end state. If no component is named, propose candidates from the sheet and Jira and ask which to work on; do not choose someone else's active assignment silently.
3. Read [documentation standards](references/documentation.md) and [writing guidance](references/writing.md). Read Radio's relevant pages and any additional aspect-specific reference. Read [illustration guidance](references/illustrations.md) when visual work is needed.
4. Build the shared component brief described in the workflow. Highlight missing inputs and explain which work they block. Continue independent work; do not manufacture implementation behaviour, file permissions, approvals, or artwork provenance.

The usual scope is `overview.md`, `usage.md`, `accessibility.md`, and their assets. Preserve useful existing content. Treat framework API pages, implementation fixes, site-wide styling, and publishing as separate work unless included in the request.

## Delegate specialists

The Markdown files in `agents/` are **role instructions**, not automatically registered Codex agent types. `agents/openai.yaml` is skill UI metadata, not a subagent registry.

Use the host's available spawn, message, and wait tools. For each assignment, load the corresponding role file and pass its instructions plus the shared brief and absolute paths to relevant bundled references. Use an available general worker/default agent type; do not invent a tool name or assume `warp-accessibility` is registered. A read-only explorer is unsuitable for a writing assignment.

| Role | Load | Ownership |
| --- | --- | --- |
| Accessibility | [accessibility.md](agents/accessibility.md) | `accessibility.md`; source evidence and proposed corrections elsewhere |
| Anatomy | [anatomy.md](agents/anatomy.md) | Anatomy, variant, and state assets; legends and alt text |
| Do/Don't | [do-dont.md](agents/do-dont.md) | Paired illustration assets, captions, alt text, and placement suggestions |
| Reviewer | [reviewer.md](agents/reviewer.md) | Independent findings after integration; no edits or tracker writes |

You own `overview.md`, `usage.md`, shared terminology, integration, git operations, and external status updates. Establish each Do/Don't lesson before assigning illustration. Give workers disjoint files and tell them other workers share the checkout. Wait for the needed outputs and resolve conflicts before final integration.

Spawn only roles that the assignment needs. Accessibility and the two visual roles can work in parallel after the brief is ready. Respect the host's concurrency limit; run the reviewer after writer outputs are integrated. Inherit the user's model settings unless they request otherwise. If delegation is unavailable, report that limitation and perform the same roles sequentially; never claim independent review occurred.

## Produce, review, and finish

1. Verify behaviour against the actual platform source/version. Distinguish implementation facts, standards, recommendations, and checks actually performed.
2. Reuse Figma documentation artwork or real component assets. Where native Figma editing is available and authorized, coordinate writes to the agreed file/page. Verify exported assets on disk before inserting final image references.
3. Integrate the specialist outputs. Apply the two writing passes in [writing.md](references/writing.md), preserving exact identifiers and necessary caveats.
4. Run the appropriate build and read-only lint checks, then inspect the rendered pages. Have the reviewer examine the assembled result. Resolve findings, or identify the specific unfinished work in the handoff.
5. Follow the tracking and publication rules in [workflow.md](references/workflow.md). Existing authorization carries through; ask only for genuinely missing decisions or permissions. A skill does not itself authorize external messages or publishing.

Report the changed files and preview/PR link, evidence and checks, missing items with their impact, and any Jira/sheet updates made or proposed. Explicitly distinguish draft ready, reviewed, and published. Generated placeholders, missing required illustrations, and unverified claims do not count as finished documentation.
