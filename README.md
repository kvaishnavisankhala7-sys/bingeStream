# 🎬 BingeStream

A Netflix-inspired streaming platform UI built with React, Tailwind CSS v4, and the TMDB API. Features a rich browsing experience with dark/light theming, genre filtering, debounced search, infinite scroll, and a favorites system — all running on a mock data library with optional live TMDB integration.

---

## ✨ Features

- **Hero Banner** — Fullscreen featured movie with trailer CTA, metadata, and a smooth gradient overlay
- **Genre Rows** — Horizontally scrollable rows grouped by genre (Action, Drama, Sci-Fi, etc.)
- **Movies & TV Shows Pages** — Full grid browsing with infinite scroll and genre filter tags
- **Debounced Search** — Real-time search with a 500ms debounce, synced to URL query params
- **Movie Details Modal** — Expandable overlay with cast, ratings, and metadata
- **Favorites System** — Add/remove titles, persisted via `localStorage`
- **Dark / Light Theme** — Toggle between themes; dark is the default
- **Settings Panel** — Choose video quality (Auto, 480p, 720p, 1080p, 4K) and subtitle language
- **TMDB API Integration** — Drop in your own TMDB API key to switch from mock data to live results
- **Responsive Design** — Mobile-first layout with a hamburger drawer nav on small screens
- **Skeleton Loaders** — Smooth loading states across all grid and banner components

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| HTTP Client | Axios |
| Build Tool | Vite 8 |
| Data Source | Mock library + optional TMDB API |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── HeroBanner.jsx       # Fullscreen featured movie section
│   ├── GenreRow.jsx         # Horizontal scrollable genre row
│   ├── MovieCard.jsx        # Individual movie/show card
│   ├── MovieDetailsModal.jsx# Expandable details overlay
│   ├── Navbar.jsx           # Top nav with search, theme, settings
│   ├── FilterTags.jsx       # Genre filter pill buttons
│   ├── Skeleton.jsx         # Loading placeholder components
│   └── Footer.jsx
├── context/
│   ├── ThemeContext.jsx     # Dark/light theme state
│   ├── FavoritesContext.jsx # Favorites list with localStorage sync
│   └── SettingsContext.jsx  # Quality, subtitle, TMDB key state
├── pages/
│   ├── Home.jsx             # Landing page with hero + genre rows
│   ├── Movies.jsx           # Full movies grid with search & filters
│   ├── TVShows.jsx          # TV shows grid
│   └── Favorites.jsx        # Saved favorites grid
├── services/
│   ├── api.js               # TMDB API calls + mock data fallback
│   └── mockData.js          # Built-in movie/show library
└── index.css                # Tailwind v4 config + custom variants
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/bingestream.git
cd bingestream

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 TMDB API Key (Optional)

BingeStream ships with a built-in mock data library so it works out of the box — no API key needed.

To enable **live data** from The Movie Database:

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/)
2. Go to **Settings → API** and copy your API key
3. Open the app, click the ⚙️ settings icon in the navbar
4. Paste your key into the **TMDB API Connection** field

The app will instantly switch to live results. The key is saved to `localStorage` and persists across sessions.

---

## 🎨 Theming

The app uses a custom Tailwind v4 variant for light mode:

```css
/* index.css */
@custom-variant light-theme (.light-theme &);
```

The `light-theme` class is toggled on the root `<html>` element by `ThemeContext`. Dark mode is the default. To switch programmatically:

```js
const { isDark, toggleTheme } = useTheme();
```

---

## 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🙌 Credits

- Movie data and images provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Icons by [Lucide](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/)
