import { watchCollection } from '../src';

interface User {
  id: string;
  name: string;
  age: number;
}

describe('watch-colletion', () => {
  it('accepts an initial state', () => {
    const bob = { id: 'bob', name: 'Bob', age: 25 };

    const users = watchCollection<User>({ bob });

    expect(users.bob).toBe(bob);
  });
  describe('Object.keys(collection)', () => {
    it('excludes collection methods', () => {
      const bob = { id: 'bob', name: 'Bob ' };

      const ids = Object.keys(watchCollection({ bob }));

      expect(ids).toEqual([bob.id]);
    });
  });
  describe('adding entries', () => {
    let cb = jest.fn();
    let bob = { id: 'bob', name: 'Bob', age: 25 };
    let users = watchCollection<User>();

    beforeEach(() => {
      cb = jest.fn();
      bob = { id: 'bob', name: 'Bob', age: 25 };
      users = watchCollection<User>();
    });

    describe('using collection.add(entry)', () => {
      it('calls subscriber', () => {
        users.subscribe(cb);

        users.add(bob);

        expect(cb).toHaveBeenCalled();
      });

      it('adds the entry to the collection', () => {
        users.add(bob);

        expect(users.bob).toBe(bob);
        expect(users[bob.id]).toBe(bob);
      });
    });

    describe('using collection[id] = entry', () => {
      it('calls subscriber', () => {
        users.subscribe(cb);

        users[bob.id] = bob;

        expect(cb).toHaveBeenCalled();
      });

      it('adds the entry to the collection', () => {
        users[bob.id] = bob;

        expect(users.bob).toBe(bob);
        expect(users[bob.id]).toBe(bob);
      });
    });
  });
  describe('removing entries', () => {
    let cb = jest.fn();
    let bob = { id: 'bob', name: 'Bob', age: 25 };
    let users = watchCollection<User>({ bob });

    beforeEach(() => {
      cb = jest.fn();
      bob = { id: 'bob', name: 'Bob', age: 25 };
      users = watchCollection<User>({ bob });
    });

    describe('using collection.remove(entry)', () => {
      it('calls subscriber', () => {
        users.subscribe(cb);

        users.remove(bob);

        expect(cb).toHaveBeenCalled();
      });
      it('removes the entry', () => {
        users.remove(bob);

        expect(users.bob).toBeUndefined();
        expect(users[bob.id]).toBeUndefined();
      });
    });

    describe('useing delete collection[id]', () => {
      it('calls subscriber', () => {
        users.subscribe(cb);

        delete users[bob.id];

        expect(cb).toHaveBeenCalled();
      });
      it('removes the entry', () => {
        delete users[bob.id];

        expect(users.bob).toBeUndefined();
        expect(users[bob.id]).toBeUndefined();
      });
    });
  });
});
