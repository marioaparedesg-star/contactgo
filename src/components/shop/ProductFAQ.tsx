'use client'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

// FAQ específicas por producto — tienen prioridad sobre las de categoría.
// Se usa el nombre EXACTO de products.nombre como llave. Solo los productos
// listados aquí tienen preguntas verdaderamente propias; el resto sigue
// usando el respaldo genérico de FAQS_BY_TYPE mientras se van agregando.
const FAQS_BY_PRODUCT: Record<string, { q: string; a: string }[]> = {
  '1-DAY ACUVUE® MOIST®': [
    { q: '¿Qué es LACREON Technology?', a: 'Es la tecnología de ACUVUE que incorpora un agente humectante directamente en el material del lente, para que se sienta cómodo desde la mañana hasta la noche sin necesidad de gotas adicionales.' },
    { q: '¿Necesito solución de limpieza?', a: 'No — es un lente diario, se usa una vez y se desecha. No necesita estuche ni solución.' },
    { q: '¿Viene solo en caja de 30?', a: 'También está disponible en presentación de 90 lentes (3 meses de uso diario), normalmente más conveniente en precio por unidad.' },
    { q: '¿Tiene protección UV?', a: 'Sí, incluye bloqueo UV — un beneficio adicional, no un sustituto de gafas de sol o protección ocular específica.' },
    { q: '¿Puedo usarlo si tengo ojos sensibles?', a: 'Al ser un lente diario desechado cada día, reduce la acumulación de depósitos y alérgenos — muchas personas con sensibilidad ocular lo encuentran más cómodo que lentes reutilizables.' },
    { q: '¿Cuántas horas al día puedo usarlo?', a: 'Como cualquier lente de contacto, sigue la recomendación de tu optometrista — generalmente no se recomienda dormir con él puesto salvo indicación específica.' },
    { q: '¿Qué pasa si se me rompe uno dentro de la caja?', a: 'Puede pasar ocasionalmente durante el manejo. Escríbenos por WhatsApp y te ayudamos a resolverlo.' },
  ],
  'ACUVUE® OASYS® with HYDRACLEAR® Plus': [
    { q: '¿Qué es HYDRACLEAR Plus?', a: 'Es la tecnología de ACUVUE que libera un agente humectante durante el uso, para mantener el lente hidratado durante las 2 semanas completas de su vida útil.' },
    { q: '¿Por qué se reemplaza cada 2 semanas y no cada mes?', a: 'El reemplazo más frecuente reduce la acumulación de depósitos de proteína, lo que muchos usuarios notan como una sensación más "fresca" durante todo el tiempo de uso.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí — al ser quincenal, necesitas solución multipropósito para su limpieza y almacenamiento nocturno.' },
    { q: '¿Tiene protección UV?', a: 'Sí, cuenta con bloqueo UV Clase 1, uno de los niveles más altos disponibles en lentes de contacto.' },
    { q: '¿Es bueno para uso frente a pantallas?', a: 'Sí, es una de las razones por las que se recomienda frecuentemente para quienes pasan muchas horas frente a computadora o celular.' },
    { q: '¿Tiene versión para astigmatismo o presbicia?', a: 'Sí — ACUVUE Oasys for Astigmatism corrige astigmatismo, y ACUVUE Oasys Multifocal corrige presbicia, ambas con la misma tecnología HYDRACLEAR Plus.' },
    { q: '¿Cuántos lentes trae la caja?', a: '6 lentes por caja — 3 meses de uso con reemplazo quincenal (2 lentes por mes).' },
  ],
  'ACUVUE® OASYS® Multifocal': [
    { q: '¿Qué es PUPIL OPTIMIZED DESIGN?', a: 'Es un diseño que ajusta la distribución de potencias del lente según el tamaño de pupila típico para tu edad y graduación, buscando mejor visión en distintas condiciones de luz (día y noche).' },
    { q: '¿Qué niveles de ADD maneja?', a: 'Tres: Low (+0.75 a +1.25), Mid (+1.50 a +1.75), y High (+2.00 a +2.50) — tu optometrista indica cuál corresponde a tu receta.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Cada 2 semanas (quincenal) — igual que ACUVUE Oasys esférico, con la misma tecnología HYDRACLEAR Plus.' },
    { q: '¿Cuánto tiempo toma adaptarse a un multifocal?', a: 'La mayoría de las personas se adapta en 1-2 semanas mientras el cerebro aprende a usar las distintas zonas de potencia del lente automáticamente.' },
    { q: '¿Sirve si además tengo astigmatismo?', a: 'Este producto específico no corrige astigmatismo — si lo necesitas, consúltanos por WhatsApp para revisar otras opciones disponibles.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es de reemplazo quincenal — necesitas solución multipropósito para su cuidado diario.' },
    { q: '¿Qué información de mi receta necesito para pedir?', a: 'Tu graduación esférica (SPH) de cada ojo y tu nivel de ADD (Low/Mid/High), que tu optometrista incluye en la receta.' },
  ],
  '1-DAY ACUVUE® MOIST® for Astigmatism': [
    { q: '¿Qué es BLINK STABILIZED Design?', a: 'Es un sistema de estabilización que usa el propio parpadeo natural para mantener el lente orientado correctamente en el eje de tu astigmatismo, sin necesidad de un diseño más grueso o incómodo.' },
    { q: '¿Por qué es diario si los tóricos suelen tardar más en llegar?', a: 'Este lente se fabrica en un rango de parámetros ya disponible en inventario, a diferencia de tóricos con cilindros o ejes muy específicos que sí requieren fabricación a medida.' },
    { q: '¿Necesito solución de limpieza?', a: 'No — es diario, se descarta cada noche sin necesidad de estuche ni solución.' },
    { q: '¿Qué datos de mi receta necesito?', a: 'Esfera (SPH), Cilindro (CYL) y Eje (AXIS) de cada ojo — los tres valores son obligatorios para un lente tórico.' },
    { q: '¿Es igual de cómodo que el ACUVUE Moist normal?', a: 'Sí, usa la misma tecnología LACREON para hidratación, con el diseño adicional de estabilización para corregir astigmatismo.' },
    { q: '¿Viene en presentación de 90?', a: 'La presentación estándar es de 30 lentes; para cantidades mayores, consulta disponibilidad por WhatsApp.' },
    { q: '¿Sirve para astigmatismo alto?', a: 'Cubre un rango de cilindros estándar — para astigmatismo muy alto, escríbenos para confirmar si tu graduación específica está disponible.' },
  ],
  'ACUVUE® OASYS® for Astigmatism': [
    { q: '¿Qué cilindros maneja?', a: '-0.75, -1.25, -1.75 y -2.25, con ejes en incrementos de 10° — cubre la mayoría de los casos de astigmatismo leve a moderado.' },
    { q: '¿Qué es BLINK STABILIZED Design?', a: 'El sistema de ACUVUE que usa el parpadeo natural para reorientar el lente automáticamente si se mueve, manteniendo tu visión nítida y estable.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Cada 2 semanas, igual que ACUVUE Oasys esférico — con la misma tecnología HYDRACLEAR Plus para hidratación.' },
    { q: '¿Por qué tarda más en llegar que un esférico?', a: 'Los lentes tóricos con tu combinación exacta de cilindro y eje a veces requieren pedido especial al fabricante — te confirmamos el tiempo exacto al momento de tu pedido.' },
    { q: '¿Qué pasa si mi eje no es un múltiplo de 10?', a: 'Escríbenos por WhatsApp con tu receta exacta — a veces se redondea al valor disponible más cercano, previa confirmación contigo.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es quincenal — necesita solución multipropósito para su limpieza y almacenamiento nocturno.' },
    { q: '¿Tiene versión diaria?', a: 'Sí — 1-DAY ACUVUE Moist for Astigmatism es la versión diaria equivalente, con BLINK STABILIZED Design similar.' },
  ],
  'AIR OPTIX® COLORS': [
    { q: '¿Puedo pedirlo sin graduación?', a: 'Sí, está disponible en versión "plano" (sin corrección) solo para efecto de color, además de con graduación si también necesitas corregir tu visión.' },
    { q: '¿Cuántos tonos hay disponibles?', a: '12 tonos, diseñados tanto para verse bien sobre ojos claros como sobre ojos oscuros gracias a la tecnología 3-in-1 Color Technology.' },
    { q: '¿Qué es SmartShield Technology?', a: 'Una capa que repele depósitos de grasa, proteína y maquillaje de la superficie del lente, ayudando a que se mantenga "limpio" durante todo el mes de uso.' },
    { q: '¿Se ven naturales?', a: 'Sí — al ser de silicona hidrogel con diseño de 3 capas de color, imitan la profundidad y textura natural del iris mejor que lentes de color más básicos.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual — un mismo par dura 30 días con el cuidado adecuado (limpieza nocturna con solución multipropósito).' },
    { q: '¿Es la única línea de color que venden?', a: 'Sí, es nuestra única línea de color con distribución oficial de fabricante — no vendemos lentes de color de otras marcas sin certificación.' },
    { q: '¿Sirve para Carnaval o disfraces?', a: 'Sí, muchos clientes lo piden para eventos — solo recuerda seguir las normas básicas de higiene aunque sea para uso ocasional (manos limpias, no compartir, no dormir con ellos puestos).' },
  ],
  'AIR OPTIX® plus HydraGlyde®': [
    { q: '¿Qué es HydraGlyde Moisture Matrix?', a: 'Una tecnología que crea una superficie suave y lubricada en el lente, liberando humectante gradualmente durante todo el mes de uso.' },
    { q: '¿Qué es SmartShield Technology?', a: 'Una capa protectora que repele depósitos de grasa, proteína y maquillaje — útil si usas maquillaje con frecuencia o vives en un ambiente con polvo.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual — 6 lentes por caja, 3 meses de uso con el cuidado adecuado.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su limpieza y almacenamiento nocturno.' },
    { q: '¿Tiene versión para astigmatismo o presbicia?', a: 'Sí — Air Optix plus HydraGlyde for Astigmatism corrige astigmatismo, y Air Optix plus HydraGlyde Multifocal corrige presbicia, ambas con la misma tecnología base.' },
    { q: '¿Es de Alcon?', a: 'Sí, es fabricado por Alcon, uno de los tres fabricantes de lentes de contacto más grandes del mundo.' },
    { q: '¿Sirve si uso maquillaje todos los días?', a: 'Es una buena opción específicamente por eso — SmartShield está diseñado para repeler ese tipo de depósito de la superficie del lente.' },
  ],
  'PRECISION1®': [
    { q: '¿Qué es SMARTSURFACE Technology?', a: 'Una tecnología de Alcon que crea una superficie ultra-humectada en el lente, casi 100% agua en su capa exterior, para comodidad constante durante el día.' },
    { q: '¿Necesito solución de limpieza?', a: 'No — es un lente diario, se usa una vez y se desecha sin necesidad de estuche ni solución.' },
    { q: '¿De qué material está hecho?', a: 'Verofilcon A, un material de silicona hidrogel de Alcon con buena transmisión de oxígeno y protección UV incluida.' },
    { q: '¿Cuántos lentes trae la caja?', a: '30 lentes — un mes de uso diario.' },
    { q: '¿Es una alternativa a 1-DAY ACUVUE Moist?', a: 'Sí, ambos son lentes diarios premium de fabricantes distintos (Alcon vs Johnson & Johnson) — la elección suele ser cuestión de comodidad personal.' },
    { q: '¿Tiene protección UV?', a: 'Sí, incluye protección UV — un beneficio adicional, no un sustituto de gafas de sol.' },
    { q: '¿Sirve para uso ocasional?', a: 'Sí, al ser diario es ideal si no usas lentes de contacto todos los días — no desperdicias un par mensual en días que no lo usas.' },
  ],
  'AIR OPTIX® plus HydraGlyde® Multifocal': [
    { q: '¿Qué es PRECISION PROFILE?', a: 'El diseño óptico de Alcon para lentes multifocales, pensado para dar visión nítida en distancias de lejos, media y cerca dentro del mismo lente.' },
    { q: '¿Qué niveles de ADD maneja?', a: 'LOW, MID y HIGH — tu optometrista te indica cuál corresponde según tu nivel de presbicia.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual, igual que Air Optix plus HydraGlyde esférico, con la misma tecnología HydraGlyde Moisture Matrix.' },
    { q: '¿Tiene protección contra depósitos?', a: 'Sí, SmartShield Technology repele grasa, proteína y maquillaje de la superficie durante todo el mes.' },
    { q: '¿Cuánto tiempo toma adaptarse?', a: 'La mayoría de las personas se adapta en 1-2 semanas mientras el cerebro aprende a usar las distintas zonas del lente.' },
    { q: '¿Sirve si también tengo astigmatismo?', a: 'Este producto específico no corrige astigmatismo — escríbenos por WhatsApp para revisar otras opciones si lo necesitas.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su cuidado diario.' },
  ],
  'Opti-Free Puremoist': [
    { q: '¿Con qué lentes es compatible?', a: 'Es compatible con lentes blandos de hidrogel y silicona hidrogel — funciona con Acuvue, Air Optix, Biofinity y prácticamente todas las marcas de nuestro catálogo.' },
    { q: '¿Qué diferencia hay entre la presentación de 90ml y 300ml?', a: 'Es la misma fórmula — 300ml simplemente dura más tiempo (aproximadamente 2-3 meses de uso diario) y suele ser más conveniente en precio por mililitro.' },
    { q: '¿Qué es HydraGlyde Moisture Matrix en una solución?', a: 'La misma tecnología humectante que usan los lentes Air Optix HydraGlyde, aquí aplicada para ayudar a que cualquier lente compatible se sienta más hidratado al insertarlo.' },
    { q: '¿Sirve para limpiar y también para guardar los lentes?', a: 'Sí, es multipropósito — limpia, enjuaga, desinfecta y almacena en un solo paso, dentro del estuche.' },
    { q: '¿Cada cuánto debo comprar una botella?', a: 'Depende del tamaño: la de 90ml dura aproximadamente 3-4 semanas de uso diario, la de 300ml unos 2-3 meses.' },
    { q: '¿Puedo reutilizar la solución del día anterior?', a: 'No — siempre vacía el estuche y usa solución nueva cada noche. Reutilizar solución vieja aumenta el riesgo de irritación e infección.' },
    { q: '¿Sirve para lentes diarios?', a: 'No es necesaria — los lentes diarios se desechan cada día y no requieren solución de limpieza.' },
  ],
  'AIR OPTIX® plus HydraGlyde® for Astigmatism': [
    { q: '¿Qué estabilización usa para el astigmatismo?', a: 'Un diseño especial que mantiene el eje de corrección alineado durante el parpadeo natural, para visión estable durante todo el día.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual, igual que la versión esférica de Air Optix plus HydraGlyde, con la misma tecnología de hidratación.' },
    { q: '¿Qué datos de mi receta necesito?', a: 'Esfera (SPH), Cilindro (CYL) y Eje (AXIS) de cada ojo — los tres valores son obligatorios para cualquier lente tórico.' },
    { q: '¿Tiene protección contra depósitos?', a: 'Sí, SmartShield Technology repele grasa, proteína y maquillaje de la superficie del lente.' },
    { q: '¿Por qué puede tardar más en llegar?', a: 'Los tóricos con combinaciones específicas de cilindro y eje a veces requieren pedido especial — te confirmamos el tiempo exacto al hacer tu pedido.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su limpieza y almacenamiento nocturno.' },
    { q: '¿Es de la misma marca que Air Optix Colors?', a: 'Sí, ambos son de Alcon, aunque son productos distintos — este es para corrección de astigmatismo, no para efecto de color.' },
  ],
  'Bausch+Lomb ULTRA®': [
    { q: '¿Qué es MoistureSeal Technology?', a: 'Una tecnología que retiene el 95% del contenido de humedad del lente durante 16 horas continuas de uso, incluso con exposición prolongada a pantallas.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual — 6 lentes por caja, 3 meses de uso con el cuidado adecuado.' },
    { q: '¿Es bueno para ojos secos por pantallas?', a: 'Sí, es una de sus principales ventajas — MoistureSeal está pensado específicamente para mantener hidratación durante uso prolongado de dispositivos.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su limpieza y almacenamiento nocturno.' },
    { q: '¿Tiene versión para astigmatismo o presbicia?', a: 'Sí — Bausch+Lomb ULTRA for Astigmatism corrige astigmatismo, y ULTRA for Presbyopia corrige presbicia, ambas con la misma tecnología MoistureSeal.' },
    { q: '¿De qué fabricante es?', a: 'Bausch+Lomb, una de las marcas con más trayectoria en salud visual a nivel mundial.' },
    { q: '¿Tiene buena transmisión de oxígeno?', a: 'Sí, es un material de silicona hidrogel de alta permeabilidad, apto para uso prolongado durante el día.' },
  ],
  'Bausch+Lomb ULTRA® for Presbyopia': [
    { q: '¿Cómo funciona el diseño de 3 zonas?', a: 'Divide el lente en zonas ópticas para visión de lejos, media y cerca, permitiendo que tu cerebro use automáticamente la zona correcta según lo que estés mirando.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual, igual que Bausch+Lomb ULTRA esférico, con la misma tecnología MoistureSeal para hidratación.' },
    { q: '¿Cuánto tiempo toma adaptarse?', a: 'La mayoría de las personas se adapta en 1-2 semanas mientras el cerebro aprende a usar las distintas zonas del lente.' },
    { q: '¿Sirve si también tengo astigmatismo?', a: 'Este producto específico no corrige astigmatismo — escríbenos por WhatsApp para revisar otras opciones si lo necesitas.' },
    { q: '¿Es bueno para uso frente a pantallas?', a: 'Sí, hereda la tecnología MoistureSeal de la línea ULTRA, pensada para mantener hidratación durante uso prolongado.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su cuidado diario.' },
    { q: '¿A partir de qué edad se recomienda?', a: 'Generalmente a partir de los 40-45 años, cuando empieza la presbicia — tu optometrista confirma el momento exacto según tu receta.' },
  ],
  'Bausch+Lomb ULTRA® for Astigmatism': [
    { q: '¿Qué es STABILIX?', a: 'El sistema de estabilización de Bausch+Lomb que mantiene el lente orientado correctamente en tu eje de astigmatismo durante el parpadeo natural.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual, igual que Bausch+Lomb ULTRA esférico, con la misma tecnología MoistureSeal.' },
    { q: '¿Qué datos de mi receta necesito?', a: 'Esfera (SPH), Cilindro (CYL) y Eje (AXIS) de cada ojo.' },
    { q: '¿Es bueno para ojos secos?', a: 'Sí, hereda MoistureSeal Technology de la línea ULTRA, pensada para retener humedad durante uso prolongado.' },
    { q: '¿Por qué puede tardar más en llegar?', a: 'Los tóricos con combinaciones específicas de cilindro y eje a veces requieren pedido especial — te confirmamos el tiempo exacto al hacer tu pedido.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su limpieza y almacenamiento nocturno.' },
    { q: '¿Tiene versión diaria?', a: 'No en nuestro catálogo actual — esta línea de Bausch+Lomb para astigmatismo es de reemplazo mensual.' },
  ],
  'Avaira Vitality®': [
    { q: '¿Qué es Aquaform Technology?', a: 'La misma familia tecnológica de Biofinity — un material que retiene humedad de forma natural en su estructura, sin necesidad de recubrimientos adicionales.' },
    { q: '¿En qué se diferencia de Biofinity?', a: 'Avaira Vitality es la línea de entrada de CooperVision — misma familia tecnológica, a un costo más accesible. Buena opción si nunca has usado lentes mensuales.' },
    { q: '¿Qué transmisión de oxígeno tiene?', a: 'Hasta 96%, similar a otras líneas premium de silicona hidrogel — bueno para uso prolongado durante el día.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual — 6 lentes por caja, 3 meses de uso con el cuidado adecuado.' },
    { q: '¿Tiene protección UV?', a: 'Sí, incluye bloqueo UV — un beneficio adicional, no un sustituto de gafas de sol.' },
    { q: '¿Tiene versión para astigmatismo?', a: 'Sí — Avaira Vitality Toric, con la misma tecnología Aquaform y un sistema de estabilización para corrección de astigmatismo.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su limpieza y almacenamiento nocturno.' },
  ],
  'Biofinity®': [
    { q: '¿Cada cuánto debo cambiar Biofinity?', a: 'Biofinity es de reemplazo mensual — se usa durante 30 días y luego se descarta, sin importar si lo usaste todos los días o no. Necesita solución multipropósito para su limpieza nocturna.' },
    { q: '¿Qué es Aquaform Technology?', a: 'Es la tecnología de CooperVision que integra agua directamente en la estructura del material del lente (no solo en la superficie), lo que le da muy buena transmisión de oxígeno y comodidad durante todo el día de uso.' },
    { q: '¿Qué rango de graduación cubre Biofinity?', a: 'Biofinity estándar cubre miopía e hipermetropía dentro del rango habitual. Si tu graduación es muy alta (fuera de rango estándar), existe Biofinity XR, pensado específicamente para esos casos.' },
    { q: '¿Biofinity tiene versión para astigmatismo o presbicia?', a: 'Sí — Biofinity Toric corrige astigmatismo, y Biofinity Multifocal corrige presbicia (vista cansada +40 años). Son productos separados con la misma tecnología Aquaform.' },
    { q: '¿Es de CooperVision?', a: 'Sí, es una de sus líneas más recetadas a nivel mundial, junto con Avaira, Proclear y clariti.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su limpieza y almacenamiento nocturno.' },
    { q: '¿En qué se diferencia de Avaira Vitality?', a: 'Ambas usan Aquaform Technology — Biofinity es la línea insignia con más historial global; Avaira Vitality es la opción de entrada, más económica.' },
  ],
  'Biofinity® XR': [
    { q: '¿Qué significa "XR"?', a: 'Extended Range (rango extendido) — está pensado para graduaciones más altas de lo habitual, fuera del rango que cubre Biofinity estándar.' },
    { q: '¿Usa la misma tecnología que Biofinity normal?', a: 'Sí, la misma Aquaform Technology — la diferencia es únicamente el rango de graduación disponible, no el material ni la comodidad.' },
    { q: '¿Cómo sé si necesito la versión XR en vez de la normal?', a: 'Si tu receta indica una graduación fuera del rango estándar (muy alta miopía o hipermetropía), tu optometrista o nuestro equipo te lo puede confirmar.' },
    { q: '¿Tarda más en llegar?', a: 'Al ser de rango extendido, algunos parámetros específicos pueden requerir pedido especial — te confirmamos el tiempo exacto al hacer tu pedido.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual, igual que Biofinity estándar.' },
    { q: '¿Tiene versión para astigmatismo también en rango extendido?', a: 'Sí — Biofinity XR Toric, para astigmatismo con graduación fuera del rango estándar.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su cuidado diario.' },
  ],
  'clariti® 1 day': [
    { q: '¿Qué es WetLoc Technology?', a: 'Integra humedad permanentemente en la superficie del lente durante su fabricación, para confort constante durante el día de uso.' },
    { q: '¿Por qué es más económico que otros diarios de silicona hidrogel?', a: 'clariti fue la primera línea en ofrecer silicona hidrogel diaria a un precio más accesible — mantiene la alta transmisión de oxígeno de ese material sin el costo de líneas premium.' },
    { q: '¿Necesito solución de limpieza?', a: 'No — es un lente diario, se usa una vez y se desecha.' },
    { q: '¿Cuántos lentes trae la caja?', a: '30 lentes — un mes de uso diario.' },
    { q: '¿Tiene versión para astigmatismo o presbicia?', a: 'Sí — clariti 1 day toric corrige astigmatismo, y clariti 1 day multifocal corrige presbicia, ambas con la misma tecnología WetLoc.' },
    { q: '¿Es de CooperVision?', a: 'Sí, es parte de la familia de marcas CooperVision, junto con Biofinity, Avaira y Proclear.' },
    { q: '¿Es buena opción para uso ocasional?', a: 'Sí, al ser diario no desperdicias un par mensual en días que no uses lentes de contacto.' },
  ],
  'Proclear® Sphere': [
    { q: '¿Qué es PC Technology?', a: 'Una tecnología que imita la estructura de la membrana celular natural del ojo, atrayendo y reteniendo humedad de forma biomimética — pensada específicamente para comodidad en ojo seco.' },
    { q: '¿Es mejor que Biofinity para ojo seco?', a: 'Proclear fue diseñada específicamente para esa necesidad — si sientes resequedad con otras marcas, suele ser la primera opción a probar.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual — 6 lentes por caja, 3 meses de uso con el cuidado adecuado.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su limpieza y almacenamiento nocturno.' },
    { q: '¿Tiene versión para astigmatismo o presbicia?', a: 'La presbicia sí, con Proclear Multifocal (y su versión combinada Multifocal Toric). No tenemos actualmente una versión tórica pura de Proclear en catálogo.' },
    { q: '¿Es de CooperVision?', a: 'Sí, es parte de la familia CooperVision, con enfoque específico en comodidad para ojo seco.' },
    { q: '¿Qué pasa si tengo la graduación muy alta?', a: 'Consulta con nuestro equipo — Proclear tiene disponibilidad de rango extendido en su versión multifocal (Proclear Multifocal XR).' },
  ],
  'Biofinity® Multifocal': [
    { q: '¿Qué es Balanced Progressive Technology?', a: 'El diseño óptico de CooperVision que crea una transición suave entre las zonas de visión de lejos, media y cerca, sin saltos bruscos entre potencias.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual, igual que Biofinity esférico, con la misma tecnología Aquaform.' },
    { q: '¿Cuánto tiempo toma adaptarse?', a: 'La mayoría de las personas se adapta en 1-2 semanas mientras el cerebro aprende a usar las distintas zonas del lente.' },
    { q: '¿Qué intensidades maneja?', a: 'Varias, según tu nivel de presbicia (ADD) — tu optometrista lo indica en tu receta.' },
    { q: '¿Sirve si también tengo astigmatismo?', a: 'Este producto específico no corrige astigmatismo — para esos casos, Proclear Multifocal Toric sí combina ambas correcciones.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su cuidado diario.' },
    { q: '¿Es buena opción si nunca he usado multifocales?', a: 'Sí, es una de las líneas multifocales más recetadas del mundo — buen punto de partida si es tu primera vez.' },
  ],
  'clariti® 1 day multifocal': [
    { q: '¿Qué niveles de ADD maneja?', a: 'LOW, MED y HIGH — tu optometrista te indica cuál corresponde según tu nivel de presbicia.' },
    { q: '¿Necesito solución de limpieza?', a: 'No — es un lente diario, se usa una vez y se desecha.' },
    { q: '¿Es buena opción para empezar con multifocales?', a: 'Sí, al ser diario y más económica que otras opciones mensuales, es una forma de probar si te adaptas bien a los lentes multifocales antes de invertir en líneas premium.' },
    { q: '¿Qué es WetLoc Technology?', a: 'Integra humedad permanentemente en la superficie del lente, para confort constante durante el día.' },
    { q: '¿Cuánto tiempo toma adaptarse?', a: 'La mayoría de las personas se adapta en 1-2 semanas mientras el cerebro aprende a usar las distintas zonas del lente.' },
    { q: '¿Sirve si también tengo astigmatismo?', a: 'Este producto específico no corrige astigmatismo — escríbenos por WhatsApp para revisar otras opciones si lo necesitas.' },
    { q: '¿Cuántos lentes trae la caja?', a: '30 lentes — un mes de uso diario.' },
  ],
  'Proclear® Multifocal': [
    { q: '¿Qué es PC Technology en un multifocal?', a: 'La misma tecnología de Proclear Sphere (moléculas de fosfatidilcolina que retienen agua) aplicada a un diseño multifocal — buena opción si tienes presbicia y además ojo seco.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual — 6 lentes por caja.' },
    { q: '¿Qué intensidades maneja?', a: 'Varias, según tu nivel de presbicia — tu optometrista lo indica en tu receta.' },
    { q: '¿Es mejor que Biofinity Multifocal para ojo seco?', a: 'Sí, esa es su ventaja específica — retiene hasta 4 veces más agua que lentes convencionales, pensada para comodidad en ojo seco.' },
    { q: '¿Sirve si también tengo astigmatismo?', a: 'Sí — Proclear Multifocal Toric combina ambas correcciones en un mismo lente.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su cuidado diario.' },
    { q: '¿Qué pasa si mi graduación es muy alta?', a: 'Existe Proclear Multifocal XR para graduaciones fuera del rango estándar — consúltanos si es tu caso.' },
  ],
  'Proclear® Multifocal Toric': [
    { q: '¿Para quién es este lente específicamente?', a: 'Para quien necesita corregir presbicia Y astigmatismo al mismo tiempo — es de los pocos productos en el mercado que combina ambas correcciones en un mismo lente.' },
    { q: '¿Por qué es más caro que otros multifocales?', a: 'Combina dos correcciones complejas (multifocal + tórico) en un solo diseño, lo que requiere fabricación más especializada que un lente de una sola corrección.' },
    { q: '¿Qué datos de mi receta necesito?', a: 'Esfera, Cilindro, Eje y tu nivel de ADD (presbicia) — los cuatro valores son necesarios para este producto.' },
    { q: '¿Tarda más en llegar?', a: 'Sí, al ser una combinación de parámetros muy específica, normalmente requiere fabricación especial — te confirmamos el tiempo exacto al hacer tu pedido.' },
    { q: '¿Usa la misma tecnología que Proclear Multifocal?', a: 'Sí, PC Technology para hidratación, con el diseño adicional de estabilización tórica.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual — 6 lentes por caja.' },
    { q: '¿Hay alternativas más económicas si no necesito ambas correcciones?', a: 'Sí — si solo necesitas presbicia, Proclear Multifocal; si solo necesitas astigmatismo, revisa nuestras opciones tóricas puras.' },
  ],
  'Proclear® Multifocal XR': [
    { q: '¿Qué significa "XR" en este producto?', a: 'Extended Range — para quienes necesitan presbicia junto con una graduación esférica más alta de lo habitual, fuera del rango estándar.' },
    { q: '¿En qué se diferencia de Proclear Multifocal normal?', a: 'Misma tecnología PC Technology para hidratación — la diferencia es el rango de graduación esférica disponible.' },
    { q: '¿Cómo sé si necesito la versión XR?', a: 'Si tu receta indica una esfera fuera del rango estándar junto con tu nivel de ADD, tu optometrista o nuestro equipo te lo confirma.' },
    { q: '¿Tarda más en llegar?', a: 'Al ser de rango extendido, puede requerir pedido especial — te confirmamos el tiempo exacto al hacer tu pedido.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual — 6 lentes por caja.' },
    { q: '¿Sirve si también tengo astigmatismo?', a: 'Este producto no corrige astigmatismo — para esa combinación, Proclear Multifocal Toric es la opción (dentro de su propio rango de graduación).' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su cuidado diario.' },
  ],
  'Avaira Vitality® Toric': [
    { q: '¿Qué cilindros maneja?', a: '-0.75, -1.25, -1.75 y -2.25 — cubre astigmatismo leve a moderado.' },
    { q: '¿Qué es Optimized Toric Lens Geometry?', a: 'El sistema de estabilización que mantiene el lente en la posición correcta para tu eje de astigmatismo durante el parpadeo natural.' },
    { q: '¿En qué se diferencia de Biofinity Toric?', a: 'Misma familia tecnológica (Aquaform) — Avaira Vitality es la opción de entrada, más económica, de CooperVision.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual — 6 lentes por caja.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su limpieza y almacenamiento nocturno.' },
    { q: '¿Por qué puede tardar más en llegar?', a: 'Los tóricos con combinaciones específicas de cilindro y eje a veces requieren pedido especial — te confirmamos el tiempo exacto al hacer tu pedido.' },
    { q: '¿Tiene versión diaria?', a: 'No en esta línea — Avaira Vitality Toric es de reemplazo mensual.' },
  ],
  'Biofinity® Toric': [
    { q: '¿Qué cilindros maneja?', a: '-0.75, -1.25, -1.75 y -2.25, con ejes en incrementos de 10°.' },
    { q: '¿Qué es Optimized Toric Lens Geometry?', a: 'El sistema de estabilización de CooperVision que mantiene el lente orientado correctamente en tu eje de astigmatismo.' },
    { q: '¿Usa la misma tecnología que Biofinity esférico?', a: 'Sí, Aquaform Technology, con el diseño adicional de estabilización tórica.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual — 6 lentes por caja.' },
    { q: '¿Qué pasa si mi astigmatismo es muy alto?', a: 'Existe Biofinity XR Toric para graduaciones de astigmatismo fuera del rango estándar.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su cuidado diario.' },
    { q: '¿Por qué puede tardar más en llegar?', a: 'Los tóricos con combinaciones específicas de cilindro y eje a veces requieren pedido especial al fabricante.' },
  ],
  'Biofinity® XR Toric': [
    { q: '¿Qué significa "XR" en este producto?', a: 'Extended Range — para astigmatismo con graduación fuera del rango estándar que cubre Biofinity Toric normal.' },
    { q: '¿Usa la misma tecnología que Biofinity Toric?', a: 'Sí, Aquaform Technology y el mismo sistema de estabilización — la diferencia es el rango de graduación disponible.' },
    { q: '¿Por qué es más caro que Biofinity Toric normal?', a: 'Los parámetros de rango extendido requieren fabricación más especializada, disponible bajo pedido específico.' },
    { q: '¿Tarda más en llegar?', a: 'Sí, al ser de rango extendido normalmente requiere pedido especial al fabricante — te confirmamos el tiempo exacto al hacer tu pedido.' },
    { q: '¿Cómo sé si necesito esta versión?', a: 'Si tu receta indica un cilindro o esfera fuera del rango estándar, tu optometrista o nuestro equipo te lo confirma.' },
    { q: '¿Cada cuánto se reemplaza?', a: 'Mensual — 6 lentes por caja.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí, es mensual — necesita solución multipropósito para su cuidado diario.' },
  ],
  'clariti® 1 day toric': [
    { q: '¿Qué cilindros maneja?', a: '-0.75, -1.25, -1.75 y -2.25 — cubre astigmatismo leve a moderado.' },
    { q: '¿Por qué es más económico que otros tóricos diarios?', a: 'clariti fue el primer lente tórico diario de silicona hidrogel a precio accesible, manteniendo la alta transmisión de oxígeno de ese material.' },
    { q: '¿Necesito solución de limpieza?', a: 'No — es un lente diario, se usa una vez y se desecha.' },
    { q: '¿Qué es WetLoc Technology?', a: 'Integra humedad permanentemente en la superficie del lente para confort constante durante el día.' },
    { q: '¿Cuántos lentes trae la caja?', a: '30 lentes — un mes de uso diario.' },
    { q: '¿Es de CooperVision?', a: 'Sí, es parte de la familia clariti, junto con la versión esférica y multifocal.' },
    { q: '¿Por qué puede tardar más en llegar que un esférico?', a: 'Los tóricos con combinaciones específicas de cilindro y eje a veces requieren pedido especial al fabricante.' },
  ],
  'Dream Eye Solución': [
    { q: '¿Con qué lentes es compatible?', a: 'Está pensada para lentes blandos convencionales de hidrogel — verifica compatibilidad con tu optometrista si tus lentes son de silicona hidrogel (la mayoría del catálogo actual lo es).' },
    { q: '¿Qué tamaño trae?', a: '80ml por botella.' },
    { q: '¿Cada cuánto debo comprar una botella?', a: 'Depende de tu frecuencia de uso — como referencia, una botella de este tamaño suele durar 2-3 semanas de uso diario.' },
    { q: '¿Sirve para limpiar y guardar los lentes?', a: 'Sí, es multipropósito — limpia, enjuaga y almacena en un solo paso dentro del estuche.' },
    { q: '¿Puedo usarla con Biofinity o Acuvue?', a: 'Esas marcas son de silicona hidrogel — te recomendamos confirmar compatibilidad con tu optometrista, o usar Opti-Free Puremoist, que sí está confirmada para todas las marcas de nuestro catálogo.' },
    { q: '¿Puedo reutilizar la solución del día anterior?', a: 'No — siempre vacía el estuche y usa solución nueva cada noche para reducir el riesgo de irritación e infección.' },
    { q: '¿Sirve para lentes diarios?', a: 'No es necesaria — los lentes diarios se desechan cada día y no requieren solución de limpieza.' },
  ],
  'Prolub Hyfresh Solución Multipropósito': [
    { q: '¿Con qué lentes es compatible?', a: 'Está formulada para lentes blandos de hidrogel — no está indicada para silicona hidrogel sin verificar antes con tu optometrista, ya que la mayoría de nuestro catálogo actual es de ese material.' },
    { q: '¿Qué tamaño trae?', a: '60ml por botella.' },
    { q: '¿Qué la hace distinta de Opti-Free?', a: 'Prolub es una fórmula de alta hidratación pensada para hidrogel convencional; Opti-Free Puremoist está confirmada como compatible con todas las marcas de nuestro catálogo, incluida silicona hidrogel.' },
    { q: '¿Sirve para limpiar y guardar los lentes?', a: 'Sí, es multipropósito — limpieza, enjuague y almacenamiento en un solo paso.' },
    { q: '¿Cuál solución me recomiendan si no sé qué material tienen mis lentes?', a: 'Opti-Free Puremoist es la opción más segura por ser compatible con prácticamente cualquier marca — escríbenos si tienes dudas sobre tu lente específico.' },
    { q: '¿Puedo reutilizar la solución del día anterior?', a: 'No — siempre vacía el estuche y usa solución nueva cada noche.' },
    { q: '¿Sirve para lentes diarios?', a: 'No es necesaria — los lentes diarios se desechan cada día.' },
  ],
  'Sprainer Solución Espumosa': [
    { q: '¿Sirve para guardar los lentes durante la noche?', a: 'No — es exclusivamente un limpiador de superficie. No debe usarse como solución de almacenamiento ni para enjuague previo a la inserción.' },
    { q: '¿Para qué tipo de lentes es?', a: 'Es apta para lentes rígidas permeables al gas (RPG). Para lentes blandos, consulta con tu optómetra antes de usarla.' },
    { q: '¿Cómo se usa correctamente?', a: 'Se aplica directamente sobre el lente para limpieza de superficie, y luego se enjuaga con una solución multipropósito antes de guardar o insertar el lente.' },
    { q: '¿Puedo usarla en vez de Opti-Free?', a: 'No — cumplen funciones distintas. Sprainer limpia la superficie; necesitas además una solución multipropósito para desinfección y almacenamiento.' },
    { q: '¿Qué tamaño trae?', a: 'Frasco único — consulta el contenido exacto al momento de tu pedido.' },
    { q: '¿La mayoría de nuestros clientes la usan?', a: 'Es un producto más especializado, usado principalmente por quienes tienen lentes RPG o buscan limpieza profunda adicional a su rutina habitual.' },
    { q: '¿Es segura para uso diario?', a: 'Sigue siempre las instrucciones del empaque y las indicaciones de tu optómetra — su uso está pensado como complemento, no como reemplazo de tu solución multipropósito habitual.' },
  ],
}

const FAQS_BY_TYPE: Record<string, { q: string; a: string }[]> = {
  esferico: [
    { q: '¿Cuánto tiempo puedo usar estos lentes?', a: 'Depende del tipo: diarios se descartan cada día, quincenales cada 2 semanas, mensuales cada 30 días. Nunca uses más allá del tiempo recomendado.' },
    { q: '¿Puedo dormir con los lentes puestos?', a: 'No se recomienda dormir con lentes de contacto a menos que sean específicamente aprobados para uso extendido. Consulta con tu optometrista.' },
    { q: '¿Necesito solución de limpieza?', a: 'Sí para lentes quincenales y mensuales. Los lentes diarios no requieren solución ya que se descartan cada día.' },
    { q: '¿Los lentes son para miopía e hipermetropía?', a: 'Sí, los lentes esféricos corrigen tanto miopía (valores negativos) como hipermetropía (valores positivos). Los valores van del -12.00 al +8.00 según el producto.' },
  ],
  torico: [
    { q: '¿Por qué los lentes tóricos tardan más en llegar?', a: 'Los lentes tóricos se fabrican a medida según tu graduación específica (Esfera, Cilindro y Eje). Este proceso toma 20-30 días, a diferencia de los esféricos que enviamos desde inventario.' },
    { q: '¿Qué diferencia hay entre lentes tóricos y esféricos?', a: 'Los lentes tóricos tienen una curvatura especial que corrige el astigmatismo. Tienen un diseño estabilizado para que no roten con el parpadeo, manteniendo la visión nítida.' },
    { q: '¿Qué información de mi receta necesito?', a: 'Para lentes tóricos necesitas la Esfera, el Cilindro y el Eje de tu receta. Estos tres valores son obligatorios y aparecen en cualquier receta óptica.' },
    { q: '¿Puedo usar lentes tóricos si tengo astigmatismo leve?', a: 'Sí, los lentes tóricos están disponibles desde -0.75 de cilindro. Para astigmatismo leve suelen ser muy efectivos.' },
  ],
  multifocal: [
    { q: '¿Para qué edad son los lentes multifocales?', a: 'Son para personas con presbicia, generalmente a partir de los 40-45 años. Permiten ver bien de cerca, a distancia media y de lejos sin necesitar gafas.' },
    { q: '¿Cuánto tiempo tarda la adaptación?', a: 'La mayoría de las personas se adapta en 1-2 semanas. Tu cerebro aprende a usar las diferentes zonas del lente automáticamente.' },
    { q: '¿Qué es el valor ADD de mi receta?', a: 'La adición (ADD) indica la potencia adicional para ver de cerca. Varía de +0.75 a +4.00 dependiendo de tu prescripción. Tu optometrista lo incluirá en tu receta.' },
    { q: '¿Siguen necesitando gafas de lectura?', a: 'La mayoría de los usuarios de lentes multifocales no necesitan gafas de lectura para actividades cotidianas, aunque en condiciones de poca luz puede ser necesario.' },
  ],
  color: [
    { q: '¿Puedo pedir lentes de color sin graduación?', a: 'Sí, disponemos de lentes de color con plano (sin graduación) para quienes solo desean cambiar el color de sus ojos sin corrección visual.' },
    { q: '¿Los colores se ven naturales?', a: 'Sí, especialmente los diseños tri-capa como FreshLook Colorblends y Air Optix Colors. Tienen múltiples tonos que imitan la apariencia natural del iris.' },
    { q: '¿Es seguro usar lentes de color?', a: 'Sí, siempre que sean de marca certificada y se usen correctamente. Evita lentes de colores de vendedores no autorizados ya que pueden causar daño ocular.' },
    { q: '¿Cuánto duran los lentes de color?', a: 'Los lentes de color de nuestro catálogo son de reemplazo mensual — duran 30 días de uso con el cuidado adecuado.' },
  ],
  solucion: [
    { q: '¿Cuál es la diferencia entre las soluciones multipropósito?', a: 'Todas limpian, enjuagan, desinfectan y conservan tus lentes. Las diferencias están en la fórmula de hidratación y compatibilidad con distintos materiales de silicona hidrogel.' },
    { q: '¿Puedo usar cualquier solución con mis lentes?', a: 'En general sí, pero verifica que sea compatible con lentes de silicona hidrogel si tus lentes son de ese material. Consulta las instrucciones del fabricante.' },
    { q: '¿Cada cuánto tiempo debo cambiar la solución del estuche?', a: 'Cambia la solución del estuche cada vez que uses tus lentes — nunca reutilices la solución del día anterior para evitar infecciones.' },
    { q: '¿Cada cuánto tiempo debo comprar solución?', a: 'Una botella estándar de 300-360ml dura aproximadamente 2-3 meses con uso diario. Te enviaremos un recordatorio cuando esté por terminarse.' },
  ],
  gota: [
    { q: '¿Puedo usar gotas mientras tengo los lentes puestos?', a: 'Solo las gotas específicamente formuladas para lentes de contacto (como Prolub Ofteno, Systane Ultra). Verifica siempre la indicación en el empaque.' },
    { q: '¿Con qué frecuencia debo aplicar las gotas?', a: 'Depende del producto. Las gotas lubricantes suelen aplicarse 2-4 veces al día según necesidad. Sigue las instrucciones del fabricante o de tu médico.' },
    { q: '¿Las gotas pueden reemplazar el parpadeo?', a: 'Las gotas complementan la lubricación natural pero no la reemplazan. Si tienes ojo seco severo, consulta con un oftalmólogo para un tratamiento adecuado.' },
    { q: '¿Cada cuánto tiempo debo comprar gotas?', a: 'Un frasco de 10ml dura aproximadamente 30 días con uso regular. Te enviaremos un recordatorio automático cuando sea hora de reponer.' },
  ],
}

const FAQS_GENERAL = [
  { q: '¿Hacen envíos a toda República Dominicana?', a: 'Sí. Santo Domingo y Santiago en 24-48h. Resto del país en 2-3 días hábiles. Los lentes tóricos tardan 20-30 días por fabricación a medida.' },
  { q: '¿Los productos son directo del fabricante?', a: 'Sí. Todos los productos de ContactGo son directo del fabricante, directo del fabricante y con código de autenticidad. Nunca vendemos imitaciones.' },
  { q: '¿Puedo devolver mi pedido?', a: 'Sí, en 30 días si el producto viene defectuoso o no es lo que pediste. Los lentes sin abrir y en su empaque original también son elegibles para devolución.' },
]

export default function ProductFAQ({ tipo, nombre }: { tipo: string; nombre: string }) {
  const [open, setOpen] = useState<number | null>(null)
  // Prioridad: FAQ propia del producto (si existe) → FAQ de su categoría
  // como respaldo. Así un producto sin FAQ propia todavía no se queda sin
  // nada, mientras se van agregando las específicas una por una.
  const propias = FAQS_BY_PRODUCT[nombre] ?? []
  const faqs = [...propias, ...(FAQS_BY_TYPE[tipo] ?? []), ...FAQS_GENERAL]
  if (!faqs.length) return null

  return (
    <section className="max-w-6xl mx-auto px-4 pb-10 border-t border-gray-100 pt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
          <span className="text-sm">❓</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Preguntas frecuentes</h3>
          <p className="text-xs text-gray-400">Sobre {nombre}</p>
        </div>
      </div>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i}
            className={`border rounded-2xl overflow-hidden transition-colors ${open === i ? 'border-primary-200 bg-teal-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left gap-3">
              <span className={`font-semibold text-sm leading-snug transition-colors ${open === i ? 'text-primary-700' : 'text-gray-900'}`}>
                {faq.q}
              </span>
              <ChevronRight className={`w-4 h-4 shrink-0 transition-all duration-200 ${open === i ? 'rotate-90 text-primary-500' : 'text-gray-300'}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-5">
                <div className="w-full h-px bg-teal-50 mb-3" />
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
