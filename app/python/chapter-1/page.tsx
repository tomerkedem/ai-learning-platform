"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
    Terminal, 
    Code2, Box, Cpu, Layers,  Wand2, 
    GitBranch, Zap, Scale, Type, AlignLeft, GraduationCap, ArrowLeft
} from "lucide-react";

import { motion } from "framer-motion";

import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';

import { InsightBox } from '@/components/content/InsightBox';
import { Quiz } from '@/components/content/Quiz';
import { ChapterLayout } from '@/components/ChapterLayout';
import { Mentor, EMERALD_ACCENT } from '@/components/ai-internals/Mentor';

// --- X-RAY CARD ---
const XRayCard = ({ icon, term, reality, color }: { icon: React.ReactNode, term: string, reality: string, color: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div 
            className="relative h-44 w-full cursor-pointer group perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsHovered(!isHovered)}
        >
            <motion.div 
                animate={{ rotateX: isHovered ? 180 : 0, opacity: isHovered ? 0 : 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="absolute inset-0 bg-slate-900/80 border border-slate-700 rounded-2xl flex flex-col items-center justify-center p-4 shadow-xl z-20 backface-hidden"
            >
                <div className={`p-3 rounded-full bg-slate-800 text-slate-400 mb-3 group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-slate-200 tracking-wider font-mono">{term}</h3>
                <span className="text-xs text-slate-500 mt-2">רחף כדי לגלות</span>
            </motion.div>
            <motion.div 
                initial={{ rotateX: -180, opacity: 0 }}
                animate={{ rotateX: isHovered ? 0 : -180, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className={`absolute inset-0 bg-slate-900/95 border border-${color}-500/50 rounded-2xl flex flex-col items-center justify-center p-4 shadow-[0_0_30px_rgba(0,0,0,0.3)] z-10 backdrop-blur-md`}
                style={{ borderColor: `var(--${color}-500)` }} 
            >
                <h3 className={`text-lg font-bold mb-2 text-${color}-400`}>בתכל&apos;ס...</h3>
                <p className="text-center text-slate-200 text-sm font-medium leading-relaxed">
                    {reality}
                </p>
            </motion.div>
        </div>
    );
};

export default function Chapter1() {
  
  // --- States ---
  const [pep8Fixed, setPep8Fixed] = useState(false);
  
  // --- Codes ---
  const torchCode = `
import torch

# 1. העברת חישובים ל-GPU
# מאחורי הקלעים: הקצאת זיכרון ב-VRAM ושימוש ב-CUDA
x = torch.ones((1000, 1000)).cuda()
y = torch.ones((1000, 1000)).cuda()

# 2. Matrix Multiplication
# השורה הזו מפעילה אלפי ליבות במקביל
z = x @ y  

print(f"Matrix Z shape: {z.shape}")
print(f"Device: {z.device}")
`;

  const mockTorchSetup = `
import sys
import types

class MockTensor:
    def __init__(self, shape, device="cpu"):
        self.shape = shape
        self.device = device

    def cuda(self):
        self.device = "cuda:0"
        return self

    def __matmul__(self, other):
        return MockTensor(self.shape, self.device)

    def __str__(self):
         return f"Tensor({self.shape}, device='{self.device}')"

    @property
    def dtype(self):
        return "float32"

class MockTorch:
    def ones(self, shape):
        return MockTensor(shape)
    
    def tensor(self, data):
        return MockTensor(len(data))

torch_module = types.ModuleType("torch")
torch_module.ones = MockTorch().ones
torch_module.tensor = MockTorch().tensor
sys.modules["torch"] = torch_module

print("⚠️ Running in browser environment (Mocking GPU operations)")
`;

  const messyCode = `def calc(x,y):
   res=x*y+10
   if res>100:return True
   return False`;

  const cleanCode = `def calculate_threshold(base_value: int, multiplier: int) -> bool:
    """Calculates if the result exceeds the threshold."""
    bias = 10
    threshold = 100
    
    result = (base_value * multiplier) + bias
    return result > threshold`;

  const engineeringCode = `
#!/usr/bin/env python3

"""
text_to_json.py
A simple script that computes basic text statistics and returns JSON.
"""

import json
from typing import Dict

def clean_text(text: str) -> str:
    """Removes extra spaces and unnecessary line breaks."""
    return " ".join(text.strip().split())

def text_stats(text: str) -> Dict[str, int]:
    """Returns a dictionary with word and character counts."""
    cleaned = clean_text(text)
    return {
       "word_count": len(cleaned.split()),
       "char_count": len(cleaned)
    }

def to_json(data: Dict) -> str:
    """Converts a dictionary to JSON with UTF-8 support."""
    return json.dumps(data, ensure_ascii=False, indent=2)

# Main Guard: מאפשר להריץ כסקריפט או לייבא כמודול
if __name__ == "__main__":
    sample_text = "  זהו טקסט קצר   עם   רווחים מיותרים.  "
    stats = text_stats(sample_text)
    result = to_json(stats)
    print(result)
`;

  const chapterQuestions = [
    {
        id: 1,
        question: "מה התפקיד העיקרי של פייתון בארכיטקטורת AI מודרנית?",
        options: [
            "לבצע חישובים מתמטיים כבדים מהר יותר מ-C++",
            "לשמש כ-Glue Code שמחבר בין רכיבים ומנהל את הזרימה",
            "להחליף את השימוש בכרטיס מסך (GPU)",
            "לכתוב קוד ללא צורך בהגדרת פונקציות או מחלקות"
        ],
        correctAnswer: 1,
        explanation: "פייתון משמשת כ'מערכת העצבים'. היא לא מבצעת את החישוב הכבד בעצמה (את זה עושות C++/CUDA), אלא מנהלת את המידע, הטעינה וההרצה."
    },
    {
        id: 2,
        question: "מהי המטרה העיקרית של מסמך PEP 8?",
        options: [
            "לגרום לקוד לרוץ מהר יותר",
            "להגדיר סטנדרט אחיד לקריאות ועיצוב הקוד בקהילה",
            "למנוע שגיאות זמן ריצה (Runtime Errors)",
            "לאפשר תמיכה בעברית בקוד"
        ],
        correctAnswer: 1,
        explanation: "PEP 8 הוא מדריך הסגנון של פייתון. המטרה שלו היא שכל הקוד הפייתוני ייראה אחיד, ברור וקריא לכל מתכנת."
    },
    {
        id: 3,
        question: "מדוע חשוב להשתמש ב-Separation of Concerns (הפרדת אחריות)?",
        options: [
            "כדי שהקובץ הראשי יהיה ארוך ומרשים יותר",
            "זה לא חשוב בפייתון, רק ב-Java",
            "כדי למנוע מצב ששינוי בקלט שובר את הלוגיקה, וכדי להקל על בדיקות",
            "כדי לחסוך מקום בזיכרון המחשב"
        ],
        correctAnswer: 2,
        explanation: "הפרדת אחריות מבטיחה שכל חלק במערכת עושה דבר אחד. זה מאפשר לשנות חלק אחד (למשל, מקור הנתונים) בלי לשבור חלקים אחרים (למשל, החישוב)."
    }
  ];

  return (
   <ChapterLayout courseId="python" currentChapterId={1}>
          
          {/* --- Hero Section --- */}
          <div className="relative">
          {/* המנטור (xl+, משמאל) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 2xl:mr-6 z-20 hidden xl:block pointer-events-none">
            <Mentor pose="code" line="פייתון היא מערכת העצבים של ה-AI" width={160} accent={EMERALD_ACCENT} bubbleSide="bottom" />
          </div>
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Terminal size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Python Foundations</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                למה פייתון היא שפה חשובה בעידן ה-AI?
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
                בפרק הזה נהפוך את פייתון מכלי &quot;סקריפטים&quot; לשפת תשתית הנדסית שמחזיקה מערכות AI אמיתיות.
            </p>
          </section>
          </div>

          {/* --- פתיחה: למה אנחנו כאן? --- */}
          <section className="space-y-6">
            <div className="prose prose-invert prose-lg text-slate-300 leading-8">
                <p>
                    אם אתה קורא את השורות האלה, כנראה שאתה כבר לא צריך שמישהו יסביר לך מה זה משתנה, לולאה או API. 
                    אתה מתכנת מנוסה. אולי ב-#C, ב-Java או ב-JavaScript, שכבר בנה מערכות אמיתיות. 
                    אבל אתה רוצה להבין איך פייתון הפכה לשפה שמנהלת היום כמעט כל מערכת בינה מלאכותית רצינית.
                </p>
                <InsightBox type="intuition" title="מטרת הלומדה הזו">
                    המטרה היא ללמד אותך לחשוב כמו <strong>מהנדס AI</strong>, לא כמו &quot;מתכנת מתחיל בפייתון&quot;.
                    <br/><br/>
                    לא נעסוק בתחביר הבסיסי, אלא בדרך שבה מתכנת מנוסה משתמש בפייתון ככלי הנדסי:
                    כלי שבאמצעותו בונים מודולים, מנהלים זרימות נתונים, מתעדים, בודקים ומריצים מערכות שצריכות לעבוד בלי הפסקה.
                </InsightBox>
            </div>
          </section>

          {/* --- SECTION 1: פייתון ככלי הנדסי --- */}
          <section className="mt-16 space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 border-r-4 border-yellow-500 pr-4">
                <GitBranch className="text-yellow-500" />
                פייתון ככלי הנדסי (לא רק סקריפטים)
            </h3>
            
            <div className="prose prose-invert prose-lg text-slate-300 leading-8">
                <p>
                    כשמתכנתים מנוסים נתקלים לראשונה בפייתון, קל לטעות ולחשוב שהיא &quot;שפת סקריפטים&quot;.
                    אבל מאחורי הפשטות הזו מסתתרת שפה הנדסית לכל דבר.
                    פייתון לא נועדה להחליף את ++C או Rust בעומס חישובי. היא נועדה לקשור ביניהן.
                </p>
                
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 my-6">
                    <p className="font-bold text-white mb-2 flex items-center gap-2"><Cpu size={18}/> מערכת העצבים של ה-AI</p>
                    <p className="text-sm text-slate-300">
                        במובן הזה, פייתון היא כמו &quot;מערכת העצבים&quot; של עולם ה-AI: היא לא מבצעת את כל העבודה בעצמה,
                        אבל היא זו שמחברת בין כל האיברים, האלגוריתמים, הנתונים, הספריות, הממשקים, וה-APIs.
                        
                    </p>
                </div>

                <p>
                    שפה הנדסית אמיתית נמדדת ביכולת לייצר מערכת שעובדת לאורך זמן.
                    פייתון מאפשרת לך לעשות את זה בקלות יחסית: להפריד אחריויות לקבצים ולמודולים, לעבוד עם מבני נתונים חזקים,
                    ולהשתמש ב-type hints כדי לשמור על אמינות.
                </p>
            </div>
          </section>

          {/* --- SECTION 2: איך זה עובד מאחורי הקלעים --- */}
          <section className="mt-20 space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 border-r-4 border-yellow-500 pr-4">
                <Zap className="text-yellow-500" />
                איך פייתון מריצה AI מאחורי הקלעים
            </h3>
            
            <div className="prose prose-invert prose-lg text-slate-300 leading-8">
                <p>
                    כשאנחנו אומרים שפייתון היא &quot;שפת הדבק&quot; של עולם ה-AI, זו אמת טכנית.
                    פייתון כמעט אף פעם לא מבצעת את החישובים הכבדים בעצמה; היא מפעילה מנועים שנכתבו בשפות אחרות.
                </p>
                
                <p>
                    אלגוריתמים של למידה עמוקה מבוססים על חישובי מטריצות ענקיים.
                    פה נכנס ה-GPU (Graphics Processing Unit), שעובד &quot;רחב&quot; – מחשב הרבה דברים קטנים במקביל.
                    בניגוד ל-CPU שעובד &quot;עמוק&quot; עם כמה ליבות חזקות.
                </p>
            </div>

            <div className="my-8">
                <p className="text-sm text-slate-400 mb-2">דוגמה חיה: חישוב ב-GPU דרך פייתון</p>
                <LiveCodeEditor
                    initialCode={torchCode}
                    setupCode={mockTorchSetup}
                />
            </div>

            <InsightBox type="info" title="הקסם של השורה z = x @ y">
                השורה הזו נראית תמימה, אבל מאחוריה מתבצעים מיליוני חישובים מקבילים על כרטיס גרפי במהירות שפייתון לבדה לא הייתה מגיעה אליה לעולם.
                זו אחת הסיבות שפייתון ניצחה בעולם ה-AI: היא מאפשרת למתכנתים לכתוב קוד קריא ופשוט, וליהנות מביצועים של שפות מערכת.
            </InsightBox>
          </section>

          {/* --- SECTION 3: PEP 8 --- */}
          <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 border-r-4 border-yellow-500 pr-4">
                <Scale className="text-emerald-400" />
                כללי סגנון – PEP 8 וקריאות קוד
            </h3>
            
            <div className="prose prose-invert prose-lg text-slate-300 leading-8">
                <p>
                    בפייתון, קריאות היא לא המלצה, היא עקרון יסוד. PEP 8 הוא התקן הלא-רשמי שגורם לקוד שלך להיראות ולהתנהג כמו קוד של קהילה מקצועית.
                    ההיגיון פשוט: כשכולם כותבים באותו סגנון, ה-diff ב-Git קטן יותר והמוח מתאמץ פחות.
                </p>
                
                <ul className="list-none space-y-4 my-6">
                    <li className="flex gap-3">
                        <Type className="text-emerald-400 shrink-0 mt-1" />
                        <span><strong>שמות משמעותיים:</strong> snake_case למשתנים. אל תכתוב x כשאפשר token_count.</span>
                    </li>
                    <li className="flex gap-3">
                        <AlignLeft className="text-emerald-400 shrink-0 mt-1" />
                        <span><strong>הזחה של ארבעה רווחים:</strong> לא טאב, לא שניים. ארבעה.</span>
                    </li>
                    <li className="flex gap-3">
                        <Scale className="text-emerald-400 shrink-0 mt-1" />
                        <span><strong>רווחים הם קריאות:</strong> סביב אופרטורים כמו =, +, או == השאר רווח אחד.</span>
                    </li>
                </ul>
            </div>

            {/* --- אינטראקציה: ניקוי קוד --- */}
            <div className="relative group bg-[#0F172A] p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-bold">נסה בעצמך: הפוך קוד מלוכלך לקוד הנדסי</h4>
                    <Button 
                        size="sm"
                        onClick={() => setPep8Fixed(!pep8Fixed)}
                        className={`gap-2 shadow-lg transition-all ${pep8Fixed ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-700 hover:bg-slate-600'}`}
                    >
                        {pep8Fixed ? <><ArrowLeft size={14}/> החזר למקור</> : <><Wand2 size={14}/> הפעל &quot;Auto Format&quot;</>}
                    </Button>
                </div>
                
                <motion.div
                    key={pep8Fixed ? 'clean' : 'messy'}
                    initial={{ opacity: 0, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.4 }}
                >
                    <LiveCodeEditor
                        initialCode={pep8Fixed ? cleanCode : messyCode}
                    />
                </motion.div>
            </div>
          </section>

          {/* --- SECTION 4: Separation of Concerns --- */}
          <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 border-r-4 border-yellow-500 pr-4">
                <Layers className="text-blue-400" />
                עבודה נקייה עם קוד: Separation of Concerns
            </h3>
            
            <div className="prose prose-invert prose-lg text-slate-300 leading-8">
                <p>
                    כשמערכת מתחילה לגדול, גם השורות הקטנות שאתה כותב היום הופכות במהירות לרשת של תלויות.
                    זו בדיוק הנקודה שבה נכנס אחד העקרונות הכי חשובים בתכנות הנדסי: <strong>הפרדת אחריויות</strong>.
                </p>
                <p>
                    הרעיון פשוט: כל רכיב במערכת צריך לעשות דבר אחד, ולעשות אותו טוב.
                    כשאתה מפריד בין האחריויות, אתה מונע מצב שבו שינוי קטן בקובץ אחד שובר חצי מערכת.
                </p>

                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 my-4">
                    <h4 className="text-white font-bold mb-2">מערכת חכמה בנויה בשכבות:</h4>
                    <ul className="list-disc list-inside space-y-2 text-slate-300 marker:text-blue-500">
                        <li><strong>שכבת קריאה:</strong> אחראית על קלט (input) בלבד.</li>
                        <li><strong>שכבת עיבוד:</strong> מבצעת את הלוגיקה העסקית.</li>
                        <li><strong>שכבת פלט:</strong> שומרת תוצאות לקובץ, לבסיס נתונים או ל-API.</li>
                    </ul>
                </div>

                <p>
                    כשתעבוד ככה, תרגיש משהו מוזר קורה: הקוד שלך נרגע. הוא מפסיק להילחם בעצמו, והופך להרמוני.
                </p>
            </div>
          </section>

          {/* --- SECTION 5: דוגמה מרכזית --- */}
          <section className="mt-20 space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 border-r-4 border-yellow-500 pr-4">
                <Terminal className="text-yellow-500" />
                דוגמה מרכזית: סקריפט הנדסי
            </h3>
            
            <p className="text-slate-300">
                לפני שנצלול לעומק הפרקים הבאים, נבנה יחד דוגמה קצרה שממחישה איך פייתון מרגישה כשכותבים בה כמו מהנדסים.
                <br/>
                המטרה: לכתוב סקריפט שמקבל טקסט, מנקה אותו משוליים ורווחים, סופר מילים ומחזיר תוצאה כ-JSON תקין.
            </p>

            <LiveCodeEditor
                initialCode={engineeringCode}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                    <h5 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">למה זו דוגמה הנדסית?</h5>
                    <ul className="text-sm text-slate-300 space-y-2">
                        <li>✅ <strong>פונקציות מבודדות:</strong> כל אחת עושה דבר אחד בלבד.</li>
                        <li>✅ <strong>Type Hints:</strong> מוסיפים בהירות ומאפשרים בדיקות.</li>
                        <li>✅ <strong>Docstrings:</strong> תיעוד מובנה ונגיש.</li>
                        <li>✅ <strong>Main Guard:</strong> מאפשר שימוש גם כסקריפט וגם כמודול.</li>
                    </ul>
                </div>
            </div>
          </section>

          {/* --- סיכום ומבחן --- */}
          <section className="mt-20 space-y-8">
            <div className="bg-linear-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 text-center">
                <h3 className="text-xl font-bold text-white mb-4">סיכום: איך פייתון משרתת מהנדסי AI</h3>
                <p className="text-slate-300 leading-relaxed max-w-3xl mx-auto">
                    לאורך הפרק ראינו שפייתון אינה רק שפה נוחה, אלא כלי הנדסי שמאפשר למהנדסי AI לבנות מערכות אמינות וגמישות.
                    הערך האמיתי שלה הוא בשילוב שבין פשטות, קריאות, ועוצמה.
                </p>
            </div>

            <div className="flex items-center gap-3 mb-6 mt-12">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                    <GraduationCap size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">בוא נראה שהבנת</h3>
            </div>
            
            <Quiz questions={chapterQuestions} title="מבדק ידע - פרק 1" />
          </section>

          {/* --- X-RAY SECTION (Concepts) --- */}
          <section className="mt-20">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">מושגים שפגשנו הפרק</h2>
                <p className="text-slate-400">רחף כדי לראות את המשמעות האמיתית</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                <XRayCard 
                    icon={<Layers size={32} />}
                    term="Separation of Concerns"
                    reality="כל חלק בקוד עושה רק דבר אחד. אם משהו נשבר, אתה יודע בדיוק איפה."
                    color="blue"
                />
                <XRayCard 
                    icon={<Cpu size={32} />}
                    term="GPU Acceleration"
                    reality="פייתון רק מחלקת הוראות, הכרטיס הגרפי עושה את העבודה השחורה."
                    color="rose"
                />
                <XRayCard 
                    icon={<Code2 size={32} />}
                    term="Type Hints"
                    reality="הדרך של פייתון להגיד לך 'טעית בטיפוס' לפני שהרצת את הקוד."
                    color="emerald"
                />
                <XRayCard 
                    icon={<Box size={32} />}
                    term="Main Guard"
                    reality="השורה שמוודאת שהקוד שלך ירוץ רק כשהתכוונת להריץ אותו."
                    color="amber"
                />
             </div>
          </section>

    </ChapterLayout>
  );
}