"use client";

import React from 'react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { StaticCodeBlock } from '@/components/content/StaticCodeBlock';
import { Quiz } from '@/components/content/Quiz';
import { VenvSimulator, ConfigComparator } from '@/components/demos/chapter-6';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';
import { 
    Box, ShieldCheck, Terminal, FileCode, Lock, 
    Layers, GitBranch 
} from 'lucide-react';

export default function Chapter6() {

  // --- Code Snippets & Simulated Outputs ---

  const venvCommands = `# Windows
.\\.venv\\Scripts\\activate

# Mac / Linux
source .venv/bin/activate`;

  const venvOutput = `(.venv) C:\\Projects\\MyProject> _
(Environment Activated)`;

  const pipInstallCode = `# התקנת חבילות
pip install numpy fastapi

# שמירת המצב לקובץ
pip freeze > requirements.txt

# התקנה במחשב חדש
pip install -r requirements.txt`;

  const pipOutput = `Installing collected packages: numpy, fastapi
Successfully installed numpy-2.1.1 fastapi-0.115.0
Saved requirements.txt`;

  const poetryInstallCode = `# התקנה (חד פעמי)
curl -sSL https://install.python-poetry.org | python3 -

# יצירת פרויקט חדש
poetry init --name my-project

# הוספת ספרייה (מנהל הכל לבד)
poetry add fastapi numpy

# הרצת סקריפט בתוך הסביבה
poetry run python main.py`;

  const poetryOutput = `Created package my-project in .
Using version ^0.115.0 for fastapi
Using version ^2.1.1 for numpy
Updating dependencies...
Writing lock file
Done.`;

  const poetryGroupsCode = `# הוספת כלי פיתוח בלבד (לא יותקנו בפרודקשן)
poetry add --group dev pytest black

# התקנה לשרת (ללא כלי פיתוח)
poetry install --without dev`;

  const poetryGroupsOutput = `Adding pytest to group 'dev'
Adding black to group 'dev'
Installing dependencies (excluding dev)...
Done.`;

  const gitIgnoreCode = `# .gitignore מומלץ לפייתון
.venv/
__pycache__/
*.pyc
.env
poetry.lock  # (ב-pip שומרים requirements, ב-poetry שומרים lock)
`;
  
  // הוספתי פלט "וירטואלי" כדי לאפשר את כפתור ההרצה להמחשה
  const gitIgnoreOutput = `File .gitignore saved.
Git will now ignore .venv and secrets.`;

  // --- Quiz ---
  const questions = [
    {
        id: 1,
        question: "מדוע קריטי להשתמש בסביבה וירטואלית (Virtual Environment)?",
        options: [
            "זה גורם לפייתון לרוץ מהר יותר",
            "זה יוצר 'בועה' מבודדת שמונעת התנגשויות בין גרסאות של פרויקטים שונים",
            "זה חוסך מקום בדיסק הקשיח",
            "זה נדרש רק אם עובדים על ווינדוס"
        ],
        correctAnswer: 1,
        explanation: "סביבה וירטואלית מבודדת את התלויות של הפרויקט מהמערכת הראשית. זה מבטיח שמה שעובד אצלך יעבוד גם אצל אחרים, ללא תלות במה שמותקן אצלם במחשב."
    },
    {
        id: 2,
        question: "מה ההבדל העיקרי בין requirements.txt ל-pyproject.toml?",
        options: [
            "אין הבדל, זה אותו קובץ בשם אחר",
            "requirements.txt מתעד מצב קיים (העבר), בעוד pyproject.toml מגדיר חוזה ודרישות (העתיד)",
            "pyproject.toml מיועד רק למערכות לינוקס",
            "requirements.txt יודע לנהל גרסאות פיתוח (dev) בנפרד"
        ],
        correctAnswer: 1,
        explanation: "requirements.txt הוא רשימה שטוחה של מה שמותקן כרגע. pyproject.toml הוא קובץ קונפיגורציה מודרני שמגדיר מטא-דאטה, תלויות ראשיות, קבוצות פיתוח והגדרות בנייה."
    },
    {
        id: 3,
        question: "איזה קובץ אסור בשום אופן להכניס ל-Git?",
        options: [
            "pyproject.toml",
            "requirements.txt",
            ".env (קובץ משתני סביבה וסודות)",
            "README.md"
        ],
        correctAnswer: 2,
        explanation: "קובץ .env מכיל מפתחות API וסיסמאות רגישות. העלאה שלו ל-Git היא פרצת אבטחה חמורה. יש להשתמש ב-.gitignore כדי למנוע זאת."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={6}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="token" line="כל פרויקט בבועה משלו" width={160} accent={EMERALD_ACCENT} bubbleSide="bottom" />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Box size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Environments & Dependencies</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                סביבות עבודה ותלויות
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                פייתון היא שפה עם אקו-סיסטם עצום. פרויקט אחד דורש PyTorch, אחר Django, ושלישי גרסה ישנה של NumPy.
                כשמתקינים הכל במקום אחד - נוצר כאוס.
                <br/>
                הפרק הזה עוסק ביצירת &quot;בועות&quot; מבודדות (Virtual Environments) ובניהול חכם של ספריות.
            </p>
        </section>
        </div>

        {/* --- 1. Virtual Environments (venv) --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <ShieldCheck size={24} className="text-blue-500"/>
                venv: הבועה המבודדת
            </h3>
            
            <p className="text-slate-300">
                לפני שכותבים שורת קוד אחת - יוצרים סביבה.
                <code>venv</code> הוא הכלי המובנה שיוצר עותק פרטי של פייתון עבור הפרויקט שלך.
            </p>

            {/* Interactive Venv Simulator */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>סימולטור טרמינל:</strong> נסה להתקין חבילה גלובלית, ואז צור סביבה, הפעל אותה, ותראה לאן החבילות מגיעות.
                </p>
                <VenvSimulator />
            </div>

            <StaticCodeBlock language="bash" 
                code={venvCommands} 
                output={venvOutput}
            />
            
            <InsightBox type="info" title="VS Code Tip">
                ברגע שתיצור תיקיית <code>.venv</code>, העורך יזהה אותה ויציע לך לבחור בה כ-Interpreter. אשר זאת כדי לקבל השלמות קוד נכונות.
            </InsightBox>
        </section>

        {/* --- 2. pip & requirements.txt --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <Terminal size={24} className="text-yellow-500"/>
                pip: מנהל החבילות הקלאסי
            </h3>
            
            <p className="text-slate-300">
                <code>pip</code> הוא הכלי שמתקין חבילות מהאינטרנט. כדי לזכור מה התקנו, אנחנו שומרים את הרשימה לקובץ.
            </p>
            
            <StaticCodeBlock language="bash" 
                code={pipInstallCode} 
                output={pipOutput}
            />
        </section>

        {/* --- 3. Poetry: The Modern Way --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-purple-500 pr-4 flex items-center gap-2">
                <FileCode size={24} className="text-purple-500"/>
                Poetry: ניהול מודרני וחכם
            </h3>
            
            <div className="prose prose-invert text-slate-300 leading-8">
                <p>
                    השילוב של pip ו-requirements.txt עובד, אבל הוא מיושן.
                    <strong>Poetry</strong> הוא כלי הכל-ב-אחד: הוא מנהל את הסביבה הווירטואלית, פותר התנגשויות גרסאות, ומפריד בין כלי פיתוח (Dev) לפרודקשן.
                </p>
            </div>

            <StaticCodeBlock language="bash" 
                code={poetryInstallCode} 
                output={poetryOutput}
            />

            <h4 className="text-xl font-bold text-white mt-6">requirements.txt מול pyproject.toml</h4>
            <p className="text-slate-300 text-sm mb-4">
                ההבדל הוא בגישה: האם אנחנו מתעדים את העבר (מה הותקן), או מגדירים את העתיד (מה הפרויקט צריך).
            </p>
            
            {/* Interactive Config Comparator */}
            <div className="mt-4">
                <ConfigComparator />
            </div>

            <StaticCodeBlock language="bash" 
                code={poetryGroupsCode} 
                output={poetryGroupsOutput}
            />
        </section>

        {/* --- 4. Best Practices (.gitignore & .env) --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-red-500 pr-4 flex items-center gap-2">
                <Lock size={24} className="text-red-500"/>
                Best Practices: ניקיון ואבטחה
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <GitBranch size={18} className="text-orange-400"/> .gitignore
                    </h4>
                    <p className="text-slate-300 text-sm mb-2">
                        לעולם אל תעלה את תיקיית <code>.venv</code> או קבצים זמניים ל-Git.
                    </p>
                    <StaticCodeBlock language="bash" 
                        code={gitIgnoreCode} 
                        output={gitIgnoreOutput}
                    />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Lock size={18} className="text-emerald-400"/> סודות (.env)
                    </h4>
                    <p className="text-slate-300 text-sm mb-2">
                        מפתחות API וסיסמאות נשמרים בקובץ <code>.env</code> מקומי שלא עולה לגיט.
                        טוענים אותם בקוד בעזרת <code>python-dotenv</code>.
                    </p>
                    <InsightBox type="warning" title="אבטחת מידע">
                        אם העלית בטעות מפתח API לגיט - מחק אותו וצור חדש מיד. הבוטים סורקים את גיטהאב בשניות.
                    </InsightBox>
                </div>
            </div>
        </section>

        {/* --- 5. Summary --- */}
        <section className="mt-24 bg-linear-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-6 text-white justify-center">
                <Layers className="text-emerald-400" />
                <h2 className="text-2xl font-bold">סיכום: במה לבחור?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
                    <h4 className="text-blue-400 font-bold mb-2">סקריפט אישי</h4>
                    <p className="text-slate-400 text-sm">venv + pip</p>
                    <p className="text-xs text-slate-500 mt-1">פשוט, מהיר, מובנה.</p>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-2 py-0.5">מומלץ</div>
                    <h4 className="text-emerald-400 font-bold mb-2">פרויקט צוות / AI</h4>
                    <p className="text-slate-400 text-sm">Poetry</p>
                    <p className="text-xs text-slate-500 mt-1">נעילת גרסאות, ניהול חכם.</p>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
                    <h4 className="text-purple-400 font-bold mb-2">Deployment</h4>
                    <p className="text-slate-400 text-sm">Docker</p>
                    <p className="text-xs text-slate-500 mt-1">אריזה מלאה של המערכת.</p>
                </div>
            </div>
        </section>

        {/* --- Quiz --- */}
        <section className="mt-20">
            <Quiz questions={questions} title="מבדק ידע - פרק 6" />
        </section>

    </ChapterLayout>
  );
}