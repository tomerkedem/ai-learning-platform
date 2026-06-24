"use client";

import React from 'react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';
import { Quiz } from '@/components/content/Quiz';

import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';
import { CLITerminalSim, ArgparseVsTyper } from '@/components/demos/chapter-16';
import { 
    Terminal as TerminalIcon, Zap, 
    Settings, Share2, Box, Download, ArrowRightLeft, ShieldCheck
} from 'lucide-react';
import dynamic from 'next/dynamic';

export default function Chapter16() {

    // Import the editor with SSR disabled
const LiveCodeEditor = dynamic(() => import('@/components/content/LiveCodeEditor').then(mod => mod.LiveCodeEditor), { 
  ssr: false,
  loading: () => <div className="h-40 w-full bg-slate-900 animate-pulse rounded-xl" /> // Optional placeholder
});
  // סימולציות להרצת קוד
  const simulateArgparse = (userCode: string) => {
    if (userCode.includes("--help") || userCode.includes("-h")) {
      return `usage: clean_text.py [-h] [--lang LANG] input output\n\nClean text before AI processing\n\npositional arguments:\n  input       Path to the source file\n  output      Path to save the result\n\noptions:\n  -h, --help  show this help message and exit\n  --lang LANG Text language (he or en)`;
    }
    return `✅ Parsing successful.\nVariables loaded from CLI: input="data/raw.csv", output="data/clean.csv", lang="en"`;
  };

  const simulateTyper = (userCode: string) => {
    if (userCode.includes("--help")) {
      return `Usage: main.py clean [OPTIONS] INPUT OUTPUT\n\nArguments:\n  INPUT   [required]\n  OUTPUT  [required]\n\nOptions:\n  --lang TEXT  Text language [default: he]`;
    }
    return `🚀 Typer App Running...\n✨ Function 'clean' triggered via Type Hints.\nInput validated as Path object.`;
  };

  return (
    <ChapterLayout courseId="python" currentChapterId={16}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="type" line="הופכים סקריפט לכלי אמיתי" width={160} accent={EMERALD_ACCENT} />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <TerminalIcon size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">CLI & Software Architecture</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                ממשק שורת פקודה (CLI)
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                בפרויקטי AI, גם הקוד הכי חכם חסר ערך אם אי אפשר להפעיל אותו בקלות. ממשק שורת הפקודה (CLI) הוא הדרך להפוך קוד גולמי לכלי אמיתי - כזה שאפשר להריץ, לבדוק ולשלב בתהליכים אחרים בלי לפתוח את העורך.
            </p>
        </section>
        </div>

        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-2">
                <TerminalIcon size={24} className="text-emerald-400" />
                למה CLI חשוב בפרויקטי AI?
            </h3>
            <div className="bg-slate-800/50 p-6 rounded-xl space-y-4 shadow-xl border border-slate-700">
                <p className="text-slate-300 leading-relaxed">
                    CLI הוא לא שריד מעולם ישן, אלא שכבת השליטה הטבעית של פרויקטים חכמים. הוא מעניק דרך יציבה, מהירה ואחידה להפעיל תהליכים. בין אם מדובר בהרצת מודלים, ניקוי טקסטים או ניתוח נתונים.
                </p>
                <p className="text-slate-300 leading-relaxed">
                    נניח שבניתם כלי שמנקה טקסטים לפני שליחה למודל. בלי CLI, צריך לפתוח את הקובץ ולהריץ פונקציות מתוך הקוד. עם CLI, זה נראה כך:
                </p>
                <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700 font-mono text-sm text-emerald-400" dir="ltr">
                    $ mintx clean data/articles.csv --lang he
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-start gap-3 bg-slate-900/40 p-4 rounded border border-slate-800">
                        <Zap size={18} className="text-yellow-400 shrink-0 mt-1" />
                        <div>
                            <h4 className="text-white font-bold text-sm">אוטומציה קלה</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">כל פקודת CLI ניתנת לשילוב ישיר בתוך scripts, pipelines או cron jobs. כך בונים מערכות שעובדות לבד.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 bg-slate-900/40 p-4 rounded border border-slate-800">
                        <Share2 size={18} className="text-blue-400 shrink-0 mt-1" />
                        <div>
                            <h4 className="text-white font-bold text-sm">עקביות ונוחות לשיתוף</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">אותה פקודה עובדת בלפטופ, בענן או ב-Docker. אפשר למסור את הכלי לאחרים בלי שהם יצטרכו לדעת איך הוא כתוב.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- 1. Routing & Logic Flow --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <ArrowRightLeft size={24} className="text-blue-500"/>
                איך הפקודה מגיעה לקוד? (Routing)
            </h3>
            <p className="text-slate-300 leading-relaxed">
                בסופו של דבר, CLI הוא המפתח שהופך קוד לריצה אמיתית. הוא מפריד בין הלוגיקה העסקית לבין דרך ההפעלה. כשאתם מקלידים פקודה, ה-CLI מפרק את המחרוזת ומנתב אותה לפונקציה הרלוונטית.
            </p>
            
            <div className="mt-6">
                <CLITerminalSim />
                <p className="text-xs text-slate-500 mt-2 text-center italic font-mono">
                    Try typing: mintx clean data.csv --lang en
                </p>
            </div>
        </section>

        {/* --- 2. argparse Section --- */}
        <section className="mt-24 space-y-8">
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white border-r-4 border-slate-500 pr-4 flex items-center gap-2">
                    <Settings size={24} className="text-slate-500"/>
                    argparse – הכלי המובנה
                </h3>
                <p className="text-slate-300 leading-relaxed">
                    כשמריצים סקריפט פייתון (לדוגמה: <code>python clean_text.py</code>), הקובץ רץ, אבל אין לו מושג מאיפה לקרוא קובץ או לאן לשמור. כדי להפעיל את הסקריפט עם קלטים שונים מבלי לשנות את הקוד בכל פעם, נצטרך את <strong>argparse</strong>.
                </p>
                <p className="text-slate-300">
                    זו מערכת קטנה ומובנית בפייתון שתפקידה אחד: לאפשר לקוד שלך להבין פקודות מהמשתמש בדיוק כמו שעושים כלים כמו git או docker.
                </p>
            </div>

            <InsightBox type="warning" title="למה לא להסתפק ב-sys.argv?">
                <p className="text-sm leading-relaxed">
                    בלי argparse, הדרך היחידה לדעת מה המשתמש כתב היא לבדוק את <code>sys.argv</code>. זה שביר ומסורבל. אם המשתמש שכח פרמטר - הקוד יקרוס. 
                    argparse פותרת את זה: היא בודקת תקינות, מפרשת את כל הדגלים (Flags), ומייצרת עזרה אוטומטית (<code>--help</code>).
                </p>
            </InsightBox>

            <LiveCodeEditor 
                initialCode={`import argparse

# argparse היא המוח שמתרגם את מה שכתבת בשורת הפקודה לערכים בקוד
parser = argparse.ArgumentParser(description="Clean text before AI processing")
parser.add_argument("input", help="Path to the source file")
parser.add_argument("output", help="Path to save the result")
parser.add_argument("--lang", default="he", help="Text language (he or en)")

args = parser.parse_args()
# כעת הפקודה --lang en הופכת למשתנה args.lang
print(f"Reading from {args.input}...")`}
                onRun={simulateArgparse}
            />
            <p className="text-slate-400 text-sm italic border-r border-slate-700 pr-4">
                אם תכתבו סקריפט בלי argparse – יש לכם קוד. עם argparse – יש לכם כלי אמיתי.
            </p>
        </section>

        {/* --- 3. Typer Section --- */}
        <section className="mt-24 space-y-8">
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white border-r-4 border-purple-500 pr-4 flex items-center gap-2">
                    <Zap size={24} className="text-purple-500"/>
                    Typer – הכלי המודרני
                </h3>
                <p className="text-slate-300 leading-relaxed">
                    אם argparse היא הוותיקה והאמינה, אז <strong>Typer</strong> היא הדור החדש. היא נבנתה על ידי יוצר FastAPI במטרה אחת: לאפשר למתכנתים לבנות ממשקי CLI חכמים תוך שימוש ב-<strong>Type Hints</strong>.
                </p>
                <p className="text-slate-300">
                    בעוד ש-argparse מחייבת להגדיר כל פרמטר ידנית, Typer מזהה את סוג המשתנים שלך מהפונקציה עצמה:
                </p>
            </div>

            <ArgparseVsTyper />

            <div className="space-y-4">
                <h4 className="font-bold text-white flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-400"/> קוד שנראה כמו API:</h4>
                <p className="text-slate-400 text-sm">
                    שימו לב איך בדוגמה למטה, <code>@app.command()</code> הופך כל פונקציה לפקודה. Typer קוראת את ה-Docstring והופכת אותו לתיעוד הרשמי של הכלי.
                </p>
                <LiveCodeEditor 
                    initialCode={`import typer
from pathlib import Path

app = typer.Typer(help="Modern AI CLI")

@app.command()
def clean(input: Path, output: Path, lang: str = "he"):
    """
    Clean text from an input file and save it to an output file.
    Typer checks if 'input' is a valid path automatically!
    """
    typer.echo(f"Processing {input} in language {lang}")

if __name__ == "__main__":
    app()`}
                    onRun={simulateTyper}
                />
            </div>
        </section>

        {/* --- 4. Deployment: Making it Global --- */}
        <section className="mt-24 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <Download size={24} className="text-yellow-500"/>
                התקנה והפצה: להפוך סקריפט לפקודה גלובלית
            </h3>
            <div className="space-y-4 text-slate-300">
                <p>
                    כדי שהכלי שלכם יהיה שימושי באמת, אתם רוצים להריץ אותו כפקודה (כמו <code>mintx</code>) ולא כקובץ פייתון. עושים זאת על ידי הגדרת <strong>entry points</strong> בקובץ ההגדרות של הפרויקט:
                </p>
                
                <LiveCodeEditor
                initialCode={`[project.scripts]\nmintx = "mintx.main:app"`}
            />
                
                <p>
                    לאחר מכן, התקנה במצב {`"עריכה"`} (Editable) תאפשר לכם להריץ את הפקודה מכל מקום במחשב, בעוד שהשינויים בקוד יתעדכנו מיידית:
                </p>
                <div className="bg-slate-900 p-4 rounded font-mono text-sm text-yellow-500 border border-slate-800" dir="ltr">
                    $ pip install -e .
                </div>
            </div>
        </section>

        {/* --- 5. Exit Codes --- */}
        <section className="mt-24 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-orange-500 pr-4 flex items-center gap-2">
                <Box size={24} className="text-orange-500"/>
                קודי יציאה (Exit Codes) – מדוע 0 חשוב כל כך?
            </h3>
            <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                    מאחורי הקלעים, כל תוכנית CLI מסיימת עם קוד יציאה - מספר שמסמן למערכת האם הפעולה הצליחה. זהו הקו שמפריד בין תהליך תקין לשגוי באוטומציה ו-pipelines.
                </p>
                <ul className="list-disc list-inside space-y-3 bg-slate-900/40 p-6 rounded-xl border border-slate-800">
                    <li><strong className="text-emerald-400">0 – הצלחה:</strong> הכל עבר בשלום, ה-CI יכול להמשיך לשלב הבא.</li>
                    <li><strong className="text-red-400">כל מספר אחר (1-255) – שגיאה:</strong> המערכת תזהה את הכשל ותעצור את ה-Pipeline מיד.</li>
                </ul>
                <LiveCodeEditor
                initialCode={`if not file.endswith(".csv"):\n    typer.echo("Error: CSV only")\n    raise typer.Exit(code=1)\n\nraise typer.Exit(code=0) # Success`}
            />
            </div>
        </section>

        {/* --- Best Practices --- */}
        <section className="mt-24 bg-linear-to-br from-slate-900 to-slate-800 p-10 rounded-2xl border border-slate-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-8">
                <Share2 className="text-blue-400" />
                Best Practices לעיצוב ממשק CLI מקצועי
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-slate-300">
                <div className="space-y-3">
                    <h4 className="font-bold text-white text-lg underline decoration-blue-500 underline-offset-4">שמות ברורים ו-Defaults הגיוניים</h4>
                    <p className="text-sm">בחרו פעלים קצרים (<code>train, serve</code>). הגדירו ברירות מחדל טובות (כמו <code>lang=&quot;he&quot;</code>) שחוסכות הקלדה ומונעות תקלות.</p>
                </div>
                <div className="space-y-3">
                    <h4 className="font-bold text-white text-lg underline decoration-blue-500 underline-offset-4">פרמטרים אינטואיטיביים</h4>
                    <p className="text-sm">השתמשו בשמות מלאים (<code>--input</code>) במקום קיצורים מבלבלים (<code>-in</code>). הבהירות מבטיחה שימוש נכון לאורך זמן.</p>
                </div>
                <div className="space-y-3">
                    <h4 className="font-bold text-white text-lg underline decoration-blue-500 underline-offset-4">הודעות פלט (Feedback)</h4>
                    <p className="text-sm">CLI נוח גם מדבר יפה. אל תשארו שקטים מדי - ספרו למשתמש מה בדיוק קרה (למשל: {`"Cleaned 324 lines"`}).</p>
                </div>
                <div className="space-y-3">
                    <h4 className="font-bold text-white text-lg underline decoration-blue-500 underline-offset-4">קונסיסטנטיות</h4>
                    <p className="text-sm">שמרו על אחידות בין פקודות. משתמש שמכיר פקודה אחת, צריך להבין את ההגיון של כל שאר הפקודות בכלי שלכם.</p>
                </div>
            </div>
        </section>

        {/* --- Conclusion --- */}
        <section className="mt-24 space-y-6">
            <h3 className="text-2xl font-bold text-white">סיכום: להפוך קוד למוצר נגיש</h3>
            <p className="text-slate-300 leading-relaxed">
                CLI הוא לא קישוט, אלא שכבת שליטה שמעניקה לקוד שלכם חיים אמיתיים מחוץ לעורך. בעולם של AI, שבו סקריפטים מתמזגים עם תהליכים אוטומטיים, זה ההבדל בין קוד שעובד רק אצלכם לבין כלי שיכול לעבוד בכל מקום.
            </p>
            <p className="text-slate-300 leading-relaxed font-bold italic border-r-4 border-emerald-500 pr-4">
                הכוח האמיתי של CLI הוא בפשטות: פקודה אחת, פרמטר אחד, והרבה בהירות. כשכלי ה-AI שלכם מגיע לשלב שבו אחרים צריכים להריץ אותו - CLI הוא הדרך המקצועית ביותר לעשות זאת.
            </p>
        </section>

        <section className="mt-20">
            <Quiz 
                title="מבדק ידע - פרק 16"
                questions={[
                    {
                        id: 1,
                        question: "מדוע קודי יציאה (Exit Codes) הם קריטיים באוטומציה?",
                        options: [
                            "כדי שהמשתמש יראה שהקוד הסתיים",
                            "כדי לאפשר למערכות חיצוניות (Scripts/CI) לזהות הצלחה או כישלון באופן אוטומטי",
                            "הם משמשים רק ב-Windows",
                            "הם גורמים לקוד לרוץ מהר יותר"
                        ],
                        correctAnswer: 1,
                        explanation: "קודי יציאה מאפשרים לשרשר פקודות (למשל: &&) ולעצור את הריצה אם אחד השלבים נכשל."
                    }
                ]} 
            />
        </section>

    </ChapterLayout>
  );
}