"use client";

// זיהוי יכולת בזמן ריצה (capability detection) למעבדה המאוחדת.
//
// השאלה היחידה: האם השכבה החיה (Custom) זמינה — כלומר האם ה-proxy וה-מפתח
// נגישים. הבדיקה זריזה ולא חוסמת: pinging ל-GET /api/scenario עם timeout קצר,
// וברירת המחדל בכל כישלון היא 'offline' (שכבה 1). חוסר מפתח או חוסר רשת
// *מורידים שכבה*, לא שוברים כלום.

import { useEffect, useState } from 'react';

export type LiveCapability = 'checking' | 'live' | 'offline';

/** מודד אם המנוע החי זמין. מתחיל ב-'checking', מתייצב ל-'live' או 'offline'. */
export function useLiveCapability(): LiveCapability {
    const [cap, setCap] = useState<LiveCapability>('checking');

    useEffect(() => {
        let alive = true;
        const controller = new AbortController();
        // בדיקה לא-חוסמת: אם לא חזרה תוך 2.5 שניות, מניחים offline.
        const timer = setTimeout(() => controller.abort(), 2500);

        fetch('/api/scenario', { method: 'GET', signal: controller.signal })
            .then((r) => (r.ok ? r.json() : { live: false }))
            .then((data: { live?: boolean }) => {
                if (alive) setCap(data?.live ? 'live' : 'offline');
            })
            .catch(() => {
                if (alive) setCap('offline');
            })
            .finally(() => clearTimeout(timer));

        return () => {
            alive = false;
            clearTimeout(timer);
            controller.abort();
        };
    }, []);

    return cap;
}
