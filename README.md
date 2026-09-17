# 🏎️ AI Porsche 3D Showroom Configurator

<div align="center">
  <img width="1200" height="475" alt="Showroom Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />

  <h3>Next-Generation Luxury Automotive Pavilion powered by Google Gemini 2.5 Flash & Three.js WebGL</h3>

  [![AI Studio App](https://img.shields.io/badge/Google_AI_Studio-App_Live-4285F4?style=for-the-badge&logo=google)](https://ai.studio/apps/305506ea-f56b-4964-ae5b-374a6f6bdd9a)
  [![GitHub Repo](https://img.shields.io/badge/GitHub-AIPORSCHE-181717?style=for-the-badge&logo=github)](https://github.com/ridhijain709/AIPORSCHE)
  [![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
  [![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
  [![Gemini 2.5 Flash](https://img.shields.io/badge/Gemini-2.5_Flash-orange?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
</div>

---

## 🌟 Overview

**AI Porsche Showroom Configurator** is an enterprise-grade, immersive 3D automotive experience built with **Three.js** and orchestrated in real time by **Google Gemini 2.5 Flash** using bidirectional voice and structured **Tool Calling (Function Calling)**.

Originally developed in [Google AI Studio](https://ai.studio/apps/305506ea-f56b-4964-ae5b-374a6f6bdd9a) and synchronized with this repository, the application bridges conversational voice intelligence directly with WebGL graphics to allow customers to inspect, customize, and configure bespoke sports cars simply by speaking.

---

## ✨ Key Features

### 1. 🏎️ Photorealistic 3D Showroom Fleet
- **Multi-Car Inventory**: Seamlessly switch between the **Porsche 911 Carrera GTS**, track-focused **911 GT3 RS**, and all-electric **Taycan Turbo GT**.
- **Interactive Mechanical Features**:
  - Deployable active aero rear spoiler wing
  - Matrix LED projector headlights
  - Articulating doors
  - Exploded engineering inspection view (chassis & engine separation)
- **Studio Lighting & Reflections**: HDRI softbox lighting, real-time shadow casting, floor turntable rotation, and glossy clearcoat reflections.

### 2. 🎙️ Conversational Voice Agent ("Alex")
- **Gemini 2.5 Flash Integration**: Real-time natural language comprehension of complex automotive terminology, Porsche heritage (Weissach, Zuffenhausen), and mechanical specs.
- **Bi-directional Function Calling**:
  - `configure_vehicle`: Mutates paint (hex + lacquer/matte/metallic finish), rim styles, caliper colors, and interior leather upholstery.
  - `set_camera_view`: Smooth cinematic camera transitions to focal points (`hero`, `engine`, `wheel_detail`, `cockpit`, `front`, `side`, `rear`).
  - `toggle_feature`: Opens doors, engages active spoiler, turns on headlights, or triggers exploded view.
  - `switch_model`: Changes vehicle model on the turntable dynamically.
- **Offline / Local Fallback**: Deterministic natural language processor ensures the showroom remains 100% testable even without an active API key.

### 3. 👔 Enterprise Dealership Suite & CRM
- **3D Store Owner AI Avatar & VIP Clients**: Interactive showroom avatars including dealership leadership and client personas (*Silicon Valley Tech Founder*, *Nürburgring Track Enthusiast*, *Luxury Heritage Collector*).
- **Automated Intelligence**: Real-time MSRP calculation, options ticker, PDF build quotation generation, and financing estimation.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v20+ recommended) or **Bun**

### 1. Clone the Repository
```bash
git clone https://github.com/ridhijain709/AIPORSCHE.git
cd AIPORSCHE
```

### 2. Install Dependencies
```bash
npm install
# or
bun install
```

### 3. Set Up Your API Key
Copy the example environment file:
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your Google Gemini API key:
```env
GEMINI_API_KEY=AIzaSy...
```
*(Get your free developer key at [aistudio.google.com](https://aistudio.google.com/app/apikey) — zero credit card required).*

### 4. Run Locally
```bash
npm run dev
# or
bun dev
```
Open your browser at **`http://localhost:3000`** (or the port displayed in your terminal).

---

## 🛠️ Architecture & Tech Stack

```
[ Customer Voice / Chat Input ]
               │
               ▼
   [ Web Speech Recognition ]
               │
               ▼
[ Express Server / Gemini 2.5 Flash ]
   ├──> System Persona ("Alex" Showroom Concierge)
   └──> Structured Tool Declarations:
          - configure_vehicle({ colorHex, finishType, rimColorHex, ... })
          - set_camera_view({ viewPreset })
          - toggle_feature({ feature, state })
          - switch_model({ modelId })
               │
               ▼
[ React 19 + Three.js WebGL Canvas ]
   ├──> Instant Mesh & Material Mutation
   ├──> Cinematic Camera Interpolation
   └──> Real-time Audio Feedback (Engine Rev, Hydraulic Aero)
```

- **Frontend**: React 19, Vite 6, Tailwind CSS, Lucide Icons, Motion
- **3D Graphics**: Three.js WebGL, OrbitControls, PCFSoftShadowMap
- **AI / LLM**: `@google/genai` (Gemini 2.5 Flash), Google AI Studio
- **Backend / Server**: Express 4, tsx, Node.js

---

## 📄 License & Attribution

- Built with [Google AI Studio](https://ai.studio/apps/305506ea-f56b-4964-ae5b-374a6f6bdd9a).
- Maintained by [@ridhijain709](https://github.com/ridhijain709).
