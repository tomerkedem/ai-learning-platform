"use client";

import React from 'react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { StaticCodeBlock } from '@/components/content/StaticCodeBlock';
import { Quiz } from '@/components/content/Quiz';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';
import { TestRunnerVis, MockingLab } from '@/components/demos/chapter-12';
import { 
    TestTube, ShieldCheck, Beaker, PlayCircle, 
    GitPullRequest, CloudOff // הוסר FileCode שלא היה בשימוש
} from 'lucide-react';

export default function Chapter12() {

  // --- Code Snippets & Outputs ---

  const fixtureCode = `import pytest

@pytest.fixture
def sample_text() -> str:
    return "Python is an amazing language"

def test_tokenize_with_fixture(sample_text):
    # הפיקצ'ר מוזרק אוטומטית כארגומנט
    tokens = sample_text.split()
    assert len(tokens) == 5
    assert tokens[0] == "Python"`;

  const fixtureOutput = `================ test session starts ================
collected 1 item

test_core.py::test_tokenize_with_fixture PASSED [100%]

================ 1 passed in 0.01s ================`;

  const raisesCode = `import pytest

def read_json(path: str):
    if path == "missing.json":
        raise FileNotFoundError("File missing")
    return {}

def test_read_json_not_found():
    # מוודאים שהקוד זורק שגיאה כמו שצריך
    with pytest.raises(FileNotFoundError):
        read_json("missing.json")`;

  const raisesOutput = `================ test session starts ================
test_io.py::test_read_json_not_found PASSED [100%]

================ 1 passed in 0.01s ================`;

  const mockCode = `from unittest.mock import patch

def query_model(prompt):
    # קוד שפונה ל-API חיצוני יקר
    # response = requests.post("https://api.openai.com/...")
    return "Real Response"

@patch("query_model") # אנו מחליפים את הפונקציה האמיתית
def test_query_model(mock_query):
    mock_query.return_value = "Mocked Response"
    
    result = mock_query("Hello")
    
    assert result == "Mocked Response"
    print("Test passed without internet!")`;

  const mockOutput = `Test passed without internet!`;

  const cicdCode = `name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install pytest
      - run: pytest -v`;

  const cicdOutput = `Creating workflow file...
Pushing to GitHub...
Action triggered: Tests passed ✅`;

  // --- Quiz ---
  const questions = [
    {
        id: 1,
        question: "מהו Fixture ב-pytest?",
        options: [
            "סוג של שגיאה שמופיעה בבדיקות",
            "פונקציה שמכינה נתונים או סביבה לבדיקה, ומוזרקת לבדיקות אחרות",
            "קובץ שמכיל את תוצאות הבדיקה",
            "כלי לתיקון באגים אוטומטי"
        ],
        correctAnswer: 1,
        explanation: "Fixture הוא מנגנון להכנת והזרקת תלויות (כגון דאטהבייס זמני, משתמש מדומה או טקסט לדוגמה) לתוך פונקציות הבדיקה."
    },
    {
        id: 2,
        question: "מדוע משתמשים ב-Mocking בבדיקות?",
        options: [
            "כדי שהבדיקות יהיו מהירות יותר ולא יהיו תלויות בשירותים חיצוניים (כמו API)",
            "כדי להעתיק קוד ממקום אחר",
            "Mocking זה רק למערכות דאטהבייס",
            "כדי שהקוד ירוץ בפרודקשן"
        ],
        correctAnswer: 0,
        explanation: "Mocking מחליף רכיבים חיצוניים ברכיבים מדומים. זה מבודד את הבדיקה, חוסך זמן וכסף, ומונע תלות ברשת."
    },
    {
        id: 3,
        question: "מתי כדאי להריץ את הבדיקות?",
        options: [
            "רק לפני שמעלים גרסה לפרודקשן",
            "פעם בחודש",
            "אוטומטית בכל שינוי קוד (CI/CD) וגם לוקאלית בזמן הפיתוח",
            "רק כשלקוח מתלונן על באג"
        ],
        correctAnswer: 2,
        explanation: "בדיקות צריכות לרוץ כל הזמן. CI (Continuous Integration) מבטיח שכל שורת קוד חדשה נבדקת לפני שהיא נכנסת למערכת."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={12}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="headsup" line="בלי טסטים מתכנתים בעיניים עצומות" width={160} accent={EMERALD_ACCENT} bubbleSide="bottom" />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <TestTube size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Testing & Quality</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                בדיקות אוטומטיות וארגונומיה למפתח
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                בעולם ה-AI, הכל הסתברותי ומשתנה. לכן בדיקות הן לא מותרות - הן חומת ההגנה שלך.
                <br/>
                בפרק זה נלמד איך לוודא שהקוד שלך עובד, גם כשהמודל מחליט להזות.
            </p>
        </section>
        </div>

        {/* --- 1. Pytest & Fixtures --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <Beaker size={24} className="text-blue-500"/>
                Pytest ו-Fixtures
            </h3>
            
            <p className="text-slate-300">
                <code>pytest</code> הוא הסטנדרט בתעשייה. הוא מאפשר לכתוב בדיקות פשוטות כפונקציות, ולהשתמש ב-Fixtures כדי לשתף מידע בין בדיקות.
            </p>

            {/* Interactive Test Runner */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>סימולטור הרצה:</strong> לחץ על Run Tests וראה איך Pytest מריץ ומדווח.
                </p>
                <TestRunnerVis />
            </div>

            <LiveCodeEditor
                initialCode={fixtureCode}
            />
        </section>

        {/* --- 2. Exception Testing --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <ShieldCheck size={24} className="text-yellow-500"/>
                בדיקת שגיאות (raises)
            </h3>
            
            <p className="text-slate-300">
                אנחנו רוצים לוודא שהקוד נכשל בצורה נכונה. <code>pytest.raises</code> בודק שהפונקציה זורקת את השגיאה המצופה.
            </p>
            
            <LiveCodeEditor
                initialCode={raisesCode}
            />
        </section>

        {/* --- 3. Mocking --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-purple-500 pr-4 flex items-center gap-2">
                <CloudOff size={24} className="text-purple-500"/>
                Mocking: סימולציה של העולם החיצוני
            </h3>
            
            <p className="text-slate-300">
                בדיקות לא אמורות לעלות כסף או להיות תלויות באינטרנט. שימוש ב-mocks מאפשר לדמות קריאות API בצורה מיידית וחינמית.
            </p>

            {/* Interactive Mocking Lab */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>מעבדת Mocking:</strong> ההבדל בין קריאה אמיתית (איטית) לקריאה מדומה (מהירה).
                </p>
                <MockingLab />
            </div>

            <LiveCodeEditor
                initialCode={mockCode}
            />
        </section>

        {/* --- 4. CI/CD & Tools --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-2">
                <GitPullRequest size={24} className="text-emerald-500"/>
                אוטומציה וכלים (CI/CD)
            </h3>
            
            <p className="text-slate-300">
                בדיקות שרצות רק אצלך במחשב לא שוות הרבה. GitHub Actions מריץ את הבדיקות אוטומטית בכל Push.
                <br/>
                כלים כמו <strong>Ruff</strong> ו-<strong>Black</strong> דואגים שהקוד יהיה אחיד ויפה לפני שהוא נכנס למערכת.
            </p>

            <StaticCodeBlock language="yaml" 
                code={cicdCode} 
                output={cicdOutput} 
                dir="ltr"
            />

            <InsightBox type="info" title="Pre-commit Hooks">
                מומלץ להתקין <code>pre-commit</code>. זה כלי קטן שלא נותן לך לעשות <code>git commit</code> אם יש שגיאות בסיסיות או שהקוד לא מפורמט.
            </InsightBox>
        </section>

        {/* --- 5. Summary --- */}
        <section className="mt-24 bg-linear-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-6 text-white justify-center">
                <PlayCircle className="text-blue-400" />
                <h2 className="text-2xl font-bold">סיכום: בנה בביטחון</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-emerald-400 font-bold mb-2">Pytest</h4>
                    <p className="text-slate-400 text-sm">הכלי המרכזי. השתמש ב-Fixtures למניעת שכפול קוד.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-yellow-400 font-bold mb-2">Mocking</h4>
                    <p className="text-slate-400 text-sm">נתק תלויות חיצוניות. בדיקות צריכות לרוץ מהר ובאופליין.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-purple-400 font-bold mb-2">CI/CD</h4>
                    <p className="text-slate-400 text-sm">אוטומציה היא המפתח. אל תסמוך על הזיכרון שלך להריץ בדיקות.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-blue-400 font-bold mb-2">Linting</h4>
                    <p className="text-slate-400 text-sm">Black ו-Ruff שומרים על קוד נקי ואחיד בצוות.</p>
                </div>
            </div>
        </section>

        {/* --- Quiz --- */}
        <section className="mt-20">
            <Quiz questions={questions} title="מבדק ידע - פרק 12" />
        </section>

    </ChapterLayout>
  );
}