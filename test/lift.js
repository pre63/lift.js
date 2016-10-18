/* jshint -W097, esversion: 6, strict: true, node: true */
/* global module */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isFunction = function isFunction(f) {
  return !!(f && f.constructor && f.call && f.apply);
};

var idFunction = function idFunction(value) {
  return value;
};

var isSome = function isSome(value) {
  return !isNone(value);
};

var isNone = function isNone(value) {
  return value === null || value === undefined;
};

var Monad = exports.Monad = function Monad(modifier) {
  var prototype = Object.create({ is_monad: true });
  var unit = function unit(value) {
    var run = function run(value, func, args) {
      return isFunction(func) ? func.apply(undefined, [value].concat(_toConsumableArray(args || []))) : monad;
    };
    prototype.bind = function (func, args) {
      return run(value, func, args);
    };

    var monad = Object.create(prototype);
    monad.of = monad.pure = function (value) {
      var m = run(value, function (value) {
        return value;
      });
      return m && m.is_monad ? m : unit(m);
    };
    monad.get = function () {
      return value;
    };
    monad.chain = monad.flatMap = monad.bind;
    monad.map = function (func) {
      return unit(func(value));
    };
    monad.join = function () {
      return monad.bind(idFunction);
    };
    monad.toMaybe = function () {
      return Maybe(value);
    };
    monad.run = function (func) {
      return run(value, func);
    };
    if (isFunction(modifier)) {
      modifier(monad, value);
    }
    return monad;
  };

  var apply = function apply(prototype, name, func, unit) {
    prototype[name] = func;
    return unit;
  };

  unit.lift = function (name, func) {
    return apply(prototype, name, function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var m = prototype.bind(func, args);
      return m && m.is_monad ? m : unit(m);
    }, unit);
  };

  unit.lift_value = function (name, func) {
    return apply(prototype, name, function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return prototype.bind(func, args);
    }, unit);
  };

  unit.method = function (name, func) {
    return apply(prototype, name, func, unit);
  };

  return unit;
};

var Just = exports.Just = Monad();

var Maybe = exports.Maybe = Monad(function (monad, value) {
  var valueIsNone = isNone(value);
  monad.none = monad.nothing = function () {
    return Maybe();
  };
  monad.isNone = monad.isNothing = function () {
    return valueIsNone;
  };
  monad.isSome = monad.isJust = function () {
    return !valueIsNone;
  };
  monad.orSome = monad.orJust = function (orValue) {
    return valueIsNone ? orValue : value;
  };
  monad.orElse = function (orMonad) {
    return valueIsNone ? orMonad : monad;
  };
  monad.bind = valueIsNone ? function () {
    return monad;
  } : monad.bind;
});

var validFunctions = function validFunctions(monad, value) {
  monad.success = monad.s = function (value) {
    return Success(value);
  };
  monad.fail = monad.f = function (value) {
    return Fail(value);
  };
  monad.of = function (value) {
    return Success(value);
  };
  monad.isSuccess = function () {
    return monad.isSuccessValue;
  };
  monad.isFail = function () {
    return !monad.isSuccessValue;
  };
  monad.ap = function (validationWithFn) {
    return monad.isSuccess() ? validationWithFn.map(function (fn) {
      return fn(value);
    }) : validationWithFn.isFail() ? monad.fail([].concat(value, validationWithFn.fail())) : monad;
  };
};

var Success = Monad(function (monad, value) {
  monad.isSuccessValue = true;
  validFunctions(monad, value);
});

var Fail = Monad(function (monad, value) {
  monad.isSuccessValue = false;
  validFunctions(monad, value);
});

var Valid = exports.Valid = Monad(function (monad, value) {
  validFunctions(monad, value);
});
