# CanopyCrew


Google Cloud Launchpad × Mentor Me Collective Capstone Project

## Demo and submission materials
- [Try the live MVP](https://canopycrew-sp-mvp.web.app/)
- **Presentation deck:** Open `CanopyCrew_Presentation.pptx` in the [Product Brief and Deck folder](https://drive.google.com/drive/folders/1aBnbM3tLjXYjOd_5hko-z-eBdd98buj5).
- **Recorded walkthrough:** Link pending — recording in progress.

  
## About CanopyCrew
CanopyCrew helps neighborhood groups and volunteer coordinators in São Paulo choose suitable native plants, estimate seedling costs and future canopy, and plan for ongoing care.
Community planting projects require decisions about sunlight, available space, overhead wires, costs, and maintenance. CanopyCrew brings these decisions together in one guided workflow so volunteers can move from an idea to an initial planting plan.
The project supports **UN Sustainable Development Goal 11, Target 11.7**, which focuses on access to safe, inclusive, accessible green and public spaces.


## How CanopyCrew works
1. **Discover.** Choose the sample site that most closely resembles your space: a compact sidewalk strip with overhead wires, a sunny degraded lot, or a shaded courtyard.
2. **Select.** Review recommended native Atlantic Forest species and see why they suit the selected site.
3. **Plan.** Select plants and review the estimated seedling cost and projected Year 3 canopy.
4. **Care.** Review the initial, quarterly, and annual care tasks. Request an optional AI guide for your selected plants.
The MVP covers three predefined São Paulo site types and ten native Atlantic Forest species. The [site catalogue](backend/data/sites.json) and [species catalogue](backend/data/species.json) are included in the repository. The project draws on São Paulo’s Portaria SVMA nº 26/2024, BioSampa (5ª Edição), and Municipal Urban Arborisation Plan (PMAU).
Seedling prices are indicative, and Year 3 canopy figures are projections. Planting at an actual site requires local checks and any applicable approvals.


## Technology overview
| Component | Live MVP |
| --- | --- |
| Frontend | React, Vite, JavaScript, and Tailwind CSS on Firebase Hosting. Firebase Authentication handles account sign-in and sign-up. |
| Backend | Python 3.12, FastAPI, and Pydantic v2 run in a non-root container on Google Cloud Run. The service scales to zero and is capped at two instances to help control costs. |
| Data and workspace | The backend validates versioned JSON catalogues at startup. Workspace selections and care checkoffs are saved in the current browser using `localStorage`. |
| AI care guide | NVIDIA NIM generates plain-language guidance from a plan validated by the backend. Google Secret Manager supplies the API credential at runtime. |
When a volunteer requests an AI care guide, the frontend sends the site and selected species to the Cloud Run API. Python checks plant suitability, calculates the estimated seedling cost and projected canopy, and assembles the care schedule. For sites with overhead wires, the MVP checks the species’ wire suitability flag and applies a mature height limit of five metres.
NVIDIA NIM receives the validated plan and writes the volunteer guide. A daily request cap controls usage. If NIM is unavailable, unconfigured, or capped, the backend returns a guide based on the structured care schedule.
**Planned:** Firestore would support plans saved across devices and shared neighborhood care checklists.
## Run and verify
### GitHub Codespaces
In the repository, choose **Code → Codespaces → Create codespace**. The dev container installs dependencies and forwards backend port `8000` and frontend port `5173`. Use the commands below to start the services.
### Local setup
Use Python 3.12.7 and Node.js 24. From the repository root, start the backend in one terminal:
```bash
cd backend
python -m pip install -r requirements.txt
python -m pytest -v
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
In a second terminal, verify that the API responds:
```bash
curl -fsS http://localhost:8000/api/v1/health
```
Set `VITE_API_BASE_URL` in `frontend/.env.local` to `http://localhost:8000/api/v1`. In Codespaces, use the forwarded backend URL followed by `/api/v1`.
For sign-in and sign-up, supply the six Firebase web configuration values listed in the [Firebase configuration module](frontend/src/firebase/config.js) from a development Firebase project. Keep local environment files out of Git.
From the repository root, start the frontend:
```bash
cd frontend
npm ci
npm run dev -- --host 0.0.0.0 --port 5173
```
Open `http://localhost:5173` locally or open the forwarded frontend port in Codespaces.
### Try the reviewer journey
Open the [live MVP](https://canopycrew-sp-mvp.web.app/), choose the wired sidewalk, and inspect why Pitanga is recommended. Select plants, review the estimated seedling cost and projected Year 3 canopy, and open the volunteer care guidance.
## Testing and next steps
A walkthrough on 22 November 2026 covered all three sample sites. Recommendations varied with site conditions, and the totals in the plans checked matched the displayed plant values. All three AI care guides tested ended early, and changing a selection sometimes left an older estimate visible. The engineering team subsequently confirmed that the live Cloud Run service received a response from NVIDIA NIM.
The next priorities are to verify that generated guides cover every care period and that estimates refresh when plant selections change. A proposed community pilot would record who can reach and use the space before planting, check pedestrian accessibility after planting, and count surviving seedlings at six and twelve months.
## Project team
- **Laurine Ndanu Nzuki — AI Research & Frontend.** Led frontend development, user experience, and AI research.
- **Alice Severi Gonçalves — Cloud Engineering & Backend.** Led backend development, ecological data integration, recommendation logic, and Cloud Run deployment.
- **Barbara Roberto Mulu — Product Narrative Lead & AI Cloud Leader.** Led the product narrative, product brief, volunteer journey, SDG alignment, and presentation storytelling.
- **Idris Belgore Abiodun — Cloud Cybersecurity.** Supported security review, access controls, and secure cloud development.
## Further documentation
- [Product brief](docs/PRODUCT_BRIEF.md)
- [Architecture and API verification](docs/ARCHITECTURE.md)
- [Data schema](docs/DATA_SCHEMA.md)
- [Security](docs/SECURITY.md)
- [Project journal and build milestones](docs/PROJECT_JOURNAL.md)
