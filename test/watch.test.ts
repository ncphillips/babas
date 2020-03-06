import { watch } from '../src'

interface User {
  name: string
  age: number
}

describe('watch', () => {
  describe('without `subscribeTo`', () => {
    it('calls the subscriber on any change', () => {
      const cb = jest.fn()
      const user = watch<User>({ name: 'Bob', age: 25 })
      user.subscribe(cb)

      user.name = 'Test'

      expect(cb).toHaveBeenCalled()
    })
    it('passes the changed property', () => {
      const cb = jest.fn()
      const user = watch<User>({ name: 'Bob', age: 25 })
      user.subscribe(cb)

      user.name = 'Again'

      expect(cb).toHaveBeenCalledWith(user, 'name')
      expect(cb).not.toHaveBeenCalledWith(user, 'age')
    })
    it('passes both changed property', () => {
      const cb = jest.fn()
      const user = watch<User>({ name: 'Bob', age: 25 })
      user.subscribe(cb)

      user.name = 'Again'
      user.age = 15

      expect(cb).toHaveBeenCalledWith(user, 'name')
      expect(cb).toHaveBeenCalledWith(user, 'age')
    })
  })
  describe('with `name` in the `subscribeTo`', () => {
    it('calls the subscriber when `name` is changed', () => {
      const cb = jest.fn()
      const user = watch<User>({ name: 'Bob', age: 25 })
      user.subscribe(cb, { name: true })

      user.name = 'Test'

      expect(cb).toHaveBeenCalled()
    })

    it('does not call the subscriber when `age` is changed', () => {
      const subscriber = jest.fn()
      const user = watch<User>({ name: 'Bob', age: 25 })
      user.subscribe(subscriber, { name: true })

      user.age = 26

      expect(subscriber).not.toHaveBeenCalled()
    })
  })
})
