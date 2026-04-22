# Jira Integration Guide

## Creating Issues via Atlassian MCP Plugin

This skill uses the Atlassian MCP plugin available in Claude Code to create Jira issues programmatically.

### Key Tools Available

1. **getAccessibleAtlassianResources** - Get cloudId for your Jira workspace
2. **createJiraIssue** - Create a new Story with description and fields
3. **getVisibleJiraProjects** - List projects user has access to
4. **lookupJiraAccountId** - Find user/assignee account IDs by name

### Basic Issue Creation Flow

```
1. Get cloudId from user's workspace
2. List available projects (or ask user to select)
3. Look up assignee and reviewer account IDs
4. Call createJiraIssue with:
   - projectKey: e.g., "SCRUM"
   - issueTypeName: "Story"
   - summary: User's feature title
   - description: Full PRD formatted as markdown
   - assignee_account_id: Found from step 3
```

### Example Call

```
createJiraIssue(
  cloudId: "workshop-pink.atlassian.net",
  projectKey: "SCRUM",
  issueTypeName: "Story",
  summary: "Add multi-factor authentication (MFA)",
  description: "[Full PRD markdown here]",
  assignee_account_id: "557058:alice-id-here"
)
```

### Handling Optional Fields

- **Reviewer**: Can be mentioned in description with @-mention (e.g., "@bob_reviewer please review")
- **Labels**: Can be added via additional_fields if your Jira supports them
- **Custom Fields**: Use additional_fields parameter with field IDs

### Error Handling

- If project not found, ask user to verify project key
- If assignee not found, suggest available team members
- If creation fails, show error and offer to retry with different settings

### PRD Description Format

Use markdown in the description field. The template structure will render cleanly in Jira:

```markdown
## Business Context & Goals
[content]

## Requirements & Specifications
[content]

## Acceptance Criteria
- [ ] Checklist item 1
- [ ] Checklist item 2

## Implementation Notes (Optional)
[content]
```

Jira will render this with proper heading hierarchy and formatting.
