"use client";

import React from 'react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox'; // הרכיב שיצרנו
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { Quiz } from '@/components/content/Quiz';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';
import { TryExceptVis, LoggerLab, ErrorFlowChart } from '@/components/demos/chapter-8';
import { 
    AlertTriangle, ShieldAlert, Activity, FileText, 
    Bug, Stethoscope, List
} from 'lucide-react';

export default function Chapter8() {

  // --- Code Snippets & Outputs ---

  const basicTryCode = `def load_model(path: str):
    try:
        print(f"Loading model from {path}...")
        # Simulating file open
        if path == "missing.bin":
            raise FileNotFoundError("File not found on disk")
        print("Model data loaded.")
    except FileNotFoundError:
        print("Error: The file was not found.")
    except Exception as e:
        print(f"Unexpected error: {e}")
    else:
        print("Success: Model is ready.")
    finally:
        print("Cleanup: Closing file handles.")

print("--- Test 1: Success ---")
load_model("model.bin")

print("\\n--- Test 2: Failure ---")
load_model("missing.bin")`;

  const basicTryOutput = `--- Test 1: Success ---
Loading model from model.bin...
Model data loaded.
Success: Model is ready.
Cleanup: Closing file handles.

--- Test 2: Failure ---
Loading model from missing.bin...
Error: The file was not found.
Cleanup: Closing file handles.`;

  const customExceptionCode = `class InvalidDatasetError(Exception):
    """Raised when the dataset structure is invalid."""
    pass

def load_dataset(path: str):
    # סימולציה של בדיקת קובץ
    if "corrupt" in path:
        raise InvalidDatasetError(f"The file {path} header is corrupted.")
    return "Dataset Loaded"

try:
    load_dataset("data_corrupt.csv")
except InvalidDatasetError as e:
    print(f"CRITICAL: {e}")
except Exception as e:
    print(f"General Error: {e}")`;

  const customExceptionOutput = `CRITICAL: The file data_corrupt.csv header is corrupted.`;

  const loggingBasicCode = `import logging

# הגדרת לוגר בסיסית (בדרך כלל עושים פעם אחת בתחילת התוכנית)
# logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

# שימוש בלוגר במקום print
print("--- Log Output ---")
logging.warning("The model is slower than usual")
logging.error("Dataset loading failed")
logging.info("This info message might not show if level is WARNING")`;

  const loggingBasicOutput = `--- Log Output ---
WARNING:root:The model is slower than usual
ERROR:root:Dataset loading failed`;

  const structuredLogCode = `import logging
import uuid
import json

# סימולציה של לוג מובנה (JSON)
def log_event(level, msg, **kwargs):
    entry = {
        "level": level,
        "message": msg,
        "correlation_id": str(uuid.uuid4())[:8],
        **kwargs
    }
    print(json.dumps(entry))

log_event("INFO", "Starting request", user_id="u_123")
log_event("ERROR", "Processing failed", error="Timeout", user_id="u_123")`;

  const structuredLogOutput = `{"level": "INFO", "message": "Starting request", "correlation_id": "a1b2c3d4", "user_id": "u_123"}
{"level": "ERROR", "message": "Processing failed", "correlation_id": "e5f6g7h8", "error": "Timeout", "user_id": "u_123"}`;

  const fullPipelineCode = `import logging

class PipelineError(Exception):
    pass

def run_pipeline(data):
    logger = logging.getLogger("pipeline")
    logger.setLevel(logging.INFO)
    
    try:
        print("[INFO] Starting pipeline...") 
        if not data:
            raise PipelineError("Dataset is empty")
        
        print(f"[INFO] Processing {len(data)} items...")
        # עיבוד...
        print("[INFO] Pipeline completed successfully")
        
    except PipelineError as e:
        print(f"[ERROR] Pipeline specific error: {e}")
    except Exception as e:
        print(f"[CRITICAL] Unexpected system error: {e}")
    finally:
        print("[INFO] End of pipeline")

run_pipeline([])`;

  const fullPipelineOutput = `[INFO] Starting pipeline...
[ERROR] Pipeline specific error: Dataset is empty
[INFO] End of pipeline`;

  // --- Quiz ---
  const questions = [
    {
        id: 1,
        question: "מתי רץ הבלוק 'finally'?",
        options: [
            "רק אם הייתה שגיאה",
            "רק אם לא הייתה שגיאה",
            "תמיד, לא משנה אם הייתה שגיאה או לא",
            "רק אם המשתמש לחץ על CTRL+C"
        ],
        correctAnswer: 2,
        explanation: "בלוק finally נועד לניקוי משאבים (כמו סגירת קבצים) והוא רץ תמיד בסוף התהליך, בין אם היתה חריגה ובין אם לא."
    },
    {
        id: 2,
        question: "מה היתרון של שימוש ב-Logger על פני Print?",
        options: [
            "אין יתרון, זה אותו דבר",
            "לוגר מאפשר לשלוט ברמות חומרה (INFO, ERROR), לכתוב לקבצים ולשמור על היסטוריה מסודרת",
            "לוגר הוא מהיר יותר פי 10",
            "print לא עובד בתוך פונקציות"
        ],
        correctAnswer: 1,
        explanation: "הדפסות print הן זמניות. לוגים מאפשרים סינון, שמירה לקבצים, וניטור מערכת לאורך זמן בצורה מקצועית."
    },
    {
        id: 3,
        question: "מהו Correlation ID ומדוע הוא חשוב?",
        options: [
            "זהו מזהה ייחודי למשתמש במערכת",
            "זהו מזהה ייחודי לבקשה/תהליך, שמאפשר לקשר בין כל הלוגים שנוצרו לאורך הדרך",
            "זהו מספר השורה בקוד שבה קרתה השגיאה",
            "זהו שם הקובץ שבו נשמר הלוג"
        ],
        correctAnswer: 1,
        explanation: "במערכות מורכבות, Correlation ID מאפשר 'לצבוע' בקשה ספציפית ולראות את כל המסלול שלה בלוגים, גם אם היא עברה דרך מספר שירותים או פונקציות."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={8}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="headsup" line="תקלה טובה מדווחת על עצמה" width={160} accent={EMERALD_ACCENT} bubbleSide="bottom" />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-red-400 mb-2">
                <AlertTriangle size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Exceptions & Logging</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                חריגות, לוגים ואבחון
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                מערכת AI לומדת ומנחשת, ולפעמים טועה. אבל למהנדס שבונה אותה אסור לטעות.
                טיפול בשגיאות הוא חגורת הבטיחות של הקוד שלך.
                <br/>
                מפתח בלי לוגים הוא כמו טייס שטס בלי מכשירים בערפל.
            </p>
        </section>
        </div>

        {/* --- 1. Try / Except Structure --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <ShieldAlert size={24} className="text-blue-500"/>
                try / except / else / finally
            </h3>
            
            <p className="text-slate-300">
                זהו המבנה הבסיסי להגנה על הקוד. הסוד הוא לדעת מתי משתמשים ב-<code>else</code> (הצלחה) ומתי ב-<code>finally</code> (ניקוי).
            </p>

            {/* Interactive Try/Except Visualizer */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>סימולציה אינטראקטיבית:</strong> בחר תרחיש וראה אילו בלוקים רצים ובאיזה סדר.
                </p>
                <TryExceptVis />
            </div>

            <LiveCodeEditor
                initialCode={basicTryCode}
            />

            {/* InsightBox 1: Intuition */}
            <InsightBox type="intuition" title="מתי רץ finally?">
                בלוק ה-<code>finally</code> ירוץ <strong>תמיד</strong>, גם אם הייתה שגיאה, גם אם לא הייתה, ואפילו אם עשית <code>return</code> באמצע ה-<code>try</code>. זה המקום המושלם לסגור קבצים או חיבורים ל-Database.
            </InsightBox>
        </section>

        {/* --- 2. Custom Exceptions --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <Bug size={24} className="text-yellow-500"/>
                חריגות מותאמות (Custom Exceptions)
            </h3>
            
            <p className="text-slate-300">
                אל תזרוק סתם <code>Exception</code>. צור שגיאות משלך כמו <code>ModelNotFoundError</code> כדי שהקוד שיטפל בשגיאה ידע בדיוק מה קרה.
            </p>
            
            <LiveCodeEditor
                initialCode={customExceptionCode}
            />
        </section>

        {/* --- 3. Logging Basics --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-2">
                <List size={24} className="text-emerald-500"/>
                לוגים: העיניים של המערכת
            </h3>
            
            <p className="text-slate-300">
                <code>print</code> זה הודעת וואטסאפ שנעלמת. <code>logging</code> זו היסטוריה רשמית.
                <br/>
                השתמש ברמות (Levels) כדי לסנן רעש.
            </p>

            {/* Interactive Logger Lab */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>מעבדת לוגים:</strong> שנה את רמת הסינון וראה אילו הודעות מופיעות.
                </p>
                <LoggerLab />
            </div>

            <LiveCodeEditor
                initialCode={loggingBasicCode}
            />

            {/* InsightBox 2: Warning */}
            <InsightBox type="warning" title="אבטחת מידע">
                לעולם, אבל לעולם, אל תרשום ללוג סיסמאות, מפתחות API או מידע אישי של משתמשים (PII). הלוגים נשמרים ולעיתים נשלחים לשירותים חיצוניים.
            </InsightBox>
        </section>

        {/* --- 4. Structured Logging --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-purple-500 pr-4 flex items-center gap-2">
                <Activity size={24} className="text-purple-500"/>
                Structured Logging & Correlation ID
            </h3>
            
            <p className="text-slate-300">
                במערכות גדולות, לוגים צריכים להיות קריאים למכונה (JSON).
                הוספת <strong>Correlation ID</strong> מאפשרת לעקוב אחרי בקשה אחת לאורך כל חיי המערכת.
            </p>

            <LiveCodeEditor
                initialCode={structuredLogCode}
            />

            {/* InsightBox 3: Info */}
            <InsightBox type="info" title="למה JSON?">
                כששומרים לוגים בפורמט JSON, מערכות כמו ELK (Elasticsearch) או Datadog יכולות לפרק אותם אוטומטית ולאפשר לך לחפש &quot;כל השגיאות של user_id=123&quot; בשניות.
            </InsightBox>
        </section>

        {/* --- 5. Full Pipeline Example --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-indigo-500 pr-4 flex items-center gap-2">
                <FileText size={24} className="text-indigo-500"/>
                דוגמה מסכמת: Pipeline מוגן
            </h3>
            
            <p className="text-slate-300">
                שילוב של הכל ביחד: טעינת נתונים, עיבוד, טיפול בשגיאות ספציפיות, ולוגים ברורים.
            </p>

            <LiveCodeEditor
                initialCode={fullPipelineCode}
            />
        </section>

        {/* --- Flowchart --- */}
        <section className="mt-12 flex justify-center">
            <ErrorFlowChart />
        </section>

        {/* --- Summary --- */}
        <section className="mt-24 bg-linear-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-6 text-white justify-center">
                <Stethoscope className="text-blue-400" />
                <h2 className="text-2xl font-bold">סיכום: Best Practices</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-red-400 font-bold mb-2">אל תבלע שגיאות</h4>
                    <p className="text-slate-400 text-sm">לעולם אל תכתוב <code>except: pass</code>. זה מחביא באגים.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-emerald-400 font-bold mb-2">Logger over Print</h4>
                    <p className="text-slate-400 text-sm">השתמש ב-logger כדי לשמור היסטוריה ולשלוט ברעש.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-yellow-400 font-bold mb-2">Correlation ID</h4>
                    <p className="text-slate-400 text-sm">תייג כל תהליך במזהה ייחודי כדי שתוכל לחקור אותו אחר כך.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-blue-400 font-bold mb-2">Be Specific</h4>
                    <p className="text-slate-400 text-sm">תפוס שגיאות ספציפיות (<code>FileNotFoundError</code>) לפני שגיאות כלליות.</p>
                </div>
            </div>
        </section>

        {/* --- Quiz --- */}
        <section className="mt-20">
            <Quiz questions={questions} title="מבדק ידע - פרק 8" />
        </section>

    </ChapterLayout>
  );
}