# WARP Docs Skills for Claude Code

ℹ️ Development of Warp has moved in-house. This repository is read-only.

Three Claude Code skills that automate WARP Design System component documentation,
plus the Figma MCP server they depend on.

| Skill | What it does |
|-------|--------------|
| `/document-component <name>` | Reads a component in Figma, exports its SVGs, and writes `overview.md`, `usage.md` and `accessibility.md` on a fresh git branch in the docs repo. |
| `/audit-component <name>` | Reviews an already-documented component for completeness, quality, missing assets, and gives a prioritised action list. |
| `/list-components` | Cross-references Figma against the docs repo and reports documentation coverage for every component. |

Everything is bundled here — you don't need anything from anyone else's machine
except **your own Figma access token**.

---

## 1. Prerequisites

You need these on your Mac before installing:

| Tool | Check | How to get it |
|------|-------|---------------|
| **Claude Code** (VS Code extension or CLI) | `claude --version`, or the Claude icon in VS Code | https://claude.com/claude-code |
| **Node.js 18+** | `node -v` | https://nodejs.org or `brew install node` |
| **git** | `git --version` | Comes with Xcode Command Line Tools: `xcode-select --install` |
| **pnpm** | `pnpm -v` | `npm install -g pnpm` — only needed to preview the docs site locally |
| **A Figma account** with access to the **WARP - Components** file | — | Ask the design team if you can't open it |

### Get your Figma token

1. Go to https://www.figma.com/settings
2. **Security** tab → **Personal access tokens** → **Generate new token**
3. Give it a name (e.g. `claude-warp-docs`) and at minimum the scope
   **File content: read** (add **Comments: write** if you want Claude to be able
   to leave comments for designers)
4. Copy the token — Figma shows it only once. It starts with `figd_`

> **This token is a personal secret.** It grants access to every Figma file you
> can see. Never commit it, never paste it into Slack, and never reuse someone
> else's. Generate your own.

---

## 2. Install

```bash
cd ~/warp-docs-skills      # wherever you unzipped/cloned this folder
./install.sh
```

In **VS Code**, open the integrated terminal with **⌃`** (Ctrl + backtick) and
run it there.

> **[PROMPT.md](PROMPT.md)** has the step-by-step VS Code walkthrough plus
> ready-to-paste prompts for letting Claude run or verify the install. The
> installer is non-interactive when `FIGMA_ACCESS_TOKEN` is set in the
> environment, so an agent can run it.

The installer will:

1. Check your prerequisites
2. Copy the three skills into `~/.claude/skills/`
3. Install the Figma MCP server's Node dependencies
4. Ask for your Figma token, test the connection, and register the MCP server —
   at **user scope** via `claude mcp add` if the CLI is on your PATH, otherwise
   by writing a `.mcp.json` into your `warp-docs` checkout (and excluding it
   from git, since it holds your token)

Existing skills with the same names are backed up, not overwritten.

### Verify it worked — VS Code

1. **File → Open Folder →** your `warp-docs` checkout. Open that folder itself,
   not a parent folder; the skills assume it is the workspace root.
2. **Cmd+Shift+P → "Developer: Reload Window".** Skills and MCP servers are only
   read when the extension starts, so nothing appears until you reload.
3. In the Claude panel, approve `figma-design-system` if VS Code asks.
4. Type `/mcp` — it should be listed as connected. Then try `/list-components`.

### Verify it worked — terminal

```bash
cd ~/warp-docs        # your checkout of https://github.com/warp-ds/docs
claude
```

```
/mcp          → "figma-design-system" should be listed as connected
/list-components
```

If `/mcp` shows the server but not connected, approve it when prompted and
restart Claude Code once.

> **VS Code gotcha:** `export FIGMA_ACCESS_TOKEN=…` typed into the integrated
> terminal does *not* reach the Claude extension — it only affects that
> terminal. That is fine for running `./install.sh`, which writes the token into
> the MCP config for you. It only matters if you install the optional plugin
> version below, which reads the variable at extension start; for that, put the
> export in `~/.zshrc` and restart VS Code.

---

## 3. Manual install (if `install.sh` doesn't work for you)

**a. Skills**

```bash
mkdir -p ~/.claude/skills
cp -R skills/document-component ~/.claude/skills/
cp -R skills/audit-component    ~/.claude/skills/
cp -R skills/list-components    ~/.claude/skills/
```

**b. Figma MCP server**

```bash
cd mcp/figma-design-system-mcp
npm install

# sanity check
FIGMA_ACCESS_TOKEN=figd_your_token \
FIGMA_FILE_KEY=oHBCzDdJxHQ6fmFLYWUltf \
node test-connection.js
```

**c. Register the server with Claude Code**

```bash
claude mcp add figma-design-system \
  --scope user \
  -e FIGMA_ACCESS_TOKEN=figd_your_token \
  -e FIGMA_FILE_KEY=oHBCzDdJxHQ6fmFLYWUltf \
  -- node "$PWD/index.js"
```

Or, instead of the CLI, copy `.mcp.json.example` to `.mcp.json` in your
`warp-docs` checkout, fill in the absolute path and your token, and add
`.mcp.json` to `.git/info/exclude` so it can never be committed.

`oHBCzDdJxHQ6fmFLYWUltf` is the file key of the **WARP - Components** Figma file
(the part after `/design/` in its URL). It is not a secret.

---

## 4. Alternative: install as a Claude Code plugin

This folder is also a valid Claude Code plugin marketplace, which keeps the
skills and the MCP server together and makes updates a single command.

```bash
echo 'export FIGMA_ACCESS_TOKEN=figd_your_token' >> ~/.zshrc && source ~/.zshrc
cd mcp/figma-design-system-mcp && npm install && cd -
```

In VS Code the export **must** be in `~/.zshrc` and you must fully quit and
reopen VS Code afterwards — the extension reads your shell environment only at
startup, so a variable exported in the integrated terminal will not be seen.

Then, inside Claude Code:

```
/plugin marketplace add ~/warp-docs-skills
/plugin install warp-docs-skills@warp-docs
```

Skills then appear namespaced, e.g. `/warp-docs-skills:document-component`.
If the plugin route gives you trouble, just use `./install.sh` — it's the more
predictable path.

---

## 5. Using the skills

The `warp-docs` checkout must be Claude's working directory.

**VS Code:** open it with **File → Open Folder** — the folder itself, not a
parent. Pull latest from the integrated terminal (`git pull`) before you start.

**Terminal:**

```bash
cd ~/warp-docs
git pull
claude
```

### Document a new component

```
/document-component Alert
```

Claude will:

1. Create a branch `docs/alert-documentation`
2. Find *Alert* in Figma and read its variants and properties
3. Export every variant, the anatomy frame and state frames as SVG into
   `docs/public/components/alert/` — **images first, always**, because VitePress
   fails the build if markdown references an image that isn't on disk
4. Generate gray placeholder SVGs for every do/don't illustration Figma doesn't
   have yet, so the layout is right and a designer has named files to replace
5. Write `overview.md`, `usage.md` and `accessibility.md`, following the WARP
   house rules and the patterns of Carbon, Material 3 and Apple HIG
6. Verify every behavioural claim against the real component source in
   `warp-ds/elements`, `warp-ds/warp-ios` and `warp-ds/warp-android`
7. Run `pnpm build`, then tell you what it created and what a designer still owes you

Preview it:

```bash
pnpm install     # first time only
pnpm dev
# → http://localhost:5173/docs/components/alert/overview
```

Then review, commit and open a PR yourself — the skill does not push anything.

#### The house rules

`document-component` enforces eight non-negotiable rules that come from the docs
owner and the August 2026 documentation audit:

| # | Rule |
|---|------|
| 1 | Do's and don'ts use the `<DoDont>` component — never a markdown table. One pair per wrapper. |
| 2 | Every `<Do>` carries an `imgurl`; missing artwork becomes a named gray placeholder. |
| 3 | Overview illustrations get a `#F6F6F6` backdrop baked in, so they survive dark mode. |
| 4 | Do's and don'ts are judged on quality, never count. `accessibility.md` gets none. |
| 5 | Behavioural claims — defaults, ARIA, focus, deprecation — are read out of the source, not other doc pages. |
| 6 | **Never publish a gap.** No "coming soon", no `<InProgressStatus />`, no empty headings. Gaps go to Jira. |
| 7 | `overview.md` carries a Figma / Elements / iOS / Android naming table wherever the four diverge. |
| 8 | `accessibility.md` is never a stub — all six sections, every claim sourced. |

`docs/components/alert/` is the reference implementation of all eight.

### Audit an existing component

```
/audit-component Button
```

Gives a completeness score, missing sections, broken image references and a
prioritised list of fixes.

### See the whole picture

```
/list-components
/list-components --status=missing
/list-components --framework=android
```

### Tips

- Quote multi-word names: `/document-component "Text Field"`
- The skills *enhance* existing docs rather than replacing them — hand-written
  guidance is preserved
- Claude asks before writing files and running git commands; read the diffs
- If a component isn't in Figma yet, the skill says so instead of inventing
  variants

---

## 6. Updating

Replace the folder with the newer version and re-run:

```bash
./install.sh
```

Your old skills are backed up as `~/.claude/skills/<name>.backup-<timestamp>`.

To change the skills' behaviour, edit
`~/.claude/skills/<skill-name>/SKILL.md` — they are plain markdown prompts, no
code. Send changes back so everyone stays in sync.

`config.json` in this folder holds shared defaults (docs repo URL, Figma file
key, reference components, required sections).

---

## 7. Troubleshooting

**`/document-component` isn't offered in Claude Code**
Check the file exists at `~/.claude/skills/document-component/SKILL.md`, then
restart Claude Code — skills are read at startup. In VS Code that means
**Cmd+Shift+P → "Developer: Reload Window"**; closing the Claude panel is not
enough.

**`/mcp` doesn't list `figma-design-system`**
```bash
claude mcp list                      # is it registered?
claude mcp get figma-design-system   # correct path and env?
```
The `args` path must be the absolute path to
`mcp/figma-design-system-mcp/index.js` inside *this* folder.

No `claude` command? Then the installer used the fallback: look for `.mcp.json`
in your VS Code workspace root instead. It is only picked up when that folder is
the workspace root — and after a window reload.

**VS Code: Claude can't find the docs files, or writes them to the wrong place**
You have a parent folder open as the workspace. Open the `warp-docs` folder
itself (**File → Open Folder**). Claude's working directory is the workspace
root.

**"Invalid token" / 403 from Figma**
The token expired, was revoked, or lacks *File content: read*. Generate a new
one and re-run `./install.sh`.

**"Component not found in Figma"**
Names must match Figma exactly. Ask Claude to run `list_components` first, or
check you're pointed at the right file key.

**VitePress: `Failed to resolve import "/components/x/x.svg"`**
Markdown references an image that isn't on disk. Either export it from Figma or
remove the reference — `ls docs/public/components/<name>/` shows what you
actually have. The skill is written to prevent this, but it can happen if a
Figma export URL expired mid-run (they expire after ~30 minutes; just re-run).

**`pnpm dev` won't start**
`npm install -g pnpm`, make sure port 5173 is free, then
`cd ~/warp-docs && pnpm install && pnpm dev`.

---

## 8. What's in this folder

```
warp-docs-skills/
├── README.md                      ← you are here
├── CHANGELOG.md                   ← what changed between versions
├── PROMPT.md                      ← copy-paste prompt to let Claude install it
├── install.sh                     ← one-command setup
├── config.json                    ← shared defaults
├── .mcp.json.example              ← manual MCP config template
├── .claude-plugin/                ← optional plugin/marketplace metadata
│   ├── plugin.json
│   └── marketplace.json
├── skills/
│   ├── document-component/SKILL.md
│   ├── audit-component/SKILL.md
│   └── list-components/SKILL.md
└── mcp/figma-design-system-mcp/   ← the Figma MCP server (Node, no secrets)
    ├── index.js
    ├── figma-client.js
    ├── test-connection.js
    └── package.json
```

No credentials are stored in this folder. Everyone supplies their own Figma
token at install time.

---

## 9. Uninstall

```bash
rm -rf ~/.claude/skills/document-component \
       ~/.claude/skills/audit-component \
       ~/.claude/skills/list-components
claude mcp remove figma-design-system --scope user
```

Then revoke the token in Figma → Settings → Security if you no longer need it.
