// Public introduction preview strings: the hero, the opening chat example and the read-aloud
// labels. This is all introduction text that ships in the public client bundle; the rest
// (introduction.ts) is loaded only on the server for a signed-in, confirmed learner.

export const introPreview = {
    hero: {
        badge: 'El laboratorio transparente · Behind the Scenes',
        titleLead: '¿Qué ocurre en realidad entre el mensaje que envías',
        titleAccent: 'y la respuesta que recibes?',
        intro: 'Una mirada a lo que ocurre en el momento en que envías un mensaje a un chat.',
    },

    chat: {
        promptRole: 'Tu solicitud',
        prompt: 'Voy a tener amigos a cenar. ¿Qué podría preparar?',
        inputPlaceholder: 'Escribe un mensaje...',
        answerRole: 'La respuesta',
        answer: 'Podrías hacer pasta con una ensalada sencilla. Si me dices qué les gusta, puedo sugerirte un menú más concreto.',
        outsideLine: 'Desde fuera parece que son dos pasos: escribiste una solicitud y recibiste una respuesta.',
        curiosityLine: 'Pero la verdadera pregunta es qué ocurrió en el medio.',
    },

    readAloud: {
        dock: 'Escucha guiada',
        play: 'Leer en voz alta',
        pause: 'Pausar',
        resume: 'Reanudar',
        stop: 'Detener',
        prev: 'Segmento anterior',
        next: 'Segmento siguiente',
        voice: 'Voz',
        browserDefault: 'Voz predeterminada del navegador',
        settings: 'Opciones de lectura',
        sections: 'Secciones',
        nowReading: 'Leyendo ahora',
        unsupported: 'La lectura en voz alta no está disponible en este navegador.',
        scope: 'Alcance',
        scopeShort: 'Breve',
        scopeRegular: 'Normal',
        scopeFull: 'Completo',
        speed: 'Velocidad',
    },
};
