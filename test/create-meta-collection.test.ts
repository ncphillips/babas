import { createMetaCollection } from '../src/create-meta-collection'

describe('create-meta-collection', () => {
  describe('accessing a prop', () => {
    it('creates a corresponding collection with that name', () => {
      const meta = createMetaCollection()

      expect(meta.something).toBeDefined()

      expect(Object.keys(meta)).toEqual(['something'])
    })
  })
  it('', () => {
    interface Plugin {
      __type: string
      id: string
    }

    const meta = createMetaCollection<Plugin, {}>()

    const text = { __type: 'field', id: 'text' }

    meta.fields.text = text

    expect(meta.fields.toArray()).toContainEqual(text)
  })

  it('can add extra methods to the collections', () => {
    interface Plugin {
      __type: string
      id: string
    }

    interface Methods {
      add(plugin: Omit<Plugin, '__type'>): Plugin
    }

    const meta = createMetaCollection<Plugin, Methods>(col => ({
      add(plugin) {
        const __type: string = col.id as any

        return (col[plugin.id] = { __type, ...plugin })
      },
    }))

    const text = { id: 'text' }

    meta.fields.add(text)

    expect(meta.fields.toArray()).toContainEqual({
      __type: 'fields',
      id: 'text',
    })
  })
})
