# 🎧 Podcast Explorer | DJS05 Project

A responsive React web application that allows users to browse, search, and explore podcasts.  
Each podcast links to its own detailed page with show information, seasons, and episodes fetched dynamically from an external API.

---

## 🚀 Features

### 🧭 Dynamic/ Routing

Each podcast card links to a dedicated show detail page using **React Router** for seamless navigation.

### ⏳ Loading, Error & Empty States

Provides clear visual feedback when data is loading, when an error occurs, or when no episodes are available.

### 🎧 Show Detail Page

Displays a show’s **title**, **cover image**, **description**, **genres**, **last updated date**, **number of seasons**, and **total episodes**.

### 🔄 Season Navigation

Users can switch between seasons using an intuitive dropdown menu positioned on the right-hand side.

### 📑 Episode List

Each season displays its episodes with:

- Episode number
- Episode title
- Shortened description
- Season cover thumbnail

### 🧩 Reusable Components

Built with modular and reusable components (`ShowDetail`, `EpisodeCard`, `SeasonNav`, etc.) for cleaner architecture and scalability.

### 🏷️ Back Navigation

A **“← Back”** link allows users to return to the homepage while maintaining their previous filters and search state using `useSearchParams`.

### 🖼️ Polished UI

Features a modern, grid-based layout, clean typography, and accessible color contrast.

### 📱 Fully Responsive

Designed to adapt smoothly across different screen sizes — from mobile devices to large desktops.

---

## 🛠️ Technologies Used

- **React 18** (with Vite + ES Modules)
- **React Router DOM v6**
- **JavaScript (ES2020+)**
- **CSS Grid / Flexbox**
- **Vite** for development and build
- **JSDoc** for documentation

---

## ⚙️ How It Works

1. The **homepage** lists podcast shows in a grid layout.
2. Users can filter shows by genre or search by title.
3. Selecting a show navigates to `/show/:id` and dynamically fetches its details.
4. While fetching data, a loading spinner is shown.
5. If an error occurs, an error message is displayed.
6. Once loaded, the show detail page displays:
   - Cover image and title
   - Description and genres
   - Metadata: Last Updated, Total Seasons, Total Episodes
7. A dropdown allows the user to switch between available seasons.
8. The **Back** button preserves the homepage search and filters.

---

## 💡 Example User Flows

- Click **a podcast show tile** → loads detailed show info, genres, and seasons.
- Use the **season dropdown** → changes to another season instantly.
- Disconnect your internet → displays an error message gracefully.
- If a season has no episodes → displays “No episodes available.”
- Click **“← Back”** → returns to the homepage with filters and scroll position preserved.

These behaviors demonstrate dynamic routing, data persistence, and an optimized user experience aligned with the **DJS05** learning outcomes.

---

## 🧪 Setup Instructions

### Installation

```bash
npm install
npm run dev
```

## 🔌 API

- **Base URL:** `https://podcast-api.netlify.app`
- **Endpoints:**
  - `/` — Podcast shows
  - `/id/:id` — Show details and episodes

---
