const rows = [
  ['skip','Saltar al contenido principal','Skip to main content','Aller au contenu principal','Pular para o conteúdo principal','Zum Hauptinhalt springen'],
  ['step','Paso','Step','Étape','Etapa','Schritt'],
  ['of','de','of','sur','de','von'],
  ['prepareProfile','Prepara tu ficha de emergencia','Prepare your emergency profile','Préparez votre fiche d’urgence','Prepare sua ficha de emergência','Notfallprofil vorbereiten'],
  ['profileIntro','Estos datos se usarán únicamente dentro de la simulación para mostrar qué información puede consultar un operador autorizado.','This data is used only within the simulation to show what an authorized operator can view.','Ces données sont utilisées uniquement dans la simulation pour montrer les informations accessibles à un opérateur autorisé.','Estes dados são usados apenas na simulação para mostrar o que um operador autorizado pode consultar.','Diese Daten werden nur in der Simulation verwendet, um zu zeigen, was autorisierte Einsatzkräfte einsehen können.'],
  ['identification','IDENTIFICACIÓN','IDENTIFICATION','IDENTIFICATION','IDENTIFICAÇÃO','IDENTIFIKATION'],
  ['personalData','Datos personales','Personal information','Données personnelles','Dados pessoais','Persönliche Daten'],
  ['document','Cédula de identidad','Identity document','Pièce d’identité','Documento de identidade','Ausweisdokument'],
  ['searchData','Buscar datos','Look up information','Rechercher les données','Buscar dados','Daten suchen'],
  ['fullName','Nombre completo','Full name','Nom complet','Nome completo','Vollständiger Name'],
  ['birthDate','Fecha de nacimiento','Date of birth','Date de naissance','Data de nascimento','Geburtsdatum'],
  ['age','Edad','Age','Âge','Idade','Alter'],
  ['phone','Teléfono','Phone','Téléphone','Telefone','Telefon'],
  ['province','Provincia','Province','Province','Província','Provinz'],
  ['selectProvince','Selecciona una provincia','Select a province','Sélectionnez une province','Selecione uma província','Provinz auswählen'],
  ['canton','Cantón','Canton','Canton','Cantão','Kanton'],
  ['selectCanton','Selecciona un cantón','Select a canton','Sélectionnez un canton','Selecione um cantão','Kanton auswählen'],
  ['district','Distrito','District','District','Distrito','Bezirk'],
  ['selectDistrict','Selecciona un distrito','Select a district','Sélectionnez un district','Selecione um distrito','Bezirk auswählen'],
  ['address','Dirección','Address','Adresse','Endereço','Adresse'],
  ['continue','Continuar','Continue','Continuer','Continuar','Weiter'],
  ['back','Atrás','Back','Retour','Voltar','Zurück'],
  ['emergencyFile','FICHA DE EMERGENCIA','EMERGENCY PROFILE','FICHE D’URGENCE','FICHA DE EMERGÊNCIA','NOTFALLPROFIL'],
  ['medicalDeclared','Información médica declarada','Declared medical information','Informations médicales déclarées','Informações médicas declaradas','Angegebene medizinische Informationen'],
  ['bloodType','Tipo de sangre','Blood type','Groupe sanguin','Tipo sanguíneo','Blutgruppe'],
  ['notSpecified','No indicado','Not specified','Non indiqué','Não informado','Nicht angegeben'],
  ['allergies','Alergias','Allergies','Allergies','Alergias','Allergien'],
  ['medications','Medicamentos relevantes','Relevant medications','Médicaments pertinents','Medicamentos relevantes','Relevante Medikamente'],
  ['conditions','Condiciones importantes','Important conditions','Conditions importantes','Condições importantes','Wichtige Erkrankungen'],
  ['contactPrivacy','CONTACTO Y PRIVACIDAD','CONTACT AND PRIVACY','CONTACT ET CONFIDENTIALITÉ','CONTATO E PRIVACIDADE','KONTAKT UND DATENSCHUTZ'],
  ['primaryContact','Contacto principal y permisos','Primary contact and permissions','Contact principal et autorisations','Contato principal e permissões','Hauptkontakt und Berechtigungen'],
  ['contactName','Nombre del contacto','Contact name','Nom du contact','Nome do contato','Name der Kontaktperson'],
  ['relationship','Parentesco','Relationship','Lien de parenté','Parentesco','Beziehung'],
  ['saveEnter','Guardar y entrar','Save and enter','Enregistrer et entrer','Salvar e entrar','Speichern und öffnen'],
  ['citizenReports','REPORTES CIUDADANOS','CITIZEN REPORTS','SIGNALEMENTS CITOYENS','RELATOS CIDADÃOS','BÜRGERMELDUNGEN'],
  ['newReport','Nuevo reporte','New report','Nouveau signalement','Novo relato','Neue Meldung'],
  ['reportMap','Mapa de reportes','Report map','Carte des signalements','Mapa de relatos','Meldungskarte'],
  ['newCitizenReport','NUEVO REPORTE CIUDADANO','NEW CITIZEN REPORT','NOUVEAU SIGNALEMENT CITOYEN','NOVO RELATO CIDADÃO','NEUE BÜRGERMELDUNG'],
  ['shareSituation','Comparte una situación','Share a situation','Partager une situation','Compartilhe uma situação','Situation teilen'],
  ['whatHappening','¿Qué está ocurriendo?','What is happening?','Que se passe-t-il ?','O que está acontecendo?','Was ist passiert?'],
  ['title','Título','Title','Titre','Título','Titel'],
  ['description','Descripción','Description','Description','Descrição','Beschreibung'],
  ['category','Categoría','Category','Catégorie','Categoria','Kategorie'],
  ['riskLevel','Nivel de riesgo','Risk level','Niveau de risque','Nível de risco','Risikostufe'],
  ['visualEvidence','Evidencia visual','Visual evidence','Preuve visuelle','Evidência visual','Bildnachweis'],
  ['addPhoto','Agregar una fotografía','Add a photo','Ajouter une photo','Adicionar uma foto','Foto hinzufügen'],
  ['reportLocation','Ubicación del reporte','Report location','Localisation du signalement','Localização do relato','Standort der Meldung'],
  ['locationReference','Referencia del lugar','Location reference','Référence du lieu','Referência do local','Ortsangabe'],
  ['selectedLocation','Ubicación seleccionada','Location selected','Localisation sélectionnée','Localização selecionada','Standort ausgewählt'],
  ['pendingPublish','Se publicará como pendiente','It will be published as pending','Sera publié en attente','Será publicado como pendente','Wird als ausstehend veröffentlicht'],
  ['cancel','Cancelar','Cancel','Annuler','Cancelar','Abbrechen'],
  ['publishReview','Publicar para revisión','Submit for review','Publier pour examen','Publicar para revisão','Zur Prüfung einreichen'],
  ['personalHistory','HISTORIAL PERSONAL','PERSONAL HISTORY','HISTORIQUE PERSONNEL','HISTÓRICO PESSOAL','PERSÖNLICHER VERLAUF'],
  ['myIncidents','Mis incidentes','My incidents','Mes incidents','Meus incidentes','Meine Vorfälle'],
  ['noReports','No hay reportes que coincidan','No matching reports','Aucun signalement correspondant','Nenhum relato correspondente','Keine passenden Meldungen'],
  ['situation','Situación','Situation','Situation','Situação','Situation'],
  ['assignedResponse','Respuesta asignada','Assigned response','Réponse assignée','Resposta atribuída','Zugewiesene Reaktion'],
  ['timeline','Línea de tiempo','Timeline','Chronologie','Linha do tempo','Zeitleiste'],
  ['sosMode','Modo SOS','SOS mode','Mode SOS','Modo SOS','SOS-Modus'],
  ['newEmergencyReport','NUEVO REPORTE','NEW REPORT','NOUVEAU SIGNALEMENT','NOVO RELATO','NEUE MELDUNG'],
  ['reportEmergency','Reportar una emergencia','Report an emergency','Signaler une urgence','Relatar uma emergência','Notfall melden'],
  ['type','Tipo','Type','Type','Tipo','Typ'],
  ['details','Detalles','Details','Détails','Detalhes','Details'],
  ['location','Ubicación','Location','Localisation','Localização','Standort'],
  ['evidence','Evidencia','Evidence','Preuve','Evidência','Beleg'],
  ['confirm','Confirmar','Confirm','Confirmer','Confirmar','Bestätigen'],
  ['briefDescription','Descripción breve','Brief description','Brève description','Descrição breve','Kurze Beschreibung'],
  ['unknown','Desconocido','Unknown','Inconnu','Desconhecido','Unbekannt'],
  ['yes','Sí','Yes','Oui','Sim','Ja'],
  ['no','No','No','Non','Não','Nein'],
  ['whereOccurred','¿Dónde ocurrió?','Where did it happen?','Où cela s’est-il produit ?','Onde aconteceu?','Wo ist es passiert?'],
  ['visualEvidenceUpper','EVIDENCIA VISUAL','VISUAL EVIDENCE','PREUVE VISUELLE','EVIDÊNCIA VISUAL','BILDNACHWEIS'],
  ['selectPhoto','Seleccionar fotografía','Select photo','Sélectionner une photo','Selecionar foto','Foto auswählen'],
  ['reviewReport','Revisar reporte','Review report','Vérifier le signalement','Revisar relato','Meldung prüfen'],
  ['readySend','LISTO PARA ENVIAR','READY TO SEND','PRÊT À ENVOYER','PRONTO PARA ENVIAR','BEREIT ZUM SENDEN'],
  ['sendDemo','Enviar reporte demo','Send demo report','Envoyer le signalement démo','Enviar relato demo','Demo-Meldung senden'],
  ['preventionRecovery','PREVENCIÓN, SEGURIDAD Y RECUPERACIÓN','PREVENTION, SAFETY AND RECOVERY','PRÉVENTION, SÉCURITÉ ET RÉTABLISSEMENT','PREVENÇÃO, SEGURANÇA E RECUPERAÇÃO','PRÄVENTION, SICHERHEIT UND ERHOLUNG'],
  ['learnAct','Aprende a actuar antes, durante y después','Learn how to act before, during, and after','Apprenez à agir avant, pendant et après','Aprenda a agir antes, durante e depois','Lernen Sie, vorher, währenddessen und danach zu handeln'],
  ['all','Todos','All','Tous','Todos','Alle'],
  ['recovery','Recuperación','Recovery','Récupération','Recuperação','Erholung'],
  ['wellbeing','Bienestar','Wellbeing','Bien-être','Bem-estar','Wohlbefinden'],
  ['preparation','Preparación','Preparedness','Préparation','Preparação','Vorbereitung'],
  ['safetyCourses','CURSOS DE SEGURIDAD','SAFETY COURSES','COURS DE SÉCURITÉ','CURSOS DE SEGURANÇA','SICHERHEITSKURSE'],
  ['practicalTraining','Formación práctica para la comunidad','Practical training for the community','Formation pratique pour la communauté','Treinamento prático para a comunidade','Praktische Schulung für die Gemeinschaft'],
  ['startTraining','Iniciar capacitación','Start training','Commencer la formation','Iniciar treinamento','Schulung starten'],
  ['reviewTraining','Repasar capacitación','Review training','Revoir la formation','Revisar treinamento','Schulung wiederholen'],
  ['guidesResources','GUÍAS Y RECURSOS','GUIDES AND RESOURCES','GUIDES ET RESSOURCES','GUIAS E RECURSOS','LEITFÄDEN UND RESSOURCEN'],
  ['quickSituation','Consulta rápida por situación','Quick reference by situation','Consultation rapide par situation','Consulta rápida por situação','Schnellzugriff nach Situation'],
  ['account','MI CUENTA','MY ACCOUNT','MON COMPTE','MINHA CONTA','MEIN KONTO'],
  ['profileEmergency','Perfil y ficha de emergencia','Profile and emergency information','Profil et fiche d’urgence','Perfil e ficha de emergência','Profil und Notfallinformationen'],
  ['medicalEmergency','Ficha médica de emergencia','Emergency medical profile','Fiche médicale d’urgence','Ficha médica de emergência','Medizinisches Notfallprofil'],
  ['emergencyPlan','Mi plan de emergencia','My emergency plan','Mon plan d’urgence','Meu plano de emergência','Mein Notfallplan'],
  ['privacyConsent','Privacidad y consentimiento','Privacy and consent','Confidentialité et consentement','Privacidade e consentimento','Datenschutz und Einwilligung'],
  ['saveChanges','Guardar cambios','Save changes','Enregistrer les modifications','Salvar alterações','Änderungen speichern'],
  ['resetDemo','Restablecer datos demo','Reset demo data','Réinitialiser les données démo','Redefinir dados demo','Demo-Daten zurücksetzen'],
  ['operation','OPERACIÓN','OPERATIONS','OPÉRATIONS','OPERAÇÃO','EINSATZ'],
  ['intelligence','INTELIGENCIA Y CONTROL','INTELLIGENCE AND CONTROL','RENSEIGNEMENT ET CONTRÔLE','INTELIGÊNCIA E CONTROLE','INTELLIGENZ UND KONTROLLE'],
  ['commandCenter','Centro de mando','Command center','Centre de commandement','Centro de comando','Leitstelle'],
  ['incidents','Incidentes','Incidents','Incidents','Incidentes','Vorfälle'],
  ['dispatch','Despacho','Dispatch','Répartition','Despacho','Disposition'],
  ['units','Unidades','Units','Unités','Unidades','Einheiten'],
  ['hospitals','Hospitales','Hospitals','Hôpitaux','Hospitais','Krankenhäuser'],
  ['riskZones','Zonas de riesgo','Risk zones','Zones à risque','Zonas de risco','Risikozonen'],
  ['publicAlerts','Alertas públicas','Public alerts','Alertes publiques','Alertas públicos','Öffentliche Warnungen'],
  ['publications','Publicaciones','Publications','Publications','Publicações','Veröffentlichungen'],
  ['analytics','Analítica','Analytics','Analytique','Análises','Analysen'],
  ['audit','Auditoría','Audit','Audit','Auditoria','Prüfprotokoll'],
  ['scenarios','Escenarios','Scenarios','Scénarios','Cenários','Szenarien'],
  ['aiCenter','Centro IA','AI center','Centre IA','Centro de IA','KI-Zentrum'],
  ['aiReview','Revisión IA','AI review','Examen IA','Revisão de IA','KI-Prüfung'],
  ['trafficMonitoring','Monitoreo vial','Road monitoring','Surveillance routière','Monitoramento viário','Verkehrsüberwachung'],
  ['systemStable','Sistema local estable','Local system stable','Système local stable','Sistema local estável','Lokales System stabil'],
  ['simulatedOperation','PULSE COMMAND / OPERACIÓN SIMULADA','PULSE COMMAND / SIMULATED OPERATIONS','PULSE COMMAND / OPÉRATIONS SIMULÉES','PULSE COMMAND / OPERAÇÃO SIMULADA','PULSE COMMAND / SIMULIERTER EINSATZ'],
  ['activeMonitoring','Vigilancia activa','Active monitoring','Surveillance active','Monitoramento ativo','Aktive Überwachung'],
  ['activeIncidents','Incidentes activos','Active incidents','Incidents actifs','Incidentes ativos','Aktive Vorfälle'],
  ['priorityP1','Prioridad P1','P1 priority','Priorité P1','Prioridade P1','Priorität P1'],
  ['availableUnits','Unidades disponibles','Available units','Unités disponibles','Unidades disponíveis','Verfügbare Einheiten'],
  ['simulation','Simulación','Simulation','Simulation','Simulação','Simulation'],
  ['currentIncidents','Incidentes en curso','Ongoing incidents','Incidents en cours','Incidentes em andamento','Laufende Vorfälle'],
  ['operationalMap','MAPA OPERATIVO EN VIVO','LIVE OPERATIONS MAP','CARTE OPÉRATIONNELLE EN DIRECT','MAPA OPERACIONAL AO VIVO','LIVE-EINSATZKARTE'],
  ['quickDispatch','DESPACHO RÁPIDO','QUICK DISPATCH','RÉPARTITION RAPIDE','DESPACHO RÁPIDO','SCHNELLDISPOSITION'],
  ['dispatchAction','Despachar','Dispatch','Affecter','Despachar','Entsenden'],
  ['openOperational','Abrir ficha operativa','Open operational record','Ouvrir le dossier opérationnel','Abrir ficha operacional','Einsatzakte öffnen'],
  ['allStatuses','Todos los estados','All statuses','Tous les états','Todos os estados','Alle Status'],
  ['priority','Prioridad','Priority','Priorité','Prioridade','Priorität'],
  ['codeType','Código / Tipo','Code / Type','Code / Type','Código / Tipo','Code / Typ'],
  ['status','Estado','Status','État','Estado','Status'],
  ['resources','Recursos','Resources','Ressources','Recursos','Ressourcen'],
  ['summary','Resumen','Summary','Résumé','Resumo','Zusammenfassung'],
  ['communications','Comunicaciones','Communications','Communications','Comunicações','Kommunikation'],
  ['closure','Cierre','Closure','Clôture','Encerramento','Abschluss'],
  ['approve','Aprobar','Approve','Approuver','Aprovar','Genehmigen'],
  ['edit','Editar','Edit','Modifier','Editar','Bearbeiten'],
  ['reject','Rechazar','Reject','Rejeter','Rejeitar','Ablehnen'],
  ['pending','Pendientes','Pending','En attente','Pendentes','Ausstehend'],
  ['verifiedPlural','Verificadas','Verified','Vérifiées','Verificadas','Verifiziert'],
  ['published','Publicadas','Published','Publiées','Publicadas','Veröffentlicht'],
  ['rejectedPlural','Rechazadas','Rejected','Rejetées','Rejeitadas','Abgelehnt'],
  ['verify','Verificar','Verify','Vérifier','Verificar','Prüfen'],
  ['loadScenario','Cargar escenario','Load scenario','Charger le scénario','Carregar cenário','Szenario laden'],
  ['roadStatus','Estado por ruta','Status by route','État par route','Estado por rota','Status nach Route'],
  ['affectedRoads','Vías afectadas','Affected roads','Routes touchées','Vias afetadas','Betroffene Straßen'],
  ['localEvents','Eventos locales','Local events','Événements locaux','Eventos locais','Lokale Ereignisse'],
  ['pendingSuggestions','Sugerencias pendientes','Pending suggestions','Suggestions en attente','Sugestões pendentes','Ausstehende Vorschläge'],
  ['updated','Actualizado','Updated','Mis à jour','Atualizado','Aktualisiert'],
  ['highPriority','PRIORIDAD ALTA','HIGH PRIORITY','PRIORITÉ ÉLEVÉE','PRIORIDADE ALTA','HOHE PRIORITÄT'],
  ['estimatedResponse','Tiempo estimado de respuesta','Estimated response time','Temps de réponse estimé','Tempo estimado de resposta','Geschätzte Reaktionszeit'],
  ['iAmSafe','Estoy a salvo','I am safe','Je suis en sécurité','Estou em segurança','Ich bin in Sicherheit'],
  ['tracking','Seguimiento','Tracking','Suivi','Acompanhamento','Verfolgung'],
  ['share','Compartir','Share','Partager','Compartilhar','Teilen'],
  ['save','Guardar','Save','Enregistrer','Salvar','Speichern'],
  ['listenReport','Escuchar reporte','Listen to report','Écouter le signalement','Ouvir relato','Meldung anhören'],
  ['incidentProgress','Evolución del incidente','Incident progress','Évolution de l’incident','Evolução do incidente','Vorfallsverlauf'],
  ['incidentReported','Incidente reportado','Incident reported','Incident signalé','Incidente relatado','Vorfall gemeldet'],
  ['validationReport','Reporte en validación','Report under validation','Signalement en validation','Relato em validação','Meldung wird geprüft'],
  ['initialVerification','Verificación inicial','Initial verification','Vérification initiale','Verificação inicial','Erste Prüfung'],
  ['coordinatedCare','Atención coordinada','Coordinated response','Réponse coordonnée','Resposta coordenada','Koordinierte Reaktion'],
  ['activeTracking','Seguimiento activo','Active tracking','Suivi actif','Acompanhamento ativo','Aktive Verfolgung'],
  ['assignedUnits','Unidades asignadas','Assigned units','Unités assignées','Unidades atribuídas','Zugewiesene Einheiten'],
  ['assignmentProgress','Asignación en proceso','Assignment in progress','Affectation en cours','Atribuição em andamento','Zuweisung läuft'],
  ['commandCoordinating','El centro de mando está coordinando recursos.','The command center is coordinating resources.','Le centre de commandement coordonne les ressources.','O centro de comando está coordenando recursos.','Die Leitstelle koordiniert Ressourcen.'],
  ['incidentLocation','Ubicación del incidente','Incident location','Localisation de l’incident','Localização do incidente','Vorfallsort'],
  ['useful','Me sirve','Useful','Utile','Útil','Hilfreich'],
  ['viewReport','Ver reporte','View report','Voir le signalement','Ver relato','Meldung ansehen'],
  ['contribute','Aportar','Contribute','Contribuer','Contribuir','Beitragen'],
  ['supportNetwork','RED DE APOYO','SUPPORT NETWORK','RÉSEAU DE SOUTIEN','REDE DE APOIO','UNTERSTÜTZUNGSNETZ'],
  ['supportRecovery','APOYO Y RECUPERACIÓN','SUPPORT AND RECOVERY','SOUTIEN ET RÉTABLISSEMENT','APOIO E RECUPERAÇÃO','UNTERSTÜTZUNG UND ERHOLUNG'],
  ['available247','DISPONIBLE 24/7','AVAILABLE 24/7','DISPONIBLE 24 H/24','DISPONÍVEL 24/7','RUND UM DIE UHR VERFÜGBAR'],
  ['exploreResources','Explorar recursos','Explore resources','Explorer les ressources','Explorar recursos','Ressourcen erkunden'],
  ['map','Mapa','Map','Carte','Mapa','Karte'],
  ['operations','Operativo','Operations','Opérations','Operacional','Einsatz'],
  ['layers','Capas','Layers','Couches','Camadas','Ebenen'],
  ['incident','Incidente','Incident','Incident','Incidente','Vorfall'],
  ['unit','Unidad','Unit','Unité','Unidade','Einheit'],
  ['caution','Precaución','Caution','Précaution','Precaução','Vorsicht'],
  ['official','Oficial','Official','Officiel','Oficial','Offiziell'],
  ['aiPending','IA pendiente','AI pending','IA en attente','IA pendente','KI ausstehend'],
  ['hospital','Hospital','Hospital','Hôpital','Hospital','Krankenhaus'],
  ['simulationUpper','SIMULACIÓN','SIMULATION','SIMULATION','SIMULAÇÃO','SIMULATION'],
  ['alert','Alerta','Alert','Alerte','Alerta','Warnung'],
  ['precautionZone','Zona de precaución','Precaution zone','Zone de précaution','Zona de precaução','Vorsichtsbereich'],
  ['unnamedPoint','Punto sin nombre','Unnamed point','Point sans nom','Ponto sem nome','Unbenannter Punkt'],
  ['youAreHere','Estás aquí','You are here','Vous êtes ici','Você está aqui','Sie sind hier'],
  ['optionalExercise','Ejercicio opcional','Optional exercise','Exercice facultatif','Exercício opcional','Optionale Übung'],
  ['pause','Pausar','Pause','Pause','Pausar','Pausieren'],
  ['start','Comenzar','Start','Commencer','Começar','Starten'],
  ['reset','Reiniciar','Reset','Réinitialiser','Reiniciar','Zurücksetzen'],
  ['locationNotShared','No compartida','Not shared','Non partagée','Não compartilhada','Nicht geteilt'],
  ['shareOnQuestion','Solo se comparte al enviar una consulta','Only shared when submitting a question','Partagée uniquement lors de l’envoi d’une question','Compartilhada apenas ao enviar uma pergunta','Wird nur beim Senden einer Frage geteilt'],
  ['route','Ruta','Route','Itinéraire','Rota','Route'],
  ['routeOption','Opción de recorrido','Route option','Option de trajet','Opção de trajeto','Routenoption'],
  ['place','Lugar','Place','Lieu','Lugar','Ort'],
  ['enableLocationOrigin','Activa tu ubicación o selecciona un origen manual.','Enable your location or select a manual origin.','Activez votre localisation ou choisissez un départ manuel.','Ative sua localização ou selecione uma origem manual.','Aktivieren Sie Ihren Standort oder wählen Sie einen manuellen Startpunkt.'],
  ['chooseDestination','Selecciona un destino de la lista disponible.','Select a destination from the available list.','Sélectionnez une destination dans la liste disponible.','Selecione um destino na lista disponível.','Wählen Sie ein Ziel aus der verfügbaren Liste.'],
  ['routeFailed','No fue posible calcular el recorrido. Inténtalo nuevamente.','The route could not be calculated. Try again.','Le trajet n’a pas pu être calculé. Réessayez.','Não foi possível calcular o trajeto. Tente novamente.','Die Route konnte nicht berechnet werden. Versuchen Sie es erneut.'],
  ['enterDestination','Escribe un destino','Enter a destination','Saisissez une destination','Digite um destino','Ziel eingeben']
  ,['operationTitle','Operación','Operations','Opérations','Operação','Einsatz']
  ,['intelligenceTitle','Inteligencia y control','Intelligence and control','Renseignement et contrôle','Inteligência e controle','Intelligenz und Kontrolle']
  ,['availableUnitsLower','unidades disponibles','available units','unités disponibles','unidades disponíveis','verfügbare Einheiten']
  ,['commandOperational','Centro de mando operativo','Command center operational','Centre de commandement opérationnel','Centro de comando operacional','Leitstelle einsatzbereit']
  ,['interactiveGeoMap','Mapa geográfico interactivo','Interactive geographic map','Carte géographique interactive','Mapa geográfico interativo','Interaktive geografische Karte']
  ,['pauseAction','Pausar','Pause','Pause','Pausar','Pausieren']
  ,['resumeAction','Reanudar','Resume','Reprendre','Retomar','Fortsetzen']
  ,['monitoringRoadUpper','MONITOREO VIAL','ROAD MONITORING','SURVEILLANCE ROUTIÈRE','MONITORAMENTO VIÁRIO','VERKEHRSÜBERWACHUNG']
  ,['mobilityKnown','Movilidad y condiciones conocidas','Mobility and known conditions','Mobilité et conditions connues','Mobilidade e condições conhecidas','Mobilität und bekannte Bedingungen']
  ,['trafficProviderInfo','Integra datos PULSE; los proveedores externos son una mejora opcional y no bloquean esta vista.','Uses PULSE data; external providers are optional enhancements and do not block this view.','Utilise les données PULSE ; les fournisseurs externes sont facultatifs et ne bloquent pas cette vue.','Integra dados PULSE; provedores externos são opcionais e não bloqueiam esta visão.','Nutzt PULSE-Daten; externe Anbieter sind optional und blockieren diese Ansicht nicht.']
  ,['refreshNow','Actualizar ahora','Refresh now','Actualiser','Atualizar agora','Jetzt aktualisieren']
  ,['onboardingTaxHelp','Digita de 9 a 12 números, sin guiones. La consulta se realiza en el registro público de Hacienda.','Enter 9 to 12 digits without hyphens. The query uses the public Hacienda registry.','Saisissez 9 à 12 chiffres sans tirets. La recherche utilise le registre public de Hacienda.','Digite de 9 a 12 números sem hífens. A consulta usa o registro público da Hacienda.','Geben Sie 9 bis 12 Ziffern ohne Bindestriche ein. Die Abfrage nutzt das öffentliche Hacienda-Register.']
  ,['years','años','years old','ans','anos','Jahre']
  ,['ofThree','de 3','of 3','sur 3','de 3','von 3']
  ,['resourceIntro','Cursos y recursos educativos para mejorar la preparación comunitaria.','Courses and educational resources to improve community preparedness.','Cours et ressources éducatives pour améliorer la préparation communautaire.','Cursos e recursos educacionais para melhorar a preparação comunitária.','Kurse und Lernressourcen zur Verbesserung der Vorbereitung in der Gemeinschaft.']
  ,['completed','completado','completed','terminé','concluído','abgeschlossen']
  ,['lessonsAssessment','lecciones + evaluación','lessons + assessment','leçons + évaluation','lições + avaliação','Lektionen + Bewertung']
  ,['homePreparedness','Preparación del hogar','Household preparedness','Préparation du foyer','Preparação do lar','Vorbereitung zu Hause']
  ,['homePreparednessSummary','Arma un plan, identifica contactos y prepara suministros esenciales para tu hogar.','Build a plan, identify contacts, and prepare essential supplies for your household.','Élaborez un plan, identifiez les contacts et préparez les fournitures essentielles du foyer.','Crie um plano, identifique contatos e prepare suprimentos essenciais para sua casa.','Erstellen Sie einen Plan, bestimmen Sie Kontakte und bereiten Sie wichtige Vorräte vor.']
  ,['cprInitial','RCP y respuesta inicial','CPR and initial response','RCP et première intervention','RCP e resposta inicial','HLW und Erstreaktion']
  ,['cprInitialSummary','Reconoce una emergencia, activa ayuda y practica la secuencia general de RCP en un entorno educativo.','Recognize an emergency, call for help, and practice the general CPR sequence in an educational setting.','Reconnaissez une urgence, alertez les secours et pratiquez la séquence générale de RCP dans un cadre éducatif.','Reconheça uma emergência, acione ajuda e pratique a sequência geral de RCP em ambiente educacional.','Erkennen Sie einen Notfall, rufen Sie Hilfe und üben Sie den allgemeinen HLW-Ablauf in einer Lernumgebung.']
  ,['emotionalAfter','Apoyo emocional después de un accidente','Emotional support after an accident','Soutien émotionnel après un accident','Apoio emocional após um acidente','Emotionale Unterstützung nach einem Unfall']
  ,['emotionalAfterSummary','Herramientas para escuchar, acompañar y reconocer cuándo conviene buscar ayuda profesional.','Tools for listening, supporting, and recognizing when professional help may be appropriate.','Outils pour écouter, accompagner et reconnaître quand une aide professionnelle est indiquée.','Ferramentas para ouvir, acompanhar e reconhecer quando buscar ajuda profissional.','Hilfen zum Zuhören, Begleiten und Erkennen, wann professionelle Unterstützung sinnvoll ist.']
  ,['familyEmergencyPlan','Plan familiar ante emergencias','Family emergency plan','Plan familial d’urgence','Plano familiar de emergência','Familien-Notfallplan']
  ,['familyEmergencySummary','Define roles, rutas, puntos de reunión y una estrategia simple de comunicación familiar.','Define roles, routes, meeting points, and a simple family communication strategy.','Définissez les rôles, itinéraires, points de rencontre et une stratégie simple de communication familiale.','Defina funções, rotas, pontos de encontro e uma estratégia simples de comunicação familiar.','Legen Sie Rollen, Wege, Treffpunkte und eine einfache Kommunikationsstrategie für die Familie fest.']
  ,['firstStepsAccident','Primeros pasos después de un accidente','First steps after an accident','Premières étapes après un accident','Primeiros passos após um acidente','Erste Schritte nach einem Unfall']
  ,['firstStepsSummary','Lista breve para documentar el incidente, revisar necesidades inmediatas y organizar el seguimiento.','A short checklist to document the incident, assess immediate needs, and organize follow-up.','Une courte liste pour documenter l’incident, évaluer les besoins immédiats et organiser le suivi.','Lista breve para documentar o incidente, avaliar necessidades imediatas e organizar o acompanhamento.','Kurze Checkliste zur Dokumentation, Bewertung unmittelbarer Bedürfnisse und Planung der Nachsorge.']
  ,['wellbeingEmergency','Bienestar después de una emergencia','Wellbeing after an emergency','Bien-être après une urgence','Bem-estar após uma emergência','Wohlbefinden nach einem Notfall']
  ,['wellbeingEmergencySummary','Orientación general para reconocer reacciones de estrés, apoyarse en la red cercana y buscar ayuda profesional cuando sea necesario.','General guidance for recognizing stress reactions, relying on close support, and seeking professional help when needed.','Conseils généraux pour reconnaître les réactions de stress, s’appuyer sur ses proches et demander une aide professionnelle si nécessaire.','Orientação geral para reconhecer reações de estresse, contar com a rede próxima e buscar ajuda profissional quando necessário.','Allgemeine Hinweise zum Erkennen von Stressreaktionen, zur Nutzung naher Unterstützung und zum Einholen professioneller Hilfe.']
  ,['familyCommunication','Plan familiar de comunicación','Family communication plan','Plan familial de communication','Plano familiar de comunicação','Kommunikationsplan der Familie']
  ,['familyCommunicationSummary','Organiza contactos, puntos de encuentro y datos importantes antes de una situación de emergencia.','Organize contacts, meeting points, and important information before an emergency.','Organisez les contacts, points de rencontre et informations importantes avant une urgence.','Organize contatos, pontos de encontro e dados importantes antes de uma emergência.','Organisieren Sie Kontakte, Treffpunkte und wichtige Informationen vor einem Notfall.']
  ,['basicCpr','RCP básico: reconocer y responder','Basic CPR: recognize and respond','RCP de base : reconnaître et agir','RCP básica: reconhecer e responder','Basis-HLW: erkennen und reagieren']
  ,['basicCprSummary','Curso demostrativo para aprender la secuencia general de respuesta y la importancia de pedir ayuda rápidamente.','Demonstration course on the general response sequence and the importance of calling for help quickly.','Cours de démonstration sur la séquence générale d’intervention et l’importance d’appeler rapidement les secours.','Curso demonstrativo sobre a sequência geral de resposta e a importância de pedir ajuda rapidamente.','Demonstrationskurs zum allgemeinen Reaktionsablauf und zur Bedeutung schneller Hilfe.']
  ,['collisionSafety','Seguridad después de una colisión','Safety after a collision','Sécurité après une collision','Segurança após uma colisão','Sicherheit nach einem Zusammenstoß']
  ,['collisionSafetySummary','Qué información reunir, cómo mantener una zona segura y qué datos aportar al reporte mientras llega la ayuda.','What information to collect, how to keep the area safe, and what to report while help arrives.','Quelles informations recueillir, comment sécuriser la zone et quelles données transmettre en attendant les secours.','Quais informações reunir, como manter a área segura e o que relatar enquanto a ajuda chega.','Welche Informationen zu sammeln sind, wie der Bereich sicher bleibt und was bis zum Eintreffen der Hilfe zu melden ist.']
  ,['psychFirstAid','Primeros auxilios psicológicos','Psychological first aid','Premiers secours psychologiques','Primeiros socorros psicológicos','Psychologische Erste Hilfe']
  ,['psychFirstAidSummary','Principios de acompañamiento, escucha y apoyo después de un evento potencialmente traumático.','Principles of accompaniment, listening, and support after a potentially traumatic event.','Principes d’accompagnement, d’écoute et de soutien après un événement potentiellement traumatique.','Princípios de acompanhamento, escuta e apoio após um evento potencialmente traumático.','Grundsätze der Begleitung, des Zuhörens und der Unterstützung nach einem potenziell traumatischen Ereignis.']
  ,['basic','Básico','Basic','Basique','Básico','Grundlegend']
  ,['family','Familiar','Family','Familial','Familiar','Familie']
  ,['introductory','Introductorio','Introductory','Introduction','Introdutório','Einführend']
  ,['courseCountSuffix','cursos','courses','cours','cursos','Kurse']
  ,['courseSingular','curso','course','cours','curso','Kurs']
  ,['completionSuffix','% completado','% completed','% terminé','% concluído','% abgeschlossen']
  ,['pendingSuffix','pendientes','pending','en attente','pendentes','ausstehend']
  ,['eventsSuffix','eventos registrados','recorded events','événements enregistrés','eventos registrados','erfasste Ereignisse']
  ,['centersSuffix','centros reales de la zona','real local centers','centres réels de la zone','centros reais da região','reale Einrichtungen der Region']
  ,['medicalUnitsSuffix','unidades con base médica','medically based units','unités basées en centre médical','unidades com base médica','medizinisch stationierte Einheiten']
  ,['bedsSuffix','cupos simulados','simulated beds','places simulées','vagas simuladas','simulierte Plätze']
  ,['visibleUnitsSuffix','unidad(es) visibles','visible unit(s)','unité(s) visible(s)','unidade(s) visível(is)','sichtbare Einheit(en)']
  ,['reportsSuffix','reportes asociados','associated reports','signalements associés','relatos associados','zugehörige Meldungen']
  ,['filesSuffix','archivo(s)','file(s)','fichier(s)','arquivo(s)','Datei(en)']
  ,['assignedSuffix','asignada(s)','assigned','assignée(s)','atribuída(s)','zugewiesen']
  ,['loadingPulse','Cargando PULSE 911…','Loading PULSE 911…','Chargement de PULSE 911…','Carregando PULSE 911…','PULSE 911 wird geladen…']
  ,['statusReceived','Recibido','Received','Reçu','Recebido','Eingegangen']
  ,['statusValidating','Validando','Validating','En validation','Validando','Wird validiert']
  ,['statusValidated','Validado','Validated','Validé','Validado','Validiert']
  ,['statusDispatched','Despachado','Dispatched','Affecté','Despachado','Disponiert']
  ,['statusEnRoute','Unidades en ruta','Units en route','Unités en route','Unidades a caminho','Einheiten unterwegs']
  ,['statusOnScene','Unidades en sitio','Units on scene','Unités sur place','Unidades no local','Einheiten vor Ort']
  ,['statusTransporting','Trasladando','Transporting','En transport','Transportando','Transport läuft']
  ,['statusAtHospital','En hospital','At hospital','À l’hôpital','No hospital','Im Krankenhaus']
  ,['statusReturning','Regresando a base','Returning to base','Retour à la base','Retornando à base','Rückkehr zur Basis']
  ,['statusResolved','Resuelto','Resolved','Résolu','Resolvido','Gelöst']
  ,['statusCancelled','Cancelado','Cancelled','Annulé','Cancelado','Storniert']
  ,['unitAvailable','Disponible','Available','Disponible','Disponível','Verfügbar']
  ,['unitEnRoute','En ruta','En route','En route','A caminho','Unterwegs']
  ,['unitOnScene','En sitio','On scene','Sur place','No local','Vor Ort']
  ,['unitAtHospital','En hospital','At hospital','À l’hôpital','No hospital','Im Krankenhaus']
  ,['unitReturning','Regresando','Returning','Retour','Retornando','Rückkehr']
  ,['unitOutService','Fuera de servicio','Out of service','Hors service','Fora de serviço','Außer Betrieb']
  ,['unitAvailableUpper','DISPONIBLE','AVAILABLE','DISPONIBLE','DISPONÍVEL','VERFÜGBAR']
  ,['unitEnRouteUpper','EN RUTA','EN ROUTE','EN ROUTE','A CAMINHO','UNTERWEGS']
  ,['unitOnSceneUpper','EN SITIO','ON SCENE','SUR PLACE','NO LOCAL','VOR ORT']
  ,['baseIncidentUpper','BASE / INCIDENTE','BASE / INCIDENT','BASE / INCIDENT','BASE / INCIDENTE','BASIS / VORFALL']
  ,['unassigned','Sin asignar','Unassigned','Non attribué','Não atribuído','Nicht zugewiesen']
  ,['medicalContacts','Ficha médica & contactos','Medical profile & contacts','Fiche médicale et contacts','Ficha médica e contatos','Medizinisches Profil und Kontakte']
  ,['notDeclared','No declaradas','Not declared','Non déclarées','Não declaradas','Nicht angegeben']
  ,['contact','Contacto','Contact','Contact','Contato','Kontakt']
  ,['privacy','Privacidad','Privacy','Confidentialité','Privacidade','Datenschutz']
  ,['profileAuthorized','Ficha autorizada','Profile authorized','Fiche autorisée','Ficha autorizada','Profil freigegeben']
  ,['profileRestricted','Ficha restringida','Profile restricted','Fiche restreinte','Ficha restrita','Profil eingeschränkt']
  ,['reviewFullProfile','Revisar ficha completa','Review full profile','Voir la fiche complète','Revisar ficha completa','Vollständiges Profil prüfen']
  ,['nearbyDemoResponse','Respuesta demo cercana','Nearby demo response','Réponse de démonstration à proximité','Resposta demo próxima','Nahe Demo-Reaktion']
  ,['live','En vivo','Live','En direct','Ao vivo','Live']
  ,['quickProtocols','Protocolos rápidos','Quick protocols','Protocoles rapides','Protocolos rápidos','Schnellprotokolle']
  ,['quickCpr','RCP guía rápida','CPR quick guide','Guide rapide de RCP','Guia rápido de RCP','HLW-Kurzanleitung']
  ,['firstAid','Primeros auxilios','First aid','Premiers secours','Primeiros socorros','Erste Hilfe']
  ,['myIncidentsIntro','Consulta el estado, recursos y línea de tiempo de tus reportes.','Review the status, resources, and timeline of your reports.','Consultez l’état, les ressources et la chronologie de vos signalements.','Consulte o status, os recursos e a linha do tempo dos seus relatos.','Prüfen Sie Status, Ressourcen und Zeitleiste Ihrer Meldungen.']
  ,['reportIntro','El asistente adapta las preguntas al tipo de emergencia y calcula una prioridad demostrativa antes de enviar.','The assistant adapts questions to the emergency type and calculates a demo priority before submission.','L’assistant adapte les questions au type d’urgence et calcule une priorité de démonstration avant l’envoi.','O assistente adapta as perguntas ao tipo de emergência e calcula uma prioridade demo antes do envio.','Der Assistent passt die Fragen an den Notfalltyp an und berechnet vor dem Senden eine Demo-Priorität.']
  ,['roadHazard','Riesgo vial','Road hazard','Risque routier','Risco viário','Straßengefahr']
  ,['otherEmergency','Otra emergencia','Other emergency','Autre urgence','Outra emergência','Anderer Notfall']
  ,['recoveryAfterEmergency','Recuperación después de una emergencia','Recovery after an emergency','Rétablissement après une urgence','Recuperação após uma emergência','Erholung nach einem Notfall']
  ,['recoveryFeatureText','La aplicación relaciona el cierre de un incidente con recursos educativos de preparación y bienestar.','The application connects incident closure with preparedness and wellbeing learning resources.','L’application relie la clôture d’un incident à des ressources éducatives de préparation et de bien-être.','O aplicativo relaciona o encerramento de um incidente a recursos educativos de preparação e bem-estar.','Die Anwendung verbindet den Abschluss eines Vorfalls mit Lernressourcen zu Vorbereitung und Wohlbefinden.']
  ,['profileSettingsIntro','Controla la información declarada y los permisos usados durante los incidentes demo.','Manage declared information and permissions used during demo incidents.','Gérez les informations déclarées et les autorisations utilisées pendant les incidents de démonstration.','Gerencie as informações declaradas e as permissões usadas durante incidentes demo.','Verwalten Sie angegebene Informationen und Berechtigungen für Demo-Vorfälle.']
  ,['meetingPoint','Punto de reunión','Meeting point','Point de rencontre','Ponto de encontro','Treffpunkt']
  ,['evacuationRoute','Ruta de evacuación','Evacuation route','Itinéraire d’évacuation','Rota de evacuação','Evakuierungsroute']
  ,['shareIncidentLocation','Compartir ubicación durante incidentes','Share location during incidents','Partager la localisation pendant les incidents','Compartilhar localização durante incidentes','Standort bei Vorfällen teilen']
  ,['shareMedicalAuthorized','Compartir ficha médica con personal autorizado','Share medical profile with authorized personnel','Partager la fiche médicale avec le personnel autorisé','Compartilhar ficha médica com pessoal autorizado','Medizinisches Profil mit autorisiertem Personal teilen']
  ,['notifyPrimaryContact','Avisar al contacto principal en la demo','Notify the primary contact in the demo','Avertir le contact principal dans la démonstration','Avisar o contato principal na demo','Hauptkontakt in der Demo benachrichtigen']
  ,['citizenReportsTitle','Reportes ciudadanos','Citizen reports','Signalements citoyens','Relatos cidadãos','Bürgermeldungen']
  ,['communityIntro','Comparte información sobre lugares peligrosos, accidentes u obstáculos. El centro de mando revisa cada reporte antes de convertirlo en una alerta operativa.','Share information about dangerous places, accidents, or obstacles. The command center reviews each report before turning it into an operational alert.','Partagez des informations sur les lieux dangereux, accidents ou obstacles. Le centre de commandement examine chaque signalement avant d’en faire une alerte opérationnelle.','Compartilhe informações sobre locais perigosos, acidentes ou obstáculos. O centro de comando revisa cada relato antes de transformá-lo em um alerta operacional.','Teilen Sie Informationen zu gefährlichen Orten, Unfällen oder Hindernissen. Die Leitstelle prüft jede Meldung, bevor sie zu einer Einsatzwarnung wird.']
  ,['breathingDisclaimer','Respira a un ritmo cómodo. Detente si sientes malestar; esta guía no es tratamiento médico.','Breathe at a comfortable pace. Stop if you feel unwell; this guide is not medical treatment.','Respirez à un rythme confortable. Arrêtez-vous en cas de malaise ; ce guide ne constitue pas un traitement médical.','Respire em um ritmo confortável. Pare se sentir mal-estar; este guia não é tratamento médico.','Atmen Sie in einem angenehmen Tempo. Stoppen Sie bei Unwohlsein; diese Anleitung ist keine medizinische Behandlung.']
  ,['operationalMapDescription','Incidentes, unidades móviles, rutas, zonas de riesgo y alertas geográficas','Incidents, mobile units, routes, risk zones, and geographic alerts','Incidents, unités mobiles, itinéraires, zones à risque et alertes géographiques','Incidentes, unidades móveis, rotas, zonas de risco e alertas geográficos','Vorfälle, mobile Einheiten, Routen, Risikozonen und geografische Warnungen']
  ,['incidentResources','Recursos para este incidente','Resources for this incident','Ressources pour cet incident','Recursos para este incidente','Ressourcen für diesen Vorfall']
  ,['prepareFullDemo','Preparar una demostración completa','Prepare a complete demonstration','Préparer une démonstration complète','Preparar uma demonstração completa','Vollständige Demonstration vorbereiten']
  ,['viewResources','Ver recursos','View resources','Voir les ressources','Ver recursos','Ressourcen ansehen']
  ,['allUnitsStatus','Estado de todas las unidades','Status of all units','État de toutes les unités','Status de todas as unidades','Status aller Einheiten']
  ,['analyzeResponse','Analizar respuesta y recurrencia','Analyze response and recurrence','Analyser la réponse et la récurrence','Analisar resposta e recorrência','Reaktion und Wiederholung analysieren']
  ,['resourceStatus','Estado de recursos','Resource status','État des ressources','Status dos recursos','Ressourcenstatus']
  ,['selectIncident','Seleccionar incidente','Select incident','Sélectionner un incident','Selecionar incidente','Vorfall auswählen']
  ,['registerZone','Registrar zona en mapa','Register zone on map','Enregistrer une zone sur la carte','Registrar zona no mapa','Zone auf der Karte erfassen']
  ,['selectOrCreateZone','Selecciona una zona existente o crea una nueva','Select an existing zone or create a new one','Sélectionnez une zone existante ou créez-en une nouvelle','Selecione uma zona existente ou crie uma nova','Wählen Sie eine vorhandene Zone oder erstellen Sie eine neue']
  ,['pointName','Nombre del punto','Point name','Nom du point','Nome do ponto','Punktname']
  ,['electricalRisk','Riesgo eléctrico','Electrical risk','Risque électrique','Risco elétrico','Elektrische Gefahr']
  ,['clickMap','Haz clic en el mapa','Click the map','Cliquez sur la carte','Clique no mapa','Klicken Sie auf die Karte']
  ,['simulatedHistoryCrossing','CRUCE CON HISTORIAL SIMULADO','INTERSECTION WITH SIMULATED HISTORY','INTERSECTION AVEC HISTORIQUE SIMULÉ','CRUZAMENTO COM HISTÓRICO SIMULADO','KREUZUNG MIT SIMULIERTEM VERLAUF']
  ,['newMapAlert','Nueva alerta en mapa','New map alert','Nouvelle alerte sur la carte','Novo alerta no mapa','Neue Kartenwarnung']
  ,['selectOrCreateAlert','Selecciona una alerta para editarla o crea una nueva','Select an alert to edit or create a new one','Sélectionnez une alerte à modifier ou créez-en une nouvelle','Selecione um alerta para editar ou crie um novo','Wählen Sie eine Warnung zum Bearbeiten oder erstellen Sie eine neue']
  ,['coverageRadius','Radio de cobertura (400 m)','Coverage radius (400 m)','Rayon de couverture (400 m)','Raio de cobertura (400 m)','Abdeckungsradius (400 m)']
  ,['pendingMapSelection','Pendiente de seleccionar en mapa','Awaiting map selection','Sélection sur la carte en attente','Aguardando seleção no mapa','Kartenauswahl ausstehend']
  ,['periodIncidents','INCIDENTES DEL PERÍODO','INCIDENTS IN PERIOD','INCIDENTS DE LA PÉRIODE','INCIDENTES DO PERÍODO','VORFÄLLE IM ZEITRAUM']
  ,['incidentsByCategory','Incidentes por categoría','Incidents by category','Incidents par catégorie','Incidentes por categoria','Vorfälle nach Kategorie']
  ,['recurringPoints','Puntos de mayor recurrencia','Most recurring locations','Lieux les plus récurrents','Pontos de maior recorrência','Orte mit häufigsten Meldungen']
  ,['historicalReports','Concentración histórica de reportes','Historical concentration of reports','Concentration historique des signalements','Concentração histórica de relatos','Historische Meldungskonzentration']
  ,['incidentsByProvince','Incidentes por provincia','Incidents by province','Incidents par province','Incidentes por província','Vorfälle nach Provinz']
  ,['incidentsByRoute','Incidentes por ruta','Incidents by route','Incidents par itinéraire','Incidentes por rota','Vorfälle nach Route']
  ,['incidentsByTime','Incidentes por horario','Incidents by time','Incidents par horaire','Incidentes por horário','Vorfälle nach Uhrzeit']
  ,['responseIndicators','Indicadores de respuesta y confianza','Response and confidence indicators','Indicateurs de réponse et de confiance','Indicadores de resposta e confiança','Reaktions- und Vertrauensindikatoren']
  ,['meanResponse','Tiempo medio de respuesta','Average response time','Temps de réponse moyen','Tempo médio de resposta','Durchschnittliche Reaktionszeit']
  ,['timelineEstimate','Estimación basada en el timeline','Estimate based on the timeline','Estimation fondée sur la chronologie','Estimativa baseada na linha do tempo','Schätzung anhand der Zeitleiste']
  ,['analyticsDisclaimer','Estos datos son ficticios. Una concentración histórica de reportes no significa que un lugar sea definitivamente peligroso.','This data is fictional. A historical concentration of reports does not mean a place is definitely dangerous.','Ces données sont fictives. Une concentration historique de signalements ne signifie pas qu’un lieu est forcément dangereux.','Estes dados são fictícios. Uma concentração histórica de relatos não significa que um local seja definitivamente perigoso.','Diese Daten sind fiktiv. Eine historische Meldungskonzentration bedeutet nicht, dass ein Ort definitiv gefährlich ist.']
  ,['allUnits','Todas las unidades','All units','Toutes les unités','Todas as unidades','Alle Einheiten']
  ,['medicalAttention','Atención médica','Medical care','Soins médicaux','Atendimento médico','Medizinische Versorgung']
  ,['trafficAccident','Accidente vial','Traffic accident','Accident de la route','Acidente viário','Verkehrsunfall']
  ,['firePlural','Incendios','Fires','Incendies','Incêndios','Brände']
  ,['rescue','Rescate','Rescue','Sauvetage','Resgate','Rettung']
  ,['security','Seguridad','Security','Sécurité','Segurança','Sicherheit']
  ,['floods','Inundaciones','Floods','Inondations','Inundações','Überschwemmungen']
  ,['missingPerson','Persona desaparecida','Missing person','Personne disparue','Pessoa desaparecida','Vermisste Person']
  ,['realLocationsSimulatedCapacity','Ubicaciones reales · capacidad y estados simulados','Real locations · simulated capacity and statuses','Lieux réels · capacité et états simulés','Locais reais · capacidade e status simulados','Reale Standorte · simulierte Kapazität und Status']
  ,['coveragePuntarenas','Cobertura de Puntarenas y Barranca','Coverage of Puntarenas and Barranca','Couverture de Puntarenas et Barranca','Cobertura de Puntarenas e Barranca','Abdeckung von Puntarenas und Barranca']
  ,['selectCenterMap','Selecciona un centro para acercar el mapa','Select a center to zoom the map','Sélectionnez un centre pour rapprocher la carte','Selecione um centro para aproximar o mapa','Wählen Sie ein Zentrum, um die Karte zu vergrößern']
  ,['emergencyTransfers','Urgencias y traslados','Emergency care and transfers','Urgences et transferts','Urgências e transferências','Notfälle und Transporte']
  ,['localCareBase','Base de atención local','Local care base','Base de soins locale','Base de atendimento local','Lokaler Versorgungsstützpunkt']
  ,['automatedSupportCenter','CENTRO DE APOYO AUTOMATIZADO','AUTOMATED SUPPORT CENTER','CENTRE D’ASSISTANCE AUTOMATISÉE','CENTRO DE SUPORTE AUTOMATIZADO','AUTOMATISIERTES SUPPORTZENTRUM']
  ,['aiReviewNotice','Sugerencias explicables para revisión humana. Ningún resultado se vuelve oficial automáticamente.','Explainable suggestions for human review. No result becomes official automatically.','Suggestions explicables soumises à une révision humaine. Aucun résultat ne devient officiel automatiquement.','Sugestões explicáveis para revisão humana. Nenhum resultado se torna oficial automaticamente.','Nachvollziehbare Vorschläge zur menschlichen Prüfung. Kein Ergebnis wird automatisch offiziell.']
  ,['openReviewQueue','Abrir bandeja de revisión','Open review queue','Ouvrir la file de révision','Abrir fila de revisão','Prüfwarteschlange öffnen']
  ,['notOfficialUntilApproved','No son oficiales hasta aprobarse','Not official until approved','Non officielles avant approbation','Não são oficiais até serem aprovadas','Erst nach Genehmigung offiziell']
  ,['alertDrafts','Borradores de alertas','Alert drafts','Brouillons d’alertes','Rascunhos de alertas','Warnungsentwürfe']
  ,['pendingValidation','Pendientes de validación','Awaiting validation','En attente de validation','Aguardando validação','Validierung ausstehend']
  ,['publicationDrafts','Borradores de publicaciones','Publication drafts','Brouillons de publications','Rascunhos de publicações','Veröffentlichungsentwürfe']
  ,['localFallback','Fallback local disponible','Local fallback available','Solution locale disponible','Fallback local disponível','Lokale Ausweichlösung verfügbar']
  ,['controlFlow','Flujo de control','Control flow','Flux de contrôle','Fluxo de controle','Kontrollablauf']
  ,['humanLoop','HUMANO EN EL CICLO','HUMAN IN THE LOOP','HUMAIN DANS LA BOUCLE','HUMANO NO CICLO','MENSCH IN DER SCHLEIFE']
  ,['aiFlowOne','Los reportes se comparan con datos estructurados cercanos.','Reports are compared with nearby structured data.','Les signalements sont comparés aux données structurées à proximité.','Os relatos são comparados com dados estruturados próximos.','Meldungen werden mit nahe gelegenen strukturierten Daten verglichen.']
  ,['aiFlowTwo','El sistema prepara una sugerencia con confianza, motivo y fuentes.','The system prepares a suggestion with confidence, reason, and sources.','Le système prépare une suggestion avec confiance, motif et sources.','O sistema prepara uma sugestão com confiança, motivo e fontes.','Das System erstellt einen Vorschlag mit Konfidenz, Begründung und Quellen.']
  ,['aiFlowThree','Una persona revisa, edita, aprueba o rechaza.','A person reviews, edits, approves, or rejects.','Une personne examine, modifie, approuve ou rejette.','Uma pessoa revisa, edita, aprova ou rejeita.','Eine Person prüft, bearbeitet, genehmigt oder lehnt ab.']
  ,['aiFlowFour','Solo al aprobar se reutilizan las funciones oficiales de PULSE.','Official PULSE functions are reused only after approval.','Les fonctions officielles de PULSE ne sont réutilisées qu’après approbation.','As funções oficiais do PULSE só são reutilizadas após aprovação.','Offizielle PULSE-Funktionen werden erst nach Genehmigung verwendet.']
  ,['mandatoryHumanReview','REVISIÓN HUMANA OBLIGATORIA','MANDATORY HUMAN REVIEW','RÉVISION HUMAINE OBLIGATOIRE','REVISÃO HUMANA OBRIGATÓRIA','VERPFLICHTENDE MENSCHLICHE PRÜFUNG']
  ,['aiReviewQueue','Bandeja de revisión IA','AI review queue','File de révision IA','Fila de revisão de IA','KI-Prüfwarteschlange']
  ,['reviewBeforeAction','Examina motivo, fuentes y datos utilizados antes de ejecutar una acción.','Review the reason, sources, and data used before taking an action.','Examinez le motif, les sources et les données utilisées avant d’exécuter une action.','Examine o motivo, as fontes e os dados usados antes de executar uma ação.','Prüfen Sie Begründung, Quellen und verwendete Daten, bevor eine Aktion ausgeführt wird.']
  ,['dataUsed','Datos utilizados','Data used','Données utilisées','Dados utilizados','Verwendete Daten']
  ,['nearbyReportsWindow','Reportes cercanos, ventana temporal y ubicación general.','Nearby reports, time window, and general location.','Signalements proches, fenêtre temporelle et localisation générale.','Relatos próximos, janela temporal e localização geral.','Nahe Meldungen, Zeitfenster und allgemeiner Standort.']
  ,['viewOnMap','Ver en mapa','View on map','Voir sur la carte','Ver no mapa','Auf Karte anzeigen']
  ,['commandStarted','Centro de mando iniciado en modo simulación','Command center started in simulation mode','Centre de commandement démarré en mode simulation','Centro de comando iniciado em modo de simulação','Leitstelle im Simulationsmodus gestartet']
  ,['collisionScenario','Dos vehículos, persona atrapada, vía parcialmente bloqueada y necesidad de ambulancia + rescate.','Two vehicles, one trapped person, partially blocked road, and ambulance plus rescue required.','Deux véhicules, une personne coincée, route partiellement bloquée et besoin d’une ambulance et de secours.','Dois veículos, uma pessoa presa, via parcialmente bloqueada e necessidade de ambulância e resgate.','Zwei Fahrzeuge, eine eingeschlossene Person, teilweise blockierte Straße sowie Bedarf an Rettungswagen und Rettung.']
  ,['fireScenario','Incendio en estructura de dos pisos con humo visible y posible evacuación.','Fire in a two-story structure with visible smoke and possible evacuation.','Incendie dans un bâtiment de deux étages avec fumée visible et évacuation possible.','Incêndio em estrutura de dois andares com fumaça visível e possível evacuação.','Brand in einem zweistöckigen Gebäude mit sichtbarem Rauch und möglicher Evakuierung.']
  ,['criticalMedical','Emergencia médica crítica','Critical medical emergency','Urgence médicale critique','Emergência médica crítica','Kritischer medizinischer Notfall']
  ,['medicalScenario','Persona inconsciente con necesidad de respuesta médica inmediata.','Unconscious person requiring immediate medical response.','Personne inconsciente nécessitant une intervention médicale immédiate.','Pessoa inconsciente que necessita de resposta médica imediata.','Bewusstlose Person mit Bedarf an sofortiger medizinischer Hilfe.']
  ,['floodScenario','Vía con acumulación de agua, vehículos afectados y riesgo de corriente.','Road with standing water, affected vehicles, and current risk.','Route inondée, véhicules touchés et risque de courant.','Via com acúmulo de água, veículos afetados e risco de correnteza.','Straße mit Wasseransammlung, betroffenen Fahrzeugen und Strömungsgefahr.']
  ,['massIncident','Incidente masivo','Mass-casualty incident','Incident majeur','Incidente de múltiplas vítimas','Massenanfall von Verletzten']
  ,['massScenario','Evento con múltiples reportes coincidentes y necesidad de coordinación multirecurso.','Event with multiple matching reports requiring multi-resource coordination.','Événement avec plusieurs signalements concordants nécessitant une coordination de multiples ressources.','Evento com vários relatos coincidentes e necessidade de coordenação de múltiplos recursos.','Ereignis mit mehreren übereinstimmenden Meldungen und Bedarf an Koordination mehrerer Ressourcen.']
  ,['from','Desde','From','Depuis','Desde','Von']
  ,['coverageRadiusPrefix','Radio de cobertura (','Coverage radius (','Rayon de couverture (','Raio de cobertura (','Abdeckungsradius (']
  ,['periodIncidentsTitle','Incidentes del período','Incidents in period','Incidents de la période','Incidentes do período','Vorfälle im Zeitraum']
  ,['simulatedHistoryCrossingTitle','Cruce con historial simulado','Intersection with simulated history','Intersection avec historique simulé','Cruzamento com histórico simulado','Kreuzung mit simuliertem Verlauf']
  ,['riskMapUpdated','Mapa de riesgo actualizado con datos locales','Risk map updated with local data','Carte des risques mise à jour avec les données locales','Mapa de risco atualizado com dados locais','Risikokarte mit lokalen Daten aktualisiert']
  ,['healthArea','Área de salud','Health area','Zone de santé','Área de saúde','Gesundheitsbereich']
  ,['openTraining','Abrir capacitación →','Open training →','Ouvrir la formation →','Abrir treinamento →','Schulung öffnen →']
  ,['microTrainingUpper','MICROCAPACITACIÓN','MICROTRAINING','MICROFORMATION','MICROTREINAMENTO','MIKROSCHULUNG']
  ,['chooseAnswer','Marca una respuesta por pregunta','Choose one answer per question','Choisissez une réponse par question','Marque uma resposta por pergunta','Wählen Sie pro Frage eine Antwort']
  ,['reviewAnswers','Revisar mis respuestas','Review my answers','Vérifier mes réponses','Revisar minhas respostas','Meine Antworten prüfen']
  ,['excellentTraining','Excelente. Puedes continuar con una formación más completa.','Excellent. You can continue with more complete training.','Excellent. Vous pouvez poursuivre avec une formation plus complète.','Excelente. Você pode continuar com uma formação mais completa.','Ausgezeichnet. Sie können mit einer umfassenderen Schulung fortfahren.']
  ,['retryTrainingText','Revisa las explicaciones y vuelve a intentarlo cuando quieras.','Review the explanations and try again whenever you are ready.','Relisez les explications et réessayez quand vous le souhaitez.','Revise as explicações e tente novamente quando quiser.','Prüfen Sie die Erklärungen und versuchen Sie es erneut, wenn Sie möchten.']
  ,['repeat','Repetir','Try again','Recommencer','Repetir','Wiederholen']
  ,['continueWhatsapp','Continuar por WhatsApp','Continue on WhatsApp','Continuer sur WhatsApp','Continuar pelo WhatsApp','Über WhatsApp fortfahren']
  ,['officialSources','Fuentes oficiales consultadas','Official sources consulted','Sources officielles consultées','Fontes oficiais consultadas','Konsultierte offizielle Quellen']
  ,['pulseTrainingUpper','CAPACITACIÓN PULSE 911','PULSE 911 TRAINING','FORMATION PULSE 911','TREINAMENTO PULSE 911','PULSE-911-SCHULUNG']
  ,['trainingPurpose','PROPÓSITO DE ESTA CAPACITACIÓN','PURPOSE OF THIS TRAINING','OBJECTIF DE CETTE FORMATION','OBJETIVO DESTE TREINAMENTO','ZWECK DIESER SCHULUNG']
  ,['expectedResult','Resultado esperado','Expected result','Résultat attendu','Resultado esperado','Erwartetes Ergebnis']
  ,['educationalTraining','CAPACITACIÓN EDUCATIVA','EDUCATIONAL TRAINING','FORMATION ÉDUCATIVE','TREINAMENTO EDUCATIVO','LERNMODUL']
  ,['contentReviewed','Contenido revisado','Content reviewed','Contenu consulté','Conteúdo revisado','Inhalt geprüft']
  ,['continueContent','Continuar contenido','Continue content','Continuer le contenu','Continuar conteúdo','Mit dem Inhalt fortfahren']
  ,['educationalDisclaimer','Contenido educativo de demostración. En una emergencia real, contacta al servicio local de emergencias. No certifica competencias clínicas ni sustituye atención profesional.','Educational demonstration content. In a real emergency, contact your local emergency service. It does not certify clinical skills or replace professional care.','Contenu éducatif de démonstration. En cas d’urgence réelle, contactez le service d’urgence local. Il ne certifie aucune compétence clinique et ne remplace pas les soins professionnels.','Conteúdo educativo de demonstração. Em uma emergência real, contate o serviço local de emergência. Não certifica competências clínicas nem substitui atendimento profissional.','Pädagogischer Demonstrationsinhalt. Wenden Sie sich in einem echten Notfall an den örtlichen Notdienst. Er bescheinigt keine klinischen Fähigkeiten und ersetzt keine professionelle Versorgung.']
  ,['practicalInformation','Información práctica para actuar con mayor claridad y seguridad.','Practical information for acting with greater clarity and safety.','Informations pratiques pour agir avec plus de clarté et de sécurité.','Informações práticas para agir com mais clareza e segurança.','Praktische Informationen für klareres und sichereres Handeln.']
  ,['essentialSteps','Comprender los pasos esenciales y saber cuándo solicitar ayuda.','Understand the essential steps and know when to ask for help.','Comprendre les étapes essentielles et savoir quand demander de l’aide.','Compreender os passos essenciais e saber quando pedir ajuda.','Die wesentlichen Schritte verstehen und wissen, wann Hilfe nötig ist.']
  ,['originalText','Texto original','Original text','Texte original','Texto original','Originaltext']
  ,['translationLabel','Traducción','Translation','Traduction','Tradução','Übersetzung']
  ,['spanishLanguage','Español','Spanish','Espagnol','Espanhol','Spanisch']
  ,['translating','Traduciendo…','Translating…','Traduction…','Traduzindo…','Wird übersetzt…']
  ,['translateAction','Traducir','Translate','Traduire','Traduzir','Übersetzen']
  ,['close','Cerrar','Close','Fermer','Fechar','Schließen']
  ,['readyFamilySource','Ready.gov — preparación familiar','Ready.gov — family preparedness','Ready.gov — préparation familiale','Ready.gov — preparação familiar','Ready.gov — Familienvorsorge']
  ,['redCrossFirstAidSource','Cruz Roja — pasos de primeros auxilios','Red Cross — first aid steps','Croix-Rouge — gestes de premiers secours','Cruz Vermelha — passos de primeiros socorros','Rotes Kreuz — Erste-Hilfe-Schritte']
  ,['redCrossCprSource','Cruz Roja — RCP solo con las manos','Red Cross — hands-only CPR','Croix-Rouge — RCP par compressions seules','Cruz Vermelha — RCP somente com as mãos','Rotes Kreuz — HLW nur mit Herzdruckmassage']
  ,['whoPfaSource','OMS — primeros auxilios psicológicos','WHO — psychological first aid','OMS — premiers secours psychologiques','OMS — primeiros socorros psicológicos','WHO — psychologische Erste Hilfe']
  ,['cdcCopingSource','CDC — bienestar después de una emergencia','CDC — wellbeing after an emergency','CDC — bien-être après une urgence','CDC — bem-estar após uma emergência','CDC — Wohlbefinden nach einem Notfall']
  ,['nhtsaCollisionSource','NHTSA — seguridad después de una colisión','NHTSA — safety after a collision','NHTSA — sécurité après une collision','NHTSA — segurança após uma colisão','NHTSA — Sicherheit nach einem Zusammenstoß']
  ,['simulatedLocationSuffix','· Ubicación simulada para la demostración','· Simulated location for the demonstration','· Localisation simulée pour la démonstration','· Localização simulada para a demonstração','· Simulierter Standort für die Demonstration']
  ,['riskWord','Riesgo','Risk','Risque','Risco','Risiko']
  ,['fromLower','desde','from','depuis','desde','von']
  ,['inhale','Inhalar','Inhale','Inspirer','Inspirar','Einatmen']
  ,['hold','Mantener','Hold','Retenir','Segurar','Halten']
  ,['exhale','Exhalar','Exhale','Expirer','Expirar','Ausatmen']
  ,['approximateAccuracy','Precisión aproximada','Approximate accuracy','Précision approximative','Precisão aproximada','Ungefähre Genauigkeit']
  ,['information','Información','Information','Information','Informação','Information']
  ,['you','Tú','You','Vous','Você','Sie']
  ,['vehicleCollision','Colisión entre vehículos','Vehicle collision','Collision entre véhicules','Colisão entre veículos','Fahrzeugkollision']
  ,['threePeople','3 personas','3 people','3 personnes','3 pessoas','3 Personen']
  ,['partialTraffic','Tránsito parcial','Partial traffic flow','Circulation partielle','Trânsito parcial','Teilweiser Verkehrsfluss']
  ,['priorityMedical','Atención médica prioritaria','Priority medical care','Soins médicaux prioritaires','Atendimento médico prioritário','Vorrangige medizinische Versorgung']
  ,['onePatient','1 paciente','1 patient','1 patient','1 paciente','1 Patient']
  ,['clearAccess','Acceso despejado','Clear access','Accès dégagé','Acesso livre','Freier Zugang']
  ,['structuralFire','Incendio estructural','Structure fire','Incendie de bâtiment','Incêndio estrutural','Gebäudebrand']
  ,['twoEvacuated','2 personas evacuadas','2 people evacuated','2 personnes évacuées','2 pessoas evacuadas','2 Personen evakuiert']
  ,['visibleSmoke','Humo visible','Visible smoke','Fumée visible','Fumaça visível','Sichtbarer Rauch']
  ,['roadFlooding','Anegamiento vial','Road flooding','Inondation routière','Alagamento viário','Straßenüberflutung']
  ,['noInjuries','Sin lesionados','No injuries','Aucun blessé','Sem feridos','Keine Verletzten']
  ,['restrictedPassage','Paso restringido','Restricted passage','Passage restreint','Passagem restrita','Durchfahrt eingeschränkt']
  ,['securityIncident','Incidente de seguridad','Security incident','Incident de sécurité','Incidente de segurança','Sicherheitsvorfall']
  ,['assessmentProgress','Evaluación en curso','Assessment in progress','Évaluation en cours','Avaliação em andamento','Bewertung läuft']
  ,['areaSecured','Zona asegurada','Area secured','Zone sécurisée','Área protegida','Bereich gesichert']
  ,['citizenEmergency','Emergencia ciudadana','Citizen emergency','Urgence citoyenne','Emergência cidadã','Bürgernotfall']
  ,['initialAssessment','Evaluación inicial','Initial assessment','Évaluation initiale','Avaliação inicial','Erstbewertung']
  ,['coordinatedResponse','Respuesta coordinada','Coordinated response','Réponse coordonnée','Resposta coordenada','Koordinierte Reaktion']
  ,['reportReceived','Reporte recibido','Report received','Signalement reçu','Relato recebido','Meldung eingegangen']
  ,['operationalAssessment','Evaluación operativa','Operational assessment','Évaluation opérationnelle','Avaliação operacional','Operative Bewertung']
  ,['unitsOnWay','Unidades en camino','Units on the way','Unités en chemin','Unidades a caminho','Einheiten auf dem Weg']
  ,['personnelOnScene','Personal en sitio','Personnel on scene','Personnel sur place','Equipe no local','Personal vor Ort']
  ,['transportProgress','Traslado en curso','Transport in progress','Transport en cours','Transporte em andamento','Transport läuft']
  ,['incidentResolved','Incidente resuelto','Incident resolved','Incident résolu','Incidente resolvido','Vorfall gelöst']
  ,['safeStatus','Estado seguro','Safe status','Statut en sécurité','Status seguro','Sicherheitsstatus']
  ,['codeCopied','Código copiado','Code copied','Code copié','Código copiado','Code kopiert']
  ,['usefulInformation','Información útil','Useful information','Information utile','Informação útil','Nützliche Information']
  ,['saved','Guardado','Saved','Enregistré','Salvo','Gespeichert']
  ,['wellbeingRecoveryAlt','Recursos de bienestar y recuperación','Wellbeing and recovery resources','Ressources de bien-être et de rétablissement','Recursos de bem-estar e recuperação','Ressourcen für Wohlbefinden und Erholung']
  ,['wellbeingMatters','Después de una emergencia también importa cómo te sientes','How you feel after an emergency matters too','Après une urgence, votre ressenti compte aussi','Depois de uma emergência, como você se sente também importa','Nach einem Notfall zählt auch, wie Sie sich fühlen']
  ,['recoveryPreparednessGuides','Guías de recuperación y preparación','Recovery and preparedness guides','Guides de rétablissement et de préparation','Guias de recuperação e preparação','Leitfäden zu Erholung und Vorbereitung']
  ,['generalEducationalGuidance','Contenido educativo de orientación general','General educational guidance','Contenu éducatif d’orientation générale','Conteúdo educativo de orientação geral','Allgemeine Bildungsinformationen']
  ,['findSupportResources','Encuentra primeros pasos, redes de apoyo y recursos de preparación familiar.','Find first steps, support networks, and family preparedness resources.','Trouvez les premières étapes, les réseaux de soutien et les ressources de préparation familiale.','Encontre primeiros passos, redes de apoio e recursos de preparação familiar.','Finden Sie erste Schritte, Unterstützungsnetzwerke und Ressourcen zur Familienvorsorge.']
  ,['saveGuide','Guardar guía','Save guide','Enregistrer le guide','Salvar guia','Leitfaden speichern']
  ,['familyPreparedness','Preparación familiar','Family preparedness','Préparation familiale','Preparação familiar','Familienvorsorge']
  ,['postEventWellbeing','Bienestar posterior','Post-event wellbeing','Bien-être après l’événement','Bem-estar após o evento','Wohlbefinden nach dem Ereignis']
  ,['supportNetworks','Redes de apoyo','Support networks','Réseaux de soutien','Redes de apoio','Unterstützungsnetzwerke']
  ,['coordinatedResources','recurso(s) coordinados','coordinated resource(s)','ressource(s) coordonnée(s)','recurso(s) coordenado(s)','koordinierte Ressource(n)']
]

export const legacySourceToKey = new Map(rows.map(([key, source]) => [source, key]))
export const legacyResources = Object.fromEntries(['es','en','fr','pt','de'].map((language, index) => [language, Object.fromEntries(rows.map(row => [row[0], row[index + 1]]))]))
