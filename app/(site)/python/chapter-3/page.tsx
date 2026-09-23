"use client";

import React from 'react';
import { InsightBox } from '@/components/content/InsightBox';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { Quiz } from '@/components/content/Quiz';
// ייבוא מהמבנה החדש והמסודר
import { ListLabDemo, DictLabDemo, TextStatsDemo } from '@/components/demos/chapter-3';
import { 
    Database, List, Fingerprint, BoxSelect, 
    Layers, CheckCircle2, XCircle, Search, Sparkles, BrainCircuit
} from 'lucide-react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';

// --- רכיב עזר ויזואלי לסיכום ---
const XRayCard = ({ icon, term, reality, color }: { icon: React.ReactNode, term: string, reality: string, color: string }) => {
    return (
        <div className="relative group bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-500 transition-colors">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${color}-500/10 text-${color}-400 mb-4`}>
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-mono">{term}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{reality}</p>
        </div>
    );
};

export default function Chapter3() {

  // --- דוגמאות קוד סטטיות ---
  
  const setOperationsCode = `a = {"AI", "ML", "Data"}
b = {"AI", "Vision", "Robotics"}

print(f"Union (|): {a | b}")
print(f"Intersection (&): {a & b}")
print(f"Difference (-): {a - b}")
print(f"Symmetric Diff (^): {a ^ b}")`;

  const tupleCode = `def analyze(text: str) -> tuple[int, int]:
    """returns (word count, character count)."""
    return len(text.split()), len(text)

# Unpacking - פירוק חכם
words, chars = analyze("שלום עולם")
print(f"Words: {words}, Chars: {chars}")

# Tuple כ-Key במילון (אפשרי כי הוא קבוע)
coords = {(10, 20): "Point A", (15, 25): "Point B"}
print(coords[(10, 20)])`;

  const collectionsCode = `from collections import defaultdict, Counter, deque

# 1. Counter - ספירה חכמה
words = ["ai", "is", "amazing", "ai", "is", "ai"]
print(f"Counts: {Counter(words)}")

# 2. defaultdict - מניעת שגיאות מפתח
freq = defaultdict(int)
freq["new_key"] += 1  # לא קורס, יוצר 0 ומוסיף 1
print(f"Freq: {dict(freq)}")

# 3. deque - תור מהיר
q = deque(["task1", "task2"])
q.appendleft("urgent")
print(f"Queue: {q}")`;

  const textStatsCode = `from collections import Counter
import re

def simple_word_stats(text: str) -> dict:
    # Basic cleanup
    clean_text = re.sub(r"[^\\w\\s]", "", text)
    words = clean_text.split()
    
    # Stats logic
    return {
        "num_words": len(words),
        "most_common": Counter(words).most_common(1)[0][0] if words else ""
    }`;

  // --- שאלות למבחן ---
  const questions = [
    {
        id: 1,
        question: "איזה מבנה נתונים הכי מתאים לשמירת רשימה של מזהים ייחודיים (ללא כפילויות) ולבדיקה מהירה אם מזהה קיים?",
        options: ["List", "Dictionary", "Set", "Tuple"],
        correctAnswer: 2,
        explanation: "Set שומר רק ערכים ייחודיים ומאפשר בדיקת קיום ('האם קיים?') במהירות גבוהה מאוד, בניגוד לרשימה שדורשת מעבר על כל האיברים."
    },
    {
        id: 2,
        question: "מדוע נשתמש ב-Tuple במקום ב-List להחזרת ערכים מפונקציה?",
        options: [
            "כי Tuple תופס יותר זיכרון",
            "כדי להבטיח שהנתונים לא ישתנו (Immutability) ולשדר יציבות",
            "כי אי אפשר להחזיר List מפונקציה",
            "אין שום סיבה, עדיף תמיד List"
        ],
        correctAnswer: 1,
        explanation: "Tuple הוא מבנה נתונים קבוע (Immutable). השימוש בו משדר כוונה הנדסית: 'אלו התוצאות, והן לא אמורות להשתנות בהמשך הדרך'."
    },
    {
        id: 3,
        question: "מה היתרון הגדול של defaultdict?",
        options: [
            "הוא ממיין את המפתחות אוטומטית",
            "הוא מאפשר מפתחות כפולים",
            "הוא יוצר ערך ברירת מחדל אוטומטית אם המפתח לא קיים, וחוסך בדיקות if",
            "הוא עובד רק עם מספרים שלמים"
        ],
        correctAnswer: 2,
        explanation: "defaultdict מונע שגיאות KeyError וחוסך את הצורך לבדוק האם מפתח קיים לפני שמוסיפים לו ערך (למשל בעת ספירה או קיבוץ נתונים)."
    }
  ];

  return (
    <ChapterLayout courseId="python" currentChapterId={3}>
        
        {/* --- HERO SECTION --- */}
        <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="inspect" line="המבנה הנכון = חצי מהפתרון" width={160} accent={EMERALD_ACCENT} bubbleSide="bottom" />
          </div>
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
                <Database size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Data Structures</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                מבני נתונים שימושיים
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                אם בפרקים הקודמים למדנו איך פייתון חושבת, הפרק הזה עוסק בשאלה החשובה יותר: <strong>איך היא זוכרת.</strong>
                <br/>
                כל מערכת חכמה, מאימון מודל שפה ועד ניתוח טקסט קצר, קמה ונופלת על הדרך שבה אנחנו מאחסנים, מעבדים וניגשים לנתונים.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold">
                        <BrainCircuit size={20} />
                        <span>הלב הפועם של ה-AI</span>
                    </div>
                    <p className="text-sm text-slate-400">
                        מבני הנתונים קובעים כמה מהר תשלוף תוצאה, כמה זיכרון תבזבז, וכמה קל יהיה לשנות את האלגוריתם.
                    </p>
                </div>
            </div>
        </section>
        </div>

        {/* --- SECTION 1: LISTS --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-orange-500 pr-4 flex items-center gap-2">
                <List size={24} className="text-orange-500"/>
                List: רשימות דינמיות
            </h3>
            
            <div className="prose prose-invert text-slate-300 leading-8">
                <p>
                    הרשימה (list) היא ה-Swiss Army Knife של עולם הנתונים. היא גמישה, קלה לשימוש, ויכולה להכיל כמעט כל צורך – מאיסוף תוצאות ועד אחסון Embeddings.
                    רשימות בפייתון הן דינמיות: אפשר להוסיף, להסיר ולשנות ערכים תוך כדי ריצה.
                </p>
            </div>

            {/* מעבדת רשימות אינטראקטיבית */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2"><strong>נסה בעצמך:</strong> הוסף והסר איברים מהרשימה בזמן אמת.</p>
                <ListLabDemo />
            </div>

            <InsightBox type="warning" title="מלכודת השכפול (Copying Pitfall)">
                שכפול הוא נקודה רגישה. כשכותבים <code>b = a</code>, לא נוצר עותק חדש אלא רק מצביע חדש לאותה רשימה.
                <br/>
                כדי לשכפל באמת, השתמש ב-<code>b = a.copy()</code> או <code>b = a[:]</code>.
            </InsightBox>
        </section>

        {/* --- SECTION 2: DICTIONARIES --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <Database size={24} className="text-blue-500"/>
                Dict: מילונים (Key → Value)
            </h3>
            
            <div className="prose prose-invert text-slate-300 leading-8">
                <p>
                    אם הרשימה היא הלב, המילון הוא המוח. זהו מיפוי של מפתח לערך, כמו טבלה קטנה בזיכרון עם גישה מיידית לכל נתון.
                    בעולם ה-AI, זה המבנה הסטנדרטי לייצוג נתונים מורכבים (כמו JSON), קונפיגורציות ופלטים של מודלים.
                </p>
            </div>

            {/* מעבדת מילונים אינטראקטיבית */}
            <div className="mt-6">
                <p className="text-sm text-slate-400 mb-2"><strong>נסה בעצמך:</strong> עדכן מפתחות קיימים או הוסף חדשים.</p>
                <DictLabDemo />
            </div>

            <InsightBox type="intuition" title="טיפ הנדסי: מחיקה בטוחה">
                במקום <code>del dict[key]</code> שיכול לקרוס אם המפתח לא קיים, 
                השתמש ב-<code>dict.pop(key, None)</code> למחיקה בטוחה ושקטה.
            </InsightBox>
        </section>

        {/* --- SECTION 3: SETS --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-2">
                <Fingerprint size={24} className="text-emerald-500"/>
                Set: קבוצות ייחודיות
            </h3>
            
            <p className="text-slate-300">
                ה-Set הוא השומר בשער. הוא לא מתעניין בסדר, אלא בשאלה אחת: <strong>האם הערך הזה כבר קיים?</strong>
                זה הכלי האידיאלי לסינון כפילויות ולביצוע פעולות מתמטיות (חיתוך, איחוד) בין קבוצות נתונים.
            </p>

            

[Image of Venn diagram showing set operations]


            <LiveCodeEditor
                initialCode={setOperationsCode}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-400" size={16}/>
                    <span>מהיר מאוד בחיפוש (O(1))</span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex items-center gap-2">
                    <XCircle className="text-red-400" size={16}/>
                    <span>לא שומר על סדר האיברים</span>
                </div>
            </div>
        </section>

        {/* --- SECTION 4: TUPLES --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-purple-500 pr-4 flex items-center gap-2">
                <BoxSelect size={24} className="text-purple-500"/>
                Tuple: רצף קבוע (Immutable)
            </h3>
            
            <p className="text-slate-300">
                אם List היא גמישה, Tuple הוא יציב. זהו רצף שלא ניתן לשנות לאחר שנוצר.
                במערכות חכמות, היכולת לא להשתנות היא יתרון עצום כשמעבירים נתונים בין שלבים ב-Pipeline ורוצים להיות בטוחים שהמידע נשאר אמין.
            </p>

            <LiveCodeEditor
                initialCode={tupleCode}
            />

            <InsightBox type="info" title="מתי להשתמש ב-Tuple?">
                כמעט כל פונקציה שאתה כותב יכולה להחזיר tuple קטן של ערכים. 
                זה לא &quot;קיצור דרך&quot;, אלא שיטה הנדסית לשמור על קוד פשוט וברור.
            </InsightBox>
        </section>

        {/* --- SECTION 5: COLLECTIONS --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <Layers size={24} className="text-yellow-500"/>
                Collections: הכלים המיוחדים
            </h3>
            
            <p className="text-slate-300">
                למה לכתוב לוגיקה מסובכת כשאפשר להשתמש בכלים מובנים? הספרייה <code>collections</code> מספקת פתרונות מוכנים לבעיות נפוצות ב-AI.
            </p>

            <ul className="grid gap-3 my-4 text-slate-300">
                <li className="flex gap-3 bg-slate-800/30 p-4 rounded border border-slate-700/50">
                    <span className="font-bold text-yellow-400 min-w-25">defaultdict</span>
                    <span>מילון שיודע להתמודד לבד עם ערכים חסרים (חוסך בדיקות if).</span>
                </li>
                <li className="flex gap-3 bg-slate-800/30 p-4 rounded border border-slate-700/50">
                    <span className="font-bold text-yellow-400 min-w-25">Counter</span>
                    <span>כלי סטטיסטי קטן לספירה חכמה של מילים, תגים או קטגוריות.</span>
                </li>
                <li className="flex gap-3 bg-slate-800/30 p-4 rounded border border-slate-700/50">
                    <span className="font-bold text-yellow-400 min-w-25">deque</span>
                    <span>תור דו-כיווני מהיר, אידיאלי לזרימת נתונים (Streams).</span>
                </li>
            </ul>

            <LiveCodeEditor
                initialCode={collectionsCode}
            />
        </section>

        {/* --- SECTION 6: MAIN EXAMPLE --- */}
        <section className="mt-20 space-y-6">
            <h3 className="text-2xl font-bold text-white border-r-4 border-indigo-500 pr-4 flex items-center gap-2">
                <Search size={24} className="text-indigo-500"/>
                דוגמה מרכזית: סטטיסטיקות טקסט עם Counter
            </h3>
            
            <p className="text-slate-300">
                לפני שיש מודל, יש טקסטים. ולפני למידה עמוקה, יש סטטיסטיקות פשוטות.
                נשתמש ב-dict ו-Counter כדי לנתח טקסט: לספור מילים ולמצוא את הנפוצה ביותר.
            </p>

            <LiveCodeEditor initialCode={textStatsCode} />

            <div className="mt-8">
                <p className="text-sm text-slate-400 mb-2">
                    <strong className="text-white">נסה בעצמך:</strong> כתוב טקסט בתיבה (אנגלית או עברית) וראה את הניתוח בזמן אמת.
                </p>
                {/* השימוש ברכיב האינטראקטיבי המרכזי של הפרק */}
                <TextStatsDemo />
            </div>
        </section>

        {/* --- SUMMARY --- */}
        <section className="mt-24 bg-linear-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-6 text-white justify-center">
                <Sparkles className="text-yellow-400" />
                <h2 className="text-2xl font-bold">סיכום: מתי להשתמש במה?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <XRayCard icon={<List size={24}/>} color="orange" term="List" reality="כשצריך סדר וגמישות. מתאימה לרצפים משתנים." />
                <XRayCard icon={<Database size={24}/>} color="blue" term="Dict" reality="כשצריך קשרים ומיפוי מהיר לפי מפתח." />
                <XRayCard icon={<Fingerprint size={24}/>} color="emerald" term="Set" reality="כשצריך ייחודיות ובדיקות מהירות." />
                <XRayCard icon={<BoxSelect size={24}/>} color="purple" term="Tuple" reality="כשצריך יציבות ונתונים שלא משתנים." />
            </div>
            
            <p className="text-center text-slate-400 mt-8 max-w-2xl mx-auto">
                כשאתה בוחר נכון – הקוד שלך נשאר קצר, ברור ועמיד.
            </p>
        </section>

        {/* --- QUIZ --- */}
        <section className="mt-20">
            <Quiz questions={questions} title="מבדק ידע - פרק 3" />
        </section>

    </ChapterLayout>
  );
}