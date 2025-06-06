import React from "react";
import "./App.css";

/**
 * QuizColumn component for CineQuiz Duel
 * Modular vertical container for either Hollywood or Kollywood quiz cards.
 * Receives:
 *   - label: "Hollywood" | "Kollywood" (column label)
 *   - subtitle: string ("English Movies", "Tamil Movies", etc.)
 *   - accentColor: color string for primary highlight
 *   - background: background color for the column
 *   - borderColor: border color for the column
 *   - children: quiz cards/components to render within the column
 * Layout: Styled card column, visually separated, responsive for stacking on narrow screens.
 */
// PUBLIC_INTERFACE
function QuizColumn({
  label,
  subtitle,
  accentColor,
  background = "#fff",
  borderColor = "#ececec",
  children,
}) {
  return (
    <section
      className="quiz-column"
      style={{
        background,
        borderRadius: 16,
        boxShadow: "0 3px 32px #0f346018",
        border: `2px solid ${borderColor}`,
        padding: "30px 14px 26px",
        marginTop: 32,
        minWidth: 0,
        flex: "1 1 370px",
        display: "flex",
        flexDirection: "column",
        maxWidth: 480,
      }}
    >
      <div
        className="quiz-column-label"
        style={{
          color: accentColor,
          fontWeight: 800,
          fontSize: 22,
          marginBottom: 3,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </div>
      {subtitle && (
        <div
          style={{
            color: "#707478",
            fontSize: 14,
            marginBottom: 16,
            fontWeight: 500,
            letterSpacing: 0.1,
          }}
        >
          {label === "Hollywood" ? "🎥" : "🎬"} {subtitle}
        </div>
      )}
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default QuizColumn;
