// Shared product data — used by the header's portfolio mega-menu and by
// PortfolioPage.jsx's "Our Products" showcase. Plain data only (no JSX),
// so this stays a valid .js module; icons are looked up by key through
// <ProductIcon /> instead of being stored as React elements here.
//
// features/stack are reasonable placeholders, not verified facts — every
// product is marked below. Verify and correct before this goes live.
//
// stack is optional: an empty array hides the stack chips everywhere
// they'd otherwise render. Cleared to [] for now, pending verification.

export const products = [
  {
    key: "gis-map",
    name: "GIS Map Application",
    tagline: "Interactive mapping and geospatial analysis for your location data.",
    desc: "A geospatial mapping platform for visualizing, editing, and analyzing location-based data. Built for teams that need custom map layers, geofencing, and spatial queries beyond off-the-shelf map tools.",
    url: "https://gis-map-application.evoletrix.com",
    accent: "linear-gradient(135deg, #0ea5e9, #0369a1)",
    icon: "map",
    image: "",
    // TODO: verify with team
    features: [
      "Custom map layers & overlays",
      "Geofencing & spatial queries",
      "Shapefile / raster data import",
      "Offline caching for field use"
    ],
    // TODO: verify with team (cleared for now — see file header)
    stack: []
  },
  {
    key: "record-management",
    name: "Record Management System",
    tagline: "Centralized, access-controlled records with a full audit trail.",
    desc: "A centralized system for storing, organizing, and retrieving organizational records with role-based access control. Built for teams that need structured document workflows and audit trails.",
    url: "https://record-management-system.evoletrix.com",
    accent: "linear-gradient(135deg, #64748b, #334155)",
    icon: "folder",
    image: "",
    // TODO: verify with team
    features: [
      "Role-based access control",
      "Full audit trail",
      "Document versioning",
      "Search & tagging"
    ],
    // TODO: verify with team (cleared for now — see file header)
    stack: []
  },
  {
    key: "university-management",
    name: "University Management System",
    tagline: "Admissions, scheduling, and academic records in one place.",
    desc: "An administrative platform covering admissions, course scheduling, attendance, and academic records. Built for universities and colleges coordinating operations across multiple departments.",
    url: "https://university-management-system.evoletrix.com",
    accent: "linear-gradient(135deg, #eab308, #a16207)",
    icon: "cap",
    image: "",
    // TODO: verify with team
    features: [
      "Admissions & enrollment tracking",
      "Course scheduling",
      "Attendance management",
      "Academic records & transcripts"
    ],
    // TODO: verify with team (cleared for now — see file header)
    stack: []
  },
  {
    key: "hospital-management",
    name: "Hospital Management System",
    tagline: "Patient records, appointments, and billing for care teams.",
    desc: "A platform for managing patient records, appointments, billing, and department workflows. Built for hospitals and clinics coordinating care across multiple departments.",
    url: "https://hospital-management-system.evoletrix.com",
    accent: "linear-gradient(135deg, #ef4444, #b91c1c)",
    icon: "hospital",
    image: "",
    // TODO: verify with team
    features: [
      "Patient record management",
      "Appointment scheduling",
      "Billing & invoicing",
      "Department-wise workflows"
    ],
    // TODO: verify with team (cleared for now — see file header)
    stack: []
  },
  {
    key: "ai-chatbots",
    name: "AI Chatbots",
    tagline: "Custom AI assistants for support and guided workflows.",
    desc: "Custom conversational AI assistants integrated into websites or internal tools to handle support queries and guided workflows. Built for businesses that want automated, context-aware customer interaction.",
    url: "https://ai-chatbots.evoletrix.com",
    accent: "linear-gradient(135deg, #14b8a6, #0f766e)",
    icon: "chat",
    image: "",
    // TODO: verify with team
    features: [
      "Custom conversation flows",
      "Website & internal tool integration",
      "Context-aware responses",
      "Handoff to human support"
    ],
    // TODO: verify with team (cleared for now — see file header)
    stack: []
  }
]
