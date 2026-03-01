# Create PR

## Overview

Create a well-structured pull request with proper title, description, and context.

## Steps

1. **Gather context** (run these in parallel):
   - `git status` - check untracked files and current state
   - `git diff` - see staged and unstaged changes
   - `git log main..HEAD --oneline` - view commits for this PR
   - `git diff main...HEAD` - full diff against base branch
   - `git log --oneline -5` - check recent commit style

2. **Analyze all commits**
   - Review ALL commits that will be in the PR (not just the latest)
   - Understand what changed and why
   - Note any breaking changes

3. **Prepare branch**
   - Push branch to remote: `git push -u origin HEAD`

4. **Create PR using gh CLI**
   - Use `gh pr create` with title and body
   - Title format: `type(scope): description`
   - Body should include Summary and Test plan sections
   - Use HEREDOC for proper formatting of multiline body

5. **Return PR URL** to the user

## Title Format

Use conventional commits: `type(scope): short description`

| Type | Use for |
|------|---------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| refactor | Code restructuring |
| test | Adding tests |
| chore | Maintenance |
| ci | CI/CD changes |
| style | Formatting only |

## PR Body Template

```markdown
## Summary
<1-3 bullet points describing key changes>

## Changes
- <List specific changes made>

## Test Plan
- [ ] Test step 1
- [ ] Test step 2

## Related
- Closes #<issue-number> (if applicable)
```

## Common Options

```bash
# Create as draft
gh pr create --draft --title "..." --body "..."

# Assign reviewers
gh pr create --reviewer user1,user2 --title "..." --body "..."

# Add labels
gh pr create --label "enhancement" --title "..." --body "..."

# Specify base branch (if not main)
gh pr create --base develop --title "..." --body "..."

# Multiple remotes - specify repo
gh pr create -R owner/repo --title "..." --body "..."
```

## Edge Cases

- **No commits yet**: Commit changes first before creating PR
- **Not on feature branch**: Create a branch from current changes
- **Auth issues**: Run `gh auth login` to authenticate
- **Branch not pushed**: Will auto-push with `git push -u origin HEAD`

## Anti-Patterns (Avoid)

- Vague titles like "updates" or "changes"
- Empty or template-only descriptions
- PRs with hundreds of files (break into smaller PRs)
- Including unrelated changes in a single PR
- Committing secrets or sensitive data

## PR Checklist

- [ ] Title follows conventional format
- [ ] Description explains WHY not just WHAT
- [ ] All commits are meaningful
- [ ] No sensitive data in changes
- [ ] Tests included for new functionality
- [ ] Base branch is correct (usually main)
