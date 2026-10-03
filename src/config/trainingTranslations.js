const localizedTraining = {
  en: {
    goal: 'Understand the essential actions for this topic and know when to request qualified help.',
    result: 'A clear, practical response that prioritizes safety, communication, and timely support.',
    intro: 'Review the key decisions, practice the sequence, and adapt it to your household or situation.',
    lessons: [
      'Recognize the situation and check immediate safety',
      'Review the recommended actions in order',
      'Identify contacts, resources, and support options',
      'Practice the plan and update it regularly',
    ],
    questions: [
      {
        prompt: 'What should come first when applying this guidance?',
        options: ['Act immediately without checking the surroundings', 'Check the context and follow the recommended steps', 'Ignore changes in the situation'],
        answer: 1,
        explanation: 'Checking the context first helps prevent additional risks and supports a clearer response.',
      },
      {
        prompt: 'When should qualified or emergency help be requested?',
        options: ['When there is immediate danger or the situation exceeds your abilities', 'Never, if you have read this guide', 'Only after waiting several hours'],
        answer: 0,
        explanation: 'Educational guidance does not replace emergency services or qualified professional care.',
      },
    ],
  },
  fr: {
    goal: 'Comprendre les actions essentielles de ce thème et savoir quand demander une aide qualifiée.',
    result: 'Une réponse claire et pratique qui privilégie la sécurité, la communication et un soutien rapide.',
    intro: 'Passez en revue les décisions clés, entraînez-vous à suivre la séquence et adaptez-la à votre foyer ou à la situation.',
    lessons: [
      'Reconnaître la situation et vérifier la sécurité immédiate',
      'Revoir les actions recommandées dans l’ordre',
      'Identifier les contacts, les ressources et les options de soutien',
      'Pratiquer le plan et le mettre à jour régulièrement',
    ],
    questions: [
      {
        prompt: 'Que faut-il faire en premier pour appliquer ces recommandations ?',
        options: ['Agir immédiatement sans vérifier les alentours', 'Évaluer le contexte et suivre les étapes recommandées', 'Ignorer les changements de situation'],
        answer: 1,
        explanation: 'Évaluer d’abord le contexte aide à éviter des risques supplémentaires et permet une réponse plus claire.',
      },
      {
        prompt: 'Quand faut-il demander une aide qualifiée ou les services d’urgence ?',
        options: ['En cas de danger immédiat ou si la situation dépasse vos capacités', 'Jamais après avoir lu ce guide', 'Seulement après plusieurs heures d’attente'],
        answer: 0,
        explanation: 'Les conseils éducatifs ne remplacent pas les services d’urgence ni les soins professionnels qualifiés.',
      },
    ],
  },
  pt: {
    goal: 'Compreender as ações essenciais deste tema e saber quando solicitar ajuda qualificada.',
    result: 'Uma resposta clara e prática que prioriza segurança, comunicação e apoio no momento adequado.',
    intro: 'Revise as decisões principais, pratique a sequência e adapte-a à sua família ou situação.',
    lessons: [
      'Reconhecer a situação e verificar a segurança imediata',
      'Revisar as ações recomendadas na ordem correta',
      'Identificar contatos, recursos e opções de apoio',
      'Praticar o plano e atualizá-lo regularmente',
    ],
    questions: [
      {
        prompt: 'O que deve ser feito primeiro ao aplicar estas orientações?',
        options: ['Agir imediatamente sem verificar o entorno', 'Avaliar o contexto e seguir os passos recomendados', 'Ignorar mudanças na situação'],
        answer: 1,
        explanation: 'Avaliar o contexto primeiro ajuda a evitar riscos adicionais e permite uma resposta mais clara.',
      },
      {
        prompt: 'Quando deve ser solicitada ajuda qualificada ou de emergência?',
        options: ['Quando há perigo imediato ou a situação supera suas capacidades', 'Nunca, se você leu este guia', 'Somente após esperar várias horas'],
        answer: 0,
        explanation: 'A orientação educativa não substitui os serviços de emergência nem o atendimento profissional qualificado.',
      },
    ],
  },
  de: {
    goal: 'Die wesentlichen Maßnahmen zu diesem Thema verstehen und wissen, wann qualifizierte Hilfe nötig ist.',
    result: 'Eine klare, praktische Reaktion, bei der Sicherheit, Kommunikation und rechtzeitige Unterstützung im Mittelpunkt stehen.',
    intro: 'Prüfen Sie die wichtigsten Entscheidungen, üben Sie die Abfolge und passen Sie sie an Ihren Haushalt oder die Situation an.',
    lessons: [
      'Die Situation erkennen und die unmittelbare Sicherheit prüfen',
      'Die empfohlenen Maßnahmen in der richtigen Reihenfolge durchgehen',
      'Kontakte, Ressourcen und Unterstützungsmöglichkeiten bestimmen',
      'Den Plan üben und regelmäßig aktualisieren',
    ],
    questions: [
      {
        prompt: 'Was sollte bei der Anwendung dieser Hinweise zuerst geschehen?',
        options: ['Sofort handeln, ohne die Umgebung zu prüfen', 'Den Kontext prüfen und die empfohlenen Schritte befolgen', 'Veränderungen der Situation ignorieren'],
        answer: 1,
        explanation: 'Eine erste Prüfung des Kontexts hilft, zusätzliche Risiken zu vermeiden und klarer zu reagieren.',
      },
      {
        prompt: 'Wann sollte qualifizierte Hilfe oder der Notdienst angefordert werden?',
        options: ['Bei unmittelbarer Gefahr oder wenn die Situation die eigenen Fähigkeiten übersteigt', 'Niemals, wenn diese Anleitung gelesen wurde', 'Erst nach mehreren Stunden Wartezeit'],
        answer: 0,
        explanation: 'Bildungsinformationen ersetzen weder den Notdienst noch qualifizierte professionelle Versorgung.',
      },
    ],
  },
}

export function localizeTrainingContent(content, locale) {
  if (!content) return content
  const language = String(locale || 'es').split('-')[0]
  const translation = localizedTraining[language]
  return translation ? { ...content, ...translation, sources: content.sources } : content
}
