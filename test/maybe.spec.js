/* jshint -W097, esversion: 6, strict: true, node: true */
/* global module, describe, it */
'use strict';

import { Maybe } from './lift';
import should from 'should';

describe('A Maybe', () => {
  const someString = Maybe("abcd");
  const none = Maybe().none();

  describe('with a value', () => {
    it('will be transformed by a map', () =>
      should(someString.map(value => value.length).get()).equal(4));

    it('will be will true for isSome()', () =>
      should(someString.isSome()).be.true());

    it('will be will true for isJust()', () =>
      should(someString.isJust()).be.true());

    it('will be false for isNone()', () => {
      should(someString.isNone()).be.false();
      should(someString.isNothing()).be.false();
    });

    it('will return valid to Maybe', () => {
      should(someString.toMaybe().isJust()).be.true();
    });

    it('will be transformed by a bind', () =>
      should(someString.bind(value => Maybe('Hello'))
        .get())
        .equal('Hello'));

    it('will be transformed by a map', () =>
      should(someString.map(value => 'Hello')
        .get())
        .equal('Hello'));

    it('will be transformed by a flatMap', () =>
      should(someString.flatMap(value => Maybe('Hello'))
        .get())
        .equal('Hello'));

    it('will be transformed to a none on bind that returns none', () => {
      should(someString.bind(value => Maybe()))
        .containEql(Maybe());

      should(someString.flatMap(value => Maybe()))
        .containEql(Maybe());
    });

    it('will return the value when orSome() is called', () => {
      should(someString.orSome('no no!')).equal('abcd');
      should(someString.orJust('no no!')).equal('abcd');
    });

    it('will return the first monad on orElse', () =>
      should(someString.orElse(none).get()).equal("abcd"));
  });

  describe('without a value', () => {
    it('will be true for isNone()', () => {
      should(none.isNone()).be.true();
      should(none.isNothing()).be.true();
    });

    it('will be false for isSome()', () =>
      should(none.isSome()).be.false());

    it('will always return a none on bind', () => {
      should(none.bind(() => Maybe()))
        .containEql(Maybe());

      should(none.flatMap(() => Maybe()))
        .containEql(Maybe());
    });

    it('will always return a none on map', () => {
      should(none.map(value => value))
        .containEql(Maybe());

      should(none.map(value => { throw 'should not get here'; }))
        .containEql(Maybe());
    });

    it('will return the other value when orSome() is called', () =>
      should(none.orSome('yep')).equal('yep'));

    it('will return the supplied monad on orElse', () =>
      should(none.orElse(someString).get()).equal('abcd'));
  });

  const person = ((forename, surname, address) => forename + " " + surname + " lives at " + address);

  const maybeAddress = Maybe('Hollywood');
  const maybeSurname = Maybe('Murray');
  const maybeForename = Maybe('Bill');

  describe("complies with FantasyLand spec for", () => {
    it("'of'", () =>
      should(Maybe().of("hello")
        .get())
        .equal("hello"));

    it("'chain'", () => {
      should(Maybe().of("hello")
        .chain((a) => Maybe().of(a + " world"))
        .get()).equal("hello world");

      should(Maybe()
        .chain((a) => Maybe().of(a + " world")))
        .containEql(Maybe("hello world"));
    });
  });
});