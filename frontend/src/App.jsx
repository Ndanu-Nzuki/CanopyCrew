import { useEffect, useState } from "react"
import About from "./components/about"
import Discover from "./components/discover"
import Footer from "./components/Footer"
import Hero from "./components/hero"
import Navbar from "./components/navbar"
import PlantCatalogue from "./components/plantcatalogue"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"

async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json()
}

export default function App() {
  const [sites, setSites] = useState([])
  const [plants, setPlants] = useState([])
  const [sitesStatus, setSitesStatus] = useState("loading")
  const [plantsStatus, setPlantsStatus] = useState("loading")

  useEffect(() => {
    let active = true

    getJson("/api/v1/sites")
      .then(async (siteData) => {
        if (!active) return
        setSites(siteData)
        setSitesStatus("ready")

        try {
          const recommendationLists = await Promise.all(
            siteData.map((site) =>
              getJson(`/api/v1/recommendations?site_id=${encodeURIComponent(site.site_id)}`),
            ),
          )
          if (!active) return
          const uniquePlants = new Map()
          recommendationLists.flat().forEach((plant) => {
            uniquePlants.set(plant.species_id, plant)
          })
          setPlants([...uniquePlants.values()])
          setPlantsStatus("ready")
        } catch {
          if (active) setPlantsStatus("error")
        }
      })
      .catch(() => {
        if (active) {
          setSitesStatus("error")
          setPlantsStatus("error")
        }
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Discover sites={sites} status={sitesStatus} />
        <PlantCatalogue plants={plants} status={plantsStatus} />
        <About />
      </main>
      <Footer />
    </>
  )
}
