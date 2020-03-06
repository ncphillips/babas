import { Unsubscribe } from './subscriptions'

export type CollectionListener<Entry> = (
  colletion: Collection<Entry>,
  change: Change<Entry>
) => void

export interface Entries<Entry> {
  [key: string]: Entry | undefined
}

export interface CollectionMethods<Entry> {
  subscribe(listener: CollectionListener<Collection<Entry>>): Unsubscribe
  unsubscribe(onUpdate: CollectionListener<Collection<Entry>>): void
  toArray(): Entry[]
}

export type Collection<Entry, Methods = {}> = Entries<Entry> &
  CollectionMethods<Entry> &
  Methods

export interface Change<Entry> {
  id: string
  change: 'set' | 'delete'
  entry: Entry
}

export function createCollection<Entry, Methods = {}>(
  entries: Entries<Entry> = {},
  methods?: (c: Collection<Entry, Methods>) => Methods
): Collection<Entry, Methods> {
  const subscribers: {
    listener: CollectionListener<Entry>
  }[] = []

  let watchableCollection = new Proxy<Collection<Entry, Methods>>(
    entries as Collection<Entry, Methods>,
    {
      get: function(obj, prop: string) {
        const action = collectionMethods[prop]

        if (action) {
          return action
        }

        return obj[prop]
      },
      set: function(obj, prop: string, value) {
        const action = collectionMethods[prop]

        if (action) {
          return false
        }

        // @ts-ignore it's fine
        obj[prop] = value

        notifyChange({ change: 'set', entry: value, id: prop })
        return true
      },
      deleteProperty: function(obj, prop: string) {
        const action = collectionMethods[prop]

        if (action) {
          return false
        }

        const entry = obj[prop]

        if (entry) {
          delete obj[prop]
          notifyChange({ change: 'delete', entry, id: prop })
        }
        return true
      },
    }
  )

  const collectionMethods: { [key: string]: any } = {
    subscribe(listener: CollectionListener<Entry>) {
      subscribers.push({
        listener,
      })

      return () => collectionMethods.unsubscribe(listener)
    },

    unsubscribe(listener: CollectionListener<Entry>) {
      const index = subscribers.findIndex(sub => sub.listener === listener)

      subscribers.splice(index, 1)
    },

    toArray(): Entry[] {
      return Object.keys(watchableCollection).map(
        id => watchableCollection[id]!
      )
    },
    ...(methods ? methods(watchableCollection) : {}),
  }

  function notifyChange(change: Change<Entry>) {
    subscribers.forEach(({ listener }) => {
      listener(watchableCollection, change)
    })
  }

  return watchableCollection
}
