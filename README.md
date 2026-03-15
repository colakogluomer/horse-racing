# 🏇 Horse Racing Simulator

A high-performance, real-time horse racing simulation built with **Vue 3**, **TypeScript**, and **Vuex**. This project features a procedural race engine, dynamic scheduling, and a responsive interface designed for both desktop and mobile enthusiasts.

---

## 🚀 Key Features

-   **Procedural Horse Generation**: Automatically creates a pool of 20 unique horses with randomized "condition" levels that directly impact their performance.
-   **Dynamic Race Program**: Generates a 6-round schedule with distances ranging from 1200m to 2200m.
-   **Real-time Simulation Engine**: Uses `requestAnimationFrame` for buttery-smooth 60fps animations, featuring realistic speed variations and finish-line photo detection.
-   **Persistent Tracking**: A robust Vuex-driven state machine tracks every race, ranking, and cumulative result across the entire program.
-   **Responsive Layout**: A modern "Dashboard" style UI with collapsible sidebars and mobile-first containerization.

## 🛠 Technical Stack

-   **Framework**: [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
-   **State Management**: [Vuex 4](https://vuex.vuejs.org/)
-   **Testing**: [Vitest](https://vitest.dev/) (Unit) & [Playwright](https://playwright.dev/) (E2E)
-   **Styling**: Vanilla CSS (Scoped)
-   **Deployment**: [Docker](https://www.docker.com/) + Nginx (Multi-stage build)

---

## 🚦 Getting Started

### Prerequisites
-   Node.js (v24 or higher recommended)
-   npm

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/horse-racing.git
    cd horse-racing
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Development
Start the Vite development server:
```bash
npm run dev
```

### Production Build
Generate optimized static assets:
```bash
npm run build
```

---

## 🐳 Docker Deployment

The application is containerized for production-grade reliability using a multi-stage Docker build.

1.  **Build and Run with Compose**:
    ```bash
    docker compose up -d --build
    ```
2.  **Access the App**:
    Navigate to `http://localhost:8080` in your browser.

---

## 🧪 Testing & Quality

We maintain high standards through automated testing and strict type checking.

-   **Unit Tests**: Verify store logic and component lifecycles.
    ```bash
    npm run test:unit
    ```
-   **E2E Tests**: Validate full user flows (program generation -> race completion).
    ```bash
    npx playwright install
    npm run test:e2e
    ```
-   **Type Check**:
    ```bash
    npm run type-check
    ```

---

## 📐 Architecture Overview

### Simulation Logic
The race logic is decoupled from the UI. Horses calculate their movement based on their intrinsic `condition` property combined with a "Current Round" multiplier and a per-frame random variation factor. This ensures that while condition matters, every race is unpredictable.

### State Management
The project follows a "Single Source of Truth" pattern using Vuex.
-   **State**: Stores the horse pool, round schedule, current race status, and historical rankings.
-   **Mutations/Actions**: Deterministic transitions for generating data, starting/pausing races, and logging results.

### Design Patterns
-   **Container/Presentational**: `HomeView` manages the layout and high-level data flow, while components like `RaceHorse` and `HorseList` focus on visual representation.
-   **Watcher-driven Animations**: The `RaceTrack` synchronizes its internal animation loop with the global `isRaceStarted` state via reactive watchers.
