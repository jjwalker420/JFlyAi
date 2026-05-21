---
name: connect-linkedin
description: >
  Use when a client says "set up my LinkedIn", "connect linkedin", "linkedin
  setup", "wire up LinkedIn", "get LinkedIn connected", or "install linkedin".
  Fully automated — Claude runs every command and controls the browser.
  Client only needs to log in when prompted. Assumes Claude Code, Homebrew,
  Node, and Python are already installed.

  Trigger phrases: "set up my LinkedIn", "connect linkedin", "linkedin setup",
  "wire up linkedin", "get linkedin connected", "install linkedin",
  "set up n8n", "connect my tools", "aios connect".
---

# Connect LinkedIn — Automated Setup

## CLAUDE INSTRUCTIONS (not shown to user)

Run every step below using Bash and Chrome MCP tools. Do not give the user
commands to copy-paste. Execute them yourself. Keep every user-facing message
short — 15 words max. Wait for confirmation at each ✋ before moving on.

Workflow template URL (used in Phase 3):
`https://raw.githubusercontent.com/jjwalker420/JFlyAi/main/n8n-workflows/linkedin-webhook-post.json`

---

## Phase 0 — Check What's Already Done

Run silently:
```bash
claude mcp list 2>/dev/null | grep -i linkedin
uv --version 2>/dev/null
```

- LinkedIn MCP already listed → skip Phase 1 and 2, go to Phase 3
- `uv` missing → run `brew install uv` before continuing, no user action needed

Tell user: **"Got it. Starting your LinkedIn setup — just follow my prompts."**

---

## Phase 1 — Install LinkedIn MCP

Run silently:
```bash
claude mcp add linkedin -s user -e UV_HTTP_TIMEOUT=300 -- uvx linkedin-scraper-mcp@latest 2>&1
```

If it errors, show the error and stop. Otherwise move on without mentioning it.

---

## Phase 2 — LinkedIn Login

Run:
```bash
uvx linkedin-scraper-mcp@latest --login &
```

✋ Tell user: **"A browser just opened. Log into LinkedIn, then say 'done'."**

After user says done, verify:
```bash
ls ~/.linkedin-mcp/profile/ 2>/dev/null | wc -l
```

- Returns > 0 → good, move to Phase 3
- Returns 0 → tell user: **"Didn't catch the session. Log in again and say 'retry'."** Then re-run login.

---

## Phase 3 — n8n Setup (Chrome MCP)

✋ Ask user: **"Do you have an n8n account? Yes or no."**

### If NO:
Tell user: **"Opening n8n now. Sign up with your email — takes 2 minutes."**

Use Chrome MCP:
- Navigate to `https://n8n.io/cloud`
- Let them sign up (Claude watches, doesn't touch credentials)

✋ Tell user: **"Say 'I'm in' once you're inside your n8n dashboard."**

### If YES:
✋ Ask: **"What's your n8n URL? (format: yourname.app.n8n.cloud)"**

---

### Import the workflow (Chrome MCP — runs for both paths)

Once inside the n8n dashboard:

1. Use Chrome MCP to click the **⋯ menu** (top right)
2. Click **"Import from URL"**
3. Type this URL into the import field:
   `https://raw.githubusercontent.com/jjwalker420/JFlyAi/main/n8n-workflows/linkedin-webhook-post.json`
4. Click **Import**
5. Double-click the **LinkedIn** node to open it
6. Click **"Connect to LinkedIn"**

✋ Tell user: **"A LinkedIn popup appeared. Authorize it, then say 'authorized'."**

If user says popup didn't appear: **"Check the address bar for a blocked popup icon — click it and allow."**

After authorized:
7. Use Chrome MCP to click **Publish** (top right)
8. Capture the webhook URL from the page:
   `https://[theirinstance].app.n8n.cloud/webhook/linkedin-post`

Tell user: **"n8n is live. Wiring it into your Claude now."**

---

## Phase 4 — Wire the Webhook URL

Run (replace URL with the one captured in Phase 3):
```bash
SKILL_FILE="$HOME/.claude/skills/linkedin-post/SKILL.md"
WEBHOOK="https://[captured-instance].app.n8n.cloud/webhook/linkedin-post"

if [ -f "$SKILL_FILE" ]; then
  sed -i '' "s|https://jjwalker.app.n8n.cloud/webhook/linkedin-post|$WEBHOOK|g" "$SKILL_FILE"
  echo "wired"
else
  echo "skill missing"
fi
```

- Returns "wired" → move to Phase 5
- Returns "skill missing" → run the install for linkedin-post skill, then re-run

---

## Phase 5 — Restart + Verify

✋ Tell user: **"Almost done. Quit Claude Code fully and reopen it. Say 'back' when you're in."**

After user says "back":

Run verification:
```bash
claude mcp list 2>/dev/null | grep linkedin
```

Then call LinkedIn MCP:
```
get my LinkedIn profile
```

- Profile returns → print the status below and done
- Errors → check `claude mcp list`, re-run Phase 1 if missing

---

## Done — Print This

```
✅ LinkedIn MCP — connected, session saved
✅ n8n webhook — live and published
✅ linkedin-post skill — wired to your webhook

You're set. Say "draft a LinkedIn post" anytime.
Claude will write it in your voice and ask before posting.
```

---

## Troubleshooting (Claude handles these silently)

| Problem | Action |
|---------|--------|
| `uv` not found | `brew install uv` then retry Phase 1 |
| LinkedIn MCP missing after restart | Re-run Phase 1 |
| n8n OAuth popup blocked | Tell user to click popup icon in browser bar |
| n8n webhook 404 | Chrome MCP → navigate to workflow → click Publish |
| LinkedIn session empty after login | Re-run `uvx linkedin-scraper-mcp@latest --login` |
