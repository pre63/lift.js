/* jshint -W097, esversion: 6, strict: true, node: true */
/* global module, Promise, describe, it */
'use strict';

import { Valid, Maybe, Just, Prom, Monad } from './lift';
import should from 'should';


describe('A lift', () => {
  it('should lift', () => {
    const justWithLog = Just(5);

    Just.lift('log', value => should(value).equal(5));

    justWithLog.log();
  });

  it ('peron test', () => {
    const Person = Monad();
    const person = Person({ firstname: 'Bill', lastname: 'Murray' });

    const FullName = Monad();
    Person.lift('compose', person => FullName(`${person.firstname}, ${person.lastname}`));

    person.compose().run(console.log);
  });
});

describe('Test just monad', () => {
  it('test just.get, should be 11', () => {
    const value = Just(11).get();
    should(value).be.exactly(11);
  });

  it('test just.map, should be 12', () => {
    const value = Just(11).map((value) => value + 1).get();
    should(value).be.exactly(12);
  });

  it('test just.bind, shoud be 13', () => {
    const value = Just(12).bind((value) => Just(value + 1)).get();
    should(value).be.exactly(13);
  });

  it('test just.chain, shoud be 12', () => {
    const value = Just(12).chain((value) => Just(value)).get();
    should(value).be.exactly(12);
  });

  it('test just.flatMap, shoud be 12', () => {
    const value = Just(12).flatMap((value) => Just(value)).get();
    should(value).be.exactly(12);
  });

  it('test just.of || pure, shoud be 12', () => {
    const value = Just(17).of(12).get();
    should(value).be.exactly(12);
  });

  it('test just.join, shoud be 12', () => {
    const value = Just(Just(12)).join().get();
    should(value).be.exactly(12);
  });
});

describe('Test Maybe monad', () => {
  it('test Maybe.none, should be undefined', () => {
    const value = Maybe(11).none();
    should(value).containEql(Maybe());
  });

  it('test Maybe.map, should be undefined', () => {
    const value = Maybe(123).map((val) => val + 1).get();
    should(value).equal(124);
  });

  it('test Maybe.isSome, should be true', () => {
    const value = Maybe(123).isSome();
    should(value).be.true();
  });

  it('test Maybe.isSome, should be false', () => {
    const value = Maybe().isSome();
    should(value).be.false();
  });

  it('test Maybe.isNone, should be false', () => {
    const value = Maybe(123).isNone();
    should(value).be.false();
  });

  it('test Maybe.isNone, should be true', () => {
    const value = Maybe().isNone();
    should(value).be.true();
  });

  it('test Maybe.orSone || orJust, should be 13', () => {
    const value = Maybe(13).orSome(15);
    should(value).equal(13);
  });

  it('test Maybe.orSone || orJust, should be 15', () => {
    const value = Maybe().orSome(15);
    should(value).equal(15);
  });

  it('test Maybe.orElse, should be 13', () => {
    const value = Maybe(13).orElse(Just(15));
    should(value).containEql(Maybe(13));
  });

  it('test Maybe.orElse, should be 15', () => {
    const value = Maybe().orElse(Just(15));
    should(value).containEql(Just(15));
  });
});

describe('Test Valid monad', () => {
  it('test Valid.success', () => {
    const value = Valid(456).success();
    should(value.isSuccess()).be.true();
  });

  it('test Valid.isFail', () => {
    const value = Valid(456).fail();
    should(value.isFail()).be.true();
  });

  it('test Valid.isFail', () => {
    const value = Valid(456).fail();
    should(value.get()).be.equal(undefined);
  });

  it('test Valid.ap', () => {
    const value = Valid(456)
      .fail()
      .ap(Valid().fail());

    should(value.isSuccess()).be.false();
  });
});