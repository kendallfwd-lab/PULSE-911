import { N8N_ENDPOINTS, requestN8N } from './n8nClient'

export const DATA_MODE = import.meta.env.VITE_PULSE_DATA_MODE === 'n8n' ? 'n8n' : 'local'

export const pulseDataGateway = {
  isRemote: DATA_MODE === 'n8n',
  async pull(payload = {}) { if (DATA_MODE === 'local') return null; return requestN8N(N8N_ENDPOINTS.sync, { action: 'pull', ...payload }) },
  async pushReport(report) { if (DATA_MODE === 'local') return { ok: true, local: true }; return requestN8N(N8N_ENDPOINTS.sync, { action: 'push_report', report }) },
  async pushConfirmation(confirmation) { if (DATA_MODE === 'local') return { ok: true, local: true }; return requestN8N(N8N_ENDPOINTS.sync, { action: 'push_confirmation', confirmation }) },
}
