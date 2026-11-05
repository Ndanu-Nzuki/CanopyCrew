import Icon from "./Icon"

const sunlightNames = {
  full_sun: "full sun",
  partial_shade: "partial shade",
  full_shade: "full shade",
  partial_to_full_shade: "partial to full shade",
}

const carePhases = [
  ["Initial month", "initial_month"],
  ["Quarterly maintenance", "maintenance_quarterly"],
  ["Annual care", "annual"],
]

function CareSchedule({ plant }) {
  return <div className="care-schedule"><h4>Maintenance</h4><div className="care-phases">{carePhases.map(([label, key]) => <section className="care-phase" key={key}><h5>{label}</h5>{plant.volunteer_care_schedule[key].map((task, index) => <div className="care-task" key={`${key}-${index}`}><strong>{task.task}</strong><span>{task.frequency}</span><p>{task.notes}</p></div>)}</section>)}</div></div>
}

function PlantRecommendation({ plant, site }) {
  const suited = plant.site_tolerances.suitable_site_ids.includes(site.site_id)
  const exposure = sunlightNames[site.sunlight_exposure] || site.sunlight_exposure.replaceAll("_", " ")
  const plantSunlight = plant.site_tolerances.sunlight.map((value) => sunlightNames[value] || value.replaceAll("_", " ")).join(", ")
  const wireSafe = !site.constraints.overhead_power_lines || (plant.physical_profile.sidewalk_wire_safe && plant.physical_profile.mature_height_meters <= 5)

  return <article className="detail-plant-card"><div className="detail-plant-heading"><div><p className="eyebrow"><span /> Native Atlantic Forest species</p><h3>{plant.botanical.common_name_en}</h3><p className="scientific">{plant.botanical.scientific_name} · {plant.botanical.common_name_pt}</p></div><span className="plant-height">{plant.physical_profile.mature_height_meters} m mature height</span></div><div className="suitability"><h4>Why it suits this site</h4><ul><li><Icon name="leaf" size={16} /> The backend lists this species as suitable for the {site.archetype_label} archetype{suited ? "." : " (site match requires review)."}</li><li><Icon name="sun" size={16} /> Sunlight tolerance: {plantSunlight}; this site receives {exposure}.</li><li><Icon name="leaf" size={16} /> {plant.ecological_interactions.ecological_role}</li>{site.constraints.overhead_power_lines && <li><Icon name="leaf" size={16} /> Overhead wire safety: {wireSafe ? "meets the 5 m height and wire safety limits" : "does not meet the site's wire safety limits"}.</li>}</ul></div><CareSchedule plant={plant} /></article>
}

export default function SiteDetail({ site, plants, status, onBack }) {
  const suitablePlants = plants.filter((plant) => plant.site_tolerances.suitable_site_ids.includes(site.site_id))
  const goals = site.ecological_goals || []
  const dimensions = site.constraints
  const image = site.site_id.includes("sidewalk")
    ? "https://images.unsplash.com/photo-1524608167924-8305dd66256b?auto=format&fit=crop&w=1500&q=85"
    : site.site_id.includes("sunny")
      ? "https://images.unsplash.com/photo-1756192727102-91cc51abd12c?auto=format&fit=crop&w=1500&q=85"
      : "https://images.unsplash.com/photo-1780311933665-8d3e4e6a31e4?auto=format&fit=crop&w=1500&q=85"

  return <section className="site-detail"><div className="site-detail-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(10,43,29,.9), rgba(10,43,29,.4)), url("${image}")` }}><div className="page-shell"><button className="back-button back-button-light" onClick={onBack}><Icon name="chevron" size={18} /> Back to previous view</button><p className="eyebrow light"><span /> {site.archetype_label}</p><h1>{site.name}</h1><p>{site.description}</p></div></div><div className="page-shell site-detail-content"><section className="site-facts"><div><span>Typical dimensions</span><strong>{site.typical_dimensions}</strong></div><div><span>Sunlight</span><strong>{sunlightNames[site.sunlight_exposure] || site.sunlight_exposure.replaceAll("_", " ")}</strong></div><div><span>Overhead power lines</span><strong>{dimensions.overhead_power_lines ? "Present" : "None"}</strong></div><div><span>Soil compaction</span><strong>{dimensions.soil_compaction_level.replaceAll("_", " ")}</strong></div></section><section className="site-goals"><div><p className="eyebrow"><span /> Site priorities</p><h2>What this space can support</h2></div><ul>{goals.map((goal) => <li key={goal}><Icon name="leaf" size={17} />{goal}</li>)}</ul></section><section className="site-recommendations"><div className="detail-section-heading"><div><p className="eyebrow"><span /> Matched plants</p><h2>Plants suited to this site</h2></div><p>Recommendations follow the site’s growing conditions and safety requirements.</p></div>{status === "loading" ? <p className="api-state">Loading site matched plants…</p> : status === "error" ? <p className="api-state" role="alert">Plant recommendations could not be loaded. Check that the CanopyCrew API is running.</p> : suitablePlants.length ? <div className="detail-plant-list">{suitablePlants.map((plant) => <PlantRecommendation key={plant.species_id} plant={plant} site={site} />)}</div> : <p className="api-state">No plant recommendations are available for this site yet.</p>}</section></div></section>
}
