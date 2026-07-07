// i18n/locales/es/behind-ai/fullTraceQuiz.ts
//
// Texto de interfaz en espanol (es, neutro internacional, LTR) del cuestionario del
// Capitulo 19 ("Full Trace: un prompt, todas las estaciones"). El hebreo es la fuente de
// verdad.
//
// Esto es solo texto de interfaz. El mecanismo compartido (correctAnswer, difficulty,
// concept, onComplete, getReviewLinks, nextHref) vive en el quizData.ts compartido. La
// pagina del capitulo fusiona este texto sobre el esqueleto de preguntas por id (byId), asi
// que el orden de las opciones debe permanecer identico entre idiomas.
//
// Esta es una primera traduccion, pendiente de revision por hablante nativo.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { FullTraceQuizId, FullTraceQuizText } from '../../he/behind-ai/fullTraceQuiz';

export const fullTraceQuiz = {
    title: 'Comprobacion de comprension: un prompt, todas las estaciones',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capitulo',
    startLabel: 'Comenzar la comprobacion',
    submitLabel: 'Finalizar la comprobacion',
    completedTitle: 'Terminaste la comprobacion',

    byId: {
        1: {
            question: 'Que muestra Full Trace?',
            options: [
                'Una unica respuesta final, sin etapas intermedias',
                'Un recorrido visible de las etapas del sistema, desde la entrada hasta una salida controlada',
                'Una lista de cada respuesta que el modelo considero y descarto',
                'Solo las herramientas externas a las que el sistema esta conectado',
            ],
            explanation:
                'Full Trace conecta todas las estaciones del curso en un recorrido visible: entrada, significado, anclaje en una fuente, chequeos, una capa de control y una salida. No es solo la respuesta al final, sino todo el camino hacia ella.',
        },
        2: {
            question: 'Un amigo afirma: "Full Trace nos muestra los pensamientos privados del modelo." Es correcto?',
            options: [
                'Si, es una mirada directa a la cadena de pensamiento oculta del modelo',
                'No. Es un registro didactico de etapas visibles del sistema, no un pensamiento privado',
                'Si, el modelo se escribe un diario de pensamiento que nosotros leemos',
                'No, porque el modelo no tiene ningun proceso interno',
            ],
            explanation:
                'Full Trace no es una cadena de pensamiento oculta. Muestra etapas visibles del sistema: entrada, contexto, resultado de una herramienta, chequeos, estado de permiso y salida. El objetivo es ensenar el camino, no exponer el razonamiento privado.',
        },
        3: {
            question: 'El resultado de la herramienta dice: estado con retraso, fecha estimada de entrega no disponible. Por que es correcto que el sistema no invente una fecha de llegada?',
            options: [
                'Porque una fecha de llegada nunca le importa al cliente',
                'Porque una conclusion debe apoyarse en la fuente, y lo que falta en la fuente no se inventa',
                'Porque el modelo no es capaz de escribir fechas',
                'Porque inventar una fecha esta bien si suena razonable',
            ],
            explanation:
                'La fuente antes que la conclusion. La fuente confirmo que el paquete esta con retraso, pero no dio una fecha de llegada. Rellenar una fecha que no aparecio en la fuente es una conjetura presentada como hecho, y eso es justo lo que el anclaje busca evitar.',
        },
        4: {
            question: 'El prompt decia "no la envies sin mi aprobacion", y el sistema preparo un borrador excelente. Que es correcto sobre la accion final?',
            options: [
                'Enviar de inmediato, porque el borrador esta listo',
                'Preparar un borrador y detenerse para pedir aprobacion, porque un envio externo pasa por el limite de aprobacion',
                'Borrar el borrador para evitar todo riesgo',
                'Enviar y luego pedir aprobacion despues',
            ],
            explanation:
                'El limite de aprobacion del prompt cambia la accion final. Enviar a un cliente es una accion externa y sensible, asi que el sistema se detiene: el borrador esta listo, y el mensaje sale solo tras la aprobacion humana.',
        },
        5: {
            question: 'Quieres que un agente trabaje de una forma facil de seguir y de confiar. Que instruccion es la mejor?',
            options: [
                '"Encargate de esto."',
                '"Revisa el estado del paquete 123456789. Si no hay fecha de llegada en la fuente, no adivines. Redacta un mensaje breve para el cliente. No lo envies sin mi aprobacion. Al final, escribe que revisaste, que encontraste y que no hiciste."',
                '"Envia al cliente lo que te parezca mejor."',
                '"Sigue hasta terminar, sin preguntarme nada."',
            ],
            explanation:
                'Un prompt trazable define un objetivo, datos, una fuente, que no suponer, un limite de aprobacion y una salida con un informe de lo que se hizo y no se hizo. "Encargate de esto" es demasiado vago, "envia lo que te parezca" abre una accion sensible sin control, y "no preguntes nada" impide pedir informacion que falta. Una instruccion clara produce una salida controlada y facil de seguir.',
        },
    } satisfies Record<FullTraceQuizId, FullTraceQuizText>,
};
