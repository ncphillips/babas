[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fncphillips%2Fbabas%2Fbadge&style=flat)](https://actions-badge.atrox.dev/ncphillips/babas/goto)[![GitHub license](https://img.shields.io/github/license/ncphillips/babas)](https://github.com/ncphillips/babas/blob/master/LICENSE)![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

# babas

A tiny library for watching objects.

## `watch`

**Watching all Values**

By default all values are watched:

```js
import { watch } from 'babas'

const user = watch({ name: 'Bob', age: 25 })

user.subscribe((user, propName) => {
  console.log(`Updated ${propName} for user.`)
})

user.name = 'Bill' // User name updated

user.age = 26 // User age updated
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

**Unsubscribe**

```js
import { watch } from 'babas'

const user = watch({ name: 'Bob', age: 25 })

const unsubscribe = user.subscribe(() => console.log('User updated'))

user.name = 'Bill' // User updated

unsubscribe()

user.age = 26
```

**Unsubscribe Explicit**

```js
import { watch } from 'babas'

const user = watch({ name: 'Bob', age: 25 })

const onUserDidUpdate = () => console.log('User updated')

user.subscribe(onUserDidUpdate)

user.name = 'Bill' // User updated

user.unsubscribe(onUserDidUpdate)

user.age = 26
```

## `createCollection`

**Creating Collections**

```js
import { createCollection } from 'babas'

const bob = {
  name: 'Bob',
  age: 25,
}

const users = createCollection({ bob })
```

**Subscribing and Unsubscribe**

```js
const unsubscribe = users.subscribe((users, { change, entry }) => {
  if (change === 'set') {
    console.log(`${entry.name} can come!`)
  } else {
    console.log(`${entry.name} can no longer attend :(`)
  }

  console.log(`There are now ${users.toArray().length} guests`)
})

unsubscribe()
```

**Adding Entries**

There are 2 ways to add entries:

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

**Custom Collection Methods**

```js
import { createCollection } from 'babas'

const users = createCollection({}, collection => ({
  add(user) {
    return (collection[user.id] = user)
  },
  remove(user) {
    delete collection[user.id]
  },
}))

user.add({ id: 'janet', name: 'Janet', age: 23 }
user.add({ id: 'polly', name: 'Polly', age: 54 }
```

## Thanks

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).
