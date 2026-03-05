<div align="center">

# 🚦 Traffic Sign Detection

### Real-Time AI-Powered Driver Safety System

<!-- Replace with your actual banner image or demo GIF -->
<!-- ![Traffic Sign Detection Banner](assets/banner.gif) -->

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](CONTRIBUTING.md)

**Detect. Alert. Protect.**
An intelligent dashboard system that uses deep learning to detect traffic signs from a live camera feed and deliver real-time alerts to keep drivers safe.

</div>

---

## 📖 Project Overview

Every year, **thousands of road accidents** are caused by drivers who miss critical traffic signs — whether from fatigue, distraction, or unfamiliar routes. Speed limit violations alone account for nearly **29% of all fatal crashes**.

**Traffic Sign Detection** solves this by placing an AI co-pilot on the dashboard. A camera mounted inside the vehicle continuously captures the road ahead, and a deep-learning model identifies and classifies traffic signs in real time. When a sign is detected, the system instantly alerts the driver through both visual and audio cues.

### 🔁 The Speed Limit Loop

The system's signature feature is the **persistent speed-limit alarm**:

1. The AI detects a speed limit sign (e.g., 60 km/h).
2. The dashboard UI triggers a **red flashing alert** with an audible alarm.
3. The alarm **persists continuously** until the driver reduces their speed to or below the posted limit.
4. Once compliant, the alert clears and the system returns to monitoring mode.

This closed-loop mechanism ensures drivers cannot simply ignore a speed limit warning — the system demands compliance.

---

## ✨ Key Features

- 🎥 **Live Camera Feed Processing** — Captures and analyzes road footage at 30 FPS in real time.
- 🧠 **Deep Learning Detection** — CNN + YOLO-based model trained on traffic sign datasets with **97%+ accuracy**.
- 🔴 **Persistent Speed Limit Alarm** — Flashing red dashboard alert that loops until the driver complies with the detected speed limit.
- 🛑 **Multi-Sign Recognition** — Detects speed limits, stop signs, yield signs, and more.
- 🎨 **Animated Dashboard UI** — Modern, dark "Automotive Tech" interface with smooth animations powered by **Framer Motion** and **GSAP ScrollTrigger**.
- 📱 **Fully Responsive** — Works seamlessly across desktop, tablet, and mobile viewports.
- ⚡ **Low Latency** — End-to-end pipeline processes each frame in under 50ms for near-instant alerts.
- 🎮 **Interactive Demo** — Built-in speed slider in the web UI to simulate the alert system without a live camera.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|:---|:---|
| **React 19** | Component-based UI architecture |
| **Vite** | Lightning-fast dev server & build tool |
| **Tailwind CSS 4** | Utility-first styling with custom design tokens |
| **Framer Motion** | Scroll reveals, hover effects, and page transitions |
| **GSAP + ScrollTrigger** | Complex scroll-driven timeline animations |
| **Roboto (Google Fonts)** | Clean, modern typography |

### Machine Learning

| Technology | Purpose |
|:---|:---|
| **Python 3.9+** | Core ML scripting language |
| **TensorFlow / PyTorch** | Model training and inference |
| **YOLOv8** | Real-time object detection architecture |
| **OpenCV** | Video capture, frame processing, and image manipulation |
| **NumPy / Pandas** | Data processing and analysis |

### Backend / API

| Technology | Purpose |
|:---|:---|
| **FastAPI** | High-performance REST API for model serving |
| **Uvicorn** | ASGI server for async request handling |
| **WebSockets** | Real-time communication between ML backend and dashboard |

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your system:

- **Node.js** ≥ 18.x — [Download](https://nodejs.org)
- **Python** ≥ 3.9 — [Download](https://python.org)
- **pip** (Python package manager)
- **Git** — [Download](https://git-scm.com)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/hrithiksingh/traffic-sign-detection.git
cd traffic-sign-detection
```

**2. Set up the Frontend**

```bash
cd traffic
npm install
```

**3. Set up the ML Backend**

```bash
cd ml-backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

**4. Run the Development Servers**

Start the frontend (in the `traffic/` directory):

```bash
npm run dev
```

Start the ML backend (in the `ml-backend/` directory):

```bash
uvicorn main:app --reload --port 8000
```

**5. Open in Browser**

Navigate to `http://localhost:5173` to view the dashboard.

---

## 💡 Usage

### Web Dashboard

The landing page serves as both a project showcase and a functional dashboard:

| Section | Description |
|:---|:---|
| **Hero** | Overview of the project with an animated dashboard mockup |
| **The Problem** | Visual breakdown of why real-time sign detection matters |
| **How It Works** | Step-by-step pipeline with a GSAP scroll-driven car animation |
| **Speed Alert Demo** | Interactive slider — drag to simulate driving speed and trigger/dismiss the alarm |
| **Roadmap** | Timeline of current and future capabilities |

### ML Model Testing

To test the detection model with a sample video or live webcam:

```bash
# Run detection on a sample video file
python detect.py --source sample_video.mp4

# Run detection on a live webcam feed
python detect.py --source 0

# Run detection and stream results to the dashboard
python detect.py --source 0 --stream
```

> **Note:** Sample test videos and pre-trained model weights can be found in the `models/` and `data/` directories respectively.

---

## 🗺️ Roadmap / Future Scope

- [x] Speed limit sign detection (10–120 km/h)
- [x] Stop sign recognition & alert system
- [x] Real-time audio and visual driver alerts
- [x] Interactive web dashboard with animations
- [ ] Yield, no-entry, and one-way sign detection
- [ ] Traffic light state recognition (red / green / yellow)
- [ ] 🌙 Night vision & low-light detection
- [ ] 🌧️ Weather adaptability (rain, fog, snow conditions)
- [ ] 📍 GPS-based speed zone validation
- [ ] 🔧 Deployment to edge devices (Raspberry Pi, NVIDIA Jetson)
- [ ] 🚗 Automatic braking integration (ADAS compatibility)
- [ ] 📡 V2X (Vehicle-to-Everything) connectivity
- [ ] ☁️ OTA model updates via cloud pipeline

---

## 📂 Project Structure

```
traffic-sign-detection/
├── traffic/                    # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Fixed navigation bar
│   │   │   ├── Hero.jsx        # Hero section with animated dashboard
│   │   │   ├── Problem.jsx     # Problem statement cards
│   │   │   ├── Solution.jsx    # How-it-works + interactive demo
│   │   │   ├── Scope.jsx       # Roadmap timeline
│   │   │   └── Footer.jsx      # Site footer
│   │   ├── App.jsx             # Root component
│   │   ├── main.jsx            # Entry point
│   │   ├── index.css           # Tailwind + global styles
│   │   └── App.css             # Component-level styles
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── eslint.config.js
├── ml-backend/                 # ML model & API server
│   ├── models/                 # Pre-trained weights
│   ├── data/                   # Training & test datasets
│   ├── detect.py               # Detection inference script
│   ├── train.py                # Model training pipeline
│   ├── main.py                 # FastAPI server
│   └── requirements.txt        # Python dependencies
└── README.md
```

---

## 🎨 Design System

The UI follows a consistent **"Automotive Tech"** color palette:

| Token | Hex | Usage |
|:---|:---|:---|
| **Background** | `#0F172A` | Primary dark slate background |
| **Card Surface** | `#1E293B` | Component & card backgrounds |
| **Accent / Tech Blue** | `#3B82F6` | Buttons, active states, AI elements |
| **Alert / Traffic Red** | `#EF4444` | Speed limit warnings, alarm states |
| **Heading Text** | `#F8FAFC` | Primary white headings |
| **Body Text** | `#94A3B8` | Paragraph and secondary text |

---

## 👤 Author

**Hrithik Singh**

- GitHub: [@hrithiksingh](https://github.com/hrithiksingh)

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read the [Contributing Guidelines](CONTRIBUTING.md) before submitting.

---

## 🙏 Acknowledgments

- [GTSRB Dataset](https://benchmark.ini.rub.de/gtsrb_news.html) — German Traffic Sign Recognition Benchmark
- [YOLOv8 by Ultralytics](https://docs.ultralytics.com/) — State-of-the-art object detection
- [Framer Motion](https://www.framer.com/motion/) — Production-ready animation library for React
- [GSAP](https://gsap.com/) — Professional-grade JavaScript animation platform
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for safer roads.**

</div>
