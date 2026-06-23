// נתוני הדמו של מקטע ה-Velocity, מופרדים מה-UI.
// זהו קוד פייתון אמיתי (לא mock) שרץ חי ב-Pyodide: מנתח סנטימנט שקוף
// שהתוצאה שלו נגזרת באמת מהטקסט שהמשתמש מזין. אפשר לערוך ולהריץ.

/** קוד פייתון אמיתי שהלומד רואה, עורך ומריץ. */
export const DEMO_CODE = `import json

# A tiny but REAL sentiment analyzer, running live in Python.
# Edit the sentence (or the word lists) and press Run.

positive = {"love", "great", "fast", "easy", "good", "amazing",
            "happy", "powerful", "clear", "fun", "best", "enjoy"}
negative = {"hate", "slow", "hard", "bad", "ugly", "confusing",
            "boring", "worst", "annoying", "broken", "painful"}

def analyze(text):
    words = text.lower().replace(".", " ").replace(",", " ").split()
    hits = [w for w in words if w in positive or w in negative]
    score = sum(w in positive for w in hits) - sum(w in negative for w in hits)
    label = "POSITIVE" if score > 0 else "NEGATIVE" if score < 0 else "NEUTRAL"
    confidence = round(abs(score) / len(hits), 2) if hits else 0.0
    return {"label": label, "score": confidence}

sentence = "Python makes AI development fast and fun"
print(json.dumps(analyze(sentence), indent=2))`;
