import React, { useState } from "react";
import {
  fetchMovies,
  fetchMovieDetails,
  fetchMovieCredits,
  getPosterUrl,
} from "./tmdbApi";

/**
 * PUBLIC_INTERFACE
 * MysteryMovieBox
 * A vibrant, card-style game:
 * - Fetches a random movie from TMDb (filtered by Hollywood/Kollywood)
 * - Displays three hints: genre(s), top cast, a quote (overview fallback)
 * - Allows user to enter a guess, reveals answer and poster after submission
 * - User can play again with a new random movie
 * Styled for CineQuiz Duel theme.
 * 
 * @param {{
 *   industry: "hollywood"|"kollywood",
 *   accentColor: string,
 *   cardStyle?: object
 * }} props
 */
function MysteryMovieBox({ industry = "hollywood", accentColor = "#dffc03", cardStyle = {} }) {
  const [movie, setMovie] = useState(null);
  const [hints, setHints] = useState({ genre: "", actor: "", quote: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | ready | reveal
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");

  // PUBLIC_INTERFACE
  /** Loads a random movie & generates hints */
  async function openBox() {
    setStatus("loading");
    setMovie(null);
    setFeedback("");
    setGuess("");
    try {
      // TMDb filters: US/en for Hollywood, IN/ta for Kollywood
      const opts =
        industry === "kollywood"
          ? { with_original_language: "ta", region: "IN", sort_by: "popularity.desc" }
          : { with_original_language: "en", region: "US", sort_by: "popularity.desc" };
      // Multiple pages, pick random page from top 8, then a random movie in results
      const page = Math.max(1, Math.floor(Math.random() * 8 + 1));
      const listRes = await fetchMovies({ ...opts, page });
      const items = (listRes.results || []).filter(m => m.original_language === (industry === "kollywood" ? "ta" : "en"));
      if (!items.length) throw new Error("No movies found.");
      // Pick random movie
      const chosen = items[Math.floor(Math.random() * items.length)];
      // Fetch details and credits
      const [detail, credits] = await Promise.all([
        fetchMovieDetails(chosen.id, { language: "en-US" }),
        fetchMovieCredits(chosen.id)
      ]);
      // Derive hints
      const genre = (detail.genres && detail.genres.length)
        ? detail.genres.map(g => g.name).join(", ")
        : "Unknown";
      const actor = (credits.cast && credits.cast.length)
        ? credits.cast[0].name
        : "Unknown";
      const quote = detail.tagline?.trim()
        ? detail.tagline
        : (detail.overview?.trim() ? detail.overview : "No hint available.");
      setMovie(detail);
      setHints({ genre, actor, quote });
      setStatus("ready");
    } catch {
      setStatus("idle");
      setHints({ genre: "?", actor: "?", quote: "?" });
      setMovie(null);
      setFeedback("Could not load movie. Try again!");
    }
  }

  // PUBLIC_INTERFACE
  /** Compare user guess with movie title, show feedback */
  function handleGuess(e) {
    e.preventDefault();
    if (!guess || !movie) return;
    const sanitize = s => (s || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (sanitize(guess) === sanitize(movie.title)) {
      setFeedback("🎉 Correct! It's " + movie.title + ".");
      setStatus("reveal");
    } else {
      setFeedback("❌ Not quite. Try again or reveal!");
    }
  }

  /** Reveal the answer */
  function revealAnswer() {
    setStatus("reveal");
    setFeedback("");
  }

  /** Reset state for another try */
  function handleNext() {
    setStatus("idle");
    setMovie(null);
    setHints({ genre: "", actor: "", quote: "" });
    setGuess("");
    setFeedback("");
  }

  // Inline styles for vibrant quiz card
  const card = {
    background: "#fff",
    borderRadius: 15,
    boxShadow: "0 2px 16px #0001",
    padding: 20,
    maxWidth: 400,
    margin: "0 auto",
    ...cardStyle,
  };

  const accent = accentColor || "#dffc03";

  return (
    <div style={card}>
      {status === "idle" && (
        <button
          className="btn btn-large"
          style={{
            background: accent,
            color: "#212",
            fontWeight: 700,
            margin: "22px auto 8px auto",
            display: "block",
            letterSpacing: 1
          }}
          onClick={openBox}
          data-testid="mmb-open-btn"
        >
          Open Mystery Box
        </button>
      )}
      {status === "loading" && (
        <div style={{ textAlign: "center", padding: 18, color: accent, fontWeight: 700 }}>
          Loading movie...
        </div>
      )}
      {(status === "ready" || status === "reveal") && movie && (
        <div>
          {/* Hints Section */}
          <div style={{
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 10,
            color: accent,
            letterSpacing: 0.08
          }}>
            Hints:
          </div>
          <ul style={{ margin: "0 0 12px 0", paddingLeft: 20, fontSize: 14, color: "#252" }}>
            <li>
              <b>Genre:</b> {hints.genre}
            </li>
            <li>
              <b>Top Actor:</b> {hints.actor}
            </li>
            <li>
              <b>Quote:</b> <span style={{ fontStyle: "italic", color: "#888" }}>{hints.quote}</span>
            </li>
          </ul>
          {status === "ready" && (
            <form onSubmit={handleGuess} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 5 }}>
              <input
                type="text"
                className="input"
                placeholder="Your guess"
                value={guess}
                style={{
                  width: 130,
                  borderRadius: 7,
                  border: `1px solid ${accent}`,
                  padding: "8px 7px",
                  fontSize: 15
                }}
                onChange={e => setGuess(e.target.value)}
                autoFocus
                data-testid="mmb-guess-input"
                autoComplete="off"
              />
              <button
                type="submit"
                className="btn"
                style={{
                  background: accent,
                  color: "#212",
                  fontWeight: 600,
                  padding: "8px 18px"
                }}
                disabled={!guess}
                data-testid="mmb-guess-btn"
              >
                Guess
              </button>
              <button
                type="button"
                className="btn"
                onClick={revealAnswer}
                style={{
                  background: "#eee",
                  color: accent,
                  padding: "7px 14px",
                  fontWeight: 600,
                  border: `1.2px solid ${accent}`
                }}
                data-testid="mmb-reveal-btn"
              >
                Reveal
              </button>
            </form>
          )}
          {feedback && (
            <div
              style={{
                minHeight: 22,
                color: feedback.startsWith("🎉") ? "#1c8656" : accent,
                fontWeight: 700,
                fontSize: 14,
                margin: "5px 0 0"
              }}
              data-testid="mmb-feedback"
            >
              {feedback}
            </div>
          )}
          {/* Reveal section */}
          {status === "reveal" && (
            <div style={{
              marginTop: 13,
              padding: 9,
              background: "#f8faff",
              borderRadius: 11,
              textAlign: "center",
              boxShadow: "0 0 7px #0001"
            }}>
              <div style={{ color: accent, fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
                🎁 Answer: {movie.title}
              </div>
              {movie.poster_path && (
                <img
                  src={getPosterUrl(movie.poster_path, "w185")}
                  alt="Movie poster"
                  style={{
                    maxWidth: "60%",
                    maxHeight: 120,
                    margin: "7px auto 0",
                    borderRadius: 7,
                    boxShadow: "0 2px 10px #0002",
                    display: "block"
                  }}
                  data-testid="mmb-poster"
                />
              )}
              <div style={{ marginTop: 8, color: "#777", fontSize: 13 }}>
                Release Year: {movie.release_date ? movie.release_date.substring(0, 4) : "?"}
              </div>
              <button
                type="button"
                className="btn btn-large"
                style={{
                  margin: "18px auto 2px auto",
                  background: accent,
                  color: "#232",
                  fontWeight: 700
                }}
                onClick={handleNext}
                data-testid="mmb-next-btn"
              >
                Try Another!
              </button>
            </div>
          )}
        </div>
      )}
      {/* Show error feedback below button if failed */}
      {status === "idle" && feedback && (
        <div style={{ color: "crimson", fontWeight: 600, fontSize: 14, marginTop: 8 }}>{feedback}</div>
      )}
    </div>
  );
}

export default MysteryMovieBox;
