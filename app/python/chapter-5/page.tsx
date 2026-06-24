"use client";

import React from 'react';

import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { Quiz } from '@/components/content/Quiz';
import { ProjectStructureDemo, NameMainDemo } from '@/components/demos/chapter-5';
import { 
    Package, LayoutTemplate, FileJson, FolderTree, 
    Share2, Terminal, ShieldAlert, Library
} from 'lucide-react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';

export default function Chapter5() {

  // --- Code Snippets ---

  const importMathCode = `import math
print(math.sqrt(16))  # 4.0

from math import sqrt
print(sqrt(25))       # 5.0`;
  const importMathOutput = `4.0\n5.0`;

  const importAliasCode = `import numpy as np
import pandas as pd

# הקוד נקי ואחיד
print("Aliases loaded successfully")`;
  const importAliasOutput = `Aliases loaded successfully`;

  const absoluteVsRelativeCode = `# Absolute Import (מומלץ)
from my_package.utils import normalize

# Relative Import (בתוך החבילה)
from ..utils import normalize`;

  const docstringModuleCode = `"""
text tools
Utility functions for text processing.

Basic usage:
    from my_package import normalize
    s = normalize(" Hello world ")
"""

__all__ = ["normalize"]

def normalize(text):
    return text.strip()`;

  

  // --- Quiz ---
  const questions = [
    {
        id: 1,
        question: "מהו התפקיד של הקובץ __init__.py?",
        options: [
            "הוא מכיל את הגדרות המערכת של המחשב",
            "הוא הופך תיקייה רגילה לחבילת פייתון (Package) ומגדיר מה נחשף החוצה",
            "הוא מוחק קבצים זמניים באופן אוטומטי",
            "אין לו משמעות בגרסאות פייתון חדשות"
        ],
        correctAnswer: 1,
        explanation: "קובץ __init__.py מסמן לפייתון שתיקייה היא חבילה (Package), ובתוכו ניתן להגדיר אילו פונקציות או מודולים יהיו זמינים למשתמש בעת ביצוע import."
    },
    {
        id: 2,
        question: "מתי הקוד בתוך 'if __name__ == \"__main__\":' ירוץ?",
        options: [
            "תמיד, בכל פעם שהקובץ נטען",
            "רק כאשר מריצים את הקובץ ישירות (כסקריפט), ולא כשמייבאים אותו",
            "רק כאשר יש שגיאה בקוד",
            "אף פעם, זו הערה בלבד"
        ],
        correctAnswer: 1,
        explanation: "זהו מנגנון שנועד להפריד בין קוד ספרייה (פונקציות) לבין קוד הרצה (סקריפט). הבלוק ירוץ רק אם הקובץ הוא נקודת הכניסה הראשית."
    },
    {
        id: 3,
        question: "מדוע עדיף להשתמש ב-Absolute Imports בפרויקטים גדולים?",
        options: [
            "כי זה מהיר יותר לריצה",
            "כי זה קצר יותר לכתיבה",
            "כי זה הופך את הקוד לברור יותר ומונע בלבול לגבי מקור הקובץ",
            "פייתון לא תומכת ב-Relative Imports"
        ],
        correctAnswer: 2,
        explanation: "ייבוא מוחלט (Absolute) מציין את הנתיב המלא משורש הפרויקט, מה שהופך את הקוד לקריא יותר ומונע שגיאות כשמעבירים קבצים ממקום למקום."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={5}>
        
        {/* --- Hero Section --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="roadmap" line="ארגון נכון = פרויקט שגדל בלי כאב" width={160} accent={EMERALD_ACCENT} />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-yellow-400 mb-2">
                <Package size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Architecture & Modules</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                מודולים, חבילות וארגון פרויקט
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                כל מתכנת מתחיל את דרכו עם קובץ יחיד <code>main.py</code>. זה עובד מצוין לניסויים, אבל כשמערכת גדלה, הבלגן חוגג.
                <br/>
                הפתרון הוא לא &quot;פחות קוד&quot;, אלא קוד מחולק נכון. בפרק זה נלמד איך להפוך אוסף סקריפטים למערכת הנדסית.
            </p>
        </section>
        </div>

        {/* --- 1. Imports --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <Share2 size={24} className="text-blue-500"/>
                Imports בסיסיים
            </h3>
            
            <p className="text-slate-300">
                מודול הוא פשוט קובץ פייתון. במקום לכתוב את הכול שוב ושוב, אנחנו מייבאים את מה שצריך.
                במערכות AI זה קריטי לשילוב כלים (cleaner, tokenizer, stats) בצורה נקייה.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
                <LiveCodeEditor
                initialCode={importMathCode}
            />
                <LiveCodeEditor
                initialCode={importAliasCode}
            />
            </div>
        </section>

        {/* --- 2. מבנה פרויקט (Project Structure) --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-2">
                <FolderTree size={24} className="text-emerald-500"/>
                מבנה תיקיות מומלץ (Production Ready)
            </h3>
            
            <p className="text-slate-300">
                כשהפרויקט גדל, חייבים סדר. תיקיית <code>src</code> לקוד המקור, <code>scripts</code> להרצות, ו-<code>tests</code> לבדיקות.
                <br/>
                הדגמה זו מראה מבנה של חבילה בשם <code>mini_text</code>. נסה ללחוץ על הקבצים כדי לראות את הקוד בפנים.
            </p>

            

            {/* Interactive File Explorer */}
            <div className="mt-6">
                <ProjectStructureDemo />
            </div>

            <InsightBox type="info" title="למה src?">
                שימוש בתיקיית <code>src/</code> מונע התנגשויות (Import conflicts) בין הקוד שלך לבין חבילות מותקנות,
                ומכריח אותך להתקין את החבילה בצורה מסודרת.
            </InsightBox>
        </section>

        {/* --- 3. Imports יחסיים מול מוחלטים --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-purple-500 pr-4 flex items-center gap-2">
                <LayoutTemplate size={24} className="text-purple-500"/>
                Absolute vs Relative Imports
            </h3>
            
            <p className="text-slate-300">
                <strong>ייבוא מוחלט:</strong> מציין את הנתיב המלא. ברור ומומלץ.
                <br/>
                <strong>ייבוא יחסי:</strong> משתמש בנקודות (<code>..</code>) כדי לנווט. טוב לשימוש פנימי בתוך חבילה.
            </p>
            
            <LiveCodeEditor
                initialCode={absoluteVsRelativeCode}
            />
        </section>

        {/* --- 4. Docstrings --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-pink-500 pr-4 flex items-center gap-2">
                <FileJson size={24} className="text-pink-500"/>
                Docstrings ברמת מודול
            </h3>
            
            <p className="text-slate-300">
                תיעוד הוא לא רק לפונקציות. בראש כל קובץ צריך להיות הסבר קצר: מה הקובץ עושה ואיך משתמשים בו.
            </p>
            <LiveCodeEditor
                initialCode={docstringModuleCode}
            />
        </section>

        {/* --- 5. __name__ == "__main__" --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-orange-500 pr-4 flex items-center gap-2">
                <Terminal size={24} className="text-orange-500"/>
                הפרדה בין מודול להרצה
            </h3>
            
            <p className="text-slate-300">
                בפייתון, כל קובץ הוא גם מודול שאפשר לייבא, וגם סקריפט שאפשר להריץ.
                התנאי <code>if __name__ == &quot;__main__&quot;:</code> הוא השער שקובע מה ירוץ מתי.
            </p>

            

            {/* Interactive Execution Context Demo */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2">
                    <strong>נסה בעצמך:</strong> לחץ על הכפתורים כדי לראות את ההבדל בפלט בין הרצה ישירה לייבוא.
                </p>
                <NameMainDemo />
            </div>
        </section>

        {/* --- 6. Best Practices --- */}
        <section className="mt-20 space-y-6">
            <h3 className="text-2xl font-bold text-white border-r-4 border-indigo-500 pr-4 flex items-center gap-2">
                <ShieldAlert size={24} className="text-indigo-500"/>
                סיכום: Best Practices
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                        <Library size={18} className="text-indigo-400"/> אחריות יחידה (SRP)
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        כל קובץ עושה דבר אחד. <code>clean.py</code> מנקה, <code>tokenize.py</code> מפרק.
                        אם אתה גולל יותר מדי – פצל את הקובץ.
                    </p>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                        <FolderTree size={18} className="text-indigo-400"/> __init__.py נקי
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        השתמש בו כדי לחשוף החוצה רק את מה שחשוב (API ציבורי), והסתר את הלוגיקה הפנימית.
                    </p>
                </div>
            </div>

            <InsightBox type="intuition" title="לפני שאתה עושה Commit">
                שאל את עצמך: 1. אני מבין מיד מה כל קובץ עושה? 
                2. אני יודע מאיפה כל import מגיע? 
                3. אם אמחק פונקציה, ברור לי מה יישבר?
            </InsightBox>
        </section>

        {/* --- Quiz --- */}
        <section className="mt-20">
            <Quiz questions={questions} title="מבדק ידע - פרק 5" />
        </section>

    </ChapterLayout>
  );
}