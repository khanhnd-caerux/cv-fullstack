---
description: How to make a new release for the CLX AI Kit
---

# Make a New Release

This workflow automates releasing a new version of `@caeruxlab/aidk` by inspecting git history, updating docs, bumping the version, and pushing to trigger the GitLab CI publish pipeline.

1. Run `git log $(git describe --tags --abbrev=0)..HEAD --oneline` to list commits since the last release and infer the version bump type:
   - `feat:` commits → `minor`
   - `fix:`, `chore:`, `docs:`, `refactor:` → `patch`
   - `BREAKING CHANGE` → `major`
// turbo
2. Run `npm run build` to ensure the project builds successfully.
3. If step 2 fails, stop immediately and fix the build errors before continuing.
4. Run `npm version <BUMP_TYPE> --no-git-tag-version` to bump the version in `package.json`.
5. Update `CHANGELOG.md` — add a new section for the new version with all changes since the last release under `### Added`, `### Changed`, `### Fixed`, etc.
6. Run `git add .` to stage all modified files.
7. Ask the USER to confirm the commit message, tag, and push before proceeding.
8. Propose the final command: `git commit -m "chore(release): v<NEW_VERSION>" && git tag v<NEW_VERSION> && git push && git push --tags`.
9. Inform the USER that the GitLab CI pipeline will now build and publish the new package.