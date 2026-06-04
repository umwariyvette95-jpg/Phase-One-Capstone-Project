
const API_BASE = "https://openlibrary.org/search.json";

// How many books to request per query
const RESULTS_LIMIT = 20;


export async function fetchBooksByTitle(query) {
  const url = `${API_BASE}?title=${encodeURIComponent(query)}&limit=${RESULTS_LIMIT}&fields=key,title,author_name,first_publish_year,cover_i,isbn`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return (data.docs || []).map(normalizeBook);
}


export async function fetchDefaultBooks() {
  const url = `${API_BASE}?q=classic+literature&limit=${RESULTS_LIMIT}&fields=key,title,author_name,first_publish_year,cover_i,isbn`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load default books: ${response.status}`);
  }

  const data = await response.json();
  return (data.docs || []).map(normalizeBook);
}


function normalizeBook(doc) {
  return {
    // Unique identifier (e.g. "/works/OL45804W")
    id: doc.key || "",

    // Book title – fallback to "Unknown Title"
    title: doc.title || "Unknown Title",

    // Authors – API returns an array; join with commas
    author: doc.author_name ? doc.author_name.join(", ") : "Unknown Author",

    // First year the book was published
    year: doc.first_publish_year || null,

    // Cover image URL — Open Library uses numeric cover IDs
    // Size options: S (small), M (medium), L (large)
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,

    // ISBN (first one in the list, if available)
    isbn: doc.isbn ? doc.isbn[0] : null,
  };
}