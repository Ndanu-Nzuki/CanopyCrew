import { useEffect, useState } from "react";
import About from "./components/about";
import Discover from "./components/discover";
import Footer from "./components/Footer";
import Hero from "./components/hero";
import Navbar from "./components/navbar";
import PlantCatalogue from "./components/plantcatalogue";
import SiteDetail from "./components/sitedetail";
import MyWorkspace from "./components/MyWorkspace";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/config";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://canopycrew-api-sb77peq6bq-uc.a.run.app/api/v1"
).replace(/\/+(?:api\/v1\/?)?$/, "");

const sectionByPath = {
  "/sites": "discover",
  "/species": "plants",
  "/about": "about",
  "/contact": "contact",
};

async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json();
}

async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData?.detail) {
        detail =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }
    } catch {
      // Keep default status error message when body is not JSON
    }
    throw new Error(detail);
  }

  return response.json();
}

export default function App() {
  const [sites, setSites] = useState([]);
  const [plants, setPlants] = useState([]);

  const [recommendationsBySite, setRecommendationsBySite] = useState({});
  const [recommendationsStatusBySite, setRecommendationsStatusBySite] =
    useState({});

  const [sitesStatus, setSitesStatus] = useState("loading");
  const [plantsStatus, setPlantsStatus] = useState("loading");
  const [workspaceOpen, setWorkspaceOpen] = useState(
    () => window.location.pathname === "/workspace",
  );
  const [currentUser, setCurrentUser] = useState(null);
const [authLoading, setAuthLoading] = useState(true);

const workspaceEmail = currentUser?.email || "";

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
    setAuthLoading(false);
  });

  return unsubscribe;
}, []);

  const [activeSiteId, setActiveSiteId] = useState(() => {
    const match = window.location.hash.match(/^#site\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  });

  // Resolve section, workspace, and site URLs on direct loads and browser navigation.
  useEffect(() => {
    const syncLocation = (event) => {
      if (window.location.pathname === "/workspace") {
        setWorkspaceOpen(true);
        setActiveSiteId(null);
        return;
      }

      setWorkspaceOpen(false);
      const match = window.location.hash.match(/^#site\/(.+)$/);
      const siteId = match ? decodeURIComponent(match[1]) : null;
      setActiveSiteId(siteId);

      if (siteId) {
        if (!window.history.state?.canopyCrewSite) {
          window.history.replaceState(
            { canopyCrewSite: true, canReturn: event?.type === "hashchange" },
            "",
            window.location.href,
          );
        }
        window.scrollTo({ top: 0 });
        return;
      }

      const sectionId = sectionByPath[window.location.pathname];
      if (sectionId) {
        window.setTimeout(
          () => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" }),
          0,
        );
      } else if (window.location.pathname === "/") {
        window.scrollTo({ top: 0 });
      }
    };

    syncLocation();
    window.addEventListener("hashchange", syncLocation);
    window.addEventListener("popstate", syncLocation);

    return () => {
      window.removeEventListener("hashchange", syncLocation);
      window.removeEventListener("popstate", syncLocation);
    };
  }, []);

  // Load the full catalogue separately from site-specific recommendations.
  useEffect(() => {
    let active = true;

    getJson("/api/v1/species")
      .then((speciesData) => {
        if (!active) return;

        setPlants(speciesData);
        setPlantsStatus("ready");
      })
      .catch(() => {
        if (active) setPlantsStatus("error");
      });

    // Fetch site definitions.
    getJson("/api/v1/sites")
      .then(async (siteData) => {
        if (!active) return;

        setSites(siteData);
        setSitesStatus("ready");

        // Initialize each site's recommendation status independently.
        setRecommendationsStatusBySite(
          Object.fromEntries(
            siteData.map((site) => [site.site_id, "loading"]),
          ),
        );

        // Fetch and preserve recommendations for each individual site.
        const results = await Promise.all(
          siteData.map(async (site) => {
            try {
              const recommendations = await getJson(
                `/api/v1/recommendations?site_id=${encodeURIComponent(site.site_id)}`,
              );

              return {
                siteId: site.site_id,
                recommendations,
                status: "ready",
              };
            } catch {
              return {
                siteId: site.site_id,
                recommendations: [],
                status: "error",
              };
            }
          }),
        );

        if (!active) return;

        setRecommendationsBySite(
          Object.fromEntries(
            results.map((result) => [
              result.siteId,
              result.recommendations,
            ]),
          ),
        );

        setRecommendationsStatusBySite(
          Object.fromEntries(
            results.map((result) => [
              result.siteId,
              result.status,
            ]),
          ),
        );
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

    window.history.replaceState({ canopyCrewHome: true }, "", "/sites");

    setActiveSiteId(null);
    window.setTimeout(
      () => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  };

  const navigateToSection = (event, sectionId, path) => {
    event.preventDefault();
    setWorkspaceOpen(false);
    setActiveSiteId(null);
    window.history.pushState({ canopyCrewHome: true }, "", path);
    window.setTimeout(
      () => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  };

  const openWorkspace = () => {
    setWorkspaceOpen(true);
    setActiveSiteId(null);
    if (window.location.pathname !== "/workspace") {
      window.history.pushState({ canopyCrewWorkspace: true }, "", "/workspace");
    }
  };

  const goHome = () => {
    setWorkspaceOpen(false);
    setActiveSiteId(null);
    window.history.pushState({ canopyCrewHome: true }, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const signOutWorkspace = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Unable to sign out:", error);
  }
};

  const activeSite = sites.find(
    (site) => site.site_id === activeSiteId,
  );

  return (
    <>
      <Navbar onWorkspace={openWorkspace} onSignOut={signOutWorkspace} signedIn={Boolean(workspaceEmail)} onNavigate={navigateToSection} onHome={goHome} workspaceOpen={workspaceOpen} />

      {workspaceOpen ? (
  authLoading ? (
    <main className="workspace-page">
      <p>Checking your session...</p>
    </main>
  ) : (
    <MyWorkspace
      sites={sites}
      recommendationsBySite={recommendationsBySite}
      email={workspaceEmail}
    />
  )
) : (
  <>

      <main>
        {activeSiteId ? (
          activeSite ? (
            <SiteDetail
              key={activeSite.site_id}
              site={activeSite}
              recommendations={recommendationsBySite[activeSiteId] || []}
              status={
                recommendationsStatusBySite[activeSiteId] || "loading"
              }
              onBack={goBack}
              onPostPlan={postJson}
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
            <Discover sites={sites} status={sitesStatus} onNavigate={navigateToSection} />
            <PlantCatalogue plants={plants} status={plantsStatus} />
            <About />
          </>
        )}
      </main>

      {!activeSiteId && <Footer onHome={goHome} onWorkspace={openWorkspace} onNavigate={navigateToSection} />}
      </>)
      }
    </>
  );
}
