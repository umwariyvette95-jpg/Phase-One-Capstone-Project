/**
 * utils.js
 * ─────────────────────────────────────────
 * Reusable helper / utility functions used
 * across the Book Explorer application.
 *
 * Exports:
 *   createBookCard(book, options)   → builds a book card HTML element
 *   getNoCoverHTML()                → returns placeholder SVG HTML
 *   showToast(message, type)        → shows a brief notification
 *   debounce(fn, delay)             → throttles rapid function calls
 *   sanitizeHTML(str)               → prevents XSS in dynamic content
 *   updateFavBadge(count)           → refreshes the favorites count badge
 */

import { isFavorite } from "./favorites.js";

/* ─── Book Card ──────────────────────────────────────────────────── */

/**
 * createBookCard()
 * ─────────────────
 * Builds and returns a complete <article> DOM element for a book.
 *
 * @param {Object} book    - Normalized book object (from fetchBooks.js)
 * @param {Object} options - Config flags:
 *   @param {boolean}  options.showRemove  - Show "Remove" instead of "Add to Favorites"
 *   @param {Function} options.onFavorite  - Called when favorite button is clicked
 *   @param {Function} options.onRemove    - Called when remove button is clicked
 *
 * @returns {HTMLElement} The fully built book card element
 */
export function createBookCard(book, options = {}) {
  const { showRemove = false, onFavorite, onRemove } = options;

  // Check if this book is already favorited (for button state)
  const alreadyFavorited = isFavorite(book.id);

  // Create the card wrapper
  const card = document.createElement("article");
  card.className = "book-card";
  card.setAttribute("role", "listitem");
  card.dataset.bookId = book.id;

  // Build the inner HTML
  card.innerHTML = `
    <div class="book-card-img-wrap">
      ${
        book.coverUrl
          ? `<img
               class="book-card-img"
               src="${sanitizeHTML(book.coverUrl)}"
               alt="Cover of ${sanitizeHTML(book.title)}"
               loading="lazy"
               onerror="this.parentElement.innerHTML = window.getNoCoverHTML()"
             />`
          : getNoCoverHTML()
      }
    </div>

    <div class="book-card-body">
      <h3 class="book-card-title" title="${sanitizeHTML(book.title)}">
        ${sanitizeHTML(book.title)}
      </h3>
      <p class="book-card-author">by ${sanitizeHTML(book.author)}</p>
      ${book.year ? `<p class="book-card-year">${book.year}</p>` : ""}

      ${
        showRemove
          ? `<button class="btn-remove" aria-label="Remove ${sanitizeHTML(book.title)} from favorites">
               <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                 <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
               </svg>
               Remove
             </button>`
          : `<button
               class="btn-favorite ${alreadyFavorited ? "favorited" : ""}"
               aria-label="${alreadyFavorited ? "Already in favorites" : "Add to favorites"}"
               ${alreadyFavorited ? "disabled" : ""}
             >
               <svg width="14" height="14"
                 fill="${alreadyFavorited ? "currentColor" : "none"}"
                 stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
               </svg>
               ${alreadyFavorited ? "Saved" : "Add to Favorites"}
             </button>`
      }
    </div>
  `;

  // ── Attach event listeners ──────────────────────────────────────
  if (showRemove) {
    const removeBtn = card.querySelector(".btn-remove");
    removeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      onRemove?.(book);
    });
  } else {
    const favBtn = card.querySelector(".btn-favorite");
    favBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!alreadyFavorited) {
        onFavorite?.(book);
      }
    });
  }

  return card;
}

/**
 * getNoCoverHTML()
 * ─────────────────
 * Returns SVG placeholder HTML for books without a cover image.
 */
export function getNoCoverHTML() {
  return `
    <div class="book-card-no-cover">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
      No Cover
    </div>`;
}

// Make globally accessible for onerror handlers in HTML strings
window.getNoCoverHTML = getNoCoverHTML;

/* ─── Toast Notifications ────────────────────────────────────────── */

let toastTimeout = null;

/**
 * showToast()
 * ─────────────
 * Displays a brief notification message at the bottom-right corner.
 *
 * @param {string} message - The text to display
 * @param {'default'|'success'|'warning'|'error'} type - Visual style
 */
export function showToast(message, type = "default") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `toast ${type}`;

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("show"));
  });

  // Clear existing timeout if toast is already visible
  if (toastTimeout) clearTimeout(toastTimeout);

  // Auto-hide after 3 seconds
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* ─── Debounce ───────────────────────────────────────────────────── */

/**
 * debounce()
 * ──────────
 * Wraps a function so it only fires after the user
 * has stopped calling it for `delay` milliseconds.
 * Useful for search inputs to avoid firing on every keystroke.
 *
 * @param {Function} fn    - The function to debounce
 * @param {number}   delay - Wait time in ms (default 300)
 * @returns {Function} The debounced version
 */
export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ─── XSS Protection ─────────────────────────────────────────────── */

/**
 * sanitizeHTML()
 * ──────────────
 * Escapes special HTML characters to prevent XSS attacks
 * when inserting dynamic content (book titles, author names, etc.)
 *
 * @param {string} str - Raw string that might contain HTML characters
 * @returns {string} Safe escaped string
 */
export function sanitizeHTML(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#39;");
}

/* ─── Favorites Badge ────────────────────────────────────────────── */

/**
 * updateFavBadge()
 * ─────────────────
 * Updates the number shown in the favorites count badge
 * in the navbar. Hides the badge when count is 0.
 *
 * @param {number} count - Current number of favorites
 */
export function updateFavBadge(count) {
  const badges = document.querySelectorAll(".fav-badge");
  badges.forEach((badge) => {
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0);
  });
}
