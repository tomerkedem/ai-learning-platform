// components/language/headerEarth.ts
//
// כדור הארץ המוקטן בכפתור בורר השפה. הועתק מ-BookForge (src/scripts/header-earth-3d.ts)
// עם אותן הגדרות מיניאטורה (מצלמה קרובה, שפת אטמוספרה חזקה, low-power), בהירות מוגברת
// כדי שים ויבשה ייראו בגודל הכפתור. הוסר parallax.
//
// במנוחה הכדור מסתובב לאט (סיבוב אחד ב-40 שניות). ריחוף או פוקוס מקלדת עוצרים אותו ומסובבים
// אותו בהחלקה אל הנקודה הראשית של השפה הפעילה (setHome), ושם הוא נשאר. ביציאה הסיבוב ממשיך
// מהמקום הנוכחי, בלי קפיצה. בעכבר/עט אפשר לגרור אותו מעל הכפתור; מגע לא גורר (הקשה פותחת,
// גלילה נשמרת). גרירה לא פותחת את החלון (takeDrag). הלולאה לא נוגעת ב-React, ונעצרת כשהכדור
// מחוץ למסך או מוחזק. תנועה מופחתת: אין סיבוב; הכדור עומד על השפה.

import { aimRotation, createEarthScene, toLocal, wrapAngle, type LatLon } from './earthRenderingCore';

const DRAG_SPEED = 0.025; // רדיאנים לפיקסל: כדור של 40px
const DRAG_THRESHOLD_PX = 4;
const IDLE_SPEED = (2 * Math.PI) / 40; // רדיאנים לשנייה
const AIM_MS = 650;
const POLE_CLAMP = Math.PI / 2 - 0.05;

export interface HeaderEarth {
    /** snap: קפיצה מיידית (למשל כשהחלון פתוח והכדור מוסתר מתחתיו). */
    setHome(point: LatLon, snap?: boolean): void;
    /** תמונת PNG של הכדור כפי שהוא עכשיו, או null לפני שהמרקם נטען. */
    snapshot(): string | null;
    /** true אם הלחיצה האחרונה הייתה גרירה, כדי שהקליק שאחריה לא יפתח את החלון. */
    takeDrag(): boolean;
    destroy(): void;
}

export function createHeaderEarth(container: HTMLElement, trigger: HTMLElement, home: LatLon, reducedMotion: () => boolean): HeaderEarth {
    const core = createEarthScene(container, {
        pixelRatioCap: 3,
        cameraDistance: 3.55,
        atmosphereRimExponent: 4.0,
        atmosphereMaxIntensityLit: 0.88,
        toneMappingExposure: 1.45,
        ambientIntensity: 1.05,
        powerPreference: 'low-power',
        oceanLift: 2.4,
    });
    const { scene, camera, renderer, canvas, earth } = core;
    scene.visible = false;
    canvas.style.borderRadius = '50%';
    canvas.style.pointerEvents = 'none';

    let homeRot = aimRotation(toLocal(home));
    earth.rotation.set(homeRot.x, homeRot.y, 0);
    let rafId: number | null = null;
    let lastTime = 0;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let dragged = false;
    let hovered = false;
    let focused = false;
    let onScreen = true;
    // מעבר אל השפה: מנקודת ההתחלה, בהפרש הקצר ביותר. start נקבע בפריים הראשון.
    let aim: { x0: number; y0: number; dx: number; dy: number; start: number } | null = null;

    const held = () => hovered || focused || pointerId !== null;
    const render = () => {
        if (!core.isDisposed()) renderer.render(scene, camera);
    };
    const stop = () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
    };
    const tick = (time: number) => {
        rafId = null;
        const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0;
        lastTime = time;
        if (aim) {
            aim.start ||= time;
            const p = Math.min(1, (time - aim.start) / AIM_MS);
            const e = 1 - (1 - p) ** 3; // ease-out
            earth.rotation.x = aim.x0 + aim.dx * e;
            earth.rotation.y = aim.y0 + aim.dy * e;
            if (p === 1) aim = null;
        } else if (held()) {
            return;
        } else {
            earth.rotation.y += dt * IDLE_SPEED;
        }
        render();
        rafId = requestAnimationFrame(tick);
    };
    // התחלת הלולאה (או המשך אחרי עצירה) מהמקום הנוכחי. ממשיכה את עצמה עד שהכדור מוחזק.
    const run = () => {
        if (rafId !== null || !onScreen || reducedMotion() || (!aim && held())) return;
        lastTime = 0;
        rafId = requestAnimationFrame(tick);
    };
    const aimHome = () => {
        if (reducedMotion()) {
            aim = null;
            earth.rotation.set(homeRot.x, homeRot.y, 0);
            render();
            return;
        }
        const { x, y } = earth.rotation;
        aim = { x0: x, y0: y, dx: homeRot.x - x, dy: wrapAngle(homeRot.y - y), start: 0 };
        run();
    };

    const onPointerEnter = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        hovered = true;
        aimHome();
    };
    const onPointerLeave = () => {
        hovered = false;
        run();
    };
    // רק פוקוס מקלדת: קליק בעכבר משאיר פוקוס על הכפתור, ואז היציאה לא הייתה מחזירה את הסיבוב.
    const onFocus = () => {
        if (!trigger.matches(':focus-visible')) return;
        focused = true;
        aimHome();
    };
    const onBlur = () => {
        focused = false;
        run();
    };
    const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType === 'touch' || e.button !== 0 || pointerId !== null) return;
        pointerId = e.pointerId;
        startX = lastX = e.clientX;
        startY = lastY = e.clientY;
        dragged = false;
        // לכידה: הגרירה ממשיכה גם כשהסמן יוצא מעט מהכפתור; pointerleave מגיע אחרי השחרור.
        trigger.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return;
        if (!dragged && Math.hypot(e.clientX - startX, e.clientY - startY) < DRAG_THRESHOLD_PX) return;
        dragged = true;
        aim = null;
        stop();
        earth.rotation.y += (e.clientX - lastX) * DRAG_SPEED;
        earth.rotation.x = Math.max(-POLE_CLAMP, Math.min(POLE_CLAMP, earth.rotation.x + (e.clientY - lastY) * DRAG_SPEED));
        lastX = e.clientX;
        lastY = e.clientY;
        render();
    };
    const endPointer = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return;
        pointerId = null;
        if (trigger.hasPointerCapture(e.pointerId)) trigger.releasePointerCapture(e.pointerId);
        // הקליק נשלח מיד אחרי pointerup באותה משימה; אחריו הדגל כבר לא רלוונטי.
        if (dragged) window.setTimeout(() => (dragged = false));
        run();
    };
    trigger.addEventListener('pointerenter', onPointerEnter);
    trigger.addEventListener('pointerleave', onPointerLeave);
    trigger.addEventListener('focus', onFocus);
    trigger.addEventListener('blur', onBlur);
    trigger.addEventListener('pointerdown', onPointerDown);
    trigger.addEventListener('pointermove', onPointerMove);
    trigger.addEventListener('pointerup', endPointer);
    trigger.addEventListener('pointercancel', endPointer);

    core.sizeFromContainer();
    const resizeObserver = new ResizeObserver(() => {
        core.sizeFromContainer();
        render();
    });
    resizeObserver.observe(container);
    // סרגל סגור או מוסתר: אין ציור.
    const visibility = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) run();
        else stop();
    });
    visibility.observe(container);
    core.loadDayTexture(() => {
        scene.visible = true;
        render();
    });
    run();

    return {
        setHome(point, snap = false) {
            homeRot = aimRotation(toLocal(point));
            if (snap) {
                aim = null;
                earth.rotation.set(homeRot.x, homeRot.y, 0);
                render();
                run();
            } else if (held() && pointerId === null) aimHome();
        },
        snapshot() {
            if (!scene.visible || core.isDisposed()) return null;
            // בלי preserveDrawingBuffer המאגר תקף רק באותה משימה שבה צויר.
            render();
            return canvas.toDataURL();
        },
        takeDrag() {
            const d = dragged;
            dragged = false;
            return d;
        },
        destroy() {
            stop();
            trigger.removeEventListener('pointerenter', onPointerEnter);
            trigger.removeEventListener('pointerleave', onPointerLeave);
            trigger.removeEventListener('focus', onFocus);
            trigger.removeEventListener('blur', onBlur);
            trigger.removeEventListener('pointerdown', onPointerDown);
            trigger.removeEventListener('pointermove', onPointerMove);
            trigger.removeEventListener('pointerup', endPointer);
            trigger.removeEventListener('pointercancel', endPointer);
            resizeObserver.disconnect();
            visibility.disconnect();
            core.dispose();
        },
    };
}
