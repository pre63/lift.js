const isFunction =
  func =>
    !!(func && func.constructor && func.call && func.apply)

const idFunction =
  value =>
    value

const isNone =
  value =>
    value === null || value === undefined

export const Curry =
  (func, ...args) =>
    (args.length >= func.length ? func(...args) : Curry.bind(this, func, ...args))

export const Monad = (modifier) => {
  const prototype = Object.create({ is_monad: true })
  const unit = (value) => {
    const monad = Object.create(prototype)

    const run = (value, func, args) => (isFunction(func) ? func(value, ...(args || [])) : monad)
    prototype.bind = (func, args) => run(value, func, args)

    monad.of = (value) => {
      const m = run(value, idFunction)
      return m && m.is_monad ? m : unit(m)
    }
    monad.fold = () => value
    monad.chain = monad.bind
    monad.map = func => unit(func(value))
    monad.join = () => monad.bind(idFunction)
    monad.toMaybe = () => Maybe(value)
    monad.run = func => (run(value, func), monad)

    if (isFunction(modifier)) {
      modifier(monad, value)
    }
    return monad
  }

  const apply = (prototype, name, func, unit) => {
    prototype[name] = func
    return unit
  }

  unit.lift = unit.l = (name, func) => apply(prototype, name, (...args) => {
    const m = prototype.bind(func, args)
    return (m && m.is_monad) ? m : unit(m)
  }, unit)

  unit.liftValue = unit.lv = (name, func) =>
    apply(prototype, name, (...args) => prototype.bind(func, args), unit)

  unit.method = unit.m = (name, func) =>
    apply(prototype, name, func, unit)

  return unit
}

export const Just = Monad()

export const Maybe = Monad((monad, value) => {
  const valueIsNone = isNone(value)
  monad.isNothing = monad.n = () => valueIsNone
  monad.is = () => !valueIsNone
  monad.or = orValue => (valueIsNone ? orValue : value)
  monad.else = orMonad => (valueIsNone ? orMonad : monad)
  monad.bind = valueIsNone ? () => monad : monad.bind
  monad.map = valueIsNone ? () => monad : monad.map
  const run = monad.run
  monad.run = func => ((valueIsNone ? () => { } : run)(value, func), monad)
})

const validFunctions = (monad, value) => {
  monad.success = monad.s = successFactory
  monad.fail = monad.f = failFactory
  monad.isSuccess = () => monad.isSuccessValue
  monad.isFail = () => !monad.isSuccessValue
  monad.ap =
    validationWithFn =>
      (monad.isSuccess() ? // eslint-disable-line
        validationWithFn.map(fn => fn(value)) :
        (validationWithFn.isFail() ?
          monad.fail([].concat(value, validationWithFn.fail()))
          : monad))
}

const Success = Monad((monad, value) => {
  monad.isSuccessValue = true
  validFunctions(monad, value)
})

const Fail = Monad((monad, value) => {
  monad.isSuccessValue = false
  validFunctions(monad, value)
})

const successFactory = value => Success(value)
const failFactory = value => Fail(value)

export const Valid = Monad((monad, value) => {
  validFunctions(monad, value)
})

Valid.success = Valid.s = successFactory
Valid.fail = Valid.f = failFactory

export const IO =
  func =>
    (...args) =>
      Monad((monad, value) => {
        monad.run = () => value(...args)
      })(func)

