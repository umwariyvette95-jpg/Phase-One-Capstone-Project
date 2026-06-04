
const STORAGE_KEY = "bookExplorer_favorites";


export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}


function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}


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


export function removeFavorite(id) {
  const favorites = getFavorites();
  const filtered  = favorites.filter((fav) => fav.id !== id);

  if (filtered.length === favorites.length) {
    return false; // Nothing was removed
  }

  saveFavorites(filtered);
  return true;
}


export function isFavorite(id) {
  return getFavorites().some((fav) => fav.id === id);
}


export function clearFavorites() {
  localStorage.removeItem(STORAGE_KEY);
}