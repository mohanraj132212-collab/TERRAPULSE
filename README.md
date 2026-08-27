# TerraPulse — Smart Plant Health Monitoring Platform

> **"Smart Monitoring. Healthier Plants. Better Harvests."**

TerraPulse is a complete, modern, production-grade agricultural technology web application designed to empower farmers with real-time environmental condition monitoring, camera-based optical leaf disease diagnosis, and automated email alert notifications.

---

## 🌟 Key Features

1. **Environmental Sensor Threshold Engine**
   - Live evaluation of **Temperature**, **Humidity**, **Soil pH**, and **Soil Moisture**.
   - Automatic status classification:
     - 🟢 **GOOD** (Optimal range)
     - 🟡 **WARNING** (Sub-optimal, action recommended)
     - 🔴 **CRITICAL** (Stress condition, immediate action required)
   - Dynamic **Health Score Index** (0–100%) and **Overall Plant Health** state (🟢 HEALTHY, 🟡 ATTENTION REQUIRED, 🔴 CRITICAL CONDITION).

2. **Optical Camera Leaf Scanner**
   - Camera integration using Browser `getUserMedia` API with automatic rear camera preference (`facingMode: "environment"`).
   - Viewfinder framing alignment guide and laser scanning animation overlay.
   - Fallback drag-and-drop file uploader for devices without cameras.

3. **Decoupled AI Disease Detection Engine**
   - Diagnostic knowledge base covering **Healthy Leaf**, **Leaf Spot**, **Powdery Mildew**, **Bacterial Leaf Blight**, **Early Blight**, **Late Blight**, **Rust**, and **Nutrient Deficiency**.
   - Returns structured diagnosis including confidence percentage, severity level, problem description, practical treatment solutions, and prevention guidelines.

4. **Automated Email Alert Notifications**
   - Client-side email notification service (`js/email-service.js`) dispatching instant email alerts to the user's registered inbox with diagnosis details and sensor telemetry snapshots.

5. **Scan History & Analytics Reports**
   - Firestore-backed history search and filtering by severity/disease.
   - HTML5 Canvas analytics charts (donuts breakdown & weekly trend bars) with CSV data export and PDF report printing.

6. **Responsive Design & Theme System**
   - Fully responsive desktop (Sidebar layout) and mobile (Bottom navigation bar).
   - Theme toggle (Light/Dark mode) with local storage persistence.

---

## 📁 Project Architecture

```text
TerraPulse/
├── index.html                  # Landing page
├── login.html                  # Sign in page
├── register.html               # Farmer account registration
├── verify-email.html           # Email activation screen
├── forgot-password.html        # Password reset
│
├── dashboard.html              # Farmer overview & live sensor sliders
├── monitoring.html             # Continuous environmental telemetry & activity log
├── camera.html                 # Viewfinder scanner & capture controls
├── disease-result.html         # Diagnostic report & treatment breakdown
├── history.html                # Scan repository & filters
├── reports.html                # Analytics charts & CSV/PDF exporter
├── profile.html                # User profile settings
├── settings.html               # Theme, email alert toggles & crop profiles
│
├── css/                        # Modular CSS stylesheets
│   ├── variables.css           # Color tokens & theme properties
│   ├── global.css              # Base styles, typography, buttons, toasts
│   ├── navbar.css              # Navigation bar styles
│   ├── sidebar.css             # Desktop sidebar & mobile bottom bar
│   ├── landing.css             # Landing hero & features
│   ├── auth.css                # Form styling & strength bar
│   ├── dashboard.css           # Sensor cards & circular gauge
│   ├── monitoring.css          # Telemetry stream & timeline
│   ├── camera.css              # Viewfinder & laser scan animation
│   ├── disease.css             # Diagnosis result layout
│   ├── history.css             # History grid & cards
│   ├── reports.css             # Analytics metrics & canvas chart containers
│   ├── profile.css             # Profile editor layout
│   ├── settings.css            # Preferences & toggle switches
│   └── responsive.css          # Media queries
│
├── js/                         # Modular ES6 JavaScript modules
│   ├── firebase-config.js      # Firebase SDK config & local storage store
│   ├── auth.js                 # Authentication state guard
│   ├── register.js             # Form validation & strength check
│   ├── login.js                # Sign-in logic
│   ├── email-verification.js   # Verification status
│   ├── forgot-password.js      # Password reset logic
│   ├── navigation.js           # Active link highlighter & theme loader
│   ├── sensor-data.js          # Centralized environmental threshold engine
│   ├── dashboard.js            # Dashboard UI & live slider listeners
│   ├── monitoring.js           # Live stream simulator & timeline feed
│   ├── camera.js               # Camera stream capture & file fallback
│   ├── disease-database.js     # Structured plant disease knowledge base
│   ├── disease-detection.js    # Decoupled analyzeLeaf() diagnostic engine
│   ├── disease-result.js       # Diagnosis report renderer & email trigger
│   ├── history.js              # History fetcher & search filter
│   ├── reports.js              # Canvas chart drawer & CSV exporter
│   ├── profile.js              # Profile update handler
│   ├── settings.js             # Theme & preference toggles
│   ├── firestore.js            # Firestore CRUD operations
│   ├── storage.js              # Firebase Storage uploader
│   ├── email-service.js        # Automated email alert dispatch service
│   ├── notifications.js        # Toast notification system
│   └── app.js                  # Application bootstrap entry point
│
└── assets/
    └── logo.png                # TerraPulse brand logo
```

---

## 🚀 How to Run Locally

1. Open `index.html` directly in any web browser or serve using a static web server (e.g. VS Code Live Server or `npx http-server`).
2. Navigate to `register.html` or `login.html` to enter the application.
3. Open `dashboard.html` to tweak environmental parameters via sliders and observe real-time health score calculations.
4. Open `camera.html` to test camera capture or upload a leaf image file to execute foliage disease analysis.
