// i18n/locales/es/behind-ai/guardrailsQuiz.ts
//
// Texto de pantalla en espanol (es, LTR) del cuestionario del capitulo 18 ("Guardrails:
// riesgo, permisos, aprobacion y parada"). El hebreo es la fuente de verdad.
//
// Es solo texto de pantalla. El mecanismo compartido (correctAnswer, difficulty, concept,
// onComplete, getReviewLinks, nextHref) vive en el quizData.ts compartido. La pagina del
// capitulo fusiona este texto sobre el esqueleto de preguntas por id (byId), asi que el
// orden de las opciones debe mantenerse identico entre idiomas.
//
// Es una primera traduccion para revisar por un hablante nativo mas adelante.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { GuardrailsQuizId, GuardrailsQuizText } from '../../he/behind-ai/guardrailsQuiz';

export const guardrailsQuiz = {
    title: 'Cuestionario de comprension: riesgo, permisos, aprobacion y parada',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en este capitulo',
    startLabel: 'Comenzar el cuestionario',
    submitLabel: 'Finalizar el cuestionario',
    completedTitle: 'Cuestionario completado',

    byId: {
        1: {
            question: 'El agente tiene acceso para enviar un mensaje al cliente y sabe redactarlo. Que significa eso sobre el permiso para enviar?',
            options: [
                'Si es capaz de enviar, significa que tiene permiso para enviar',
                'La capacidad de enviar no es permiso para enviar. Enviar es una accion que puede requerir aprobacion',
                'Si tiene una herramienta, no hace falta ninguna comprobacion adicional',
                'El permiso se decide solo por lo rapida que sea la accion',
            ],
            explanation:
                'La capacidad no es permiso. Aunque el agente sea tecnicamente capaz de ejecutar una accion, la pregunta es si tiene permiso para hacerlo ahora. Una accion externa como enviar a un cliente puede requerir aprobacion, sin importar la capacidad.',
        },
        2: {
            question: 'El mismo agente puede ejecutar tres acciones: comprobar un estado de seguimiento, preparar un borrador de mensaje, y enviarlo. Que es cierto sobre el nivel de riesgo?',
            options: [
                'Las tres acciones conllevan exactamente el mismo riesgo',
                'Leer un estado es de riesgo bajo, redactar un borrador es medio, y enviar es alto. El riesgo decide lo que esta permitido',
                'Enviar es la accion mas segura porque completa la tarea',
                'Un borrador es mas arriesgado que enviar porque se guarda',
            ],
            explanation:
                'No toda accion es igual. Leer informacion no cambia nada, asi que es de riesgo bajo. Redactar un borrador se acerca al cliente pero todavia no sale. Enviar es una accion externa y por eso es de riesgo alto. El nivel de riesgo es lo que decide lo que se puede hacer.',
        },
        3: {
            question: 'El usuario pidio "Comprueba el paquete y actualiza al cliente", pero no hay numero de seguimiento. Que es lo mejor que puede hacer el agente?',
            options: [
                'Adivinar un numero de seguimiento plausible para empezar',
                'Detenerse y pedir el numero de seguimiento antes de actuar',
                'Enviar al cliente un mensaje generico sin comprobar nada',
                'Marcar el paquete como entregado para cerrar la tarea',
            ],
            explanation:
                'Cuando falta informacion critica, una accion segura se detiene y pregunta en lugar de adivinar. Sin un numero de seguimiento no se puede comprobar un estado real, asi que el paso profesional es pedir lo que falta. Una conjetura construye todo lo que sigue sobre una base inestable.',
        },
        4: {
            question: 'El agente preparo un excelente borrador de mensaje para el cliente. Por que es correcto detenerse para aprobacion antes de enviar?',
            options: [
                'Porque el borrador seguramente esta mal',
                'Porque enviar a un cliente es una accion externa y sensible, y una accion asi pasa por una puerta de aprobacion',
                'Porque el agente no tiene capacidad real de enviar',
                'Porque al agente no se le permite redactar texto en absoluto',
            ],
            explanation:
                'Preparar un borrador es una cosa, enviarlo a un cliente real es otra. Una accion externa y sensible pasa por una puerta de aprobacion, para que una persona apruebe antes de que salga. Detenerse para aprobacion es el paso responsable, no una falta de capacidad.',
        },
        5: {
            question: 'Se le pide al agente que marque el paquete como entregado, pero la fuente muestra que todavia esta retrasado. Que es lo correcto?',
            options: [
                'Marcarlo como entregado, porque el usuario lo pidio',
                'Negarse a marcarlo. Cambiar un estado oficial sin fundamento en la fuente es una accion bloqueada',
                'Marcarlo como entregado y anadir una nota de que podria ser un error',
                'Inventar una prueba de entrega para que la accion quede completa',
            ],
            explanation:
                'Algunas acciones permanecen bloqueadas aunque el agente sepa describirlas. Marcar un paquete como entregado sin fundamento en la fuente cambia un registro oficial y perjudica la fiabilidad. El paso correcto es detenerse, negarse a la accion, y explicar por que. No todo lo que se puede pedir se puede ejecutar.',
        },
    } satisfies Record<GuardrailsQuizId, GuardrailsQuizText>,
};
