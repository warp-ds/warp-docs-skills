---
name: document-component
description: Generate comprehensive documentation for WARP Design System components using Figma design files and existing documentation patterns
---

# Component Documentation Generator

You are documenting a component for the WARP Design System. Follow these steps to create comprehensive, high-quality documentation.

## Reference Design Systems

When creating documentation, refer to these industry-leading design systems for best practices:

- **Carbon Design System**: https://carbondesignsystem.com/components/overview/components/
  - Excellent do/don't patterns with side-by-side comparisons
  - Clear "When to use / When not to use" sections
  - Comprehensive accessibility guidelines
  - Content guidelines with specific writing examples
  
- **eBay Playbook**: https://playbook.ebay.com/design-system/components
  - Visual-first approach with annotated images
  - Progressive disclosure (overview → variant pages)
  - Semantic categorization of component variants
  - Platform-specific examples (mobile/desktop)
  
- **Elastic UI**: https://eui.elastic.co/docs/components/
  - Topical categorization by use case
  - Live interactive examples
  - Separation of component docs from multi-component patterns
  - Consistent four-part structure: examples, usage, guidelines, props

- **WARP Portal (Figma)**: https://www.figma.com/design/pLorEdyAMCZXoxkaCSgREO/Warp-Portal---Documentation?node-id=5449-8890&t=epBd2vy9fJ2rfmTn-4
  - Advanced slider documentation with comprehensive do's and don'ts
  - Visual examples showing best practices
  - WARP-specific design language and conventions
  - Reference for structuring detailed component guidance

### Native App Design Systems

For native mobile and desktop components, refer to these platform-specific design systems:

- **Material Design 3 (Google)**: https://m3.material.io/components
  - Comprehensive Android/mobile component specifications
  - Anatomy diagrams with labeled component parts
  - State documentation (enabled, disabled, pressed, focused, hovered)
  - Adaptive design principles (personal, adaptive, expressive)
  - Dynamic color system and theming
  - Platform-specific guidance (Android, Compose)
  - Accessibility requirements (touch targets, contrast, screen readers)
  - Expressive components and layout systems (8dp spacing)
  
- **Apple Human Interface Guidelines (HIG)**: https://developer.apple.com/design/human-interface-guidelines/components
  - Native iOS, macOS, watchOS, tvOS, visionOS component documentation
  - Platform-specific considerations and variations
  - Minimum touch target specifications (44×44pt for iOS)
  - VoiceOver and Dynamic Type support requirements
  - Color contrast ratios (4.5:1 for body text, 3:1 for large text)
  - SwiftUI and UIKit integration guidance
  - Spatial computing guidance (visionOS)
  - Liquid Glass design language patterns

## Input

The user will provide:
- **Component name** (required): The name of the component to document (e.g., "Alert", "Button", "Modal")
- **Reference component** (optional): An existing well-documented component to use as a style reference

**Default reference is `alert`.** It is the most recent page written to all of the rules below and shipped in
[docs#227](https://github.com/warp-ds/docs/pull/227) — read `docs/components/alert/{overview,usage,accessibility}.md`
before you write anything. `range-slider` is the best reference for a dense Do/Don't set; `badge` for a simple
variant-driven page.

## WARP house rules (non-negotiable)

These rules come from the docs owner and from the August 2026 documentation audit. They override any conflicting
pattern later in this file. Apply them on every run without being asked.

### Rule 1 — Do's and Don'ts always use the `<DoDont>` component

**Never** use a markdown table, a bulleted list, or plain bold text for Do/Don't guidance. Always use the registered Vue components:

```markdown
<DoDont>
<Do imgurl="/docs/components/<name>/DoDonts/<page>-<topic>-do.svg" imgalt="Description of the illustration.">

The guideline, stated as an instruction.

**Why**: The reason, when it is not obvious.

</Do>
<Do not imgurl="/docs/components/<name>/DoDonts/<page>-<topic>-dont.svg" imgalt="Description of the illustration.">

What to avoid.

**Why**: The consequence.

</Do>
</DoDont>
```

- **Exactly one `<Do>` and one `<Do not>` per `<DoDont>`.** For a second pair, open a second `<DoDont>`. The grid in `DoDont.vue` has fixed named areas (`do-figure`, `dont-figure`, …), so a third and fourth `<Do>` land in the *same* cells and render stacked on top of each other. Every shipped page except one follows this — `box`, `range-slider` (11 pairs, 11 wrappers), `snackbar`, `checkbox` and `slider` all use one pair per wrapper.
- Leave a blank line after the opening tag and before `</Do>`, otherwise the markdown inside is not parsed.
- `<Do>` also accepts `darkmode` (a boolean), which swaps the `#f1f1f1` image backdrop for `#333`. Use it only when the illustration is itself light-on-dark.
- Reference tables that are *not* Do/Don'ts (variant matrices, keyboard keys, prop lists, platform naming maps) stay as markdown tables. This rule is only about Do/Don't guidance.

### Rule 2 — `<Do>` blocks always carry `imgurl` from the start

Never ship a `<Do>` without an image. If Figma has no do/don't artwork yet, **generate a gray placeholder SVG** so the layout is correct and the designer has a named file to replace.

- Location: `docs/public/components/<name>/DoDonts/`
- Naming: `<page>-<topic>-do.svg` / `<page>-<topic>-dont.svg` — for example `usage-title-outcome-do.svg`, `accessibility-focus-dont.svg`. The topic must describe the guideline, so the filename alone tells the designer what to draw.
- Path in markdown: `imgurl="/docs/components/<name>/DoDonts/<file>.svg"` — **note the leading `/docs/`**. `<Do>` binds `:src`, so VitePress does not rewrite the path and the site base must be included. This differs from plain `<img src="/components/...">` in markdown, which *is* rewritten.
- Always set a meaningful `imgalt`.

Placeholder spec — 400×300 (the `.do-figure` box is 4:3), `#EDEDED` fill, dashed `#BDBDBD` border, a green (`#0E9946`) or red (`#BE3830`) accent bar matching do/don't, the word `PLACEHOLDER`, a wrapped caption describing the illustration to draw, and the filename at the bottom.

Tell the user in the summary that the placeholders are generated and where to find them.

### Rule 3 — Overview variant images sit on a gray backdrop

Figma exports of a component are usually edge-to-edge, which disappears against the page in dark mode. Every illustration on `overview.md` (variants, anatomy, states) must have a gray container.

Match the existing site convention (badge, toast, select): bake a full-bleed `#F6F6F6` rect into the SVG as its first child, with the artwork inset via a translated group.

```python
# widen the canvas by PAD on each side, add the backdrop, shift the art inside
PAD, GRAY = 40, "#F6F6F6"   # use PAD = 80 for a 2x-scale export
new_w, new_h = w + PAD*2, h + PAD*2
# <svg width=new_w height=new_h viewBox="0 0 new_w new_h">
#   <rect width=new_w height=new_h fill=GRAY/>
#   <g transform="translate(PAD,PAD)"> …original children… </g>
# </svg>
```

Keep the inset proportional: an export at scale 2 needs double the padding of one at scale 1.

### Rule 4 — Do's and Don'ts are judged on quality, never on count

The docs owner does not want "examples for the sake of examples". Three sharp pairs beat seven padded ones.

- **One pair per idea.** If two pairs would be fixed by the same change, they are the same pair — merge them and keep the strongest example.
- **Every pair must be concrete and real.** Use an actual message the user would see ("Payment declined — your card was not charged"), not a paraphrase of the rule ("write good titles").
- **The don't must be a mistake someone actually makes**, not a strawman. If nobody would ship it, it teaches nothing.
- **No pair that only restates prose** already on the page. If a bullet in Guidelines, Behaviour, Placement, or When not to use covers it, do not repeat it as a DoDont.
- **Content sections get at most one pair each**; Best practices gets around three. Go higher only when each extra pair clearly earns it.
- **`accessibility.md` gets no DoDont section at all.** A11y guidance stays as prose, tables, and bullets.

Before shipping, read the pairs back and delete any where the "why" for the do and the "why" for the don't are the same sentence inverted.

### Rule 5 — Verify behavioural claims against the component source

Figma and the framework pages describe the API, not the behaviour. Anything you assert about how the component *acts* — default roles, ARIA, focus, animation, what a screen reader announces, what is required — must be read out of the real source. `gh` is authenticated for the `warp-ds` org:

- Web: `gh api repos/warp-ds/elements/contents/packages/<name>/<name>.ts --jq .content | base64 -d` (also check `packages/<name>/docs/accessibility.md`)
- iOS: `repos/warp-ds/warp-ios/contents/Sources/Components/<Name>/`
- Android: `repos/warp-ds/warp-android/contents/warp/src/main/java/com/schibsted/nmp/warp/components/Warp<Name>.kt`

Compare the installed version (`node_modules/@warp-ds/elements/package.json`) against the repo tags — they drift, and defaults change between minors.

Separate **spec facts** (WCAG ratios, what `role="alert"` implies) from **implementation facts**, and verify only the latter. Never blend the three platforms into one description when they differ — Warp's Alert wraps content in a live region on web, merges everything into a single accessibility element on iOS, and sets no semantics at all on Android. Where the component genuinely falls short, write a **Known gaps** table with a workaround rather than advice the component cannot honour.

The August 2026 audit found this class of error on nearly every page. Four things to check by hand, every time:

- **Defaults.** Read the default off the source, never off a neighbouring doc page. The audit found the Android Text field `singleLine` default documented inverted, and Snackbar durations (5000 / 20000 / 6000000 ms) that match no implementation on any platform.
- **The component actually exists.** The Tooltip Elements page documented a different component (`w-attention`) and a required prop, `target-selector`, that exists nowhere in the codebase. Grep the package for every prop name you write.
- **React 19 wrappers.** Elements exports React components from `@warp-ds/elements/react/*` for several components whose docs claim no React 19 support. Check `packages/<name>/package.json` exports before writing the framework status.
- **Deprecation, in both directions.** Do not teach a deprecated API (Button `quiet`, Select `hint`/`always`/`read-only`), and do not recommend on one page what another page deprecates (Button `pill`). Check `@deprecated` in Elements, `@Deprecated` in Kotlin, and `@available(*, deprecated:)` in Swift.

Every code snippet you publish must be one you have checked compiles against the real API — the audit found two Android Modal snippets and two Android Button attribute names that do not.

### Rule 6 — Never publish a gap

The docs site is the public face of the design system. It must never advertise its own incompleteness: no
`<InProgressStatus />`, no "coming soon", no "TBD", no `LINK` stubs, no empty headings, no
"_Visual example pending_". The audit found eight such admissions live on the site.

When you cannot complete a section, you have exactly two options:

1. **Write the real content** — from the source, from the other platforms, from the Figma file.
2. **Omit the section entirely.** A page without an Anatomy heading reads as finished. A page with an empty Anatomy heading reads as abandoned.

The one exception is Rule 2's do/don't placeholders: those are gray SVGs that keep the *layout* right and give the
designer a named file to replace. They are never captioned as missing, and they are the only placeholder you may ship.

If a gap is worth tracking, it goes to Jira under project `WARP` — tell the user in your summary and let them file it.
Never resolve a gap by writing a note about the gap.

### Rule 7 — Overview carries a cross-platform naming table

The four sources disagree on names constantly, and no page used to map them. Whenever a variant, type or prop is
named differently across Figma, Elements, iOS and Android, put a mapping table on `overview.md`. Alert's is the model:

```markdown
| Figma | Web (Elements) | iOS | Android |
| --- | --- | --- | --- |
| Negative | `negative` | `.critical` | `WarpAlertType.Critical` |
```

Known divergences to look for: destructive Button is `Critical` in Figma/iOS and `Negative` in Elements/Android;
Modal `subtitle` is native-only; Modal header image is web-only; Tabs `scrollable` defaults `true` on iOS and
`false` on Android and does not exist on web. Where a variant exists on some platforms and not others, say so in the
table rather than describing it as if it were universal.

### Rule 8 — `accessibility.md` is never a stub

The audit found accessibility documentation incomplete on 8 of 8 components, while the behaviour existed in code the
whole time. Every accessibility page needs all of:

- **General** — what makes this component an accessibility problem in the first place
- **Keyboard interaction** — real key-by-key behaviour, read out of the source
- **Screen reader considerations** — what is announced, when, and in what order
- **Visual accessibility** — contrast, colour independence, text resizing
- **Platform-specific** — web, iOS and Android separately whenever they differ
- **Testing** — how a reader verifies the above themselves

Read the semantics out of the code: Elements sets `role`/`aria-*` through `ElementInternals`, iOS posts
`UIAccessibility` notifications, Android takes `contentDescr` parameters. Per Rule 4, this page gets no `<DoDont>`
section — accessibility guidance stays as prose, tables and bullets.

## Process

⚠️ **CRITICAL ORDER**: Follow this exact sequence to avoid VitePress build errors:

1. **Setup** → Clone repo, create branch
2. **Research** → Find component in Figma, analyze existing docs
3. **Export Assets** → Download all images from Figma to disk
4. **Verify Assets** → Confirm all files exist before proceeding
5. **Generate Docs** → Write markdown files (only reference existing images)
6. **Test Build** → Start dev server to verify no import errors

**DO NOT** write documentation before assets are downloaded. This causes 404/import errors.

### 1. Setup and Research

1. **Locate the WARP docs repository**:
   - Check if `warp-docs` directory exists in the current working directory
   - If not, clone it: `git clone https://github.com/warp-ds/docs.git warp-docs`

2. **Fetch Figma component details**:
   - Use `mcp__figma-design-system__search_components` to find the component
   - Use `mcp__figma-design-system__get_component_details` to get full details
   - Note: variants, properties, styles, default values

3. **Export component visual assets from Figma**:
   - Use `mcp__figma-design-system__export_component_by_name` to export the main component as SVG
   - If component has variants, use `mcp__figma-design-system__get_component_variants` to list all variants
   - Export each variant individually using `mcp__figma-design-system__export_component_image`
   - Download the SVG files from the returned URLs using curl or fetch
   - Save to `warp-docs/docs/public/components/<component-name>/`
   - Naming convention — **match what the recent pages actually ship**, not the older components:
     - Variants: `<component-name>-variants-<variant-name>.svg` (e.g. `alert-variants-negative.svg`)
     - Anatomy diagram: `overview-anatomy.svg` — named after the *page*, not the component. Numbered when a page has several: `overview-anatomy-1.svg`, `overview-anatomy-2.svg` (see `textfield`, `checkbox`).
     - Do/don't illustrations: `DoDonts/<page>-<topic>-do.svg` (Rule 2)
     - States: `<component-name>-state-<state-name>.svg`

   `badge`, `toast`, `link`, `breadcrumbs` and `pageindicator` still use the older `<component>-anatomy.svg`.
   Do not copy them — `alert`, `box`, `snackbar`, `select`, `slider`, `textarea`, `textfield`, `checkbox`,
   `datepicker` and `range-slider` all use `overview-anatomy.svg`, and that is the convention now.

4. **Analyze existing documentation**:
   - Read the reference component's documentation files (overview.md, usage.md, accessibility.md)
   - Check the component's existing docs if they exist
   - Read framework implementation files to understand technical details

5. **Check for visual assets**:
   - Look for images in `docs/public/components/<component-name>/`
   - Note if anatomy diagrams, variant examples, or usage examples exist
   - If missing, add to list of assets to create manually in Figma playground

### 2. Create Branch

Create a new git branch in the warp-docs repo:
```bash
cd warp-docs
git checkout -b docs/<component-name>-documentation
```

### 3. Export and Prepare Visual Assets

**CRITICAL**: Export and download all images BEFORE generating documentation files to avoid VitePress import errors.

#### Step-by-step asset export process:

1. **Create component directory first**:
   ```bash
   mkdir -p warp-docs/docs/public/components/<component-name>
   ```

2. **Export main component** (if it exists in Figma):
   ```bash
   # Search for the component first
   # Use mcp__figma-design-system__search_components with the component name
   
   # If found, export it
   # Use mcp__figma-design-system__export_component_by_name
   
   # Download immediately (URLs expire fast!)
   curl -s -o warp-docs/docs/public/components/<component-name>/<component-name>.svg "<imageUrl>"
   
   # Verify download
   ls -lh warp-docs/docs/public/components/<component-name>/<component-name>.svg
   ```

3. **Export all variants** (if component has variants):
   ```bash
   # Get component details to find if it's a COMPONENT_SET
   # Use mcp__figma-design-system__get_component_details
   
   # If it has variants, get them all
   # Use mcp__figma-design-system__get_component_variants with componentSetId
   
   # Export each variant one by one
   # For each variant:
   #   1. Use mcp__figma-design-system__export_component_image with variant.id
   #   2. Download immediately: curl -s -o warp-docs/docs/public/components/<component-name>/<component-name>-variants-<sanitized-variant-name>.svg "<imageUrl>"
   #   3. Verify the file exists and has content
   
   # Keep track of which variants were successfully exported
   ```

4. **Check for anatomy diagram**:
   ```bash
   # Try to find anatomy frame: "<ComponentName> Anatomy" or "Anatomy"
   # Use mcp__figma-design-system__find_node_by_name
   
   # If found, export and download
   # If NOT found, skip anatomy section in documentation
   ```

5. **Check for state illustrations**:
   ```bash
   # Look for frames named like: "<ComponentName> State - Disabled", etc.
   # Use mcp__figma-design-system__find_node_by_name for common states
   
   # Export any that exist
   # Track which ones are available for documentation
   ```

6. **Track what was exported**:
   Create a manifest of exported assets:
   ```
   exported_assets = {
     main_component: true/false,
     variants: [list of variant names that were exported],
     anatomy: true/false,
     states: [list of states that were exported]
   }
   ```

**IMPORTANT RULES**:
- **NEVER reference an image in documentation that doesn't exist on disk**
- **ALWAYS verify file exists before adding image path to markdown**
- **ONLY include image sections if the images were successfully downloaded**
- **Use placeholder text if images are missing, not broken image references**

**File Existence Check Pattern**:
```bash
# Before adding ANY image to markdown, run this check:
IMAGE_PATH="warp-docs/docs/public/components/<component-name>/<image-file>.svg"

if [ -f "$IMAGE_PATH" ]; then
  echo "✓ Image exists, safe to reference in markdown"
  # ADD image reference to markdown
else
  echo "✗ Image missing, DO NOT reference in markdown"
  # SKIP image section or use text-only description
fi
```

**Example - Conditional Variant Section**:
```markdown
<!-- ONLY add this if the image file exists on disk -->

## Variants

### Primary variant

<div class="grid grid-cols-2 gap-24">
  <div class="py-16">
    <img src="/components/button/button-variants-primary.svg" alt="Primary button variant" />
  </div>
  <div class="py-16">
    Use the primary variant for the main action...
  </div>
</div>

<!-- If the image doesn't exist, write the prose without it. Per Rule 6, never
     annotate the absence — no "pending", no "to be added", no empty figure. -->

## Variants

### Primary variant

Use the primary variant for the main action on a page. It has the highest visual emphasis.
```

**Asset Download Helper**:
```bash
# Function to safely download and verify
download_and_verify() {
  local url="$1"
  local output="$2"
  
  # Create directory
  mkdir -p "$(dirname "$output")"
  
  # Download
  if curl -s -o "$output" "$url"; then
    # Verify it's not empty
    if [ -s "$output" ]; then
      echo "✓ $output"
      return 0
    fi
  fi
  
  echo "✗ Failed: $output"
  rm -f "$output"  # Remove empty/failed file
  return 1
}
```

### 4. Generate Documentation Files

⚠️ **CRITICAL VitePress Rule**: NEVER reference image files that don't exist on disk. VitePress will fail to build with "Failed to resolve import" errors.

**Before writing ANY image path in markdown**:
1. Verify the file exists: `ls -lh warp-docs/docs/public/components/<component-name>/<image-name>.svg`
2. If file doesn't exist, either:
   - Skip that image section entirely, or
   - Use text description only (no `<img>` tag)

   Never note in the documentation that an image is pending — see **Rule 6**. Report missing assets to the user in
   your summary instead, so they can brief a designer or file a `WARP` ticket.

Create or update three main documentation files:

#### **overview.md**

Structure:
- **Title and intro**: Brief description of what the component does
- **ComponentsStatus** tag for framework support badges
- **Platform considerations** (if applicable for native components):
  - iOS/iPadOS-specific behavior and appearance
  - Android/Material-specific implementation
  - Desktop (macOS/Windows) variations
  - Responsive design considerations
- **Related components**: Links to similar or related components
- **Examples section**: Live code examples using `<style-isolate>` with `<ThemeSwitcher />`
  - For native components: include platform-specific code examples (SwiftUI, Compose, etc.)
- **General section**: Detailed explanation of the component's purpose
  - Adaptive design principles (how it adapts to user preferences, context)
- **Variants section**: Document each variant with:
  - 2-column grid layout (image on left, description on right)
  - **ONLY include image if file exists**: Check that file exists at `warp-docs/docs/public/components/<component-name>/<component-name>-variants-<variant>.svg`
  - If image doesn't exist, describe the variant in text only
  - Image path format: `/components/<component-name>/<component-name>-variants-<variant>.svg`
  - Clear description of when to use each variant
  - Emphasis hierarchy (high/medium/low) for action-oriented components
- **Cross-platform naming table** (Rule 7): whenever variants or types are named differently across Figma, Elements, iOS and Android
- **Anatomy section** (ONLY if anatomy image exists):
  - **Check first**: Does `warp-docs/docs/public/components/<component-name>/overview-anatomy.svg` exist?
  - If YES: Use `::: image-block` with the anatomy image
  - If NO: Skip the anatomy section entirely — heading and all (Rule 6)
  - Numbered breakdown of component parts (following Material Design 3 pattern)
  - Image path: `/components/<component-name>/overview-anatomy.svg`
  - Numbered list explaining each part
  - Layer structure if component has depth/elevation
  - Container, content, and interactive element breakdown
- **component-questions** tag at the end

#### **usage.md**

Structure:
- **Title and intro**: Same brief description as overview
- **ComponentsStatus** tag
- **Guidelines section**: Bulleted list of key usage principles
- **When to use / When not to use**: Clear guidance with examples
  - Follow Carbon Design System pattern: specific scenarios for each
  - Provide alternative component recommendations in "When not to use"
- **Behaviour section**: How the component behaves in different states
  - Interaction patterns
  - State management
  - Variant selection criteria
  - All possible states (default, hover, focus, active, disabled, loading, error)
- **Content guidelines section** (if applicable):
  - Message structure with character limits
  - Writing guidelines (action-oriented, concise, clear)
  - Specific examples of good vs. bad labels/text
  - Word choice recommendations
- **Placement section**: Where and how to position the component
  - Platform-specific guidance (mobile vs. desktop) if applicable
  - Context examples showing realistic UI placements
- **Interaction section**: User interaction patterns
- **Best practices**: Do's and Don'ts specific to this component
  - **Use side-by-side comparison format:**
    - **DO** column with positive examples
    - **DON'T** column with what to avoid
  - Provide concrete examples, not just abstract rules
  - Include visual comparisons when helpful
  - Lead with the guideline, then explain the "why"
- **component-questions** tag at the end

#### **accessibility.md**

**Rule 8 applies here**: this page is never a stub, and every claim on it comes out of the source. It is also the
one page with no `<DoDont>` section (Rule 4).

Structure:
- **Title and intro**: Same brief description
- **ComponentsStatus** tag
- **General section**: Overview of accessibility considerations
- **ARIA attributes** (web components): Proper role, label, state usage
- **Platform-specific accessibility** (native components):
  - **iOS/iPadOS**: VoiceOver labels, traits, and hints; Dynamic Type support
  - **Android**: TalkBack labels, content descriptions; scalable text support
  - **Desktop**: Screen reader compatibility (NVDA, JAWS, Narrator)
- **Touch/Click targets**:
  - Minimum size specifications (44×44pt iOS, 48×48dp Android, 44×44px web)
  - Spacing between interactive elements
- **Keyboard interaction**: Complete keyboard navigation patterns
  - Tab order and focus management
  - Keyboard shortcuts (if applicable)
  - Focus trap behavior for modals/overlays
- **Screen reader considerations**: 
  - How component is announced and perceived
  - State change announcements
  - Error and validation message handling
  - Live region usage (if applicable)
- **Visual accessibility**:
  - **Colour contrast requirements**:
    - Body text: minimum 4.5:1 ratio
    - Large text: minimum 3:1 ratio
    - Interactive elements: minimum 3:1 ratio
  - Colour independence (not relying on color alone)
  - Focus indicators (visible and high contrast)
  - Text resizing support (up to 200% without loss of functionality)
- **Motion and animation** (if applicable): 
  - Reduced motion support (`prefers-reduced-motion`)
  - Alternative non-animated states
- **Best practices**: Accessibility-specific do's and don'ts
- **Testing section**: 
  - How to test with screen readers (VoiceOver, TalkBack, NVDA)
  - Keyboard-only navigation testing
  - Contrast checking tools
  - Automated testing recommendations
- **component-questions** tag at the end

### 5. Documentation Style Guide

**Tone and Style**:
- Clear, concise, and actionable
- Use second person ("you") when addressing the user
- Use active voice predominantly
- Be specific, not generic
- Use short sentences and present tense
- Choose familiar words over complex ones
- Front-load headings with key information

**Formatting**:
- Use sentence case for headings
- Use bold for **emphasis** on key concepts
- Use code blocks for code examples with proper language tags
- Use 2-column grids for image + description layouts:
  ```html
  <div class="grid grid-cols-2 gap-24">
    <div class="py-16">
      <img src="/components/..." alt="..." />
    </div>
    <div class="py-16">
      Description here...
    </div>
  </div>
  ```

**Do's and Don'ts Formatting** (following Carbon/WARP patterns):
- Use clear two-column layout with **DO** and **DON'T** headers
- Provide concrete, specific examples rather than abstract rules
- Include visual comparisons (images) when helpful
- Format each guideline as:
  1. **Statement**: The rule or guideline
  2. **Example**: Concrete demonstration
  3. **Why**: Brief explanation of reasoning (when not obvious)
- Use ✓ or ✗ symbols for visual reinforcement if appropriate

**Examples**:
- Provide realistic, practical examples in context
- Use `<style-isolate>` wrapper for live examples
- Include `<ThemeSwitcher />` for theme toggling
- Show all major variants and states
- Include code snippets alongside visual examples
- Demonstrate platform-specific variations (mobile/desktop) when applicable
- Use numbered annotations on images to explain component parts

**Writing Quality**:
- Lead with action verbs for instructions
- Break down complex topics into digestible sections
- Use lists to improve scanability
- Keep subject and verb close together
- Place conditional information at the beginning of sentences
- Write clear "Do" and "Don't" examples with before/after comparisons
- Explain the "why" behind guidelines (e.g., "Don't use vague labels — they reduce clarity and accessibility")
- Provide context and reasoning
- Be consistent with existing WARP documentation terminology
- Examples should immediately follow guidelines

### 6. Do's and Don'ts Best Practice Patterns

Patterns 1–3 below describe *what makes a good Do/Don't* — side-by-side comparison, a visual example, and a stated reason. In WARP docs they are all expressed through the `<DoDont>` component (see **Rule 1**), never as tables, bold headers, or bullet lists.

#### Pattern 1: Side-by-side comparison (Carbon Design System)

Pair every do with its opposite don't, so the contrast does the teaching.

```markdown
<DoDont>
<Do imgurl="/docs/components/button/DoDonts/usage-labels-do.svg" imgalt="A button labelled 'Save changes'.">

Use clear, action-oriented labels such as "Save changes" or "Delete account".

</Do>
<Do not imgurl="/docs/components/button/DoDonts/usage-labels-dont.svg" imgalt="A button labelled 'OK'.">

Use vague labels such as "OK", "Submit", or "Click here".

</Do>
</DoDont>
```

#### Pattern 2: Visual before/after examples

The `imgurl` on each `<Do>` *is* the before/after. Show the cluttered version in the don't and the resolved version in the do, framed identically so the difference is the only thing that changes.

#### Pattern 3: Contextual examples with reasoning

Add a `**Why**:` line inside the block whenever the guideline is not self-evident.

```markdown
<DoDont>
<Do imgurl="/docs/components/button/DoDonts/usage-specificity-do.svg" imgalt="A button labelled 'Remove user from workspace'.">

**"Remove user from workspace"**

**Why**: Users understand exactly what will happen before they commit.

</Do>
<Do not imgurl="/docs/components/button/DoDonts/usage-specificity-dont.svg" imgalt="A button labelled 'Confirm'.">

**"Confirm"**

**Why**: Confirm what? The label carries no information on its own.

</Do>
</DoDont>
```

#### Pattern 4: Semantic Categorization (eBay Pattern)

```markdown
### Variants by purpose

**Confirmation (green)**
Use when: Action succeeds or completes successfully
Example: "Payment received", "File uploaded"

**Warning (yellow)**
Use when: User attention needed but not critical
Example: "Connection unstable", "Changes not saved"

**Error (red)**
Use when: Action failed or requires immediate attention
Example: "Payment declined", "Required field empty"

**Neutral (blue)**
Use when: General information without urgency
Example: "New features available", "Update available"
```

#### Pattern 5: State-Based Guidelines (Material Design 3 Pattern)

```markdown
### State documentation

Each state should include:
1. **Visual example**: How it appears
2. **When it occurs**: Trigger conditions
3. **User expectation**: What users should understand
4. **Implementation note**: Technical requirement

**Example:**
- **Loading state**
  - Visual: Spinner icon, dimmed button
  - When: After click, before server response
  - User expectation: Action is processing, wait required
  - Implementation: Disable button, announce to screen readers

**Complete state list for interactive components:**
- Enabled (default)
- Hovered (desktop/pointer devices)
- Focused (keyboard navigation)
- Pressed/Active (during interaction)
- Disabled (unavailable)
- Loading (async operations)
- Error (validation failure)
- Success (confirmation)
```

#### Pattern 6: Platform-Specific Variations (Apple HIG Pattern)

```markdown
### Platform considerations

Document how the component adapts across platforms:

**iOS/iPadOS**
- Touch-optimized interactions (44×44pt minimum)
- System button styles available
- Dynamic Type support for text scaling
- VoiceOver integration

**Android**
- Material Design 3 theming
- 48×48dp minimum touch targets
- TalkBack support
- Ripple effects on interaction

**Desktop (macOS/Windows)**
- Click-based interactions
- Hover states prominent
- Keyboard shortcuts available
- Smaller touch targets acceptable (mouse precision)

**Example:**
Component appears as filled button on mobile for easy tapping, but can use outlined style on desktop where precision is higher.
```

#### Pattern 7: Adaptive Design Principles (Material Design 3)

```markdown
### Adaptive behavior

**Personal**: How the component adapts to user preferences
- Theme (light/dark mode)
- Color preferences (dynamic color)
- Text size (accessibility scaling)

**Adaptive**: How it responds to context
- Screen size (mobile, tablet, desktop)
- Input method (touch, mouse, keyboard)
- Connection state (online/offline)

**Expressive**: How it conveys brand and emotion
- Motion and animation
- Color palette application
- Elevation and depth
```

### 7. Quality Checks

Before considering the documentation complete, verify against industry best practices:

1. **Completeness check**:
   - [ ] All variants from Figma are documented with visual examples
   - [ ] All variants exported as SVG and saved to docs/public/components/
   - [ ] All properties and options are explained
   - [ ] Examples cover common use cases in realistic contexts
   - [ ] Related components are linked
   - [ ] Anatomy diagram exported and labeled with numbered callouts
   - [ ] All states documented and exported (default, hover, focus, active, disabled, loading, error)
   - [ ] Platform-specific guidance provided where applicable (mobile/desktop)
   - [ ] All exported SVGs are valid and properly named

2. **Consistency check**:
   - [ ] Follows the same structure as reference components
   - [ ] Uses consistent terminology with other WARP docs
   - [ ] Image paths follow naming conventions
   - [ ] Markdown formatting is consistent
   - [ ] Matches patterns from Carbon, Elastic UI, and eBay design systems

3. **Technical accuracy**:
   - [ ] Figma component details are accurately reflected
   - [ ] Framework implementation examples align with actual APIs
   - [ ] ARIA roles and attributes are correct (web components)
   - [ ] Accessibility guidelines follow WCAG 2.1 AA standards
   - [ ] **Touch target sizes meet platform requirements:**
     - iOS/iPadOS: 44×44pt minimum
     - Android: 48×48dp minimum  
     - Web: 44×44px minimum
   - [ ] **Color contrast ratios meet standards:**
     - Body text: 4.5:1 minimum
     - Large text: 3:1 minimum
     - Interactive elements: 3:1 minimum
   - [ ] **Platform-specific accessibility documented:**
     - VoiceOver support (iOS)
     - TalkBack support (Android)
     - Dynamic Type/scalable text support
   - [ ] All component states documented (enabled, hovered, focused, pressed, disabled, loading, error)

4. **Clarity and usability** (following Carbon/Elastic UI patterns):
   - [ ] Each section has a clear purpose
   - [ ] Examples are easy to understand and immediately follow guidelines
   - [ ] Guidelines are specific and actionable, not abstract
   - [ ] No jargon without explanation
   - [ ] Do's and Don'ts use side-by-side comparison format
   - [ ] Includes "why" explanations for non-obvious guidelines
   - [ ] Content is scannable with good visual hierarchy
   - [ ] Short sentences and present tense used throughout
   - [ ] Action verbs lead instructions

5. **Best practices alignment**:
   - [ ] "When to use / When not to use" includes alternative component recommendations
   - [ ] Content guidelines include specific word choice examples (good vs. bad)
   - [ ] Visual comparisons provided for complex concepts
   - [ ] Progressive disclosure: overview level to detailed implementation
   - [ ] Live interactive examples when possible

### 8. Build and verify (not optional)

`pnpm build` is the gate. The dev server tolerates dead links and malformed tags that fail the real build, so a
green dev server proves nothing.

```bash
cd warp-docs
pnpm install              # first run only
pnpm build                # MUST pass — catches dead links, bad image paths, malformed Vue tags
pnpm check                # Biome lint + format, with auto-fix. The repo has a pre-commit hook.
pnpm generate-frameworks  # only if you added or changed anything under frameworks/
```

Then preview and actually look at the page:

```bash
pnpm dev
# → http://localhost:5173/docs/components/<component-name>/overview
```

Check by eye, because the build cannot: that each `<DoDont>` renders as one side-by-side pair (overlapping
figures mean you put more than one pair in a wrapper — Rule 1), that overview illustrations are legible in dark
mode (Rule 3), and that no placeholder text leaked onto the page (Rule 6).

### 9. Finalize

1. **Show summary** of what was created:
   - Files created/updated
   - Branch name
   - Local preview URL (if server was started)

2. **Report honestly** what is not finished:
   - Do/don't placeholders generated, and the path a designer needs
   - Any section omitted because the source did not support a claim
   - Anything worth a `WARP` Jira ticket — the user files it; the site never mentions it

3. **Provide next steps**:
   - Review documentation in browser
   - Commands to commit changes
   - Instructions for creating a PR

Do not commit, push, or open the PR yourself unless the user asks.

## Figma MCP Tools Reference

The following Figma MCP tools are available for component documentation:

### Read Operations
- `mcp__figma-design-system__search_components` - Find components by name or description
- `mcp__figma-design-system__get_component_details` - Get detailed component information
- `mcp__figma-design-system__get_component_variants` - Get all variants of a component set
- `mcp__figma-design-system__list_components` - List all components in the file
- `mcp__figma-design-system__find_node_by_name` - Find a node ID by its name

### Export Operations
- `mcp__figma-design-system__export_component_by_name` - Export component by name as SVG/PNG/JPG/PDF
- `mcp__figma-design-system__export_component_image` - Export any node by ID as image

### Write Operations
- `mcp__figma-design-system__add_comment` - Add comments to Figma for collaboration
- `mcp__figma-design-system__get_comments` - Retrieve all comments

### File Management
- `mcp__figma-design-system__get_file_info` - Get file information
- `mcp__figma-design-system__list_branches` - List all branches
- `mcp__figma-design-system__switch_branch` - Switch to a specific branch
- `mcp__figma-design-system__get_current_branch` - Get current branch info

**Image Download Pattern**:
```bash
# After getting image URL from export tool:
curl -s -o "path/to/output.svg" "<imageUrl>"

# Verify the download:
ls -lh "path/to/output.svg"
```

**Important Notes**:
- Image URLs from Figma expire quickly - download immediately
- Use scale 2 for retina display quality (better for documentation)
- SVG format is preferred for scalability and smaller file sizes
- Batch export variants to save time

## Important Notes

- **Asset placeholders**: If referenced images don't exist in Figma, use `add_comment` to request them from designers
- **Framework docs**: This skill focuses on the main documentation files (overview, usage, accessibility). Framework-specific implementation docs in the `frameworks/` subdirectory are typically maintained separately
- **Existing content**: If documentation already exists, enhance it rather than replacing it entirely. Preserve any custom examples or specific guidance that's already there
- **Figma limitations**: If Figma component details are incomplete, make reasonable assumptions based on similar components and note what information was inferred

## Pre-Flight Checklist (Before Starting)

Use this checklist to avoid VitePress build errors:

```
□ warp-docs repository exists and is up to date
□ New branch created for this component
□ Component found in Figma (use search_components)
□ Component details retrieved (use get_component_details)
```

## Asset Export Checklist (Step 3)

```
□ Component directory created: warp-docs/docs/public/components/<name>/
□ Main component exported from Figma
□ Main component downloaded and verified on disk
□ Variants identified (if COMPONENT_SET)
□ All variants exported and downloaded
□ All variant files exist on disk
□ Anatomy diagram checked (exported as overview-anatomy.svg if it exists)
□ State illustrations checked (exported if exist)
□ Created manifest of what was actually exported
□ RULE 3: gray #F6F6F6 backdrop baked into every overview illustration
□ RULE 2: DoDonts/ directory created with a gray placeholder per <Do> block
```

## Documentation Writing Checklist (Step 4)

```
□ Before EVERY image reference: verified file exists with ls -lh
□ No broken image paths in overview.md
□ No broken image paths in usage.md  
□ No broken image paths in accessibility.md
□ Variants section only includes exported variants
□ Anatomy section only included if image exists — heading dropped too, not left empty
□ RULE 1: zero markdown Do/Don't tables — grep for '✓ Do' and 'DON'T' returns nothing
□ RULE 1: exactly two <Do> per <DoDont> — see the one-liner below
□ RULE 2: every <Do> has imgurl + imgalt, and every imgurl resolves on disk
□ RULE 2: imgurl paths start with /docs/ (not /components/)
□ RULE 4: no pair that only restates prose already on the page; accessibility.md has no DoDont
□ RULE 5: every default, prop name and code snippet checked against the real source
□ RULE 6: grep for 'coming soon', 'pending', 'TBD', 'InProgressStatus', 'LINK' returns nothing
□ RULE 6: no empty headings — every heading has content under it
□ RULE 7: cross-platform naming table on overview.md where names diverge
□ RULE 8: accessibility.md has all six required sections, none of them a stub
□ pnpm build passes (catches dead links and malformed tags; dev server does not)
□ pnpm check passes (Biome — the repo has a pre-commit hook)
□ Component page loads at /docs/components/<name>/overview and renders correctly by eye
```

Verify the one-pair-per-wrapper rule mechanically:

```bash
awk '/<DoDont>/{c=0} /<Do /{c++} /<\/DoDont>/{if(c!=2) print FILENAME": "NR" has "c" <Do> children"}' \
  docs/components/<name>/*.md
```

Silence means every wrapper holds exactly one pair. Any output is a block that will render stacked.

## Common Mistakes to Avoid

❌ **DON'T**:
- Write documentation before downloading images
- Reference images that don't exist on disk
- Assume Figma export URLs are permanent
- Copy image paths or naming conventions from older components without checking a recent one
- Skip the verification step after downloading
- Put more than one do/don't pair inside a single `<DoDont>`
- Describe behaviour you read on another docs page instead of in the source
- Write anything that tells a reader the documentation is unfinished

✅ **DO**:
- Export and download all images FIRST
- Verify every file exists before referencing
- Check file sizes (not 0 bytes)
- Run `pnpm build` before considering it complete
- Use text descriptions when images are missing — silently, with no note about the absence
- Read `docs/components/alert/` first; it is the current reference page

## Output Format

After completing the documentation, provide:

1. **Summary** of files created/modified
2. **Key highlights** from the Figma component (variants, key properties)
3. **Documentation preview URLs** (if local server is running)
4. **Next steps** for the user to review and publish
5. **Notes** on any missing assets or areas that need designer review

## Error Handling

### VitePress Build Errors (Most Common)

**Error**: `Failed to resolve import "/components/xxx/xxx.svg" from "docs/components/xxx/overview.md"`

**Cause**: Documentation references an image file that doesn't exist on disk.

**Solution**:
1. **Stop immediately** - Don't generate more docs
2. **Check which images are missing**:
   ```bash
   # List what's actually in the directory
   ls -la warp-docs/docs/public/components/<component-name>/
   ```
3. **Fix the documentation** — two options only, per Rule 6:
   - **Option A**: Export and download the missing images from Figma
   - **Option B**: Remove the image reference from markdown and use a text-only description
   (For a `<Do>` block there is a third: generate the gray placeholder SVG per Rule 2. That is a layout
   placeholder on disk, not a note on the page.)
4. **Verify fix**:
   ```bash
   cd warp-docs && pnpm build   # build catches this; the dev server does not always
   ```

**Prevention**: Always follow the correct order:
1. Export from Figma → 2. Download to disk → 3. Verify files exist → 4. Write documentation

### Other Issues

- **Component not found in Figma**: List available components with `list_components` and ask user to specify correct name
- **Repository not found**: Offer to clone it
- **Missing reference docs**: Use a different well-documented component as reference  
- **Figma API errors**: Proceed with documentation based on existing framework implementation files and general component knowledge
- **Image URL expired**: Re-export the component (URLs expire after ~30 minutes)
- **Empty SVG files**: Check if component is hidden/locked in Figma, try re-exporting
