"use client";

// מצב הגישה של הלומד, כפי שהשרת חישב אותו ב-layout, לתצוגה בלבד (נעילה בסרגל, סטטוס
// בפאנל החשבון). האכיפה נעשית בשרת בכל עמוד מוגן, לא כאן.

import React, { createContext, useContext } from 'react';
import type { CourseAccess } from './access';

const SIGNED_OUT: CourseAccess = { status: 'signed-out', expiresAt: null };
const CourseAccessContext = createContext<CourseAccess>(SIGNED_OUT);

export function CourseAccessProvider({ value, children }: { value: CourseAccess; children: React.ReactNode }) {
    return <CourseAccessContext.Provider value={value}>{children}</CourseAccessContext.Provider>;
}

export function useCourseAccess(): CourseAccess {
    return useContext(CourseAccessContext);
}
