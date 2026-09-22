// i18n/locales/es/behind-ai/decodingLab.ts
//
// Datos en espanol (es, LTR) del "Decoding Lab" del Capitulo 9 (Decoding: elegir el
// siguiente token). El hebreo es la fuente de verdad y define el tipo (DecodingLabContent).
//
// Idea central: las probabilidades ya existen (eso fue el Capitulo 8) y aqui son fijas. El
// aprendiz cambia solo el estilo de decodificacion (conservador, equilibrado, abierto) y
// pulsa "Prueba otra eleccion", y ve como la misma distribucion puede llevar a tokens
// distintos. Un estilo conservador se queda en la opcion mas probable, un estilo abierto
// da una oportunidad tambien a las opciones mas bajas.
//
// Las elecciones no son aleatorias: cada estilo lleva una secuencia fija de elecciones, de
// modo que el aprendiz ve variedad mientras las pruebas se mantienen estables. Las
// probabilidades y las elecciones son una ilustracion didactica, no una salida real del
// modelo, y ningun estilo comprueba si una continuacion es verdadera en el mundo.
//
// Esta es una primera traduccion, pendiente de revision por un hablante nativo.
//
// Sin raya (U+2014) ni semirraya (U+2013).

import type { DecodingLabContent } from '../../he/behind-ai/decodingLab';

export const decodingLab: DecodingLabContent = {
    sectionEyebrow: 'Decoding Lab',
    sectionTitle: 'La misma distribucion, otro estilo de decodificacion: quien es elegido?',
    sectionIntro:
        'Las probabilidades aqui son fijas y no cambian. Cambia solo el estilo de decodificacion, y pulsa "Prueba otra eleccion". La idea central: la misma distribucion, otro estilo de eleccion, y por eso puede elegirse otro token. Un estilo conservador se queda en la opcion mas probable, un estilo abierto da una oportunidad tambien a las opciones mas bajas.',
    heading: 'Elegir el siguiente token',
    kicker: 'Decoding Lab',
    promptBase: 'La puerta vieja...',
    promptLabel: 'La frase que se continua',
    distributionLabel: 'La distribucion fija',
    probabilityLabel: 'Probabilidad',
    styleLabel: 'Elige un estilo de decodificacion',
    stabilityLabel: 'Estabilidad',
    varietyLabel: 'Variedad',
    selectedLabel: 'El token elegido',
    whyLabel: 'Por que fue elegido',
    replayButton: 'Prueba otra eleccion',
    continuationNote:
        'Las continuaciones se muestran aqui como frases completas para que sean faciles de leer. En la practica el modelo elige el siguiente token paso a paso. Esto es una ilustracion de la eleccion, no un rastro interno exacto del modelo.',
    disclaimer:
        'Las probabilidades y las elecciones aqui son una ilustracion didactica, no una salida real del modelo. Sirven para mostrar como el estilo de decodificacion decide quien es elegido de la misma distribucion. Ningun estilo comprueba si la continuacion es verdadera en el mundo.',
    sr: {
        styleGroup: 'Eleccion del estilo de decodificacion',
        replay: 'Mostrar otra eleccion en el mismo estilo',
        distribution: 'La distribucion de probabilidad de las continuaciones',
    },
    continuations: [
        { id: 'creak', label: 'se abrio con un crujido', prob: 52 },
        { id: 'locked', label: 'siguio cerrada con llave', prob: 24 },
        { id: 'fell', label: 'se cayo de los goznes', prob: 16 },
        { id: 'secretRoom', label: 'llevaba a un cuarto secreto', prob: 8 },
    ],
    styles: [
        {
            id: 'conservative',
            control: 'Conservador',
            summary: 'Se queda en la opcion mas probable. Salida previsible y estable.',
            stability: 3,
            variety: 1,
            picks: ['creak', 'creak', 'creak', 'creak'],
            whenTop: 'El estilo conservador casi siempre se queda en la opcion con la probabilidad mas alta, por eso la salida es previsible y estable.',
            whenLower: 'Aunque haya espacio para otra opcion, el estilo conservador tiende a volver a la opcion lider.',
        },
        {
            id: 'balanced',
            control: 'Equilibrado',
            summary: 'Suele elegir entre las opciones probables, con algo de variedad.',
            stability: 2,
            variety: 2,
            picks: ['creak', 'locked', 'creak', 'fell'],
            whenTop: 'El estilo equilibrado suele elegir entre las opciones probables, y aqui salio la lider.',
            whenLower: 'El estilo equilibrado dio una oportunidad a otra opcion probable, no la mas alta pero aun cercana.',
        },
        {
            id: 'creative',
            control: 'Abierto',
            summary: 'Da una oportunidad tambien a opciones mas bajas. Mas variedad, menos estabilidad.',
            stability: 1,
            variety: 3,
            picks: ['locked', 'creak', 'fell', 'secretRoom', 'creak'],
            whenTop: 'Incluso en un estilo abierto la opcion lider sigue siendo la mas probable, por eso se elige parte del tiempo.',
            whenLower: 'El estilo abierto dio una oportunidad a una opcion menos probable. Eso anade variedad, pero no la hace correcta.',
        },
    ],
};
