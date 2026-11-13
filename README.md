# CanopyCrew
GCLP x MMC Capstone Project

## About CanopyCrew
**Making urban greening more accessible, informed, and community-driven.**

CanopyCrew is an AI-assisted urban greening planning solution designed to help communities identify suitable native plants for urban spaces, understand planting requirements, and plan for their long-term care.

Starting with São Paulo, Brazil, CanopyCrew brings together ecological guidance, site-specific planting recommendations, indicative cost estimates, and volunteer care guidance to make urban greening decisions simpler and more practical.

The project supports United Nations Sustainable Development Goal 11, Target 11.7, which focuses on access to safe, inclusive, accessible, green and public spaces.

## The Problem
Urban communities often have spaces that could benefit from more greenery, but turning these opportunities into practical planting projects is not always straightforward.

Choosing suitable native species requires understanding local site conditions, ecological requirements, planting costs, and ongoing maintenance needs. Without accessible guidance, community groups and volunteers may struggle to move from an idea to an achievable greening plan.

CanopyCrew aims to bridge this gap by making relevant planting information easier to understand and use.


## How CanopyCrew Works
CanopyCrew guides users through four stages of planning and maintaining an urban greening project:
1. **Discover:** Choose from three representative urban site types in São Paulo: a compact sidewalk strip, a sunny degraded lot, or a shaded courtyard.
2. **Select:** Explore suitable native Atlantic Forest plant species recommended according to the selected site's conditions and planting constraints.
3. **Plan:** Review indicative planting costs, expected canopy benefits, and practical considerations to help develop a realistic greening plan.
4. **Care:** Access AI-assisted explanations and ongoing volunteer care guidance to support plant maintenance beyond the initial planting.

   
The MVP uses predefined site scenarios and a curated catalogue of ten plant species to demonstrate this journey.


## MVP Scope
The CanopyCrew MVP focuses on a practical, guided urban greening experience using a limited set of representative scenarios.

Key components include:
- **Three São Paulo site archetypes:** A compact sidewalk strip, a sunny degraded lot, and a shaded courtyard.
- **Ten native plant species:** A curated catalogue of Atlantic Forest plants for site-specific recommendations.
- **Rules-based plant suitability:** Recommendations based on predefined site conditions and ecological constraints.
- **Indicative planning estimates:** Approximate planting costs and canopy benefits to support initial planning.
- **AI-assisted explanations:** Clear, accessible explanations to help users understand planting recommendations.
- **Volunteer care guidance:** Practical information to support ongoing plant maintenance.

  
The MVP is intended to demonstrate CanopyCrew's core value before expanding to additional locations, species, or capabilities.


## Technology Overview

CanopyCrew's proposed technology stack combines web development, cloud services, and AI-assisted guidance.
- **Frontend:** React for the user-facing web application, hosted using Firebase Hosting.
- **Backend:** Python and FastAPI for application logic and rules-based plant recommendations.
- **Cloud Infrastructure:** Google Cloud Run for backend deployment.
- **Database:** Google Cloud Firestore for storing relevant application data.
- **AI Integration:** NVIDIA NIM for generating accessible explanations and volunteer care guidance.
  
The recommendation logic is designed to use predefined ecological rules, while AI supports the explanation of results rather than independently determining plant suitability.

Technical implementation and deployment details will be confirmed by the engineering team.


## Project Team

CanopyCrew is being developed collaboratively as part of the Google Cloud Launchpad × Mentor Me Collective Capstone Project.
- **Laurine Ndanu Nzuki — AI Research & Frontend:** Leads the user-facing application experience and AI-related development.
- **Alice Severi Gonçalves — Cloud Engineering & Backend:** Leads backend development, ecological data integration, and recommendation logic.
- **Barbara Roberto Mulu — Product Narrative Lead & AI Cloud Leader:** Leads the product narrative, Product Brief, user journey, stakeholder feedback, and presentation storytelling.
- **Idris — Cloud Cybersecurity:** Supports application security, access controls, and secure cloud development.


  ## Further Documentation
  
For a more detailed explanation of CanopyCrew's objectives, target users, MVP scope, ecological considerations, and success criteria, see the [CanopyCrew Product Brief](docs/PRODUCT_BRIEF.md).
