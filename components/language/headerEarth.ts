// components/language/headerEarth.ts
//
// כדור הארץ המוקטן בכפתור בורר השפה. הועתק מ-BookForge (src/scripts/header-earth-3d.ts)
// עם אותן הגדרות מיניאטורה (מצלמה קרובה, שפת אטמוספרה חזקה, חשיפה מעט גבוהה, low-power).
// מצויר לפי דרישה בלבד (אין לולאת אנימציה), ולכן אין לו תנועה. הוסרו מיקוד-מדינה ו-parallax.

import { createEarthScene } from './earthRenderingCore';

export function createHeaderEarth(container: HTMLElement): () => void {
    const core = createEarthScene(container, {
        pixelRatioCap: 3,
        cameraDistance: 3.55,
        atmosphereRimExponent: 4.0,
        atmosphereMaxIntensityLit: 0.88,
        toneMappingExposure: 1.17,
        ambientIntensity: 0.65,
        powerPreference: 'low-power',
        oceanLift: 0.55,
    });
    const { scene, camera, renderer, canvas } = core;
    scene.visible = false;
    canvas.style.borderRadius = '50%';
    canvas.style.pointerEvents = 'none';

    const render = () => {
        if (!core.isDisposed()) renderer.render(scene, camera);
    };
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

    return () => {
        resizeObserver.disconnect();
        core.dispose();
    };
}
