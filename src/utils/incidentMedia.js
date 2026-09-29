export const INCIDENT_MEDIA = {
  fire: '/assets/generated/incidents/incendio-estructural.webp',
  traffic_accident: '/assets/generated/incidents/accidente-vehicular.webp',
  flood: '/assets/generated/incidents/inundacion.webp',
  road_hazard: '/assets/generated/incidents/riesgo-vial.webp',
  landslide: '/assets/generated/incidents/riesgo-vial.webp',
  weather: '/assets/generated/incidents/inundacion.webp',
  medical: '/assets/generated/incidents/accidente-vehicular.webp',
  security: '/assets/generated/incidents/riesgo-vial.webp',
  missing_person: '/assets/stitch/satellite-city.webp',
  other: '/assets/presentation/report-preview.jpg'
}

export const incidentImage = (incident) => incident?.image || incident?.imageData || INCIDENT_MEDIA[incident?.category] || '/assets/presentation/report-preview.jpg'
