import React, { useState } from "react";
import "./App.css";
import {
  fetchMovies,
  fetchMovieDetails,
  fetchMovieCredits,
  getPosterUrl,
  fetchTrendingMovies,
  searchMovies,
  fetchMovieImages,
  fetchSimilarMovies,
} from "./tmdbApi";

// Theme and layout colors (from project context)
const COLORS = {
  primary: "#dffc03",
  secondary: "#fdf7f8",
  accent: "#0f3460",
};
const QUIZZES = [
  { key: "mystery", label: "Mystery Movie Box" },
  { key: "castmatch", label: "Speed Cast Match" },
  { key: "emoji", label: "Guess Movie by Emoji" },
  { key: "blurred", label: "Find Movie with Blurred Poster" },
  { key: "freeze", label: "Frame Freeze Quiz" },
];
const INDUSTRY = {
  HOLLYWOOD: { code: "US", name: "Hollywood", subtitle: "English Movies" },
  KOLLYWOOD: { code: "IN", name: "Kollywood", subtitle: "Tamil Movies" },
};

//
// Login Page Component
//
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  // PUBLIC_INTERFACE
  /** Handles login form submit. */
  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !pwd) {
      setErr("Please enter username & password.");
      return;
    }
    // Simulate authentication (no backend). Accepts anything.
    onLogin({ username });
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.secondary,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        background: "#fff",
        padding: 40,
        borderRadius: 12,
        boxShadow: "0 6px 30px #0f34602c",
        maxWidth: 350,
        width: "100%"
      }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.accent, textAlign: "center", letterSpacing: 1 }}>CineQuiz Duel</div>
        <div className="subtitle" style={{ color: COLORS.primary, textAlign: "center", marginBottom: 16 }}>Movie Quiz Login</div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            className="input"
            placeholder="Username"
            style={{ padding: "12px", border: `1px solid ${COLORS.primary}`, borderRadius: 6 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            style={{ padding: "12px", border: `1px solid ${COLORS.primary}`, borderRadius: 6 }}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <button type="submit" className="btn btn-large" style={{
            background: COLORS.primary, color: "#222", marginTop: 8, fontWeight: 600
          }}>Log In</button>
          {err && <div style={{ color: "crimson", fontSize: 13 }}>{err}</div>}
        </form>
      </div>
      <footer style={{ marginTop: 40, fontSize: 13, color: "#666" }}>Demo app, no real authentication required.</footer>
    </div>
  );
}

//
// Quiz Card Wrapper for Games
//
function QuizCard({ title, children, accentColor = COLORS.primary }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      boxShadow: "0 2px 16px #0002",
      marginBottom: 24,
      padding: 18,
      minHeight: 210,
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: 20,
        color: accentColor,
        marginBottom: 10,
        letterSpacing: 0.1
      }}>
        {title}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

//
// Hollywood and Kollywood columns main layout
//
function QuizColumns({ currentUser }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.secondary,
      padding: "95px 0 30px 0"
    }}>
      {/* Navbar */}
      <nav className="navbar" style={{
        background: COLORS.accent,
        color: COLORS.primary,
        borderBottom: `2px solid ${COLORS.primary}`,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="logo" style={{ fontWeight: 900, fontSize: 22 }}>
            <span className="logo-symbol" style={{ color: COLORS.primary }}>🎬</span> CineQuiz Duel
          </div>
          <div style={{ fontSize: 15, color: COLORS.secondary }}>
            <span style={{fontWeight:600, color:COLORS.primary}}>Welcome,</span> {currentUser.username}
          </div>
        </div>
      </nav>
      <main>
        {/* Two columns */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          maxWidth: 1200,
          margin: "0 auto",
          gap: "36px",
          justifyContent: "center"
        }}>
          {/* Hollywood Column */}
          <div style={{
            background: "#f8faff",
            flex: 1,
            borderRadius: 16,
            boxShadow: "0 3px 32px #0f34601c",
            padding: "32px 16px",
            marginTop: 30,
            border: `2px solid ${COLORS.primary}`
          }}>
            <div style={{ color: COLORS.accent, fontWeight: 800, fontSize: 23, marginBottom: 7 }}>
              {INDUSTRY.HOLLYWOOD.name}
            </div>
            <div style={{ color: "#505860", fontSize: 14, marginBottom: 14 }}>
              🎥 {INDUSTRY.HOLLYWOOD.subtitle}
            </div>
            <QuizList industry="hollywood" accentColor={COLORS.primary} />
          </div>
          {/* Kollywood Column */}
          <div style={{
            background: "#fffef3",
            flex: 1,
            borderRadius: 16,
            boxShadow: "0 3px 32px #ffce0020",
            padding: "32px 16px",
            marginTop: 30,
            border: `2px solid ${COLORS.accent}`
          }}>
            <div style={{ color: COLORS.primary, fontWeight: 800, fontSize: 23, marginBottom: 7 }}>
              {INDUSTRY.KOLLYWOOD.name}
            </div>
            <div style={{ color: "#6c6600", fontSize: 14, marginBottom: 14 }}>
              🎬 {INDUSTRY.KOLLYWOOD.subtitle}
            </div>
            <QuizList industry="kollywood" accentColor={COLORS.accent} />
          </div>
        </div>
      </main>
    </div>
  );
}

//
// Component to render all quiz cards for an industry.
// Each quiz card holds its respective quiz component.
//
function QuizList({ industry, accentColor }) {
  return (
    <div>
      <QuizCard title="Mystery Movie Box" accentColor={accentColor}>
        <MysteryMovieBox industry={industry} accentColor={accentColor} />
      </QuizCard>
      <QuizCard title="Speed Cast Match" accentColor={accentColor}>
        <SpeedCastMatch industry={industry} accentColor={accentColor} />
      </QuizCard>
      <QuizCard title="Guess Movie by Emoji" accentColor={accentColor}>
        <GuessMovieByEmoji industry={industry} accentColor={accentColor} />
      </QuizCard>
      <QuizCard title="Find the Movie with Blurred Poster" accentColor={accentColor}>
        <BlurredPosterQuiz industry={industry} accentColor={accentColor} />
      </QuizCard>
      <QuizCard title="Frame Freeze Quiz" accentColor={accentColor}>
        <FrameFreezeQuiz industry={industry} accentColor={accentColor} />
      </QuizCard>
    </div>
  );
}

//
// --- QUIZ 1: Mystery Movie Box
//
// - Show hints (genre, lead actor, quote if available)
// - Guess the movie, then reveal
//
function MysteryMovieBox({ industry, accentColor }) {
  const [movie, setMovie] = useState(null);
  const [hints, setHints] = useState({ genre: "", actor: "", quote: "" });
  const [guess, setGuess] = useState("");
  const [reveal, setReveal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  /** Loads a random movie & hint for this industry */
  async function loadMovie() {
    setLoading(true);
    try {
      // Fetch a random movie from TMDb, with language filter
      const opts = industry === "kollywood"
        ? { with_original_language: "ta", sort_by: "popularity.desc", region: "IN" }
        : { with_original_language: "en", sort_by: "popularity.desc", region: "US" };
      const results = await fetchMovies({ ...opts, page: Math.ceil(Math.random() * 10) });
      const chosen = results.results[Math.floor(Math.random() * results.results.length)];
      const detail = await fetchMovieDetails(chosen.id, { language: "en-US" });
      // Extract genre, actor
      const credits = await fetchMovieCredits(chosen.id);
      const genres = detail.genres && detail.genres.length > 0 ? detail.genres.map(g => g.name).join(", ") : "N/A";
      const actor = credits.cast && credits.cast.length > 0 ? credits.cast[0].name : "N/A";
      // Use tagline as "quote" if present
      setMovie(detail);
      setHints({
        genre: genres,
        actor: actor,
        quote: detail.tagline || "No quote available",
      });
      setGuess("");
      setReveal(false);
      setFeedback("");
    } catch {
      setHints({ genre: "?", actor: "?", quote: "?" });
      setMovie(null);
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  /** Handles guess submission */
  function handleGuess(e) {
    e.preventDefault();
    if (!guess || !movie) return;
    // Match ignoring case and punctuation for robustness
    const clean = s => (s || "").replace(/[^a-z0-9]/gi, "").toLowerCase();
    if (clean(guess) === clean(movie.title)) {
      setFeedback("🎉 Correct! The movie is " + movie.title);
    } else {
      setFeedback("❌ Not quite. Try again or reveal!");
    }
  }

  return (
    <div style={{ minHeight: 95 }}>
      <button className="btn" onClick={loadMovie} style={{ background: accentColor, color: "#1e1e1e", fontWeight: 600, marginBottom: 12 }}>
        {loading ? "Loading..." : "Open Mystery Box"}
      </button>
      {movie && (
        <div>
          <div style={{ fontSize: 15, margin: "10px 0 2px", color: accentColor, fontWeight: 600, letterSpacing: 0.08 }}>Hints:</div>
          <ul style={{ margin: 0, paddingLeft: 22, fontSize: 13, color: "#222" }}>
            <li><b>Genre:</b> {hints.genre}</li>
            <li><b>Main Actor:</b> {hints.actor}</li>
            <li><b>Quote:</b> <span style={{ fontStyle: "italic" }}>{hints.quote}</span></li>
          </ul>
          {!reveal ? (
            <form onSubmit={handleGuess} style={{marginTop:10, display: "flex", gap:8, alignItems:"center"}}>
              <input
                className="input"
                type="text"
                style={{ padding: "7px", border: `1px solid ${accentColor}`, borderRadius: 6, width: 120, fontSize: 14 }}
                placeholder="Guess movie title"
                value={guess}
                autoComplete="off"
                onChange={e => setGuess(e.target.value)}
                disabled={loading}
              />
              <button className="btn" style={{ background: accentColor, color: "#222", fontWeight: 600, padding: "7px 16px", fontSize: 14 }} type="submit" disabled={!guess}>
                Guess
              </button>
              <button className="btn" style={{ background: "#eee", color: accentColor, padding: "6px 13px" }} type="button" onClick={() => setReveal(true)}>
                Reveal
              </button>
            </form>
          ) : (
            <div style={{ marginTop: 12, fontSize: 15}}>
              <b>It was:</b> <span style={{ color: accentColor }}>{movie.title}</span><br />
              {movie.poster_path && (
                <img alt="Poster" src={getPosterUrl(movie.poster_path, "w185")} style={{ marginTop: 10, borderRadius: 6, maxHeight: 150, boxShadow: "0 2px 12px #0003" }} />
              )}
            </div>
          )}
          <div style={{ marginTop: 7, minHeight: 18, color: accentColor, fontWeight: 600 }}>
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
}

//
// --- QUIZ 2: Speed Cast Match
//
// - Show a movie (no title! just poster or image)
// - Show cast list (actors)
// - Provide movie options, players must select correct match quickly
//
function SpeedCastMatch({ industry, accentColor }) {
  const [movie, setMovie] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  /** Loads a new round: gets movie & other options from same industry */
  async function loadRound() {
    setLoading(true);
    setSelected("");
    setResult("");
    try {
      const opts = industry === "kollywood"
        ? { with_original_language: "ta", sort_by: "popularity.desc", region: "IN" }
        : { with_original_language: "en", sort_by: "popularity.desc", region: "US" };
      const results = await fetchMovies({ ...opts, page: Math.ceil(Math.random() * 7) });
      const arr = results.results;
      const theMovie = arr[Math.floor(Math.random() * arr.length)];
      // Get 3 more movies for wrong choices
      let alt = arr
        .filter(m => m.id !== theMovie.id)
        .sort(() => Math.random()-0.5)
        .slice(0,3)
        .map(m => ({ id: m.id, title: m.title }));
      if (!alt.find(o => o.title === theMovie.title)) alt.push({ id: theMovie.id, title: theMovie.title });
      // Always include correct, then shuffle
      alt.push({ id: theMovie.id, title: theMovie.title });
      const shuffled = alt.sort(() => Math.random() - 0.5).slice(0, 4); // Just 4
      const credits = await fetchMovieCredits(theMovie.id);
      setMovie({ ...theMovie, cast: credits.cast?.slice(0, 4).map(c => c.name) });
      setChoices(shuffled.map(c => c.title));
    } catch {
      setMovie(null);
      setChoices([]);
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  /** Handles user selection */
  function pickAnswer(title) {
    setSelected(title);
    if (movie && title === movie.title) {
      setResult("🎉 Correct!");
    } else {
      setResult("❌ Not quite.");
    }
  }

  return (
    <div>
      <button className="btn" onClick={loadRound} style={{ background: accentColor, color: "#1e1e1e", fontWeight: 600, marginBottom: 10 }}>
        {loading ? "Loading..." : "Start Cast Match"}
      </button>
      {movie && (
        <div>
          <div style={{ marginBottom: 8 }}>
            {movie.poster_path && <img src={getPosterUrl(movie.poster_path, "w154")} alt="Movie Poster" style={{ maxHeight: 95, borderRadius: 6, boxShadow: "0 2px 12px #0002" }} />}
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, color: accentColor, marginBottom: 6 }}>Cast:</div>
          <ul style={{ paddingLeft: 18, fontSize: 14, marginTop: 2 }}>
            {movie.cast?.map((name, i) => <li key={i}>{name}</li>)}
          </ul>
          <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
            {choices.map(title => (
              <button
                key={title}
                onClick={() => pickAnswer(title)}
                disabled={!!selected || loading}
                className="btn"
                style={{
                  background: selected === title
                    ? (title === movie.title ? "#AEE87F" : "#ff8a85")
                    : "#eee",
                  color: selected === title ? "#222" : accentColor,
                  minWidth: 90,
                  fontWeight: "bold"
                }}
              >
                {title}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 10, color: accentColor, fontWeight: 700 }}>{result}</div>
        </div>
      )}
    </div>
  );
}

//
// --- QUIZ 3: Guess Movie by Emoji
//
// - Show a string of emojis as the movie plot/idea, guess title: pre-defined mapping per industry
//
const EMOJI_QUIZZES = {
  hollywood: [
    { emoji: "🧑‍🚀🌕🚀", title: "Interstellar" },
    { emoji: "🦖🏝️🌋", title: "Jurassic Park" },
    { emoji: "🦇🏙️🤵", title: "The Dark Knight" },
    { emoji: "🐼🥋👊", title: "Kung Fu Panda" },
    { emoji: "🪄👦⚡", title: "Harry Potter" }
  ],
  kollywood: [
    { emoji: "🕶️🛵🤟", title: "Kabali" },
    { emoji: "🕺🎤🪘", title: "Maari" },
    { emoji: "⏳🚂❤️", title: "96" },
    { emoji: "🐅👑👩‍👦", title: "Pulimurugan" },
    { emoji: "🚓👦🏽🌧️", title: "Vikram Vedha" }
  ]
};

function GuessMovieByEmoji({ industry, accentColor }) {
  const pool = EMOJI_QUIZZES[industry] || [];
  const [current, setCurrent] = useState(Math.floor(Math.random() * pool.length));
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");

  // PUBLIC_INTERFACE
  /** New emoji puzzle */
  function nextQuiz() {
    setResult("");
    setGuess("");
    setCurrent(Math.floor(Math.random() * pool.length));
  }
  function handleGuess(e) {
    e.preventDefault();
    if (!guess) return;
    const solution = pool[current].title;
    if (guess.trim().toLowerCase() === solution.trim().toLowerCase()) {
      setResult("🎉 Correct!");
    } else {
      setResult("❌ Nope, that's not it.");
    }
  }

  return (
    <div>
      <div style={{ fontSize: 30, marginBottom: 16, textAlign: "center" }}>{pool[current].emoji}</div>
      <form onSubmit={handleGuess} style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
        <input
          className="input"
          placeholder="Movie title"
          style={{ padding: "7px", border: `1px solid ${accentColor}`, borderRadius: 6, width: 105, fontSize: 14 }}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          autoComplete="off"
        />
        <button className="btn" style={{ background: accentColor, color: "#222", fontWeight: 600, padding: "7px 15px", fontSize: 14 }} type="submit" disabled={!guess}>
          Guess
        </button>
        <button className="btn" style={{ background: "#eee", color: accentColor, padding: "6px 10px" }} type="button" onClick={nextQuiz}>
          New
        </button>
      </form>
      <div style={{ marginTop: 9, color: accentColor }}>{result}</div>
      {result && <div style={{ marginTop: 7, color: "#2d2d2d", fontWeight: "bold", fontSize: 13 }}>
        <span>Answer: {pool[current].title}</span>
      </div>}
    </div>
  );
}

//
// --- QUIZ 4: Blurred Poster Quiz
//
// - Fetch movie poster
// - Display blurred, user guesses; reveal image
//
function BlurredPosterQuiz({ industry, accentColor }) {
  const [movie, setMovie] = useState(null);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [blur, setBlur] = useState(true);
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  /** Loads a new random movie with a poster */
  async function loadMovie() {
    setLoading(true);
    setBlur(true);
    setGuess("");
    setFeedback("");
    try {
      const opts = industry === "kollywood"
        ? { with_original_language: "ta", sort_by: "popularity.desc", region: "IN" }
        : { with_original_language: "en", sort_by: "popularity.desc", region: "US" };
      const results = await fetchMovies({ ...opts, page: Math.ceil(Math.random() * 7) });
      const arr = results.results.filter(m => m.poster_path);
      const theMovie = arr[Math.floor(Math.random() * arr.length)];
      setMovie(theMovie);
    } catch {
      setMovie(null);
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  /** Handles guess for blurred poster */
  function handleGuess(e) {
    e.preventDefault();
    if (!movie || !guess) return;
    const canonical = s => (s || "").replace(/[^a-z0-9]/gi, "").toLowerCase();
    if (canonical(guess) === canonical(movie.title)) {
      setFeedback("🎉 Correct! Reveal below!");
      setBlur(false);
    } else {
      setFeedback("❌ Try again!");
    }
  }

  return (
    <div>
      <button className="btn" onClick={loadMovie} style={{ background: accentColor, color: "#1e1e1e", fontWeight: 600, marginBottom: 10 }}>
        {loading ? "Loading..." : "Blur a Poster"}
      </button>
      {movie && movie.poster_path && (
        <div>
          <img
            src={getPosterUrl(movie.poster_path, "w185")}
            alt="Blurred poster"
            style={{
              filter: blur ? "blur(16px) brightness(1.18)" : "none",
              borderRadius: 7,
              boxShadow: "0 1px 14px #4443",
              marginBottom: 8,
              maxHeight: 155
            }}
          />
          <form onSubmit={handleGuess} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
            <input
              className="input"
              placeholder="Movie title"
              style={{ padding: "6px", border: `1px solid ${accentColor}`, borderRadius: 6, width: 110, fontSize: 14 }}
              value={guess}
              onChange={e => setGuess(e.target.value)}
              autoComplete="off"
            />
            <button className="btn" style={{ background: accentColor, color: "#222", fontWeight: 600, padding: "6px 14px", fontSize: 14 }} type="submit" disabled={!guess}>
              Guess
            </button>
            <button className="btn" style={{ background: "#eee", color: accentColor, padding: "5px 10px" }} type="button" onClick={() => setBlur(false)} disabled={!movie}>
              Reveal
            </button>
          </form>
          <div style={{ marginTop: 10, color: accentColor }}>{feedback}</div>
          {!blur &&
            <div style={{ marginTop: 7, color: "#313", fontWeight: "bold" }}>
              It was: {movie.title}
            </div>
          }
        </div>
      )}
    </div>
  );
}

//
// --- QUIZ 5: Frame Freeze Quiz
//
// - Fetch a movie, show a random backdrop or still, four answer choices.
//
function FrameFreezeQuiz({ industry, accentColor }) {
  const [movie, setMovie] = useState(null);
  const [choices, setChoices] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [result, setResult] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  /** Loads a new freeze frame quiz: gets backdrops and choices */
  async function loadQuiz() {
    setLoading(true);
    setImageUrl(null);
    setMovie(null);
    setChoices([]);
    setChosen(null);
    setResult("");
    try {
      const opts = industry === "kollywood"
        ? { with_original_language: "ta", region: "IN", sort_by: "popularity.desc" }
        : { with_original_language: "en", region: "US", sort_by: "popularity.desc" };
      const page = Math.ceil(Math.random() * 7);
      const results = await fetchMovies({ ...opts, page });
      const arr = results.results;
      const answer = arr[Math.floor(Math.random() * arr.length)];
      const images = await fetchMovieImages(answer.id);
      const backdrop = images.backdrops?.length ? images.backdrops[Math.floor(Math.random() * images.backdrops.length)] : null;
      const url = backdrop ? getPosterUrl(backdrop.file_path, "w500") : null;
      // 3 random wrong choices:
      let wrong = arr.filter(m => m.id !== answer.id).sort(() => Math.random()-0.5).slice(0,3);
      let optsChoices = [...wrong, answer].map(m => m.title).sort(() => Math.random() - 0.5);
      setMovie(answer);
      setChoices(optsChoices);
      setImageUrl(url);
    } catch {
      setMovie(null);
      setChoices([]);
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  /** Handles answer selection */
  function pickChoice(title) {
    setChosen(title);
    if (movie && title === movie.title) {
      setResult("🎉 Correct!");
    } else {
      setResult("❌ Not quite.");
    }
  }

  return (
    <div>
      <button className="btn" onClick={loadQuiz} style={{ background: accentColor, color: "#1e1e1e", fontWeight: 600, marginBottom: 12 }}>
        {loading ? "Loading..." : "Show Frame Freeze"}
      </button>
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Random movie still" style={{
            width: "96%",
            maxWidth: 320,
            borderRadius: 8,
            boxShadow: "0 2px 14px #0005",
            marginBottom: 12
          }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6, marginBottom: 7 }}>
            {choices.map(title => (
              <button
                key={title}
                className="btn"
                style={{
                  background: chosen === title
                    ? (title === movie.title ? "#AEE87F" : "#ff8a85")
                    : "#eee",
                  color: chosen === title ? "#222" : accentColor,
                  minWidth: 95,
                  fontWeight: "bold"
                }}
                onClick={() => pickChoice(title)}
                disabled={!!chosen}
              >
                {title}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 7, color: accentColor, fontWeight: 700 }}>{result}</div>
          {chosen && (
            <div style={{ marginTop: 6, color: "#313", fontWeight: 600, fontSize: 13 }}>
              The answer: {movie.title}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
/** This is the top-level CineQuiz Duel App wrapper */
function App() {
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }
  return <QuizColumns currentUser={currentUser} />;
}

export default App;