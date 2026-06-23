"use client";

import { useState } from "react";
import { LiveCodeEditor } from "@/components/content/LiveCodeEditor";
import { DEMO_CODE } from "./velocityDemo.data";

/**
 * הוכחה אינטראקטיבית קטנה למקטע ה-Velocity: קוד פייתון אמיתי שרץ חי ב-Pyodide
 * דרך רכיב ההרצה הקיים (LiveCodeEditor). הלומד יכול לשנות את המשפט, להריץ,
 * ולקבל תוצאה שתלויה באמת בקלט. לאחר הרצה מוצלחת מופיע משפט שמחזק את המסר.
 */
export const PythonVelocityDemo = () => {
  const [hasRun, setHasRun] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 mt-10" dir="rtl">
      <p className="text-xs text-slate-500 mb-3">
        המודל המלא של transformers רץ על שרת עם GPU, לא בדפדפן – אבל זה פייתון אמיתי שרץ פה חי.
      </p>

      {/* הסבר למתחיל: מה הקוד עושה */}
      <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <span className="block mb-1 text-sm font-bold text-emerald-400">מה הקוד הזה עושה?</span>
        <p className="text-sm leading-relaxed text-slate-400">
          הוא מקבל משפט באנגלית, בודק אילו מילים בו חיוביות (כמו love, fast, fun) ואילו שליליות
          (כמו slow, bad, boring), ולפי הרוב מחליט אם הטון <b>חיובי, שלילי או נייטרלי</b> ומחזיר גם
          ציון ביטחון. רוצים לנסות? שנו את הטקסט בשורה של
          <code dir="ltr" className="mx-1 rounded bg-slate-800 px-1 font-mono text-xs text-emerald-300">sentence</code>
          ולחצו על Run כדי לראות איך התוצאה משתנה. אל תדאגו אם לא כל שורה ברורה – במבוא מספיק להבין את הרעיון ולשחק.
        </p>
      </div>

      <div dir="ltr">
        <LiveCodeEditor
          initialCode={DEMO_CODE}
          pythonPackages={[]}
          height="h-96"
          onSuccess={() => setHasRun(true)}
        />
      </div>

      {hasRun && (
        <p className="text-lg font-bold text-emerald-400">
          מעט קוד. הרבה יכולת. זו הסיבה שפייתון הפכה לשפה המרכזית בעולם ה-AI.
        </p>
      )}
    </div>
  );
};
