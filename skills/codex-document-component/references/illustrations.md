# WARP illustration contract

An illustration must teach a component part, state, or design decision using genuine WARP assets. The lead defines the lesson and scope; the anatomy and Do/Don't specialists produce the agreed illustrations and evidence. All `docs/...` paths refer to the current `warp-ds/docs` checkout.

## Start from a brief

Before drawing, identify:

- The page, lesson, intended caption, and expected final display context.
- The supported component, brand, theme, variant, state, and relevant implementation or design version.
- The exact source Figma file, branch, node, and editable destination when applicable. Use the shared locations in [warp-context.md](warp-context.md) and verify the selected nodes.
- The real product copy and surrounding UI needed to make the example understandable.
- The files and Figma frames owned by this specialist, expected filenames, and questions requiring the lead's decision.

“Show that the group label gives three delivery options a shared question” is actionable. “Make three best-practice images” is not a sufficient brief. Reuse a strong existing illustration if it teaches the required lesson accurately.

## Figma capability and access

Discover the tools available in the current session before selecting a workflow. The official remote Figma MCP provides `use_figma` for creating and modifying native canvas content, including frames and instances. Writing requires a Full seat; editing an existing file also requires file edit permission. Confirm access rather than diagnosing a missing tool as a licence problem. See [Figma's write-to-canvas documentation](https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/).

When `use_figma` is available, follow its current tool documentation and required setup, inspect the file, and build within the assigned documentation frames using the existing library. Its capabilities evolve: verify current limitations, especially fonts and image-bearing components, before promising an exact result. Keep edits within the authorized illustration scope; do not modify or publish shared master components.

The legacy custom integration bundled in `warp-docs-skills` can inspect and export designs, manage its active file/branch, and post comments. It cannot create frames or edit nodes: `createFrame` and `updateNode` are unimplemented in [its client source](https://github.com/warp-ds/warp-docs-skills/blob/main/mcp/figma-design-system-mcp/figma-client.js). Commenting is a message to other people and needs explicit authorization; missing artwork does not authorize a comment.

The custom connection keeps mutable active-file/branch state. The lead chooses and records that context. Specialists must not switch it concurrently. Prefer calls with explicit file and node identifiers; serialize operations that depend on shared connection state and reconfirm the context after a switch. Different specialists must own separate output frames and files even when their work runs in parallel.

## Asset preference order

1. Inspect and reuse a suitable finished documentation frame from the correct Figma file and branch. Confirm that its component, copy, and state still match the brief.
2. Compose a new illustration from actual WARP instances in Figma when writing is available. Preserve component links and variables where supported. Add only the necessary example context and callouts.
3. Export genuine component artwork and compose it locally with annotations or other verified WARP exports. Keep the component's shape, typography, spacing, and tokens faithful to the source.
4. Render the actual WARP component at a recorded package version when that better demonstrates implemented behaviour, or when a suitable Figma export is unavailable. Use real APIs and the correct brand/theme; capture the rendered result.
5. If none produces an accurate illustration, return a precise brief, the attempted sources, and the missing capability or asset. Keep the illustration unfinished in the handoff.

Do not draw an approximation of a control and present it as a WARP component. Do not invent token values, variants, icons, or app behaviour to fill a gap. A Do/Don't example may intentionally change one property to demonstrate a mistake; record that change while keeping the underlying component genuine.

## Anatomy

Use `overview-anatomy.svg` for new vector anatomy assets, or `overview-anatomy.png` for a justified raster capture. For multiple diagrams, append `-1`, `-2`, and so on. Do not adopt the older `<component>-anatomy.svg` naming simply because a legacy page uses it.

Show the relevant component at a readable scale with restrained numbered callouts. Keep leaders clear of text and significant states. Numbers must agree with the prose legend, use one name per part, and distinguish optional or platform-specific parts. Do not label a decorative shape as a separately configurable API feature.

Radio's `docs/components/radio/overview.md` uses a two-part numbered legend; Button's `docs/components/button/overview.md` demonstrates an anatomy capture from the rendered component. Inspect their actual images under `docs/public/components/` before choosing a visual treatment. Reuse the explanation method, not an unverified geometry or colour.

## Do/Don't pairs

Settle the lesson before producing either half. Each pair must show a real decision and a plausible mistake, with realistic copy. Hold brand, scale, crop, context, alignment, and all irrelevant properties constant so the instructional difference is clear.

- Prefer one visible difference that the caption can explain precisely.
- Keep copy readable at the final rendered width, including labels and error text.
- Avoid extra decoration, unrelated app chrome, fabricated dashboards, or visual jokes that distract from the rule.
- Do not bake duplicate Do/Don't pills into the artwork; the page component supplies those labels.
- Write alt text that conveys the useful difference, not just “Do example” or a list of colours. Keep it consistent with what the image actually shows.
- Return both images, both proposed captions, alt text, and any qualification the lead must retain.

Store new pairs under `docs/public/components/<slug>/DoDonts/` using `usage-<topic>-do.svg` and `usage-<topic>-dont.svg`, or `.png` when the source is raster. Use the actual page name if the pair belongs elsewhere. Do not generate accessibility pairs: that page uses prose, tables, and lists. Markup and URL rules are in [documentation.md](documentation.md).

## Canvas, surfaces, and export

Inspect `docs/.vitepress/Do.vue`, `DoDont.vue`, and `theme/custom.css` in the docs checkout. These files govern image sizing, background, padding, breakpoints, and pair layout. Do not impose the legacy universal 400×300 canvas or fixed 4:3 ratio.

At the inspected revision, figure images fill their plate width with natural height, without inner padding or a fixed aspect ratio. The CSS comment describes illustrations authored around a 332px column width; measure the actual target page before drawing because viewport and renderer changes affect the available width. Include deliberate artwork gutters where needed and avoid stacking baked-in padding on top of container padding. Keep a pair's apparent component scale consistent.

Overview illustrations need a deliberate neutral backdrop so the component remains legible in both page themes. Prefer the current shared renderer surface, for example:

```markdown
::: image-block
![Anatomy with numbered callouts matching the legend.](/components/<slug>/overview-anatomy.svg)
:::
```

The current image-block container provides a gray surface and padding. Transparent exports work with this convention. Existing SVGs with a baked gray backdrop can remain when they render correctly; avoid automatically adding another rectangle and fixed padding. A dark illustration may use the renderer's supported dark-surface option; verify the actual output rather than assuming it switches with the page theme.

Prefer SVG for vector exports and PNG for rendered captures. Use sufficient raster resolution for the final display, without rescaling the UI's apparent text and control size. Preserve viewBox, aspect ratio, clipping, fonts, and all referenced artwork. Export only the intended frame or nodes, not the entire design file.

Save supported Figma exports promptly because export URLs expire. Verify each file exists, has content, parses as the expected image type, and displays the requested node rather than a blank frame or error response. Only then let the lead reference it in a public page. A preview URL is not a durable repository asset.

## Provenance handoff

For every new or replaced illustration, return a record the lead can retain with the run's evidence:

```text
Output: docs/public/components/<slug>/overview-anatomy.svg
Source kind: Figma export / Figma composition / rendered component
Figma: exact file URL, branch key, node URL(s), file version if available
Implementation, when used: repository, release or commit, package version
Variant: component, brand, theme, size, state, relevant properties
Edits: copy changes, instance overrides, callouts, cropping, composition
Export: format, dimensions/viewBox, scale, export date
Destination: edited Figma frame URL, when applicable
Verified: image and page checks actually performed
Missing: unknown source details or uncompleted checks
```

Never fabricate a missing version or node ID. Record unknowns explicitly. Reusing an existing repo asset without recoverable Figma provenance is acceptable only when its suitability is verified and that limitation is reported. Export URLs may be kept as temporary evidence, but use durable file/node links for provenance.

## Final visual review

Inspect the assets themselves and the actual rendered documentation page. A successful build cannot establish illustration quality or ensure bound image URLs loaded.

- Check desktop and narrow layouts, including the Do/Don't stacking breakpoint, for overflow, clipping, overlapping pairs, and unreadable text.
- Check light and dark page themes and any relevant brand modes. Inspect neutral backdrops, transparent areas, shadows, focus rings, and light-on-dark artwork.
- Confirm callout numbers match the legend, both sides demonstrate the stated lesson, and captions and alt text describe the final images.
- Verify local image requests succeed using the deployed `/docs` base and every referenced file is committed with the pages.
- Inspect native Figma output too when created: component links, variants, fonts, frame names, and destination must remain correct and editable.

Return exact files, previews or frame links, evidence, and outstanding issues. Gray placeholders can support an internal layout draft, but never count as finished artwork or justify setting the illustration task to Done.
