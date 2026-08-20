---
name: list-components
description: List all WARP components and their documentation status
---

# WARP Components Documentation Status

List all components in the WARP Design System and show their documentation status.

## Process

### 1. Gather Component Information

1. **From Figma**:
   - Use `mcp__figma-design-system__list_components` to get all components
   - Group by component type/category
   - Note component properties and variants

2. **From Docs Repository**:
   - Scan `warp-docs/docs/components/` directory
   - Check for each component:
     - `overview.md` exists and has content
     - `usage.md` exists and has content  
     - `accessibility.md` exists
     - Framework implementations in `frameworks/`
   - Look for "in progress" markers

3. **Cross-reference**:
   - Match Figma components with documentation
   - Identify components in Figma but not documented
   - Identify documented components not in Figma (deprecated?)

### 2. Categorize Documentation Status

For each component, determine status:

- ✅ **Complete**: All three main docs exist with substantial content, no "in progress" markers
- 🚧 **In Progress**: Docs exist but marked as "in progress" or minimal content
- ⚠️ **Partial**: Some docs exist, others missing
- ❌ **Missing**: No documentation exists
- 🔍 **Figma Only**: Component exists in Figma but no docs
- 📝 **Docs Only**: Documentation exists but no Figma component found

### 3. Calculate Statistics

- Total components in Figma
- Total documented components
- Documentation completion percentage
- Breakdown by status category

## Output Format

### Summary Table

```markdown
# WARP Design System - Documentation Status

**Last Updated**: [Current Date]

## Overview
- **Total Components in Figma**: XX
- **Documented Components**: XX
- **Documentation Coverage**: XX%
- **In Progress**: XX
- **Missing**: XX

## Components by Status

### ✅ Complete (XX components)
| Component | Variants | Frameworks | Last Updated |
|-----------|----------|------------|--------------|
| Badge | 8 | 6/6 | 2026-03-15 |
| Button | 4 | 6/6 | 2026-03-20 |
| Range Slider | 1 | 5/6 | 2026-03-26 |

### 🚧 In Progress (XX components)
| Component | Missing | Status |
|-----------|---------|--------|
| Alert | Usage guidelines | Overview complete, usage minimal |
| Broadcast | Usage guidelines | Minimal documentation |

### ⚠️ Partial (XX components)
| Component | Has Overview | Has Usage | Has A11y | Frameworks |
|-----------|--------------|-----------|----------|------------|
| Card | ✓ | ✗ | ✗ | 4/6 |

### ❌ Missing Documentation (XX components)
| Component | In Figma | Notes |
|-----------|----------|-------|
| Stepper | ✓ | No docs exist yet |

### 🔍 Figma Only (XX components)
Components in Figma without documentation:
- Component Name 1
- Component Name 2

### 📝 Docs Only (XX components)
Documented but not in Figma (possibly deprecated):
- Component Name 1
- Component Name 2
```

### Detailed Breakdown

For each category, provide additional context:
- Which components are priorities for documentation
- Which have recent updates
- Which are most commonly used (if known)

### Recommendations

Suggest priorities for documentation work:
1. **High Priority**: Commonly used components with missing/minimal docs
2. **Medium Priority**: Complete partial documentation
3. **Low Priority**: Edge case or rarely used components

### Quick Actions

Provide ready-to-use commands:
```
# Document high-priority components
/document-component Alert
/document-component Modal
/document-component Tooltip

# Audit in-progress components
/audit-component Alert
/audit-component Broadcast
```

## Optional Filters

If the user specifies filters, apply them:
- **By status**: Show only components with specific status (e.g., "missing", "in-progress")
- **By framework**: Show components missing specific framework implementations
- **By category**: Group by component type (Form, Feedback, Layout, etc.)

## Example Usage

```
User: /list-warp-components
Assistant: [Generates full status report]

User: /list-warp-components --status=missing
Assistant: [Shows only components with missing documentation]

User: /list-warp-components --framework=android
Assistant: [Shows components missing Android implementation]
```

## Notes

- Check git history for "Last Updated" dates
- Use file modification times if git history unavailable
- Consider framework implementation completeness in overall status
- Highlight components with accessibility.md as a quality indicator
