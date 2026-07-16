// i18n/locales/es/behind-ai/semanticSpaceQuiz.ts
//
// Texto de la prueba de comprensión del capítulo 5 (Semantic Space) en español.
//
// Solo texto de pantalla. El mecanismo (correctAnswer, difficulty, concept, onComplete,
// getReviewLinks, nextHref) vive en quizData.ts y no se toca aquí. El orden de options
// debe coincidir exactamente con el esqueleto compartido, porque correctAnswer es un
// índice numérico. Las claves de concept son claves internas estables y siguen en hebreo;
// solo se traducen los valores de conceptLabels.
//
// Sin raya ni semirraya, según las reglas de texto del proyecto.

import type { semanticSpaceQuiz as HeQuiz } from '../../he/behind-ai/semanticSpaceQuiz';

export const semanticSpaceQuiz: typeof HeQuiz = {
    title: 'Prueba de comprensión: Semantic Space',
    subtitle: 'Cinco preguntas que afinan lo que aprendiste en el capítulo',
    startLabel: 'Comienza la prueba',
    submitLabel: 'Terminar la prueba',
    completedTitle: 'Terminaste la prueba',

    byId: {
        1: {
            question: 'Según el capítulo, ¿qué es un espacio semántico (Semantic Space)?',
            options: [
                'Una lista de sinónimos para cada frase',
                'Un espacio donde cada frase es un punto, y las frases cercanas en significado se ubican cerca una de otra',
                'Un diccionario que convierte cada palabra en un solo número',
                'Una tabla que cuenta cuántas veces apareció cada palabra',
            ],
            explanation:
                'En el espacio semántico cada frase se convierte en un punto, y su posición la define el significado. Las frases que el modelo considera relacionadas quedan cerca, y las que no lo están quedan lejos. No es una lista de sinónimos ni un diccionario de palabras sueltas.',
        },
        2: {
            question: 'El mapa del laboratorio mostró cada frase como un punto en dos dimensiones. ¿Qué es correcto concluir sobre el espacio del modelo?',
            options: [
                'El espacio real también está formado por dos dimensiones con un significado claro.',
                'Es una ilustración de un espacio de muchas dimensiones, y las distancias del dibujo no son una medición exacta.',
                'El modelo conserva solo dos dimensiones y descarta el resto de la representación.',
                'Cada dimensión del espacio tiene una propiedad que una persona puede leer y nombrar.',
            ],
            explanation:
                'El mapa muestra en dos dimensiones una idea que ocurre en un espacio con muchas más dimensiones. El modelo no reduce su representación a dos dimensiones, y una dimensión aislada normalmente no tiene un significado humano simple. La visualización ayuda a entender la idea de cercanía, pero las distancias dibujadas en ella no son una medición exacta ni absoluta del espacio real.',
        },
        3: {
            question: "'El paquete no llegó' y 'El envío viene con retraso' usan palabras distintas, pero se ubican cerca en el espacio. ¿Qué nos enseña esto?",
            options: [
                'Que el modelo cuenta letras compartidas',
                'Que el modelo reconoce un significado parecido aunque las palabras sean distintas',
                'Que las dos frases son exactamente la misma frase',
                'Que la cercanía depende solo de palabras idénticas',
            ],
            explanation:
                'Este es el corazón del capítulo. Casi no comparten palabras y aun así el significado es cercano: ambas hablan de un paquete que no llegó a tiempo. El modelo trabaja sobre el significado, no sobre una coincidencia exacta de palabras.',
        },
        4: {
            question: "'El paquete llegó' y 'El paquete no llegó' comparten casi las mismas palabras. ¿Por qué es peligroso concluir que dicen lo mismo?",
            options: [
                'Porque una de las frases es más larga',
                'Porque el modelo siempre ignora la negación',
                'Porque pertenecen a la misma zona de color del mapa',
                'Porque una palabra de negación invierte el significado, y la cercanía en palabras no es el mismo significado',
            ],
            explanation:
                'Una palabra, "no", invierte el significado por completo. Compartir palabras hace que las frases parezcan cercanas, pero esa es justamente la trampa: la cercanía en palabras no garantiza el mismo significado.',
        },
        5: {
            question: 'Quieres que el modelo compare el significado entre dos frases y no solo busque palabras compartidas. ¿Qué ayuda más?',
            options: [
                'Dar contexto y pedir explícitamente que compare el significado, no solo las palabras',
                'Escribir un prompt lo más corto y general posible',
                'Usar la mayor cantidad posible de palabras idénticas en ambas frases',
                'Suponer que si las frases suenan parecidas, dicen lo mismo',
            ],
            explanation:
                'La cercanía en el espacio ayuda al modelo a relacionar, pero no es una prueba de que el significado sea idéntico ni correcto. Un prompt claro que da contexto y pide comparar el significado recibe una respuesta más precisa que uno corto y vago.',
        },
    },

    conceptLabels: {
        'מרחב סמנטי': 'Espacio semántico',
        'המפה אינה המרחב': 'El mapa no es el espacio',
        'מילים שונות משמעות דומה': 'Palabras distintas, significado parecido',
        'שלילה הופכת משמעות': 'La negación invierte el significado',
        'קרבה אינה אמת': 'La cercanía no es la verdad',
    },
};
