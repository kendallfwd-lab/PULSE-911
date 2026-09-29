const readySource = { label: 'Ready.gov — preparación familiar', url: 'https://www.ready.gov/' }
const redCrossFirstAid = { label: 'Cruz Roja — pasos de primeros auxilios', url: 'https://www.redcross.org/take-a-class/first-aid/performing-first-aid/first-aid-steps' }
const redCrossCpr = { label: 'Cruz Roja — RCP solo con las manos', url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/hands-only-cpr.html' }
const whoPfa = { label: 'OMS — primeros auxilios psicológicos', url: 'https://www.who.int/publications/i/item/9789241548205' }
const cdcCoping = { label: 'CDC — bienestar después de una emergencia', url: 'https://www.cdc.gov/disability-emergency-preparedness/communication-resources/coping-easy-read.html' }
const nhtsaCrash = { label: 'NHTSA — seguridad después de una colisión', url: 'https://www.nhtsa.gov/vehicle-safety/seat-belts' }

export const TRAINING_CONTENT = {
  'course-1': {
    goal: 'Lograr que cada hogar tenga un plan sencillo, conocido y posible de poner en práctica.',
    result: 'Una familia con contactos, rutas, punto de reunión y suministros definidos.',
    intro: 'Organiza decisiones, contactos y suministros antes de que ocurra una emergencia.',
    lessons: ['Identifica los riesgos y necesidades del hogar', 'Define contactos y puntos de reunión', 'Prepara rutas y un kit accesible', 'Practica y actualiza el plan'],
    questions: [
      { prompt: '¿Qué debe incluir un plan familiar útil?', options: ['Solo una lista de compras', 'Contactos, puntos de reunión y rutas de evacuación', 'Únicamente números de pólizas'], answer: 1, explanation: 'Un plan debe indicar cómo comunicarse, dónde reunirse y cómo evacuar.' },
      { prompt: '¿Qué combinación pertenece a un kit básico?', options: ['Agua, alimentos no perecederos, iluminación y suministros personales', 'Solo ropa elegante', 'Únicamente dinero en efectivo'], answer: 0, explanation: 'El kit debe cubrir necesidades básicas y particulares del hogar durante una interrupción.' },
    ],
    sources: [readySource],
  },
  'course-2': {
    goal: 'Reconocer rápidamente una emergencia cardíaca y activar la cadena inicial de ayuda.',
    result: 'Una respuesta inicial más segura mientras llega personal capacitado.',
    intro: 'Practica la secuencia inicial ante una persona adulta que no responde y no respira normalmente.',
    lessons: ['Comprueba que la escena sea segura', 'Verifica respuesta y respiración', 'Activa emergencias y solicita un DEA', 'Inicia compresiones según tu entrenamiento'],
    questions: [
      { prompt: 'Una persona adulta no responde y solo jadea. ¿Qué corresponde hacer?', options: ['Esperar varios minutos', 'Activar emergencias, pedir un DEA e iniciar RCP', 'Darle agua'], answer: 1, explanation: 'El jadeo no es respiración normal; se debe activar ayuda e iniciar RCP según el entrenamiento.' },
      { prompt: 'En RCP solo con las manos para adultos, las compresiones se realizan…', options: ['En el centro del pecho, fuertes y rápidas', 'Sobre el abdomen', 'Muy lentamente y con pausas largas'], answer: 0, explanation: 'La Cruz Roja indica comprimir en el centro del pecho, permitiendo que vuelva a su posición entre compresiones.' },
    ],
    sources: [redCrossCpr, redCrossFirstAid],
  },
  'course-3': {
    goal: 'Brindar acompañamiento respetuoso después de una situación difícil sin causar más presión.',
    result: 'Una persona escuchada, orientada y conectada con apoyo cuando lo necesita.',
    intro: 'Aprende a ofrecer apoyo humano y práctico sin presionar ni intentar diagnosticar.',
    lessons: ['Comprueba seguridad y necesidades urgentes', 'Escucha con calma y sin forzar el relato', 'Conecta con personas y servicios de apoyo', 'Reconoce cuándo buscar ayuda profesional'],
    questions: [
      { prompt: '¿Cuál es una respuesta de apoyo adecuada?', options: ['Obligar a la persona a contar todo', 'Escuchar con respeto y preguntar qué necesita', 'Prometer que nada malo volverá a ocurrir'], answer: 1, explanation: 'La ayuda psicológica inicial respeta la dignidad, las decisiones y el ritmo de la persona.' },
      { prompt: 'Si el malestar continúa o interfiere con la vida diaria, conviene…', options: ['Ignorarlo', 'Buscar apoyo profesional o comunitario', 'Aislarse completamente'], answer: 1, explanation: 'Pedir ayuda es apropiado cuando el malestar persiste, aumenta o afecta las actividades cotidianas.' },
    ],
    sources: [whoPfa, cdcCoping],
  },
  'course-4': {
    goal: 'Preparar una estrategia familiar de comunicación para momentos de separación o interrupción.',
    result: 'Todos saben a quién contactar, dónde reunirse y qué alternativa utilizar.',
    intro: 'Crea una forma sencilla para que la familia se comunique y se reúna si se separa.',
    lessons: ['Registra contactos importantes', 'Elige puntos de reunión', 'Define rutas y transporte alternativo', 'Ensaya el plan con toda la familia'],
    questions: [
      { prompt: '¿Por qué es útil elegir un contacto fuera de la zona?', options: ['Puede centralizar mensajes si la comunicación local falla', 'Reemplaza a los servicios de emergencia', 'Evita practicar el plan'], answer: 0, explanation: 'Un contacto externo puede ayudar a compartir novedades cuando las comunicaciones locales están saturadas.' },
      { prompt: '¿Cuándo debe revisarse el plan?', options: ['Nunca después de escribirlo', 'Periódicamente y cuando cambien los datos', 'Solo después de una emergencia'], answer: 1, explanation: 'Los contactos, necesidades y rutas cambian; el plan debe practicarse y actualizarse.' },
    ],
    sources: [readySource],
  },
  'res-1': {
    goal: 'Ordenar los primeros pasos de ayuda sin exponer a la persona auxiliadora a nuevos peligros.',
    result: 'Una evaluación inicial segura y una activación de emergencias con mejor información.',
    intro: 'Usa la secuencia revisar, llamar y atender sin exponerte a nuevos peligros.',
    lessons: ['Revisa la seguridad de la escena', 'Comprueba respuesta, respiración y sangrado grave', 'Llama al servicio de emergencias', 'Atiende solo dentro de tu nivel de formación'],
    questions: [
      { prompt: '¿Cuál es la primera prioridad al acercarse a una persona lesionada?', options: ['Moverla inmediatamente', 'Comprobar que la escena sea segura', 'Tomar fotografías'], answer: 1, explanation: 'No debes convertirte en otra víctima; primero revisa la seguridad de la escena.' },
      { prompt: 'Si sospechas lesión de cabeza, cuello o columna, debes…', options: ['Pedirle que camine', 'Evitar moverla salvo peligro inmediato y activar ayuda', 'Sentarla rápidamente'], answer: 1, explanation: 'La Cruz Roja recomienda no pedir movimiento cuando se sospecha una lesión de cabeza, cuello o columna.' },
    ],
    sources: [redCrossFirstAid],
  },
  'res-2': {
    goal: 'Reconocer reacciones comunes y promover acciones cotidianas que favorezcan la recuperación.',
    result: 'Mayor capacidad para cuidar el bienestar y solicitar apoyo a tiempo.',
    intro: 'Reconoce reacciones frecuentes y adopta acciones pequeñas para cuidar el bienestar.',
    lessons: ['Reconoce emociones y reacciones comunes', 'Mantén descanso, alimentación y rutinas posibles', 'Habla con personas de confianza', 'Busca apoyo si el malestar persiste'],
    questions: [
      { prompt: 'Después de una emergencia, ¿qué acción puede ayudar?', options: ['Dormir lo menos posible', 'Hablar con personas de confianza y cuidar las rutinas', 'Consumir sustancias para olvidar'], answer: 1, explanation: 'El descanso, las rutinas y el apoyo social pueden favorecer la recuperación.' },
      { prompt: '¿Qué recomienda el CDC respecto a noticias y redes?', options: ['Revisarlas sin descanso', 'Tomar pausas para proteger el bienestar', 'Compartir cualquier rumor'], answer: 1, explanation: 'Mantenerse informado es útil, pero las pausas pueden reducir la sobrecarga emocional.' },
    ],
    sources: [cdcCoping],
  },
  'res-3': {
    goal: 'Crear una red de comunicación familiar que siga siendo útil durante una interrupción.',
    result: 'Contactos, mensajes y puntos de reunión conocidos por todos los integrantes.',
    intro: 'Prepara un sistema de comunicación que funcione incluso si la familia está separada.',
    lessons: ['Anota números importantes', 'Define un contacto fuera de la zona', 'Elige lugares de reunión', 'Conserva copias y practica el plan'],
    questions: [
      { prompt: 'Si las llamadas están saturadas, una alternativa práctica es…', options: ['Enviar mensajes de texto breves', 'Llamar repetidamente sin pausa', 'Apagar todos los teléfonos'], answer: 0, explanation: 'Los mensajes breves suelen consumir menos capacidad y ayudan a conservar batería.' },
      { prompt: '¿Quién debe conocer el plan?', options: ['Solo una persona adulta', 'Todos los integrantes según su edad y necesidades', 'Únicamente los vecinos'], answer: 1, explanation: 'Cada integrante debe saber cómo comunicarse, dónde reunirse y a quién pedir ayuda.' },
    ],
    sources: [readySource],
  },
  'res-4': {
    goal: 'Recordar la secuencia esencial de actuación ante una persona adulta que no responde.',
    result: 'Activación temprana de ayuda, solicitud de DEA y compresiones mejor orientadas.',
    intro: 'Repasa decisiones esenciales antes de iniciar compresiones en una persona adulta.',
    lessons: ['Garantiza seguridad', 'Comprueba respuesta y respiración', 'Llama y consigue un DEA', 'Comprime en el centro del pecho'],
    questions: [
      { prompt: '¿Qué equipo debe solicitarse mientras se activa emergencias?', options: ['Un termómetro', 'Un DEA si está disponible', 'Una almohada'], answer: 1, explanation: 'El desfibrilador externo automático debe utilizarse tan pronto esté disponible.' },
      { prompt: '¿Cuándo se detienen las compresiones?', options: ['Cuando llega ayuda capacitada, hay señales claras de vida o la escena deja de ser segura', 'Después de diez compresiones', 'Cuando otra persona comienza a grabar'], answer: 0, explanation: 'Se continúa hasta que pueda relevarte ayuda capacitada, cambie la condición o exista un riesgo.' },
    ],
    sources: [redCrossCpr],
  },
  'res-5': {
    goal: 'Evitar nuevos riesgos después de una colisión y comunicar la situación con claridad.',
    result: 'Una escena más segura y personas afectadas vigiladas hasta recibir ayuda.',
    intro: 'Prioriza la seguridad del lugar, la activación de ayuda y la vigilancia de las personas afectadas.',
    lessons: ['Aléjate del tránsito y otros peligros', 'Activa emergencias y describe la ubicación', 'Evita movimientos innecesarios de personas lesionadas', 'Solicita evaluación médica cuando corresponda'],
    questions: [
      { prompt: 'Después de una colisión, antes de ayudar debes…', options: ['Entrar a la calzada sin observar', 'Comprobar tránsito, fuego y otros peligros', 'Mover a todas las personas'], answer: 1, explanation: 'La seguridad de la escena sigue siendo la primera prioridad antes de acercarse.' },
      { prompt: 'Si una persona parece estar bien después de una colisión importante, lo prudente es…', options: ['Descartar cualquier lesión', 'Considerar una evaluación médica', 'Continuar conduciendo inmediatamente'], answer: 1, explanation: 'Algunas lesiones no son evidentes de inmediato; NHTSA recomienda atención médica tras una colisión.' },
    ],
    sources: [redCrossFirstAid, nhtsaCrash],
  },
  'res-6': {
    goal: 'Aplicar los principios observar, escuchar y conectar para ofrecer apoyo humano inmediato.',
    result: 'Necesidades urgentes identificadas y acceso respetuoso a redes de ayuda.',
    intro: 'Apoya mediante tres principios: observar, escuchar y conectar.',
    lessons: ['Observa seguridad y necesidades urgentes', 'Escucha sin juzgar ni presionar', 'Ayuda con necesidades prácticas', 'Conecta con redes y servicios disponibles'],
    questions: [
      { prompt: '¿Qué significa “conectar” en primeros auxilios psicológicos?', options: ['Diagnosticar un trastorno', 'Facilitar apoyo práctico, información y redes de ayuda', 'Decidir por la persona'], answer: 1, explanation: 'Conectar consiste en acercar recursos, seres queridos y servicios respetando las decisiones de la persona.' },
      { prompt: '¿Cuál frase es más apropiada?', options: ['“Tienes que contarme todo ahora”', '“Estoy aquí para escucharte; ¿qué necesitas en este momento?”', '“Sé exactamente cómo te sientes”'], answer: 1, explanation: 'Una pregunta abierta y respetuosa permite ofrecer ayuda sin imponer ni asumir.' },
    ],
    sources: [whoPfa],
  },
}
