import { describe, expect, it } from 'vitest'
import { isSoundTarget, normalizeUISound } from './UISoundContext'

describe('UI sound preferences', () => {
  it('uses a safe soft default and accepts the available tones', () => {
    expect(normalizeUISound(null)).toBe('soft')
    expect(normalizeUISound('unknown')).toBe('soft')
    expect(normalizeUISound('off')).toBe('off')
    expect(normalizeUISound('glass')).toBe('glass')
    expect(normalizeUISound('pulse')).toBe('pulse')
  })

  it('only identifies intentional interactive controls', () => {
    document.body.innerHTML = '<button id="button"><span id="inside">Abrir</span></button><button data-ui-sound-ignore id="ignored">Silencio</button><input id="input"><div id="plain"></div>'
    expect(isSoundTarget(document.getElementById('inside'))).toBe(true)
    expect(isSoundTarget(document.getElementById('ignored'))).toBe(false)
    expect(isSoundTarget(document.getElementById('input'))).toBe(false)
    expect(isSoundTarget(document.getElementById('plain'))).toBe(false)
  })
})
