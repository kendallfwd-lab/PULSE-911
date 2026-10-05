import fs from 'node:fs'
import path from 'node:path'

const directory = path.resolve('n8n/workflows')
const files = fs.readdirSync(directory).filter(file => file.endsWith('.json')).sort()
const expected = 16
if (files.length !== expected) throw new Error(`Expected ${expected} workflows, found ${files.length}`)

const names = new Set()
for (const file of files) {
  const workflow = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'))
  if (!workflow.name?.startsWith('PULSE — ')) throw new Error(`${file}: invalid workflow name`)
  if (names.has(workflow.name)) throw new Error(`${file}: duplicated workflow name`)
  names.add(workflow.name)
  if (!Array.isArray(workflow.nodes) || workflow.nodes.length < 3) throw new Error(`${file}: missing nodes`)
  if (!workflow.nodes.some(node => node.type === 'n8n-nodes-base.stickyNote')) throw new Error(`${file}: missing documentation note`)
  if (!workflow.settings || workflow.settings.executionOrder !== 'v1') throw new Error(`${file}: invalid execution settings`)
}

const schema = JSON.parse(fs.readFileSync(path.resolve('n8n/data-tables.schema.json'), 'utf8'))
if (!Array.isArray(schema.tables) || schema.tables.length !== 14) throw new Error('Expected 14 Data Table schemas')
console.log(`Validated ${files.length} workflows and ${schema.tables.length} Data Table schemas.`)
