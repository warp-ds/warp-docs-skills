# Install guide + prompts (VS Code)

For Claude Code running as the **VS Code extension**. Terminal users: see
[the terminal section](#terminal-instead-of-vs-code) at the bottom.

Two things about the VS Code extension shape this guide:

- An `export FIGMA_ACCESS_TOKEN=…` typed in the integrated terminal does **not**
  reach the extension. Only variables in your `~/.zshrc` (read when VS Code
  starts) do.
- Skills and MCP servers are loaded when the extension starts. After installing,
  you must **reload the window** — nothing appears until you do.

---

## Recommended: run the installer yourself, let Claude verify

Takes about a minute and your token is never typed into a chat.

### Step 1 — get a Figma token

https://www.figma.com/settings → **Security** → **Personal access tokens** →
**Generate new token**. Name it `claude-warp-docs`, scope **File content: read**.
Copy it — Figma shows it once. It starts with `figd_`.

### Step 2 — run the installer in VS Code's terminal

Open the integrated terminal: **⌃`** (Ctrl + backtick), or **Terminal → New
Terminal**. Then:

```bash
unzip ~/Downloads/warp-docs-skills.zip -d ~
cd ~/warp-docs-skills
./install.sh
```

It asks for your Figma token — paste it and press Enter. The input stays hidden.
Press Enter again to accept the default Figma file key.

The script installs the three skills, installs the MCP server's dependencies,
tests the Figma connection and registers the server.

### Step 3 — open the docs repo as your workspace

**File → Open Folder →** your `warp-docs` checkout. Open that folder itself, not
a parent folder — the skills assume it is the workspace root.

Don't have it yet? In the terminal:

```bash
git clone https://github.com/warp-ds/docs.git ~/warp-docs
```

### Step 4 — reload the window

**Cmd+Shift+P → "Developer: Reload Window"**

### Step 5 — let Claude check the install

Open the Claude panel and paste:

```
I just installed the WARP Design System documentation skills from
~/warp-docs-skills. Please verify the install and tell me if anything is wrong.

Check all of these and report each one:
  1. ls ~/.claude/skills/ — document-component, audit-component and
     list-components should each exist with a SKILL.md that has yaml
     frontmatter (name + description).
  2. The Figma MCP server is reachable. Run:
        cd ~/warp-docs-skills/mcp/figma-design-system-mcp && ls node_modules >/dev/null
     and confirm the dependencies are installed.
  3. Where the server is registered — either `claude mcp get
     figma-design-system` (if the claude CLI is on my PATH), or a .mcp.json in
     my workspace root. The path in "args" must be the absolute path to
     ~/warp-docs-skills/mcp/figma-design-system-mcp/index.js.
  4. If a .mcp.json exists in my workspace, confirm that git cannot commit it:
     it should be listed in .git/info/exclude or .gitignore. It contains my
     Figma token. Never print the token itself.
  5. That my workspace root is a checkout of the warp-ds/docs repo (git remote
     -v) and tell me which branch I'm on.

Then tell me in one short list what works, what doesn't, and the exact fix for
anything broken. Section 7 of ~/warp-docs-skills/README.md lists the known
failure modes.
```

Then type `/mcp` in the Claude panel — `figma-design-system` should be listed
and connected. Approve it if VS Code asks.

### Step 6 — first real task

```
/list-components
```

---

## Alternative: let Claude run the whole install

Use this if you'd rather not touch the terminal yourself. Claude cannot type a
secret into a hidden prompt, so hand it the token through a temporary file
instead of the chat.

**In VS Code's integrated terminal (⌃`), once:**

```bash
unzip ~/Downloads/warp-docs-skills.zip -d ~
printf 'figd_paste_your_token_here' > ~/.figma-token && chmod 600 ~/.figma-token
```

**Then paste this into the Claude panel:**

```
Please install the WARP Design System documentation skills in ~/warp-docs-skills.

1. Read ~/warp-docs-skills/README.md first so you know what the bundle is.
2. My Figma token is in the file ~/.figma-token. Pass it to commands as
   "$(cat ~/.figma-token)" — never cat it to the screen, never echo it, never
   copy it into any file yourself, and never include it in your summary.
3. Run the installer non-interactively:
      cd ~/warp-docs-skills && \
      FIGMA_ACCESS_TOKEN="$(cat ~/.figma-token)" ./install.sh </dev/null
   It installs the skills into ~/.claude/skills/, runs npm install for the
   bundled Figma MCP server, tests the Figma connection, and registers the
   server (via `claude mcp add --scope user` if the CLI is available,
   otherwise by writing a .mcp.json into my warp-docs checkout).
4. If the connection test reports 403 / "Invalid token", stop and tell me. My
   token is wrong or missing the "File content: read" scope. Do not work around it.
5. If I have no checkout at ~/warp-docs, clone
   https://github.com/warp-ds/docs.git into ~/warp-docs before the installer
   needs it, but do not run pnpm install unless I ask.
6. Verify: skills present in ~/.claude/skills/, the MCP server registered with
   the correct absolute path, and — if a .mcp.json was written — that it is
   excluded from git.
7. Delete ~/.figma-token when you are done.
8. Finish with a short summary and these next steps for me: open my warp-docs
   folder as the VS Code workspace, then Cmd+Shift+P → "Developer: Reload
   Window", then check /mcp.
```

---

## If something goes wrong

Paste this into the Claude panel:

```
The WARP docs skills install in ~/warp-docs-skills isn't working — I don't see
the skills / the Figma MCP server. Please diagnose and fix it, checking in this
order:

  - node -v (needs 18+), and node_modules exists in
    ~/warp-docs-skills/mcp/figma-design-system-mcp
  - ls ~/.claude/skills/ for document-component, audit-component and
    list-components, each with a SKILL.md containing yaml frontmatter
  - is the claude CLI on my PATH? (`which claude`) If yes, check
    `claude mcp get figma-design-system`. If no, look for .mcp.json in my
    VS Code workspace root instead — that is the fallback the installer uses.
  - the "args" path must be absolute and point at
    ~/warp-docs-skills/mcp/figma-design-system-mcp/index.js, and
    FIGMA_FILE_KEY should be oHBCzDdJxHQ6fmFLYWUltf
  - test the token without printing it:
      cd ~/warp-docs-skills/mcp/figma-design-system-mcp && \
      FIGMA_ACCESS_TOKEN="$(cat ~/.figma-token 2>/dev/null)" \
      FIGMA_FILE_KEY=oHBCzDdJxHQ6fmFLYWUltf node test-connection.js
    (if that file is gone, tell me and I'll supply the token another way)

Section 7 of ~/warp-docs-skills/README.md lists the known failure modes. Tell me
what was broken and what you changed. Never print my Figma token. Remind me that
skills and MCP servers only load after Cmd+Shift+P → "Developer: Reload Window".
```

### Quick answers

| Symptom | Fix |
|---------|-----|
| `/document-component` not offered | Reload the window. Skills load at start. |
| `/mcp` doesn't list the server | Wrong workspace folder open, or the window wasn't reloaded. |
| Claude can't find `warp-docs` files | Open the `warp-docs` folder itself as the workspace, not a parent folder. |
| `claude: command not found` in terminal | Fine — the installer falls back to a workspace `.mcp.json`. To get the CLI: `npm install -g @anthropic-ai/claude-code` |
| 403 Invalid token | Regenerate the token with **File content: read** and re-run `./install.sh`. |

---

## Using the skills day to day

Work with the `warp-docs` folder open as your VS Code workspace.

```
/list-components               → coverage report across Figma and the docs
/audit-component Button        → completeness review of one component
/document-component Alert      → full documentation on a new branch
```

`/document-component` creates a branch, exports the SVGs from Figma into
`docs/public/components/<name>/`, then writes `overview.md`, `usage.md` and
`accessibility.md`. It stops there — reviewing, committing and opening the PR
stays with you.

Preview the site from VS Code's terminal:

```bash
pnpm install    # first time only
pnpm dev        # → http://localhost:5173
```

Quote multi-word names: `/document-component "Text Field"`.

---

## Terminal instead of VS Code

```bash
unzip ~/Downloads/warp-docs-skills.zip -d ~
cd ~/warp-docs-skills
./install.sh
cd ~/warp-docs
claude
```

The token can also come from the environment, which makes the installer fully
non-interactive: `export FIGMA_ACCESS_TOKEN=figd_… && ./install.sh </dev/null`.
