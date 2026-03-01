---
name: cxl-gitignore
description: Create or update .gitignore files using GitHub's gitignore templates. Use when adding a .gitignore, ignoring files for a language/framework, or when the user mentions gitignore, ignoring files, or references https://github.com/github/gitignore.
---

# Gitignore Skill

Create or update `.gitignore` files using templates from [github/gitignore](https://github.com/github/gitignore).

## When to Use

- User asks for a `.gitignore` or to ignore certain files
- User mentions a language, framework, or tool and needs ignore rules
- User references https://github.com/github/gitignore or "GitHub gitignore templates"

## Reference

**Repository**: https://github.com/github/gitignore

**Template locations** (raw URLs use `https://raw.githubusercontent.com/github/gitignore/main/`):

| Location | Use for |
|----------|--------|
| **Root** | Common languages and tech (e.g. `Node.gitignore`, `Python.gitignore`, `Go.gitignore`) |
| **Global/** | Editors, OS, tools (e.g. `Global/macOS.gitignore`, `Global/VisualStudioCode.gitignore`) |
| **community/** | Specialized frameworks (e.g. `community/Python/JupyterNotebooks.gitignore`) |

**Root examples**: `Node.gitignore`, `Python.gitignore`, `Go.gitignore`, `Dotnet.gitignore`, `Java.gitignore`, `Ruby.gitignore`, `Rust.gitignore`, `Swift.gitignore`, `C.gitignore`, `C++.gitignore`, `Dart.gitignore`, `Elixir.gitignore`, `Kotlin.gitignore`, `Nextjs.gitignore`, `Nestjs.gitignore`, `Angular.gitignore`, `Flutter.gitignore`, `React.gitignore`, `Laravel.gitignore`, `Django.gitignore`, etc.

## Workflow

1. **Identify stack**: Determine language(s), framework(s), OS, and editor from the project or user.
2. **Choose templates**: Pick one or more templates from the repo (root for main language, Global for OS/editor, community for specialized).
3. **Fetch or apply**: Either fetch raw content from GitHub or use known patterns. Merge multiple templates if needed (e.g. Node + macOS + VS Code).
4. **Merge and deduplicate**: Combine entries, remove duplicates, keep project-specific rules the user wants.
5. **Write `.gitignore`**: Place at repo root. Add a short header comment if useful (e.g. which templates were used).

## Fetching a Template

Raw URL pattern:
```
https://raw.githubusercontent.com/github/gitignore/main/<TemplateName>.gitignore
```
Examples:
- Node: `https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore`
- Python: `https://raw.githubusercontent.com/github/gitignore/main/Python.gitignore`
- Global macOS: `https://raw.githubusercontent.com/github/gitignore/main/Global/macOS.gitignore`

Use the **mcp_web_fetch** tool (or equivalent) to retrieve content when needed.

## Good Template Practices

- One primary language/framework template at root, plus Global/community as relevant.
- Prefer official templates from the repo over ad-hoc rules when they exist.
- Add project-specific paths or patterns after the template block, with a comment.

## Additional Resources

- [gitignore(5) manual](https://git-scm.com/docs/gitignore)
- [Ignoring files (GitHub Help)](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files)
