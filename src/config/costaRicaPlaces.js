export const COSTA_RICA_PLACES = Object.freeze([
  { id: 'pulse-place-puntarenas', name: 'Puntarenas Centro', category: 'attractions', lat: 9.976, lng: -84.838, address: 'Puntarenas, Costa Rica', source: 'pulse_reference' },
  { id: 'pulse-place-jaco', name: 'Jacó', category: 'beaches', lat: 9.614, lng: -84.629, address: 'Garabito, Puntarenas, Costa Rica', source: 'pulse_reference' },
  { id: 'pulse-place-san-jose', name: 'San José', category: 'attractions', lat: 9.932, lng: -84.08, address: 'San José, Costa Rica', source: 'pulse_reference' },
  { id: 'pulse-place-manuel-antonio', name: 'Parque Nacional Manuel Antonio', category: 'parks', lat: 9.392, lng: -84.136, address: 'Quepos, Puntarenas, Costa Rica', source: 'pulse_reference' },
  { id: 'pulse-place-sjo', name: 'Aeropuerto Internacional Juan Santamaría', category: 'attractions', lat: 9.998, lng: -84.204, address: 'Alajuela, Costa Rica', source: 'pulse_reference' },
])

export const ROUTE_DESTINATIONS = Object.freeze(Object.fromEntries(COSTA_RICA_PLACES.map(place => [place.name, { lat: place.lat, lng: place.lng }])))
