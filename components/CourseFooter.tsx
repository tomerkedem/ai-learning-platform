// src/components/CourseFooter.tsx
"use client";

import Image from 'next/image';
import React from 'react';
import { usePathname } from 'next/navigation';
import { courses } from '@/lib/courseData';

// הנתיב לתמונה השניה שנמצאת בתיקיית public (השתמשתי בסיומת .png כפי שציינת)
const IMAGE_TWO_PATH = "/01dbd09c-b44a-4b1a-b364-bd4881435ef2.png";

// טקסט ברירת מחדל כשאין לומדה פעילה (למשל בדף הבית).
const DEFAULT_LABEL = "לומדות אינטראקטיביות למפתחי AI";

/**
 * מזהה את הלומדה הפעילה לפי ה-URL ומחזיר את שמה, באופן דינמי מתוך courseData.
 * הבסיס של כל לומדה נגזר מה-href של המבוא שלה (ללא הסגמנט האחרון), כך שאין כתיב קשיח.
 */
function getActiveCourseTitle(pathname: string): string {
    for (const course of Object.values(courses)) {
        const firstHref = course.chapters[0]?.href;
        if (!firstHref) continue;
        const base = firstHref.slice(0, firstHref.lastIndexOf('/'));
        if (base && pathname.startsWith(base)) {
            return course.title.he;
        }
    }
    return DEFAULT_LABEL;
}

export function CourseFooter() {
    const pathname = usePathname();
    const courseTitle = getActiveCourseTitle(pathname ?? '');

    return (
        // הוספנו 'group' והגדלנו את הריפוד העליון ל-pt-64 כדי למנוע חפיפה עם התמונה
        <footer className="relative w-full bg-slate-950 pt-64 border-t border-slate-800/50 group">
                        {/* רקע תמונה (חלק עליון) - גובה h-48 נשאר כפי שצוין */}
            <div className="absolute top-0 left-0 w-full h-48 overflow-hidden"> 
                <Image 
                    src={IMAGE_TWO_PATH} 
                    alt="נוף דיגיטלי המייצג מרחב נתונים וקטורי" 
                    // קלאסים חדשים לאפקט מעבר העכבר:
                    // 1. transition-all duration-700: הופך את המעבר לחלק.
                    // 2. group-hover:grayscale-0: מבטל את הגוון האפור במעבר עכבר על הפוטר כולו.
                    // 3. group-hover:opacity-60: מעלה את האטימות מעט כדי להבליט את הצבעים.
                    className="w-full h-full object-cover grayscale opacity-30 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-60" 
                    width={1920}
                    height={300}
                    sizes="100vw"
                    priority={false} 
                />
                {/* כיסוי כהה למטה למעבר חלק יותר */}
                 <div className="absolute bottom-0 w-full h-10 bg-linear-to-t from-slate-950 to-transparent"></div>
            </div>

            {/* תוכן הפוטר (חלק תחתון) */}
            <div className="relative z-10 text-center py-2 px-2 text-slate-400 max-w-4xl mx-auto">
                {/* ... (שאר התוכן נשאר זהה) */}
                {/* הוספת שורה כדי שהטקסט לא יעלה על התמונה */}
                <p className="text-sm text-slate-400 mb-1">{courseTitle}</p>
                <p className="text-xs mb-4">
                   © 2026 תומר קדם. כל הזכויות שמורות.
                </p>
               
            </div>
        </footer>
    );
}