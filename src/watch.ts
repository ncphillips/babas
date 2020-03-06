import { Unsubscribe, SubscribeTo } from './subscriptions'

export type Subscribable<T> = T & SubscribableMethods<T>

export type Listener<T> = (t: T, prop: keyof SubscribeTo<T>) => void

export interface SubscribableMethods<T> {
  subscribe(cb: Listener<T>, subscription?: SubscribeTo<T>): Unsubscribe
  unsubscribe(cb: Listener<T>): void
}

export function watch<T extends object>(target: T): Subscribable<T> {
  const subscribers: {
    cb: Listener<Subscribable<T>>
    subscription: SubscribeTo<T>
  }[] = []

  const subscribable = new Proxy<Subscribable<T>>(target as Subscribable<T>, {
    get: function(obj, prop: keyof SubscribeTo<T>) {
      const action = methods[prop]
      if (action) return action

      return obj[prop]
    },
    set: function(obj, prop: keyof SubscribeTo<T>, value) {
      const action = methods[prop]
      if (action) return false

      obj[prop] = value
      notifyChangeFor(prop)

      return true
    },
  })

  const methods: any = {
    subscribe(cb: Listener<Subscribable<T>>, subscription: SubscribeTo<T>) {
      subscribers.push({
        cb,
        subscription,
      })

      return () => methods.unsubscribe(cb)
    },
    unsubscribe(removeCB: Listener<Subscribable<T>>) {
      const index = subscribers.findIndex(({ cb }) => cb === removeCB)
      subscribers.splice(index, 1)
    },
  }

  function notifyChangeFor(prop: keyof SubscribeTo<T>) {
    subscribers.forEach(({ subscription, cb }) => {
      if (!subscription || subscription[prop]) {
        cb(subscribable, prop)
      }
    })
  }

  return subscribable
}
