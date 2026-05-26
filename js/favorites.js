
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


 * @param {Array} favorites - The array to persist
 */
function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}


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


 * @param {string} id - The book's unique id (e.g. "/works/OL45804W")
 * @returns {boolean} true if removed, false if not found
 */
export function removeFavorite(id) {
  const favorites = getFavorites();
  const filtered  = favorites.filter((fav) => fav.id !== id);

  if (filtered.length === favorites.length) {
    return false; // Nothing was remove
  }

  saveFavorites(filtered);
  return true;
}



 * @param {string} id - The book's unique id
 * @returns {boolean}
 */
export function isFavorite(id) {
  return getFavorites().some((fav) => fav.id === id);
}

 
export function clearFavorites() {
  localStorage.removeItem(STORAGE_KEY);
}
