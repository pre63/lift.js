/* jshint -W097, esversion: 6, strict: true, node: true */
/* global module, Promise, describe, it */
'use strict';

import { Valid, Maybe, Just, Prom, Monad, Curry } from './lift';
import should from 'should';

describe('A curry', () => {
  it('should curry a function', () =>
    should(Curry((a, b, c) => a + b + c)(1, 2, 3)).equal(6));

  const add = (a, b, c) => a + b + c;
  const multiply = (a, b) => a * b;

  it('should return a function that works like original without curring', () =>
    should(Curry(add)(1, 1, 1)).be.equal(add(1, 1, 1)));

  it('should return a function that works like original without curring', () =>
    should(Curry(multiply)(2, 2)).be.equal(multiply(2, 2)));

  it('should return a curried function', () =>
    should(Curry(add)(1)(1, 1)).be.equal(add(1, 1, 1)));

  it('should return a curried function', () =>
    should(Curry(add)(1)(2, 3)).be.equal(add(1, 2, 3)));

  it('should return a curried function', () =>
    should(Curry(add)(1, 2)(1)).be.equal(add(1, 2, 1)));

  it('should return a curried function', () =>
    should(Curry(add)(2)(1)(2)).be.equal(add(2, 1, 2)));

  it('should return a curried function', () =>
    should(Curry(multiply)(2)(3)).be.equal(multiply(2, 3)));

  it('should provide a curried function with no more arguments', () =>
    should(Curry(add)(1, 1, 1, 5, 22)).be.equal(add(1, 1, 1)));

  it('should provide a curried function with no more arguments', () =>
    should(Curry(add)(1)(1, 1, 3)).be.equal(add(1, 1, 1)));

  it('should provide a curried function with no more arguments', () =>
    should(Curry(add)(1)(2, 3, 5)).be.equal(add(1, 2, 3)));

  it('should provide a curried function with no more arguments', () =>
    should(Curry(add)(1, 2)(1, 1)).be.equal(add(1, 2, 1)));

  it('should provide a curried function with no more arguments', () =>
    should(Curry(add)(2)(1)(2, 3, 5, 7, 8)).be.equal(add(2, 1, 2)));

  it('should provide a curried function with no more arguments', () =>
    should(Curry(multiply)(2)(3, 22)).be.equal(multiply(2, 3)));

  it('should provide a curried function with no more arguments', () =>
    should(Curry(multiply)(2, 2, 3, 4)).be.equal(multiply(2, 2)));
});

describe('A lift', () => {
  it('should lift', () => {
    const justWithLog = Just(5);

    Just.lift('log', value => should(value).equal(5));

    justWithLog.log();
  });

  it('peron test', () => {
    const Person = Monad();
    const person = Person({ firstname: 'Bill', lastname: 'Murray' });

    const FullName = Monad();
    Person.lift('compose', person => FullName(`${person.firstname}, ${person.lastname}`));

    person.compose().run(console.log);
  });
});

describe('A just', () => {
  it('will be exactly 11', () => {
    const value = Just(11).get();
    should(value).be.exactly(11);
  });

  it('will be exactly 12 when map is called', () => {
    const value = Just(11).map((value) => value + 1).get();
    should(value).be.exactly(12);
  });

  it('will be exactly 13 when bind is called', () => {
    const value = Just(12).bind((value) => Just(value + 1)).get();
    should(value).be.exactly(13);
  });

  it('will be exactly 12 when chain is called', () => {
    const value = Just(12).chain((value) => Just(value)).get();
    should(value).be.exactly(12);
  });

  it('will be exactly 12 after flatmap', () => {
    const value = Just(12).flatMap((value) => Just(value)).get();
    should(value).be.exactly(12);
  });

  it('just.of || pure, shoud be 12', () => {
    const value = Just(17).of(12).get();
    should(value).be.exactly(12);
  });

  it('just.of || pure, shoud be 12', () => {
    const value = Just(17).of(Maybe(12)).get();
    should(value).be.exactly(12);
  });

  it('just.join, shoud be 12', () => {
    const value = Just(Just(12)).join().get();
    should(value).be.exactly(12);
  });
});

describe('A Maybe', () => {
  it('none should be Maybe()', () => {
    const value = Maybe(11).none();
    should(value).containEql(Maybe());
  });

  it('when map, should be 124', () => {
    const value = Maybe(123).map((val) => val + 1).get();
    should(value).equal(124);
  });

  it('when isSome, should be true', () => {
    const value = Maybe(123).isSome();
    should(value).be.true();
  });

  it('when isSome, should be false', () => {
    const value = Maybe().isSome();
    should(value).be.false();
  });

  it('when isNone, should be false', () => {
    const value = Maybe(123).isNone();
    should(value).be.false();
  });

  it('when isNone, should be true', () => {
    const value = Maybe().isNone();
    should(value).be.true();
  });

  it('when orSone || orJust, should be 13', () => {
    const value = Maybe(13).orSome(15);
    should(value).equal(13);
  });

  it('when orSone || orJust, should be 15', () => {
    const value = Maybe().orSome(15);
    should(value).equal(15);
  });

  it('when orElse, should be 13', () => {
    const value = Maybe(13).orElse(Just(15));
    should(value).containEql(Maybe(13));
  });

  it('when orElse, should be 15', () => {
    const value = Maybe().orElse(Just(15));
    should(value).containEql(Just(15));
  });

  it('will be exactly 13 when bind is called', () => {
    should(Maybe(12).bind((value) => Maybe(value + 1)).get()).be.exactly(13);
  });

  it('that bind will not be called', () => {
    should(Maybe().bind((value) => { throw 'not suppose to get here'; }));
  });

  it('will be exactly 12 when run is called', () => {
    should(Maybe(12).run((value) => Maybe(value + 1)).get()).be.exactly(12);
  });

  it('that bind will not be called', () => {
    should(Maybe().run((value) => { throw 'not suppose to get here'; }));
  });

});

describe('A Valid', () => {
  it('when success, is called, isSuccess() should be true', () => {
    const value = Valid(456).success();
    should(value.isSuccess()).be.true();
  });

  it('when fail is called, isFail() should be true', () => {
    const value = Valid(456).fail();
    should(value.isFail()).be.true();
  });

  it('when fail, get should be undefined', () => {
    const value = Valid(456).fail();
    should(value.get()).be.equal(undefined);
  });

  it('when ap should be false', () => {
    const value = Valid(456)
      .fail()
      .ap(Valid().fail());

    should(value.isSuccess()).be.false();
  });
});