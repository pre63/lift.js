# lift.js
Because it can always be shorter.

## Introduction
lift.js is a compact monad opinionated javascript library. It implements Just, Maybe, Validation(Valid) and a nice Monad factory. The unit comes wotht he lift function so you can add functionnality later to your monad and event the builtin ones. It's ment to be flexible and shorter fucntion names. It's written with es6 so it's less than 100 lines.

## Installation
`lift.js` can be required directly for es next project or you can use the `lift-min.js` for all legacy applications.

npm: upcoming

## lift (lifting)

```javascript
  const justWithLog = Just(5).lift('log',console.log);
  justWithValue.log();
  // console> 5
```

## All Monads

The folowing function are available on all monads.

### bind, alias: chain flatMap
```javascript
  bind(func, args)

  const justWithValue = Just(5).bind((value)=> Just(value));

  // Just[5]
```
### of, alias: pure
```javascript
  of(value)

  const justWithValue = Just(5).of(6);
  // Just[6]

  const justWithValue = Just(5).of(Just(6));
  // Just[6]
```
### get
```javascript
  get()

  const value = Just(5).get();
  //5
```

### map
```javascript
  map(func)

  const justWithValue = Just(7).map(value => value * 2);
  // Just[14]
```

### join
```javascript
  join()

  const justWithValue = Just(Just(5)).join()
  // Just[5]
```
### toMaybe
```javascript
  toMaybe()

  const maybeWithValue = Just(5).toMaybe();
  // Maybe[5]
```

### run
```javascript
  run(func)

  Just(5).run(value => console.log(value));
  // console> 5
```

## Maybe

### none, alias: nothing
```javascript
  none()

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

  const value = Maybe(5).isNone();
  // false
```

### isJust, alias: orSome
```javascript
  isJust()

  const value = Maybe(5).isJust();
  // true
```

### orJust, alias: orSome
```javascript
  orJust()

  const maybeWithValue = Maybe().orJust(15);
  // Maybe[15]
```

### orElse
```javascript
  orElse(monad)

  const maybeWithValue = Maybe(5).orElse(Maybe(15));
  // Maybe[5]

  const maybeWithValue = Maybe().orElse(Just(15));
  // Just[5]
```

## Author

Written and maintained by [@ore63](http://twitter.com/pre63).

Based on [Douglas Crockford MONAD](https://github.com/douglascrockford/monad/blob/master/monad.js).
Special tanks to [Monet](https://github.com/cwmyers/monet.js) for the inspiration and a bunch of tests.