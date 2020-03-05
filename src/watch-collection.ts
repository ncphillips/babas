interface Collection<T> {
  [key: string]: T;
}

export function watchCollection<T extends Indexed>(
  collection: Collection<T> = {}
): Collection<T> & Sub<T> {
  const subscribers: {
    cb: SubscriptionCallback<T>;
  }[] = [];

  function subscribe(cb: SubscriptionCallback<T>) {
    subscribers.push({
      cb,
    });

    return () => unsubscribe(cb);
  }

  function unsubscribe(removeCB: SubscriptionCallback<T>) {
    const index = subscribers.findIndex(({ cb }) => cb === removeCB);
    subscribers.splice(index, 1);
  }

  function notifyChange() {
    subscribers.forEach(({ cb }) => {
      cb();
    });
  }

  let watchableCollection = new Proxy<Collection<T> & Sub<T>>(
    collection as Collection<T> & Sub<T>,
    {
      get: function(obj, prop: string) {
        if (prop === 'subscribe') {
          return subscribe;
        }
        if (prop === 'unsubscribe') {
          return unsubscribe;
        }

        if (prop === 'add') {
          return (item: T) => {
            watchableCollection[item.id] = item;
          };
        }

        if (prop === 'remove') {
          return (item: T) => delete watchableCollection[item.id];
        }

        if (prop === 'find') {
          return (name: string) => watchableCollection[name];
        }

        return obj[prop];
      },
      set: function(obj, prop: string, value) {
        if (prop === 'subscribe' || prop === 'unsubscribe') {
          return false;
        }

        obj[prop] = value;

        notifyChange();
        return true;
      },
      deleteProperty: function(obj, prop: string) {
        if (prop === 'subscribe' || prop === 'unsubscribe') {
          return false;
        }

        delete obj[prop];
        notifyChange();
        return true;
      },
    }
  );
  return watchableCollection;
}

interface Indexed {
  id: string;
}

export interface Sub<T extends Indexed> {
  subscribe(
    cb: SubscriptionCallback<T>,
    subscription?: Subscription<T>
  ): Unsubscribe;
  unsubscribe(cb: SubscriptionCallback<T>): void;
  add(item: T): T;
  remove(item: T): T | undefined;
  find(name: string): T | undefined;
}

// @ts-ignore
export type SubscriptionCallback<T> = () => void;
export type Unsubscribe = () => void;
export type Subscription<T> = {
  [P in keyof T]?: boolean;
};
