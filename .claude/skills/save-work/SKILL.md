---
name: save-work
description: Stage, commit, and push your work to the remote branch. Trigger this skill when you've finished making changes and want to save them—the skill automatically stages all files, generates a concise commit message based on the diff, and pushes to the origin. Use this to checkpoint your work while on a feature branch created by `/start-work`.
---

# Save Work Skill

## Overview

This skill provides a quick checkpoint for in-progress work. It stages all local changes, generates a meaningful commit message by analyzing the diff, and pushes the branch to the remote repository.

## Input

- **No input required.** The skill assumes you're on a feature branch (created by `/start-work`) with uncommitted changes.

## Workflow

### Step 1: Stage All Changes

Stage all modified and new files:

```bash
git add -A
```

If there are no changes to stage, report: "No changes to commit." and stop.

### Step 2: Generate Commit Message

Analyze the staged diff to generate a one-line commit message:

```bash
git diff --staged --stat
```

From the `--stat` output, infer a concise, imperative commit message. Examples:

| Changes | Inferred Message |
|---------|------------------|
| `src/screens/LoginScreen.tsx` (new file) | `feat: add login screen` |
| `src/components/Button.tsx`, `src/utils/colors.ts` (modified) | `feat: update button styling and color palette` |
| `src/hooks/useAuth.ts` (modified) | `feat: improve auth hook error handling` |
| `README.md` (modified) | `docs: update README` |
| Multiple unrelated files | `feat: implement feature work` |

**Rules:**
- Start with `feat:` for new features, `fix:` for bug fixes, `docs:` for documentation, `refactor:` for refactors, `style:` for formatting.
- Keep to one line, under 72 characters ideally.
- Be descriptive enough that someone reading the log understands what changed.

### Step 3: Commit

Create the commit:

```bash
git commit -m "{generated-message}"
```

If the commit fails (e.g., due to hooks or merge conflicts), report the error and stop.

### Step 4: Push to Origin

Push the branch to the remote:

```bash
git push origin HEAD
```

The `HEAD` alias ensures the branch name matches the local branch, avoiding accidental pushes to the wrong remote branch.

### Step 5: Report Success

Once the push completes, display:
- **Commit message:** The message that was committed
- **Commit hash:** The short SHA of the new commit (e.g., `a1b2c3d`)
- **Branch:** The current branch name
- **Remote status:** "Pushed to origin"
- **Next step hint:** "Ready to open a PR? Run `/open-pr` to create a pull request."

## Key Behaviors

1. **Automatic staging.** All changes (new, modified, deleted) are staged. No option to cherry-pick files.

2. **Smart message generation.** The commit message is inferred from the diff, not provided by the user. This keeps the workflow fast and ensures consistency.

3. **Single commit per invocation.** Each run of `/save-work` creates one commit. If the user has made multiple logical changes, they should run `/save-work` multiple times.

4. **Push immediately.** After committing, the branch is immediately pushed to origin. This ensures remote backups and enables PR creation.

5. **No force push.** Uses `git push` without `--force`. If the remote branch has diverged, the push will fail, alerting the user to rebase or merge as needed.

## Error Handling

- **No changes to commit:** Inform the user: "No staged changes. Make sure you've modified files on the branch."
- **Commit fails:** Report the git error (e.g., hook failure, merge conflict). User should investigate and fix.
- **Push fails:** Report the git error. Common causes:
  - Remote has commits not in local branch → Suggest `git pull --rebase origin HEAD` and retry
  - Protected branch → Suggest creating a PR instead
  - Authentication issue → Suggest checking git credentials

## Example Workflow

**User says:** "Save my work"

**Skill responds:**
1. Stages all changes: `git add -A`
2. Analyzes diff:
   ```
   src/screens/LoginScreen.tsx      | 150 +++
   src/components/Button.tsx         |  25 ++
   src/styles/theme.ts               |  10 +
   3 files changed, 185 insertions(+)
   ```
3. Generates message: `feat: implement user login screen with styled button`
4. Commits: `git commit -m "feat: implement user login screen with styled button"`
5. Pushes: `git push origin HEAD`
6. Reports:
   ```
   ✓ Commit: a1b2c3d - feat: implement user login screen with styled button
   ✓ Branch: feat/SCRUM-42-user-login-screen
   ✓ Pushed to origin
   
   Ready to open a PR? Run `/open-pr`.
   ```

---

**Edge case: No changes**

**User says:** "Save my work"

**Skill responds:**
1. Tries to stage: `git add -A`
2. No changes found
3. Reports: "No changes to commit. Have you made any modifications on this branch?"
