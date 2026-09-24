import React, { useState, useEffect, Suspense, lazy } from "react"
import Header from "./components/Header"
import Hero from "./components/Hero"
import BentoShowcase from "./components/BentoShowcase"
import WhySection from "./components/WhySection"
import SDKSection from "./components/SDKSection"
import StatsSection from "./components/StatsSection"
import OutcomesSection from "./components/OutcomesSection"
import SecuritySection from "./components/SecuritySection"
import FAQSection from "./components/FAQSection"
import CTASection from "./components/CTASection"
import Footer from "./components/Footer"
import BookingModal from "./components/BookingModal"
import IndustriesPage from "./components/IndustriesPage"
import ServicesPage from "./components/ServicesPage"
import PortfolioPage from "./components/PortfolioPage"
import AboutPage from "./components/AboutPage"
import CareersPage from "./components/CareersPage"

// Lazy-loaded so the admin dashboard (and its CSS/JS) never lands in the
// public site's initial bundle — it's only fetched when someone actually
// visits #admin-login or #admin.
const AdminApp = lazy(() => import("./admin/AdminApp"))

export default function App() {
  const [view, setView] = useState("home")

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      if (hash === "#admin-login" || hash === "#admin") {
        setView("admin")
      } else if (hash === "#industries-page") {
        setView("industries")
        window.scrollTo({ top: 0, behavior: "instant" })
      } else if (hash === "#services-page") {
        setView("services")
        window.scrollTo({ top: 0, behavior: "instant" })
      } else if (hash === "#portfolio-page") {
        setView("portfolio")
        window.scrollTo({ top: 0, behavior: "instant" })
      } else if (hash === "#about-page") {
        setView("about")
        window.scrollTo({ top: 0, behavior: "instant" })
      } else if (hash === "#careers-page") {
        setView("careers")
        window.scrollTo({ top: 0, behavior: "instant" })
      } else {
        setView("home")

        if (hash && hash !== "#top") {
          setTimeout(() => {
            const target = document.querySelector(hash)
            if (target) {
              target.scrollIntoView({ behavior: "smooth" })
            }
          }, 80)
        }
      }
    }
    window.addEventListener("hashchange", handleHash)
    handleHash()
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  if (view === "admin") {
    return (
      <Suspense fallback={<div style={{ padding: 40, color: "#9b9ba3", fontFamily: "monospace" }}>Loading…</div>}>
        <AdminApp />
      </Suspense>
    )
  }

  return (
    <>
      <Header />
      <main id="top">
        {view === "industries" && <IndustriesPage />}
        {view === "services" && <ServicesPage />}
        {view === "portfolio" && <PortfolioPage />}
        {view === "about" && <AboutPage />}
        {view === "careers" && <CareersPage />}
        {view === "home" && (
          <>
            <Hero />
            <BentoShowcase />
            <div className="bg-transition-spacer" aria-hidden="true"></div>
            <WhySection />
            <SDKSection />
            <StatsSection />
            <OutcomesSection />
            <SecuritySection />
            <FAQSection />
            <CTASection />
            <div className="bg-transition-spacer-bottom" aria-hidden="true"></div>
          </>
        )}
      </main>
      <Footer />
      <BookingModal />
    </>
  )
}
