{
  "title": "Claude Code skills: from a 330 line CLAUDE.md to 18 skills",
  "slug": "claude-code-skills",
  "date": "2026-11-21",
  "description": "How my agent rules moved out of one long CLAUDE.md and 95 memory files into Claude Code skills with triggers, and the router that picks them.",
  "keyword": "claude code skills",
  "cover": "/blog/claude-code-skills/skill-flow.png",
  "coverAlt": "Flow from a prompt through the skill router hook to a SKILL CHECK line, the skill loading, and agents getting their skills",
  "tags": [
    "claude code skills",
    "claude code skills github"
  ],
  "series": {
    "id": "AW",
    "part": 3
  },
  "draft": true
}
My Claude Code setup used to be one CLAUDE.md of 330 lines, 95 memory files and a router I kept by hand. Today it is 18 Claude Code skills in a [public repo](https://github.com/v1siond/claude-skills), each one telling a 137 line hook in its own frontmatter when it applies. This post shows what a skill looks like there, how a prompt finds the right one, and where the matching still misses.

![Flow from a prompt through the skill router hook to a SKILL CHECK line, the skill loading, and agents getting their skills](/blog/claude-code-skills/skill-flow.png)

*What happens between typing a prompt and the model starting work.*

## Where it started: one file that kept growing

I keep a backup of the setup from the day I moved it, 2026-10-16. On that day it held:

- a CLAUDE.md of 330 lines and 22 headings, read at the start of every session;
- 95 memory files for the engine project, each one a lesson from a correction;
- 60 SKILL.md files spread over my projects;
- a 66 line router hook with one regex per skill, typed by hand, for a single project folder.

Every rule I added made the file longer. A long file is loaded whole whether the task needs it or not. A skill costs one description until a request matches it.

## What Claude Code skills are in my setup

A skill is a folder with a `SKILL.md`. Claude Code reads the frontmatter of every installed skill and loads the body only when a request matches it ([the official docs](https://docs.claude.com/en/docs/claude-code/skills)). I added one field of my own, `metadata.triggers`: the phrases I actually type when I need that skill.

From `skills/global/bug-investigation/SKILL.md` at `1fd0a18`, lines 1 to 9:

```markdown
---
name: bug-investigation
description: Investigate a bug he reports, reproduce it with his environment and data through the real entry point, measure instead of recalling, compare field by field, fix the root cause, never dismiss it. Use when he says "bug", "broken", "doesn't work", "still broken", "investigate", "dig into it", "the data is wrong". Do NOT use for writing the test (testing-standard).
metadata:
  author: Alexander Pulido
  version: 4.0.0
  triggers: ["bug", "broken", "doesn't work", "not working", "still broken", "still wrong", "it's wrong", "investigate", "dig into it", "the data is wrong", "regress*", "why is this", "why does"]
  sources: the law on owning all code in CLAUDE.md
---
```

The skills talk about "he" because they are written to the model about me. Since 2026-10-31 each skill holds the craft of one kind of work and nothing else: the method, the facts, the traps, and checks a reviewer can run. Commit `8b51700` took out every critic loop, gate, eval and done list the skills had grown, and left the workflow to one skill. That skill was orchestration until 2026-11-16, when autodevelopment replaced it (`f4b836e`).

## How a prompt reaches the right skill

The diagram at the top is the whole path. A `UserPromptSubmit` hook, `skill-router.py`, reads my prompt and prints one `SKILL CHECK` line naming the skills that match. A short `protocol.txt`, 22 lines, is added to every prompt with the rules no single skill can hold: answer first, nothing leaves the machine without my yes, no dashes.

When the prompt asks for work (a word like "fix", "build" or "add") and a development skill matched too, the line names autodevelopment first, before any skill loads. That skill sizes the ticket and briefs each agent with a `Skills you run:` line, so a backend agent loads the testing and engineering skills and a writer loads the blog and writing ones. The skills are a pool that any agent can pick from, and the brief names which ones apply.

## The router builds its table from the skills

The old router had a table like `("nebulith-water", r"river|\blake|...")` for each skill, written by hand and valid under one project folder. Every new skill meant editing the hook.

The new one reads the frontmatter of every installed skill on each prompt and compiles its triggers.

From `harness/hooks/skill-router.py` at `1fd0a18`, lines 64 to 77:

```python
def load(cwd):
    """[(name, is_project, compiled phrase regex, always)] for the skills in scope."""
    table = []
    for md in sorted(SKILLS.glob("*/SKILL.md")):
        try: fm = frontmatter(md)
        except Exception: continue
        if not fm: continue
        meta = fm.get("metadata") or {}
        root = meta.get("root")
        if not in_scope(cwd, root): continue
        trig = [str(t).lower() for t in meta.get("triggers") or []]
        rx = re.compile("|".join(phrase_rx(t) for t in trig)) if trig else None
        table.append((fm.get("name", md.parent.name), bool(root), rx, bool(root and meta.get("always"))))
    return table
```

A project skill sets `metadata.root` to its repo folder and only matches there. A phrase becomes a regex that forgives the way I type: a space matches a space or a hyphen, an apostrophe is optional, plurals and past tenses match, and a trailing `*` makes a stem.

From `harness/hooks/skill-router.py` at `1fd0a18`, lines 40 to 49:

```python
def phrase_rx(phrase):
    stem = phrase.endswith("*")
    parts = []
    for ch in phrase.rstrip("*"):
        if ch == " ": parts.append(r"[\s-]+")
        elif ch == "-": parts.append(r"[\s-]?")
        elif ch == "'": parts.append(r"['’]?")
        else: parts.append(re.escape(ch))
    tail = r"[a-z0-9]*" if stem else r"(?:s|es|ed|ing|d)?(?![a-z0-9])"
    return r"(?<![a-z0-9])" + "".join(parts) + tail
```

So "regress*" catches "regression" and "regressed", and "dig into it" catches "dig-into it". Adding a skill now means writing its triggers, and it routes on the next prompt.

## One prompt through it

The hook reads JSON on stdin, so it is easy to try from the repo folder. These runs are from my machine on 2026-11-21, against the skills I have installed.

Output of a bug report:

```text
$ echo '{"prompt": "the login page is broken again", "cwd": "/tmp"}' | python3 harness/hooks/skill-router.py
SKILL CHECK: bug-investigation. Invoke the ones that fit with the Skill tool before acting, and work by their steps.
```

Output of the same report asked as work:

```text
$ echo '{"prompt": "fix the login page, it is broken", "cwd": "/tmp"}' | python3 harness/hooks/skill-router.py
SKILL CHECK: autodevelopment is the workflow for this task, per ticket (the director sizes it and dispatches the agents). Give each agent the skills of its role from autodevelopment references/skill-map.md. Matched for this prompt: bug-investigation.
```

"broken" matched bug-investigation both times. "fix" is a work word, and with a development skill matched the second prompt goes to autodevelopment first; bug-investigation comes along as the skill an agent will need.

## A correction becomes one line of a rule

Before the move, a correction turned into a memory file. One of them, about the model never disowning code in my repos, was 34 lines long. Today that lesson is half a sentence of rule 4 in `protocol.txt`: "All the code in his repos is his and ours", followed by the phrases it must never use. The skill that most needs it, bug-investigation, names the same law as its source.

The same thing happened to whole skills. The ship skill lists four retired skills it replaced (git workflow, pre deploy checks, release and tag, data migrations), and writing lists four more. My memory index for this project now only points at the skills.

Agents write and edit the skill files, the same way they write the code. The rule in my CLAUDE.md is that a skill is never created or changed unless I ask for it; a correction goes into the work and a findings file first.

## From 83 skills down to 18

The count did not go down in a straight line.

| Date | What | SKILL.md files |
|---|---|---|
| 2026-10-16 | the backup before the move | 60 |
| 2026-10-23 | after a week of moving every doc into skills | 83 |
| 2026-10-30 | first commit of the public repo, generic skills only | 17 |
| 2026-11-20 | the repo at `1fd0a18` (6 more project skills kept private) | 18 |

The jump to 83 came from turning every framework doc into its own skill. Then I split what was generic from what belonged to one project. The generic part went public, the project facts went into a private overlay that `.gitignore` keeps out, and merging skills that did the same job brought the count down. The catalogue, `SKILLS.md`, is generated on my machine and lists all of them.

## Where it still misses

Phrase matching only knows the phrases somebody wrote down.

Output of a prompt no trigger covers:

```text
$ echo '{"prompt": "fix the flaky login test", "cwd": "/tmp"}' | python3 harness/hooks/skill-router.py | sed "s|$HOME|~|"
SKILL CHECK: no trigger matched. Before acting, read the name list at the top of ~/projects/claude/skills/SKILLS.md and then only the section of the skill that fits; invoke it. If none does, say so in one line; never create or change a skill without his explicit request.
```

"flaky" and "test" on their own are in nobody's triggers. "fix" is still a work word, but with no development skill matched there is nothing to hand an agent, so the hook falls back to the catalogue. The `sed` only shortens my home folder in the path. The protocol then has the model read the skill names, pick the one that fits, or say in one line that none does.

A few routes cannot be a phrase at all: a URL, a ticket code like C32 where case matters, "release" without "notes" after it. Those live in a short hand table.

From `harness/hooks/skill-router.py` at `1fd0a18`, lines 23 to 30:

```python
# Rows a phrase list cannot express: a URL, a ticket code (case sensitive), a key chord, a lookahead.
HAND = [
    ("ship", r"\brelease\b(?! notes)|\btag\b", 0),
    ("research", r"https?://(?!\S*youtu)", 0),
    ("research", r"youtu\.?be", 0),
    ("autodevelopment", r"\b[A-Z]\d{1,2}\b", "case"),
    ("motion-video", r"\bfilms?\b|\bcaptions?\b|\bsegments\b|cuts? on the beat|\bscore (under|over|for) (it|the)", 0),
]
```

Skill-craft used to carry trigger tests, one line sessions written the way I talk. I removed them on 2026-10-31 (`7f9aed2`) along with the other forced sections. Those tests are the next post in this series.

The repo is [v1siond/claude-skills](https://github.com/v1siond/claude-skills). You can install all of it with `harness/install.sh`, or copy one skill folder into your own `~/.claude/skills` and use it alone.
