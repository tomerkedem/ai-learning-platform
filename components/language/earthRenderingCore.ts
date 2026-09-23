// components/language/earthRenderingCore.ts
//
// ליבת הרינדור של כדור הארץ בבורר השפה. הועתקה מ-BookForge
// (src/scripts/earth-rendering-core.ts) עם אותו חוזה חזותי: מצלמה, תאורה, חומר,
// שיידר האטמוספרה והגדרות הרנדרר. הוסרו ממנה עזרי קווי רוחב/אורך ומיקוד-מדינה:
// הכדור מייצג עולם רב-לשוני, לא מפה של שפות למדינות.
//
// החוזה החזותי (מ-BookForge):
//   מצלמה 35° FOV במרחק 3.85; שמש בעולם (-1.2, 1.3, 3.2); פלט sRGB, Linear tone-map,
//   חשיפה 1.12; MeshPhongMaterial (specular #1c2a3a, shininess 22); תאורה Ambient
//   #fff3dc 0.55, Directional לבן 1.55, Hemisphere 0x9ab8ff/0x7a5e3a 0.48; אטמוספרה
//   בכדור back-side ברדיוס 1.06 עם Fresnel ו-additive blending.
//
// מרקם פני השטח: earth-day-2k.webp, אותו קובץ כמו ב-BookForge (2048x1024 equirectangular).
// לפי בעל הפרויקט הורד מאתר NASA; הכתובת המדויקת אינה ידועה. פרטים: public/assets/globe/SOURCE.txt.

import * as THREE from 'three';

export const DAY_TEXTURE_URL = '/assets/globe/earth-day-2k.webp';

const SUN_WORLD_POSITION = new THREE.Vector3(-1.2, 1.3, 3.2);

const ATMOSPHERE_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormalView;
  varying vec3 vNormalWorld;
  void main() {
    vNormalView = normalize(normalMatrix * normal);
    vNormalWorld = normalize(normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uSunDir;
  uniform float uRimExponent;
  uniform float uMaxIntensityLit;
  varying vec3 vNormalView;
  varying vec3 vNormalWorld;
  void main() {
    float rim = 1.0 - dot(vNormalView, vec3(0.0, 0.0, 1.0));
    float rimI = pow(clamp(rim, 0.0, 1.0), uRimExponent);
    float sunFacing = dot(vNormalWorld, uSunDir);
    float sunSide = smoothstep(-0.2, 0.4, sunFacing);
    vec3 dayInner = vec3(0.30, 0.62, 1.05);
    vec3 dayOuter = vec3(0.72, 0.92, 1.10);
    vec3 dayCol = mix(dayInner, dayOuter, smoothstep(0.0, 1.0, rimI));
    vec3 nightTint = vec3(0.16, 0.24, 0.55);
    vec3 col = mix(nightTint, dayCol, sunSide);
    float maxIntensity = mix(0.18, uMaxIntensityLit, sunSide);
    float alpha = clamp(rimI * maxIntensity, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0) * alpha;
  }
`;

export interface EarthSceneOptions {
    pixelRatioCap?: number;
    cameraDistance?: number;
    atmosphereRimExponent?: number;
    atmosphereMaxIntensityLit?: number;
    toneMappingExposure?: number;
    ambientIntensity?: number;
    powerPreference?: WebGLPowerPreference;
    /** הבהרת אוקיינוסים סלקטיבית מ-BookForge (0 = כבוי). האוקיינוסים ב-Blue Marble כהים מאוד. */
    oceanLift?: number;
}

export interface EarthScene {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    canvas: HTMLCanvasElement;
    earth: THREE.Mesh;
    /** טוען את מרקם היום; תמיד קורא ל-onReady (גם בכשל טעינה: כדור כהה ניטרלי). */
    loadDayTexture(onReady: () => void): void;
    sizeFromContainer(): void;
    isDisposed(): boolean;
    dispose(): void;
}

export function createEarthScene(container: HTMLElement, options: EarthSceneOptions = {}): EarthScene {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, options.cameraDistance ?? 3.85);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: options.powerPreference ?? 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.pixelRatioCap ?? 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = options.toneMappingExposure ?? 1.12;

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    // צבע הבסיס הניטרלי ש-BookForge מציג לפני/בלי מרקם (0x1a2540 בשני העוטפים).
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: null,
        color: new THREE.Color(0x1a2540),
        specular: new THREE.Color(0x1c2a3a),
        shininess: 22,
    });
    // BookForge: מבהיר רק פיקסלים שבהם הכחול גובר על האדום והירוק (ים), לא יבשה.
    const oceanLift = options.oceanLift ?? 0;
    if (oceanLift > 0) {
        earthMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.uOceanLift = { value: oceanLift };
            shader.fragmentShader = `uniform float uOceanLift;
${shader.fragmentShader}`.replace(
                '#include <map_fragment>',
                `#include <map_fragment>
      vec3 lgsOceanSrc = diffuseColor.rgb;
      float lgsSeaMask = smoothstep(0.0, 0.012, lgsOceanSrc.b - max(lgsOceanSrc.r, lgsOceanSrc.g));
      vec3 lgsOceanLifted = lgsOceanSrc * (1.0 + uOceanLift * 0.85) + vec3(0.0, 0.015, 0.03) * uOceanLift;
      diffuseColor.rgb = clamp(mix(lgsOceanSrc, lgsOceanLifted, lgsSeaMask), 0.0, 1.0);`,
            );
        };
    }
    const earthGeometry = new THREE.SphereGeometry(1, 96, 96);
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    const atmosphereGeometry = new THREE.SphereGeometry(1.06, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uSunDir: { value: SUN_WORLD_POSITION.clone().normalize() },
            uRimExponent: { value: options.atmosphereRimExponent ?? 5.0 },
            uMaxIntensityLit: { value: options.atmosphereMaxIntensityLit ?? 0.78 },
        },
        vertexShader: ATMOSPHERE_VERTEX_SHADER,
        fragmentShader: ATMOSPHERE_FRAGMENT_SHADER,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    scene.add(new THREE.AmbientLight(0xfff3dc, options.ambientIntensity ?? 0.55));
    const sun = new THREE.DirectionalLight(0xffffff, 1.55);
    sun.position.copy(SUN_WORLD_POSITION);
    scene.add(sun);
    scene.add(new THREE.HemisphereLight(0x9ab8ff, 0x7a5e3a, 0.48));

    let disposed = false;
    let dayTexture: THREE.Texture | null = null;

    return {
        scene,
        camera,
        renderer,
        canvas,
        earth,
        loadDayTexture(onReady) {
            new THREE.TextureLoader().load(
                DAY_TEXTURE_URL,
                (tex) => {
                    if (disposed) {
                        tex.dispose();
                        return;
                    }
                    tex.colorSpace = THREE.SRGBColorSpace;
                    tex.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
                    dayTexture = tex;
                    earthMaterial.map = tex;
                    earthMaterial.color.setHex(0xffffff);
                    earthMaterial.needsUpdate = true;
                    onReady();
                },
                undefined,
                () => onReady(),
            );
        },
        sizeFromContainer() {
            const rect = container.getBoundingClientRect();
            const w = Math.max(1, Math.round(rect.width));
            const h = Math.max(1, Math.round(rect.height));
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        },
        isDisposed: () => disposed,
        dispose() {
            disposed = true;
            earthGeometry.dispose();
            earthMaterial.dispose();
            dayTexture?.dispose();
            atmosphereGeometry.dispose();
            atmosphereMaterial.dispose();
            renderer.dispose();
            canvas.remove();
        },
    };
}
