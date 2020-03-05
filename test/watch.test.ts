import { watch } from '../src';

interface User {
  name: string;
  age: number;
}

describe('watch', () => {
  describe('without subscription', () => {
    it('calls the subscriber on any change', () => {
      const cb = jest.fn();
      const user = watch<User>({ name: 'Bob', age: 25 });
      user.subscribe(cb);

      user.name = 'Test';

      expect(cb).toHaveBeenCalled();
    });
  });
  describe('with `name` in the subcription', () => {
    it('calls the subscriber when `name` is changed', () => {
      const cb = jest.fn();
      const user = watch<User>({ name: 'Bob', age: 25 });
      user.subscribe(cb, { name: true });

      user.name = 'Test';

      expect(cb).toHaveBeenCalled();
    });

    it('does not call the subscriber when `age` is changed', () => {
      const subscriber = jest.fn();
      const user = watch<User>({ name: 'Bob', age: 25 });
      user.subscribe(subscriber, { name: true });

      user.age = 26;

      expect(subscriber).not.toHaveBeenCalled();
    });
  });
});
