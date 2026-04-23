---
name: start-work
description: Create a feature branch and transition a Jira ticket to In Progress. Trigger this skill when the user is ready to start implementing a ticket—they'll select a ticket from the TODO column, the skill creates a feature branch with a standard naming convention, checks it out, and moves the ticket to the Ongoing column. Use this after creating a ticket with `/create-ticket`.
disable-model-invocation: true
---

# Start Work Skill

## Overview

This skill transitions a ticket from the TODO column to Ongoing and sets up a corresponding feature branch. It bridges the planning phase (Jira) and the implementation phase (local development).

## Input

- **Jira ticket selection:** The user either specifies a ticket ID (e.g., "SCRUM-42") or the skill lists TODO tickets and the user picks one.

## Workflow

### Step 1: List TODO Tickets

Use the Atlassian MCP to fetch all issues in the TODO column of the SCRUM board:

```
atlassian:searchJiraIssuesUsingJql
  cloudId: workshop-pink.atlassian.net
  jql: "project = SCRUM AND status = TODO ORDER BY created DESC"
  maxResults: 20
  fields: ["key", "summary", "description"]
```

### Step 2: Select a Ticket

1. **If only one TODO ticket exists:** Present it and ask for confirmation: "Found one ticket: [KEY] - [Summary]. Ready to start?"
2. **If multiple TODO tickets exist:** List them (key + summary) and ask: "Which ticket would you like to start? (Enter the ticket key, e.g., SCRUM-42)"
3. **If no TODO tickets exist:** Inform the user and suggest creating a ticket first with `/create-ticket`.

Once the user confirms or selects, proceed to Step 3.

### Step 3: Derive Branch Name

From the selected ticket, create a branch name:

**Format:** `feat/SCRUM-{id}-{title-slug}`

**Rules:**
- Extract ticket ID and summary
- Lowercase the summary
- Replace spaces with hyphens
- Remove or replace special characters (keep alphanumerics and hyphens only)
- **Example:** `SCRUM-42 "User Login Screen"` → `feat/SCRUM-42-user-login-screen`

### Step 4: Create and Check Out Branch

Execute git commands to prepare the branch:

```bash
git checkout main
git pull origin main
git checkout -b feat/SCRUM-{id}-{title-slug}
```

If any of these commands fail, report the error and stop.

### Step 5: Transition Ticket to Ongoing

Use the Atlassian MCP to move the ticket from TODO to Ongoing:

```
atlassian:transitionJiraIssue
  cloudId: workshop-pink.atlassian.net
  issueIdOrKey: SCRUM-{id}
  transition:
    id: [transition-id for "TODO" → "Ongoing"]
```

**Important:** The transition ID depends on the board's workflow. The available transitions can be fetched via:

```
atlassian:getTransitionsForJiraIssue
  cloudId: workshop-pink.atlassian.net
  issueIdOrKey: SCRUM-{id}
```

Look for a transition with a name like "Start Progress", "In Progress", or "Ongoing". Use its ID.

### Step 6: Report Success

Once both the branch is created and the ticket is transitioned, display:
- **Branch name:** `feat/SCRUM-{id}-{title-slug}`
- **Ticket status:** Moved to Ongoing
- **Ticket URL:** Link to the updated ticket
- **Next step hint:** "Ready to code. Run `/save-work` when you're done to commit and push."

## Key Behaviors

1. **Main branch safety:** Always `git checkout main` and `git pull` before creating the feature branch to ensure it's based on the latest code.

2. **Deterministic naming:** Branch names are derived from ticket data, not user input. This ensures consistency across the team.

3. **Status transition first, code second.** The ticket moves to Ongoing immediately when the branch is created—this signals to the team that work is in progress.

4. **Single ticket per branch.** A user can only start one ticket at a time (one branch checked out). If they need to switch tickets, they should stash/commit current work and run `/start-work` again.

5. **Clear handoff:** Always suggest `/save-work` at the end.

## Error Handling

- **No TODO tickets:** Suggest `/create-ticket` to create a new ticket first.
- **Git branch creation fails:** Report the git error (likely due to a naming conflict or unclean working directory) and suggest resolving it manually.
- **Jira transition fails:** Report the transition error. The branch is still created locally—the user can retry the transition via Jira manually or re-run the skill.

## Example Workflow

**User says:** "Start work"

**Skill responds:**
1. Fetches TODO tickets → Finds 2 tickets:
   - SCRUM-42: User Login Screen
   - SCRUM-43: Multi-Factor Authentication
2. Presents list and asks: "Which ticket would you like to start?"
3. User responds: "SCRUM-42"
4. Derives branch name: `feat/SCRUM-42-user-login-screen`
5. Checks out branch:
   - `git checkout main`
   - `git pull origin main`
   - `git checkout -b feat/SCRUM-42-user-login-screen`
6. Fetches available transitions and moves ticket TODO → Ongoing
7. Reports:
   ```
   ✓ Branch created: feat/SCRUM-42-user-login-screen
   ✓ Ticket SCRUM-42 moved to Ongoing
   
   Ready to code. Run `/save-work` when you're done.
   ```

---

**Simpler case: Only one TODO ticket**

**User says:** "Start work"

**Skill responds:**
1. Fetches TODO tickets → Finds 1:
   - SCRUM-99: Fix search bug
2. Presents: "Found one ticket: SCRUM-99 - Fix search bug. Ready to start?"
3. User confirms: "Yes"
4. Creates branch and transitions ticket
5. Reports success
