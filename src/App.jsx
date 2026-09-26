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
import Footer from "./components/Footer"
import BookingModal from "./components/BookingModal"

// Route-level pages are loaded on demand instead of bundled into the initial
// load, since only one of them (at most) is ever shown at a time.
const IndustriesPage = lazy(() => import("./components/IndustriesPage"))
const ServicesPage = lazy(() => import("./components/ServicesPage"))
const PortfolioPage = lazy(() => import("./components/PortfolioPage"))
const AboutPage = lazy(() => import("./components/AboutPage"))
const CareersPage = lazy(() => import("./components/CareersPage"))

// Lazy-loaded so the admin dashboard (and its CSS/JS) never lands in the
// public site's initial bundle — it's only fetched when someone actually
// visits #admin-login or #admin. Left on hash routing deliberately: it's
// never meant to be crawled/indexed, so it gets none of the real-path
// treatment below.
const AdminApp = lazy(() => import("./admin/AdminApp"))

// Real paths (not #hash routes) so each page is its own crawlable URL
// with its own title/description/canonical — see the per-view effect
// below and sitemap.xml. Server-side, public/.htaccess already falls
// back to index.html for any path that isn't a real file, so these just
// work on refresh/direct-visit with no further server config.
const PATH_TO_VIEW = {
  "/": "home",
  "/services": "services",
  "/industries": "industries",
  "/portfolio": "portfolio",
  "/about": "about",
  "/careers": "careers"
}

const PAGE_META = {
  home: {
    title: "Evoletrix | Custom Web, iOS, AI & GIS Software Engineering",
    description: "Evoletrix Private Limited designs and engineers premium custom web applications, native iOS apps, custom AI integration, blockchain platforms, ERP systems, and high-accuracy geo-referencing (GIS) software."
  },
  services: {
    title: "Our Services | Evoletrix",
    description: "Product development & engineering, data center services, IT outsourcing, digital transformation, and data services from Evoletrix."
  },
  industries: {
    title: "Industries We Serve | Evoletrix",
    description: "Evoletrix delivers custom software solutions across healthcare, fintech, logistics, education, retail, and more."
  },
  portfolio: {
    title: "Our Portfolio | Evoletrix",
    description: "In-house products built and maintained by Evoletrix, including GIS mapping, record management, and hospital management systems."
  },
  about: {
    title: "About Us | Evoletrix",
    description: "Evoletrix Private Limited is a digital engineering team based in Faridabad, India, building web, iOS, AI, and GIS software."
  },
  careers: {
    title: "Careers | Evoletrix",
    description: "Explore open engineering, design, and product roles at Evoletrix in Faridabad and remote."
  }
}

export default function App() {
  const [view, setView] = useState("home")

  // Reads the current URL and syncs `view` to it. Defined in the
  // component body (not inside the effect) so the click-interception
  // effect below can call it too, right after pushState — pushState
  // never fires popstate/hashchange on its own.
  const applyRoute = () => {
    const hash = window.location.hash
    if (hash === "#admin-login" || hash === "#admin") {
      setView("admin")
      return
    }

    const nextView = PATH_TO_VIEW[window.location.pathname] ?? "home"
    setView(nextView)

    if (hash && hash !== "#top" && nextView === "home") {
      setTimeout(() => {
        const target = document.querySelector(hash)
        if (target) {
          target.scrollIntoView({ behavior: "smooth" })
        }
      }, 80)
    } else {
      window.scrollTo({ top: 0, behavior: "instant" })
    }
  }

  useEffect(() => {
    window.addEventListener("popstate", applyRoute)
    window.addEventListener("hashchange", applyRoute)
    applyRoute()
    return () => {
      window.removeEventListener("popstate", applyRoute)
      window.removeEventListener("hashchange", applyRoute)
    }
  }, [])

  // Intercepts clicks on same-origin, path-based links (href="/services"
  // etc.) so they navigate via pushState instead of a full page reload —
  // the whole point of being an SPA. Links are otherwise completely
  // ordinary <a href="/..."> tags; nothing elsewhere needs an onClick
  // just to navigate. Hash-only links (href="#faq") are left alone here
  // and handled by the hashchange listener above instead.
  useEffect(() => {
    const handleClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = e.target.closest("a")
      if (!link) return
      if (link.target && link.target !== "_self") return
      const href = link.getAttribute("href")
      if (!href || !href.startsWith("/") || href.startsWith("//")) return

      e.preventDefault()
      if (window.location.pathname + window.location.hash !== href) {
        window.history.pushState({}, "", href)
      }
      applyRoute()
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  // Keeps <title>, meta description, OG/Twitter tags, and the canonical
  // link in sync with the current route, so each page is distinct in
  // search results and social share previews rather than every route
  // showing the homepage's copy.
  useEffect(() => {
    if (view === "admin") return
    const meta = PAGE_META[view] ?? PAGE_META.home
    document.title = meta.title

    const setMeta = (selector, attr, value) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute(attr, value)
    }
    setMeta('meta[name="description"]', "content", meta.description)
    setMeta('meta[property="og:title"]', "content", meta.title)
    setMeta('meta[property="og:description"]', "content", meta.description)
    setMeta('meta[property="twitter:title"]', "content", meta.title)
    setMeta('meta[property="twitter:description"]', "content", meta.description)

    const canonicalPath = Object.keys(PATH_TO_VIEW).find((p) => PATH_TO_VIEW[p] === view) ?? "/"
    setMeta('link[rel="canonical"]', "href", `https://evoletrix.com${canonicalPath}`)
    setMeta('meta[property="og:url"]', "content", `https://evoletrix.com${canonicalPath}`)
    setMeta('meta[property="twitter:url"]', "content", `https://evoletrix.com${canonicalPath}`)
  }, [view])

  // Blocks copying/right-clicking page content on the public site, to make
  // casual content scraping a bit harder. Form fields are exempt (target
  // check below) so filling out the contact/booking/apply forms still
  // works normally. Never runs on the admin dashboard — the team needs to
  // copy applicant emails, cover notes, etc. from there.
  //
  // Not real protection: view-source, disabling JS, or just reading the
  // rendered page still exposes everything. It only deters casual
  // right-click-and-copy, which is what was asked for.
  useEffect(() => {
    if (view === "admin") return

    const isFormField = (target) =>
      target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement

    const blockUnlessFormField = (e) => {
      if (!isFormField(e.target)) e.preventDefault()
    }

    document.addEventListener("copy", blockUnlessFormField)
    document.addEventListener("cut", blockUnlessFormField)
    document.addEventListener("contextmenu", blockUnlessFormField)
    document.body.classList.add("no-select")

    return () => {
      document.removeEventListener("copy", blockUnlessFormField)
      document.removeEventListener("cut", blockUnlessFormField)
      document.removeEventListener("contextmenu", blockUnlessFormField)
      document.body.classList.remove("no-select")
    }
  }, [view])

  // Reveals ".reveal" elements as they scroll into view. Route pages are
  // React.lazy + Suspense, so their content can mount asynchronously *after*
  // a "view changed" effect would have already run and found nothing to
  // observe -- a plain `[view]`-keyed effect misses that content permanently.
  // A MutationObserver sidesteps the timing question entirely: it re-scans
  // for new ".reveal" elements whenever the DOM actually changes, whether
  // that's a lazy page finishing its load, a view switch, or an accordion
  // injecting new content.
  //
  // Called unconditionally (before the admin early-return below) so hook
  // order stays identical across renders regardless of `view`.
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
