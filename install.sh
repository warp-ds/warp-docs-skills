#!/usr/bin/env bash
#
# WARP Docs Skills — installer for macOS
#
#   ./install.sh
#
# Installs:
#   1. The three skills into ~/.claude/skills/
#   2. Node dependencies for the bundled Figma MCP server
#   3. The Figma MCP server registration for Claude Code
#
set -euo pipefail

BUNDLE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_DIR="$BUNDLE_DIR/mcp/figma-design-system-mcp"
SKILLS_SRC="$BUNDLE_DIR/skills"
SKILLS_DEST="$HOME/.claude/skills"
DEFAULT_FILE_KEY="oHBCzDdJxHQ6fmFLYWUltf"   # WARP - Components

bold() { printf "\033[1m%s\033[0m\n" "$1"; }
ok()   { printf "  \033[32m✓\033[0m %s\n" "$1"; }
warn() { printf "  \033[33m!\033[0m %s\n" "$1"; }
err()  { printf "  \033[31m✗\033[0m %s\n" "$1"; }

echo
bold "WARP Docs Skills — installer"
echo

# ---------------------------------------------------------------- 1. preflight
bold "1/4  Checking prerequisites"

if ! command -v node >/dev/null 2>&1; then
  err "node is not installed. Install it first: https://nodejs.org (or 'brew install node')"
  exit 1
fi
ok "node $(node -v)"

if ! command -v npm >/dev/null 2>&1; then
  err "npm is not installed (it ships with node)."
  exit 1
fi
ok "npm $(npm -v)"

command -v git >/dev/null 2>&1 && ok "git $(git --version | awk '{print $3}')" \
  || warn "git not found — you'll need it to work on the docs repo."

if command -v claude >/dev/null 2>&1; then
  ok "claude CLI found"
  HAS_CLAUDE=1
else
  warn "claude CLI not on PATH — the MCP server will be registered via a .mcp.json file instead."
  HAS_CLAUDE=0
fi
echo

# --------------------------------------------------------------- 2. skills
bold "2/4  Installing skills into $SKILLS_DEST"

mkdir -p "$SKILLS_DEST"
for skill_path in "$SKILLS_SRC"/*/; do
  skill="$(basename "$skill_path")"
  target="$SKILLS_DEST/$skill"
  if [ -d "$target" ]; then
    backup="$target.backup-$(date +%Y%m%d-%H%M%S)"
    mv "$target" "$backup"
    warn "existing '$skill' moved to $(basename "$backup")"
  fi
  mkdir -p "$target"
  cp "$skill_path/SKILL.md" "$target/SKILL.md"
  ok "/$skill"
done
echo

# --------------------------------------------------------- 3. MCP dependencies
bold "3/4  Installing Figma MCP server dependencies"

( cd "$MCP_DIR" && npm install --silent --omit=dev )
ok "dependencies installed in mcp/figma-design-system-mcp"
echo

# ------------------------------------------------------------ 4. Figma access
bold "4/4  Connecting to Figma"

echo "  You need a personal Figma access token (it is tied to your own Figma"
echo "  account — never reuse a colleague's)."
echo "  Create one at: https://www.figma.com/settings → Security →"
echo "  Personal access tokens → scope 'File content: read'."
echo

# Non-interactive when there is no terminal on stdin (e.g. run by an agent or CI).
# In that case the token must come from the FIGMA_ACCESS_TOKEN environment variable.
INTERACTIVE=0
[ -t 0 ] && INTERACTIVE=1

FIGMA_TOKEN="${FIGMA_ACCESS_TOKEN:-}"
if [ -z "$FIGMA_TOKEN" ] && [ "$INTERACTIVE" = "1" ]; then
  printf "  Paste your Figma token (input hidden): "
  read -rs FIGMA_TOKEN || true
  echo
fi

if [ -z "$FIGMA_TOKEN" ]; then
  err "No Figma token available."
  echo "  Run the installer from a terminal, or set the token first:"
  echo "      export FIGMA_ACCESS_TOKEN=figd_your_token"
  echo "      ./install.sh"
  exit 1
fi

FILE_KEY="${FIGMA_FILE_KEY:-}"
if [ -z "$FILE_KEY" ] && [ "$INTERACTIVE" = "1" ]; then
  printf "  Figma file key [%s]: " "$DEFAULT_FILE_KEY"
  read -r FILE_KEY || true
fi
FILE_KEY="${FILE_KEY:-$DEFAULT_FILE_KEY}"
ok "Figma file key: $FILE_KEY"
echo

echo "  Testing the connection…"
if FIGMA_ACCESS_TOKEN="$FIGMA_TOKEN" FIGMA_FILE_KEY="$FILE_KEY" \
     node "$MCP_DIR/test-connection.js" >/tmp/warp-figma-test.log 2>&1; then
  ok "Figma connection works"
else
  err "Could not reach Figma. Details:"
  sed 's/^/      /' /tmp/warp-figma-test.log
  echo
  warn "Continuing anyway — fix the token later and re-run this script."
fi
echo

REGISTERED=0
if [ "$HAS_CLAUDE" = "1" ]; then
  claude mcp remove figma-design-system --scope user >/dev/null 2>&1 || true
  if claude mcp add figma-design-system \
       --scope user \
       --env "FIGMA_ACCESS_TOKEN=$FIGMA_TOKEN" \
       --env "FIGMA_FILE_KEY=$FILE_KEY" \
       -- node "$MCP_DIR/index.js" >/dev/null 2>&1; then
    ok "MCP server registered for your user (available in every project)"
    REGISTERED=1
  else
    warn "'claude mcp add' failed — falling back to a .mcp.json file."
  fi
fi

if [ "$REGISTERED" = "0" ]; then
  DOCS_DIR="${WARP_DOCS_DIR:-}"
  if [ -z "$DOCS_DIR" ] && [ "$INTERACTIVE" = "1" ]; then
    printf "  Path to your warp-docs checkout [%s]: " "$HOME/warp-docs"
    read -r DOCS_DIR || true
  fi
  DOCS_DIR="${DOCS_DIR:-$HOME/warp-docs}"
  mkdir -p "$DOCS_DIR"
  MCP_FILE="$DOCS_DIR/.mcp.json"
  [ -f "$MCP_FILE" ] && cp "$MCP_FILE" "$MCP_FILE.backup-$(date +%Y%m%d-%H%M%S)"
  cat > "$MCP_FILE" <<JSON
{
  "mcpServers": {
    "figma-design-system": {
      "command": "node",
      "args": ["$MCP_DIR/index.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "$FIGMA_TOKEN",
        "FIGMA_FILE_KEY": "$FILE_KEY"
      }
    }
  }
}
JSON
  chmod 600 "$MCP_FILE"
  ok "wrote $MCP_FILE"

  # The file holds a token — make sure git can never stage it.
  if [ -d "$DOCS_DIR/.git" ]; then
    EXCLUDE="$DOCS_DIR/.git/info/exclude"
    mkdir -p "$(dirname "$EXCLUDE")"
    if ! grep -qx ".mcp.json" "$EXCLUDE" 2>/dev/null; then
      printf "\n# added by warp-docs-skills installer — contains a Figma token\n.mcp.json\n" >> "$EXCLUDE"
    fi
    ok "'.mcp.json' added to .git/info/exclude so it can't be committed"
  else
    warn "$DOCS_DIR is not a git checkout yet — once it is, add '.mcp.json' to .git/info/exclude."
  fi
  warn "This file contains your token. Never commit or share it."
fi

echo
bold "Done."
echo
echo "Next steps:"
if [ "$REGISTERED" = "1" ]; then
  echo "  The MCP server is registered for your user, so it works in every project."
else
  echo "  The MCP server is configured for $DOCS_DIR only."
fi
cat <<'EOF'

  If you use Claude Code inside VS Code:
    1. File → Open Folder → your warp-docs checkout (open the folder itself,
       not a parent folder).
    2. Reload VS Code: Cmd+Shift+P → "Developer: Reload Window".
       Skills and MCP servers are only picked up on start.
    3. In the Claude panel, approve the "figma-design-system" server when asked.
    4. Type /mcp to confirm it is connected.

  If you use Claude Code in a terminal:
    1. cd into your warp-docs checkout and run:  claude
    2. Approve the "figma-design-system" server when asked.
    3. Type /mcp to confirm it is connected.

  Then try:
       /list-components
       /audit-component Button
       /document-component Alert

See README.md for the full guide.
EOF
echo
