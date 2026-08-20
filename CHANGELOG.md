# Changelog

## 1.1.0 — 2026-08-20

Brings `document-component` in line with what the Alert page actually shipped in
[docs#227](https://github.com/warp-ds/docs/pull/227) and with the findings of the August 2026
documentation audit.

### Added — WARP house rules

`document-component` now carries eight non-negotiable rules that override any other pattern in the skill.
Rules 1–5 existed locally since 11 August but had never made it into this bundle; 6–8 are new.

- **Rule 1 — Do's and don'ts use `<DoDont>`.** Never a markdown table, a bulleted list, or bold text.
  Exactly one `<Do>` and one `<Do not>` per wrapper: the grid in `DoDont.vue` has fixed named areas, so a
  third and fourth `<Do>` land in the same cells and render stacked.
- **Rule 2 — Every `<Do>` carries `imgurl` from the start.** Where Figma has no artwork, generate a named
  gray placeholder SVG under `DoDonts/` so the layout is correct and a designer has a file to replace.
  Paths start with `/docs/`, because `<Do>` binds `:src` and VitePress does not rewrite it.
- **Rule 3 — Overview illustrations sit on a `#F6F6F6` backdrop**, baked into the SVG, so edge-to-edge
  Figma exports do not disappear in dark mode.
- **Rule 4 — Do's and don'ts are judged on quality, never count.** One pair per idea, concrete examples,
  no strawman don'ts, no pair that restates prose already on the page. `accessibility.md` gets none.
- **Rule 5 — Behavioural claims are verified against the component source.** Figma and the framework pages
  describe the API, not the behaviour.
- **Rule 6 — Never publish a gap.** No `<InProgressStatus />`, no "coming soon", no "TBD", no `LINK` stubs,
  no empty headings, no "_Visual example pending_". Write the content or omit the section; gaps are tracked
  as Jira tickets under project `WARP`, never on the site.
- **Rule 7 — `overview.md` carries a cross-platform naming table** wherever Figma, Elements, iOS and
  Android disagree — and they disagree constantly.
- **Rule 8 — `accessibility.md` is never a stub.** All six sections, every claim read out of the source.

### Changed

- Default reference component is now `alert`, the most recent page written to all eight rules.
- Anatomy assets are named `overview-anatomy.svg`, after the page rather than the component, matching every
  recently shipped page. The older `<component>-anatomy.svg` form is called out as not to be copied.
- Rule 5 now names the four failure modes the audit actually found: wrong defaults, props that exist nowhere,
  undocumented `@warp-ds/elements/react/*` wrappers, and deprecation drift in both directions.
- `pnpm build` and `pnpm check` are now a required step rather than optional local testing. The dev server
  tolerates dead links and malformed tags that fail the real build.
- Do/don't pattern examples are written as `<DoDont>` blocks instead of the markdown tables they used to show.
- The finalize step asks for an honest report of what is unfinished, separately from the docs themselves.
- `config.json`: reference components, asset path patterns, accessibility required sections, and a
  `forbiddenOnPublishedPages` list.

### Removed

- The three places that instructed Claude to publish "_Visual example pending_" or an equivalent note when an
  image was missing. These directly contradicted Rule 6, and the audit found eight such admissions live on
  the site.

## 1.0.0 — 2026-08-11

First bundled release: `document-component`, `audit-component`, `list-components`, the Figma MCP server,
and the installer.
