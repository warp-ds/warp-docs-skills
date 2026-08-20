# Quick Start Guide

Get your Figma Design System connected to Claude in 5 minutes!

## Step 1: Get Your Figma Credentials

### Figma Access Token
1. Open [Figma Settings](https://www.figma.com/settings)
2. Scroll to "Personal access tokens"
3. Click "Generate new token"
4. Name it "Claude MCP" and click "Generate"
5. **Copy the token** (starts with `figd_`)

### Figma File Key
1. Open your Design System file in Figma
2. Look at the URL: `https://www.figma.com/file/ABC123DEF456/Your-Design-System`
3. **Copy the middle part**: `ABC123DEF456`

## Step 2: Configure the MCP Server

The server is already configured! The `.mcp.json` file in this directory contains your Figma credentials.

To use it in other projects, create a `.mcp.json` file in your project root:

```json
{
  "mcpServers": {
    "figma-design-system": {
      "command": "node",
      "args": ["/Users/iurii.shatalov@m10s.io/figma-design-system-mcp/index.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "PASTE_YOUR_TOKEN_HERE",
        "FIGMA_FILE_KEY": "PASTE_YOUR_FILE_KEY_HERE"
      }
    }
  }
}
```

## Step 3: Restart Claude Code

Close and reopen Claude Code (or reload VS Code window).

## Step 4: Test It!

Ask Claude:
```
What components are available in our design system?
```

Claude will use the Figma MCP server to fetch your components!

## Example Prompts

Try these to see what you can do:

- "List all button variants in our design system"
- "What are our brand colors?"
- "Show me the spacing tokens"
- "Get details about the Card component"
- "Build a sign-up form using our design system"
- "What typography styles do we have?"

## Troubleshooting

**Can't find settings.json?**
```bash
# Create it if it doesn't exist
mkdir -p ~/.claude
echo '{"mcpServers":{}}' > ~/.claude/settings.json
```

**Server not connecting?**
- Make sure you restarted Claude Code
- Check that the path to `index.js` is correct
- Verify your token and file key are valid

**Still stuck?**
Check the full [README.md](README.md) for detailed troubleshooting.

---

🎉 **You're all set!** Claude can now access your Figma Design System.
