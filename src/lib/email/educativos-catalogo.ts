// Nuevos correos educativos generales. SIN emojis. SIN cifras clínicas ni promesas.
// Todo uso remite a las instrucciones del fabricante y a un profesional de la salud visual.
import { type EducationalEmail } from './educational-templates'
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'

export const EDUCATIVOS_NUEVOS: EducationalEmail[] = [
  { id: 'edu-receta-parametros', subject: 'Cómo leer tu receta: SPH, CYL, AXIS y ADD', titulo: 'Cómo leer tu receta',
    parrafos: ['SPH (esfera) indica la potencia principal. CYL (cilindro) y AXIS (eje) describen el astigmatismo. ADD es la adición para visión de cerca.', 'Tu receta debe ser reciente y completa para cada ojo. Si algún dato no coincide con tu receta, consulta antes de comprar.'],
    cta: { texto: 'Ver opciones disponibles', url: `${SITE}/receta` } },
  { id: 'edu-caducidad', subject: 'Caducidad y período de reemplazo: cómo revisarlos', titulo: 'Caducidad y reemplazo',
    parrafos: ['Revisa la fecha de caducidad en el empaque antes de usar tus lentes o soluciones.', 'El período de reemplazo de cada lente está indicado por el fabricante. Respétalo aunque el lente parezca estar en buen estado.'],
    cta: { texto: 'Explorar productos', url: `${SITE}/catalogo` } },
  { id: 'edu-solucion', subject: 'Elegir una solución: lo que debes revisar', titulo: 'Elegir tu solución',
    parrafos: ['No todas las soluciones son compatibles con todos los lentes. Antes de cambiar de solución, revisa la etiqueta de tus lentes.', 'Si tienes dudas sobre compatibilidad, consulta con tu profesional de la salud visual.'],
    cta: { texto: 'Ver soluciones', url: `${SITE}/soluciones` } },
  { id: 'edu-viajes', subject: 'Llevar tus lentes de contacto en un viaje', titulo: 'Tus lentes en un viaje',
    parrafos: ['Lleva lentes de repuesto, solución en envase pequeño y tu receta vigente. Guarda los lentes en el equipaje de mano.', 'Evita cambios bruscos de temperatura y no dejes los lentes expuestos al sol.'],
    cta: { texto: 'Visitar ContactGo', url: SITE } },
  { id: 'edu-pantallas', subject: 'Pantallas y ojos cansados: pausas que ayudan', titulo: 'Pantallas y descanso visual',
    parrafos: ['Parpadear con frecuencia y hacer pausas cada cierto tiempo de uso de pantallas puede aliviar la sensación de cansancio visual.', 'Si la sequedad persiste, consulta con tu profesional de la salud visual.'],
    cta: { texto: 'Explorar productos', url: `${SITE}/catalogo` } },
  { id: 'edu-cambio-marca', subject: 'Cambiar de marca de lentes: qué considerar', titulo: 'Cambiar de marca',
    parrafos: ['Cambiar de marca puede implicar una adaptación distinta. Compara la graduación disponible y el tipo de lente antes de decidir.', 'Si notas molestias al cambiar, retira los lentes y consulta con tu profesional de la salud visual.'],
    cta: { texto: 'Comparar opciones', url: `${SITE}/catalogo` } },
  { id: 'edu-ojo-seco', subject: 'Ojos secos con lentes de contacto', titulo: 'Ojos secos',
    parrafos: ['Si sientes ojos secos con tus lentes, revisa el tipo de lente, el período de uso y tus hábitos diarios.', 'La sequedad persistente, el enrojecimiento o el dolor necesitan evaluación profesional.'],
    cta: { texto: 'Ver productos de cuidado', url: `${SITE}/soluciones` } },
  { id: 'edu-senales', subject: 'Cuándo retirar tus lentes y consultar', titulo: 'Señales de alerta',
    parrafos: ['Retira tus lentes y busca evaluación profesional si tienes dolor, enrojecimiento, secreción, fotofobia o visión borrosa repentina.', 'No esperes a que la molestia pase por sí sola.'],
    cta: { texto: 'Visitar ContactGo', url: SITE } },
]
