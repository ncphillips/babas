import { Unsubscribe, Listener } from './subscriptions'

export interface Entries<T> {
  [key: string]: T | undefined
}

export interface CollectionMethods<T> {
  subscribe(listener: Listener<Collection<T>>): Unsubscribe
  unsubscribe(onUpdate: Listener<Collection<T>>): void
  toArray(): T[]
}

export type Collection<T> = Entries<T> & CollectionMethods<Entries<T>>

export function createCollection<T>(entries: Entries<T> = {}): Collection<T> {
  const subscribers: {
    listener: Listener<Collection<T>>
  }[] = []

  const collectionMethods: { [key: string]: any } = {
    subscribe(listener: Listener<Collection<T>>) {
      subscribers.push({
        listener: listener,
      })

      return () => collectionMethods.unsubscribe(listener)
    },

    unsubscribe(listener: Listener<Collection<T>>) {
      const index = subscribers.findIndex(sub => sub.listener === listener)

      subscribers.splice(index, 1)
    },
    notifyChange() {
      subscribers.forEach(({ listener }) => {
        listener(watchableCollection)
      })
    },
    toArray(): T[] {
      return Object.keys(watchableCollection).map(
        id => watchableCollection[id]!
      )
    },
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

      collectionMethods.notifyChange()
      return true
    },
    deleteProperty: function(obj, prop: string) {
      const action = collectionMethods[prop]

      if (action) {
        return false
      }

      delete obj[prop]
      collectionMethods.notifyChange()
      return true
    },
  })
  return watchableCollection
}
