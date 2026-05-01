/**
 * Narration copy for the /architecture page — JJ-approved verbatim (pass 2).
 * One sentence per tier + monospace caption. Tiers indexed 1-8.
 *
 * IMPORTANT: this file holds public-facing copy only. Do not introduce
 * INTERNAL/PERSONAL names, paths, or client identifiers here.
 */

export type TierNarration = {
  tier: number;
  publicName: string;
  sentence: string;
  caption: string;
};

export const TIER_NARRATION: TierNarration[] = [
  {
    tier: 1,
    publicName: "Foundation rules",
    sentence:
      "One file at the root of my machine that loads at the start of every session.",
    caption: "~/.claude/CLAUDE.md · loads first, every time.",
  },
  {
    tier: 2,
    publicName: "Persistent memory",
    sentence:
      "A short rules cache that survives across sessions, so corrections never get lost between conversations.",
    caption: "Re-injected on every session start.",
  },
  {
    tier: 3,
    publicName: "Home router",
    sentence:
      "The entry point at my Desktop home folder — it routes the work into the right venture.",
    caption: "Reads the request, picks the lane.",
  },
  {
    tier: 4,
    publicName: "Knowledge files",
    sentence:
      "The knowledge files holding my priorities, profile, people, lessons, frameworks — auto-loaded into every session.",
    caption: "One operator brain, always loaded.",
  },
  {
    tier: 5,
    publicName: "Project context files",
    sentence:
      "One file inside each business folder — JFly.Ai, Real Estate, Finances — that adds the rules for that venture.",
    caption: "Loads when work moves into the folder.",
  },
  {
    tier: 6,
    publicName: "Agents",
    sentence:
      "One Chief of Staff today. Agents earn their spot — more spin up when the work genuinely splits.",
    caption: "Earned, not assumed.",
  },
  {
    tier: 7,
    publicName: "Hooks, output styles, skills",
    sentence:
      "The hooks that fire on session events, plus the skills and styles the agent uses to actually do the work.",
    caption: "The agent's tool palette and triggers.",
  },
  {
    tier: 8,
    publicName: "External memory",
    sentence:
      "NotebookLM notebooks holding the long-term context — the brain that doesn't fit inside any one chat.",
    caption: "Where the system remembers across years.",
  },
];
