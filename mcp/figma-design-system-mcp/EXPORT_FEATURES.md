# Export and Write Features

Version 2.0.0 adds export and write capabilities to the Figma Design System MCP server.

## New Export Tools

### 1. `export_component_image`

Export any component or node as an image file.

**Parameters:**
- `nodeId` (required): The Figma node ID to export
- `format` (optional): Image format - `svg`, `png`, `jpg`, or `pdf` (default: `svg`)
- `scale` (optional): Scale factor from 1-4 (default: 1)

**Returns:**
- Image URL that can be downloaded
- Node ID and format information

**Example:**
```json
{
  "nodeId": "123:456",
  "format": "svg",
  "scale": 2
}
```

### 2. `export_component_by_name`

Export a component by its name - automatically finds and exports it.

**Parameters:**
- `componentName` (required): The exact name of the component
- `format` (optional): Image format - `svg`, `png`, `jpg`, or `pdf` (default: `svg`)
- `scale` (optional): Scale factor from 1-4 (default: 1)

**Returns:**
- Component ID and image URL
- Download link for the exported image

**Example:**
```json
{
  "componentName": "Button/Primary",
  "format": "svg",
  "scale": 1
}
```

### 3. `get_component_variants`

Get all variants of a component set for documentation.

**Parameters:**
- `componentSetId` (required): The component set node ID

**Returns:**
- Array of all variant components with their properties

**Example:**
```json
{
  "componentSetId": "123:789"
}
```

## New Utility Tools

### 4. `find_node_by_name`

Find a node's ID by searching for its name.

**Parameters:**
- `nodeName` (required): The name of the node to find

**Returns:**
- Node ID if found, or error message if not found

**Example:**
```json
{
  "nodeName": "Documentation Assets"
}
```

## Write Capabilities

### 5. `add_comment`

Add comments to the Figma file for collaboration.

**Parameters:**
- `message` (required): The comment text
- `x` (required): X coordinate
- `y` (required): Y coordinate  
- `nodeId` (optional): Attach comment to a specific node

**Returns:**
- Created comment data

**Example:**
```json
{
  "message": "Please review this component documentation",
  "x": 100,
  "y": 200,
  "nodeId": "123:456"
}
```

### 6. `get_comments`

Retrieve all comments from the Figma file.

**Parameters:** None

**Returns:**
- Array of all comments in the file

## Typical Workflow for Documentation

1. **Find component:**
   ```
   search_components -> get_component_details
   ```

2. **Export component image:**
   ```
   export_component_by_name -> Download SVG from returned URL
   ```

3. **Get all variants:**
   ```
   get_component_variants -> export_component_image for each variant
   ```

4. **Save to docs:**
   ```
   Download images and save to docs/public/components/<name>/
   ```

## Image Download

The export tools return Figma-hosted image URLs that are **temporary** (expire after a short time). To use them in documentation:

1. Get the image URL from the export response
2. Download the image immediately using curl or fetch
3. Save to your documentation repository

**Example download:**
```bash
curl -o component.svg "https://figma.com/image/url/here"
```

## Limitations

### Direct File Editing Not Supported

Figma's REST API does not currently support:
- Creating new frames/nodes programmatically
- Editing existing node properties
- Moving or deleting nodes

These operations require the **Figma Plugin API** which runs inside Figma's desktop app.

### Workarounds

For creating documentation assets in Figma:
1. Manually create frames in the playground file
2. Use this MCP server to export them
3. Or build a Figma plugin for automated frame creation

### What IS Supported

✅ **Export** - All node types can be exported as images
✅ **Comments** - Full read/write support for comments
✅ **Read operations** - Full access to file structure and data
❌ **Node creation** - Not available via REST API
❌ **Node editing** - Not available via REST API

## Best Practices

1. **Use SVG for documentation** - Scalable and smaller file size
2. **Export at scale 2 for retina displays** - Better quality on high-DPI screens
3. **Download images immediately** - URLs expire quickly
4. **Name components clearly** - Makes `export_component_by_name` easier
5. **Use component sets** - Group variants together for easier documentation
6. **Add comments for feedback** - Collaborate on component documentation

## Error Handling

Common errors and solutions:

- **"Component not found"** - Check the exact component name with `list_components`
- **"Node ID not found"** - Verify the node exists with `find_node_by_name`
- **"Export failed"** - Check the node is visible and not hidden/locked
- **"403 Forbidden"** - Verify the access token has read permissions

## Next Steps

After restarting Claude Code, test the new features:

```javascript
// Test export
export_component_by_name({ componentName: "Button", format: "svg" })

// Test finding nodes
find_node_by_name({ nodeName: "Documentation Assets" })

// Test variants
get_component_variants({ componentSetId: "component-set-id-here" })
```
