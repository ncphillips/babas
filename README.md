![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

# babas

A tiny library for watching objects.

## `watch`

**Watching all Values**

By default all values are watched:

```js
import { watch } from 'babas'

const user = watch({ name: 'Bob', age: 25 })

user.subscribe(user => {
  console.log('User updated')
})

user.name = 'Bill' // User updated

user.age = 26 // User updated
```

**Watching Specific Values**

A `subscription` object can be passed as the second argument to restrict
which properties should be watched.

```js
import { watch } from 'babas'

const user = watch({ name: 'Bob', age: 25 })

user.subscribe(
  user => {
    console.log(`Happy Birthday ${user.name}, you're ${user.age} years old!`)
  },
  { age: true }
)

user.name = 'Bill'

user.age = 26 // Happy Birthday Bill, you're 26 years old!
```

## `createCollection`

```js
import { createCollection } from 'babas'

const bob = {
  name: 'Bob',
  age: 25,
}

const users = createCollection({ bob })
```

**Subscribing**

```js
const unsubscribe = users.subscribe(() => {
  console.log(`The guest list has changed.`)
})
```

**Adding Entries**

There are 3 ways to add entries:

```js
user.janet = { name: 'Janet', age: 23 }
user['polly'] = { name: 'Polly', age: 54 }
```

**Removing Entries**

There are 2 ways to remove entries:

```js
delete users.polly
delete users['bill']
```

## Thanks

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).
