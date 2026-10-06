import { describe, expect, it } from 'vitest'
import { mergeRemoteCollections } from './PulseContext'

describe('mergeRemoteCollections', () => {
  it('keeps local publications when n8n returns an empty collection', () => {
    const local = { publications: [{ id: 'pub-1', title: 'Reporte local' }] }

    expect(mergeRemoteCollections(local, { publications: [] }, ['publications'])).toEqual(local)
  })

  it('merges remote deltas without removing publications that were not part of the response', () => {
    const local = { publications: [{ id: 'pub-1', status: 'pending' }, { id: 'pub-2', status: 'verified' }] }
    const remote = { publications: [{ id: 'pub-1', status: 'verified' }, { id: 'pub-3', status: 'published' }] }

    expect(mergeRemoteCollections(local, remote, ['publications']).publications).toEqual([
      { id: 'pub-3', status: 'published' },
      { id: 'pub-1', status: 'verified' },
      { id: 'pub-2', status: 'verified' },
    ])
  })
})
