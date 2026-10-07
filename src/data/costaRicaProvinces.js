export const COSTA_RICA_BOUNDS = Object.freeze({
  minLat: 8.02,
  minLng: -86.1,
  maxLat: 11.22,
  maxLng: -82.5,
})

export const COSTA_RICA_PROVINCES = Object.freeze([
  { id: 'all', name: 'Todas', center: { lat: 9.7489, lng: -83.7534 }, radiusKm: 10 },
  { id: 'san-jose', name: 'San José', center: { lat: 9.9281, lng: -84.0907 }, radiusKm: 10 },
  { id: 'alajuela', name: 'Alajuela', center: { lat: 10.0163, lng: -84.2147 }, radiusKm: 10 },
  { id: 'cartago', name: 'Cartago', center: { lat: 9.8644, lng: -83.9194 }, radiusKm: 10 },
  { id: 'heredia', name: 'Heredia', center: { lat: 9.9981, lng: -84.1170 }, radiusKm: 10 },
  { id: 'guanacaste', name: 'Guanacaste', center: { lat: 10.6346, lng: -85.4404 }, radiusKm: 10 },
  { id: 'puntarenas', name: 'Puntarenas', center: { lat: 9.9763, lng: -84.8384 }, radiusKm: 10 },
  { id: 'limon', name: 'Limón', center: { lat: 9.9913, lng: -83.0415 }, radiusKm: 10 },
])

export const COSTA_RICA_DESTINATION_SEEDS = Object.freeze([
  { id: 'seed-san-jose', name: 'San José', city: 'San José', province: 'San José', country: 'Costa Rica', lat: 9.9281, lng: -84.0907 },
  { id: 'seed-cartago', name: 'Cartago', city: 'Cartago', province: 'Cartago', country: 'Costa Rica', lat: 9.8644, lng: -83.9194 },
  { id: 'seed-heredia', name: 'Heredia', city: 'Heredia', province: 'Heredia', country: 'Costa Rica', lat: 9.9981, lng: -84.1170 },
  { id: 'seed-alajuela', name: 'Alajuela', city: 'Alajuela', province: 'Alajuela', country: 'Costa Rica', lat: 10.0163, lng: -84.2147 },
  { id: 'seed-liberia', name: 'Liberia', city: 'Liberia', province: 'Guanacaste', country: 'Costa Rica', lat: 10.6346, lng: -85.4404 },
  { id: 'seed-tamarindo', name: 'Tamarindo', city: 'Tamarindo', province: 'Guanacaste', country: 'Costa Rica', lat: 10.2993, lng: -85.8371 },
  { id: 'seed-jaco', name: 'Jacó', city: 'Jacó', province: 'Puntarenas', country: 'Costa Rica', lat: 9.6149, lng: -84.6298 },
  { id: 'seed-la-fortuna', name: 'La Fortuna', city: 'La Fortuna', province: 'Alajuela', country: 'Costa Rica', lat: 10.4710, lng: -84.6454 },
  { id: 'seed-monteverde', name: 'Monteverde', city: 'Monteverde', province: 'Puntarenas', country: 'Costa Rica', lat: 10.3009, lng: -84.8255 },
  { id: 'seed-manuel-antonio', name: 'Manuel Antonio', city: 'Quepos', province: 'Puntarenas', country: 'Costa Rica', lat: 9.3923, lng: -84.1365 },
  { id: 'seed-puerto-viejo', name: 'Puerto Viejo de Talamanca', city: 'Puerto Viejo', province: 'Limón', country: 'Costa Rica', lat: 9.6572, lng: -82.7535 },
])

export function getProvince(id) {
  return COSTA_RICA_PROVINCES.find(province => province.id === id) || COSTA_RICA_PROVINCES[0]
}
