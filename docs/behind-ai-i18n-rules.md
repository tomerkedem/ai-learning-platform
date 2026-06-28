# כללי i18n - מאחורי הקלעים של AI

## שפות נתמכות

הלומדה מיועדת לתמיכה מלאה ב-6 שפות:

- he
- en
- es
- ru
- ar
- ja

## כיווניות

שפות RTL:

- he
- ar

שפות LTR:

- en
- es
- ru
- ja

## מקור קנוני

עברית היא שפת המקור הקנונית.

כל תרגום צריך לשמר את הכוונה הפדגוגית של המקור העברי, אבל לא להיות תרגום מילולי שמרגיש מלאכותי.

## מונחים קבועים

יש לשמור על מונחים מקצועיים יציבים כאשר הם משמשים כמונחי מוצר או מושגים מקצועיים:

- AI
- Prompt
- Chat
- Agent
- Model Input
- Tokenization
- Tokens
- Embeddings
- Semantic Space
- Attention
- Context Window
- Logits
- Softmax
- Decoding
- Generation Loop
- Hallucinations
- RAG
- Grounding
- Self-Check
- Learning from Mistakes
- Evaluation
- Generalization
- Guardrails
- Full Trace

אפשר להוסיף הסבר מקומי בשפה הרלוונטית, אבל לא לתרגם מונח מקצועי כך שיאבד את הזהות שלו.

## מה לא לתרגם

אין לתרגם:

- stable internal keys
- IDs
- route names
- concept keys
- component names
- quiz question IDs
- enum values
- file names
- API parameters
- internal registry keys

יש לתרגם רק טקסטים שמוצגים למשתמש.

## טקסטים שחייבים להיות במילוני i18n

כל טקסט גלוי למשתמש צריך להגיע ממילון i18n:

- כותרות פרקים.
- תיאורי פרקים.
- כותרות sections.
- טקסטים במעבדות.
- כפתורים.
- labels.
- feedback.
- mentor speech bubbles.
- טקסטי חידונים.
- הסברים בתוצאות חידונים.
- previous / next.
- sticky context labels.
- tooltips אם מוצגים למשתמש.
- empty states.
- error states.
- live/demo labels.

## מצב ידוע כרגע

החלקים שכבר תומכים ב-6 שפות:

- Introduction.
- Chapter 1.
- Chapter 2.
- Current Chapter 5.

שאר הפרקים בעברית בלבד כרגע.

## כללי RTL/LTR

יש להשתמש ב-logical CSS ככל האפשר:

- text-start במקום text-left.
- text-end במקום text-right.
- ps במקום pl.
- pe במקום pr.
- border-s במקום border-l.
- border-e במקום border-r.

אין להפוך layout שלם בצורה עיוורת.

## דמויות ומנטורים

- לא להפוך speech bubbles.
- לא להפוך טקסט.
- אם צריך התאמה כיוונית, עדיף למקם את הדמות בצד המתאים.
- אם אין ברירה וצריך flip לדמות, להפוך רק את הדמות, לא את ה-layout כולו.

## כללי שפה

- עברית טבעית, לא תרגום מאנגלית.
- אנגלית טבעית, לא תרגום מילולי מעברית.
- ערבית RTL טבעית.
- יפנית טבעית ולא תלויה ברווחים לצורך Tokenization.
- לא להשתמש ב-Em dash או En dash בטקסט גלוי.
- להשתמש במקף רגיל בלבד אם צריך.
- ללא emoji בתוך mentor speech bubbles.

## בדיקות חובה במשימת i18n

בכל שינוי i18n:

- לבדוק he.
- לבדוק en.
- לבדוק es.
- לבדוק ru.
- לבדוק ar.
- לבדוק ja.
- לוודא he/ar ב-RTL.
- לוודא en/es/ru/ja ב-LTR.
- לוודא שאין עברית במסלולים שאינם עברית.
- לוודא שלא תורגמו internal keys.
- לוודא שאין Em dash או En dash בטקסט גלוי.
- להריץ typecheck.
- להריץ eslint על קבצים שהשתנו.
