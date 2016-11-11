[![atomable](https://img.shields.io/badge/atomable.io--blue.svg)](http://atomable.io)
[![Build Status](https://travis-ci.org/atomable/lift.js.svg?branch=master)](https://travis-ci.org/atomable/lift.js)
# lift.js — Write less code.

## Introduction
lift.js is a compact monad opinionated javascript library. It implements `Just` (Identity), `Maybe`, `Valid` (Validation) and a nice `Monad` factory. The `unit` comes with a `lift` function so you can add functionnality later in code to your monad. It's ment to be flexible and simple to use. It's written with es6 so it's less than 100 lines.

## Installation
### [npm](https://www.npmjs.com/package/liftjs)
```
npm install liftjs
```
### [yarn](https://yarnpkg.com/)
```
yarn add liftjs
```

## Source code | fork | pull request | issues
https://github.com/atomable/lift.js

## Importing

All the following work, pick your demon. `lift.js` can be required directly for es next project or you can use the `lift-min.js` for all legacy applications.

```javascript
var lift = require('liftjs');

const lift = require('liftjs');

import lift from 'liftjs';

import { Monad, Just, Maybe, Valid, Curry } from 'liftjs';
```


## Monad Factory
```
Monad(modifier[monad, value]: null) : unit
```
```javascript
const Person = Monad();
const person = Person({ firstname: 'Bill', lastname: 'Murray' });

// with a modifier
const doubleIt = Monad((monad, value) => {
  monad.double = value * 2;
});

const two = doubleIt(2);
two.double();
// 4

```

## lift

With the `lift` function you can add function at any time on the monads.

```
Monad[A].lift[name, func[A] : Monad[A]];
```
```javascript
const justWithLog = Just(5);
Just.lift('log', console.log);
justWithLog.log();
// console> 5
```

You can also use it on your custom monads.

```javascript
const Person = Monad();
const person = Person({ firstname: 'Bill', lastname: 'Murray' });

const FullName = Monad();
Person.lift('compose', person => FullName(`${person.firstname}, ${person.lastname}`));

person.compose().run(console.log);
// console> Bill, Murray
```

## Just

`Just` is an implementaion of the `Identity` monad. It's called `Just` because an 8 character variable is just too long.

**The folowing function are available on `Just`, `Maybe`, `Valid`.**

### bind, alias: chain
```
Monad[A].bind[func[A] : Monad[B], args] : Monad[B]
```
```javascript
const justWithValue = Just(5).bind((value)=> Just(value));

// Just[5]
```

### of
```
Monad[A].of[B] : Monad[B]
```
```javascript
const justWithValue = Just(5).of(6);
// Just[6]

const justWithValue = Just(5).of(Just(6));
// Just[6]
```

### get
```
Monad[A].get[] : A
```
```javascript
const value = Just(5).get();
// 5
```

### map
```
Monad[A].map[func[A] : B ] : Monad[B]
```
```javascript
const justWithValue = Just(7).map(value => value * 2);
// Just[14]
```

### join
```
Monad[Monad[A]].join[] : Monad[A]
```
```javascript
const justWithValue = Just(Just(5)).join()
// Just[5]
```
### toMaybe
```
Monad[A].toMaybe[] : Maybe[A]
```
```javascript
const maybeWithValue = Just(5).toMaybe();
// Maybe[5]
```

### run
```
Monad[A].run[func[A] : null]: Monad[A]
```
```javascript
Just(5).run(value => console.log(value));
// console> 5
```

## Maybe

###
```
Maybe(A) : Maybe[A]
```
```javascript
const maybeWithoutValue = Maybe()
// Maybe[]

const maybeWithValue = Maybe(2)
// Maybe[2]

const maybeWithoutValue = Maybe(undefined)
// Maybe[]

const maybeWithoutValue = Maybe(null)
// Maybe[]
```

### isNothing, alias: n
```
Maybe[A].isNothing[] : boolean
```
```javascript
const value = Maybe(5).isNothing();
// false

const value = Maybe(5).n();
// false
```

### is, alias: i
```
Maybe[A].is[] : boolean
```
```javascript
const value = Maybe(5).is();
// true

const value = Maybe(5).i();
// true
```

### or, alias: o
```
Maybe[A].or[B] : A or B
```
```javascript
const maybeWithValue = Maybe().or(15);
// 15
```

### else, alias; e
```
Maybe[A].else[Monad[B]] : Maybe[A] or Monad[B]
```
```javascript
const maybeWithValue = Maybe(5).else(Maybe(15));
// Maybe[5]

const maybeWithValue = Maybe().e(Just(15));
// Just[15]
```

## Curry
`Curry` is a factory that takes a function and returs a curried function.
```
Curry(func) : func
```

```javascript
const curried = Curry((a, b) => a * b);
curried(3)(6);
// 18

Curry((a, b, c) => a + b + c)(1, 2, 3)
// 6
```

## Roadmap

I don't plan on adding all the typical monads to the library, if you feel one should be added you are welcome to make a pull request or to fork. I'm thinking of Free, IO and List, but not sure yet. It will depend on what I use in my own projects.

Below are the things that I actually plan on doing. Soon.

- document `Valid`
- document `lift_value` function
- document `method` function
- add List monad
- `ap` function just `Just` and `Maybe` & tests
- tests for lift functions


## Change Log
 - 1.2.0 : I've changed the Maybe api qute a bit, orSome, orElse, none, are replaced.

## Links

- [npm](https://www.npmjs.com/package/liftjs)
- [atomable](https://github.com/atomable/atomable)
- [@pre63](http://twitter.com/pre63)

## Author

Written and maintained by [pre63](http://twitter.com/pre63).

Sponsored by [atomable](https://github.com/atomable/atomable).

Based on [Douglas Crockford MONAD](https://github.com/douglascrockford/monad/blob/master/monad.js).

Special thanks to [Monet](https://github.com/cwmyers/monet.js) for the inspiration.
