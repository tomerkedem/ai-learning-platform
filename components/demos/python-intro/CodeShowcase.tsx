"use client";

// כל שורת קוד מלווה בהסבר קצר בעברית, כדי שהלומד יבין מה הדבר הגדול
// שמסתתר מאחורי כל שורה זעירה - זה הלב של "מעט קוד, הרבה כוח".
const lines = [
  {
    code: (
      <>
        <span className="text-[#ff7b72]">from</span> transformers{" "}
        <span className="text-[#ff7b72]">import</span> pipeline
      </>
    ),
    note: "שורה אחת פותחת גישה למודלים מאומנים מהמתקדמים בעולם.",
  },
  {
    code: (
      <>
        classifier = pipeline(
        <span className="text-[#a5d6ff]">{"\"sentiment-analysis\""}</span>)
      </>
    ),
    note: "פייתון טוענת רשת נוירונים מאומנת, בלי שתאמן שום דבר בעצמך.",
  },
  {
    code: (
      <>
        result = classifier(
        <span className="text-[#a5d6ff]">{"\"I really enjoy learning Python.\""}</span>)
      </>
    ),
    note: "המודל מנתח את המשפט ומחזיר רגש (חיובי או שלילי) עם רמת ביטחון.",
  },
  {
    code: (
      <>
        <span className="text-[#ff7b72]">print</span>(f
        <span className="text-[#a5d6ff]">{"\"Confidence: {result[0]['score']}\""}</span>)
      </>
    ),
    note: "כל החישוב הכבד קרה בספריות C/C++ ועל ה-GPU, מאחורי הקלעים.",
  },
];

export const CodeShowcase = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-6" dir="ltr">
      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-2xl">
        <div className="bg-[#161b22] px-6 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-slate-500 font-mono text-xs">sentiment_demo.py</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {lines.map((line, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 px-6 py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:px-10"
            >
              <pre
                dir="ltr"
                className="text-left font-mono text-sm md:text-base leading-relaxed text-white whitespace-pre-wrap"
              >
                {line.code}
              </pre>
              <span
                dir="rtl"
                className="text-sm text-slate-500 md:max-w-[42%] md:text-right shrink-0"
              >
                {line.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
