Git Branching Strategy: GitFlow

1. Main Branches:

- main (or master):
  - This is your production-ready code. Only fully tested and stable code is merged into main.
  - Protect this branch with permissions, requiring pull requests (PRs) and code reviews before merging.
- develop:
  - The branch for ongoing development, where features are integrated and tested.
  - Developers should branch off of develop to work on features or fixes.
  - Once stable and ready for release, develop is merged into main.

2. Supporting Branches:

- feature/\*:
  - Each new feature or enhancement gets its own feature branch.
  - Naming convention: feature/<feature-name>, e.g., feature/logger-interface or feature/api-logging.
  - These branches are based on develop and should be merged back into develop after completion.
- bugfix/\*:
  - For fixing non-critical bugs that aren't urgent.
  - Naming convention: bugfix/<bug-description>, e.g., bugfix/api-response-time.
  - Based on develop, and merged back into develop once the bug is fixed.
- release/\*:
  - Used to prepare a new production release.
  - Naming convention: release/<version-number>, e.g., release/1.0.0.
  - Based on develop, it allows final testing before the official release.
  - After final approval, the release branch is merged into both main and develop.
- hotfix/\*:
  - For urgent fixes in production. Critical bugs or patches are handled here.
  - Naming convention: hotfix/<fix-description>, e.g., hotfix/security-patch.
  - These branches are based on main and should be merged into both main and develop after the fix.

3. Branching Workflow:

- Start development:
  1. Start a feature: git checkout -b feature/your-feature develop
  2. Commit changes to the feature branch regularly.
  3. Open a pull request (PR) for code review when done.
  4. Merge feature branch into develop after review and testing.
- Release:
  1. When the code is stable, create a release branch: git checkout -b release/1.0.0 develop
  2. Perform final testing on this branch.
  3. Merge release/1.0.0 into main and tag the version: git tag -a v1.0.0 -m "Release v1.0.0"
  4. Merge it back into develop as well to sync changes.
- Fixing production issues (hotfix):
  1. If a bug is found in main, create a hotfix branch: git checkout -b hotfix/critical-fix main
  2. Once the fix is ready, merge hotfix into both main and develop.

```
Visualization:
main  --------------------------------------X--- (Production releases)
                 \                 /        |
develop -----------o---o---o-------X--------X-- (Integrated features)
                     \   \   \
feature/xyz  ---------o---o   \   \
feature/abc  -----o---o------- \   \
                               \   \
release/1.0.0  -------------------X   (Final testing)
```

Additional Tips:

- Naming conventions: Use clear and descriptive names for branches.
- Tagging: Tag your releases on the main branch for versioning (e.g., v1.0.0).
- Pull requests (PRs): Require code reviews and tests before merging feature/bugfix branches into develop or release branches.
- Continuous Integration (CI): Implement automated tests and build pipelines to run on develop and main branches to catch issues early.
