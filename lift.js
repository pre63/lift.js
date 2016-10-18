/* jshint -W097, esversion: 6, strict: true, node: true */
/* global module */
'use strict';

const isFunction = (f) => !!(f && f.constructor && f.call && f.apply);

const idFunction = (value) => value;

const isSome = (value) => !isNone(value);

const isNone = (value) => value === null || value === undefined;

export const Monad = (modifier) => {
  const prototype = Object.create({ is_monad: true });
  const unit = (value) => {
    const run = (value, func, args) => isFunction(func) ? func(value, ...(args || [])) : monad;
    prototype.bind = (func, args) => run(value, func, args);

    const monad = Object.create(prototype);
    monad.of = monad.pure = (value) => {
      const m = run(value, (value) => value);
      return m && m.is_monad ? m : unit(m);
    };
    monad.get = () => value;
    monad.chain = monad.flatMap = monad.bind;
    monad.map = (func) => unit(func(value));
    monad.join = () => monad.bind(idFunction);
    monad.toMaybe = () => Maybe(value);
    monad.run = (func) => { run(value, func); return monad; };

    if (isFunction(modifier)) {
      modifier(monad, value);
    }
    return monad;
  };

  const apply = (prototype, name, func, unit) => {
    prototype[name] = func;
    return unit;
  };

  unit.lift = (name, func) => apply(prototype, name, (...args) => {
    const m = prototype.bind(func, args);
    return (m && m.is_monad) ? m : unit(m);
  }, unit);

  unit.lift_value = (name, func) => apply(prototype, name, (...args) => prototype.bind(func, args), unit);

  unit.method = (name, func) => apply(prototype, name, func, unit);

  return unit;
};

export const Just = Monad();

export const Maybe = Monad((monad, value) => {
  const valueIsNone = isNone(value);
  monad.none = monad.nothing = () => Maybe();
  monad.isNone = monad.isNothing = () => valueIsNone;
  monad.isSome = monad.isJust = () => !valueIsNone;
  monad.orSome = monad.orJust = (orValue) => valueIsNone ? orValue : value;
  monad.orElse = (orMonad) => valueIsNone ? orMonad : monad;
  monad.bind = valueIsNone ? () => monad : monad.bind;
  const run = monad.run;
  monad.run = (func) => { (valueIsNone ? () => { } : run)(value, func); return monad; };
});

const successFactory = (value) => Success(value);
const failFactory = (value) => Fail(value);

const validFunctions = (monad, value) => {
  monad.success = monad.s = successFactory;
  monad.fail = monad.f = failFactory;
  monad.isSuccess = () => monad.isSuccessValue;
  monad.isFail = () => !monad.isSuccessValue;
  monad.ap =
    validationWithFn =>
      monad.isSuccess() ?
        validationWithFn.map(fn => fn(value)) :
        (validationWithFn.isFail() ?
          monad.fail([].concat(value, validationWithFn.fail()))
          : monad);
};

const Success = Monad((monad, value) => {
  monad.isSuccessValue = true;
  validFunctions(monad, value);
});

const Fail = Monad((monad, value) => {
  monad.isSuccessValue = false;
  validFunctions(monad, value);
});

export const Valid = Monad((monad, value) => {
  validFunctions(monad, value);
});

Valid.success = Valid.s = successFactory;
Valid.fail = Valid.f = failFactory;

