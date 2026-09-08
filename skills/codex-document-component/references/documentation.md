# WARP documentation contract

Apply this contract to the current `warp-ds/docs` checkout. All `docs/...` paths below are relative to that repository, not to this skill. Read the target's existing pages and the current renderer before editing. Preserve useful examples and component-specific guidance.

## Scope and evidence

The usual scope is `docs/components/<slug>/{overview,usage,accessibility}.md` and their assets. Read `frameworks/` for context; change framework pages, examples, navigation, and the framework manifest only when included in the assignment. Report discovered errors outside the assignment to the lead.

Keep these sources distinct in the component brief:

| Source | What it can establish |
| --- | --- |
| Current implementation, package version, and tests | Available APIs, defaults, deprecations, semantics, keyboard handling, focus, validation, and animation |
| Current Figma file, branch, and nodes | Design terminology, component parts, visual variants, states, and intended composition |
| Finished component documentation | Useful structure, explanation, examples, and presentation conventions |
| Current primary standards and platform guidance | Requirements or recommendations, including their level, units, scope, and exceptions |

Record links and versions for claims that affect implementation or accessibility. Compare the docs site's installed package with the source revision being inspected; a change on `main` is not proof of behaviour in the installed release. Check that referenced components, properties, exports, defaults, and code examples exist. Recheck deprecated APIs rather than propagating an old example.

Separate what the library supplies from what the application must implement. Source inspection can establish a role or event handler; it does not prove the exact announcement produced by every screen reader. Label evidence in the handoff as source-verified, tested in a named environment, or still unverified. Do not invent certainty, a test result, or behaviour from a neighbouring component.

## Curated references

These aspects were inspected on 2026-09-08. Read the current files each run; the table is a starting point, not an endorsement of every claim or sentence. A sheet or Jira status of Done does not guarantee correctness.

| Example in the docs repository | Learn from it |
| --- | --- |
| `docs/components/radio/overview.md` ([source](https://github.com/warp-ds/docs/blob/main/docs/components/radio/overview.md)) | Live grouped examples, state explanations, numbered anatomy, and cross-platform naming |
| `docs/components/radio/usage.md` ([source](https://github.com/warp-ds/docs/blob/main/docs/components/radio/usage.md)) | Small, focused Do/Don't pairs with actual choices and meaningful alt text |
| `docs/components/radio/accessibility.md` ([source](https://github.com/warp-ds/docs/blob/main/docs/components/radio/accessibility.md)) | Component-specific keyboard table, separate Web/iOS/Android discussion, implementation limitations, and practical tests |
| `docs/components/alert/overview.md` ([source](https://github.com/warp-ds/docs/blob/main/docs/components/alert/overview.md)) | Variant purposes, concrete messages, alternatives, and a Figma-to-platform naming table |
| `docs/components/alert/accessibility.md` ([source](https://github.com/warp-ds/docs/blob/main/docs/components/alert/accessibility.md)) | Detailed explanation of announcement timing and platform differences; reverify claims against the target release |
| `docs/components/button/overview.md` ([source](https://github.com/warp-ds/docs/blob/main/docs/components/button/overview.md)) | Images made from rendered WARP components, numbered anatomy, and explicit platform defaults |

Choose references by the aspect being written. Do not copy Radio's interaction model into another control or import Alert's verbosity into a simpler component.

## Page responsibilities

Preserve the house shell: `# <Name> - Overview`, `Usage`, or `Accessibility`; a concise definition; relevant related-component links; `<ComponentsStatus />`; and `<component-questions />` where used by current pages. Use sentence case headings and the terminology defined in the brief.

**Overview** explains what the component is and how its parts and variants differ:

- Give a short definition and explain the difference from likely alternatives.
- Include working examples when supported by the current docs runtime. Use the existing `<ThemeSwitcher />` and `<style-isolate>` conventions.
- Explain variant purpose, available states, sizes, and anatomy where meaningful. A size is not a state. Do not manufacture loading, error, or hover variants to fill a template.
- Add a Figma / Web (Elements) / iOS / Android naming table when terminology or availability differs. Distinguish unsupported from unverified; do not imply every platform offers the same feature.
- Use numbered anatomy callouts with a matching text legend. Name optional and platform-specific parts accurately.

**Usage** helps someone choose and apply the component:

- Explain when to use it and when another component is better, with working links to those alternatives.
- Cover the actual selection, validation, placement, layout, content, or timing decisions relevant to this component.
- Explain consequential behaviour with concrete product examples. Keep API detail in framework pages unless it changes a design decision.
- Use illustrations to teach a decision that benefits from a visual comparison. Avoid repeating the same lesson across prose and several pairs.

**Accessibility** must provide substantive coverage of all six areas, with headings suited to the component:

1. General: the component's specific accessibility problem and who supplies labels, state, and relationships.
2. Keyboard: actual keys, focus entry and exit, activation, disabled behaviour, and relevant exceptions. A noninteractive element may have no keys of its own; explain its focusable content instead of inventing a keyboard model.
3. Screen readers: roles, names, states, group relationships, announcements, and timing. Separate intended outcomes from implementation facts and observed test results.
4. Visual accessibility: relevant contrast, colour independence, focus, resizing, reflow, target size, and motion considerations.
5. Platform-specific behaviour: distinguish Web, iOS, and Android wherever they differ. Identify application responsibilities and known implementation limitations.
6. Testing: concrete checks for the described behaviour, including manual input and assistive-technology testing where relevant. Automated scans alone do not establish usability.

Do not add `<DoDont>` or a Do/Don't section to `accessibility.md`. Use prose, lists, and tables. Do not paste generic promises about VoiceOver, TalkBack, Dynamic Type, reduced motion, or minimum touch sizes. Verify the target implementation and consult the current primary standard for each normative claim; state units and distinguish a requirement from a recommended larger target.

## Do/Don't markup

Use the registered components for paired Do/Don't guidance, never a comparison table or bold pseudo-headings. Every wrapper contains exactly one `<Do>` and one `<Do not>`; additional pairs need separate wrappers because the renderer uses fixed grid areas. Both children need an existing image and meaningful `imgalt`.

This is the established Radio pattern; substitute the target's verified assets and lesson:

```markdown
<DoDont>
<Do imgurl="/docs/components/radio/DoDonts/usage-group-label-do.svg" imgalt="A Radio group with a visible label above its options.">

Give related options one clear group label.

**Why**: The label explains what question the choices answer.

</Do>
<Do not imgurl="/docs/components/radio/DoDonts/usage-group-label-dont.svg" imgalt="Radio options with no visible group label.">

Present options without saying what question they answer.

</Do>
</DoDont>
```

Leave blank lines after opening `<Do>` tags and before closing `</Do>` tags so Markdown is parsed. Add a reason when the consequence needs explaining; do not repeat the same reason in both captions. Keep one lesson per pair, use plausible mistakes, and remove duplicates. A content subsection usually needs at most one pair; use roughly three focused best-practice pairs only when each earns its place. There is no quota.

`imgurl` binds directly to `src`, so its current deployed URL needs `/docs/components/...`. Ordinary Markdown images and static `<img src="/components/...">` use `/components/...`; VitePress applies the site base. Confirm `base` in `docs/.vitepress/config.js` if deployment changes. See [illustrations.md](illustrations.md) for asset preparation and visual standards.

## Missing content and actual limitations

Public docs must not contain empty headings, `TBD`, `LINK`, “coming soon”, `<InProgressStatus />`, or captions advertising unfinished artwork. An internal draft may contain clearly recorded placeholders, but placeholders never satisfy the finished illustration requirement.

This rule concerns unfinished documentation. Preserve verified product limitations and explain their impact and supported workaround; hiding an accessibility limitation makes the docs misleading. Record unknowns, missing sources, omitted planned sections, and missing artwork in the lead's handoff and tracking tasks. If an optional section adds no supported information, omit it cleanly. If agreed coverage cannot be completed, report it as unfinished instead of silently calling the component Done.

## Integration checks

- Before adding image references, verify every asset exists, is nonempty, and is a valid image rather than an API error response. Check both Do/Don't images and ordinary images on disk.
- Read the current `package.json` and repository instructions. Run `pnpm build` and the appropriate read-only repository checks, currently `pnpm lint:check`; a dev server alone is insufficient. Avoid the auto-fixing `pnpm check` as a routine gate because it can change unrelated files.
- A successful build is not an image or link audit: the current config ignores some `/docs` links, and bound image URLs may escape build validation. Check actual rendered requests and links.
- Regenerate the framework manifest only if framework pages changed as part of the assignment.
- Inspect the actual pages at desktop and narrow widths, and in relevant brands and light/dark themes. Check live examples, overflow, callout legibility, image crops, and one pair per wrapper.
- Report completed checks, checks not run, unresolved findings, and the source versions. Completion requires the agreed prose, real illustrations, integration, and review; tracking updates must reflect that evidence.
