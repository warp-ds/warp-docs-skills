---
name: audit-component
description: Audit WARP component documentation for completeness and quality
---

# Component Documentation Audit

Audit the documentation for a WARP Design System component to ensure completeness, quality, and consistency.

## Input

The user provides a component name (e.g., "Alert", "Button", "Modal")

## Process

### 1. Locate Documentation

1. Find the component's documentation directory:
   - Path: `warp-docs/docs/components/<component-name>/`
   - Check for: `overview.md`, `usage.md`, `accessibility.md`
   - Check for framework docs: `frameworks/` subdirectory

### 2. Completeness Check

Check if the following sections exist and are complete:

#### overview.md
- [ ] Title and description
- [ ] `<ComponentsStatus />` tag
- [ ] Related components links
- [ ] Examples section with live demos
- [ ] General explanation
- [ ] Variants section (if applicable)
  - [ ] All Figma variants are documented
  - [ ] Each variant has image and description
- [ ] Anatomy section
  - [ ] Anatomy image exists
  - [ ] All parts are numbered and explained
- [ ] `<component-questions />` tag

#### usage.md
- [ ] Title and description
- [ ] `<ComponentsStatus />` tag
- [ ] Guidelines section
- [ ] "When to use" section
- [ ] "When not to use" section
- [ ] Behaviour section
- [ ] Content guidelines (if applicable)
- [ ] Placement section
- [ ] Interaction section
- [ ] Best practices (Do/Don't)
- [ ] `<component-questions />` tag

#### accessibility.md
- [ ] Title and description
- [ ] `<ComponentsStatus />` tag
- [ ] General accessibility overview
- [ ] ARIA attributes guidance
- [ ] Keyboard interaction patterns
- [ ] Screen reader considerations
- [ ] Visual accessibility (contrast, focus, color independence)
- [ ] Motion/animation guidance (if applicable)
- [ ] Testing recommendations
- [ ] Best practices
- [ ] `<component-questions />` tag

#### Framework docs
- [ ] React implementation exists
- [ ] React 19 implementation exists
- [ ] Vue implementation exists
- [ ] Elements (Web Components) implementation exists
- [ ] Android implementation exists (if applicable)
- [ ] iOS implementation exists (if applicable)

### 3. Quality Check

Evaluate the documentation quality:

#### Content Quality
- **Clarity**: Are instructions clear and unambiguous?
- **Completeness**: Are all use cases and variants covered?
- **Accuracy**: Does it match Figma and implementation?
- **Examples**: Are examples realistic and helpful?
- **Tone**: Is the tone consistent with WARP style?

#### Technical Accuracy
- **Figma alignment**: Do variants match Figma?
- **Props/API**: Are all properties documented?
- **Accessibility**: Are ARIA attributes correct?
- **Code examples**: Do examples use correct syntax?

#### Consistency
- **Structure**: Does it follow the standard structure?
- **Formatting**: Is markdown formatted consistently?
- **Terminology**: Uses WARP-standard terms?
- **Image paths**: Follow naming conventions?

### 4. Asset Check

Verify that referenced assets exist:
- [ ] Anatomy image: `/components/<name>/<name>-anatomy.svg`
- [ ] Variant images: `/components/<name>/<name>-variants-*.svg`
- [ ] Usage example images (if referenced)
- [ ] Placeholder image (if exists)

### 5. Cross-Reference Check

- Compare with Figma to ensure all variants are documented
- Check that framework docs align with main documentation
- Verify related components are appropriately linked
- Confirm component appears in navigation/manifest

## Output Format

Provide a comprehensive audit report:

### Summary
- Overall completeness score (percentage)
- Quality rating (Excellent / Good / Needs Work / Incomplete)
- Priority issues to address

### Detailed Findings

#### ✅ Strengths
- What's well documented
- High-quality sections
- Good examples

#### ⚠️ Issues Found
- Missing sections
- Incomplete content
- Quality concerns
- Broken links or references

#### 🎨 Missing Assets
- List of image files that are referenced but don't exist
- Suggested asset creation priorities

#### 🔧 Recommendations
- Specific improvements to make
- Sections to expand
- Examples to add
- Consistency fixes needed

#### 📊 Comparison with Reference
- How it compares to well-documented components
- Gaps in coverage
- Opportunities to match reference quality

### Action Items

Provide a prioritized list of action items:
1. **Critical**: Missing required sections or major errors
2. **Important**: Incomplete sections or quality issues
3. **Enhancement**: Nice-to-haves and polish

### Next Steps

Suggest concrete next steps for the user:
- Which files to update first
- What information to gather
- Who to consult (designers, developers)
- Whether to use `/document-component` to regenerate

## Example Output

```
# Alert Component Documentation Audit

## Summary
- **Completeness**: 75% (9/12 sections complete)
- **Quality**: Good
- **Priority**: Address missing usage guidelines

## Detailed Findings

### ✅ Strengths
- Overview is comprehensive with all 4 variants clearly documented
- Accessibility section is thorough and follows WCAG standards
- Good code examples in framework docs
- Anatomy diagram exists and is well-labeled

### ⚠️ Issues Found
- Usage guidelines are minimal (marked "in progress")
- Missing "When not to use" section
- No content guidelines for writing alert messages
- Behaviour section is incomplete
- Missing example images for best practices

### 🎨 Missing Assets
- `/components/alert/alert-usage-placement.svg`
- `/components/alert/alert-examples-do-dont.svg`

### 🔧 Recommendations
1. Expand usage.md with comprehensive guidelines
2. Add practical Do/Don't examples with visuals
3. Document dismissible vs. non-dismissible behavior
4. Add content writing guidelines
5. Include placement examples from FINN/Blocket

### Action Items

**Critical:**
1. Complete usage.md with full guidelines

**Important:**
2. Add content writing guidelines
3. Create missing usage example images
4. Document behavior patterns

**Enhancement:**
5. Add more code examples
6. Cross-link with Toast and Callout components

## Next Steps
Run `/document-component Alert` to regenerate usage.md with comprehensive guidelines, or manually update the missing sections.
```
