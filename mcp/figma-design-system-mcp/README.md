# Figma Design System MCP Server

An MCP (Model Context Protocol) server that connects your Figma Design System to Claude Code. This enables Claude to read your component library, design tokens, and styles to help you build UIs that match your design system.

## Features

Claude can now:
- 📦 List all components in your design system
- 🔍 Search for specific components (buttons, inputs, cards, etc.)
- 📊 Get component details (properties, variants, styles)
- 🎨 Access design tokens (colors, spacing, typography, border radius)
- ✨ Read color styles, typography styles, and effects
- 📄 Get design system file information
- 🌿 **NEW:** List and switch between Figma branches
- 🔀 **NEW:** Work with different design versions/experiments

## Setup

### 1. Get Your Figma Access Token

1. Go to [Figma Settings](https://www.figma.com/settings)
2. Scroll to **Personal access tokens**
3. Click **Generate new token**
4. Give it a name (e.g., "Claude MCP Server")
5. Copy the token (starts with `figd_`)

### 2. Get Your Figma File Key

Your Figma file URL looks like:
```
https://www.figma.com/file/ABC123DEF456/Design-System-Name
```

The file key is: `ABC123DEF456`

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure the MCP Server

The MCP server is configured using the `.mcp.json` file in this directory. Your credentials are already set up in the file.

To use it in other projects, create a `.mcp.json` file in your project root:

```json
{
  "mcpServers": {
    "figma-design-system": {
      "command": "node",
      "args": ["/Users/iurii.shatalov@m10s.io/figma-design-system-mcp/index.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your_token_here",
        "FIGMA_FILE_KEY": "your_file_key_here"
      }
    }
  }
}
```

**Note:** When you navigate to a directory with `.mcp.json`, Claude Code will prompt you to approve the MCP servers before loading them.

### 5. Restart Claude Code

After adding the configuration, restart Claude Code to load the MCP server.

## Usage Examples

Once configured, you can ask Claude things like:

**Components & Design Tokens:**
- "What components are available in our design system?"
- "Show me all button components"
- "What are our brand colors?"
- "Get the design tokens for spacing"
- "Build a login form using our design system components"
- "What properties does the Button component have?"
- "Show me all typography styles"

**Branch Operations:**
- "List all Figma branches"
- "Switch to the feature/new-button branch"
- "What components are in the experimental branch?"
- "Compare the Button component between main and staging"
- "Switch back to main"

Claude will automatically use the Figma MCP tools to access your design system!

## Available Tools

The MCP server provides these tools to Claude:

**Component Tools:**
1. **list_components** - List all components in the design system
2. **search_components** - Search for components by name/description
3. **get_component_details** - Get detailed info about a specific component
4. **get_design_tokens** - Get design tokens (colors, spacing, typography, etc.)
5. **get_styles** - Get color, typography, and effect styles
6. **get_file_info** - Get general file information

**Branch Tools:**
7. **list_branches** - List all available Figma branches
8. **switch_branch** - Switch to a specific branch by key
9. **switch_to_main** - Switch back to the main file
10. **get_current_branch** - Get information about the currently active branch

## Troubleshooting

### "FIGMA_ACCESS_TOKEN environment variable is required"
- Make sure you've added your Figma token to the MCP server configuration
- Restart Claude Code after updating settings

### "Figma API error: 403"
- Your access token might be invalid or expired
- Generate a new token in Figma settings

### "Figma API error: 404"
- Check that your file key is correct
- Make sure the file is accessible with your Figma account

### MCP server not showing up
- Verify the path to `index.js` is correct in your settings
- Check that dependencies are installed (`npm install`)
- Look for errors in Claude Code logs

## Development

Run in development mode with auto-reload:

```bash
npm run dev
```

## Publishing (Optional)

To share this with your team via NPM:

1. Update `package.json` with your details
2. Run `npm publish`
3. Team members can install with: `npm install -g your-package-name`
4. Then configure with just the package name instead of the full path

## License

MIT

---

Built for Claude Code • [Learn more about MCP](https://modelcontextprotocol.io)
