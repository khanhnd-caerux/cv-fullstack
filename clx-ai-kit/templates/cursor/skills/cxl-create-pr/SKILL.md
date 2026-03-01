---
name: cxl-create-pr
description: Create Pull Requests with proper titles, descriptions, and context. Use when the user asks to create a PR, open a PR, submit changes for review, or mentions pull request creation.
---

# Create Pull Request

Create well-structured Pull Requests using the `gh` CLI with proper context and formatting.

## When to Use

- User asks to "create a PR" or "open a pull request"
- User wants to submit changes for review
- User mentions "PR", "pull request", or "merge request"

## Prerequisites

- `gh` CLI installed and authenticated (`gh auth status`)
- Changes committed to a feature branch
- Remote repository configured

## Workflow

### Step 1: Gather Context

Before creating a PR, collect information:

```bash
# Check current branch and remote tracking
git status

# View all commits that will be in the PR (from base branch)
git log main..HEAD --oneline

# See full diff against base branch
git diff main...HEAD

# Check recent commit style for consistency
git log --oneline -10
```

### Step 2: Analyze Changes

Review the commits and changes to understand:
- What was changed (features, fixes, refactors)
- Why it was changed (purpose, motivation)
- How it affects the codebase (scope, impact)

### Step 3: Draft PR Content

**Title format**: Use conventional commit style

```
<type>(<scope>): <short description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

**Examples**:
- `feat(auth): add JWT token refresh endpoint`
- `fix(api): handle null response in user service`
- `docs(readme): update installation instructions`

**Description template**:

```markdown
## Summary
<1-3 bullet points describing the key changes>

## Changes
- <List specific changes made>

## Test Plan
- [ ] <How to verify the changes work>

## Related
- Closes #<issue-number> (if applicable)
```

### Step 4: Create the PR

```bash
# Push branch if not already pushed
git push -u origin HEAD

# Create PR with HEREDOC for proper formatting
gh pr create --title "the pr title" --body "$(cat <<'EOF'
## Summary
<bullet points>

## Changes
- Change 1
- Change 2

## Test Plan
- [ ] Test step 1
- [ ] Test step 2

EOF
)"
```

### Step 5: Verify and Share

After creation:
- Verify PR was created successfully
- Return the PR URL to the user
- Note any draft status or requested reviewers

## PR Quality Checklist

Before creating:
- [ ] Title is clear and follows conventional format
- [ ] Description explains WHY, not just WHAT
- [ ] All commits are meaningful (no "fix typo" chains)
- [ ] No sensitive data (secrets, credentials) in changes
- [ ] Tests included for new functionality
- [ ] Base branch is correct (usually `main`)

## Common Options

```bash
# Create as draft
gh pr create --draft --title "..." --body "..."

# Assign reviewers
gh pr create --reviewer user1,user2 --title "..." --body "..."

# Add labels
gh pr create --label "enhancement" --title "..." --body "..."

# Specify base branch
gh pr create --base develop --title "..." --body "..."
```

## Handling Edge Cases

**No commits yet**: Remind user to commit changes first
**Not on feature branch**: Suggest creating a branch from current changes
**Auth issues**: Run `gh auth login` to authenticate
**Multiple remotes**: Specify remote with `-R owner/repo`

## Anti-Patterns

- ❌ Creating PRs with vague titles like "updates" or "changes"
- ❌ Empty or template-only descriptions
- ❌ PRs with hundreds of files (break into smaller PRs)
- ❌ Committing directly to main/master
- ❌ Including unrelated changes in a single PR
