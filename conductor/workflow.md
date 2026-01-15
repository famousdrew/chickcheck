# Development Workflow

## Overview
This document defines the development workflow for the ChickCheck project. All contributors should follow these guidelines to maintain code quality and project consistency.

---

## Test-Driven Development (TDD)

### Required Test Coverage
- **Minimum coverage threshold:** 80%
- Coverage is measured across statements, branches, functions, and lines
- New features must include tests before implementation

### TDD Workflow
1. **Write tests first** - Define expected behavior through test cases
2. **Run tests (expect failure)** - Confirm tests fail before implementation
3. **Implement feature** - Write minimal code to pass tests
4. **Refactor** - Clean up code while keeping tests green

### Test Organization
```
src/
├── components/
│   └── ChickCard/
│       ├── ChickCard.tsx
│       └── ChickCard.test.tsx    # Co-located tests
├── lib/
│   └── __tests__/                # Utility tests
└── app/
    └── api/
        └── __tests__/            # API route tests
```

---

## Version Control

### Commit Frequency
- **Commit after every task** - Each completed task should result in a commit
- Small, focused commits are preferred over large, multi-purpose commits
- Each commit should leave the codebase in a working state

### Commit Message Format
```
<type>(<scope>): <short description>

<optional body>

<optional footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(chicks): add photo upload to chick profile

fix(tasks): correct temperature calculation for week 2

test(auth): add unit tests for login flow
```

### Git Notes for Task Summaries
- Use Git Notes to attach task summaries to commits
- Notes should include: task ID, description, and any relevant context
- Format: `conductor: <task_id> - <brief summary>`

---

## Phase Completion Verification and Checkpointing Protocol

### Purpose
At the end of each phase, perform manual verification to ensure all tasks are complete and the codebase is stable before proceeding.

### Verification Steps
1. **Review completed tasks** - Confirm all phase tasks are marked complete
2. **Run full test suite** - Ensure all tests pass
3. **Check test coverage** - Verify coverage meets 80% threshold
4. **Manual smoke test** - Verify key functionality works as expected
5. **Code review** - Review changes for quality and consistency

### Checkpoint Actions
1. **Create phase completion commit** - Summarize phase accomplishments
2. **Tag the commit** - Use format `phase-<number>-complete`
3. **Update track status** - Mark phase as complete in plan.md
4. **Document any issues** - Note any technical debt or follow-up items

---

## Code Quality

### Before Each Commit
1. Run linter: `npm run lint`
2. Run type check: `npm run type-check`
3. Run tests: `npm test`
4. Format code: `npm run format`

### Pre-commit Hooks
The project uses Husky for pre-commit hooks:
- ESLint check
- Prettier formatting
- TypeScript type checking
- Test execution for changed files

---

## Branch Strategy

### Branch Naming
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/<track-id>-<description>` - Feature branches
- `fix/<issue-id>-<description>` - Bug fix branches

### Workflow
1. Create feature branch from `develop`
2. Implement changes following TDD
3. Submit pull request to `develop`
4. Merge to `main` for releases

---

## Documentation

### Code Documentation
- Add JSDoc comments for public APIs and complex functions
- Keep README files up to date with setup instructions
- Document environment variables and configuration options

### Track Documentation
- Maintain spec.md for feature requirements
- Update plan.md as tasks progress
- Record decisions and rationale in track notes
