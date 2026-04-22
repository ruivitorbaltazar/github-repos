---
name: open-pr
description: Create and open a pull request on GitHub. Trigger this skill when you're ready to merge your feature branch into main—the skill compares your work against main, drafts a PR title and body from the diff and commit history, and opens the PR with the correct assignee and reviewer. Use this after `/save-work` to complete the feature workflow.
---

# Open PR Skill

## Overview

This skill creates a GitHub pull request for a feature branch. It generates a PR title and description based on the diff, then opens the PR with the correct assignee (ruivitorbaltazar) and reviewer (rafaellbaptista).

## Input

- **No input required.** The skill assumes you're on a feature branch (created by `/start-work`) with commits pushed to origin.

## Workflow

### Step 1: Identify Branches

Determine the current branch and base branch:

```bash
current_branch=$(git rev-parse --abbrev-ref HEAD)
base_branch="main"
```

Validate that the current branch is not `main` (can't open a PR against itself).

### Step 2: Check for Pushed Commits

Verify that the branch exists on the remote:

```bash
git branch -r | grep "origin/$current_branch"
```

If the branch is not on the remote, report: "Branch not found on remote. Run `/save-work` first to push your commits."

### Step 3: Generate PR Title

Extract the Jira ticket ID and derive the PR title:

**Pattern:** Use the first commit message or the branch name to infer the title.

1. Extract the first line of the most recent commit:
   ```bash
   git log -1 --pretty=format:"%s"
   ```
2. Use this as the PR title if it's descriptive (e.g., `feat: add login screen`).
3. If the commit message is generic (e.g., `wip` or `temp`), extract the title from the branch name instead:
   - Branch: `feat/SCRUM-42-user-login-screen`
   - Title: `Add user login screen` (capitalize, remove prefix)

**Final title:** Should be concise (under 72 characters) and descriptive.

### Step 4: Generate PR Description

Build a PR description aligned with `.github/pull_request_template.md`:

```markdown
## What's Changed
- [Inferred from diff]

## Why It Matters
- [Inferred from commit messages or ticket context]
```

**For "What's Changed":**
- Run `git diff main...HEAD --stat` to list files changed
- Summarize the changes (e.g., "Added LoginScreen component with form validation", "Updated Button styling and color utilities")

**For "Why It Matters":**
- Infer from commit messages or the Jira ticket (if context is available)
- Example: "Improves user onboarding experience and security with MFA support"
- If unclear, use a generic reason tied to the ticket ID: "Implements SCRUM-42"

### Step 5: Create the PR

Use the GitHub CLI to open the pull request:

```bash
gh pr create \
  --title "{title}" \
  --body "{body}" \
  --assignee ruivitorbaltazar \
  --reviewer rafaellbaptista \
  --base main
```

**Important:** 
- `--assignee ruivitorbaltazar` assigns the PR to you (the implementer)
- `--reviewer rafaellbaptista` requests review from the specified reviewer
- `--base main` targets the main branch

If the command succeeds, the PR is created and opened in your browser (or CLI reports the URL).

### Step 6: Report Success

Once the PR is created, display:
- **PR number** and **URL** (formatted as a link)
- **Title:** The PR title
- **Assignee:** You (ruivitorbaltazar)
- **Reviewer:** rafaellbaptista
- **Status:** "Ready for review"
- **Next step hint:** "PR is open for review. Monitor for feedback or checks."

## Key Behaviors

1. **Main branch only.** PRs always target `main`. Feature branches created by `/start-work` are designed to flow into `main`.

2. **Smart title and description.** The PR title and body are inferred from commits and diffs, not user input. This keeps the workflow fast.

3. **Fixed assignee and reviewer.** Assignments are hardcoded to ensure consistency:
   - Assignee: `ruivitorbaltazar` (always the current user)
   - Reviewer: `rafaellbaptista` (always the same reviewer)

4. **Draft-safe.** The PR is created as a regular PR (not a draft). If you want to mark it as a draft, the user can do so manually via GitHub.

5. **No merge on create.** The skill only opens the PR. Merging is done manually via GitHub after review.

## Error Handling

- **Not on a feature branch:** Report: "You're on {branch}. Switch to a feature branch created by `/start-work` first."
- **Branch not on remote:** Report: "Branch not found on remote. Run `/save-work` to push your commits first."
- **gh CLI not available:** Report: "GitHub CLI not found. Install it via `brew install gh` (macOS) or see https://cli.github.com."
- **Authentication issue:** Report: "GitHub authentication failed. Run `gh auth login` to re-authenticate."
- **PR already exists:** Report: "A PR already exists for this branch: {URL}. Updating commits will auto-update the PR."

## Example Workflow

**User says:** "Open PR"

**Skill responds:**
1. Identifies current branch: `feat/SCRUM-42-user-login-screen`
2. Verifies branch exists on remote: ✓
3. Extracts recent commit: `feat: implement user login screen with styled button`
4. Uses as PR title: `Implement user login screen with styled button`
5. Generates description from `git diff main...HEAD --stat`:
   ```markdown
   ## What's Changed
   - Implemented LoginScreen component with email/password form
   - Added Button component with dynamic styling
   - Updated theme.ts with new color palette
   
   ## Why It Matters
   - Improves user onboarding experience (SCRUM-42)
   ```
6. Opens PR:
   ```bash
   gh pr create \
     --title "Implement user login screen with styled button" \
     --body "## What's Changed\n- Implemented LoginScreen component..." \
     --assignee ruivitorbaltazar \
     --reviewer rafaellbaptista \
     --base main
   ```
7. Reports:
   ```
   ✓ PR #15 created
   ✓ URL: https://github.com/user/repo/pull/15
   ✓ Title: Implement user login screen with styled button
   ✓ Assigned to: ruivitorbaltazar
   ✓ Reviewer: rafaellbaptista
   
   Ready for review!
   ```

---

**Edge case: Multiple small commits**

**User ran `/save-work` twice, creating two commits on the branch**

**Skill responds:**
1. Identifies branch: `feat/SCRUM-43-fix-search-bug`
2. Extracts commit messages: `fix: improve search performance` (most recent), `fix: handle empty results`
3. Constructs PR title from branch name: `Fix search bug`
4. Constructs description from both commits:
   ```markdown
   ## What's Changed
   - Improved search query performance with debouncing
   - Fixed empty results error handling
   
   ## Why It Matters
   - Provides better search experience for users (SCRUM-43)
   ```
5. Opens PR with both commits included
