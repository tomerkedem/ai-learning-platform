# Workflow מומלץ מול Claude Code

## כלל ברזל

אין להתחיל בעריכת קבצים בלי Audit.

כל משימה צריכה לעבור:

1. Audit.
2. Plan.
3. Approval.
4. Implement.
5. Verify.
6. Report.
7. Commit only if explicitly approved.

## פקודת פתיחה קבועה

```text
Before editing:
1. Run git status
2. Run git pull --ff-only
3. Run git log --oneline -10
4. Read the relevant docs in /docs
5. Report current baseline and planned files
6. Wait for approval before editing
```

## מסמכי עוגן לפי סוג משימה

בכל משימת behind-ai:

- docs/behind-ai-final-chapter-plan.md
- docs/behind-ai-chapter-template.md

במשימת i18n:

- docs/behind-ai-i18n-rules.md

במשימת UI או מנטור:

- docs/behind-ai-visual-rules.md
- docs/behind-ai-mentor-rules.md

במשימת אנימציה:

- docs/behind-ai-animation-rules.md
- docs/behind-ai-visual-rules.md

במשימת סדר עבודה או ריפקטור:

- docs/behind-ai-implementation-roadmap.md

## פורמט משימה מומלץ

```text
We are working on the interactive course:
מאחורי הקלעים של AI
Course type: לומדה / interactive course.

Read:
- docs/behind-ai-final-chapter-plan.md
- docs/behind-ai-chapter-template.md
- [other relevant docs]

Task:
[one small task only]

Scope:
[exact area/files]

Do not touch:
[list exclusions]

Workflow:
1. Audit first
2. Report findings
3. Provide exact file-change plan
4. Wait for approval before editing

After implementation:
- run npx tsc --noEmit
- run eslint on changed files
- run relevant route checks
- report changed files and git status

Do not commit unless explicitly approved.
```

## דוח סיום חובה

בסוף כל משימה Claude Code צריך לדווח:

1. Files changed.
2. What changed in each file.
3. What was intentionally not changed.
4. Commands run.
5. Typecheck result.
6. ESLint result.
7. Route checks.
8. Manual visual checks if relevant.
9. Remaining risks.
10. Final git status.

## מתי לעצור ולדווח

Claude Code צריך לעצור אם:

- working tree לא נקי בתחילת המשימה.
- git pull נכשל.
- HEAD לא תואם baseline צפוי.
- נמצא שינוי לא קשור.
- יש סיכון לאובדן תרגומים.
- צריך להזיז route או תיקיות.
- typecheck נכשל בגלל קובץ שלא קשור למשימה.
- נדרש שינוי מחוץ ל-scope.
