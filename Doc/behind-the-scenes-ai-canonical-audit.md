# מאחורי הקלעים של AI — מקור אמת קנוני ומפת ארכיטקטורה

> מסמך ייחוס (reference) בלבד. **לא** משנה קוד, תוכן פדגוגי, או מספר מוצג.
> נוצר כתיעוד של audit עקביות (יוני 2026). מתעד את המצב הקיים ואת התפר
> הפדגוגי המכוון בין החצי ההצהרתי של הלומדה לחצי המחושב-חי.

---

## 1. הסיכום בשורה אחת

הלומדה כבר בנויה על **מקור אמת אחד למנוע** (פרקים 5→13 מייבאים זה מזה בשרשרת)
ועל **תשתית UI משותפת אחת** (ChapterLayout, accents, types, InsightBox לכל
הפרקים). ההבדלים במספרים בין פרקים מוקדמים למאוחרים אינם דריפט — הם **תפר
פדגוגי מכוון**: פרקים מוקדמים מלמדים עם מספרים עגולים שנכתבו ביד, לפני
שהמתמטיקה נלמדה; פרקים מאוחרים מחשבים חי עם cosine+softmax אמיתי.

---

## 2. מפת הארכיטקטורה: שלוש שכבות

### שכבה A — פרקים הצהרתיים / עצמאיים (מספרים שנכתבו ביד)

| פרק | קובץ נתונים | מה הוא | תלות |
|---|---|---|---|
| 1 | `mockEngine.ts` | מנוע keyword-rule עצמאי (סקירת-על פותחת) | אין |
| 2 | `routingExamples.ts` | טבלה דקלרטיבית של ניתוב בקשות | אין |
| 3 | `probabilityScenarios.ts` | טבלה דקלרטיבית של התפלגויות | אין |
| 4 | `wordEngine.ts` | טבלת שלבי-הקלדה דקלרטיבית | אין |
| 5 | `tokenizer.ts`, `tokenRoles.ts`, `hebrewSplitRules.ts` | טוקנייזר לימודי (Educational split) | אין |
| 14 | `coachData.ts`, `coachEngine.ts` | מאמן בקשות, מעריך חי על ציר *איכות* | עצמאי |

> פרקים אלו **לא** מייבאים מהמנוע המחושב, וזה בכוונה: הם מציגים את הרעיון
> לפני שהמתמטיקה (softmax/cosine) נלמדה.

### שכבה B — עמוד שדרה של מנוע מחושב-חי (מקור אמת יחיד)

```
ch5 tokenizer
   │
ch6 embeddingEngine  ──►  TOKEN_DICTIONARY (Token IDs), DimKey, DIM_INFO/STYLE
   │
ch7 pipelineData ◄─ imports ch6        ──►  cosine, score, softmax, INTENTS
   │
ch8 gateData ◄─ imports ch7            ──►  confidence gate, thresholds, risk
   │
ch9 taskData ──► task parser
   │
ch10 toolData ◄─ imports ch9           ──►  tool selection, tool_score
   │
ch11 observationData ◄─ imports ch10   ──►  observation, next-decision loop
   │
ch12 controlData ──► control layer (risk/permission/approval)
   │
ch13 traces ◄─ imports 6,7,8,9,10,11,12 ──► Behind-the-Scenes Lab (תזמור בלבד)
```

> כל מספר שמוצג בשכבה הזו **מחושב חי** מהמנוע, לא מקודד קשיח. פרק 13 לא
> מחשב דבר בעצמו — הוא מתזמר את המנועים שכבר נבנו ("reuse, לא rebuild").

### שכבה C — תשתית UI משותפת (כבר מאוחדת)

| רכיב | מקור יחיד | נצרך ע"י |
|---|---|---|
| Layout shell | `components/ChapterLayout.tsx` | כל 14 הפרקים |
| Sidebar / TOC | `components/CourseSidebar.tsx` + `lib/courseData.ts` | כל הפרקים |
| Header | `components/CourseHeader.tsx` | כל הפרקים |
| כרטיס מלל / Insight | `components/content/InsightBox.tsx` | כל 14 הפרקים |
| Design tokens (accent) | `components/ai-internals/accents.ts` | כל ה-labs |
| טיפוסי ליבה | `components/ai-internals/types.ts` | כל ה-labs |
| פריסת מעבדה דו-עמודתית | `components/ai-internals/TransparentLabLayout.tsx` | labs רלוונטיים |
| Motion | `framer-motion` + `useReducedMotion`, easing `[0.22,1,0.36,1]` | עקבי בכל פרק |
| RTL | `dir="rtl"` + תנאי `isRTL` | עקבי |

---

## 3. מאגר הנתונים הקנוני (מקור האמת)

הערכים הרשמיים. שכבה B מייצרת אותם חי; כל ערך מוצג שסותר אותם הוא נושא לדיון.

### Token IDs — מקור יחיד: `ch6/embeddingEngine.ts → TOKEN_DICTIONARY`
```
החבילה 1042 · לא 17 · הגיעה 883 · המשלוח 1057 · נמסר 904 · המערכת 2310 ·
מציגה 441 · את 9 · בדוק 51 · למה 88 · שלח 73 · הודעה 612 · ללקוח 1190 ·
שהחבילה 1338 · אבדה 770
```
✅ מקור אחד בלבד. פרק 5 (טוקנייזר) **אינו** מקצה IDs — הם נעולים כטיזר לפרק 6.

### ממדי Meaning Vector — הקנוני: סדר `ch7`
```
Chat (5): [Delivery, Failure, System, Payment, Address]
Agent מוסיף (4): [Action, Risk, Customer, Permission]
```
⚠️ ראו §4 — קיימות שלוש קבוצות-ממדים שונות בין פרקים (4 / 6 / 7).

### "החבילה לא הגיעה"
```
Tokens [החבילה][לא][הגיעה] · IDs [1042][17][883]
Meaning Vector: Delivery 0.95, Failure 0.85, System 0.20, Payment 0.05, Address 0.10
```

### נוסחאות (מקור: `ch13/traces.ts → FORMULAS`)
```
score              = similarity + word_impact + context_bonus     (ch7)
probabilities      = softmax(scores / T)                          (ch7, T=0.72)
confidence_margin  = top - second                                 (ch8)
tool_score         = task_match + data_match - risk_penalty       (ch10)
action_allowed     = confidence_high AND risk_low AND permission_granted  (ch12)
```

### Tool selection ל-"בדוק למה החבילה 123456789 לא הגיעה"
```
Selected: Tracking API
tool_score(Tracking API) = 0.90 + 0.80 - 0.10 = 1.60
tool_score(Email)        = 0.30 + 0.20 - 0.50 = 0.00
```
הערה: ה-match של Tracking API מציג **90** (0.90×100), לא 92. מנוע ch10 כולל
**7 כלים** (כולל Task System ו-Customer Database), לא 5.

### Observation קנונית (מקור: `ch11/observationData.ts → OBSERVATIONS['clear']`)
```
Status: Not delivered · Last scan: Sorting center ·
Last scan time: 2026-06-18 14:20 · Reason: Missing final delivery scan
```
(פרק 11 כולל שדה timestamp נוסף מעבר לקנוני המינימלי.)

### גבולות הרשאה וסיכון (מקור: `ch12/controlData.ts`)
```
Allowed:           Read delivery status, Create internal summary, Draft
Requires approval: Send customer email, Update customer status
Blocked:           Delete record, Change official delivery result
Risk scale:        Read=Low, Analyze/Suggest/Draft=Medium, Send/Update=High,
                   Delete/Close=Critical
```
✅ תואם קנוני במדויק.

---

## 4. טבלת הקונפליקטים (ידועים + מתועדים כמכוונים)

| # | ערך | שכבה A (הצהרתי) | שכבה B (מנוע חי) | הכרעה |
|---|---|---|---|---|
| 1 | **"לא הגיעה" → Package not delivered** | ch1 ≈89% (margin ≈87) · ch3 88% (m81) · ch4 88% (m83) | ch7/8/13 **70%** (m53) | **תפר מכוון. לא משנים.** ראו §5 |
| 2 | **"לא מופיעה" עמום** | ch3: 48 מול 43 (m5) | "...במערכת": 47 מול 29 (m18) | פרומטים *שונים* (3 מילים מול 4) → לא בר-השוואה ישירה |
| 3 | **ממדי Meaning Vector** | ch4: Delivery,System,Payment,Address,**Urgency** (בלי Failure) · ch6 Chat: 6 ממדים (מוסיף Urgency) | ch7/13: **5 הקנוניים** | שלוש קבוצות. כל אחת מתאימה לשלב הלימוד שלה |
| 4 | **Token IDs** | — | מקור יחיד ch6 | ✅ אין קונפליקט |
| 5 | **Tool scores** | — | מחושב חי ch10 | ✅ נוסחה תואמת. match מציג 90 (לא 92); 7 כלים (לא 5) |
| 6 | **Observation** | — | ch11 = קנוני + שדה timestamp | ✅ עקבי |
| 7 | **הרשאות/סיכון** | — | ch12 | ✅ תואם קנוני |

**טענה שלא שוחזרה:** "פרק 13 מציג Risk במקום Address ב-Chat". ב-`traces.ts`
מסלול ה-Chat משתמש ב-`DIMS` הקנוני (כולל Address, ללא Risk). "Risk" מופיע רק
במסלול ה-Agent (שלב Risk Check) — וזה תקין ומכוון.

---

## 5. התפר הפדגוגי המתועד: למה 88 ≠ 70 ולמה זה נכון

שני חצאי הלומדה מדרגים את אותו משפט ("החבילה לא הגיעה") בשלוש דרכים, בכוונה:

1. **פרק 1** (`mockEngine`) — מנוע keyword-rule פשוט, סקירת-על. מספר עגול (≈89%)
   כי המטרה היא לתת תחושה של "המנוע מעריך מה הכי סביר", עוד לפני כל מושג.
2. **פרקים 3–4** — טבלאות דקלרטיביות (88%). המתמטיקה (softmax, cosine) עדיין
   לא נלמדה, ולכן המספרים נכתבים ביד כדי ללמד את *הרעיון* של פער-ביטחון.
3. **פרקים 6–13** — מנוע אמיתי. כאן softmax עם temperature=0.72 וקבוצת intent
   שונה (כולל payment/address, בלי "delivered"/"other") **משטחים** את ההתפלגות,
   ולכן המוביל יורד ל-70%. זה לא באג — זו ההדגמה שמספר "אמיתי" נראה אחרת
   ממספר "אינטואיטיבי".

> **לכן המספרים נשארים כפי שהם.** יישור פרקים 3–4 ל-70% היה הופך טבלה
> לימודית-אינטואיטיבית למספר שמרגיש שרירותי לפני שהמנוע נלמד — פגיעה פדגוגית.
> יישור המנוע ל-88% היה מזייף את התוצאה ה"אמיתית". התפר עצמו הוא המסר.

---

## 6. חוטי היושרה של הלומדה (לשמירה בכל שינוי עתידי)

- **דמיון אינו הסתברות** (ch7: Cosine Similarity הוא ציון כיוון, לא הסתברות).
- **עצירה אינה כישלון** (ch8/11/12: בקשת הקשר/אישור היא הצעד המקצועי).
- **זיהוי משימה אינו אישור לפעול** (ch9 מול ch12).
- **יכולת אינה הרשאה** (ch10: כלי מתאים יכול להיות חסום ב-permission).
- **Educational split** (ch5: הפירוק לאותיות-שימוש הוא לימודי, לא מסחרי).

---

## 7. הזדמנות איחוד יחידה שנותרה (לא בוצעה)

הכפילות האמיתית היחידה בתשתית: מפת **"טון החלטה → accent"** מוגדרת מחדש
בנפרד ב-4 פרקים (`DecisionTone`/`DECISION_META` ב-ch8, ch10, ch11, ch12).
זו הכפלה של *סמנטיקה* בלבד — הצבע עצמו כבר מגיע מ-`accents.ts` המשותף.
איחוד אפשרי לקובץ semantic-map יחיד, אך **לא בוצע** (החלטה: לא לגעת בכלום
כדי לאפס סיכון רגרסיה).
