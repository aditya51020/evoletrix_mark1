import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

// Contact Form Endpoint
app.post("/api/contact", (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: "Email is required" })
  }
  console.log(`Received contact/coffee chat request from: ${email}`)
  // In a real application, you would send an email or store in a database here.
  return res.status(200).json({ message: "Thank you! We will get in touch soon for a coffee chat." })
})

// Booking Calendar Endpoint
app.post("/api/booking", (req, res) => {
  const { name, email, date, time, message } = req.body
  if (!name || !email || !date || !time) {
    return res.status(400).json({ error: "Name, email, date, and time are required" })
  }
  console.log(`[BOOKING CONTEXT] Received calendar booking request:`)
  console.log(`  Name: ${name}`)
  console.log(`  Email: ${email}`)
  console.log(`  Date: ${date}`)
  console.log(`  Time: ${time}`)
  console.log(`  Message: ${message || "N/A"}`)
  return res.status(200).json({ message: "Booking confirmed successfully!" })
})

// Serve built static assets from Vite dist/ folder
app.use("/assets", express.static(path.join(__dirname, "dist/assets")))
app.use(express.static(path.join(__dirname, "dist"), { index: false }))

// Intercept root & fallbacks to inject SEO metadata dynamically before serving html
app.use((req, res, next) => {
  if (req.method !== "GET") return next()
  
  const indexHtmlPath = path.join(__dirname, "dist/index.html")
  
  if (!fs.existsSync(indexHtmlPath)) {
    // If not built yet, send a simple message or run in dev mode
    return res.send("Vite build not found. Please build the frontend first using 'npm run build'.")
  }

  let htmlContent = fs.readFileSync(indexHtmlPath, "utf8")

  const seoMetadata = `
    <!-- Primary Meta Tags -->
    <title>Evoletrix | Custom Web, iOS, AI & GIS Software Engineering</title>
    <meta name="title" content="Evoletrix | Custom Web, iOS, AI & GIS Software Engineering" />
    <meta name="description" content="Evoletrix Private Limited designs and engineers premium custom web applications, native iOS apps, custom AI integration, blockchain platforms, ERP systems, and high-accuracy geo-referencing (GIS) software." />
    <meta name="keywords" content="Evoletrix, Custom Software, Web Development, iOS Apps, AI Systems, Blockchain, ERP, Geo-referencing, GIS Mapping, Faridabad, Haryana, India" />
    <meta name="author" content="Evoletrix Private Limited" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.evoletrix.com/" />
    <meta property="og:title" content="Evoletrix | Custom Web, iOS, AI & GIS Software Engineering" />
    <meta property="og:description" content="Evoletrix Private Limited designs and engineers premium custom web applications, native iOS apps, custom AI integration, blockchain platforms, ERP systems, and high-accuracy geo-referencing (GIS) software." />
    <meta property="og:image" content="/placeholder-logo.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://www.evoletrix.com/" />
    <meta property="twitter:title" content="Evoletrix | Custom Web, iOS, AI & GIS Software Engineering" />
    <meta property="twitter:description" content="Evoletrix Private Limited designs and engineers premium custom web applications, native iOS apps, custom AI integration, blockchain platforms, ERP systems, and high-accuracy geo-referencing (GIS) software." />
    <meta property="twitter:image" content="/placeholder-logo.png" />

    <!-- Google Schema Graph (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Evoletrix Private Limited",
      "image": "/placeholder-logo.png",
      "description": "Premium custom software engineering consultancy specializing in Web, iOS, AI, Blockchain, ERP, and GIS georeferencing applications.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Faridabad",
        "addressRegion": "Haryana",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "",
        "contactType": "customer service",
        "email": "info@evoletrix.com"
      }
    }
    </script>
  `

  // Insert our SEO block into the placeholder
  htmlContent = htmlContent.replace("<!-- SEO_METAS_INSERT -->", seoMetadata)

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
  res.setHeader("Pragma", "no-cache")
  res.setHeader("Expires", "0")

  res.send(htmlContent)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Production server running at http://localhost:${PORT}`)
})
