export const MEDICAL_NETWORK_VERSION = 2

// Los nombres y las coordenadas representan centros reales de la red local.
// Capacidad, demanda y disponibilidad son datos simulados para la demostración.
export const MEDICAL_CENTERS = Object.freeze([
  {
    id: 'HOSP-1',
    name: 'Hospital Monseñor Víctor Manuel Sanabria Martínez',
    shortName: 'Hospital Monseñor Sanabria',
    mapCode: 'HMS',
    type: 'Hospital regional',
    network: 'CCSS',
    address: 'Avenida John F. Kennedy, INVU de Barranca',
    location: { lat: 9.988534, lng: -84.719061 },
    status: 'available',
    capacity: 24,
    receivesTransfers: true,
    emergencyCare: true,
  },
  {
    id: 'HOSP-2',
    name: 'Área de Salud Barranca · Clínica Dr. Roberto Soto',
    shortName: 'Área de Salud Barranca',
    mapCode: 'ASB',
    type: 'Área de salud',
    network: 'CCSS',
    address: 'Avenida Camarón, Barranca',
    location: { lat: 9.97932, lng: -84.72238 },
    status: 'available',
    capacity: 10,
    receivesTransfers: false,
    emergencyCare: false,
  },
  {
    id: 'HOSP-3',
    name: 'Área de Salud Chacarita · Clínica Dr. Francisco Quintana',
    shortName: 'Área de Salud Chacarita',
    mapCode: 'ASC',
    type: 'Área de salud',
    network: 'CCSS',
    address: 'Avenida José María Cañas, Chacarita',
    location: { lat: 9.97995, lng: -84.76514 },
    status: 'high_demand',
    capacity: 6,
    receivesTransfers: false,
    emergencyCare: false,
  },
  {
    id: 'HOSP-4',
    name: 'Área de Salud San Rafael de Puntarenas',
    shortName: 'Área de Salud San Rafael',
    mapCode: 'ASR',
    type: 'Área de salud',
    network: 'CCSS',
    address: 'Calle 9, Puntarenas centro',
    location: { lat: 9.97594, lng: -84.83633 },
    status: 'available',
    capacity: 8,
    receivesTransfers: false,
    emergencyCare: false,
  },
  {
    id: 'HOSP-5',
    name: 'EBAIS El Roble',
    shortName: 'EBAIS El Roble',
    mapCode: 'ER',
    type: 'EBAIS',
    network: 'CCSS',
    address: 'Avenida 3, El Roble',
    location: { lat: 9.98142, lng: -84.73175 },
    status: 'available',
    capacity: 4,
    receivesTransfers: false,
    emergencyCare: false,
  },
])

export const MEDICAL_UNIT_BASES = Object.freeze({
  'AMB-014': 'HOSP-1',
  'AMB-008': 'HOSP-2',
  'AMB-021': 'HOSP-3',
  'AMB-030': 'HOSP-1',
  'EMS-003': 'HOSP-5',
})

export function getMedicalCenter(hospitalId, hospitals = MEDICAL_CENTERS) {
  return hospitals.find(hospital => hospital.id === hospitalId) || null
}

export function migrateMedicalNetwork(database) {
  if (Number(database?.medicalNetworkVersion || 0) >= MEDICAL_NETWORK_VERSION) return database

  const hospitals = MEDICAL_CENTERS.map(center => ({ ...center, location: { ...center.location } }))
  const units = (database.units || []).map(unit => {
    const baseHospitalId = MEDICAL_UNIT_BASES[unit.id]
    if (!baseHospitalId) return unit
    const hospital = getMedicalCenter(baseHospitalId, hospitals)
    if (!hospital) return unit
    const base = { ...hospital.location }
    return {
      ...unit,
      baseHospitalId,
      base,
      location: unit.status === 'available' ? { ...base } : unit.location,
    }
  })

  const incidents = (database.incidents || []).map(incident => {
    const destinationId = incident.hospitalDestination?.id
    const hospitalDestination = destinationId ? getMedicalCenter(destinationId, hospitals) : null
    return hospitalDestination ? { ...incident, hospitalDestination } : incident
  })

  return {
    ...database,
    medicalNetworkVersion: MEDICAL_NETWORK_VERSION,
    hospitals,
    units,
    incidents,
  }
}
