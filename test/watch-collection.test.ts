import { watchCollection } from '../src'

interface User {
  name: string
  age: number
}

describe('watch-colletion', () => {
  it('accepts an initial state', () => {
    const bob = { name: 'Bob', age: 25 }

    const users = watchCollection<User>({ bob })

    expect(users.bob).toBe(bob)
  })
  describe('Object.keys(collection)', () => {
    it('excludes collection methods', () => {
      const bob = { name: 'Bob ' }

      const ids = Object.keys(watchCollection({ bob }))

      expect(ids).toEqual(['bob'])
    })
  })
  describe('adding entries', () => {
    let cb = jest.fn()
    let bob = { name: 'Bob', age: 25 }
    let users = watchCollection<User>()

    beforeEach(() => {
      cb = jest.fn()
      bob = { name: 'Bob', age: 25 }
      users = watchCollection<User>()
    })

    describe('using collection.add(entry)', () => {
      it('calls subscriber', () => {
        users.subscribe(cb)

        users.add('bob', bob)

        expect(cb).toHaveBeenCalled()
      })

      it('adds the entry to the collection', () => {
        users.add('bob', bob)

        expect(users.bob).toBe(bob)
        expect(users['bob']).toBe(bob)
      })
    })

    describe('using collection[id] = entry', () => {
      it('calls subscriber', () => {
        users.subscribe(cb)

        users['bob'] = bob

        expect(cb).toHaveBeenCalled()
      })

      it('adds the entry to the collection', () => {
        users['bob'] = bob

        expect(users.bob).toBe(bob)
        expect(users['bob']).toBe(bob)
      })
    })
  })
  describe('removing entries', () => {
    let cb = jest.fn()
    let bob = { name: 'Bob', age: 25 }
    let users = watchCollection<User>({ bob })

    beforeEach(() => {
      cb = jest.fn()
      bob = { name: 'Bob', age: 25 }
      users = watchCollection<User>({ bob })
    })

    describe('using collection.remove(id)', () => {
      it('calls subscriber', () => {
        users.subscribe(cb)

        users.remove('bob')

        expect(cb).toHaveBeenCalled()
      })
      it('removes the entry', () => {
        users.remove('bob')

        expect(users.bob).toBeUndefined()
        expect(users['bob']).toBeUndefined()
      })
    })

    describe('useing delete collection[id]', () => {
      it('calls subscriber', () => {
        users.subscribe(cb)

        delete users['bob']

        expect(cb).toHaveBeenCalled()
      })
      it('removes the entry', () => {
        delete users['bob']

        expect(users.bob).toBeUndefined()
        expect(users['bob']).toBeUndefined()
      })
    })
  })
})
