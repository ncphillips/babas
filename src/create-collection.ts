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

export type Collection<T> = Entries<T> & CollectionMethods<Entries<T>>

export interface Change<T> {
  id: string
  change: 'set' | 'delete'
  entry: T
}

export function createCollection<T>(entries: Entries<T> = {}): Collection<T> {
  const subscribers: {
    listener: CollectionListener<T>
  }[] = []

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
  }

  function notifyChange(change: Change<T>) {
    subscribers.forEach(({ listener }) => {
      listener(watchableCollection, change)
    })
  }

  let watchableCollection = new Proxy<Collection<T>>(entries as Collection<T>, {
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
  })
  return watchableCollection
}
