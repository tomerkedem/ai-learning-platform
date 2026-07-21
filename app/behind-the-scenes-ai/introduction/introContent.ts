// app/behind-the-scenes-ai/introduction/introContent.ts
//
// תוכן המבוא של "מאחורי הקלעים של AI" כמבנה-נתונים נקי.
//
// ── למה קובץ נפרד ─────────────────────────────────────────────────────────────
// הלומדה הזו עשויה לתמוך בעתיד בכ-200 שפות. כדי שהמעבר ל-locale files יהיה זול,
// כל הטקסט הארוך הפונה למשתמש חי כאן כמחרוזות שלמות (לא משורשר בתוך JSX), עם
// שדות מפורשים למונחים טכניים (Token IDs, Embedding, Attention, Transformer,
// Logits, Softmax, Decoding, Agent). העברית היא שפת המקור הנוכחית.
//
// ── כללי תוכן ─────────────────────────────────────────────────────────────────
// * משפטים שלמים בלבד. אין שרשור משפטים.
// * אין טענה למספר קבוע של שלבים. אלה "תחנות מרכזיות" במפת למידה.
// * אין מקף ארוך (U+2014) ואין מקף בינוני. מקף רגיל בלבד במידת הצורך.
// * אייקונים, צבעים ופריסה אינם כאן: הם שייכים לרובד התצוגה ואינם ניתנים לתרגום.

/** מזהה אזור-למידה במפת התחנות. ארבעה אזורים, מהטקסט עד התשובה. */
export type RoadmapZoneId = 'A' | 'B' | 'C' | 'D';

/** אזור-למידה אחד: קיבוץ-על של כמה תחנות מרכזיות. */
export interface RoadmapZone {
    id: RoadmapZoneId;
    /** כותרת האזור (עברית). */
    title: string;
    /** משפט מסגור קצר לאזור (עברית, משפט שלם). */
    caption: string;
}

/** מפתח לסצנה חיה שמלמדת את מושג התחנה. לכל 14 התחנות יש אחת. ראו IntroStationViz. */
export type StationVizKind =
    | 'request' | 'tokenize' | 'ids'
    | 'embedding' | 'position' | 'context'
    | 'attention' | 'mix' | 'layers' | 'state'
    | 'logits' | 'scores' | 'decoding' | 'loop';

/** תחנה מרכזית אחת במפה. כל תחנה: כותרת, הסבר אנושי קצר, ולעיתים מונח טכני. */
export interface RoadmapStation {
    id: string;
    zone: RoadmapZoneId;
    /** כותרת קצרה בעברית. */
    title: string;
    /** משפט הסבר אנושי אחד, שלם. ללא נוסחאות. נראה גם כשהכרטיס סגור. */
    explanation: string;
    /** Optional expanded detail; collapsed cards keep the short explanation. */
    detail?: string;
    /**
     * מונח טכני מקובל באנגלית שהתחנה מציגה (אם יש). נשמר כשדה מפורש כדי שלא
     * יתורגם, וכדי שההסבר העברי (explanation) ישב לצידו.
     */
    term?: string;
    /** הסצנה החיה שנפתחת עם הכרטיס. היא (עם שורת התובנה שלה) נושאת את ההעמקה. */
    viz?: StationVizKind;
}

/* ════════════════════════ ההירו ════════════════════════ */

export const HERO = {
    badge: 'המעבדה השקופה · Behind the Scenes',
    /** הכותרת מפוצלת כדי לאפשר הדגשת-צבע על החלק האחרון, בלי לשרשר משפט. */
    titleLead: 'מה באמת קורה בין המשפט שכתבתם',
    titleAccent: 'לבין התשובה שהופיעה?',
    /** משפט פתיחה קצר מתחת לכותרת, פונה ללומד, לא מסביר החלטות מוצר. */
    intro: 'הצצה אל מה שקורה ברגע שאתם שולחים הודעה לצ׳אט.',
} as const;

/** דוגמת הצ׳אט שמציגה את "המבט מבחוץ" ואת השער אל המנוע שביניהם. */
export const HERO_CHAT = {
    promptRole: 'הבקשה שלכם',
    prompt: 'החבילה שלי לא הגיעה. מה לעשות?',
    inputPlaceholder: 'הקלידו הודעה...',
    answerRole: 'התשובה',
    answer: 'אני מצטער לשמוע. כדאי לבדוק את סטטוס המשלוח ולראות אם יש עדכון מהמרכז הלוגיסטי.',
    outsideLine: 'מבחוץ זה נראה כמו שני שלבים: כתבתם בקשה וקיבלתם תשובה.',
    curiosityLine: 'אבל השאלה האמיתית היא מה קרה באמצע.',
    /** משפט פתיחה לשער המנוע (מופיע אחרי ניחוש ההשערות). */
    gateLead: 'עכשיו נפתח את מה שקרה באמצע, בין הבקשה לתשובה.',
    revealLabel: 'פתחו את המנוע שבין השאלה לתשובה',
    closeLabel: 'סגרו את התצוגה',
    /** הכותרת שמופיעה כשהשער נפתח, ומובילה אל המפה המלאה שלמטה. */
    revealedLabel: 'כך נראה המנוע מבפנים',
    /** משפט הגשר בין המבט מבחוץ למפה המלאה. */
    bridge: 'מתחת לשני השלבים שנראים מבחוץ פועל מסלול שלם. אלה התחנות המרכזיות שלו.',
    /** רמז להמשך אל המפה המלאה. */
    downCue: 'המפה המלאה ממש למטה',
} as const;

/**
 * תצוגה מקדימה זעירה של מסע המנוע, שמופיעה כששער ה"מבט מבפנים" נפתח. ארבע
 * תחנות-על מופשטות שמרמזות על המפה המלאה, בלי לשכפל את כל התחנות.
 */
export const ENGINE_TEASER: string[] = ['טוקנים', 'מספרים', 'הקשר', 'בחירה'];

/* ════════════════════════ ניחוש מהיר: ארבעה הסברים מתחרים ════════════════════════ */
//
// לא מבחן ולא חלק מהמאסטרי: רגע של בחירת מודל חשיבה. הלומד בוחר איזה הסבר הכי
// קרוב למציאות. אין שמירת ניקוד. ההסבר הנכון מתאר את התהליך האמיתי (טוקנים,
// הקשר, טוקן אחרי טוקן). הסברים שגויים מוצגים כטעויות חשיבה מפתות, לא ככישלון.

/** רמז ויזואלי לכרטיס השערה. נפתר לאיור-מיקרו ברכיב, לא ניתן לתרגום. */
export type HypothesisCue = 'read' | 'rail' | 'tokens' | 'archive';

/** השערה אחת מתוך ארבע: מודל חשיבה אפשרי על מה שקורה באמצע. */
export interface Hypothesis {
    id: string;
    /** כותרת קצרה. */
    title: string;
    /** משפט המתאר את ההשערה. */
    concept: string;
    cue: HypothesisCue;
    /** ההשערה הנכונה. */
    correct?: boolean;
    /** Learner-facing verdict that distinguishes wrong, partial, and closest explanations. */
    status?: string;
    /** למה ההשערה מפתה (להסבר עדין כשבוחרים אותה בטעות). */
    whyTempting?: string;
    /** למה היא לא מדויקת בפועל. */
    whyWrong?: string;
}

export interface QuickGuessContent {
    eyebrow: string;
    question: string;
    hint: string;
    hypotheses: Hypothesis[];
    /** משוב לבחירה נכונה. */
    correctTitle: string;
    correctLead: string;
    correctBody: string;
    correctBridge: string;
    /** משוב לבחירה שגויה. */
    wrongLead: string;
    retry: string;
    revealCorrect: string;
}

export const QUICK_GUESS: QuickGuessContent = {
    eyebrow: 'ניחוש מהיר · ארבעה הסברים מתחרים',
    question: 'איזה הסבר הכי קרוב למה שקורה באמצע?',
    hint: 'בחרו את ההסבר שנראה לכם הכי קרוב למציאות. אין כאן ציון, רק בחירה של מודל חשיבה.',
    hypotheses: [
        {
            id: 'read', title: 'קריאה ישירה', cue: 'read',
            concept: 'המודל קורא את המשפט כמו אדם ומרכיב תשובה.',
            whyTempting: 'ככה אנחנו קוראים, אז מתבקש לחשוב שגם המודל עושה את זה.',
            whyWrong: 'המודל לא קורא אותיות או מילים כמו אדם. הוא עובד על טוקנים ועל מספרים.',
        },
        {
            id: 'rail', title: 'מסלול קבוע', cue: 'rail',
            concept: 'המודל עובר תמיד אותו מספר שלבים קבוע, כמו פס ייצור.',
            whyTempting: 'נעים לחשוב על המודל כמו פס ייצור מסודר עם מספר שלבים ידוע.',
            whyWrong: 'אין מספר שלבים קבוע. בכל סיבוב רצים המון חישובים, וזה משתנה לפי המודל וההקשר.',
        },
        {
            id: 'tokens', title: 'מנוע טוקנים', cue: 'tokens', correct: true,
            concept: 'המודל מפרק את הטקסט לטוקנים, מחשב הקשר, ומייצר תשובה טוקן אחרי טוקן.',
        },
        {
            id: 'archive', title: 'שליפה ממאגר', cue: 'archive',
            concept: 'המודל שולף תשובה מוכנה ממאגר.',
            whyTempting: 'התשובות נשמעות מוכנות ומלוטשות, כאילו נשלפו ממאגר.',
            whyWrong: 'אין מאגר תשובות מוכנות. המודל מייצר את התשובה טוקן אחרי טוקן בזמן אמת.',
        },
    ],
    correctTitle: 'נכון מאוד!',
    correctLead: 'זו התמונה המדויקת יותר.',
    correctBody: 'המודל עובד על טוקנים, מחשב הקשר, בוחר את הטוקן הבא, ואז חוזר על התהליך.',
    correctBridge: 'בדיוק את זה נפתח עכשיו. פתחו את המנוע שבין השאלה לתשובה בהמשך.',
    wrongLead: 'זו טעות חשיבה נפוצה, אבל זה לא מה שקורה בפועל.',
    retry: 'בחרו שוב',
    revealCorrect: 'הציגו את ההסבר המדויק',
} as const;

/* טיפוסי תוכן לרכיב NextTokenGuess הניתן לשימוש חוזר. המבוא אינו מרנדר אותו עוד. */

/** מועמד לטוקן הבא: המילה וההסתברות שלה (באחוזים). */
export interface NextTokenOption {
    token: string;
    /** הסתברות באחוזים (0-100). */
    p: number;
}

/** סבב ניחוש בודד: פרומפט חתוך + מועמדים + תובנה. */
export interface NextTokenRound {
    /** תווית הקשר קצרה (צ׳יפ), למשל "סטטוס משלוח". */
    context: string;
    /** המשפט עד למקום החסר (הטוקן הבא). */
    prefix: string;
    /** מועמדי הטוקן הבא, עם הסתברויות. */
    options: NextTokenOption[];
    /** מסת ההסתברות שנשארה לכל שאר הטוקנים. */
    otherP: number;
    /** תובנה שנחשפת אחרי הבחירה. */
    insight: string;
}

export interface NextTokenContent {
    eyebrow: string;
    title: string;
    subtitle: string;
    guessLabel: string;
    /** תווית "הניחוש שלכם" על העמודה שבחר הלומד. */
    yourPick: string;
    /** תווית "בחירת המנוע" על העמודה המנצחת. */
    modelTop: string;
    /** כותרת כשהלומד צדק (בחר את הטוקן שהמנוע היה בוחר). */
    matchTitle: string;
    /** קידומת כשלא צדק, למשל "המנוע העדיף" + הטוקן. */
    missTitle: string;
    otherLabel: string;
    roundLabel: string;
    ofLabel: string;
    nextRound: string;
    restart: string;
    /** פאנץ' סיום אחרי הסבב האחרון. */
    closing: string;
    rounds: NextTokenRound[];
}

/* ════════════════════════ מפת התחנות המרכזיות ════════════════════════ */

export const ROADMAP_HEADING = {
    eyebrow: 'פותחים את המנוע',
    title: 'מפת התחנות המרכזיות בדרך מטקסט לתשובה',
    subtitle: 'מתחת לשני השלבים שנראים מבחוץ פועל מסלול שלם. אלה התחנות המרכזיות שלו, מהבקשה ועד התשובה.',
    /** רמז עדין שכל תחנה נפתחת. */
    hint: 'לחצו על תחנה כדי להציץ פנימה: הסבר קצר ודוגמה.',
} as const;

export const ROADMAP_ZONES: RoadmapZone[] = [
    {
        id: 'A',
        title: 'מהטקסט ליחידות עבודה',
        caption: 'הבקשה נכנסת ומתפרקת ליחידות שהמודל יודע לעבד.',
    },
    {
        id: 'B',
        title: 'מטוקנים לייצוגים',
        caption: 'כל טוקן הופך למספרים ומקבל את מקומו בתוך ההקשר.',
    },
    {
        id: 'C',
        title: 'חישוב ההקשר',
        caption: 'הטוקנים משפיעים זה על זה עד שנוצר ייצוג פנימי עדכני.',
    },
    {
        id: 'D',
        title: 'מהייצוג לתשובה',
        caption: 'מהייצוג נגזר הטוקן הבא, והתהליך חוזר עד שהתשובה שלמה.',
    },
];

export const ROADMAP_STATIONS: RoadmapStation[] = [
    // אזור A - מהטקסט ליחידות עבודה
    {
        id: 'request', zone: 'A',
        title: 'הבקשה נכנסת',
        explanation: 'המשתמש כותב בקשה, והיא נכנסת יחד עם ההקשר והוראות המערכת.',
    },
    {
        id: 'tokenize', zone: 'A',
        title: 'פירוק לטוקנים',
        explanation: 'הטקסט מתפרק ליחידות עבודה שהמודל יודע לעבד.',
        viz: 'tokenize',
    },
    {
        id: 'ids', zone: 'A',
        title: 'מזהה לכל טוקן', term: 'Token IDs',
        explanation: 'כל טוקן מקבל מזהה מספרי מתוך אוצר המילים של המודל.',
    },
    // אזור B - מטוקנים לייצוגים
    {
        id: 'embedding', zone: 'B',
        title: 'ייצוג מספרי', term: 'Embedding',
        explanation: 'המזהה הופך לווקטור מספרי שהמודל יכול לחשב עליו.',
        viz: 'embedding',
    },
    {
        id: 'position', zone: 'B',
        title: 'מיקום וסדר',
        explanation: 'המודל צריך לדעת איפה כל טוקן נמצא ביחס לאחרים.',
    },
    {
        id: 'context', zone: 'B',
        title: 'חלון הקשר',
        explanation: 'המודל מתחשב בשיחה, בהוראות ובטוקנים שכבר נוצרו.',
    },
    // אזור C - חישוב ההקשר
    {
        id: 'attention', zone: 'C',
        title: 'קשב להקשר', term: 'Attention',
        explanation: 'הטוקנים בודקים אילו חלקים בהקשר חשובים עכשיו.',
        viz: 'attention',
    },
    {
        id: 'mix', zone: 'C',
        title: 'ערבוב מידע',
        explanation: 'המידע מההקשר מתערבב ומעדכן את הייצוגים.',
    },
    {
        id: 'layers', zone: 'C',
        title: 'שכבות עומק', term: 'Transformer',
        explanation: 'העיבוד חוזר בשכבות רבות, וכל שכבה מחדדת את הייצוג.',
    },
    {
        id: 'state', zone: 'C',
        title: 'ייצוג פנימי עדכני',
        explanation: 'נוצר מצב פנימי שמסכם את ההקשר לרגע הנוכחי.',
    },
    // אזור D - מהייצוג לתשובה
    {
        id: 'logits', zone: 'D',
        title: 'ציונים גולמיים', term: 'Logits',
        explanation: 'המודל נותן ציונים גולמיים לטוקנים האפשריים הבאים.',
    },
    {
        id: 'softmax', zone: 'D',
        title: 'מהציון להסתברות', term: 'Softmax',
        explanation: 'הציונים הופכים להתפלגות הסתברותית.',
        viz: 'scores',
    },
    {
        id: 'decoding', zone: 'D',
        title: 'בחירת הטוקן הבא', term: 'Decoding',
        explanation: 'כללי הפענוח משפיעים על בחירת הטוקן הבא בפועל.',
    },
    {
        id: 'loop', zone: 'D',
        title: 'לולאה עד תשובה',
        explanation: 'הטוקן שנבחר מצטרף לתשובה, ואז הכול רץ שוב.',
        viz: 'loop',
    },
];

/** הערת היושרה שמתחת למפה: זו מפת למידה, לא צילום מלא של החישוב. */
export const TRUTH_NOTE =
    'זו מפת למידה, לא צילום מלא של כל החישובים. במודל אמיתי, בתוך כל תחנה מתרחשות פעולות רבות במקביל, והמספר המדויק משתנה לפי המודל, אורך ההקשר ואופן ההפעלה.';

/* ════════════════════════ הפרדת Agent ════════════════════════ */

// קופי עוטף לכרטיס ה-Agent (כותרת, גוף, סגירה, הערת דיוק). הקופי מתחלף לפי מצב
// המתג Chat/Agent כדי שיתאים לתצוגה החיה. התצוגה החיה עצמה חיה ב-AGENT_DEMO.
export const AGENT_CARD = {
    term: 'Agent',
    chat: {
        eyebrow: 'מסלול בסיסי',
        title: 'Chat הוא קלט, מודל, ותשובה אחת',
        body:
            'במצב Chat המודל מקבל את הבקשה ומחזיר טקסט אחד. אין כלים ואין פעולה בעולם - רק קלט, מודל, ותשובה.',
        closing:
            'Chat עוצר ברגע שהתשובה מוכנה. הוא לא מפעיל כלים ולא משנה דבר מחוץ לשיחה.',
        note: 'זו בדיוק שכבת ה-Transformer: טקסט נכנס, טקסט יוצא.',
    },
    agent: {
        eyebrow: 'שכבה נוספת',
        title: 'Agent הוא לא תשובה חכמה. הוא סבב פעולה מלא',
        body:
            'עד עכשיו ראינו מודל שמקבל קלט ומחזיר תשובה. Agent מוסיף שכבה חדשה: הוא מפרש את המשימה, בוחר דרך פעולה, מפעיל כלי אם צריך, ובודק מה לעשות הלאה.',
        closing:
            'Agent לא רק מנבא טקסט. הוא עוטף את המודל במערכת שמחליטה אם לפעול, באיזה כלי להשתמש, ומה מותר לעשות.',
        note: 'זו אינה שכבה פנימית של ה-Transformer, אלא מערכת סביב המודל.',
    },
} as const;

/**
 * שלב בודד בתצוגת ה-Agent החיה. label = הטקסט הדינמי בליבה ובתחנה. hint = הסבר
 * קצר ב-hover / focus / בחירה. השדות intent/tool/risk/next ממלאים את קונסולת
 * ההחלטה ככל שהסבב מתקדם (רק במצב Agent).
 */
export interface AgentStage {
    id: string;
    label: string;
    hint: string;
    intent?: string;
    tool?: string;
    risk?: string;
    next?: string;
}

export const AGENT_DEMO = {
    layerLabel: 'שכבת Agent · מערכת סביב המודל',
    layerLabelChat: 'מסלול בסיסי · קלט, מודל, תשובה',
    modeChat: 'Chat',
    modeAgent: 'Agent',
    coreLabel: 'LLM',
    coreText: 'המודל מייצר טקסט והצעות פעולה',
    idleCore: 'מוכן',
    run: 'הריצו סבב',
    running: 'רץ...',
    replay: 'הריצו שוב',
    hintPrompt: 'הריצו סבב כדי לראות את המנוע פועל, שלב אחר שלב.',
    input: { label: 'בקשה', text: 'סכם את המייל ושלח תשובה' },
    output: { label: 'תשובה', agent: 'סיכום מוכן, ממתין לאישור שליחה', chat: 'הנה הסיכום שביקשת' },
    consoleTitle: 'קונסולת החלטה',
    consoleLabels: { intent: 'כוונה', tool: 'כלי', risk: 'סיכון', next: 'הצעד הבא' },
    consoleEmpty: 'ממתין',
    chatHint: 'מסלול קצר: קלט, מודל, תשובה.',
    agentHint: 'סבב מלא: פירוש, בחירה, סיכון, פעולה.',
    agentStages: [
        { id: 'in', label: 'קלט', hint: 'הבקשה שלכם נכנסת אל המערכת, ומכאן מתחיל הסבב.' },
        { id: 'task', label: 'מבין משימה', hint: 'מה המטרה האמיתית של הבקשה?', intent: 'סיכום ושליחת תשובה' },
        { id: 'tool', label: 'בוחר כלי', hint: 'איזה כלי יכול לעזור למשימה?', tool: 'קורא מיילים' },
        { id: 'risk', label: 'בודק סיכון', hint: 'האם הפעולה רגישה או דורשת אישור?', risk: 'בינוני: שליחה החוצה' },
        { id: 'act', label: 'מפעיל פעולה', hint: 'מריץ את הכלי ומקבל תוצאה (Observation).', next: 'מריץ את הכלי' },
        { id: 'answer', label: 'מחזיר תשובה', hint: 'מסכם, ולעיתים מבקש אישור לפני שליחה.', next: 'ממתין לאישור' },
    ] as AgentStage[],
    chatStages: [
        { id: 'in', label: 'קלט', hint: 'הבקשה שלכם נכנסת.' },
        { id: 'model', label: 'מודל', hint: 'המודל מייצר תשובה טקסטואלית.' },
        { id: 'out', label: 'תשובה', hint: 'טקסט אחד חוזר אליכם, בלי פעולה בעולם.' },
    ] as AgentStage[],
} as const;

export type AgentDemo = typeof AGENT_DEMO;

/* טיפוסי נתונים לרכיב CourseSystems הניתן לשימוש חוזר. המבוא אינו מרנדר אותו עוד. */

export interface CourseChapterRef {
    /** מספר הפרק לתצוגה. */
    n: string;
    /** שם קצר של הפרק (label מ-courseData). */
    label: string;
}

export interface CourseSystem {
    id: string;
    /** שם המערכת (לא "פרק"). */
    title: string;
    /** טווח הפרקים, למשל "פרקים 1-4". */
    range: string;
    /** משפט סקרנות קצר למצב הסגור של השער. */
    teaser: string;
    /** מטרת הלמידה של המערכת ("מה תגלו"). */
    purpose: string;
    /** תחנות קשורות במפת 14 התחנות (צ׳יפים שנדלקים בפתיחה). */
    stationChips: string[];
    /** הפרקים שבתוך המערכת ("לאילו פרקים זה מוביל"). */
    chapters: CourseChapterRef[];
}

/* ════════════════════════ קריאה לפעולה ════════════════════════ */

export const CTA = {
    eyebrow: 'השלב הבא',
    title: 'השלב הבא: הצ׳אט השקוף',
    body: 'כתבו בקשה פשוטה, ותראו איך המנוע מתחיל לפרש, לדרג ולהחליט.',
    button: 'התחילו את הצ׳אט השקוף',
    href: '/behind-the-scenes-ai/chapter-1',
} as const;

/* ════════════════════════ משפטי המנטור ════════════════════════ */
// מיקרו-קופי דקורטיבי של דמות המנטור. נשמר כאן כדי שגם הוא יהיה ניתן לתרגום.

export const MENTOR_LINES = {
    hero: 'בואו נפתח את המכסה ביחד',
    roadmap: 'מפת המנוע נפתחת',
    cta: 'מכאן מתחילים',
} as const;
