

import { getFavorites, removeFavorite, clearFavorites } from "./favorites.js";
import { createBookCard, showToast, updateFavBadge }    from "./utils.js";

// ── DOM References ────────────────────────────────────────────────
const favoritesGrid = document.getElementById("favorites-grid");
const clearAllBtn   = document.getElementById("clear-all-btn");
const favCount      = document.getElementById("fav-count");
const gridSection   = document.getElementById("grid-section");
const emptySection  = document.getElementById("empty-section");

function renderFavorites() {
  const favorites = getFavorites();

  // Update the "X books saved" counter
  if (favCount) {
    favCount.textContent = `${favorites.length} book${favorites.length !== 1 ? "s" : ""} saved`;
  }

  // Update navbar badge
  updateFavBadge(favorites.length);

  // Toggle grid vs. empty state visibility
  if (favorites.length === 0) {
    gridSection?.classList.add("hidden");
    emptySection?.classList.remove("hidden");
    return;
  }

  gridSection?.classList.remove("hidden");
  emptySection?.classList.add("hidden");

  // Clear the grid before re-rendering
  if (favoritesGrid) favoritesGrid.innerHTML = "";

  // Render a card for each saved book
  favorites.forEach((book) => {
    const card = createBookCard(book, {
      showRemove: true,
      onRemove:   handleRemoveFavorite,
    });
    favoritesGrid?.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════════════════════
   EVENT HANDLERS
   ══════════════════════════════════════════════════════════════════ */


function handleRemoveFavorite(book) {
  const removed = removeFavorite(book.id);

  if (removed) {
    showToast(`"${book.title}" removed from favorites.`, "warning");
    renderFavorites(); // Re-render the updated list
  }
}


function handleClearAll() {
  const favorites = getFavorites();

  if (favorites.length === 0) return;

  // Simple confirmation before destructive action
  const confirmed = window.confirm(
    `Remove all ${favorites.length} book${favorites.length !== 1 ? "s" : ""} from your favorites?`
  );

  if (!confirmed) return;

  clearFavorites();
  showToast("All favorites cleared.", "warning");
  renderFavorites();
}

/* ══════════════════════════════════════════════════════════════════
   INITIALIZATION
   ══════════════════════════════════════════════════════════════════ */


function init() {
  // Wire up the Clear All button
  clearAllBtn?.addEventListener("click", handleClearAll);

  // Render the favorites grid on page load
  renderFavorites();
}

document.addEventListener("DOMContentLoaded", init);
