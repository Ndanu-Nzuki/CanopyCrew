import { useEffect, useMemo, useState } from "react";
import Icon from "./Icon";
import { getPlantImage } from "../data/plantimages";
import { getSiteImage } from "../data/siteimages";

const ACCOUNT_KEY = "canopycrew.demo.account";
const WORKSPACE_KEY = "canopycrew.demo.workspace";
const taskTypes = ["Watering", "Mulching", "Compost", "Pruning"];

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function AuthGate({ onDone }) {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault(); setError("");
    const saved = readJson(ACCOUNT_KEY, null);
    if (mode === "signup" && password !== confirm) return setError("Your passwords do not match.");
    if (mode === "login" && saved?.email !== email.trim().toLowerCase()) return setError("No demo account found for that email. Sign up to get started.");
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ email: email.trim().toLowerCase() }));
    onDone(email.trim().toLowerCase());
  };
  return <section className="workspace-auth-card">
    <div className="workspace-leaf"><Icon name="leaf" size={27} /></div>
    <p className="eyebrow"><span /> YOUR GROWING SPACE</p>
    <h1>{mode === "signup" ? "Make room to grow." : "Welcome back."}</h1>
    <p className="workspace-intro">Sign in to keep your planting sites, native plants, and care reminders together.</p>
    <div className="auth-tabs" role="tablist"><button className={mode === "signup" ? "selected" : ""} onClick={() => {setMode("signup");setError("");}}>Create account</button><button className={mode === "login" ? "selected" : ""} onClick={() => {setMode("login");setError("");}}>Log in</button></div>
    <form onSubmit={submit}>
      <label>Email address<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
      <label>Password<input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength="8" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" /></label>
      {mode === "signup" && <label>Confirm password<input type="password" autoComplete="new-password" minLength="8" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Enter your password again" /></label>}
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="button workspace-submit" type="submit">{mode === "signup" ? "Create my workspace" : "Log in to workspace"}<Icon name="arrow" size={17} /></button>
    </form>
    <p className="demo-note">Demo mode: account access is stored in this browser only. No password is saved or sent to a server.</p>
  </section>;
}

function calendarCells(month) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first); start.setDate(1 - first.getDay());
  return Array.from({ length: 35 }, (_, i) => { const day = new Date(start); day.setDate(start.getDate() + i); return day; });
}

export default function MyWorkspace({ sites, recommendationsBySite, onClose }) {
  const [email, setEmail] = useState(() => readJson(ACCOUNT_KEY, null)?.email || "");
  const [workspace, setWorkspace] = useState(() => readJson(WORKSPACE_KEY, { sites: [], selected: {}, done: {}, activeSite: null }));
  const [month, setMonth] = useState(() => new Date());
  const [activeDate, setActiveDate] = useState(() => new Date().toISOString().slice(0, 10));
  useEffect(() => { localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace)); }, [workspace]);

  const userSites = workspace.sites.map((id) => sites.find((site) => site.site_id === id)).filter(Boolean);
  const activeSite = userSites.find((site) => site.site_id === workspace.activeSite) || userSites[0] || null;
  const compatible = activeSite ? (recommendationsBySite[activeSite.site_id] || []) : [];
  const selectedPlants = workspace.selected[activeSite?.site_id] || [];
  const weekTasks = useMemo(() => {
    const chosen = compatible.filter((plant) => selectedPlants.includes(plant.species_id));
    if (!chosen.length) return [];
    return [
      { id: `${activeSite.site_id}-water`, title: `Water ${chosen.length > 1 ? `${chosen.length} new plantings` : chosen[0].botanical.common_name_pt}`, type: "Watering", date: activeDate, note: chosen.map((p) => p.botanical.common_name_pt).join(", ") },
      { id: `${activeSite.site_id}-mulch`, title: `Check mulch around ${chosen[0].botanical.common_name_pt}`, type: "Mulching", date: new Date(new Date(`${activeDate}T12:00:00`).setDate(new Date(`${activeDate}T12:00:00`).getDate() + 2)).toISOString().slice(0, 10), note: activeSite.archetype_label },
      { id: `${activeSite.site_id}-compost`, title: "Check compost and top up", type: "Compost", date: new Date(new Date(`${activeDate}T12:00:00`).setDate(new Date(`${activeDate}T12:00:00`).getDate() + 5)).toISOString().slice(0, 10), note: activeSite.archetype_label },
    ];
  }, [activeSite, activeDate, compatible, selectedPlants]);
  const doneCount = weekTasks.filter((task) => workspace.done[task.id]).length;
  const cells = calendarCells(month);
  const moveMonth = (delta) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  const addSite = (id) => setWorkspace((old) => ({ ...old, sites: old.sites.includes(id) ? old.sites : [...old.sites, id] }));
  const togglePlant = (id) => setWorkspace((old) => { const existing = old.selected[activeSite.site_id] || []; const next = existing.includes(id) ? existing.filter((item) => item !== id) : [...existing, id]; return { ...old, selected: { ...old.selected, [activeSite.site_id]: next } }; });

  if (!email) return <main className="workspace-page"><button className="workspace-close" onClick={onClose}>← Back to CanopyCrew</button><AuthGate onDone={setEmail} /></main>;
  return <main className="workspace-page"><div className="workspace-wrap">
    <div className="workspace-topline"><button className="workspace-back" onClick={onClose}>← Back to CanopyCrew</button><button className="signout-button" onClick={() => { localStorage.removeItem(ACCOUNT_KEY); setEmail(""); }}>Sign out</button></div>
    <header className="workspace-heading"><div><p className="eyebrow"><span /> PLANTING WORKSPACE</p><h1>Your little corner<br /><em>of the forest.</em></h1><p>{email} · Let’s keep your native plantings thriving.</p></div><div className="workspace-illustration"><Icon name="leaf" size={76} /></div></header>
    <section className="workspace-sites"><div className="workspace-section-heading"><div><p className="eyebrow"><span /> YOUR SITES</p><h2>Where you're growing</h2></div><span>{userSites.length} of 3 sites</span></div><div className="workspace-site-grid">
      {userSites.map((site) => <article className={`workspace-site-card ${activeSite?.site_id === site.site_id ? "current" : ""}`} key={site.site_id}><button className="workspace-site-select" onClick={() => setWorkspace((old) => ({ ...old, activeSite: site.site_id }))}><img src={getSiteImage(site)} alt=""/><span><b>{site.archetype_label}</b><small>{site.name}</small></span></button><button aria-label={`Remove ${site.archetype_label}`} onClick={() => setWorkspace((old) => ({ ...old, sites: old.sites.filter((id) => id !== site.site_id), activeSite: old.activeSite === site.site_id ? null : old.activeSite }))}>×</button></article>)}
      {sites.filter((site) => !workspace.sites.includes(site.site_id)).map((site) => <button className="add-site-card" key={site.site_id} onClick={() => { addSite(site.site_id); if (!activeSite) setWorkspace((old) => ({ ...old, sites: old.sites.includes(site.site_id) ? old.sites : [...old.sites, site.site_id], activeSite: site.site_id })); }}><span>＋</span><b>Add {site.archetype_label}</b><small>{site.name}</small></button>)}
    </div></section>
    {!activeSite ? <div className="workspace-empty"><Icon name="leaf" size={32}/><h2>Choose a site to get started</h2><p>Add one of the three São Paulo site types above to see its compatible native plants and care schedule.</p></div> : <>
      <section className="workspace-plants"><div className="workspace-section-heading"><div><p className="eyebrow"><span /> NATIVE PLANTS</p><h2>Choose plants for {activeSite.archetype_label.toLowerCase()}</h2></div><span>{selectedPlants.length} selected</span></div><div className="workspace-plant-row">{compatible.map((plant, i) => <button className={`workspace-plant ${selectedPlants.includes(plant.species_id) ? "picked" : ""}`} key={plant.species_id} onClick={() => togglePlant(plant.species_id)}><img src={getPlantImage(plant, i)} alt=""/><span><b>{plant.botanical.common_name_pt}</b><i>{plant.botanical.scientific_name}</i></span><strong>{selectedPlants.includes(plant.species_id) ? "✓" : "+"}</strong></button>)}</div>{!compatible.length && <p className="workspace-muted">Plant recommendations are loading or unavailable right now.</p>}</section>
      <section className="workspace-calendar-layout"><div className="workspace-calendar"><div className="calendar-heading"><h2>{month.toLocaleDateString("en", { month: "long", year: "numeric" })}</h2><div><button onClick={() => moveMonth(-1)} aria-label="Previous month">‹</button><button onClick={() => moveMonth(1)} aria-label="Next month">›</button></div></div><div className="calendar-grid">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => <span className="calendar-weekday" key={day}>{day}</span>)}{cells.map((date) => { const key = date.toISOString().slice(0, 10); const hasTask = weekTasks.some((task) => task.date === key); return <button key={key} className={`${date.getMonth() !== month.getMonth() ? "outside" : ""} ${key === activeDate ? "active" : ""}`} onClick={() => setActiveDate(key)}>{date.getDate()}{hasTask && <i/>}</button>; })}</div></div><aside className="task-legend"><p className="eyebrow"><span/> TASKS</p>{taskTypes.map((type) => <span key={type}><i className={`task-dot ${type.toLowerCase()}`}/>{type}</span>)}<div className="legend-message"><Icon name="leaf" size={21}/><p>Consistent care helps your plants thrive!</p></div></aside></section>
      <section className="week-care"><header><div><p className="eyebrow"><span/> YOUR ROUTINE</p><h2>This week’s care tasks</h2></div><span>{doneCount} of {weekTasks.length} complete</span></header>{weekTasks.length ? weekTasks.map((task) => <label className={`care-check-row ${workspace.done[task.id] ? "done" : ""}`} key={task.id}><input type="checkbox" checked={Boolean(workspace.done[task.id])} onChange={(event) => setWorkspace((old) => ({ ...old, done: { ...old.done, [task.id]: event.target.checked } }))}/><span className="fake-check">✓</span><span className="care-check-copy"><b>{task.title}</b><small>Due {new Date(`${task.date}T12:00:00`).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })} · {task.note}</small></span><i className={`task-dot ${task.type.toLowerCase()}`}/></label>) : <div className="workspace-empty small"><p>Select a compatible plant above to build your first care checklist.</p></div>}{weekTasks.length > 0 && doneCount === weekTasks.length && <div className="week-complete"><Icon name="leaf" size={34}/><div><h3>Week complete!</h3><p>Every care task is done. Your new plantings are off to a strong start.</p></div></div>}</section>
    </>}
    <p className="workspace-footnote">A simple local demo workspace · Your selections and checkoffs stay in this browser.</p>
  </div></main>;
}
