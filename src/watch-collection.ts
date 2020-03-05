interface Collection<T> {
  [key: string]: T
}

export function watchCollection<T extends Indexed>(
  collection: Collection<T> = {}
): Collection<T> & Sub<T> {
  const subscribers: {
    cb: SubscriptionCallback<T>
  }[] = []

  const collectionMethods: { [key: string]: any } = {
    subscribe(cb: SubscriptionCallback<T>) {
      subscribers.push({
        cb,
      })

      return () => collectionMethods.unsubscribe(cb)
    },

    unsubscribe(removeCB: SubscriptionCallback<T>) {
      const index = subscribers.findIndex(({ cb }) => cb === removeCB)
      subscribers.splice(index, 1)
    },
    add(item: T) {
      return (watchableCollection[item.id] = item)
    },
    remove(item: T) {
      delete watchableCollection[item.id]
    },
    find(name: string) {
      return watchableCollection[name]
    },
    notifyChange() {
      subscribers.forEach(({ cb }) => {
        cb()
      })
    },
  }

  let watchableCollection = new Proxy<Collection<T> & Sub<T>>(
    collection as Collection<T> & Sub<T>,
    {
      get: function(obj, prop: string) {
        const action = collectionMethods[prop]

        if (action) {
          return action
        }

        return obj[prop]
      },
      set: function(obj, prop: string, value) {
        if (prop === 'subscribe' || prop === 'unsubscribe') {
          return false
        }

        obj[prop] = value

        collectionMethods.notifyChange()
        return true
      },
      deleteProperty: function(obj, prop: string) {
        if (prop === 'subscribe' || prop === 'unsubscribe') {
          return false
        }

        delete obj[prop]
        collectionMethods.notifyChange()
        return true
      },
    }
  )
  return watchableCollection
}

interface Indexed {
  id: string
}

export interface Sub<T extends Indexed> {
  subscribe(
    cb: SubscriptionCallback<T>,
    subscription?: Subscription<T>
  ): Unsubscribe
  unsubscribe(cb: SubscriptionCallback<T>): void
  add(item: T): T
  remove(item: T): T | undefined
  find(name: string): T | undefined
}

// @ts-ignore
export type SubscriptionCallback<T> = () => void
export type Unsubscribe = () => void
export type Subscription<T> = {
  [P in keyof T]?: boolean
}
