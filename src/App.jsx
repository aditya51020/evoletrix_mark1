import React, { useState, useEffect, lazy, Suspense } from "react"
import Header from "./components/Header"
import Hero from "./components/Hero"
import BentoShowcase from "./components/BentoShowcase"
import WhySection from "./components/WhySection"
import SDKSection from "./components/SDKSection"
import StatsSection from "./components/StatsSection"
import OutcomesSection from "./components/OutcomesSection"
import SecuritySection from "./components/SecuritySection"
import FAQSection from "./components/FAQSection"
import Footer from "./components/Footer"
import BookingModal from "./components/BookingModal"

// Route-level pages are loaded on demand instead of bundled into the initial
// load, since only one of them (at most) is ever shown at a time.
const IndustriesPage = lazy(() => import("./components/IndustriesPage"))
const ServicesPage = lazy(() => import("./components/ServicesPage"))
const PortfolioPage = lazy(() => import("./components/PortfolioPage"))
const AboutPage = lazy(() => import("./components/AboutPage"))
const CareersPage = lazy(() => import("./components/CareersPage"))

export default function App() {
  const [view, setView] = useState("home")

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      if (hash === "#industries-page") {
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

  // Reveals ".reveal" elements as they scroll into view. Route pages are
  // React.lazy + Suspense, so their content can mount asynchronously *after*
  // a "view changed" effect would have already run and found nothing to
  // observe -- a plain `[view]`-keyed effect misses that content permanently.
  // A MutationObserver sidesteps the timing question entirely: it re-scans
  // for new ".reveal" elements whenever the DOM actually changes, whether
  // that's a lazy page finishing its load, a view switch, or an accordion
  // injecting new content.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    )

    const observeNewReveals = () => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => observer.observe(el))
    }

    observeNewReveals()

    const mutationObserver = new MutationObserver(observeNewReveals)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return (
    <>
      <Header />
      <main id="top">
        <Suspense fallback={null}>
          {view === "industries" && <IndustriesPage />}
          {view === "services" && <ServicesPage />}
          {view === "portfolio" && <PortfolioPage />}
          {view === "about" && <AboutPage />}
          {view === "careers" && <CareersPage />}
        </Suspense>
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
            <div className="bg-transition-spacer-bottom" aria-hidden="true"></div>
          </>
        )}
      </main>
      <Footer />
      <BookingModal />
    </>
  )
}
