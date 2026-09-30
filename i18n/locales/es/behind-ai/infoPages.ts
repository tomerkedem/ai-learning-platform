// i18n/locales/es/behind-ai/infoPages.ts
// Páginas de información del curso en español. Forma y reglas de contenido: ../../he/behind-ai/infoPages.
import type { InfoPagesDict } from '../../he/behind-ai/infoPages';

export const infoPages: InfoPagesDict = {
    navLabel: 'Información del curso',
    skipToContent: 'Saltar al contenido',
    backToCourse: 'Volver al curso',
    continueTitle: 'Volver a aprender',
    continueBody: 'Abre la introducción o elige cualquier capítulo desde el menú del curso.',
    morePages: 'Más información',
    placeholderLabel: 'Borrador: falta una decisión antes de publicar',

    pages: {
        about: {
            navTitle: 'Acerca de',
            summary: 'Qué aprendes aquí y cómo está construido el curso.',
            title: 'Acerca del curso',
            lead: 'Entre bastidores de AI es un curso interactivo de aprendizaje autónomo que muestra, paso a paso, qué ocurre desde que escribes a un chat o a un agente hasta que aparece la respuesta.',
            blocks: [
                {
                    kind: 'facts',
                    heading: 'De un vistazo',
                    items: [
                        { icon: 'layers', title: 'Introducción, 19 capítulos y un examen final', body: 'Cada capítulo termina con una breve comprobación de comprensión, y el examen final lo une todo.' },
                        { icon: 'languages', title: 'Seis idiomas', body: 'Hebreo, inglés, español, ruso, árabe y japonés. Puedes cambiar de idioma en cualquier momento desde el menú del curso.' },
                        { icon: 'device', title: 'A tu ritmo', body: 'Pensado para el teléfono y también para pantallas grandes, y tu progreso se guarda en tu navegador.' },
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Cómo funciona el curso',
                    items: [
                        'Cada capítulo explica una idea mediante laboratorios interactivos que puedes probar por tu cuenta.',
                        'La comprobación de comprensión al final de cada capítulo muestra qué conceptos ya dominas y cuáles conviene reforzar.',
                        'Cada capítulo tiene una opción de lectura en voz alta que usa las voces de tu navegador cuando están disponibles.',
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Quién escribió el curso',
                    paragraphs: ['El curso fue escrito por Tomer Kedem.'],
                },
                {
                    kind: 'placeholder',
                    heading: 'Operador del curso',
                    decision: 'Confirmar el nombre legal de la persona u organización que opera el curso y ofrece el acceso beta, y si es también el autor del curso.',
                },
            ],
        },

        faq: {
            navTitle: 'Preguntas frecuentes',
            summary: 'Acceso, la beta, el acceso de pago y tu progreso.',
            title: 'Preguntas frecuentes',
            lead: 'Respuestas breves sobre el acceso beta gratuito, el acceso de pago previsto para el futuro y qué pasa con tu progreso.',
            blocks: [
                {
                    kind: 'faq',
                    heading: 'Acceso y la beta',
                    items: [
                        { q: '¿Registrarme me da acceso al curso completo?', a: 'No. El registro por sí solo no da acceso al curso completo. El acceso completo se concede a participantes de la beta aprobados individualmente.' },
                        { q: '¿Cuánto dura el acceso gratuito?', a: 'Cada participante aprobado recibe acceso gratuito al curso completo durante un máximo de un mes desde la aprobación, no desde el día en que te registras. El acceso puede terminar antes.' },
                        { q: '¿Me pedirán una tarjeta o me cobrarán automáticamente?', a: 'No. El acceso beta no requiere tarjeta de pago y no hay ningún cobro automático.' },
                        { q: '¿Puede terminar mi acceso antes de que acabe el mes?', a: 'Sí. El acceso puede terminar antes de que acabe el mes. Puede suspenderse de inmediato y sin aviso previo por motivos de seguridad, uso indebido o motivos técnicos urgentes. En los demás casos, procuraremos avisar al participante con antelación.' },
                        { q: '¿Qué pasa con mi progreso cuando termina el mes?', a: 'Tu progreso y los resultados de tus comprobaciones se conservan después de que termine el periodo de acceso.' },
                    ],
                },
                {
                    kind: 'faq',
                    heading: 'Acceso beta y acceso de pago',
                    items: [
                        { q: '¿El acceso beta gratuito es lo mismo que comprar el curso?', a: 'No. El acceso beta es gratuito, se concede por aprobación individual y dura como máximo un mes. El acceso de pago está previsto para el futuro como una compra aparte, y el acceso beta no se convierte automáticamente en una compra.' },
                        { q: '¿Qué opciones de pago están previstas?', a: 'Están previstos dos productos, ambos como compra única sin renovación automática: Entre bastidores de AI, con seis meses de acceso, y AI Engineering Foundations, con 12 meses de acceso, que incluye este curso, Mathematics Foundations, Python Foundations y dos libros que se leen en el sitio dedicado a los libros. AI Engineering Foundations todavía no está disponible para la compra. Los precios y las fechas de disponibilidad aún no se han publicado.' },
                        { q: '¿Qué pasa si el curso no está disponible durante el acceso de pago?', a: 'Un problema con tu propio dispositivo o tu conexión a internet no da derecho por sí solo a un reembolso. Si hay una interrupción importante de la plataforma, se considerará ampliar tu acceso. Una falta de disponibilidad prolongada se revisará de forma individual conforme a la ley aplicable. Estos principios proceden del borrador de las condiciones de venta y aún no son definitivos.' },
                        { q: '¿Dónde puedo leer las condiciones de venta?', a: 'Las condiciones de venta todavía son un borrador. Puedes leerlo en la página "Condiciones de venta (borrador)", y puede cambiar antes de publicarse.' },
                    ],
                },
                {
                    kind: 'faq',
                    heading: 'Uso del curso',
                    items: [
                        { q: '¿Dónde se guarda mi progreso ahora?', a: 'En la versión actual, el progreso y los resultados de las comprobaciones se guardan solo en el navegador de tu dispositivo. Si borras los datos del sitio en el navegador, se eliminan, y no pasan a otro dispositivo ni a otro navegador.' },
                        { q: '¿Puedo cambiar el idioma o el tema?', a: 'Sí. En el menú del curso puedes cambiar entre los seis idiomas y elegir un tema claro, oscuro o el del sistema. Tu elección se recuerda en el navegador.' },
                    ],
                },
                {
                    kind: 'placeholder',
                    heading: 'Preguntas aún abiertas',
                    decision: 'Decidir cómo se solicita participar en la beta, cómo se aprueba a los participantes, qué está disponible antes de la aprobación y qué acceso se mantiene al terminar el periodo de acceso, además del progreso guardado. Para el acceso de pago: precios, el vendedor, el proveedor de pagos, las fechas de lanzamiento y las reglas de cancelación y reembolso.',
                },
            ],
        },

        contact: {
            navTitle: 'Contacto',
            summary: 'Cómo comunicarte con el equipo del curso.',
            title: 'Contacto',
            lead: 'Los datos de contacto oficiales del curso todavía no se han publicado. Mientras tanto, puede que la respuesta ya esté en las preguntas frecuentes.',
            blocks: [
                {
                    kind: 'placeholder',
                    heading: 'Canal de contacto',
                    decision: 'Definir el canal de contacto oficial (por ejemplo, una dirección de correo o un formulario), quién responde, el tiempo de respuesta esperado y si las consultas de accesibilidad y privacidad tienen un canal propio.',
                },
            ],
        },

        betaTerms: {
            navTitle: 'Condiciones beta y licencia',
            summary: 'Cómo funciona el acceso beta y los derechos sobre el contenido.',
            title: 'Condiciones beta y licencia',
            lead: 'Estos son los principios de acceso al curso completo durante la beta, tal como se han confirmado hasta ahora.',
            blocks: [
                {
                    kind: 'facts',
                    heading: 'Principios de acceso',
                    items: [
                        { icon: 'key', title: 'Aprobación individual', body: 'El registro por sí solo no da acceso al curso completo. El acceso completo se concede a participantes de la beta aprobados individualmente.' },
                        { icon: 'clock', title: 'Hasta un mes gratis', body: 'Cada participante aprobado recibe acceso gratuito al curso completo durante un máximo de un mes desde la aprobación. El acceso puede terminar antes.' },
                        { icon: 'card', title: 'Sin tarjeta ni cobro automático', body: 'El acceso beta no requiere tarjeta de pago y no se te cobrará automáticamente.' },
                        { icon: 'save', title: 'Tu progreso se mantiene', body: 'Tu progreso y los resultados de tus comprobaciones se conservan después de que termine el periodo de acceso.' },
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Suspensión y fin anticipado',
                    items: [
                        'El acceso puede terminar antes de que acabe el mes.',
                        'El acceso puede suspenderse de inmediato y sin aviso previo por motivos de seguridad, uso indebido o motivos técnicos urgentes.',
                        'En los demás casos, procuraremos avisar al participante con antelación.',
                    ],
                },
                {
                    kind: 'text',
                    heading: 'El acceso beta no es una compra',
                    paragraphs: ['El acceso beta gratuito es independiente del acceso de pago previsto para el futuro y no se convierte automáticamente en una compra. Los productos previstos se describen en el borrador de las condiciones de venta.'],
                },
                {
                    kind: 'text',
                    heading: 'Derechos sobre el contenido del curso',
                    paragraphs: ['© 2026 Tomer Kedem. Todos los derechos reservados.'],
                },
                {
                    kind: 'placeholder',
                    heading: 'Licencia para participantes',
                    decision: 'Definir qué pueden y qué no pueden hacer los participantes con el contenido (uso personal, compartir, capturas de pantalla, citas), a quién pertenecen los comentarios que envían y cómo se aceptan las condiciones.',
                },
                {
                    kind: 'placeholder',
                    heading: 'Condiciones legales',
                    decision: 'Requiere revisión legal: el operador que figura como parte en las condiciones, cómo cualquiera de las partes puede terminar el acceso, la redacción vinculante sobre la suspensión y el fin anticipado, cambios en las condiciones, limitación de responsabilidad y ley aplicable. El acceso de pago se trata por separado en el borrador de las condiciones de venta.',
                },
            ],
        },

        privacy: {
            navTitle: 'Privacidad',
            summary: 'Qué guarda el curso en tu dispositivo y en tu cuenta.',
            title: 'Privacidad',
            lead: 'Esta página describe qué guarda la versión actual del curso y qué no.',
            blocks: [
                {
                    kind: 'facts',
                    heading: 'Qué se guarda en tu dispositivo',
                    items: [
                        { icon: 'save', title: 'Progreso sin cuenta', body: 'Sin cuenta, el progreso y los resultados de los tests se guardan en el almacenamiento local de tu navegador y no se envían a ningún servidor.' },
                        { icon: 'cookie', title: 'Idioma elegido', body: 'Si eliges un idioma, se guarda en una cookie funcional durante un año como máximo. El navegador la envía con las solicitudes al curso para que las páginas se carguen en el idioma que elegiste.' },
                        { icon: 'key', title: 'Sesión iniciada', body: 'Si inicias sesión, tu navegador conserva la sesión y una cookie guarda tu token de acceso para que el curso pueda comprobar qué capítulos tienes abiertos. La cookie caduca con la sesión.' },
                        { icon: 'sliders', title: 'Preferencias de visualización', body: 'El tema y la posición de desplazamiento del menú del curso se guardan en tu navegador.' },
                    ],
                },
                {
                    kind: 'facts',
                    heading: 'Si creas una cuenta',
                    items: [
                        { icon: 'key', title: 'Nombre y correo electrónico', body: 'Para crear una cuenta escribes tu nombre completo y tu correo electrónico. Identifican tu cuenta. Tu nombre se muestra junto a tu correo en tu cuenta y a los administradores del curso que gestionan el acceso beta. Puedes editar tu nombre en cualquier momento.' },
                        { icon: 'save', title: 'Progreso e idioma', body: 'Mientras tienes la sesión iniciada, los resultados de los tests y el idioma elegido se guardan en tu cuenta para que estén disponibles en tus otros dispositivos.' },
                        { icon: 'clock', title: 'Acceso beta', body: 'Si tu cuenta tiene acceso beta aprobado, cuándo se aprobó y cuándo termina, y un registro de qué administrador lo aprobó o revocó y cuándo.' },
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Lo que el curso no hace',
                    items: [
                        'El curso no tiene herramientas de analítica ni rastreadores publicitarios.',
                        'Tu nombre y tu correo no se muestran a otros estudiantes ni se usan para publicidad.',
                        'No necesitas una cuenta para leer la introducción y el capítulo 1.',
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Cómo se elige el idioma inicial',
                    paragraphs: ['Para elegir un idioma en tu primera visita, el curso lee la configuración de idioma de tu navegador y, según la configuración del alojamiento, puede usar también una indicación aproximada del país que proporciona la plataforma de alojamiento. El curso no guarda esta información.'],
                },
                {
                    kind: 'text',
                    heading: 'Cómo borrarlo',
                    paragraphs: ['Puedes borrar lo que el curso guarda en tu dispositivo eliminando los datos de este sitio en la configuración del navegador. La forma de solicitar la eliminación de los datos de la cuenta se describirá en la política de privacidad completa.'],
                },
                {
                    kind: 'placeholder',
                    heading: 'Política de privacidad completa',
                    decision: 'Requiere revisión legal: la identidad y los datos de contacto del responsable de los datos, durante cuánto tiempo se conservan los datos de la cuenta (nombre, correo, progreso, idioma elegido y registros de acceso beta) y con qué base legal, cómo solicitar el acceso o la eliminación, qué registran los proveedores de alojamiento y autenticación (como direcciones IP y registros de solicitudes) y durante cuánto tiempo, terceros y encargados del tratamiento, y la ley aplicable.',
                },
            ],
        },

        accessibility: {
            navTitle: 'Accesibilidad',
            summary: 'Qué existe hoy y qué falta por mejorar.',
            title: 'Accesibilidad',
            lead: 'Esta página describe las funciones de accesibilidad que el curso ofrece hoy y las limitaciones que conocemos.',
            blocks: [
                {
                    kind: 'facts',
                    heading: 'Lo que existe hoy',
                    items: [
                        { icon: 'direction', title: 'Idioma y dirección', body: 'Cada página declara su idioma y su dirección de lectura, de derecha a izquierda en hebreo y árabe y de izquierda a derecha en los demás idiomas, para que los lectores de pantalla y los navegadores presenten bien el texto.' },
                        { icon: 'keyboard', title: 'Teclado', body: 'El menú del curso y la navegación entre capítulos funcionan con el teclado, con un indicador de foco visible. En los capítulos y en las páginas de información, la primera pulsación de Tab muestra el enlace «Saltar al contenido». En los capítulos, las flechas llevan al capítulo siguiente o anterior, y Esc cierra el menú en el teléfono y cualquier ventana abierta.' },
                        { icon: 'motion', title: 'Movimiento reducido', body: 'Cuando tu sistema pide reducir el movimiento, o cuando activas «Reducir el movimiento» en la ventana «Accesibilidad y visualización», se detienen las animaciones y los efectos decorativos, incluido el globo terráqueo del selector de idioma. El contenido y los laboratorios siguen disponibles. El cambio se aplica al instante, sin recargar la página.' },
                        { icon: 'sliders', title: 'Accesibilidad y visualización', body: 'En la ventana «Accesibilidad y visualización» del menú del curso puedes agrandar el texto de lectura, ampliar el espaciado de lectura, aumentar el contraste, reducir el movimiento y subrayar los enlaces. Los ajustes se guardan solo en este dispositivo.' },
                        { icon: 'theme', title: 'Temas claro y oscuro', body: 'Elige un tema claro u oscuro, o el de tu sistema, desde el menú del curso.' },
                        { icon: 'speaker', title: 'Lectura en voz alta', body: 'Cada capítulo tiene una opción de lectura en voz alta que usa las voces de tu navegador cuando están disponibles.' },
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Limitaciones conocidas',
                    items: [
                        'Todavía no se ha publicado una revisión formal de accesibilidad según un estándar reconocido (como WCAG).',
                        'El tamaño del texto de lectura agranda solo los párrafos y las listas. Los títulos, los botones y las etiquetas de los laboratorios mantienen su tamaño. El zoom del navegador lo agranda todo.',
                        'Los colores del texto secundario del curso se midieron en los temas claro y oscuro, en la introducción, el capítulo 1 y las páginas de información, con un contraste de al menos 4.5:1. Algunos colores fijos dentro de los laboratorios todavía no se han medido y pueden ser más bajos. El ajuste «Más contraste» refuerza el texto secundario y los bordes del curso, pero no todos los colores de los laboratorios.',
                        'Todavía no se han publicado pruebas con lectores de pantalla como NVDA o VoiceOver.',
                    ],
                },
                {
                    kind: 'text',
                    heading: 'Sin superposiciones de accesibilidad',
                    paragraphs: ['El curso no usa ningún complemento ni widget externo de accesibilidad. La accesibilidad se resuelve dentro del propio curso.'],
                },
                {
                    kind: 'placeholder',
                    heading: 'Declaración de accesibilidad',
                    decision: 'Decidir el objetivo de conformidad (por ejemplo, WCAG 2.2 nivel AA), los resultados y la fecha de una revisión de accesibilidad, cualquier declaración legal exigida donde se ofrezca el curso y un canal para informar de barreras de accesibilidad. Ese canal no se mostrará aquí hasta que se confirme.',
                },
            ],
        },

        salesTerms: {
            navTitle: 'Condiciones de venta (borrador)',
            summary: 'Borrador: los productos de pago previstos y sus principios.',
            title: 'Condiciones de venta: borrador',
            lead: 'Esto es un borrador, no las condiciones de venta definitivas. Describe los productos de pago previstos y los principios fijados hasta ahora. Esta página no es una oferta de compra, y los detalles pueden cambiar antes de publicarse.',
            blocks: [
                {
                    kind: 'facts',
                    heading: 'Productos previstos',
                    items: [
                        { icon: 'layers', title: 'Entre bastidores de AI', body: 'Seis meses de acceso a este curso. Compra única, sin renovación automática.' },
                        { icon: 'book', title: 'AI Engineering Foundations', body: '12 meses de acceso a un paquete que incluye Entre bastidores de AI, Mathematics Foundations, Python Foundations y dos libros que se leen en el sitio dedicado a los libros. Compra única, sin renovación automática. Todavía no está disponible para la compra.' },
                    ],
                },
                {
                    kind: 'text',
                    heading: 'El acceso beta no es una compra',
                    paragraphs: ['El acceso beta gratuito es independiente de estos productos. Se concede por aprobación individual durante un máximo de un mes y no se convierte automáticamente en una compra.'],
                },
                {
                    kind: 'text',
                    heading: 'Cuando el curso no está disponible',
                    items: [
                        'Un problema con el propio dispositivo o la conexión a internet del alumno no da derecho por sí solo a un reembolso.',
                        'Si hay una interrupción importante de la plataforma, se considerará ampliar el acceso.',
                        'Una falta de disponibilidad prolongada se revisará de forma individual conforme a la ley aplicable.',
                    ],
                },
                {
                    kind: 'placeholder',
                    heading: 'Detalles aún por decidir',
                    decision: 'Decidir antes de publicar: precios y moneda, la identidad legal del vendedor y sus datos de contacto, el proveedor de pagos, cuándo estará disponible cada producto para la compra, desde cuándo cuenta el periodo de acceso, las reglas de cancelación y reembolso, qué se considera una interrupción importante o una falta de disponibilidad prolongada y cuánto se amplía el acceso, cómo se accede a los dos libros y qué pasa al terminar el periodo de acceso.',
                },
                {
                    kind: 'placeholder',
                    heading: 'Revisión legal',
                    decision: 'Requiere revisión legal antes de publicar: la redacción completa de las condiciones de venta, los derechos de desistimiento y reembolso de los consumidores allí donde se vendan los productos, facturas e impuestos, limitación de responsabilidad, cambios en las condiciones y ley aplicable. Este borrador no afirma cumplir ninguna ley.',
                },
            ],
        },
    },
};
