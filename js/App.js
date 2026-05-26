// Lab 4 branch update

// ── ES6 Module Imports ────────────────────────────────────────────
import { fetchBooksByTitle, fetchDefaultBooks } from "./fetchBooks.js";
import { addFavorite, getFavorites }            from "./favorites.js";
import { createBookCard, showToast, debounce, updateFavBadge } from "./utils.js";

// ── DOM References ────────────────────────────────────────────────
const booksGrid     = document.getElementById("books-grid");
const searchInput   = document.getElementById("search-input");
const searchBtn     = document.getElementById("search-btn");
const resultHeading = document.getElementById("result-heading");

// ── App State ─────────────────────────────────────────────────────
let currentBooks = [];


 
 * @param {Array} books - Array of normalized book objects
 */
function renderBooks(books) {
  currentBooks = books;
  booksGrid.innerHTML = "";

  if (!books || books.length === 0) {
    renderEmptyState();
    return;
  }

  books.forEach((book) => {
    const card = createBookCard(book, {
      showRemove: false,
      onFavorite: handleAddFavorite,
    });
    booksGrid.appendChild(card);
  });
}


function renderLoadingState() {
  booksGrid.innerHTML = `
    <div class="state-container">
      <div class="spinner" role="status" aria-label="Loading books"></div>
      <p class="state-title">Loading Books…</p>
      <p class="state-subtitle">Fetching titles from Open Library</p>
    </div>
  `;
}


function renderEmptyState() {
  booksGrid.innerHTML = `
    <div class="state-container">
      <svg width="64" height="64" fill="none" stroke="#d1cdc6" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        <path d="M12 8v4M12 16h.01" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <p class="state-title">No Results Found</p>
      <p class="state-subtitle">Try a different title or keyword</p>
    </div>
  `;
}


 * @param {string} message - Error description
 */
function renderErrorState(message) {
  booksGrid.innerHTML = `
    <div class="state-container">
      <svg width="64" height="64" fill="none" stroke="#c0392b" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4M12 16h.01" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <p class="state-title">Something Went Wrong</p>
      <p class="state-subtitle">${message || "Could not load books. Please try again."}</p>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════════════
   SEARCH
   ══════════════════════════════════════════════════════════════════ */
async function performSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    showToast("Please enter a book title to search.", "warning");
    searchInput.focus();
    return;
  }

  if (resultHeading) {
    resultHeading.textContent = `Results for "${query}"`;
  }

  renderLoadingState();

  try {
    const books = await fetchBooksByTitle(query);
    renderBooks(books);
  } catch (error) {
    console.error("Search failed:", error);
    renderErrorState("Could not connect to Open Library. Check your connection.");
  }
}

/* ══════════════════════════════════════════════════════════════════
   FAVORITES
   ══════════════════════════════════════════════════════════════════ */

 * @param {Object} book - The book object to save
 */
function handleAddFavorite(book) {
  const added = addFavorite(book);

  if (added) {
    showToast(`"${book.title}" added to favorites!`, "success");

    // Update the button in the card to show "Saved"
    const card = booksGrid.querySelector(`[data-book-id="${CSS.escape(book.id)}"]`);
    if (card) {
      const btn = card.querySelector(".btn-favorite");
      if (btn) {
        btn.classList.add("favorited");
        btn.disabled = true;
        btn.innerHTML = `
          <svg width="14" height="14" fill="currentColor" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Saved
        `;
      }
    }

    // Refresh the navbar badge count
    updateFavBadge(getFavorites().length);
  } else {
    showToast("Already in your favorites.", "warning");
  }
}

/* ══════════════════════════════════════════════════════════════════
   INITIALIZATION
   ══════════════════════════════════════════════════════════════════ */


async function init() {
  // ── Event Listeners ─────────────────────────────────────────
  searchBtn?.addEventListener("click", performSearch);

  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") performSearch();
  });

  // ── Category Filter Buttons ──────────────────────────────────
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    // Set active state
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const query = btn.dataset.query;

    if (resultHeading) {
      resultHeading.textContent = btn.textContent.replace(/^\S+\s/, "") + " Books";
    }

    renderLoadingState();

    try {
      const books = await fetchBooksByTitle(query);
      renderBooks(books);
    } catch (error) {
      renderErrorState("Could not load books. Check your connection.");
    }
  });
});

  
  // ── Update favorites badge ───────────────────────────────────
  updateFavBadge(getFavorites().length);

  // ── Load Default Books ───────────────────────────────────────
  renderLoadingState();

  try {
    const books = await fetchDefaultBooks();
    renderBooks(books);

    if (resultHeading) {
      resultHeading.textContent = "Featured Books";
    }
  } catch (error) {
    console.error("Failed to load default books:", error);
    renderErrorState("Could not load books. Please check your internet connection.");
  }
}

// ── Boot the app when the DOM is fully loaded ─────────────────────
document.addEventListener("DOMContentLoaded", init);
