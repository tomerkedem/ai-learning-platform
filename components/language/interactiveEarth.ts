// components/language/interactiveEarth.ts
//
// כדור הארץ הגדול בחלון בחירת השפה. הועתק מ-BookForge (src/scripts/interactive-earth-3d.ts):
// אותן הגדרות סצנה, סיבוב סרק איטי (0.06 rad/s) וגרירה בעכבר/מגע.
// קרני אור: showBeams מסובב את הכדור אל מרכז נקודות לדוגמה ומצייר קרניים מהשפה אליהן
// (ב-SVG שמעל הכדור). הנקודות הן דוגמה חזותית בלבד, לא דירוג ולא שיוך של שפה למדינה.
// תנועה מופחתת: אין סיבוב סרק ואין סיבוב מונפש; הכדור קופץ אל היעד ומצויר לפי דרישה.

import * as THREE from 'three';
import { aimRotation, createEarthScene, toLocal, wrapAngle, type LatLon } from './earthRenderingCore';

const POLE_CLAMP = Math.PI / 2 - 0.05;
const IDLE_SPEED = 0.06;
const AIM_SPEED = 4;

export interface InteractiveEarth {
    showBeams(anchor: HTMLElement | null, points: readonly LatLon[]): void;
    flash(): void;
    destroy(): void;
}

export function createInteractiveEarth(
    container: HTMLElement,
    beams: SVGSVGElement,
    reducedMotion: boolean,
    /** הכיוון ההתחלתי: כמו הכדור המוקטן, כך שהמעבר מהכפתור רציף. */
    initial: LatLon,
    onReady: () => void,
): InteractiveEarth {
    const core = createEarthScene(container, { oceanLift: 0.3 });
    const { scene, camera, renderer, canvas, earth } = core;
    const start = aimRotation(toLocal(initial));
    earth.rotation.set(start.x, start.y, 0);
    scene.visible = false; // כמו ב-BookForge: מוסתר עד שהמרקם (או היעדרו) הוכרע
    canvas.style.touchAction = 'none';

    let rafId: number | null = null;
    let lastTime = 0;
    let dragging = false;
    let pointerId: number | null = null;
    let lastX = 0;
    let lastY = 0;
    let anchor: HTMLElement | null = null;
    let targets: THREE.Vector3[] = [];
    let aimY = 0;
    let aimX = 0;
    let flashTimer: number | undefined;

    const drawBeams = () => {
        if (!anchor || !targets.length || !scene.visible) {
            if (beams.firstChild) beams.replaceChildren();
            return;
        }
        const box = beams.getBoundingClientRect();
        const c = canvas.getBoundingClientRect();
        const a = anchor.getBoundingClientRect();
        const sx = a.left + a.width / 2 - box.left;
        const sy = a.bottom - box.top;
        earth.updateMatrixWorld();
        let markup = '';
        for (const t of targets) {
            const w = t.clone().applyMatrix4(earth.matrixWorld);
            if (w.dot(camera.position) < 1.15) continue; // בצד הרחוק או על קו האופק
            const p = w.project(camera);
            const x = c.left + ((p.x + 1) / 2) * c.width - box.left;
            const y = c.top + ((1 - p.y) / 2) * c.height - box.top;
            const cy = sy + (y - sy) * 0.6;
            markup += `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q${sx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>`;
        }
        beams.innerHTML = markup;
    };

    const render = () => {
        renderer.render(scene, camera);
        drawBeams();
    };
    const tick = (time: number) => {
        rafId = null;
        const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0;
        lastTime = time;
        if (!dragging && targets.length) {
            const k = 1 - Math.exp(-dt * AIM_SPEED);
            earth.rotation.y += wrapAngle(aimY - earth.rotation.y) * k;
            earth.rotation.x += (aimX - earth.rotation.x) * k;
        } else if (!dragging) {
            earth.rotation.y += IDLE_SPEED * dt;
        }
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
        onReady();
        if (!reducedMotion) rafId = requestAnimationFrame(tick);
    });

    return {
        showBeams(el, points) {
            anchor = el;
            targets = el ? points.map(toLocal) : [];
            if (targets.length) {
                // מכוונים למרכז הנקודות, כך שכולן (או רובן) בצד הגלוי.
                const mid = targets.reduce((s, v) => s.add(v), new THREE.Vector3()).normalize();
                ({ x: aimX, y: aimY } = aimRotation(mid));
                if (reducedMotion) {
                    earth.rotation.set(aimX, aimY, 0);
                }
            }
            if (reducedMotion && !core.isDisposed()) render();
        },
        flash() {
            beams.classList.add('is-flash');
            window.clearTimeout(flashTimer);
            flashTimer = window.setTimeout(() => beams.classList.remove('is-flash'), 500);
        },
        destroy() {
            if (rafId !== null) cancelAnimationFrame(rafId);
            window.clearTimeout(flashTimer);
            canvas.removeEventListener('pointerdown', onPointerDown);
            canvas.removeEventListener('pointermove', onPointerMove);
            canvas.removeEventListener('pointerup', endPointer);
            canvas.removeEventListener('pointercancel', endPointer);
            resizeObserver.disconnect();
            beams.replaceChildren();
            beams.classList.remove('is-flash');
            core.dispose();
        },
    };
}
