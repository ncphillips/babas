interface Collection<T> {
  [key: string]: T
}

export function watchCollection<T>(
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

export interface Sub<T> {
  subscribe(
    cb: SubscriptionCallback<T>,
    subscription?: Subscription<T>
  ): Unsubscribe
  unsubscribe(cb: SubscriptionCallback<T>): void
  add(id: string, item: T): T
  remove(id: string): T | undefined
  find(id: string): T | undefined
}

// @ts-ignore
export type SubscriptionCallback<T> = () => void
export type Unsubscribe = () => void
export type Subscription<T> = {
  [P in keyof T]?: boolean
}
