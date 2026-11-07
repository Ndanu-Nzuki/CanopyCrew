"""Prompt templates and personas for NVIDIA NIM care narrative synthesis.

Owned by Laurine (AI Research / Lead).
Strictly grounded in UN SDG 11.7, São Paulo municipal botanical compliance
(Portaria SVMA nº 26/2024, BioSampa 5ª Edição, PMAU), and wire-safety invariants.
"""

from typing import Any, Dict, List

NIM_SYSTEM_PROMPT = """Você é o Guia de Restauração Ecológica Comunitária do CanopyCrew (UN SDG 11: Cidades e Comunidades Sustentáveis — Meta 11.7).
Sua missão é sintetizar narrativas de cuidado e plantio comunitário encorajadoras, práticas e acessíveis para voluntários em São Paulo.

DIRETRIZES E INVARIANTES ECOLÓGICAS E LEGAIS:
1. Conformidade Botânica Estrita: Baseie-se exclusivamente nas espécies nativas da Mata Atlântica fornecidas pelo sistema determinístico. Jamais sugira ou introduza espécies exóticas ou invasoras (ex.: Ficus microcarpa, Ligustrum lucidum, Eucalyptus).
2. Segurança com Fiação Elétrica (Portaria SVMA nº 26/2024 e PMAU): Se o local tiver fiação aérea (overhead power lines), ressalte com clareza por que todas as espécies selecionadas têm porte compacto (<= 5,0 m) e são seguras sob os fios da rede de distribuição.
3. Precisão Matemática: Jamais altere, recalcule ou contradiga os valores determinísticos de custo de mudas (USD) ou cobertura de copa projetada (m²) calculados pelo backend.
4. Linguagem Acolhedora e Bilíngue: Escreva em Português do Brasil claro, caloroso e acessível para vizinhos e voluntários comunitários, mencionando os nomes populares e científicos das espécies.
5. Estrutura do Roteiro:
   - Boas-vindas e Propósito Comunitário (ODS 11.7 em São Paulo)
   - Cuidados do Local e Segurança (atenção à fiação aérea e solo permeável)
   - Destaque das Espécies e Biodiversidade (polinizadores e avifauna nativa)
   - Jornada do Voluntário (Mês Inicial de Estabelecimento, Manutenção Trimestral e Cuidado Anual)
"""


def build_user_prompt(
    site_name: str,
    site_label: str,
    sunlight: str,
    overhead_power_lines: bool,
    max_mature_height_meters: float,
    selected_species_count: int,
    total_cost_usd: float,
    projected_canopy_m2: float,
    species_details: List[Dict[str, Any]],
    consolidated_schedule: Dict[str, List[Dict[str, str]]],
) -> str:
    """Format validated site context and deterministic totals into user prompt for NIM."""
    species_summary_lines: List[str] = []
    for sp in species_details:
        species_summary_lines.append(
            f"- {sp['common_name_pt']} ({sp['scientific_name']}): "
            f"Porte {sp['growth_habit']} ({sp['mature_height_meters']} m), "
            f"Copa Ano 3: {sp['canopy_coverage_m2_at_year_3']} m², "
            f"Papel ecológico: {sp['ecological_role']}, "
            f"Polinizadores: {', '.join(sp['pollinators'])}, "
            f"Aves dispersoras: {', '.join(sp['seed_dispersers'])}"
        )
    species_block = "\n".join(species_summary_lines)

    initial_tasks = "\n".join(
        f"  * {t['species']}: {t['task']} ({t['frequency']}) - {t['notes']}"
        for t in consolidated_schedule.get("initial_month", [])
    )
    quarterly_tasks = "\n".join(
        f"  * {t['species']}: {t['task']} ({t['frequency']}) - {t['notes']}"
        for t in consolidated_schedule.get("maintenance_quarterly", [])
    )
    annual_tasks = "\n".join(
        f"  * {t['species']}: {t['task']} ({t['frequency']}) - {t['notes']}"
        for t in consolidated_schedule.get("annual", [])
    )

    wire_note = (
        "ATENÇÃO CRÍTICA: O local possui fiação elétrica aérea. Todas as espécies foram verificadas "
        f"como seguras (altura máxima <= {max_mature_height_meters} m) de acordo com o PMAU."
        if overhead_power_lines
        else "Local livre de interferência de fiação aérea baixa."
    )

    return f"""Elabore o Guia do Voluntário para o seguinte plano de plantio validado:

DADOS DO LOCAL:
- Arquétipo: {site_label} ({site_name})
- Exposição Solar: {sunlight}
- Fiação Elétrica Aérea: {'Sim' if overhead_power_lines else 'Não'}
- Observação de Segurança: {wire_note}

TOTAIS DETERMINÍSTICOS DO PLANO:
- Quantidade de Mudas Selecionadas: {selected_species_count}
- Custo Total Estimado de Mudas: ${total_cost_usd:.2f} USD
- Cobertura de Copa Projetada (Ano 3): {projected_canopy_m2:.1f} m²

ESPÉCIES NATIVAS DA MATA ATLÂNTICA SELECIONADAS:
{species_block}

TAREFAS CONSOLIDADAS DE MANUTENÇÃO:
Mês Inicial:
{initial_tasks or '  * Nenhuma tarefa específica cadastrada.'}

Manutenção Trimestral:
{quarterly_tasks or '  * Nenhuma tarefa específica cadastrada.'}

Cuidado Anual:
{annual_tasks or '  * Nenhuma tarefa específica cadastrada.'}

Por favor, gere uma narrativa acolhedora, vibrante e bem organizada em Markdown para motivar os voluntários locais."""
