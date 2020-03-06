import { createCollection } from '../src'

interface User {
  name: string
  age: number
}

describe('watch-colletion', () => {
  it('accepts an initial state', () => {
    const bob = { name: 'Bob', age: 25 }

    const users = createCollection<User>({ bob })

    expect(users.bob).toBe(bob)
  })
  describe('Object.keys(collection)', () => {
    it('excludes collection methods', () => {
      const bob = { name: 'Bob ' }

      const ids = Object.keys(createCollection({ bob }))

      expect(ids).toEqual(['bob'])
    })
  })
  describe('adding entries', () => {
    let cb = jest.fn()
    let bob = { name: 'Bob', age: 25 }
    let users = createCollection<User>()

    beforeEach(() => {
      cb = jest.fn()
      bob = { name: 'Bob', age: 25 }
      users = createCollection<User>()
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
    let users = createCollection<User>({ bob })

    beforeEach(() => {
      cb = jest.fn()
      bob = { name: 'Bob', age: 25 }
      users = createCollection<User>({ bob })
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

  describe('toArray', () => {
    it('lists all entries in an array', () => {
      const bob = { name: 'Bob', age: 26 }
      const bill = { name: 'bill', age: 17 }
      const betty = { name: 'Betty', age: 56 }
      const users = createCollection({
        bill,
        bob,
        betty,
      })

      let userArray = users.toArray()

      expect(userArray).toContain(bob)
      expect(userArray).toContain(bill)
      expect(userArray).toContain(betty)
    })
  })
})
