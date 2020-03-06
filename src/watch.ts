import { Unsubscribe, SubscribeTo } from './subscriptions'

export type Subscribable<T> = T & SubscribableMethods<T>

export type Listener<T> = (t: T, prop: keyof SubscribeTo<T>) => void

export interface SubscribableMethods<T> {
  subscribe(listener: Listener<T>, subscription?: SubscribeTo<T>): Unsubscribe
  unsubscribe(listener: Listener<T>): void
}

export function watch<T extends object>(target: T): Subscribable<T> {
  const subscribers: {
    listener: Listener<Subscribable<T>>
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
    subscribe(
      listener: Listener<Subscribable<T>>,
      subscription: SubscribeTo<T>
    ) {
      subscribers.push({
        listener,
        subscription,
      })

      return () => methods.unsubscribe(listener)
    },
    unsubscribe(listener: Listener<Subscribable<T>>) {
      const index = subscribers.findIndex(({ listener: cb }) => cb === listener)
      subscribers.splice(index, 1)
    },
  }

  function notifyChangeFor(prop: keyof SubscribeTo<T>) {
    subscribers.forEach(({ subscription, listener }) => {
      if (!subscription || subscription[prop]) {
        listener(subscribable, prop)
      }
    })
  }

  return subscribable
}
