---
name: create-ticket
description: Create a Jira ticket with a structured PRD. Trigger this skill whenever the user wants to create a new Jira ticket for a feature, task, or bug—whether they provide a PRD or need to build one interactively. The skill will either accept an existing PRD from session context, or invoke the jira-prd-template skill to guide the user through PRD creation step-by-step. Once the PRD is ready, the skill creates a Jira ticket in the TODO column and assigns it to the user. Use this skill at the start of any feature workflow.
disable-model-invocation: true
---

# Create Ticket Skill

## Overview

This skill captures a structured Product Requirements Document (PRD) and creates a Jira ticket in the SCRUM project's TODO column. If no PRD exists in session, the skill invokes the `jira-prd-template` skill to build one interactively.

## Input

- **Optional: PRD content** - If the user has already created a PRD in this session (e.g., via the `jira-prd-template` skill), the skill uses it directly. Otherwise, the user describes the feature/task and the skill triggers PRD generation.

## Workflow

### Step 1: Check for Existing PRD

1. Look for a PRD already present in the conversation context (formatted as markdown with sections like Business Context, Requirements, Acceptance Criteria, etc.).
2. **If a PRD exists:** Proceed to Step 3 (Create Jira Ticket).
3. **If no PRD exists:** Proceed to Step 2 (Generate PRD).

### Step 2: Generate PRD (if needed)

If no PRD exists in session, trigger the `jira-prd-template` skill:

1. Present: **"I don't see an existing PRD in this session. Let me guide you through creating one."**
2. Invoke the full `jira-prd-template` workflow:
   - Extract title and confirm scope
   - Ask about optional sections
   - Confirm acceptance criteria format
   - Draft and refine each section (mandatory first, then optional)
   - Display complete PRD for final review
3. Once the user confirms the PRD is ready, proceed to Step 3.

### Step 3: Prepare Ticket Content

From the confirmed PRD, extract:
- **Title:** Use the PRD's title (2-5 words, e.g., "User Profile Redesign")
- **Description:** Use the complete PRD markdown (all sections)
- **Project Key:** `SCRUM`
- **Issue Type:** `Task` (or ask the user if they prefer `Story` or `Bug`)

### Step 4: Discover Active Sprint

The SCRUM board ID is `1`. Fetch the active sprint directly:

1. Make a request to the Jira REST API:
   ```
   GET https://workshop-pink.atlassian.net/rest/agile/1.0/board/1/sprint?state=active
   ```

2. Extract the `id` field from the active sprint. If no active sprint exists:
   - Create a ticket without sprint assignment (it will go to backlog)
   - Prompt the user to activate a sprint first

3. Store the active sprint ID as `sprintId` (e.g., `123`).

**Note:** This is an external REST API call. Since the Atlassian MCP tools don't directly expose sprint discovery, you may need to use the WebFetch tool or similar to make this HTTP request with authentication.

### Step 5: Create Jira Ticket with Sprint Assignment

Use the Atlassian MCP to create the ticket with sprint assignment:

```
atlassian:createJiraIssue
  cloudId: workshop-pink.atlassian.net
  projectKey: SCRUM
  issueTypeName: Task
  summary: [PRD title]
  description: [Full PRD markdown]
  assignee_account_id: rui@pinkroom.dev
  additional_fields: {
    "customfield_10020": [sprintId]  # Sprint custom field
  }
```

If sprint discovery failed or no active sprint exists, omit the `customfield_10020` field and the ticket will be created in the backlog.

### Step 6: Report Success

Once the ticket is created, display:
- **Ticket ID** and **URL** (formatted as a link)
- **Status:** If sprint was assigned: on the board in the `TODO` column. If no sprint: in the backlog.
- **Assigned to:** You (rui@pinkroom.dev)
- **Sprint:** The active sprint name (if assigned)
- **Next step hint:** "Ready to start work? Run `/start-work` to create a branch and move this ticket to Ongoing."

## Key Behaviors

1. **PRD is mandatory.** Always ensure a complete, confirmed PRD before creating the ticket. If the user tries to create a ticket without a PRD, ask them to describe their feature first.

2. **Reuse existing PRDs.** If the PRD is already in session (e.g., from a prior `jira-prd-template` invocation), use it directly—don't re-generate.

3. **Single issue type.** Default to `Task`. If the user indicates it should be `Story` or `Bug`, ask them to clarify before creating.

4. **Automatic assignment.** Always assign the ticket to `rui@pinkroom.dev` (the user) immediately upon creation.

5. **Board placement by default.** Always attempt to discover and assign the active sprint. This ensures tickets are placed on the board rather than in the backlog. If no active sprint exists, the ticket will be created in the backlog (this is acceptable but not ideal).

6. **Clear next step.** Suggest `/start-work` at the end so the user knows the workflow continues.

## Example Workflow

**User says:** "Create a ticket for adding a login screen"

**Skill responds:**
1. Checks for existing PRD → None found
2. Says: "No PRD in session. Let me guide you through creating one."
3. Invokes `jira-prd-template` interactively:
   - Title: "User Login Screen" → Confirmed
   - Optional sections: Yes, Yes, No
   - Acceptance criteria: Checklist
   - Drafts Business Context → Confirmed
   - Drafts Requirements → Confirmed
   - Drafts Acceptance Criteria → Confirmed
   - Shows complete PRD → Confirmed
4. Discovers active sprint:
   - Fetches active sprint from board 1 → Sprint ID: 5, Name: "Sprint 23"
5. Creates Jira ticket:
   - Summary: "User Login Screen"
   - Description: [Full PRD markdown]
   - Assignee: rui@pinkroom.dev
   - Sprint: Sprint 23 (via `customfield_10020: [5]`)
6. Reports: "✓ Ticket SCRUM-42 created and placed on Sprint 23 board in TODO column. Run `/start-work` to start."

---

**Alternatively, if PRD is already in session:**

**User says:** "Create a ticket from this PRD"

**Skill responds:**
1. Finds existing PRD in context
2. Extracts title → "Multi-Factor Authentication (MFA)"
3. Discovers active sprint → Sprint ID: 5, Name: "Sprint 23"
4. Creates ticket with full PRD as description and sprint assignment
5. Reports: "✓ Ticket SCRUM-43 created and placed on Sprint 23 board in TODO column."
