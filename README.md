# lift.js
Write less code.

## Introduction
lift.js is a compact monad opinionated javascript library. It implements Just (Identity), Maybe, Valid (Validation) and a nice Monad factory. The unit comes with a lift function so you can add functionnality later in code to your monad. It's ment to be flexible and faster to use. It's written with es6 so it's less than 100 lines.

## Installation
`lift.js` can be required directly for es next project or you can use the `lift-min.js` for all legacy applications.

#### [npm](https://www.npmjs.com/package/liftjs)
```
npm install liftjs
```

## lift (lifting)

With the `lift` function you can add function at any time on the monads.

```javascript
lift(name, func);
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

`Just` is an implementaion of the `Identity` monad. It's called `Just` becuse a 8 character variable is just too long.

**The folowing function are available on `Just`, `Maybe`, `Valid`.**

### bind, alias: chain flatMap
```javascript
bind(func, args)
```
```javascript
const justWithValue = Just(5).bind((value)=> Just(value));

// Just[5]
```
### of, alias: pure
```javascript
of(value)
```
```javascript
const justWithValue = Just(5).of(6);
// Just[6]

const justWithValue = Just(5).of(Just(6));
// Just[6]
```
### get
```javascript
get()
```
```javascript
const value = Just(5).get();
//5
```

### map
```javascript
map(func)
```
```javascript
const justWithValue = Just(7).map(value => value * 2);
// Just[14]
```

### join
```javascript
join()
```
```javascript
const justWithValue = Just(Just(5)).join()
// Just[5]
```
### toMaybe
```javascript
toMaybe()
```
```javascript
const maybeWithValue = Just(5).toMaybe();
// Maybe[5]
```

### run
```javascript
run(func)
```
```javascript
Just(5).run(value => console.log(value));
// console> 5
```

## Maybe

### none, alias: nothing
```javascript
none()
```
```javascript
const maybeWithValue = Maybe().none()
// Maybe[]

const maybeWithValue = Maybe().nothing()
// Maybe[]

const maybeWithValue = Maybe()
// Maybe[]

const maybeWithValue = Maybe(undefined)
// Maybe[]

const maybeWithValue = Maybe(null)
// Maybe[]
```

### isNone, alias: isNothing
```javascript
isNone()
```
```javascript
const value = Maybe(5).isNone();
// false
```

### isJust, alias: orSome
```javascript
isJust()
```
```javascript
const value = Maybe(5).isJust();
// true
```

### orJust, alias: orSome
```javascript
orJust()
```
```javascript
const maybeWithValue = Maybe().orJust(15);
// Maybe[15]
```

### orElse
```javascript
orElse(monad)
```
```javascript
const maybeWithValue = Maybe(5).orElse(Maybe(15));
// Maybe[5]

const maybeWithValue = Maybe().orElse(Just(15));
// Just[5]
```

## Roadmap

I don't plan on adding all the typical monads to the framework, if you feel one should be added you are welcome to make a pull request with the implementation. I'm thinking of Free, IO and List, but not sure yet. It will depend on what I use in my own projects.

Below are the things that I actually plan on doing. Soon.

- document `Valid`
- document `lift_value` function
- document `method` function
- `ap` function just `Just` and `Maybe`
- `curry` function
- 1 character alias for all methods that are more than 3 characters. Per example: `Just(5).b(v=> Just(v)).m(v => v * 2)`


## Links

- [npm](https://www.npmjs.com/package/liftjs)
- [atomable](https://twitter.com/atomable)
- [@pre63](http://twitter.com/pre63)

## Author

Written and maintained by [pre63](http://twitter.com/pre63).

Sponsored by [atomable](https://atomable.io).

Based on [Douglas Crockford MONAD](https://github.com/douglascrockford/monad/blob/master/monad.js).
Special thanks to [Monet](https://github.com/cwmyers/monet.js) for the inspiration.
