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

  it('accepts additional methods', () => {
    const bob = { id: 'test', name: 'Bob', age: 25 }

    type UserWithId = User & { id: string }
    interface Methods {
      add(entry: UserWithId): UserWithId
    }
    const users = createCollection<UserWithId, Methods>(
      { bob },
      collection => ({
        add(user) {
          return (collection[user.id] = user)
        },
      })
    )

    expect(users.bob).toBe(bob)
  })
  describe('Object.keys(collection)', () => {
    it('excludes collection methods', () => {
      const ids = Object.keys(createCollection())

      expect(ids).not.toContain('subscribe')
      expect(ids).not.toContain('unsubscribe')
    })
    it('includes they keys of the entrie', () => {
      const bob = { name: 'Bob ' }

      const ids = Object.keys(createCollection({ bob }))

      expect(ids).toContain('bob')
    })
  })
  describe('adding entries', () => {
    let listener = jest.fn()
    let bob = { name: 'Bob', age: 25 }
    let users = createCollection<User>()

    beforeEach(() => {
      listener = jest.fn()
      bob = { name: 'Bob', age: 25 }
      users = createCollection<User>()
    })
    it('tells the subscriber the change and the entry', () => {
      users.subscribe(listener)

      users.bob = bob

      expect(listener).toHaveBeenCalledWith(users, {
        change: 'set',
        id: 'bob',
        entry: bob,
      })
    })

    describe('using collection[id] = entry', () => {
      it('calls subscriber', () => {
        users.subscribe(listener)

        users['bob'] = bob

        expect(listener).toHaveBeenCalled()
      })

      it('adds the entry to the collection', () => {
        users['bob'] = bob

        expect(users.bob).toBe(bob)
        expect(users['bob']).toBe(bob)
      })
    })
  })
  describe('removing entries', () => {
    let listener = jest.fn()
    let bob = { name: 'Bob', age: 25 }
    let users = createCollection<User>({ bob })

    beforeEach(() => {
      listener = jest.fn()
      bob = { name: 'Bob', age: 25 }
      users = createCollection<User>({ bob })
    })

    describe('using delete collection[id]', () => {
      it('calls listener', () => {
        users.subscribe(listener)

        delete users['bob']

        expect(listener).toHaveBeenCalled()
      })
      it('does not call listener if entry does not exist', () => {
        delete users['does-not-exist']

        expect(listener).not.toHaveBeenCalled()
      })
      it('removes the entry', () => {
        delete users['bob']

        expect(users.bob).toBeUndefined()
        expect(users['bob']).toBeUndefined()
      })
      it('calls the listener with the change', () => {
        users.subscribe(listener)

        delete users['bob']

        expect(listener).toHaveBeenCalledWith(users, {
          change: 'delete',
          id: 'bob',
          entry: bob,
        })
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
