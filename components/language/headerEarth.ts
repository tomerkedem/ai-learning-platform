// components/language/headerEarth.ts
//
// כדור הארץ המוקטן בכפתור בורר השפה. הועתק מ-BookForge (src/scripts/header-earth-3d.ts)
// עם אותן הגדרות מיניאטורה (מצלמה קרובה, שפת אטמוספרה חזקה, low-power), בהירות מוגברת
// כדי שים ויבשה ייראו בגודל הכפתור. הוסר parallax.
//
// הכדור פונה לנקודה הראשית של השפה הפעילה (setHome). בעכבר/עט אפשר לגרור אותו מעל הכפתור;
// ביציאה מהכפתור הוא חוזר בהדרגה לשפה. מגע לא גורר (הקשה פותחת, גלילה נשמרת).
// גרירה לא פותחת את החלון (takeDrag). לולאת ציור פועלת רק בזמן החזרה.
// תנועה מופחתת: אין חזרה מונפשת; הכדור קופץ אל היעד.

import { aimRotation, createEarthScene, toLocal, wrapAngle, type LatLon } from './earthRenderingCore';

const DRAG_SPEED = 0.025; // רדיאנים לפיקסל: כדור של 40px
const DRAG_THRESHOLD_PX = 4;
const RETURN_SPEED = 6;
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

export function createHeaderEarth(container: HTMLElement, trigger: HTMLElement, home: LatLon, reducedMotion: boolean): HeaderEarth {
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

    const render = () => {
        if (!core.isDisposed()) renderer.render(scene, camera);
    };
    const stopReturn = () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
    };
    const tick = (time: number) => {
        rafId = null;
        const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0;
        lastTime = time;
        const k = 1 - Math.exp(-dt * RETURN_SPEED);
        const dy = wrapAngle(homeRot.y - earth.rotation.y);
        const dx = homeRot.x - earth.rotation.x;
        earth.rotation.y += dy * k;
        earth.rotation.x += dx * k;
        render();
        if (Math.abs(dx) + Math.abs(dy) > 0.002) rafId = requestAnimationFrame(tick);
    };
    const goHome = () => {
        if (reducedMotion) {
            earth.rotation.set(homeRot.x, homeRot.y, 0);
            render();
        } else if (rafId === null) {
            lastTime = 0;
            rafId = requestAnimationFrame(tick);
        }
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
        stopReturn();
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
    };
    const onPointerLeave = () => {
        if (pointerId === null) goHome();
    };
    trigger.addEventListener('pointerdown', onPointerDown);
    trigger.addEventListener('pointermove', onPointerMove);
    trigger.addEventListener('pointerup', endPointer);
    trigger.addEventListener('pointercancel', endPointer);
    trigger.addEventListener('pointerleave', onPointerLeave);

    core.sizeFromContainer();
    const resizeObserver = new ResizeObserver(() => {
        core.sizeFromContainer();
        render();
    });
    resizeObserver.observe(container);
    core.loadDayTexture(() => {
        scene.visible = true;
        render();
    });

    return {
        setHome(point, snap = false) {
            homeRot = aimRotation(toLocal(point));
            if (snap) {
                stopReturn();
                earth.rotation.set(homeRot.x, homeRot.y, 0);
                render();
            } else if (pointerId === null) goHome();
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
            stopReturn();
            trigger.removeEventListener('pointerdown', onPointerDown);
            trigger.removeEventListener('pointermove', onPointerMove);
            trigger.removeEventListener('pointerup', endPointer);
            trigger.removeEventListener('pointercancel', endPointer);
            trigger.removeEventListener('pointerleave', onPointerLeave);
            resizeObserver.disconnect();
            core.dispose();
        },
    };
}
