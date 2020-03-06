import { Unsubscribe } from './subscriptions'

export type CollectionListener<T> = (
  colletion: Collection<T>,
  change: Change<T>
) => void

export interface Entries<T> {
  [key: string]: T | undefined
}

export interface CollectionMethods<T> {
  subscribe(listener: CollectionListener<Collection<T>>): Unsubscribe
  unsubscribe(onUpdate: CollectionListener<Collection<T>>): void
  toArray(): T[]
}

export type Collection<T, M = {}> = Entries<T> &
  CollectionMethods<Entries<T>> &
  M

export interface Change<T> {
  id: string
  change: 'set' | 'delete'
  entry: T
}

export function createCollection<T, M = {}>(
  entries: Entries<T> = {},
  methods?: (c: Collection<T, M>) => M
): Collection<T, M> {
  const subscribers: {
    listener: CollectionListener<T>
  }[] = []

  let watchableCollection = new Proxy<Collection<T, M>>(
    entries as Collection<T, M>,
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
    subscribe(listener: CollectionListener<T>) {
      subscribers.push({
        listener,
      })

      return () => collectionMethods.unsubscribe(listener)
    },

    unsubscribe(listener: CollectionListener<T>) {
      const index = subscribers.findIndex(sub => sub.listener === listener)

      subscribers.splice(index, 1)
    },

    toArray(): T[] {
      return Object.keys(watchableCollection).map(
        id => watchableCollection[id]!
      )
    },
    ...(methods ? methods(watchableCollection) : {}),
  }

  function notifyChange(change: Change<T>) {
    subscribers.forEach(({ listener }) => {
      listener(watchableCollection, change)
    })
  }

  return watchableCollection
}
