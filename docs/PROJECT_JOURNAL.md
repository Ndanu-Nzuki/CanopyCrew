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

### [2026-11-04] — docs(docs): add system architecture and data schema deliverables (`docs/docs-architecture-schema`)
- **Author / Lane:** Alice Severi Gonçalves (Cloud Engineering)
- **Changes Delivered:**
  - Created `docs/ARCHITECTURE.md` detailing the Python `3.12.7` / FastAPI backend layout, deterministic Python (`recommender.py`) vs. NVIDIA NIM (`backend/app/agent/`) responsibility split, CORS rules, and `$0` Google Cloud Run (`--min-instances 0 --max-instances 2`) + Cloud Firestore (`<= 1 GiB`) deployment architecture.
  - Created `docs/DATA_SCHEMA.md` documenting all strict Pydantic v2 schemas (`ConfigDict(extra="forbid")`), the 3 São Paulo urban site archetypes (`sites.json`), the 10 verified native *Mata Atlântica* species (`species.json`), and REST endpoint payload/error contracts.
- **Cross-Lane Unblocks:**
  - **Frontend (`@Laurine`):** Provides exact request/response JSON contracts, HTTP status codes (`200`/`400`/`404`/`422`), and read-only NVIDIA NIM `care_narrative` boundaries.
  - **Product Brief (`@Barbara`):** Supplies verified municipal compliance tables (*Portaria SVMA nº 26/2024*, *BioSampa*, *PMAU*) and UN SDG 11.7 architecture references without altering `docs/PRODUCT_BRIEF.md`.
  - **Security (`@Idris`):** Documents `SecretStr` isolation for `NVIDIA_API_KEY`, Google Secret Manager runtime injection, and CORS restrictions for `docs/SECURITY.md`.
- **Verification:** Verified GFM tables, Mermaid (`flowchart LR` & `erDiagram`) syntax, schema field parity against `backend/app/schemas/plan.py` and `backend/tests/test_endpoints.py`, and pre-commit secret/budget guardrails.

