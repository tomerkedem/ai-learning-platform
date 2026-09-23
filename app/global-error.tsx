"use client";

// נטען רק כשה-layout הראשי עצמו קורס, ולכן אינו יכול להשתמש ב-providers. עברית + אנגלית סטטיות.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24, textAlign: "center" }}>
        <h1>משהו השתבש / Something went wrong</h1>
        <p>אירעה תקלה בלתי צפויה. ההתקדמות השמורה שלך לא נפגעה.<br />An unexpected error occurred. Your saved progress is safe.</p>
        <button type="button" onClick={reset} style={{ padding: "8px 20px", fontSize: 16 }}>נסו שוב / Try again</button>
      </body>
    </html>
  );
}
