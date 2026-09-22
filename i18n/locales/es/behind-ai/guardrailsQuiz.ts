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
            question: 'El agente tiene acceso para enviar una invitacion a los participantes y sabe redactarla. Que significa eso sobre el permiso para enviar?',
            options: [
                'Si es capaz de enviar, significa que tiene permiso para enviar',
                'La capacidad de enviar no es permiso para enviar. Enviar es una accion que puede requerir aprobacion',
                'Si tiene una herramienta, no hace falta ninguna comprobacion adicional',
                'El permiso se decide solo por lo rapida que sea la accion',
            ],
            explanation:
                'La capacidad no es permiso, y la autorizacion del sistema no es la aprobacion humana. Aunque la identidad este autorizada a usar la herramienta de envio, una accion externa como enviar una invitacion puede esperar la aprobacion humana antes de ejecutarse.',
        },
        2: {
            question: 'El mismo agente puede ejecutar tres acciones: comprobar la disponibilidad del calendario, preparar un borrador de invitacion, y enviarlo. Que es cierto sobre el nivel de riesgo?',
            options: [
                'Las tres acciones conllevan exactamente el mismo riesgo',
                'Comprobar disponibilidad es de riesgo bajo, redactar un borrador es medio, y enviar es alto. El riesgo decide lo que esta permitido',
                'Enviar es la accion mas segura porque completa la tarea',
                'Un borrador es mas arriesgado que enviar porque se guarda',
            ],
            explanation:
                'No toda accion es igual. Comprobar disponibilidad no cambia nada, asi que es de riesgo bajo. Redactar un borrador se acerca a los participantes pero todavia no sale. Enviar es una accion externa y por eso es de riesgo alto. El nivel de riesgo es lo que decide lo que se puede hacer.',
        },
        3: {
            question: 'El usuario pidio "Organiza la reunion y envia la invitacion", pero no hay un horario aceptable. Que es lo mejor que puede hacer el agente?',
            options: [
                'Adivinar un horario plausible para empezar',
                'Detenerse y pedir el horario aceptable antes de actuar',
                'Enviar a los participantes una invitacion generica sin comprobar nada',
                'Marcar la reunion como confirmada para cerrar la tarea',
            ],
            explanation:
                'Cuando falta informacion critica, una accion segura se detiene y pregunta en lugar de adivinar. Sin un horario aceptable no se puede comprobar la disponibilidad real, asi que el paso profesional es pedir lo que falta. Una conjetura construye todo lo que sigue sobre una base inestable.',
        },
        4: {
            question: 'El agente preparo un excelente borrador de invitacion para los participantes. Por que es correcto detenerse para aprobacion antes de enviar?',
            options: [
                'Porque el borrador seguramente esta mal',
                'Porque enviar una invitacion a los participantes es una accion externa y sensible, y una accion asi pasa por una puerta de aprobacion',
                'Porque el agente no tiene capacidad real de enviar',
                'Porque al agente no se le permite redactar texto en absoluto',
            ],
            explanation:
                'Preparar un borrador es una cosa, enviar una invitacion real es otra. Una accion externa y sensible pasa por una puerta de aprobacion, para que una persona apruebe antes de que salga. Detenerse para aprobacion es el paso responsable, no una falta de capacidad.',
        },
        5: {
            question: 'Se le pide al agente que marque la reunion como confirmada y reservada, pero la herramienta de calendario no confirmo disponibilidad. Que es lo correcto?',
            options: [
                'Marcarla como confirmada, porque el usuario lo pidio',
                'Negarse a marcarla. Reservar una reunion sin disponibilidad confirmada por el calendario es una accion bloqueada',
                'Marcarla como confirmada y anadir una nota de que podria ser un error',
                'Inventar una disponibilidad confirmada para que la accion quede completa',
            ],
            explanation:
                'Algunas acciones permanecen bloqueadas aunque el agente sepa describirlas. Reservar una reunion sin disponibilidad confirmada cambia un registro oficial y perjudica la fiabilidad. La aprobacion humana no puede anular este bloqueo ni fabricar la evidencia que falta. El paso correcto es detenerse, negarse a la accion, y explicar por que.',
        },
    } satisfies Record<GuardrailsQuizId, GuardrailsQuizText>,
};
