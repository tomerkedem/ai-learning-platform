// components/language/interactiveEarth.ts
//
// כדור הארץ הגדול בחלון בחירת השפה. הועתק מ-BookForge (src/scripts/interactive-earth-3d.ts):
// אותן הגדרות סצנה, סיבוב סרק איטי (0.06 rad/s) וגרירה בעכבר/מגע. הוסרו מיקוד לקואורדינטות,
// הקרנת נקודות וכלי אבחון, כי הבורר אינו מצמיד שפות למקומות.
// תנועה מופחתת: אין סיבוב סרק; הכדור מצויר פעם אחת ומתעדכן רק בגרירה.

import { createEarthScene } from './earthRenderingCore';

const POLE_CLAMP = Math.PI / 2 - 0.05;
const IDLE_SPEED = 0.06;

export function createInteractiveEarth(container: HTMLElement, reducedMotion: boolean): () => void {
    const core = createEarthScene(container, { oceanLift: 0.3 });
    const { scene, camera, renderer, canvas, earth } = core;
    scene.visible = false; // כמו ב-BookForge: מוסתר עד שהמרקם (או היעדרו) הוכרע
    canvas.style.touchAction = 'none';

    let rafId: number | null = null;
    let lastTime = 0;
    let dragging = false;
    let pointerId: number | null = null;
    let lastX = 0;
    let lastY = 0;

    const render = () => renderer.render(scene, camera);
    const tick = (time: number) => {
        rafId = null;
        const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0;
        lastTime = time;
        if (!dragging) earth.rotation.y += IDLE_SPEED * dt;
        render();
        rafId = requestAnimationFrame(tick);
    };

    const onPointerDown = (e: PointerEvent) => {
        if (pointerId !== null) return;
        dragging = true;
        pointerId = e.pointerId;
        lastX = e.clientX;
        lastY = e.clientY;
        canvas.setPointerCapture(e.pointerId);
        e.preventDefault();
    };
    const onPointerMove = (e: PointerEvent) => {
        if (!dragging || e.pointerId !== pointerId) return;
        earth.rotation.y += (e.clientX - lastX) * 0.005;
        earth.rotation.x = Math.max(-POLE_CLAMP, Math.min(POLE_CLAMP, earth.rotation.x + (e.clientY - lastY) * 0.005));
        lastX = e.clientX;
        lastY = e.clientY;
        if (reducedMotion) render();
    };
    const endPointer = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return;
        dragging = false;
        pointerId = null;
        if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', endPointer);
    canvas.addEventListener('pointercancel', endPointer);

    core.sizeFromContainer();
    const resizeObserver = new ResizeObserver(() => {
        core.sizeFromContainer();
        render();
    });
    resizeObserver.observe(container);

    core.loadDayTexture(() => {
        if (core.isDisposed()) return;
        scene.visible = true;
        render();
        if (!reducedMotion) rafId = requestAnimationFrame(tick);
    });

    return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', endPointer);
        canvas.removeEventListener('pointercancel', endPointer);
        resizeObserver.disconnect();
        core.dispose();
    };
}
