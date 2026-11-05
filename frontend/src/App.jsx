import { useEffect, useState } from "react";
import About from "./components/about";
import Discover from "./components/discover";
import Footer from "./components/Footer";
import Hero from "./components/hero";
import Navbar from "./components/navbar";
import PlantCatalogue from "./components/plantcatalogue";
import SiteDetail from "./components/sitedetail";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

export default function App() {
  const [sites, setSites] = useState([]);
  const [plants, setPlants] = useState([]);
  const [sitesStatus, setSitesStatus] = useState("loading");
  const [plantsStatus, setPlantsStatus] = useState("loading");
  const [activeSiteId, setActiveSiteId] = useState(() => {
    const match = window.location.hash.match(/^#site\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  });

  useEffect(() => {
    const syncSiteFromUrl = () => {
      const match = window.location.hash.match(/^#site\/(.+)$/);
      const siteId = match ? decodeURIComponent(match[1]) : null;
      setActiveSiteId(siteId);
      if (siteId) {
        window.history.replaceState(
          { canopyCrewSite: true, canReturn: true },
          "",
          window.location.href,
        );
        window.scrollTo({ top: 0 });
      }
    };

    if (activeSiteId && !window.history.state?.canopyCrewSite) {
      window.history.replaceState(
        { canopyCrewSite: true, canReturn: false },
        "",
        window.location.href,
      );
    }
    window.addEventListener("hashchange", syncSiteFromUrl);
    window.addEventListener("popstate", syncSiteFromUrl);
    return () => {
      window.removeEventListener("hashchange", syncSiteFromUrl);
      window.removeEventListener("popstate", syncSiteFromUrl);
    };
  }, [activeSiteId]);

  useEffect(() => {
    let active = true;

    getJson("/api/v1/sites")
      .then(async (siteData) => {
        if (!active) return;
        setSites(siteData);
        setSitesStatus("ready");

        try {
          const recommendationLists = await Promise.all(
            siteData.map((site) =>
              getJson(
                `/api/v1/recommendations?site_id=${encodeURIComponent(site.site_id)}`,
              ),
            ),
          );
          if (!active) return;
          const uniquePlants = new Map();
          recommendationLists.flat().forEach((plant) => {
            uniquePlants.set(plant.species_id, plant);
          });
          setPlants([...uniquePlants.values()]);
          setPlantsStatus("ready");
        } catch {
          if (active) setPlantsStatus("error");
        }
      })
      .catch(() => {
        if (active) {
          setSitesStatus("error");
          setPlantsStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const goBack = () => {
    if (window.history.state?.canReturn) {
      window.history.back();
      return;
    }
    window.history.replaceState({ canopyCrewHome: true }, "", "#discover");
    setActiveSiteId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeSite = sites.find((site) => site.site_id === activeSiteId);

  return (
    <>
      <Navbar />
      <main>
        {activeSiteId ? (
          activeSite ? (
            <SiteDetail
              site={activeSite}
              plants={plants}
              status={plantsStatus}
              onBack={goBack}
            />
          ) : (
            <section className="section site-detail">
              <div className="page-shell">
                <button className="back-button" onClick={goBack}>
                  ← Back to sites
                </button>
                <p className="api-state">
                  {sitesStatus === "loading"
                    ? "Loading site details…"
                    : "This site type could not be found."}
                </p>
              </div>
            </section>
          )
        ) : (
          <>
            <Hero />
            <Discover sites={sites} status={sitesStatus} />
            <PlantCatalogue plants={plants} status={plantsStatus} />
            <About />
          </>
        )}
      </main>
      {!activeSiteId && <Footer />}
    </>
  );
}
