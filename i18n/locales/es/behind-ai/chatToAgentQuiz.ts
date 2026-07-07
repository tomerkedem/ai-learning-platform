// i18n/locales/es/behind-ai/chatToAgentQuiz.ts
//
// Texto de visualizacion en espanol (es, LTR) del cuestionario del capitulo 17
// ("Chat to Agent: cuando una pregunta se convierte en tarea"). El hebreo es la fuente de
// verdad.
//
// Esto es solo texto de visualizacion. El mecanismo compartido (correctAnswer, difficulty,
// concept, onComplete, getReviewLinks, nextHref) vive en el quizData.ts compartido. La pagina
// del capitulo fusiona este texto sobre el esqueleto de preguntas por id (byId), asi que el
// orden de las opciones debe ser identico entre idiomas.
//
// Es una primera traduccion para revisar por un hablante nativo mas adelante.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { ChatToAgentQuizId, ChatToAgentQuizText } from '../../he/behind-ai/chatToAgentQuiz';

export const chatToAgentQuiz = {
    title: 'Comprobacion de comprension: cuando una pregunta se convierte en tarea',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en el capitulo',
    startLabel: 'Empezar la comprobacion',
    submitLabel: 'Terminar la comprobacion',
    completedTitle: 'Terminaste la comprobacion',

    byId: {
        1: {
            question: 'Cual es la diferencia esencial entre un chat y un agente?',
            options: [
                'Un agente es mas rapido, y un chat es mas lento',
                'Un chat recibe una entrada y devuelve una respuesta. Un agente recibe un objetivo y avanza hacia el por pasos: elige una herramienta, revisa un resultado y decide que sigue',
                'Un chat entiende espanol, y un agente solo entiende ingles',
                'Un agente no usa tokens, y un chat si',
            ],
            explanation:
                'La diferencia no es velocidad ni idioma. Un chat es un motor de respuesta, explica. Un agente es un motor de tarea: detecta un objetivo, puede elegir una herramienta, revisar un resultado y decidir el siguiente paso. Ambos pueden equivocarse.',
        },
        2: {
            question: 'Que aportan las herramientas a un agente?',
            options: [
                'Hacen que el modelo sea mas inteligente por naturaleza',
                'Amplian lo que el sistema puede hacer, pero solo cuando estan disponibles y permitidas',
                'Garantizan que la respuesta siempre sea correcta',
                'Eliminan la necesidad de informacion del usuario',
            ],
            explanation:
                'Una herramienta como una consulta de seguimiento o una busqueda en un documento amplia lo que el sistema puede hacer mas alla de redactar texto. Pero una herramienta funciona solo cuando esta disponible y permitida, y no hace al modelo mas inteligente ni garantiza que la respuesta sea correcta.',
        },
        3: {
            question: 'El agente no tiene el numero de seguimiento necesario para comprobar el paquete. Cual es el paso correcto?',
            options: [
                'Inventar un numero plausible para avanzar',
                'Pedir al usuario el numero de seguimiento antes de actuar',
                'Enviar al cliente un mensaje generico de todos modos',
                'Detener la tarea y no volver a ella',
            ],
            explanation:
                'Un buen agente no inventa informacion que falta ni usa una herramienta sin los datos necesarios. Cuando falta un numero de seguimiento, el paso profesional es pedirlo. Pedir informacion que falta no es un fallo, es la conducta correcta.',
        },
        4: {
            question: 'El agente tiene un borrador de mensaje listo y acceso para enviarlo. Por que sigue siendo correcto detenerse antes de enviar?',
            options: [
                'Porque en realidad no sabe enviar un mensaje',
                'Porque enviar un mensaje a un cliente es una accion real y sensible, y una accion asi requiere aprobacion',
                'Porque el borrador siempre esta equivocado',
                'Porque no tiene permiso para redactar texto',
            ],
            explanation:
                'Preparar un borrador es una cosa, enviarlo a un cliente real es otra. Una accion que cambia algo en el mundo o llega a un cliente es sensible, y la capacidad de hacerlo no es permiso para hacerlo. Detenerse para aprobacion es el paso responsable.',
        },
        5: {
            question: 'Que instruccion es la mas segura para dar a un agente que gestiona un paquete?',
            options: [
                '"Encargate de esto."',
                '"Comprueba el estado del paquete con este numero de seguimiento. Si falta informacion, preguntame. Si necesitas escribir al cliente, prepara solo un borrador y espera aprobacion."',
                '"Envia al cliente lo que te parezca mas correcto."',
                '"Sigue hasta terminar, sin preguntarme nada."',
            ],
            explanation:
                'Una instruccion segura define un objetivo, que hacer si falta informacion, y que requiere aprobacion. "Encargate de esto" es demasiado vaga, "envia lo que te parezca" abre una accion sensible sin control, y "no preguntes nada" bloquea pedir informacion que falta. Una buena instruccion da un objetivo y limites.',
        },
    } satisfies Record<ChatToAgentQuizId, ChatToAgentQuizText>,
};
