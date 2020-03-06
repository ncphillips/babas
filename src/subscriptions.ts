/**
 * Listens for changes to `T` objects
 */
export type Listener<T> = (t: T) => void

/**
 * Unsubscribes a Listener when called
 */
export type Unsubscribe = () => void

/**
 * A map of keysof T to booleans.
 *
 * @example
 *
 * In the example below the `name` will be watched.
 *
 * ```js
 * interface User {
 *  name: string
 *  age: number
 * }
 *
 * let sub: SubscribeTo<User> = { name: boolean }
 * ```
 */
export type SubscribeTo<T> = {
  [P in keyof T]?: boolean
}
