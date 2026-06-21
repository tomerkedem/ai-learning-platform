"use client";

import React from 'react';
import { ChapterLayout } from '@/components/ChapterLayout';
import { InsightBox } from '@/components/content/InsightBox';
import { Quiz } from '@/components/content/Quiz';
import { LiveCodeEditor } from '@/components/content/LiveCodeEditor';
import { SyncVsAsyncRace, SemaphoreVis } from '@/components/demos/chapter-15';
import { 
    Zap, Globe, ShieldAlert, 
    TrafficCone, Network, Terminal, Layers, Activity, Clock, Repeat
} from 'lucide-react';

export default function Chapter15() {

  // --- פונקציות סימולציה להרצת קוד (Fixes the undefined simulateRetry error) ---
  const simulateBasicAsync = (userCode: string) => {
    const sleepMatch = userCode.match(/sleep\((\d+)\)/);
    const seconds = sleepMatch ? sleepMatch[1] : "2";
    return `Starting data request\n(Waiting for ${seconds} seconds...)\nData received\n{'status': 'ok'}`;
  };

  const simulateGather = (userCode: string) => {
    const taskMatches = userCode.match(/task\((\d+)\)/g);
    const count = taskMatches ? taskMatches.length : 3;
    const results = Array.from({ length: count }, (_, i) => `'Task ${i + 1} done'`).join(", ");
    return `[${results}]\n\n💡 All tasks completed in parallel!`;
  };

  const simulateRetry = (userCode: string) => {
    const retryMatch = userCode.match(/retries=(\d+)/) || userCode.match(/range\((\d+)\)/);
    const retryCount = retryMatch ? parseInt(retryMatch[1]) : 3;
    let out = "";
    for(let i = 1; i < retryCount; i++) {
        out += `Attempt ${i} failed: Network Error (Retrying...)\n`;
    }
    out += `Attempt ${retryCount} success: Data Received! ✅`;
    return out;
  };

  const simulateFullApi = (userCode: string) => {
    let out = "🚀 Initiating parallel API requests...\n";
    if (userCode.includes("retry")) {
        out += "Checking endpoints...\nAttempt 1: Connection Timeout (Retrying...)\n";
        out += `Attempt 2: Success after retry logic.\n`;
    }
    out += `✅ 50 successful responses received back.`;
    return out;
  };

  return (
    <ChapterLayout courseId="python" currentChapterId={15}>
        
        {/* --- Hero Section --- */}
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-purple-400 mb-2">
                <Globe size={24} />
                <span className="font-mono text-sm tracking-wider uppercase">Async IO & Networking</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
                אסינכרוניות בסיסית וממשקי רשת
            </h1>
            
            <div className="bg-slate-800/50 border-r-4 border-purple-500 p-6 rounded-l-xl space-y-4 shadow-xl">
                <h2 className="text-xl font-bold text-white">למה async חשוב בפרויקטי AI?</h2>
                <p className="text-slate-300 leading-relaxed">
                    עולם ה-AI בנוי על תקשורת רשת. כל קריאה למודל - בין אם זה OpenAI, Hugging Face או שירות פנימי - היא קריאה חיצונית, ולכן איטית יחסית לפעולות CPU.
                </p>
                <p className="text-slate-300 leading-relaxed">
                    כאשר אתה שולח עשרות או מאות בקשות במקביל (למודלי שפה, שירותי Embedding, APIs חיצוניים), הגישה הסינכרונית הקלאסית פשוט לא מספיקה. הלולאה הראשית נתקעת, וכל משימה מחכה לסיום הקודמת.
                </p>
                <p className="text-slate-300 leading-relaxed">
                    כאן נכנסת <strong>אסינכרוניות (async/await)</strong> - מנגנון שמאפשר לפייתון להריץ משימות במקביל לוגית (לא פיזית), כלומר להמשיך לעבד משימה אחת בזמן שאחרת ממתינה לתגובה מהשרת.
                </p>
                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30 text-indigo-200 text-sm italic font-medium">
                    התוצאה: שיפור מהירויות פי עשרות, בלי צורך בתהליכים נפרדים או תורים חיצוניים. במערכות AI אמיתיות, Async הוא כבר לא &quot;אופטימיזציה&quot;, אלא סטנדרט תשתיתי.
                </div>
            </div>
        </section>

        {/* --- 1. Basic Async/Await --- */}
        <section className="mt-16 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-blue-500 pr-4 flex items-center gap-2">
                <Zap size={24} className="text-blue-500"/>
                async/await: הבסיס
            </h3>
            <p className="text-slate-300 leading-relaxed">
                התחביר של אסינכרוניות בפייתון פשוט: מגדירים פונקציה אסינכרונית בעזרת <code>async def</code>, וממתינים לתוצאה של פעולה אסינכרונית בעזרת <code>await</code>.
            </p>
            
            <div className="my-10">
                <SyncVsAsyncRace />
            </div>

            <LiveCodeEditor 
                initialCode={`import asyncio

async def fetch_data():
    print("Starting data request")
    await asyncio.sleep(2) # נסה לשנות את המספר ולראות את ההשפעה
    print("Data received")
    return {"status": "ok"}

async def main():
    result = await fetch_data()
    print(result)

asyncio.run(main())`}
                onRun={simulateBasicAsync}
            />

            <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                    <code>await</code> משחרר את השליטה ללולאת האירועים בזמן שהפונקציה &quot;מחכה&quot; כך תהליכים אחרים יכולים לרוץ במקביל.
                </p>
                <InsightBox type="intuition" title="ניהול חכם של זמני המתנה">
                    זהו ההבדל המהותי בין ריבוי תהליכים (Threads) ל-אסינכרוניות: 
                    <strong> Async הוא לא ריבוי מעבדים, אלא ניהול חכם של זמני המתנה.</strong>
                </InsightBox>
            </div>
        </section>

        {/* --- 2. Event Loop & Gather --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-yellow-500 pr-4 flex items-center gap-2">
                <Network size={24} className="text-yellow-500"/>
                לולאת האירועים: asyncio.run ו-gather
            </h3>
            <p className="text-slate-300 leading-relaxed">
                בכל תוכנית אסינכרונית קיימת לולאת אירועים (Event Loop) שאחראית על תזמון והרצת המשימות. פייתון מספקת ממשק פשוט לניהול הלולאה הזו. 
                הפונקציה <code>asyncio.gather</code> מריצה כמה פונקציות אסינכרוניות במקביל ומחזירה את התוצאות ברגע שכולן הסתיימו.
            </p>
            
            <LiveCodeEditor 
                initialCode={`import asyncio

async def task(n):
    await asyncio.sleep(1)
    return f"Task {n} done"

async def main():
    # נסה להוסיף עוד משימות לתוך ה-gather
    results = await asyncio.gather(
        task(1),
        task(2),
        task(3)
    )
    print(results)

asyncio.run(main())`}
                onRun={simulateGather}
            />

            <div className="bg-slate-800/50 p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-white text-lg">למה זה חשוב?</h4>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed">
                    <li><strong>ב-pipelines:</strong> בפיתוח AI אתה שולח עשרות בקשות ל-API של מודל.</li>
                    <li><strong>בלי gather:</strong> כל קריאה תחכה לסיום הקודמת.</li>
                    <li><strong>עם gather:</strong> כולן נשלחות ונאספות במקביל.</li>
                </ul>
            </div>
        </section>

        {/* --- 3. Semaphore --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-orange-500 pr-4 flex items-center gap-2">
                <TrafficCone size={24} className="text-orange-500"/>
                הגבלת מקביליות בעזרת asyncio.Semaphore
            </h3>
            <p className="text-slate-300 leading-relaxed">
                כאשר משגרים עשרות בקשות במקביל יש צורך להגביל את מספר המשימות הפעילות כדי לא להציף שרתים או לעבור מגבלות קצב. 
                <code>asyncio.Semaphore</code> קובע תקרה של משימות פעילות בו זמנית.
            </p>

            <SemaphoreVis />

            <div className="space-y-4 mt-6">
                <p className="text-slate-300 leading-relaxed">
                    אם התקרה הושגה, משימות נוספות ממתינות עד שאחת מסתיימת. כך שומרים על יציבות ובקרה תוך שמירה על רמת מקביליות גבוהה.
                </p>
                <LiveCodeEditor 
                    initialCode={`import asyncio

sem = asyncio.Semaphore(10) # הגבלה ל-10 משימות במקביל

async def guarded(coro):
    async with sem: # השוער מאפשר רק ל-10 להיכנס
        return await coro`}
                    onRun={() => "Semaphore instance created. Ready to guard 10 tasks."}
                />
            </div>
        </section>

        {/* --- 4. aiohttp, Timeouts & Retries --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-emerald-500 pr-4 flex items-center gap-2">
                <Activity size={24} className="text-emerald-500"/>
                aiohttp: קריאות רשת אסינכרוניות
            </h3>
            <p className="text-slate-300 leading-relaxed">
                הספרייה <code>aiohttp</code> מספקת ממשק אסינכרוני לביצוע בקשות HTTP. היא מחליפה את <code>requests</code> בסביבות שבהן נדרשת ריבוי קריאות במקביל. 
                זהו כלי קריטי בעבודה מול APIs של AI שבהם זמן תגובה ממוצע הוא שניות, לא מילישניות.
            </p>

            <div className="space-y-6 pt-6">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldAlert size={20} className="text-red-400"/>
                    Timeouts ו-Retry: הגנה על קריאות API
                </h4>
                <p className="text-slate-300 leading-relaxed">
                    בעבודה עם APIs של AI, במיוחד כאלה שמבוזרים או חיצוניים, אין דבר בטוח יותר מהבלתי צפוי. שרת עלול להחזיר שגיאת 429 (Rate Limit) או פשוט להפסיק להגיב. אם לא תנהל את זה נכון, תוכנית אסינכרונית יכולה להיתקע לנצח.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700 space-y-4">
                        <div className="flex items-center gap-2 text-blue-400 font-bold">
                            <Clock size={18} /> <span>Timeout - הגבלת זמן</span>
                        </div>
                        <p className="text-sm text-slate-300">
                            פייתון תזרוק <code>TimeoutError</code> אם השרת לא הגיב בזמן, וכך הלולאה ממשיכה לרוץ במקום להיתקע.
                        </p>
                        <LiveCodeEditor 
                            initialCode={`timeout = aiohttp.ClientTimeout(total=3)
async with session.get(url, timeout=timeout) as resp:
    return await resp.text()`}
                            onRun={() => "Timeout configuration applied."}
                        />
                    </div>
                    <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700 space-y-4">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                            <Repeat size={18} /> <span>Retry - ניסיון חוזר</span>
                        </div>
                        <p className="text-sm text-slate-300">
                            הוספת שכבת ניסיון נוסף לאחר כשל זמני מאפשרת יציבות: גם אם קריאה אחת נכשלה, המערכת מנסה שוב.
                        </p>
                        <LiveCodeEditor 
                            initialCode={`async def fetch_with_retry(url, retries=3):
    for attempt in range(1, retries + 1):
        try:
            return await do_fetch(url)
        except Exception as e:
            print(f"Attempt {attempt} failed")
            await asyncio.sleep(1)`}
                            onRun={simulateRetry}
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* --- 5. Cancellation --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-red-500 pr-4 flex items-center gap-2">
                <Terminal size={24} className="text-red-500"/>
                Cancellation: ביטול משימות אסינכרוניות
            </h3>
            <p className="text-slate-300 leading-relaxed">
                אחד היתרונות המשמעותיים של אסינכרוניות הוא היכולת לשלוט במשימות בזמן אמת. ייתכן שמודל מאט, שהמשתמש לחץ &quot;ביטול&quot;, או שהגיע מידע חדש שמייתר את הבקשה הקודמת. 
                הביטול לא &quot;הורג&quot; את המשימה מיידית, אלא מעלה חריגת <code>CancelledError</code> בתוך הפונקציה, מה שמאפשר ניקוי מסודר (cleanup) לפני סיום.
            </p>
            
            <InsightBox type="warning" title="שימוש בעולם ה-AI">
                Cancellation חשוב במיוחד כשעובדים עם APIs יקרים או איטיים:
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                    <li>המשתמש ביטל שאלה בממשק שיחה (Chat UI).</li>
                    <li>אחת מבקשות ה-Embedding כבר לא נחוצה.</li>
                    <li>קריאת RAG ארוכה מדי ומחליטים להחזיר תשובה חלקית.</li>
                </ul>
            </InsightBox>
        </section>

        {/* --- 6. Main Example --- */}
        <section className="mt-20 space-y-8">
            <h3 className="text-2xl font-bold text-white border-r-4 border-indigo-500 pr-4">
                דוגמה מרכזית: שליחת בקשות רבות ל-API במקביל
            </h3>
            <p className="text-slate-300 leading-relaxed">
                הנה מימוש שלם המדגים את כל עקרונות העבודה עם APIs בעולם ה-AI: מקביליות מבוקרת, Timeout, Retry, וביטול משימות. זהו שלד טיפוסי במערכות AI מודרניות.
            </p>
            <LiveCodeEditor 
                initialCode={`import asyncio
import aiohttp

class ApiError(Exception): pass

async def fetch_one(session, url, timeout_s):
    try:
        async with session.get(url, timeout=timeout_s) as resp:
            if resp.status >= 400: raise ApiError(f"Bad status {resp.status}")
            return await resp.text()
    except asyncio.TimeoutError: raise ApiError("Timeout")

async def fetch_many(urls, concurrency=10):
    sem = asyncio.Semaphore(concurrency)
    async with aiohttp.ClientSession() as session:
        async def guarded(url):
            async with sem:
                # כאן ניתן לשלב לוגיקת retry וטיפול בשגיאות
                return await fetch_one(session, url, timeout_s=3.0)

        tasks = [asyncio.create_task(guarded(u)) for u in urls]
        try:
            results = await asyncio.gather(*tasks, return_exceptions=True)
            return results
        except asyncio.CancelledError:
            for t in tasks: t.cancel()
            raise`}
                onRun={simulateFullApi}
            />
        </section>

        {/* --- 7. Best Practices --- */}
        <section className="mt-20 bg-slate-900/50 p-8 rounded-2xl border border-slate-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-8">
                <Layers className="text-blue-400" />
                Best Practices למהנדסי AI (אסינכרוניות וטיפול בשגיאות)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-slate-300 leading-relaxed">
                <div className="space-y-4">
                    <h4 className="font-bold text-white text-lg underline decoration-blue-500 underline-offset-4">1. אסינכרוניות ל-I/O בלבד</h4>
                    <p className="text-sm">
                        היא לא מיועדת לחישוב כבד. אם אתה צריך לעבד נתונים או להריץ אלגוריתם ארוך, הרץ אותו בתהליך נפרד בעזרת <code>ProcessPoolExecutor</code>. כך לולאת האירועים תישאר פנויה לניהול רשת ולא תיתקע על חישוב.
                    </p>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold text-white text-lg underline decoration-blue-500 underline-offset-4">2. מחזור Sessions</h4>
                    <p className="text-sm">
                        אל תפתח <code>ClientSession</code> חדש בכל בקשה. פתח Session אחד בתחילת העבודה ומחזר אותו. פתיחה וסגירה חוזרת מייצרת overhead מיותר ולעיתים גם דליפות משאבים. השתמש ב-<code>TCPConnector</code> להגבלת חיבורים פתוחים.
                    </p>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold text-white text-lg underline decoration-blue-500 underline-offset-4">3. שימוש ב-return_exceptions</h4>
                    <p className="text-sm">
                        כשמריצים משימות רבות, השתמש ב-<code>gather(..., return_exceptions=True)</code>. כך גם אם חלק מהמשימות נכשלות, תקבל את התוצאות התקינות ותוכל להחליט מה לעשות הלאה (למשל, לנסות שוב רק את אלו שנכשלו).
                    </p>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold text-white text-lg underline decoration-blue-500 underline-offset-4">4. לוגים וניטור</h4>
                    <p className="text-sm">
                        חשוב לתעד כל בקשה בלוגים: מזהה, זמן תגובה, סטטוס, וסיבת כשל. במערכות AI מרובות קריאות, הלוגים הם כלי אבחון קריטי למציאת צווארי בקבוק ושיפור חוויית המשתמש.
                    </p>
                </div>
            </div>
        </section>

        {/* --- Conclusion --- */}
        <section className="mt-20 space-y-6">
            <h3 className="text-2xl font-bold text-white">סיכום: למה async ו-aiohttp הם חובה?</h3>
            <p className="text-slate-300 leading-relaxed">
                בעולם של מערכות AI, כמעט כל שלב כולל תקשורת רשת - בקשות למודל שפה, שאילתות למנוע Embeddings, או גישה ל-API של חיפוש. כל בקשה כזו אורכת שניות, לא מילישניות, וכשיש עשרות מהן, ביצוע סינכרוני פשוט לא עומד בקצב.
            </p>
            <p className="text-slate-300 leading-relaxed font-bold border-r-4 border-purple-500 pr-4">
                השילוב של async, gather, Semaphore, ו-Retry הוא לא טריק של מתכנתים מתקדמים. זהו הסטנדרט. בלי async, כל מערכת AI תהפוך לצוואר בקבוק. עם async, היא הופכת לרשת חכמה של משימות שמדברות זו עם זו במקביל, חוסכות זמן, ומפיקות יותר תובנות בפחות משאבים.
            </p>
        </section>

        <section className="mt-20">
            <Quiz 
                title="מבדק ידע - פרק 15"
                questions={[
                    {
                        id: 1,
                        question: "מדוע Async קריטי במיוחד במערכות AI המבוססות על APIs חיצוניים?",
                        options: [
                            "כי זה הופך את המודל לחכם יותר",
                            "כי קריאות API הן איטיות (I/O Bound) ו-Async מאפשר לנצל את זמן ההמתנה למשימות אחרות",
                            "כי פייתון לא יכולה לעבוד עם APIs בלי Async",
                            "כי זה חוסך כסף על כל קריאה"
                        ],
                        correctAnswer: 1,
                        explanation: "רוב הזמן בקריאת API מושקע בהמתנה לרשת. Async מאפשר למעבד לעשות דברים אחרים בזמן הזה."
                    },
                    {
                        id: 2,
                        question: "מהו ההבדל המהותי בין Async לריבוי תהליכים (Threads)?",
                        options: [
                            "Async משתמש ביותר ליבות של המעבד",
                            "Async הוא ניהול חכם של זמני המתנה בתוך לולאת אירועים אחת, ולא פיצול פיזי של המעבד",
                            "Threads תמיד מהירים יותר מ-Async",
                            "אין הבדל, אלו שמות שונים לאותו דבר"
                        ],
                        correctAnswer: 1,
                        explanation: "Async מאפשר לנהל משימות I/O רבות ביעילות על תהליך יחיד על ידי 'דילוג' בין משימות שמחכות לרשת."
                    }
                ]} 
            />
        </section>

    </ChapterLayout>
  );
}