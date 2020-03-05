# babas

A tiny library for watching objects.

## How to Use

### `watch`

```js
import { watch } from 'babas';

const user = watch({ name: 'Bob', age: 25 });

user.subscribe(
  user => {
    console.log(`Happy Birthday ${user.name}, you're ${user.age} years old!`);
  },
  { age: true }
);

user.name = 'Bill';

user.age = 26; // Happy Birthday Bill, you're 26 years old!
```

### `watchCollection`

```js
import { watch } from 'babas';

const bob = {
  id: 'bob',
  name: 'Bob',
  age: 25,
};

const users = watchCollection({ bob });

const unsubscribe = users.subscribe(() => {
  console.log(`The guest list has changed.`);
});

user.add({ id: 'bill', name: 'Bill', age: 30 }); //  The guest list has changed.
user['polly'] = { id: 'polly', name: 'Polly', age: 54 }; //  The guest list has changed.

delete users['bill']; //  The guest list has changed.
users.remove(bob); //  The guest list has changed.

unsubscribe();

delete users.polly;
user.janet = { id: 'janet', name: 'Janet', age: 23 };
```

## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for you convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

<img src="https://user-images.githubusercontent.com/4060187/52168303-574d3a00-26f6-11e9-9f3b-71dbec9ebfcb.gif" width="600" />

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

<img src="https://user-images.githubusercontent.com/4060187/52168322-a98e5b00-26f6-11e9-8cf6-222d716b75ef.gif" width="600" />

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

## Thanks

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).
