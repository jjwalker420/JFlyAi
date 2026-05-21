#!/bin/bash
echo ""
echo "Installing connect-linkedin skill..."
echo "(Skills are instructions Claude follows when you trigger them.)"
echo ""

DEST="$HOME/.claude/skills/connect-linkedin"
mkdir -p "$DEST"
curl -fsSL https://raw.githubusercontent.com/jjwalker420/JFlyAi/main/skills/connect-linkedin/SKILL.md -o "$DEST/SKILL.md"

echo ""
echo "Done. Open Claude Code and say: set up my LinkedIn"
echo ""
