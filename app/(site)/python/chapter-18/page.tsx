"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { ChapterLayout } from '@/components/ChapterLayout';
import { Quiz } from '@/components/content/Quiz';
import { InsightBox } from '@/components/content/InsightBox';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';
import {
    FolderTree, GitBranch, CheckCircle2,
    Share2, ShieldCheck, Folder, File, 
    Cpu, Database, Boxes, Terminal, Code2
} from 'lucide-react';

// פתרון Hydration: טעינה דינמית של בלוק הקוד רק בצד הלקוח
const StaticCodeBlock = dynamic(() => import('@/components/content/StaticCodeBlock').then(mod => mod.StaticCodeBlock), {
  ssr: false,
  loading: () => <div className="h-24 w-full bg-slate-900/50 animate-pulse rounded-xl" />
});

interface FileNodeProps {
  name: string;
  comment: string;
  level?: number;
  isFolder?: boolean;
}

const FileNode = ({ name, comment, level = 0, isFolder = true }: FileNodeProps) => (
  <div className="flex items-center group py-2 px-4 hover:bg-slate-800/50 transition-all border-b border-slate-800/50 last:border-0" dir="ltr">
    <div className="flex items-center flex-1">
      {Array(level).fill(0).map((_, i) => (
        <div key={i} className="w-6 h-6 border-l border-slate-700 ml-2 opacity-50" />
      ))}
      {isFolder ? (
        <Folder size={16} className="text-blue-400 mr-2 shrink-0" />
      ) : (
        <File size={16} className="text-slate-500 mr-2 shrink-0" />
      )}
      <span className="text-slate-200 font-mono text-xs font-medium tracking-tight">
        {name}
      </span>
    </div>
    <div className="flex-1 text-right" dir="rtl">
      <span className="text-slate-500 text-[11px] font-sans group-hover:text-slate-400 transition-colors italic">
        {comment}
      </span>
    </div>
  </div>
);

export default function Chapter18() {
  return (
    <ChapterLayout courseId="python" currentChapterId={18}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="roadmap" line="התבנית שתחזור אליה בכל פרויקט" width={160} accent={EMERALD_ACCENT} bubbleSide="bottom" />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Cpu size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Architecture & Scalability</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                סיכום הנדסי: בניית תשתית למוצר AI
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                הגענו לקו הסיום של מסלול פייתון ל-AI. בפרק זה נלמד כיצד לאגד את כל היכולות שרכשנו לכדי שלד (Skeleton) מקצועי. המטרה היא לעבור מכתיבת פונקציות בודדות לבניית מערכת חסינה, מודולרית וברת-הרחבה שניתן להפעיל בסביבות עבודה אמיתיות.
            </p>
        </section>
        </div>

        <div className="space-y-20 text-right" dir="rtl">

            {/* --- Strategic Concept --- */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-r-4 border-emerald-500 pr-4">
                    <Boxes className="text-emerald-400" size={24} />
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">הפרדיגמה של הנדסת AI</h2>
                </div>
                <div className="text-slate-300 space-y-4 text-base leading-relaxed">
                    <p>
                        בניגוד לפיתוח תוכנה מסורתי, פרויקט AI מתאפיין בשלושה רכיבים דינמיים המשתנים בקצבים שונים: <strong>הלוגיקה</strong>, <strong>הנתונים</strong> ו<strong>המודל</strong>. ניהול ידני של הרכיבים הללו בתיקייה אחת מוביל במהירות לאובדן שליטה טכני.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                        <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                            <span className="text-emerald-400 font-bold block mb-1">1. הקוד (Logic)</span>
                            <p className="text-xs opacity-70">אלגוריתמי הניקוי, הטרנספורמציה והלוגיקה העסקית.</p>
                        </div>
                        <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                            <span className="text-blue-400 font-bold block mb-1">2. הנתונים (Data)</span>
                            <p className="text-xs opacity-70">דאטהסטים גולמיים ומעובדים הדורשים ניהול גרסאות נפרד.</p>
                        </div>
                        <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                            <span className="text-purple-400 font-bold block mb-1">3. המודל (Model)</span>
                            <p className="text-xs opacity-70">קובצי ה-Weights וה-Artifacts הנוצרים בתום תהליך האימון.</p>
                        </div>
                    </div>
                    <p>
                        הנדסת תוכנה איכותית ב-AI מבוססת על הפרדת תחומי אחריות. ככל שהרכיבים הללו יהיו מנותקים יותר זה מזה (Decoupled), כך המערכת תהיה גמישה יותר לשינויים עתידיים, כמו החלפת ספק ענן או שדרוג המודל המתמטי.
                    </p>
                </div>
            </section>

            {/* --- Project Anatomy Explorer --- */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-r-4 border-blue-500 pr-4">
                    <FolderTree className="text-blue-500" size={24} />
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">היררכיית קבצים תעשייתית</h2>
                </div>
                
                <p className="text-slate-400 text-sm italic">
                    זהו המבנה המקובל בצוותי הנדסת נתונים ו-ML. עבודה לפיו מבטיחה סדר הנדסי ושקיפות:
                </p>

                <div className="bg-[#020617] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                    <div className="p-2">
                        <FileNode name="project_root/" comment="שורש הפרויקט" level={0} />
                        <FileNode name="config/" comment="ניהול הגדרות - API Keys, Paths ופרמטרים" level={1} />
                        <FileNode name="settings.yaml" comment="קובץ הגדרות מרכזי" level={2} isFolder={false} />
                        <FileNode name="data/" comment="ניהול נתונים - מוחרג מניהול גרסאות הקוד (Git)" level={1} />
                        <FileNode name="raw/" comment="נתונים גולמיים - Immutable (קריאה בלבד)" level={2} />
                        <FileNode name="processed/" comment="נתונים מעובדים לאחר טרנספורמציה" level={2} />
                        <FileNode name="domain/" comment="לב המערכת - הלוגיקה המדעית והמודל העסקי" level={1} />
                        <FileNode name="src/" comment="Application Layer - הקוד שמחבר ומפעיל את הכל" level={1} />
                        <FileNode name="api/" comment="חשיפת היכולות כ-Service (FastAPI / Web)" level={2} />
                        <FileNode name="infrastructure/" comment="Adapters - חיבור לבסיסי נתונים ושירותי ענן" level={1} />
                        <FileNode name="models/" comment="Model Registry - שמירת Artifacts וגרסאות מודל" level={1} />
                        <FileNode name="tests/" comment="בקרת איכות - בדיקות יחידה ואינטגרציה אוטומטיות" level={1} />
                    </div>
                </div>
            </section>

            

            {/* --- In-Depth: Data Management --- */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-r-4 border-orange-500 pr-4">
                    <Database className="text-orange-500" size={24} />
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">עמוד תווך 1: שלמות הנתונים</h2>
                </div>
                <div className="text-slate-300 space-y-4 text-base leading-relaxed">
                    <h3 className="text-md font-bold text-white">הפרדה מבנית: Raw לעומת Processed</h3>
                    <p>
                        אחד האתגרים המרכזיים ב-AI הוא מניעת &quot;זיהום נתונים&quot; (Data Contamination). נתח את המקרה שבו סקריפט עיבוד משנה בטעות את נתוני המקור; במצב כזה, נאבד את היכולת להשוות את ביצועי המודל מול נקודת ייחוס אמינה.
                    </p>
                    <InsightBox type="warning" title="עקרון ה-Immutability">
                        נתוני המקור (Raw Data) הם רכיב מהותי במחקר. אין לבצע עליהם פעולות כתיבה. זרימת העבודה התקינה דורשת קריאה מ-`raw`, ביצוע עיבוד בזיכרון, וכתיבת התוצאה לתיקיית `processed`. זהו הבסיס למהימנות מדעית.
                    </InsightBox>
                    <h3 className="text-md font-bold text-white mt-4">ניהול גרסאות נתונים</h3>
                    <p>
                        Git תוכנן לניהול קוד (טקסט) והוא אינו יעיל בניהול קבצים בינאריים כבדים. העלאת דאטהסטים ל-Git תאט את סביבת העבודה ותקשה על ניהול הגרסאות. הפתרון ההנדסי הוא שימוש ב-<code>.gitignore</code> להחרגת נתונים, וניהול גרסאות הדאטה באמצעות כלים ייעודיים כמו DVC או אחסון ענן.
                    </p>
                </div>
                
            </section>

            {/* --- In-Depth: Decoupling --- */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-r-4 border-purple-500 pr-4">
                    <ShieldCheck className="text-purple-500" size={24} />
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">עמוד תווך 2: ניתוק תלויות (Decoupling)</h2>
                </div>
                <div className="text-slate-300 space-y-4 text-base leading-relaxed">
                    <p>
                        ארכיטקטורה יציבה מפרידה בין ה-&quot;מה&quot; (הלוגיקה) לבין ה-&quot;איך&quot; (התשתית). ניתוק תלויות (Decoupling) מבטיח ששינוי טכנולוגי לא יחלחל ללב המודל.
                    </p>
                    <div className="bg-slate-800/20 p-6 rounded-xl border border-slate-700 space-y-4">
                        <div className="flex items-start gap-4">
                            <Code2 className="text-blue-400 mt-1" size={20} />
                            <div>
                                <h4 className="text-white font-bold">שכבת ה-Domain</h4>
                                <p className="text-sm opacity-80 text-right">המיקוד כאן הוא בבעיה המדעית: ניתוח טקסט או חיזוי. הקוד כאן אינו מודע לשאלה האם הנתונים מגיעים מקובץ מקומי או מבסיס נתונים מרוחק.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 border-t border-slate-700 pt-4">
                            <Terminal className="text-emerald-400 mt-1" size={20} />
                            <div>
                                <h4 className="text-white font-bold">שכבת ה-Infrastructure</h4>
                                <p className="text-sm opacity-80 text-right">כאן מנוהלים ה&quot;פרטים הטכניים&quot;: התחברות לשרתים וניהול לוגים. אלו הם הצינורות שדרכם זורמים הנתונים אל ה-Domain.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </section>

            {/* --- In-Depth: CI/CD & Automation --- */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-r-4 border-indigo-500 pr-4">
                    <GitBranch className="text-indigo-500" size={24} />
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">עמוד תווך 3: אוטומציה ובקרת איכות</h2>
                </div>
                <div className="text-slate-300 space-y-4 text-base leading-relaxed">
                    <p>
                        מערכת AI מקצועית מחייבת תהליכי בדיקה אוטומטיים (CI/CD). מטרתם לוודא שכל עדכון קוד אינו פוגע בביצועי המערכת הקיימת.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
                        <div className="space-y-4">
                            <h4 className="text-white font-bold">תהליך עבודה הנדסי</h4>
                            <ul className="list-decimal list-inside space-y-2 text-sm opacity-80">
                                <li>ביצוע Push לשרת הניהול.</li>
                                <li>שרת אוטומציה בונה סביבת עבודה נקייה.</li>
                                <li>ביצוע בדיקות יחידה (Unit Tests).</li>
                                <li>אימות שלמות הנתונים ותקינות המודל.</li>
                            </ul>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 shadow-2xl" dir="ltr">
                            <StaticCodeBlock language="yaml" code={`name: Quality Assurance\non: [push]\njobs:\n  run_tests:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pip install -r requirements.txt\n      - run: pytest tests/`} />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Finale --- */}
            <section className="py-20 text-center border-t border-slate-800">
                <div className="relative inline-block mb-6">
                    <div className="absolute -inset-8 bg-emerald-500/10 blur-3xl rounded-full" />
                    <CheckCircle2 size={64} className="relative text-emerald-400 mx-auto animate-pulse" />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight mb-4">המסע הושלם. המשימה מתחילה.</h2>
                <p className="text-base text-slate-400 max-w-4xl mx-auto leading-relaxed mb-10">
                    למדתם את היסודות והארכיטקטורה הנדרשת. מהיום, הידע שצברתם מאפשר לכם לבנות מערכות בינה מלאכותית שלמות ויציבות. הקוד הוא הכלי, והארכיטקטורה היא הדרך להשגת פתרונות משמעותיים.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-base transition-all shadow-lg hover:scale-105">
                        <Share2 size={18} /> שיתוף הצלחה
                    </button>
                </div>
            </section>

        </div>

        <section className="mt-20">
            <Quiz 
                title="מבחן ארכיטקטורה מסכם"
                questions={[
                    {
                        id: 1,
                        question: "מהי המטרה העיקרית של הפרדת שכבת ה-Domain משכבת ה-Infrastructure?",
                        options: [
                            "להפוך את מבנה הפרויקט ליפה יותר",
                            "לאפשר תחזוקה של הלוגיקה המדעית ללא תלות בטכנולוגיות התשתית",
                            "לצמצם את כמות שורות הקוד בפרויקט",
                            "זוהי דרישה טכנית של שפת פייתון"
                        ],
                        correctAnswer: 1,
                        explanation: "ניתוק תלויות (Decoupling) מאפשר גמישות ועדכון רכיבים טכנולוגיים ללא סיכון ליבת המערכת."
                    },
                    {
                        id: 2,
                        question: "מדוע נתוני מקור (Raw Data) נחשבים לערך מהותי שאין לשנותו?",
                        options: [
                            "כדי להבטיח את היכולת לשחזר ניסויים (Reproducibility) ולמנוע זיהום נתונים",
                            "כדי לחסוך מקום באחסון הנתונים",
                            "כי פייתון אינה מאפשרת כתיבה לקבצי מקור",
                            "אין לכך סיבה הנדסית ממשית"
                        ],
                        correctAnswer: 1,
                        explanation: "נתונים גולמיים מהווים את נקודת הייחוס לכל עיבוד עתידי; שינוי שלהם פוגע באמינות המחקר והתוצאות."
                    }
                ]} 
            />
        </section>

    </ChapterLayout>
  );
}