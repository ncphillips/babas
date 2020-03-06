import { Unsubscribe, SubscribeTo, Listener } from './subscriptions'

export function watch<T extends object>(target: T): T & Sub<T> {
  const subscribableTarget = target as T & Sub<T>

  const subscribers: {
    cb: Listener<T>
    subscription: SubscribeTo<T>
  }[] = []

  function subscribe(cb: Listener<T>, subscription: SubscribeTo<T>) {
    subscribers.push({
      cb,
      subscription,
    })

    return () => unsubscribe(cb)
  }

  function unsubscribe(removeCB: Listener<T>) {
    const index = subscribers.findIndex(({ cb }) => cb === removeCB)
    subscribers.splice(index, 1)
  }

  function notifyChangeFor(prop: keyof (T & SubscribeTo<T>), obj: T) {
    subscribers.forEach(({ subscription, cb }) => {
      if (!subscription || subscription[prop]) {
        cb(obj)
      }
    })
  }

  const p = new Proxy<T & Sub<T>>(subscribableTarget, {
    get: function(obj, prop: keyof (T & SubscribeTo<T>)) {
      if (prop === 'subscribe') {
        return subscribe
      }
      if (prop === 'unsubscribe') {
        return unsubscribe
      }

      return obj[prop]
    },
    set: function(obj, prop: keyof (T & SubscribeTo<T>), value) {
      if (prop === 'subscribe' || prop === 'unsubscribe') {
        return true
      }

      obj[prop] = value
      notifyChangeFor(prop, { ...obj })

      return true
    },
  })

  return p
}

export interface Sub<T> {
  subscribe(cb: Listener<T>, subscription?: SubscribeTo<T>): Unsubscribe
  unsubscribe(cb: Listener<T>): void
}
