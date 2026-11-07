"""Care narrative synthesis service with graceful deterministic degradation.

Owned by Laurine (AI Research / Lead).
Synthesizes accessible, bilingual-friendly natural-language volunteer care narratives
from already-validated site archetypes and deterministic volunteer plans.
Degrades gracefully to deterministic narrative when NVIDIA_API_KEY is not configured
or external NIM endpoints are unreachable.
"""

import logging
from typing import List, Optional

from app.agent.nim_client import NIMClient, NIMClientError
from app.agent.prompts import NIM_SYSTEM_PROMPT, build_user_prompt
from app.schemas.plan import NativeSpecies, SiteArchetype, VolunteerPlanResponse
from app.services.recommender import load_species

logger = logging.getLogger("canopycrew.agent.narrative")


def build_fallback_narrative(
    site: SiteArchetype,
    plan: VolunteerPlanResponse,
    species_list: List[NativeSpecies],
) -> str:
    """Deterministically compose a community volunteer planting guide.

    Used when NVIDIA NIM is offline, unconfigured, or in test environments.
    """
    wire_warning = ""
    if site.constraints.overhead_power_lines:
        wire_warning = (
            "\n> [!IMPORTANT]\n"
            "> **Segurança com a Rede Elétrica Aérea (Portaria SVMA nº 26/2024 & PMAU):**\n"
            f"> Este local possui fiação elétrica aérea. Todas as {plan.selected_species_count} espécies "
            f"selecionadas têm porte compacto (máximo {site.constraints.max_mature_height_meters} m) "
            "e raízes não agressivas, garantindo total segurança para pedestres e para a infraestrutura urbana.\n"
        )

    species_lines = []
    for sp in species_list:
        species_lines.append(
            f"- **{sp.botanical.common_name_pt}** (*{sp.botanical.scientific_name}*)\n"
            f"  - **Porte & Copa:** {sp.physical_profile.mature_height_meters} m de altura | "
            f"Copa projetada: {sp.estimates.canopy_coverage_m2_at_year_3} m² (Ano 3)\n"
            f"  - **Função Ecológica:** {sp.ecological_interactions.ecological_role}\n"
            f"  - **Atrativo para Fauna:** Polinizada por {', '.join(sp.ecological_interactions.pollinators)}; "
            f"frutos dispersos por {', '.join(sp.ecological_interactions.seed_dispersers_avifauna)}."
        )
    species_section = "\n".join(species_lines)

    schedule = plan.consolidated_care_schedule
    initial_items = "\n".join(
        f"- **{t['species']}:** {t['task']} (*{t['frequency']}*). {t['notes']}"
        for t in schedule.get("initial_month", [])
    )
    quarterly_items = "\n".join(
        f"- **{t['species']}:** {t['task']} (*{t['frequency']}*). {t['notes']}"
        for t in schedule.get("maintenance_quarterly", [])
    )
    annual_items = "\n".join(
        f"- **{t['species']}:** {t['task']} (*{t['frequency']}*). {t['notes']}"
        for t in schedule.get("annual", [])
    )

    return f"""# 🌱 Guia do Mutirão de Plantio — {site.name}

Bem-vindos ao mutirão de restauração urbana do **CanopyCrew**! Este guia foi elaborado para apoiar vizinhos e voluntários na implantação e no cuidado das mudas, contribuindo diretamente para o **ODS 11 da ONU (Meta 11.7: espaços públicos verdes, inclusivos e acessíveis em São Paulo)**.
{wire_warning}
---

## 📊 Resumo do Plano Comunitário
- **Arquétipo do Local:** {site.archetype_label} ({site.sunlight_exposure.replace('_', ' ')})
- **Total de Mudas Selecionadas:** {plan.selected_species_count}
- **Investimento Estimado em Mudas:** ${plan.total_seedling_cost_usd:.2f} USD
- **Projeção de Copa em 3 Anos:** {plan.projected_canopy_m2_year_3:.1f} m² de sombra e microclima restaurado

---

## 🌿 Espécies Nativas da Mata Atlântica Selecionadas
Todas as espécies são 100% nativas, registradas no BioSampa e certificadas para o município de São Paulo:

{species_section}

---

## 🗓️ Calendário de Cuidado Comunitário

### 1. Mês Inicial (Fase Crítica de Pegamento)
{initial_items or '- Monitoramento regular de umidade e proteção do colo da muda.'}

### 2. Manutenção Trimestral (Nutrição e Controle Competitivo)
{quarterly_items or '- Adubação com composto orgânico e coroamento livre de gramíneas.'}

### 3. Cuidado Anual (Poda Formativa e Vistoria Estrutural)
{annual_items or '- Vistoria anual conforme normas do PMAU.'}

---
*CanopyCrew — Fortalecendo a biodiversidade urbana de São Paulo com rigor botânico e ação comunitária.*"""


async def generate_volunteer_care_narrative(
    site: SiteArchetype,
    plan: VolunteerPlanResponse,
    selected_species_ids: Optional[List[str]] = None,
    client: Optional[NIMClient] = None,
) -> str:
    """Generate a care narrative using NVIDIA NIM with graceful deterministic fallback."""
    catalog = {sp.species_id: sp for sp in load_species()}
    target_ids = selected_species_ids or [
        t["species_id"] for t in plan.consolidated_care_schedule.get("initial_month", [])
    ]
    # Deduplicate while preserving order
    seen = set()
    distinct_ids = [sp_id for sp_id in target_ids if not (sp_id in seen or seen.add(sp_id))]
    species_list = [catalog[sp_id] for sp_id in distinct_ids if sp_id in catalog]

    nim_client = client or NIMClient()

    if not nim_client.is_configured:
        logger.info("NVIDIA NIM not configured (NVIDIA_API_KEY missing); returning deterministic care guide.")
        return build_fallback_narrative(site, plan, species_list)

    species_details = [
        {
            "scientific_name": sp.botanical.scientific_name,
            "common_name_pt": sp.botanical.common_name_pt,
            "growth_habit": sp.physical_profile.growth_habit,
            "mature_height_meters": sp.physical_profile.mature_height_meters,
            "canopy_coverage_m2_at_year_3": sp.estimates.canopy_coverage_m2_at_year_3,
            "ecological_role": sp.ecological_interactions.ecological_role,
            "pollinators": sp.ecological_interactions.pollinators,
            "seed_dispersers": sp.ecological_interactions.seed_dispersers_avifauna,
        }
        for sp in species_list
    ]

    user_prompt = build_user_prompt(
        site_name=site.name,
        site_label=site.archetype_label,
        sunlight=site.sunlight_exposure.replace("_", " "),
        overhead_power_lines=site.constraints.overhead_power_lines,
        max_mature_height_meters=site.constraints.max_mature_height_meters,
        selected_species_count=plan.selected_species_count,
        total_cost_usd=plan.total_seedling_cost_usd,
        projected_canopy_m2=plan.projected_canopy_m2_year_3,
        species_details=species_details,
        consolidated_schedule=plan.consolidated_care_schedule,
    )

    try:
        logger.info("Invoking NVIDIA NIM inference for site '%s'...", site.site_id)
        narrative = await nim_client.generate_completion(
            system_prompt=NIM_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )
        return narrative
    except (NIMClientError, Exception) as exc:
        logger.warning(
            "NVIDIA NIM narrative generation failed (%s); falling back to deterministic guide.",
            exc,
        )
        return build_fallback_narrative(site, plan, species_list)
