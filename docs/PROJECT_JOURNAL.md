# CanopyCrew Project Journal

Shared chronological log of pull requests, architectural decisions, cross-lane unblocks, and weekly `#mmc-build` status milestones across all four tracks (**Alice**, **Laurine**, **Barbara**, and **Idris**).

> **Agent Tip:** When adding a new milestone or preparing a Tuesday/Friday `#mmc-build` update, follow [`.agents/skills/project-journal/SKILL.md`](../.agents/skills/project-journal/SKILL.md).

## Entry Template

```markdown
### [YYYY-MM-DD] — <PR Title or Milestone Name> (`<branch-name>`)
- **Author / Lane:** <Name & Track>
- **Changes Delivered:** 2–3 concise bullets of technical or documentation deliverables.
- **Cross-Lane Unblocks:** How this helps Frontend (Laurine), Product Brief (Barbara), Backend (Alice), or Security (Idris).
- **Verification:** Commands or tests passed (e.g., `pytest -v`).
```

---

## Chronological Log

### [2026-11-03] — PR #1: chore(infra): add devcontainer, pr template, and agent guardrails (`chore/infra-devcontainer-and-pr-standards`)
- **Author / Lane:** Alice Severi Gonçalves (Cloud Engineering)
- **Changes Delivered:**
  - Configured universal GitHub Codespaces environment (`.devcontainer/devcontainer.json` with Python 3.12 + Node 22 and forwarded ports `8000` / `5173`), cross-OS LF normalization (`.gitattributes`), and `.github/pull_request_template.md`.
  - Added foundational project guardrails (`.agents/rules/canopycrew.md`, `.agents/rules/git-pr-standards.md`) and the procedural `git-commit-pr` workflow skill.
- **Cross-Lane Unblocks:** Standardized zero-install browser reproducibility in GitHub Codespaces and 4-lane PR review handoffs across `@Alice`, `@Laurine`, `@Barbara`, and `@Idris`.
- **Verification:** Verified `.devcontainer/devcontainer.json` specification, `.gitattributes` LF rules, and PR template compliance checklist.

### [2026-11-03] — PR #2: feat(backend): add core config, cors, health routes, and pinned deps (`feature/backend-core-foundation`)
- **Author / Lane:** Alice Severi Gonçalves (Cloud Engineering)
- **Changes Delivered:**
  - Pinned lightweight Python `3.12.7` dependencies in `backend/requirements.txt` (`fastapi==0.162.0`, `pydantic==2.14.2`, `pydantic-settings==2.16.2`, `pytest==8.3.5`) and removed unused SQLAlchemy `models/` and `repositories/` folders to enforce the `$0` non-SQL MVP scope.
  - Added secret-safe `Settings` (`SecretStr` for `NVIDIA_API_KEY`, `PORT`/`API_PORT` alias support) in `backend/app/core/config.py`, Vite + `*.run.app` CORS middleware in `backend/app/main.py`, and modular `/`, `/health`, and `/api/v1/health` routes.
- **Cross-Lane Unblocks:** Unblocked `@Laurine` (`http://localhost:5173` CORS + `/api/v1/health` liveness probe) and `@Idris` (`SecretStr` credential isolation for Google Secret Manager runtime injection).
- **Verification:** `pytest -v` (`backend/tests/test_health.py` passing across `/`, `/health`, `/api/v1/health`, and CORS preflight checks).

### [2026-11-03] — PR #3: chore(rules): add cross-agent AGENTS.md, skills, and project journal (`chore/rules-cross-agent-skills`)
- **Author / Lane:** Alice Severi Gonçalves (Cloud Engineering)
- **Changes Delivered:**
  - Added universal cross-agent entrypoint `AGENTS.md`, `.github/copilot-instructions.md`, and `.agents/rules/docs-and-deliverables.md` enforcing lane ownership and alignment with the 5 GCLP x MMC capstone rubric pillars.
  - Created `doc-helper` and `project-journal` workflow skills under `.agents/skills/` and initialized `docs/PROJECT_JOURNAL.md`.
- **Cross-Lane Unblocks:** Enabled shared guardrails across Antigravity, GitHub Copilot, Cursor, and Codex, protecting `@Barbara`'s `docs/PRODUCT_BRIEF.md` narrative sections and standardizing `#mmc-build` milestone reporting.
- **Verification:** Validated `SKILL.md` YAML frontmatter parsing and cross-agent rule path references.

### [2026-11-03] — PR #4: feat(backend): add data seeds, plan schemas, and recommendation routes (`feature/backend-data-and-endpoints`)
- **Author / Lane:** Alice Severi Gonçalves (Cloud Engineering)
- **Changes Delivered:**
  - Seeded the 3 verified São Paulo urban site archetypes (`backend/data/sites.json`) and 10 native *Mata Atlântica* species (`backend/data/species.json`) anchored in *Portaria SVMA nº 26/2024*, *BioSampa (5ª Edição)*, and *PMAU*.
  - Implemented strict Pydantic v2 models (`backend/app/schemas/plan.py`), deterministic wire-safety filtering and seedling cost / Year-3 canopy math (`backend/app/services/recommender.py`), and `/api/v1/sites`, `/api/v1/recommendations`, and `/api/v1/volunteer-plan` routes.
- **Cross-Lane Unblocks:** Unblocked `@Laurine` with live deterministic REST endpoints for UI integration and validated plan payloads for NVIDIA NIM care narratives, and `@Barbara` with verified species cost and canopy projections.
- **Verification:** `pytest -v` (`backend/tests/test_endpoints.py` verifying all 3 sites, 10 native species, exotic/invasive genus ban, `<= 5.0 m` wire-safety enforcement on `site-a-sidewalk-strip`, and `POST /api/v1/volunteer-plan` math).

### [2026-11-04] — PR #5: docs(docs): add system architecture and data schema deliverables (`docs/docs-architecture-schema`)
- **Author / Lane:** Alice Severi Gonçalves (Cloud Engineering)
- **Changes Delivered:**
  - Created `docs/ARCHITECTURE.md` detailing the Python `3.12.7` / FastAPI backend layout, deterministic Python (`recommender.py`) vs. NVIDIA NIM (`backend/app/agent/`) responsibility split, CORS rules, and `$0` Google Cloud Run (`--min-instances 0 --max-instances 2`) + Cloud Firestore (`<= 1 GiB`) deployment architecture.
  - Created `docs/DATA_SCHEMA.md` documenting all strict Pydantic v2 schemas (`ConfigDict(extra="forbid")`), the 3 São Paulo urban site archetypes (`sites.json`), the 10 verified native *Mata Atlântica* species (`species.json`), and REST endpoint payload/error contracts.
- **Cross-Lane Unblocks:**
  - **Frontend (`@Laurine`):** Provides exact request/response JSON contracts, HTTP status codes (`200`/`400`/`404`/`422`), and read-only NVIDIA NIM `care_narrative` boundaries.
  - **Product Brief (`@Barbara`):** Supplies verified municipal compliance tables (*Portaria SVMA nº 26/2024*, *BioSampa*, *PMAU*) and UN SDG 11.7 architecture references without altering `docs/PRODUCT_BRIEF.md`.
  - **Security (`@Idris`):** Documents `SecretStr` isolation for `NVIDIA_API_KEY`, Google Secret Manager runtime injection, and CORS restrictions for `docs/SECURITY.md`.
- **Verification:** Verified GFM tables, Mermaid (`flowchart LR` & `erDiagram`) syntax, schema field parity against `backend/app/schemas/plan.py` and `backend/tests/test_endpoints.py`, and pre-commit secret/budget guardrails.

