export const makeNotification = (type, title, message, meta = {}) => ({
  id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  type, title, message, read: false, at: new Date().toISOString(), ...meta
})
