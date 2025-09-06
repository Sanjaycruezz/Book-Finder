import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    setBooks([]);
    try {
      const res = await fetch(
  `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
);

      const data = await res.json();
      if (data.docs.length === 0) {
        setError("No books found.");
      } else {
        setBooks(data.docs.slice(0, 10)); // limit to 10 results
      }
    } catch (err) {
      setError("Failed to fetch books. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">📚 Book Finder</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 rounded-lg border w-72 shadow"
        />
        <button
          onClick={searchBooks}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="w-full max-w-xl space-y-4">
        {books.map((book, index) => (
          <li
            key={index}
            className="p-4 bg-white rounded-lg shadow flex items-center gap-4"
          >
            <img
              src={
                book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "https://via.placeholder.com/80x120.png?text=No+Cover"

              }
              alt={book.title}
              className="w-20 h-28 object-cover rounded"
            />
            <div>
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-gray-600">
                Author: {book.author_name ? book.author_name.join(", ") : "N/A"}
              </p>
              <p className="text-gray-500">First Published: {book.first_publish_year || "N/A"}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
