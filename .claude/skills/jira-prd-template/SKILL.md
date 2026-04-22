---
name: jira-prd-template
description: Build a structured Product Requirements Document (PRD) for features, tasks, or requirements. Trigger this skill when a user needs to document what's being built and how to verify it—whether they're creating a Jira ticket, writing specifications, defining acceptance criteria, or organizing scattered requirements into a concrete plan. The skill guides users through mandatory sections (business context, requirements, acceptance criteria) and optional sections (implementation notes, design links, risks/dependencies). PRD stays in session, ready for downstream Jira creation or documentation workflows.
---

# Jira PRD Template Skill

## Overview

This skill creates a well-structured Product Requirements Document (PRD) that ensures consistent documentation of requirements, implementation details, and verification criteria. The PRD is built conversationally in the current session and remains available for downstream skills to transform into Jira tickets or other formats.

## Input

User provides:
- **Task/feature description** - A description of what needs to be built or documented
- **Optional: Preference for acceptance criteria format** - Will be asked if not stated

Skill infers:
- **Title** - Extracted from task description, confirmed with user
- **Section content** - Inferred from the feature description; user reviews and accepts or edits each section

## Critical: This is an Interactive, Multi-Turn Skill

This skill is **designed to be conversational and multi-turn**. You will guide the user through 6-7 steps, presenting one inferred section at a time and waiting for their acceptance or edits before moving to the next step. This is not a one-shot skill.

**Your role:** Act as a PRD co-author. For each section, infer the content from the user's feature description and present it as a draft. Ask the user to accept it or suggest changes. Incorporate any edits, then move to the next section.

**Do not ask for clarification about your role or capability.** This skill exists to guide users through PRD generation interactively. Proceed with confidence—always draft content first, then ask for feedback. Never present a blank prompt asking the user to fill a section from scratch.

## Workflow

### Step 1: Extract Title & Confirm Scope

1. Read the user's task/feature description
2. Infer a concise title (2-5 words, e.g., "User Profile Redesign", "Payment v3 Migration")
3. Present the inferred title clearly: **"Title: [Inferred Title]"**
4. Ask: **"Is this the right title? Any changes?"**
5. **Wait for user response.** Once confirmed, proceed to Step 2 immediately.

### Step 2: Ask About Optional Sections

Present the three optional sections and ask which to include:

**"Would you like to include any of these optional sections?"**
- **Implementation Notes** - Technical guidance for developers (architecture, DB changes, APIs, edge cases)
- **Design & Mockups** - Links to design files, wireframes, UI specs
- **Risks & Dependencies** - External dependencies, technical/timeline risks, approvals needed

**Guidance:** Accept simple responses like "Yes to all three", "Just Implementation Notes", "None", etc. Confirm the selection and move to Step 3.

### Step 3: Confirm Acceptance Criteria Format

Ask: **"How would you like to format acceptance criteria?"**

Present three clear options:
- **Checklist format** - Simple boolean items ("Feature X exists", "Error handling implemented")
- **BDD format (Given/When/Then)** - Behavioral test scenarios ("Given user is logged in, When they click X, Then Y happens")
- **Both** - Include checklist items AND BDD scenarios together

**If already stated in original task:** Acknowledge the stated preference and confirm: "Confirmed: [Format]. Moving forward with [Format] acceptance criteria."

**Proceed to Step 4 once format is confirmed.**

### Step 4: Draft Mandatory Section Content (Sequential)

For each mandatory section, **infer and draft content** based on the user's original feature description, then present it for review. Go one section at a time. Wait for acceptance or edits before moving on.

**Section 4a: Business Context & Goals**
- Draft content covering: the problem being solved, why it matters, and a success metric (infer from context if not stated)
- Present as: "Here's my draft for **Business Context & Goals**: [drafted content]. Does this work, or would you like to change anything?"
- If user accepts: "Got it. Moving to requirements."
- If user suggests edits: incorporate them, show the updated draft, confirm before moving on.

**Section 4b: Requirements & Specifications**
- Draft 4-6 specific requirements inferred from the feature description (library choices, file structure, integration patterns, etc.)
- Present as: "Here's my draft for **Requirements & Specifications**: [drafted content]. Anything to add or change?"
- If user accepts: "Got it. Now for acceptance criteria."
- If user suggests edits: incorporate and confirm.

**Section 4c: Acceptance Criteria** (Format from Step 3)
- Draft acceptance criteria inferred from the requirements:
  - **If Checklist:** 5-10 specific, verifiable items
  - **If BDD:** 3-5 Given/When/Then scenarios
  - **If Both:** 5-10 checklist items followed by 3-5 BDD scenarios
- Present as: "Here's my draft for **Acceptance Criteria**: [drafted content]. Does this cover everything, or would you like to adjust?"
- If user accepts: "Great coverage."
- If user suggests edits: incorporate and confirm.

**Proceed to Step 5 if optional sections were selected in Step 2. Otherwise, go to Step 6.**

### Step 5: Draft Optional Section Content (As Selected)

**Only draft sections the user selected in Step 2.** Handle one section at a time.

**If Implementation Notes selected:**
- Draft technical guidance: library/framework recommendations, file structure, integration patterns, edge cases, migration notes — inferred from the feature type
- Present as: "Here's my draft for **Implementation Notes**: [drafted content]. Anything to add or change?"

**If Design & Mockups selected:**
- Note that design links cannot be inferred; ask the user directly: "Do you have any Figma, Miro, or other design file links to include?"
- If user provides links: "Got it. Noted."
- If user has none yet: record as "TBD — design files to be linked when available."

**If Risks & Dependencies selected:**
- Draft 2-3 likely risks and 2-3 dependencies inferred from the feature (e.g. third-party library stability, existing codebase coupling, release timing)
- Present as: "Here's my draft for **Risks & Dependencies**: [drafted content]. Does this capture the main concerns?"

**After all selected optional sections are complete, proceed to Step 6.**

### Step 6: Display Complete PRD for Review

Compile and display the complete markdown PRD with all sections in this exact order:

```markdown
# [Title]

## Business Context & Goals
[Content provided by user]

## Requirements & Specifications
[Content provided by user]

## Acceptance Criteria
[Checklist items OR BDD scenarios OR both, clearly formatted]

[Optional sections below, only if selected:]

## Implementation Notes
[Content if selected]

## Design & Mockups
[Content if selected]

## Risks & Dependencies
[Content if selected]
```

**After displaying the full PRD, ask:** "Does this look correct? Any sections you'd like to revise?"

**If user says yes/no changes needed:** Proceed to Step 7.

**If user requests revisions:**
- Ask which section to edit
- Re-gather content for that section only
- Show the updated full PRD
- Repeat until user confirms

### Step 7: Provide PRD Output

Once the user confirms the PRD is ready:

1. Display the final markdown PRD one more time in a clean, readable format
2. Add a note: **"✓ PRD is ready in session for the next skill (Jira creation or documentation)."**
3. Keep the PRD in the conversation context—it's available for downstream skills to reference or process

**Do not offer to save to file or ask for additional changes.** The PRD is ready when the user confirms.

## Key Behaviors

1. **Consistent Template Order**: Always use this exact order:
   - Business Context & Goals → Requirements & Specifications → Acceptance Criteria
   - Then optional sections in order: Implementation Notes → Design & Mockups → Risks & Dependencies

2. **Infer First, Ask Second**: Never present an empty prompt asking the user to fill a section. Always draft the content yourself and ask "Does this work, or would you like to change anything?"

3. **Edits Are Incremental**: When the user requests changes to a drafted section, incorporate them and show the updated draft before moving on. Do not re-draft from scratch unless asked.

4. **Format Choice Matters**: Acceptance criteria format (checklist vs. BDD vs. both) shapes how criteria are written

5. **Optional = User Choice**: Only include optional sections if user explicitly requested them in Step 2

6. **No Auto-Posting**: This skill creates the PRD in session. Other skills handle Jira creation or file exports.

## Example Workflow

**User says:** "I need a PRD for the new user authentication with MFA"

**Skill responds:**
1. Infers title: "Multi-Factor Authentication (MFA)" → User confirms
2. Asks: "Include Implementation Notes, Design Links, Risks & Dependencies?" → User says: "Yes, Yes, Yes"
3. Asks: "Acceptance criteria format?" → User says: "Checklist"
4. Drafts Business Context → User accepts → Drafts Requirements → User tweaks one item → Drafts Acceptance Criteria → User accepts
5. Drafts Implementation Notes → User accepts → Asks for design links → User provides URL → Drafts Risks → User accepts
6. Shows complete PRD for review → User confirms
7. PRD ready in session for downstream skills

---

## Triggering This Skill

Use this skill when you hear:
- "I need to write a PRD for..."
- "Create a specification for this feature"
- "Document requirements for..."
- "Set up a story structure"
- "Help me define acceptance criteria for..."
- Even: "Create a Jira ticket for..." — skill provides structure before posting

Always trigger when a user needs clear, structured requirements documentation.
