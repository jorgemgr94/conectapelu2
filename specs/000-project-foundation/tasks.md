# Tasks: Specification-Driven Project Foundation

**Input**: [spec.md](spec.md), [research.md](research.md), and [plan.md](plan.md)

## Phase 1: Pin and initialize Spec Kit

- [x] T001 Confirm the official Spec Kit release.
- [x] T002 Initialize Spec Kit core with the Codex integration.
- [x] T003 Verify `.specify/init-options.json` records the pinned version and integration.

## Phase 2: Establish project governance

- [x] T004 Replace the constitution template with ConectaPelu2 principles and quality gates.
- [x] T005 Define Spec Kit feature artifacts as the only planned and active-work source of truth.
- [x] T006 Exclude community presets, external boards, and parallel progress files.

## Phase 3: Migrate the analysis

- [x] T007 Capture the objective, constraints, and success criteria in `spec.md`.
- [x] T008 Move current architecture and evidence-backed findings into `research.md`.
- [x] T009 Preserve target architecture and the reference CRUD contract in `plan.md`.
- [x] T010 Remove `docs/personal-notes/project-analysis.md` after migration review.

## Phase 4: Prove the workflow

- [x] T011 Create `specs/001-admin-authorization/spec.md` with the core specify workflow.
- [x] T012 Add feature research, plan, and validation guidance.
- [x] T013 Generate implementation-ready `tasks.md` for the feature.

## Phase 5: Integrate and validate

- [x] T014 Update repository navigation and agent guidance to point to Spec Kit.
- [x] T015 Verify generated shell scripts and prerequisite resolution.
- [x] T016 Scan committed artifacts for unresolved placeholders and broken local links.
- [x] T017 Run documentation-relevant repository checks and inspect the final diff.

## Completion signal

The monolithic analysis is removed, the repository uses the pinned Spec Kit core workflow, and the
first feature has the canonical `spec.md`, `plan.md`, and `tasks.md` artifacts.
