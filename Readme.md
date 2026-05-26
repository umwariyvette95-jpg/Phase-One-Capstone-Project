# 📚 Book Explorer

A responsive, interactive, and API-powered book browsing web application.

## Project Structure

```
book-explorer/
├── index.html              ← Homepage (search + book grid)
├── favorites.html          ← Saved favorites page
├── about.html              ← About page
├── css/
│   └── style.css           ← Custom styles (complements Tailwind)
├── js/
│   ├── app.js              ← Main logic (rendering, search, DOM)
│   ├── favorites.js        ← Favorites module (localStorage)
│   ├── favorites-page.js   ← Favorites page logic (remove, clear all)
│   ├── fetchBooks.js       ← Open Library API module
│   ├── hamburger.js        ← Mobile menu toggle
│   └── utils.js            ← Reusable helpers
└── assets/
    ├── images/
    └── icons/
```

## How to Run

> **Important:** Because this app uses ES6 modules (`type="module"`), it must be served from a local server — not opened directly as a file in the browser.

### Option 1 — VS Code Live Server (recommended)
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `index.html` → **Open with Live Server**

### Option 2 — Python
```bash
python3 -m http.server 8080
# Then open: http://localhost:8080
```

### Option 3 — Node.js
```bash
npx serve .
```

## Labs Covered

| Lab | Topic | Exercises |
|-----|-------|-----------|
| **Lab 1** | Responsive Multi-Page Layouts | Navbar, Hero, Responsive Grid, Mobile-First Design |
| **Lab 2** | DOM Interactivity & JS Modules | Favorites Page, Modular Code, DOM Events, localStorage |
| **Lab 3** | Async JavaScript & API Integration | API Module, Populate Homepage, Search, Loading States |

## API


Uses the free [Open Library Search API](https://openlibrary.org/developers/api):

```
GET https://openlibrary.org/search.json?title={query}&limit=20
```

No API key required.

## Features

- 🔍 **Search** books by title (Open Library API)
- ❤️ **Add/Remove Favorites** with one click
- 💾 **Persistent favorites** via `localStorage`
- ⚡ **ES6 Modules** — clean, modular code
- 🔄 **Loading & empty states** for great UX
- 🍞 **Toast notifications** for user feedback

## JavaScript Module Map

| File | Responsibility |
|------|---------------|
| `app.js` | Homepage entry point — renders books, handles search |
| `fetchBooks.js` | All Open Library API calls, normalizes book data |
| `favorites.js` | Read/write favorites to `localStorage` |
| `favorites-page.js` | Favorites page — renders saved books, remove, clear all |
| `utils.js` | `createBookCard`, `showToast`, `sanitizeHTML`, `updateFavBadge` |
| `hamburger.js` | Mobile nav toggle, loaded as a plain script on every page |

## How the Modules Connect

```
index.html
  └── app.js
        ├── fetchBooks.js   (fetchDefaultBooks, fetchBooksByTitle)
        ├── favorites.js    (addFavorite, getFavorites)
        └── utils.js        (createBookCard, showToast, updateFavBadge)

favorites.html
  └── favorites-page.js
        ├── favorites.js    (getFavorites, removeFavorite, clearFavorites)
        └── utils.js        (createBookCard, showToast, updateFavBadge)

about.html
  └── inline module
        ├── favorites.js    (getFavorites)
        └── utils.js        (updateFavBadge)
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic page structure |
| CSS3 + Tailwind CDN | Layout and styling |
| Vanilla JavaScript (ES6) | Modules, async/await, DOM |
| Open Library API | Free book data, no key needed |
| localStorage | Client-side favorites persistence |

## Notes

- No build tools or package manager needed — just open with a local server.
- Favorites are stored per browser; clearing `localStorage` resets them.
- Book cover images are loaded from `covers.openlibrary.org` in medium size (`-M.jpg`).
