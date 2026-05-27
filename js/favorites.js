/**
 * favorites.js
 * ─────────────────────────────────────────
 * Lab 2 – Favorites Module
 * Manages the user's favorite books using localStorage.
 *
 * All favorites are stored as a JSON array under the key
 * "bookExplorer_favorites" in the browser's localStorage.
 *
 * Exports:
 *   getFavorites()         → returns the current favorites array
 *   addFavorite(book)      → adds a book, returns true if added
 *   removeFavorite(id)     → removes a book by id, returns true if removed
 *   isFavorite(id)         → returns boolean
 *   clearFavorites()       → removes all favorites
 */

const STORAGE_KEY = "bookExplorer_favorites";

/**
 * getFavorites()
 * ──────────────
 * Reads and returns the favorites array from localStorage.
 * Returns an empty array if nothing is saved yet.
 *
 * @returns {Array} Array of saved book objects
 */
export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * saveFavorites()
 * ───────────────
 * Internal helper — writes the favorites array to localStorage.
 *
 * @param {Array} favorites - The array to persist
 */
function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

/**
 * addFavorite()
 * ─────────────
 * Adds a book object to the favorites list.
 * Does nothing (returns false) if already favorited.
 *
 * @param {Object} book - Normalized book object from fetchBooks.js
 * @returns {boolean} true if added, false if already existed
 */
export function addFavorite(book) {
  const favorites = getFavorites();

  // Check for duplicates by id
  if (favorites.some((fav) => fav.id === book.id)) {
    return false;
  }

  favorites.push(book);
  saveFavorites(favorites);
  return true;
}

/**
 * removeFavorite()
 * ────────────────
 * Removes a book from favorites by its id.
 *
 * @param {string} id - The book's unique id (e.g. "/works/OL45804W")
 * @returns {boolean} true if removed, false if not found
 */
export function removeFavorite(id) {
  const favorites = getFavorites();
  const filtered  = favorites.filter((fav) => fav.id !== id);

  if (filtered.length === favorites.length) {
    return false; // Nothing was removed
  }

  saveFavorites(filtered);
  return true;
}

/**
 * isFavorite()
 * ────────────
 * Checks whether a book is already in the favorites list.
 *
 * @param {string} id - The book's unique id
 * @returns {boolean}
 */
export function isFavorite(id) {
  return getFavorites().some((fav) => fav.id === id);
}

/**
 * clearFavorites()
 * ────────────────
 * Removes ALL favorites from localStorage.
 */
export function clearFavorites() {
  localStorage.removeItem(STORAGE_KEY);
}