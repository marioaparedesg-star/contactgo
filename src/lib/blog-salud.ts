import type { BlogMeta } from '@/components/blog/BlogArticle'
export type HealthArticle = BlogMeta & { keyword: string; intro: string; sections: { h: string; p1: string; p2: string }[]; sources: { url: string; label: string }[] }
export const HEALTH_ARTICLES: HealthArticle[] = [
  {
    "slug": "queratitis-infecciosa-lentes-contacto-sintomas-prevencion",
    "title": "Queratitis infecciosa por lentes de contacto: síntomas y prevención",
    "desc": "Qué es la queratitis microbiana, cómo reconocer señales de alarma y qué hábitos reducen el riesgo.",
    "keyword": "queratitis infecciosa lentes contacto sintomas prevencion",
    "intro": "La queratitis infecciosa afecta la córnea, la superficie transparente del ojo. En usuarios de lentes puede avanzar con rapidez y comprometer la visión. No todo ojo rojo es una infección, pero dolor, fotofobia o visión borrosa nunca deben normalizarse.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Puede ser causada por bacterias, hongos, virus o parásitos. Dormir con lentes, prolongar su uso, reutilizar solución y una higiene deficiente pueden aumentar el riesgo.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Dolor, enrojecimiento inusual, visión borrosa, sensibilidad a la luz, lagrimeo o secreción requieren atención. El diagnóstico no se confirma en casa; el especialista examina la córnea y decide si necesita pruebas.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Retira los lentes y contacta de inmediato a un profesional. No uses antibióticos, esteroides ni remedios caseros por tu cuenta. Si hay dolor intenso o cambios de visión, busca atención urgente el mismo día.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Respeta el calendario de reemplazo, lávate y sécate las manos, usa solución fresca y mantén los lentes lejos del agua. No duermas con ellos salvo indicación expresa.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "solucion-limpieza-lentes-contacto",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/causes/index.html",
        "label": "CDC: causas de infecciones relacionadas con lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      },
      {
        "url": "https://www.aao.org/salud-ocular/consejos/contact-lens-related-eye-infections",
        "label": "Academia Americana de Oftalmología: infecciones oculares por lentes"
      }
    ]
  },
  {
    "slug": "queratitis-bacteriana-lentes-contacto-senales-riesgo",
    "title": "Queratitis bacteriana y lentes de contacto: señales que no debes ignorar",
    "desc": "Cómo se presenta una infección bacteriana de la córnea, sus factores de riesgo y por qué necesita valoración rápida.",
    "keyword": "queratitis bacteriana lentes contacto senales riesgo",
    "intro": "La queratitis bacteriana es una infección de la córnea causada por bacterias. Un ojo doloroso y rojo en una persona que usa lentes no debe atribuirse automáticamente a sequedad o cansancio.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Las bacterias pueden llegar a la córnea por lentes o estuches contaminados, higiene deficiente, uso nocturno o solución reutilizada. Un lente puede parecer limpio y aun así estar contaminado.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Dolor ocular, ojo rojo, visión borrosa, sensibilidad a la luz, lagrimeo y secreción son señales frecuentes. El aspecto del ojo no permite identificar el microorganismo.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Retira el lente y no lo vuelvas a usar. Contacta al oftalmólogo sin demora. No frotes el ojo ni apliques medicamentos sobrantes; el tratamiento depende del diagnóstico.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Lávate las manos, utiliza solución nueva, no uses agua o saliva y nunca rellenes solución vieja con nueva. Respeta el tiempo de reemplazo.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/causes/index.html",
        "label": "CDC: causas de infecciones relacionadas con lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      },
      {
        "url": "https://www.aao.org/salud-ocular/consejos/contact-lens-related-eye-infections",
        "label": "Academia Americana de Oftalmología: infecciones oculares por lentes"
      }
    ]
  },
  {
    "slug": "acanthamoeba-queratitis-agua-lentes-contacto",
    "title": "Acanthamoeba y lentes de contacto: por qué el agua es peligrosa",
    "desc": "Qué es la queratitis por Acanthamoeba, cómo se relaciona con el agua y cómo proteger tus ojos.",
    "keyword": "acanthamoeba queratitis agua lentes contacto",
    "intro": "Acanthamoeba es un microorganismo presente en distintas fuentes de agua y suelo. En raras ocasiones infecta la córnea y causa queratitis, una enfermedad poco frecuente pero potencialmente grave y difícil de tratar.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Puede encontrarse en agua del grifo, piscinas, lagos y jacuzzis. Ducharse, nadar o guardar lentes en agua son exposiciones evitables; el agua también puede deformar los lentes blandos y favorecer lesiones.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Puede causar dolor, enrojecimiento, lagrimeo, fotofobia y visión borrosa. Los síntomas se parecen a otras queratitis y no permiten identificar el parásito en casa.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Retira el lente. Si hay síntomas, no lo reutilices y solicita evaluación inmediata. No intentes desinfectarlo con métodos caseros ni uses agua embotellada para enjuagarlo.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Quítate los lentes antes de ducharte, nadar o entrar en jacuzzis. Si necesitas ver en el agua, consulta por gafas de natación graduadas.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "solucion-limpieza-lentes-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/about/healthy-habits-keeping-water-away-from-contact-lenses.html",
        "label": "CDC: mantener los lentes lejos del agua"
      },
      {
        "url": "https://www.cdc.gov/acanthamoeba/about/about-acanthamoeba-keratitis.html",
        "label": "CDC: queratitis por Acanthamoeba"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      }
    ]
  },
  {
    "slug": "queratitis-hongos-lentes-contacto-infeccion-fungica",
    "title": "Queratitis por hongos: una infección corneal que requiere diagnóstico",
    "desc": "Qué es la queratitis fúngica, sus posibles factores de riesgo y por qué no debe tratarse como irritación común.",
    "keyword": "queratitis hongos lentes contacto infeccion fungica",
    "intro": "La queratitis fúngica es una infección de la córnea causada por hongos. Puede parecerse a otras formas de queratitis, por lo que el aspecto del ojo no basta para identificar la causa.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Los hongos pueden afectar el tejido corneal. Las lesiones oculares, ciertas condiciones de salud y el cuidado incorrecto de lentes son aspectos que el profesional puede investigar.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Dolor, ojo rojo, lagrimeo, fotofobia, secreción y visión borrosa justifican suspender los lentes y consultar de inmediato. El diagnóstico puede requerir examen especializado y muestras.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "No uses antibióticos sobrantes, esteroides ni remedios caseros. Los tratamientos para hongos no son intercambiables con otros medicamentos; el manejo debe indicarlo el especialista.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Respeta la limpieza, desinfección y reemplazo. Mantén el estuche limpio y evita agua o soluciones improvisadas.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "solucion-limpieza-lentes-contacto",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/causes/index.html",
        "label": "CDC: causas de infecciones relacionadas con lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      },
      {
        "url": "https://www.aao.org/salud-ocular/consejos/contact-lens-related-eye-infections",
        "label": "Academia Americana de Oftalmología: infecciones oculares por lentes"
      }
    ]
  },
  {
    "slug": "queratitis-herpetica-herpes-simplex-lentes-contacto",
    "title": "Herpes ocular y lentes de contacto: cuidados y señales de alerta",
    "desc": "Qué relación existe entre el herpes simple y la córnea, cómo reconocer síntomas y cuándo suspender los lentes.",
    "keyword": "queratitis herpetica herpes simplex lentes contacto",
    "intro": "El virus del herpes simple puede afectar la córnea. Una queratitis herpética requiere evaluación oftalmológica y no debe confundirse automáticamente con alergia o irritación por el material.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Tener herpes labial no significa que exista una infección ocular. La valoración depende de los síntomas, el examen y la historia médica de cada persona.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Puede haber ojo rojo, dolor, lagrimeo, sensibilidad a la luz y visión borrosa. Estos síntomas en usuarios de lentes justifican retirarlos y solicitar atención rápida.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "No uses lentes durante un episodio activo salvo indicación expresa. No te automediques con gotas antivirales, antibióticas o esteroides.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "El regreso depende de que la infección esté controlada y la superficie ocular recuperada. El especialista debe autorizar cuándo retomar el uso.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/causes/index.html",
        "label": "CDC: causas de infecciones relacionadas con lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      },
      {
        "url": "https://www.aao.org/salud-ocular/consejos/contact-lens-related-eye-infections",
        "label": "Academia Americana de Oftalmología: infecciones oculares por lentes"
      }
    ]
  },
  {
    "slug": "ulcera-corneal-lentes-contacto-sintomas-urgencia",
    "title": "Úlcera corneal por lentes de contacto: síntomas y atención urgente",
    "desc": "Cómo se forma una úlcera en la córnea, qué señales pueden acompañarla y por qué no conviene esperar.",
    "keyword": "ulcera corneal lentes contacto sintomas urgencia",
    "intro": "Una úlcera corneal es una lesión abierta en la superficie de la córnea que con frecuencia está relacionada con una infección. En usuarios de lentes puede desarrollarse rápidamente y comprometer la visión.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "La pérdida de tejido superficial puede acompañarse de inflamación e infección. La gravedad depende de la causa, profundidad y ubicación.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Dolor, enrojecimiento, fotofobia, lagrimeo, secreción y visión borrosa requieren atención inmediata. No esperes a ver una mancha blanca para consultar.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Retira los lentes y acude a un oftalmólogo el mismo día. No uses gotas anestésicas, antibióticos sobrantes, esteroides ni remedios caseros.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Evita dormir con lentes salvo indicación, utiliza solución fresca, mantén los lentes lejos del agua y respeta el reemplazo. No los retomes hasta recibir autorización.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "solucion-limpieza-lentes-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/causes/index.html",
        "label": "CDC: causas de infecciones relacionadas con lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      },
      {
        "url": "https://www.aao.org/salud-ocular/consejos/contact-lens-related-eye-infections",
        "label": "Academia Americana de Oftalmología: infecciones oculares por lentes"
      }
    ]
  },
  {
    "slug": "abrasion-cornea-lentes-contacto-rayadura-ojo",
    "title": "Rasguño en la córnea por lentes de contacto: qué hacer",
    "desc": "Cómo reconocer una posible abrasión corneal y cuándo necesitas atención oftalmológica.",
    "keyword": "abrasion cornea lentes contacto rayadura ojo",
    "intro": "La abrasión corneal es un raspón en la capa superficial de la córnea. Puede ocurrir por un cuerpo extraño, una uña, manipulación brusca o un lente deteriorado. En usuarios de lentes debe tomarse en serio porque una lesión puede facilitar una infección.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Un lente roto, una partícula atrapada o frotarse el ojo puede lesionar la superficie. No intentes raspar ni retirar con pinzas una partícula adherida.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Puede provocar dolor, sensación de cuerpo extraño, lagrimeo, enrojecimiento y sensibilidad a la luz. Sus síntomas se parecen a los de una infección corneal.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Retira el lente si puedes hacerlo sin forzar. No lo vuelvas a colocar, no frotes el ojo y busca evaluación. Evita gotas anestésicas o remedios caseros.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Inspecciona el lente antes de colocarlo, respeta su fecha de reemplazo y evita manipularlo con uñas largas u objetos. Nunca uses lentes dañados.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "solucion-limpieza-lentes-contacto",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/causes/index.html",
        "label": "CDC: causas de infecciones relacionadas con lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      },
      {
        "url": "https://www.aao.org/salud-ocular/consejos/contact-lens-related-eye-infections",
        "label": "Academia Americana de Oftalmología: infecciones oculares por lentes"
      }
    ]
  },
  {
    "slug": "clare-ojo-rojo-agudo-lentes-contacto",
    "title": "CLARE: ojo rojo agudo asociado al uso de lentes de contacto",
    "desc": "Qué significa CLARE, cómo puede manifestarse y por qué requiere evaluación profesional.",
    "keyword": "clare ojo rojo agudo lentes contacto",
    "intro": "CLARE significa Contact Lens-induced Acute Red Eye: una reacción inflamatoria aguda asociada al uso de lentes. Puede presentarse con enrojecimiento y molestias, a veces después de dormir con ellos. Otras infecciones pueden parecerse, por lo que el diagnóstico es clínico.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "La exposición prolongada y los depósitos pueden contribuir. Dormir con lentes aumenta riesgos y debe evitarse salvo que el profesional haya indicado expresamente ese régimen.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Puede haber ojo rojo, lagrimeo, molestia y sensibilidad. Dolor importante, visión borrosa, fotofobia intensa o secreción pueden indicar una infección diferente.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Retira los lentes y no los vuelvas a colocar hasta recibir orientación. No uses gotas antibióticas, esteroides ni productos para quitar el enrojecimiento sin receta.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Respeta el horario y reemplazo, no duermas con lentes sin indicación, limpia según el sistema y evita reutilizar solución.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/causes/index.html",
        "label": "CDC: causas de infecciones relacionadas con lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      },
      {
        "url": "https://www.aao.org/salud-ocular/consejos/contact-lens-related-eye-infections",
        "label": "Academia Americana de Oftalmología: infecciones oculares por lentes"
      }
    ]
  },
  {
    "slug": "conjuntivitis-papilar-gigante-lentes-contacto",
    "title": "Conjuntivitis papilar gigante: una reacción relacionada con lentes",
    "desc": "Síntomas, causas y manejo de la conjuntivitis papilar gigante en usuarios de lentes.",
    "keyword": "conjuntivitis papilar gigante lentes contacto",
    "intro": "La conjuntivitis papilar gigante es una reacción inflamatoria de la superficie interna del párpado. Puede relacionarse con lentes y depósitos acumulados. Necesita evaluación para diferenciarla de alergias e infecciones.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Pueden aparecer papilas en la conjuntiva que recubre el párpado superior. La fricción del lente y la respuesta inflamatoria contribuyen; los depósitos y la limpieza insuficiente son factores que el profesional revisará.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Picazón, mucosidad, sensación de lente móvil e incomodidad creciente pueden presentarse. Dolor, sensibilidad marcada a la luz o visión borrosa obligan a descartar problemas corneales.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "El diagnóstico se realiza examinando el párpado y la superficie ocular. El especialista puede indicar pausa, cambios de cuidado o ajustes; no uses esteroides por cuenta propia.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Cumple el calendario de reemplazo y limpia según las instrucciones. Si la picazón o mucosidad regresa, solicita una revisión.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "solucion-limpieza-lentes-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/causes/index.html",
        "label": "CDC: causas de infecciones relacionadas con lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      },
      {
        "url": "https://www.aao.org/salud-ocular/consejos/contact-lens-related-eye-infections",
        "label": "Academia Americana de Oftalmología: infecciones oculares por lentes"
      }
    ]
  },
  {
    "slug": "infiltrados-corneales-lentes-contacto-que-son",
    "title": "Infiltrados corneales en usuarios de lentes: qué significan",
    "desc": "Qué son los infiltrados corneales, por qué pueden aparecer y cómo se diferencian de una infección.",
    "keyword": "infiltrados corneales lentes contacto que son",
    "intro": "Los infiltrados corneales son acumulaciones de células inflamatorias dentro de la córnea. Pueden aparecer en situaciones inflamatorias y también infecciosas. En usuarios de lentes no deben interpretarse sin un examen.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Son áreas de respuesta inflamatoria que el profesional observa durante el examen. No equivalen automáticamente a infección, pero pueden acompañar procesos que necesitan tratamiento.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Algunas personas presentan ojo rojo, molestia, lagrimeo o sensibilidad a la luz. Dolor, secreción, fotofobia o visión borrosa aumentan la preocupación por infección.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "El examen con lámpara de hendidura permite observar la lesión. No uses gotas con esteroides o antibióticos sin diagnóstico; algunas lesiones requieren vigilancia estrecha.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Evita dormir con lentes salvo indicación, no prolongues el reemplazo y retoma los lentes solo cuando el profesional lo autorice.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "solucion-limpieza-lentes-contacto",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/causes/index.html",
        "label": "CDC: causas de infecciones relacionadas con lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      },
      {
        "url": "https://www.aao.org/salud-ocular/consejos/contact-lens-related-eye-infections",
        "label": "Academia Americana de Oftalmología: infecciones oculares por lentes"
      }
    ]
  },
  {
    "slug": "neovascularizacion-corneal-lentes-contacto-oxigeno",
    "title": "Vasos sanguíneos en la córnea por lentes: neovascularización",
    "desc": "Qué es la neovascularización corneal, cómo se relaciona con el oxígeno y por qué requiere controles.",
    "keyword": "neovascularizacion corneal lentes contacto oxigeno",
    "intro": "La córnea normalmente es transparente y no tiene vasos sanguíneos en su zona central. La neovascularización ocurre cuando crecen vasos desde la periferia hacia la córnea. En algunos usuarios puede relacionarse con oxigenación insuficiente.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "La córnea obtiene oxígeno principalmente del aire. El material, grosor, ajuste, horas de uso y hábitos nocturnos pueden influir. No se diagnostica por el aspecto del ojo en casa.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "En etapas iniciales puede no producir molestias. Algunas personas notan irritación o enrojecimiento, pero la ausencia de síntomas no descarta cambios corneales.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "El especialista revisa la córnea y puede recomendar cambios de material, ajuste o tiempo de uso. No compres otro lente por publicidad sin una nueva adaptación.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "No duermas con lentes salvo indicación, respeta el tiempo de uso y comunica cambios de comodidad o visión.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/causes/index.html",
        "label": "CDC: causas de infecciones relacionadas con lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      },
      {
        "url": "https://www.aao.org/salud-ocular/consejos/contact-lens-related-eye-infections",
        "label": "Academia Americana de Oftalmología: infecciones oculares por lentes"
      }
    ]
  },
  {
    "slug": "hipoxia-corneal-lentes-contacto-falta-oxigeno",
    "title": "Hipoxia corneal por lentes de contacto: qué ocurre cuando falta oxígeno",
    "desc": "Explicación de la hipoxia corneal, sus factores asociados y cómo el ajuste y el tiempo de uso influyen.",
    "keyword": "hipoxia corneal lentes contacto falta oxigeno",
    "intro": "La hipoxia corneal es una disponibilidad insuficiente de oxígeno para las necesidades del tejido. Algunos lentes reducen el paso de oxígeno hacia la córnea, especialmente si se usan demasiado tiempo o no son adecuados para el ojo.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "La permeabilidad del material, el grosor, el ajuste y las horas de uso interactúan. No basta con elegir un producto que anuncie alta transmisión de oxígeno.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "La hipoxia puede asociarse con edema corneal, cambios de superficie y crecimiento de vasos. Visión empañada o incomodidad no son diagnósticos por sí solos.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "El profesional revisa la córnea, el ajuste, el material y el régimen. No cambies de lente por publicidad: un material adecuado para otra persona puede no ser correcto para tu córnea.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Respeta el tiempo indicado, evita dormir con lentes salvo prescripción y asiste a controles.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "solucion-limpieza-lentes-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/causes/index.html",
        "label": "CDC: causas de infecciones relacionadas con lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      },
      {
        "url": "https://www.aao.org/salud-ocular/consejos/contact-lens-related-eye-infections",
        "label": "Academia Americana de Oftalmología: infecciones oculares por lentes"
      }
    ]
  },
  {
    "slug": "edema-corneal-lentes-contacto-vision-borrosa",
    "title": "Edema corneal y lentes de contacto: por qué puede nublarse la visión",
    "desc": "Qué es la hinchazón de la córnea, cómo puede relacionarse con lentes y cuándo debes consultar.",
    "keyword": "edema corneal lentes contacto vision borrosa",
    "intro": "El edema corneal es acumulación de líquido dentro de la córnea que puede alterar su transparencia. En usuarios de lentes puede relacionarse con oxigenación insuficiente o condiciones oculares previas.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Cuando se acumula líquido, el tejido se hincha y puede dispersar la luz. El uso prolongado o un ajuste inadecuado pueden contribuir, pero existen otras causas.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Puede presentarse visión empañada, halos, molestia y sensibilidad. Si la visión cambia súbitamente, hay dolor, ojo rojo o fotofobia, retira los lentes y busca atención inmediata.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "El oftalmólogo examina la córnea y determina la causa. No intentes corregirlo cambiando de marca ni usando gotas por tu cuenta.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Respeta el tiempo de uso y reemplazo, no duermas con lentes sin indicación y no los retomes hasta recibir autorización si te diagnostican edema.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Salud ocular",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "solucion-limpieza-lentes-contacto",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.cdc.gov/contact-lenses/causes/index.html",
        "label": "CDC: causas de infecciones relacionadas con lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-risks",
        "label": "FDA: riesgos de los lentes de contacto"
      },
      {
        "url": "https://www.aao.org/salud-ocular/consejos/contact-lens-related-eye-infections",
        "label": "Academia Americana de Oftalmología: infecciones oculares por lentes"
      }
    ]
  },
  {
    "slug": "toxicidad-solucion-lentes-contacto-irritacion",
    "title": "Irritación por solución de lentes de contacto: toxicidad y errores",
    "desc": "Cómo una solución inadecuada, vencida o mal utilizada puede irritar los ojos y qué pasos seguir.",
    "keyword": "toxicidad solucion lentes contacto irritacion",
    "intro": "No todas las molestias al colocar un lente provienen del lente. Una solución mal utilizada, vencida o incompatible puede provocar irritación y otros problemas. Debe usarse exactamente según sus instrucciones.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Las soluciones tienen formulaciones distintas. Los sistemas de peróxido requieren un estuche especial y tiempo de neutralización; nunca deben ponerse directamente en el ojo.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Ardor intenso, dolor, enrojecimiento, lagrimeo, fotofobia o visión borrosa después de manipular lentes justifican retirarlos y buscar orientación.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "No mezcles sistemas, no uses solución vencida, no rellenes el frasco y no reutilices el líquido. Si el peróxido entra al ojo, sigue la etiqueta de emergencia y contacta salud.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Consulta qué solución corresponde a tu lente. Si la irritación se repite, suspende el producto y conversa con el especialista antes de probar otro.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Cuidado",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-solutions-and-products",
        "label": "FDA: soluciones y productos para lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/consumer-products/contact-lenses",
        "label": "FDA: cuidado de lentes de contacto"
      },
      {
        "url": "https://www.cdc.gov/contact-lenses/prevention/index.html",
        "label": "CDC: prevención de infecciones"
      }
    ]
  },
  {
    "slug": "alergia-conservantes-solucion-lentes-contacto",
    "title": "¿Alergia a la solución de lentes? Conservantes e irritación ocular",
    "desc": "Diferencias entre sensibilidad, alergia e infección cuando aparecen molestias al usar solución.",
    "keyword": "alergia conservantes solucion lentes contacto",
    "intro": "Picazón o ardor después de limpiar los lentes puede hacer pensar en alergia a la solución. También puede deberse a sequedad, irritación, mala neutralización o infección. Identificar la causa requiere evaluación.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Una reacción irritativa puede aparecer por residuos o por una formulación que no toleras. Una alergia es una respuesta inmunológica y no se confirma únicamente por ardor.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "La picazón puede asociarse a alergia, mientras que dolor, fotofobia, secreción o visión borrosa obligan a descartar problemas más serios.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Retira los lentes si hay irritación y no los vuelvas a colocar mientras persistan síntomas sin orientación. Lleva a consulta el nombre de la solución y el tipo de lente.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Usa soluciones compatibles y respeta los tiempos de desinfección. Un cambio de sistema debe hacerse con orientación profesional.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Cuidado",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "solucion-limpieza-lentes-contacto"
    ],
    "sources": [
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-solutions-and-products",
        "label": "FDA: soluciones y productos para lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/consumer-products/contact-lenses",
        "label": "FDA: cuidado de lentes de contacto"
      },
      {
        "url": "https://www.cdc.gov/contact-lenses/prevention/index.html",
        "label": "CDC: prevención de infecciones"
      }
    ]
  },
  {
    "slug": "biofilm-estuche-lentes-contacto-contaminacion",
    "title": "Biofilm en el estuche de lentes de contacto: contaminación invisible",
    "desc": "Qué es el biofilm, cómo puede acumularse en el estuche y qué hábitos reducen la contaminación.",
    "keyword": "biofilm estuche lentes contacto contaminacion",
    "intro": "El estuche puede convertirse en reservorio de microorganismos cuando se cuida incorrectamente. Algunos forman biofilms, comunidades adheridas a una superficie difíciles de eliminar. Un estuche que parece limpio no necesariamente está libre de contaminación.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Un biofilm es una comunidad de microorganismos adherida a una superficie y rodeada por una matriz. Puede desarrollarse si hay humedad y prácticas de higiene deficientes.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Rellenar solución usada con nueva, guardar el estuche húmedo, enjuagarlo con agua y prolongar su uso son prácticas que deben evitarse.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Desecha la solución usada. Limpia el estuche según sus instrucciones, usando solución para lentes y no agua; deja secar con tapas retiradas. Reemplázalo al menos cada tres meses o antes si se daña.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "No uses agua, saliva ni jabón doméstico. Si aparece ojo rojo, dolor, secreción, fotofobia o visión borrosa, retira los lentes y busca evaluación.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Cuidado",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "solucion-limpieza-lentes-contacto",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-solutions-and-products",
        "label": "FDA: soluciones y productos para lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/consumer-products/contact-lenses",
        "label": "FDA: cuidado de lentes de contacto"
      },
      {
        "url": "https://www.cdc.gov/contact-lenses/prevention/index.html",
        "label": "CDC: prevención de infecciones"
      }
    ]
  },
  {
    "slug": "depositos-proteinas-lentes-contacto-irritacion",
    "title": "Depósitos de proteínas en lentes de contacto: causas y molestias",
    "desc": "Por qué se acumulan depósitos en los lentes, cómo afectan la comodidad y qué hacer para evitarlos.",
    "keyword": "depositos proteinas lentes contacto irritacion",
    "intro": "Durante el uso, los lentes pueden acumular proteínas, lípidos y otros componentes de la lágrima. Estos depósitos pueden afectar la comodidad y la calidad visual; una limpieza adecuada ayuda, pero no todos se eliminan igual.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "La película lagrimal contiene proteínas y grasas que pueden adherirse al material. La cantidad varía entre personas y materiales. Un lente puede verse transparente y aun así tener depósitos.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Puedes notar visión fluctuante, sensación de lente sucio, incomodidad o menor tolerancia. Estos síntomas también pueden deberse a sequedad, ajuste inadecuado o infección.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Utiliza el sistema recomendado y respeta las instrucciones. No uses jabón doméstico, alcohol, agua, saliva ni productos caseros. No mezcles soluciones.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Respeta el calendario de reemplazo aunque el lente parezca estar bien. Si los depósitos aparecen repetidamente, el profesional puede revisar material, lágrima y rutina.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Cuidado",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-solutions-and-products",
        "label": "FDA: soluciones y productos para lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/consumer-products/contact-lenses",
        "label": "FDA: cuidado de lentes de contacto"
      },
      {
        "url": "https://www.cdc.gov/contact-lenses/prevention/index.html",
        "label": "CDC: prevención de infecciones"
      }
    ]
  },
  {
    "slug": "higiene-manos-manipular-lentes-contacto",
    "title": "Cómo lavarte las manos antes de manipular lentes de contacto",
    "desc": "Guía práctica de higiene de manos para reducir la transferencia de microorganismos al lente y al ojo.",
    "keyword": "higiene manos manipular lentes contacto",
    "intro": "Las manos son el primer punto de contacto con los lentes. Tocarlos sin lavarlas o con humedad, crema y residuos puede transferir suciedad y microorganismos a la superficie ocular.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Cada vez que colocas, retiras o limpias un lente, tus dedos tocan un dispositivo que se apoya directamente sobre el ojo. CDC recomienda lavar las manos con agua y jabón y secarlas completamente.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Lava ambas manos; frota palmas, dorsos, entre los dedos y alrededor de las uñas; enjuaga y seca con una toalla limpia que no deje pelusa.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "No manipules lentes con manos húmedas, grasosas o con restos de maquillaje. No soples el lente, no lo limpies con saliva ni lo apoyes sobre superficies del baño.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Si tienes infección ocular o secreción, suspende los lentes y consulta. Mantén estuche, solución y área de manipulación limpios.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Cuidado",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "solucion-limpieza-lentes-contacto"
    ],
    "sources": [
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-solutions-and-products",
        "label": "FDA: soluciones y productos para lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/consumer-products/contact-lenses",
        "label": "FDA: cuidado de lentes de contacto"
      },
      {
        "url": "https://www.cdc.gov/contact-lenses/prevention/index.html",
        "label": "CDC: prevención de infecciones"
      }
    ]
  },
  {
    "slug": "volver-usar-lentes-contacto-despues-infeccion-ocular",
    "title": "¿Cuándo volver a usar lentes de contacto después de una infección?",
    "desc": "Qué debes confirmar antes de retomar los lentes tras conjuntivitis, queratitis u otra infección ocular.",
    "keyword": "volver usar lentes contacto despues infeccion ocular",
    "intro": "Después de una infección ocular, el momento adecuado para volver a usar lentes depende del tipo de infección, la recuperación de la córnea y el tratamiento recibido. No existe un número de días seguro para todos.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "La superficie ocular puede seguir inflamada aunque el ojo parezca normal. En una infección corneal, el profesional necesita confirmar que el tejido está recuperado.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "El oftalmólogo considera el diagnóstico, la respuesta al tratamiento, la integridad de la córnea y si el lente o el estuche pudieron contaminarse. Pregunta si debes desechar materiales.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Espera autorización expresa. Sigue el plan para reemplazar materiales y utiliza solución compatible. Si reaparecen dolor, enrojecimiento, fotofobia, secreción o visión borrosa, retira los lentes y vuelve a consultar.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "La vuelta depende del diagnóstico y recuperación. No existe fecha universal: el especialista debe confirmar que puedes retomar el uso.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Cuidado",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "solucion-limpieza-lentes-contacto",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-solutions-and-products",
        "label": "FDA: soluciones y productos para lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/consumer-products/contact-lenses",
        "label": "FDA: cuidado de lentes de contacto"
      },
      {
        "url": "https://www.cdc.gov/contact-lenses/prevention/index.html",
        "label": "CDC: prevención de infecciones"
      }
    ]
  },
  {
    "slug": "antibioticos-gotas-oftalmicas-lentes-contacto",
    "title": "Antibióticos en gotas y lentes de contacto: precauciones importantes",
    "desc": "Por qué debes consultar antes de combinar gotas oftálmicas con lentes y qué hacer durante una infección.",
    "keyword": "antibioticos gotas oftalmicas lentes contacto",
    "intro": "Si te recetan gotas antibióticas, no asumas que puedes seguir usando lentes como de costumbre. La compatibilidad depende del medicamento, diagnóstico y estado de la superficie ocular.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Los antibióticos tratan determinadas infecciones bacterianas, pero no todas las causas de ojo rojo. Una infección viral, fúngica o parasitaria necesita un enfoque distinto.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "En muchas infecciones se recomienda suspender temporalmente los lentes. Algunas gotas contienen conservantes cuya compatibilidad depende de la formulación.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Sigue dosis y duración indicadas. Lávate las manos, evita que la punta toque el ojo y no compartas el envase. Si empeora el dolor o la visión, contacta al médico.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "No coloques el lente después de las gotas salvo que el etiquetado y el profesional lo permitan. Retoma el uso cuando te autoricen.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Cuidado",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-solutions-and-products",
        "label": "FDA: soluciones y productos para lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/consumer-products/contact-lenses",
        "label": "FDA: cuidado de lentes de contacto"
      },
      {
        "url": "https://www.cdc.gov/contact-lenses/prevention/index.html",
        "label": "CDC: prevención de infecciones"
      }
    ]
  },
  {
    "slug": "esteroides-gotas-oftalmicas-lentes-contacto-riesgos",
    "title": "Gotas con esteroides y lentes de contacto: por qué no automedicarse",
    "desc": "Riesgos de usar gotas oftálmicas con corticoides sin evaluación y por qué el ojo rojo necesita diagnóstico.",
    "keyword": "esteroides gotas oftalmicas lentes contacto riesgos",
    "intro": "Las gotas con corticoides pueden ser útiles en ciertas enfermedades, pero no son un tratamiento universal para el ojo rojo. En presencia de algunas infecciones, su uso sin supervisión puede empeorar el cuadro o enmascarar señales.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Los corticoides reducen la inflamación, pero requieren diagnóstico y seguimiento. No son equivalentes a gotas lubricantes ni a productos para aliviar temporalmente el enrojecimiento.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Un ojo rojo puede deberse a irritación, alergia, lesión o infección corneal. Algunas infecciones pueden empeorar con esteroides; su uso prolongado requiere control médico.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Retira los lentes y solicita evaluación. No uses gotas prescritas a otra persona ni frascos sobrantes. Si hay dolor, fotofobia, visión borrosa o secreción, busca atención urgente.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Utiliza corticoides únicamente bajo prescripción y seguimiento. Informa al médico que usas lentes y no los vuelvas a colocar hasta recibir autorización.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Cuidado",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "solucion-limpieza-lentes-contacto"
    ],
    "sources": [
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-solutions-and-products",
        "label": "FDA: soluciones y productos para lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/consumer-products/contact-lenses",
        "label": "FDA: cuidado de lentes de contacto"
      },
      {
        "url": "https://www.cdc.gov/contact-lenses/prevention/index.html",
        "label": "CDC: prevención de infecciones"
      }
    ]
  },
  {
    "slug": "complicaciones-lentes-contacto-cuando-suspender-uso",
    "title": "Complicaciones de los lentes de contacto: cuándo suspender su uso",
    "desc": "Guía para reconocer molestias y señales de alarma que requieren retirar los lentes y consultar.",
    "keyword": "complicaciones lentes contacto cuando suspender uso",
    "intro": "Los lentes de contacto requieren adaptación y cuidado. Cuando aparece una molestia, la decisión más segura no es aguantarla: es identificar si se trata de incomodidad pasajera o de una señal que necesita evaluación.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Dolor, enrojecimiento inusual, secreción, fotofobia, lagrimeo excesivo o visión borrosa no deben considerarse parte normal del uso. Retira los lentes y no los vuelvas a colocar hasta recibir orientación.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Entre los problemas asociados están queratitis, abrasiones, infiltrados, reacciones papilares y cambios relacionados con la oxigenación. Cada condición tiene causas y tratamientos distintos.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "Retira los lentes con manos limpias. Evita frotar el ojo, usar medicamentos sobrantes o colocar otro lente para comprobar si mejora. Si hay dolor intenso o cambios de visión, busca atención urgente.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Cumple las indicaciones de adaptación, reemplazo y limpieza. No duermas con lentes salvo prescripción, evita el agua y programa controles aunque te sientas bien.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Cuidado",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "solucion-limpieza-lentes-contacto",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-solutions-and-products",
        "label": "FDA: soluciones y productos para lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/consumer-products/contact-lenses",
        "label": "FDA: cuidado de lentes de contacto"
      },
      {
        "url": "https://www.cdc.gov/contact-lenses/prevention/index.html",
        "label": "CDC: prevención de infecciones"
      }
    ]
  },
  {
    "slug": "lentes-contacto-despues-cirugia-ocular-cuando-retomar",
    "title": "Lentes de contacto después de una cirugía ocular: cuándo retomarlos",
    "desc": "Qué debes saber antes de volver a usar lentes después de una cirugía ocular.",
    "keyword": "lentes contacto uso prolongado sobreuso senales",
    "intro": "Después de una cirugía ocular, el momento de volver a usar lentes depende del procedimiento, la cicatrización y el estado de la superficie ocular. No existe un plazo universal: incluso cuando la visión parece recuperada, la córnea puede necesitar seguimiento.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Una cirugía de cataratas, un procedimiento corneal, una cirugía refractiva o una intervención en párpados afectan estructuras diferentes. Cada una tiene tiempos de recuperación y requisitos distintos para adaptar un lente.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Pregunta al cirujano cuándo puedes volver a manipular el ojo, si necesitas una nueva receta y si el procedimiento cambió la curvatura o la superficie ocular. Informa qué tipo de lente utilizabas antes.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "No coloques lentes antes de recibir autorización. Evita frotarte los ojos o aplicar gotas no indicadas. Si aparece dolor, enrojecimiento, secreción, fotofobia o visión borrosa, contacta al equipo médico.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "El especialista puede recomendar una nueva adaptación o un periodo adicional sin lentes. Retoma el uso solo cuando lo autorice y mantén gafas de respaldo.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Cuidado",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-solutions-and-products",
        "label": "FDA: soluciones y productos para lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/consumer-products/contact-lenses",
        "label": "FDA: cuidado de lentes de contacto"
      },
      {
        "url": "https://www.cdc.gov/contact-lenses/prevention/index.html",
        "label": "CDC: prevención de infecciones"
      }
    ]
  },
  {
    "slug": "contaminacion-lentes-contacto-estuche-solucion-senales",
    "title": "Cómo detectar problemas de contaminación en lentes, estuche y solución",
    "desc": "Señales de alerta en el sistema de cuidado, errores de almacenamiento y pasos para reducir contaminación.",
    "keyword": "contaminacion lentes contacto estuche solucion senales",
    "intro": "La seguridad de los lentes reutilizables depende del conjunto: lente, estuche, solución y manos. Un error en cualquiera de estos elementos puede comprometer la higiene. No siempre se detecta contaminación a simple vista.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "Microorganismos y residuos pueden llegar al lente o estuche desde manos, agua, superficies o solución reutilizada. Un frasco abierto más allá del periodo indicado puede dejar de ser adecuado.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Un lente roto, deformado, con depósitos o que produce molestia nueva no debe colocarse. Un estuche agrietado o sucio debe reemplazarse; no uses solución vencida.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "No coloques el lente si sospechas contaminación. Desecha la solución usada y consulta las instrucciones del fabricante. Si el ojo presenta síntomas, busca atención.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "Lávate y sécate las manos, usa solución fresca, no rellenes líquido usado y deja secar el estuche según las instrucciones. Reemplázalo al menos cada tres meses o antes si se daña.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Cuidado",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "ojo-rojo-lentes-contacto-que-hacer",
      "solucion-limpieza-lentes-contacto"
    ],
    "sources": [
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-solutions-and-products",
        "label": "FDA: soluciones y productos para lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/consumer-products/contact-lenses",
        "label": "FDA: cuidado de lentes de contacto"
      },
      {
        "url": "https://www.cdc.gov/contact-lenses/prevention/index.html",
        "label": "CDC: prevención de infecciones"
      }
    ]
  },
  {
    "slug": "compartir-lentes-contacto-riesgo-infecciones",
    "title": "Compartir lentes de contacto: riesgos de infección y por qué evitarlo",
    "desc": "Por qué los lentes son dispositivos personales, qué puede transmitirse al compartirlos y cómo proteger la salud ocular.",
    "keyword": "solucion salina vs desinfectante lentes contacto",
    "intro": "Los lentes de contacto no deben compartirse, ni siquiera entre familiares o parejas. Cada lente se adapta a parámetros individuales y entra en contacto directo con la superficie ocular. Compartirlo puede transferir microorganismos y causar lesiones o infecciones.",
    "sections": [
      {
        "h": "Qué debes saber",
        "p1": "La forma de la córnea, la graduación, la curva base, el diámetro y las necesidades de cada ojo son diferentes. Un lente que se adapta a una persona puede quedar mal ajustado en otra.",
        "p2": "La evaluación profesional es importante porque distintas condiciones pueden producir síntomas parecidos. El diagnóstico depende del examen ocular y, en ciertos casos, de pruebas específicas."
      },
      {
        "h": "Síntomas y señales de alerta",
        "p1": "Al pasar de un ojo a otro pueden transferirse secreciones y microorganismos. La limpieza casera no convierte un lente usado por otra persona en un producto seguro para ti.",
        "p2": "No es seguro autodiagnosticarse. Dolor, enrojecimiento inusual, secreción, sensibilidad a la luz o cambios en la visión justifican retirar los lentes y buscar valoración."
      },
      {
        "h": "Qué hacer y qué evitar",
        "p1": "El uso de un lente ajeno puede provocar irritación, lesión de la córnea, conjuntivitis o queratitis. Los lentes de color también son dispositivos médicos y no deben prestarse ni intercambiarse.",
        "p2": "No uses medicamentos, gotas con esteroides, antibióticos, anestésicos ni remedios caseros sin indicación. No frotes el ojo ni vuelvas a colocar el lente para comprobar si la molestia desapareció."
      },
      {
        "h": "Prevención y seguimiento",
        "p1": "No compartas ni vuelvas a utilizar un lente ajeno. Si ya lo hiciste y tienes síntomas, retíralo y solicita evaluación; no intentes resolverlo con gotas o desinfectantes improvisados.",
        "p2": "Mantén gafas de respaldo y cumple los controles recomendados. Si los síntomas reaparecen, informa al profesional sobre el lente, la solución, el estuche y tus hábitos de uso."
      }
    ],
    "category": "Cuidado",
    "readMinutes": 7,
    "publishedAt": "2026-11-20",
    "faq": [
      {
        "q": "¿Puedo seguir usando lentes si tengo molestias?",
        "a": "Si hay dolor, ojo rojo inusual, secreción, sensibilidad a la luz o visión borrosa, retira los lentes y contacta de inmediato a un profesional. No los vuelvas a colocar hasta recibir orientación."
      },
      {
        "q": "¿Puedo tratarlo con gotas que tengo en casa?",
        "a": "No. El tratamiento depende de la causa y algunos medicamentos pueden empeorar ciertas condiciones. Consulta a un profesional de salud visual."
      },
      {
        "q": "¿Cuándo puedo volver a usar mis lentes?",
        "a": "Depende del diagnóstico y de la recuperación de la superficie ocular. Retoma el uso solo cuando el profesional lo autorice."
      }
    ],
    "relatedSlugs": [
      "solucion-limpieza-lentes-contacto",
      "como-limpiar-cambiar-estuche-lentes-de-contacto"
    ],
    "sources": [
      {
        "url": "https://www.fda.gov/medical-devices/contact-lenses/contact-lens-solutions-and-products",
        "label": "FDA: soluciones y productos para lentes"
      },
      {
        "url": "https://www.fda.gov/medical-devices/consumer-products/contact-lenses",
        "label": "FDA: cuidado de lentes de contacto"
      },
      {
        "url": "https://www.cdc.gov/contact-lenses/prevention/index.html",
        "label": "CDC: prevención de infecciones"
      }
    ]
  }
]
export function getHealthArticle(slug: string) { return HEALTH_ARTICLES.find(article => article.slug === slug) }
