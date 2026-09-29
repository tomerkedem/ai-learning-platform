// i18n/locales/es/behind-ai/chapterBridges.ts
//
// משפט הגשר שבסוף כל פרק מוגן (מבשר את נושא הפרק הבא). תוכן מוגן: נטען בשרת בלבד
// (i18n/chapterContent.server.ts) ומגיע לעמוד רק אחרי בדיקת הרשאה.
// No em dash (U+2014) and no en dash (U+2013).

export const chapterBridges: Record<number, string> = {
        2: 'Ya sabemos qué prepara el producto. ¿Cómo divide el modelo esa entrada en unidades que pueda procesar?', 3: 'Un Token ID identifica un token, pero el número no tiene significado. ¿Cómo se convierte en una representación útil?',
        6: 'Attention solo puede ponderar información disponible ahora. ¿Qué contiene realmente la ventana actual?', 7: 'El contexto está listo. ¿Cómo lo convierte el modelo en puntuaciones para los siguientes tokens?', 8: 'Softmax produce una distribución, pero todavía no una elección. ¿Cómo se selecciona el siguiente token?', 9: 'Se ha elegido un token. ¿Cómo se convierte esa elección en una respuesta completa?',
        10: 'Una respuesta puede ser fluida y aun así ser incorrecta. ¿Por qué ocurre?', 11: 'Si la fluidez no basta, ¿cómo conecta el sistema la respuesta con evidencia externa?', 12: 'Una fuente mejora el respaldo, pero el borrador aún puede usarla mal. ¿Cómo se comprueba contra la evidencia?', 13: 'Una revisión puede detectar un problema. ¿Qué ocurre cuando el fallo se repite y el sistema debe mejorar?',
        14: 'Un cambio puede mejorar ejemplos conocidos. ¿Cómo comprobamos que también funciona en casos nuevos?', 15: 'Ya sabemos cómo se evalúan las actualizaciones. Pero ¿una corrección en mi chat cambia el modelo?', 16: 'Hasta ahora, el sistema principalmente devolvía respuestas. ¿Qué cambia cuando persigue una meta mediante varios pasos y acciones?',
};
