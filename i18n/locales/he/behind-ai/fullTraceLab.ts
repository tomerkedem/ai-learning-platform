// Chapter 19 is an educational, scripted trace. It exposes observable stages, never hidden chain of thought.
export type TraceLayer = 'model' | 'product' | 'tool' | 'human' | 'offline';
export type TraceStageStatus = 'required' | 'optional' | 'skipped' | 'repeated' | 'stop';

export interface TraceFact { label: string; value: string }
export interface TraceStage {
    id: string;
    group: string;
    layer: TraceLayer;
    status: TraceStageStatus;
    tab: string;
    title: string;
    refresher: string;
    input: string;
    process: string;
    output: string;
    facts?: TraceFact[];
    details?: { label: string; items: string[] };
    branchReason?: string;
    stopReason?: string;
}

export interface FullTraceLabContent {
    sectionEyebrow: string;
    sectionTitle: string;
    sectionIntro: string;
    heading: string;
    kicker: string;
    promptLabel: string;
    prompt: string;
    disclosure: string;
    variabilityNote: string;
    layerHeading: string;
    layers: Record<TraceLayer, { label: string; description: string }>;
    statusLabels: Record<TraceStageStatus, string>;
    labels: {
        input: string; process: string; output: string; details: string; branchReason: string;
        stopReason: string; stage: string; previous: string; next: string; reset: string;
        selectStage: string; progress: (current: number, total: number) => string;
    };
    stages: TraceStage[];
    branches: {
        title: string;
        intro: string;
        missingInfo: { label: string; outcome: string };
        knowledge: { label: string; outcome: string };
        toolNeeded: { label: string; outcome: string };
        toolError: { label: string; first: string; retry: string; exhausted: string };
        approval: {
            title: string; pending: string; deny: string; approve: string; denied: string;
            approved: string; accepted: string; rejected: string; verifyAccepted: string; verifyRejected: string;
        };
        restart: string;
    };
    finalStatuses: { waiting: string; denied: string; failed: string; success: string; partial: string };
    sr: { stageGroup: string; stageDetail: string; branchGroup: string };
}

export const fullTraceLab: FullTraceLabContent = {
    sectionEyebrow: 'Full Trace Lab',
    sectionTitle: 'בקשה אחת, שכבות רבות, תוצאה שניתנת לבדיקה',
    sectionIntro: 'עקבו אחר אותה בקשת מעקב דרך הרכבת הקשר, עיבוד המודל, עיגון, לולאת Agent, בקרה, ביצוע מדומה ואימות. המסלול הראשי פשוט, ופרטים מתקדמים והסתעפויות זמינים לפי בחירה.',
    heading: 'המסלול המלא',
    kicker: 'SCRIPTED EDUCATIONAL TRACE',
    promptLabel: 'בקשת המשתמש',
    prompt: 'בדוק מה קורה עם החבילה 123456789, נסח עדכון ללקוח, ואל תשלח בלי אישור שלי.',
    disclosure: 'זו הדמיה לימודית מתוסרטת. אין חיבור חי למעקב או להודעות, אין שליחה אמיתית, ואין חשיפה של שרשרת חשיבה נסתרת.',
    variabilityNote: 'לא כל בקשה משתמשת בזיכרון, RAG, כלים, Agent, אישור, בדיקה עצמית או שיפור מאוחר. שלבים יכולים להידלג, לחזור או לעצור מוקדם, והארכיטקטורה משתנה בין מוצרים.',
    layerHeading: 'השכבה הפעילה',
    layers: {
        model: { label: 'Model internal', description: 'חישוב בתוך המודל' },
        product: { label: 'Application or product', description: 'הרכבה, תזמור ומצב משימה סביב המודל' },
        tool: { label: 'External system or tool', description: 'אינטגרציה חיצונית מוגדרת' },
        human: { label: 'Human control', description: 'החלטה מפורשת של אדם' },
        offline: { label: 'Offline improvement process', description: 'תהליך מאוחר ונפרד מהתגובה החיה' },
    },
    statusLabels: { required: 'במסלול הראשי', optional: 'אופציונלי', skipped: 'דולג בתרחיש', repeated: 'עשוי לחזור', stop: 'נקודת עצירה' },
    labels: {
        input: 'קלט', process: 'מה משתנה או מוחלט', output: 'פלט', details: 'פרטים קומפקטיים',
        branchReason: 'סיבת ההסתעפות', stopReason: 'סיבת העצירה', stage: 'שלב', previous: 'הקודם', next: 'הבא',
        reset: 'איפוס המסלול', selectStage: 'בחירת שלב מרכזי', progress: (current, total) => `מיקום נוכחי ${current} מתוך ${total}, במסלול שניתן לדלג בו`,
    },
    stages: [
        {
            id: 'context', group: 'קלט והקשר', layer: 'product', status: 'required', tab: 'הרכבת הקשר', title: 'המוצר מרכיב את מה שזמין עכשיו',
            refresher: 'אחסון אינו קלט למודל. רק פריטים שנבחרו ומורכבים להקשר הנוכחי נכנסים.',
            input: 'בקשת המשתמש והמצב הנוכחי של השיחה.', process: 'המוצר מוסיף כללי מערכת רלוונטיים ומבדיל היסטוריה, זיכרון שמור ו־retention. זיכרון יכול להישלף, retention הוא רק מדיניות שמירה.',
            output: 'הקשר נוכחי מורכב. בתרחיש הזה אין צורך בזיכרון שמור ואין עדיין תוצאת כלי.',
            facts: [
                { label: 'בקשה נוכחית', value: 'בדיקת חבילה 123456789 וטיוטה בלבד' },
                { label: 'היסטוריית שיחה', value: 'רק ההודעה הנוכחית נדרשת' },
                { label: 'זיכרון שמור', value: 'אופציונלי, לא נשלף' },
                { label: 'Retention', value: 'מדיניות שמירה, לא זיכרון שנכנס אוטומטית' },
                { label: 'RAG / תוצאות קודמות', value: 'אופציונלי, עדיין אין' },
            ],
        },
        {
            id: 'model-input', group: 'קלט והקשר', layer: 'product', status: 'required', tab: 'קלט המודל', title: 'רק החבילה המורכבת נמסרת למודל',
            refresher: 'זהו ייצוג חינוכי שקוף. פורמט ופרטי יישום משתנים בין מוצרים.',
            input: 'כללי מערכת, מטרת המשתמש והקשר נבחר.', process: 'המוצר אורז מבנה פשוט בלי לחשוף prompt נסתר או לטעון שזה פורמט אוניברסלי.',
            output: 'System: השתמש במקורות עדכניים ואל תבצע שליחה ללא אישור. Goal: בדוק חבילה ונסח עדכון. Constraint: לא לשלוח. Known: 123456789. Missing: סטטוס ותאריך. Sources: אין עדיין.',
        },
        {
            id: 'tokens', group: 'עיבוד המודל', layer: 'model', status: 'required', tab: 'טוקנים ו־IDs', title: 'טקסט הופך לטוקנים ואז למזהים',
            refresher: 'טוקן יכול להיות מילה, חלק ממילה או סימן. ID הוא כתובת במילון, לא משמעות.',
            input: 'קטע מהקלט: "בדוק ... החבילה 123456789".', process: 'הטוקנייזר מפרק חלקים וממפה כל חלק למזהה.', output: 'רצף IDs שניתן לעיבוד מספרי.',
            details: { label: 'דוגמה קטנה בלבד', items: ['"בדוק" → token ID 4812', '"החבילה" → token ID 907', '"123456789" עשוי להתפצל לכמה טוקנים', 'המספרים הם מזהים בלבד ואינם מכילים משמעות בעצמם'] },
        },
        {
            id: 'representations', group: 'עיבוד המודל', layer: 'model', status: 'required', tab: 'Embeddings ומשמעות', title: 'IDs הופכים לייצוגים שניתנים לשינוי',
            refresher: 'Embedding הוא וקטור נלמד, לא ID ולא נקודה קבועה אחת של “משמעות”.',
            input: 'רצף token IDs.', process: 'כל ID ממופה לייצוג, ושכבות המודל משנות את הייצוגים בהתאם להקשר וליחסים סמנטיים.', output: 'ייצוגים הקשריים שמקשרים חבילה, בדיקה, לקוח וגבול אישור.',
            details: { label: 'ייצוג מקוצר, ללא דיוק מדומה', items: ['4812 → [0.2, −0.4, …]', '907 → [0.7, 0.1, …]', 'המיקום הסמנטי משתנה דרך השכבות ואינו מפה קבועה אחת'] },
        },
        {
            id: 'attention-context', group: 'עיבוד המודל', layer: 'model', status: 'required', tab: 'Attention והחלון', title: 'המודל משקלל קשרים בתוך החלון הנוכחי',
            refresher: 'Attention הוא משקל דינמי לחישוב הנוכחי, לא דירוג קבוע של מילים.',
            input: 'הייצוגים וכל המידע שנכנס לחלון ההקשר כעת.', process: 'בצעד הנוכחי יש קשר חזק בין “אל תשלח” ל“אישור”; בצעד אחר המשקלים יכולים להשתנות.', output: 'ייצוג מעודכן לחיזוי הטוקן הבא.',
            facts: [{ label: 'חלון ההקשר', value: 'המידע הזמין לתגובה הזאת עכשיו, לא כל מה שנשמר אי פעם' }],
        },
        {
            id: 'generation', group: 'עיבוד המודל', layer: 'model', status: 'repeated', tab: 'Logits עד יצירה', title: 'ציונים הופכים להתפלגות, ואז decoding בוחר',
            refresher: 'Logits הם ציונים. Softmax יוצר התפלגות. Decoding הוא שלב הבחירה.',
            input: 'הייצוג המעודכן בצעד היצירה.', process: 'logits: “בדקנו” 2.0, “שלחנו” 1.0, “מחר” 0.0. softmax: 0.665, 0.245, 0.090, סכום 1.000. decoding בוחר “בדקנו”.',
            output: '“בדקנו” מצורף להקשר, והלולאה חוזרת לטוקן הבא עד סימן עצירה, מגבלת אורך או עצירת מערכת.',
            details: { label: 'הדוגמה המספרית היחידה', items: ['Logits הם 2.0 / 1.0 / 0.0, לא הסתברויות', 'Softmax מחזיר 0.665 / 0.245 / 0.090', 'Softmax אינו בוחר', 'Decoding בוחר את “בדקנו” והלולאה חוזרת'] },
        },
        {
            id: 'grounding-choice', group: 'איכות ועיגון', layer: 'product', status: 'optional', tab: 'סיכון ועיגון', title: 'המערכת בוחרת אם נדרש מקור חיצוני',
            refresher: 'טקסט יכול להישמע סביר גם בלי ראיה עדכנית. זו אפשרות להזיה, לא ודאות שתתרחש.',
            input: 'נדרשת עובדה עדכנית על חבילה מסוימת.', process: 'נתיב ללא מקור נדחה למשימה הזאת. המערכת מעדיפה grounding בכלי; בשאלת ידע פשוטה ייתכן שהשלב יידלג.', output: 'החלטה לבקש הצעת tool call במקום לענות מהדפוסים בלבד.',
            branchReason: 'סטטוס משלוח משתנה בזמן ודורש ראיה עדכנית. אחזור מוסיף ראיה להקשר ואינו משנה את פרמטרי המודל.',
        },
        {
            id: 'agent-tool', group: 'לולאת Agent', layer: 'product', status: 'repeated', tab: 'Agent ובחירת כלי', title: 'Agent הוא מערכת סביב המודל',
            refresher: 'Workflow קבוע עוקב אחר צעדים ידועים. Agent יכול להתאים את הצעד הבא לתוצאה, בתוך מגבלות.',
            input: 'Goal: בדיקת סטטוס וטיוטה. State: חסר סטטוס. Constraints: אין שליחה. Proposal: tracking.lookup.', process: 'המודל עשוי להציע קריאת כלי מובנית; האפליקציה בודקת שהכלי זמין ומתאים. מצב המשימה נפרד מזיכרון ארוך טווח.',
            output: 'Tool: tracking.lookup. Input: { trackingNumber: "123456789" }. Expected: status and confirmedArrivalDate.',
            facts: [{ label: 'מגבלה', value: 'ניסיון ראשון ועוד retry אחד בלבד במקרה שגיאה' }, { label: 'המשך אפשרי', value: 'להמשיך, לנסות שוב, לשאול, לבקש אישור או לעצור' }],
        },
        {
            id: 'authorization', group: 'לולאת Agent', layer: 'product', status: 'required', tab: 'הרשאה ומדיניות', title: 'האפליקציה בודקת הרשאה לפני הפעלת כלי',
            refresher: 'Authorization אינו אישור אנושי. ביטחון גבוה אינו עוקף אף אחד מהם.',
            input: 'זהות, integration, משאב ופעולה מבוקשת.', process: 'בדיקה: האם הזהות רשאית לקרוא tracking עבור המספר הזה? החלטת מדיניות: allowed לקריאה; שליחה עתידית דורשת approval. פעולה חסומה במדיניות לא נפתחת באמצעות אישור אדם.', output: 'קריאת המעקב מותרת; שליחת הודעה עדיין לא מאושרת.',
        },
        {
            id: 'tool-result', group: 'לולאת Agent', layer: 'tool', status: 'optional', tab: 'ביצוע כלי', title: 'הכלי החיצוני מחזיר תוצאה נצפית',
            refresher: 'הצלחה טכנית של קריאת כלי אינה בהכרח השלמת מטרת המשתמש.',
            input: 'tracking.lookup({ trackingNumber: "123456789" }).', process: 'האינטגרציה המדומה מחזירה נתונים בתוך מגבלת הניסיון.', output: 'status: delayed. confirmedArrivalDate: unavailable.',
            facts: [{ label: 'עדכון מצב משימה', value: 'סטטוס ידוע; תאריך עדיין חסר; צריך לנסח בלי להמציא' }, { label: 'אמינות מקור', value: 'גם ראיה חיצונית יכולה להיות חלקית או שגויה' }],
        },
        {
            id: 'draft-check', group: 'איכות ועיגון', layer: 'product', status: 'optional', tab: 'טיוטה ובדיקה', title: 'נוצרת טיוטה מעוגנת ונערכת בדיקה עצמית',
            refresher: 'בדיקה עצמית היא pass נוסף של המערכת, לא הוכחת אמת ולא תמליל חשיבה נסתר.',
            input: 'תוצאת הכלי הוכנסה להקשר המשימה.', process: 'נבדק בגלוי: תואם לעיכוב ✓; לא הומצא תאריך ✓; לא נטען שנשלח ✓; אי־הוודאות גלויה ✓.',
            output: '“שלום, בדקנו את החבילה 123456789. לפי המעקב היא בעיכוב, ועדיין אין מועד הגעה מאושר. נעדכן כשיהיה מידע חדש.”',
            facts: [{ label: 'מגבלת הבדיקה', value: 'היא עשויה לתפוס בעיות אך אינה מבטיחה שהמקור או הטיוטה נכונים' }],
        },
        {
            id: 'approval', group: 'בקרה ופעולה', layer: 'human', status: 'stop', tab: 'אישור אנושי', title: 'שליחה דורשת החלטה מפורשת',
            refresher: 'ההרשאה המערכתית מאפשרת יכולת; approval מאשר פעולה מסוימת.',
            input: 'טיוטה מעוגנת, policy: approval required.', process: 'ברירת המחדל בהדגמה היא לא לשלוח. הלומד יכול לבחור הסתעפות חינוכית של אישור או דחייה.', output: 'ממתין לאישור. שום הודעה לא נשלחה.',
            stopReason: 'המשתמש ביקש במפורש לא לשלוח ללא אישור.',
        },
        {
            id: 'verification', group: 'בקרה ופעולה', layer: 'product', status: 'optional', tab: 'ביצוע ואימות', title: 'אחרי פעולה מדומה בודקים תוצאה נצפית',
            refresher: 'Tool accepted אינו תמיד “המשימה הושלמה”; היעד של המשתמש חייב להתקיים.',
            input: 'רק אם ניתן approval חינוכי: sendMessage עם הטיוטה.', process: 'האינטגרציה המדומה מדווחת accepted או rejected; האפליקציה מאמתת את הדיווח מול מטרת המשימה.', output: 'סטטוס כן: success, partial, waiting for approval, blocked, denied, stopped או failed.',
            branchReason: 'ללא אישור השלב מדולג והמצב נשאר waiting for approval.',
        },
        {
            id: 'offline', group: 'שיפור מאוחר', layer: 'offline', status: 'optional', tab: 'משוב והערכה', title: 'שיפור אפשרי קורה מאוחר ובנפרד',
            refresher: 'שיחה אחת אינה מאמנת מחדש את המודל מיד.',
            input: 'משוב עשוי להישלח ולהישמר או להיבדק.', process: 'לא כל משוב נבחר. דוגמאות מתאימות עשויות לשפר prompt, כלל, workflow, מקור אחזור או מודל. לאחר מכן בודקים את העדכון על מקרי held-out נפרדים מדוגמאות השיפור.', output: 'עדכון אפשרי שהוערך לפני פריסה; אין למידה מיידית מהשיחה הזאת.',
            branchReason: 'זהו מסלול offline נפרד, לא המשך של התגובה החיה.',
        },
    ],
    branches: {
        title: 'בדקו הסתעפויות בלי לעזוב את התרחיש הראשי',
        intro: 'הבחירה משנה הדמיה בלבד ומסבירה למה המסלול ממשיך, מדלג או נעצר.',
        missingInfo: { label: 'חסר מספר מעקב', outcome: 'שואלים את המשתמש במקום להמציא מזהה.' },
        knowledge: { label: 'שאלת ידע פשוטה', outcome: 'כלי ו־approval עשויים להידלג כי אין צורך במידע עדכני או פעולה.' },
        toolNeeded: { label: 'סטטוס החבילה הנוכחית', outcome: 'נדרש כלי כי הסטטוס משתנה בזמן.' },
        toolError: { label: 'הדמיית שגיאת כלי', first: 'ניסיון 1 נכשל. נשאר retry אחד.', retry: 'Retry 1 מתוך 1 נכשל.', exhausted: 'המגבלה מוצתה. עוצרים ב־failed ולא טוענים שהמשימה הצליחה.' },
        approval: {
            title: 'החלטת approval חינוכית', pending: 'ממתין להחלטה, לא נשלח', deny: 'דחה שליחה', approve: 'אשר שליחה מדומה',
            denied: 'האישור נדחה. אין ביצוע והמצב denied.', approved: 'אישור התקבל להדמיה בלבד. אפשר לדמות תשובת integration.',
            accepted: 'הדמה accepted', rejected: 'הדמה rejected', verifyAccepted: 'ה־integration דיווח accepted והאימות תואם למטרה: success מדומה.',
            verifyRejected: 'ה־integration דיווח rejected. האימות מונע success והמצב failed.',
        },
        restart: 'התחל מחדש',
    },
    finalStatuses: { waiting: 'waiting for approval', denied: 'denied', failed: 'failed', success: 'success (simulated)', partial: 'partial completion' },
    sr: { stageGroup: 'בחירת שלב במסלול', stageDetail: 'פרטי השלב הפעיל', branchGroup: 'בחירת הסתעפות חינוכית' },
};
