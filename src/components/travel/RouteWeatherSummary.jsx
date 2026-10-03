import { CloudRain, Wind } from 'lucide-react'
import { useTranslation } from 'react-i18next'
export function RouteWeatherSummary({ weather }) { const {t}=useTranslation(); if (!weather) return null; return <section className="route-weather-summary"><CloudRain/><div><h2>{t('travel.weather')}</h2><p>{weather.unavailable ? t('travel.weatherUnavailable') : `${weather.temperature ?? '—'} °C · ${t('travel.precipitation')} ${weather.precipitation ?? 0} mm · ${t('travel.wind')} ${weather.wind ?? '—'} km/h`}</p>{weather.warning && <strong><Wind size={14}/>{weather.warning}</strong>}</div></section> }
