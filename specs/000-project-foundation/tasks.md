# Tasks: Specification-Driven Project Foundation

**Input**: [spec.md](spec.md), [research.md](research.md), [plan.md](plan.md), and
[roadmap.md](roadmap.md)

## Phase 1: Pin and initialize Spec Kit

- [x] T001 Confirm the current official Spec Kit release.
- [x] T002 Run an isolated initialization spike with the Codex integration.
- [x] T003 Initialize Spec Kit 0.14.1 core in the repository.
- [x] T004 Verify `.specify/init-options.json` records the pinned version and Codex integration.

## Phase 2: Establish project governance

- [x] T005 Replace the constitution template with ConectaPelu2 principles and quality gates.
- [x] T006 Define Spec Kit artifacts as the only planned and active-work source of truth.
- [x] T007 Exclude community presets, external boards, and parallel progress files.

## Phase 3: Migrate the analysis and roadmap

- [x] T008 Capture the objective, constraints, and success criteria in `spec.md`.
- [x] T009 Move current architecture and evidence-backed findings into `research.md`.
- [x] T010 Preserve target architecture and the reference CRUD contract in `plan.md`.
- [x] T011 Create the dependency-aware spec-of-specs portfolio in `roadmap.md`.
- [x] T012 Record completed work through truthful PR references without retroactive specs.
- [x] T013 Remove `docs/personal-notes/project-analysis.md` after migration review.

## Phase 4: Prove the workflow

- [x] T014 Create SEC-01 as `specs/001-admin-authorization/spec.md`.
- [x] T015 Add SEC-01 evidence and technical decisions in `research.md` and `plan.md`.
- [x] T016 Decompose SEC-01 into implementation-ready tasks.
- [x] T017 Add a manual validation quickstart for every supported role/status branch.

## Phase 5: Integrate and validate

- [x] T018 Update `AGENTS.md` and repository navigation to point to Spec Kit.
- [x] T019 Verify generated shell scripts and prerequisite resolution.
- [x] T020 Scan committed artifacts for unresolved template placeholders and broken local links.
- [x] T021 Run documentation-relevant repository checks and inspect the final diff.

## Dependencies and execution order

- Phase 2 depends on successful Spec Kit initialization.
- Phase 3 depends on the constitution so roadmap decisions use established governance.
- Phase 4 depends on the current roadmap identifying SEC-01 as dependency-ready.
- Phase 5 depends on all artifacts existing at their final paths.

## Completion signal

The monolithic analysis is removed, the foundation and SEC-01 specs are navigable, Spec Kit
resolves their prerequisites, and no parallel task-state system remains.
