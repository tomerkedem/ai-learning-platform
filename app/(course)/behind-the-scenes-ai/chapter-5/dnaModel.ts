// נתוני ה-DNA הסמנטי של פרק 5: סט קטן שפרק 5 מחזיק ומתחזק בעצמו.
//
// בשונה מהמפה הראשית (semanticSpace.ts), המקטע הזה משתמש מחדש רק ברכיב התצוגה הגנרי
// MeaningDnaStrip מפרק 4. מזהי המשפטים, הטקסט והפרופילים כאן שייכים לפרק 5 ואינם תלויים
// ב-SENTENCE_STRUCTS או בתוכן הפוסטלי של פרק 4.
//
// שלושה ממדים ניטרליים מבחינת תחום:
//   roomRelevance - כמה המשפט קשור בכלל למצב החדר/החלון.
//   closedness    - כמה המשפט מצביע על כך שהחלון סגור/לא פתוח.
//                   גבוה = סגור/לא פתוח. נמוך = פתוח. (לא "openness": הכיוון חייב
//                   להיות מפורש מהשם, כדי שלא ניתן לפרש אותו הפוך.)
//   discomfort    - כמה אי-נוחות/תלונה המשפט מבטא.
//
// הפרופילים נבנו כך שכל תוצאת DNA תהיה מוצדקת מבחינה לימודית:
//   window-not-open מול window-shut    -> כמעט זהים בשלושת הממדים (דמיון חזק)
//   window-not-open מול window-is-open -> roomRelevance נשאר משותף, closedness ו-
//                                         discomfort שניהם מתהפכים (סחיפה משמעותית)
//   window-not-open מול room-is-cold   -> משותף ב-roomRelevance וב-discomfort, לא ב-
//                                         closedness (חפיפה חלקית: אותו עולם, עובדה שונה)
//   window-not-open מול cat-on-couch   -> קרוב לאפס בכל ממד (כמעט בלי חפיפה)

export type DnaDimKey = 'roomRelevance' | 'closedness' | 'discomfort';

/** סדר הממדים המוצגים כגנים בסולם ה-DNA של פרק 5. */
export const DNA_DIMS: DnaDimKey[] = ['roomRelevance', 'closedness', 'discomfort'];

export type DnaProfile = Record<DnaDimKey, number>;

export type DnaSentenceId = 'window-not-open' | 'window-shut' | 'window-is-open' | 'room-is-cold' | 'cat-on-couch';

/** רשומת משפט מבנית: מזהה ופרופיל מספרי בלבד. הטקסט המקומי מגיע מהמילון לפי מזהה. */
export interface DnaSentenceStruct {
    id: DnaSentenceId;
    profile: DnaProfile;
}

export const DNA_SENTENCES: DnaSentenceStruct[] = [
    { id: 'window-not-open', profile: { roomRelevance: 0.75, closedness: 0.85, discomfort: 0.45 } },
    { id: 'window-shut', profile: { roomRelevance: 0.72, closedness: 0.80, discomfort: 0.42 } },
    { id: 'window-is-open', profile: { roomRelevance: 0.70, closedness: 0.10, discomfort: 0.05 } },
    { id: 'room-is-cold', profile: { roomRelevance: 0.65, closedness: 0.05, discomfort: 0.55 } },
    { id: 'cat-on-couch', profile: { roomRelevance: 0.05, closedness: 0.00, discomfort: 0.05 } },
];

/** מאתר רשומת משפט מבנית לפי מזהה. */
export function getDnaSentence(id: DnaSentenceId): DnaSentenceStruct | undefined {
    return DNA_SENTENCES.find((s) => s.id === id);
}

/** צורת התוכן המקומי (locale) עבור מקטע ה-DNA של פרק 5. כל שפה חייבת לעמוד בה. */
export interface SemanticSpaceDnaDict {
    /** טקסט לומד לכל משפט DNA, לפי מזהה יציב. */
    sentences: Record<DnaSentenceId, { text: string; ttsLine: string }>;
    /** תוויות הגנים (הממדים) לפי מזהה יציב. */
    genes: Record<DnaDimKey, string>;
    /** מחרוזות הפסיקה/המקרא של הסולם, גנריות ובלתי תלויות תחום. */
    dna: {
        title: string;
        intro: string;
        roleActive: string;
        roleCompare: string;
        twistMeaning: string;
        leadShared: (names: string) => string;
        leadNone: string;
        sharedBadge: string;
        guideSize: string;
        guideBond: string;
        stayedClose: string;
        drifted: string;
        axesNote: string;
    };
}
