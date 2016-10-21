/* jshint -W097, esversion: 6, strict: true, node: true */
/* global module, describe, it */
'use strict';

import { Maybe } from './lift';
import should from 'should';

describe('A Maybe', () => {
  const helloBill = Maybe("Hello Bill");
  const nothing = Maybe();

  describe('with a value', () => {
    it('will be transformed by a map', () =>
      should(helloBill.map(value => value.length).get()).equal(10));

    it('will be will true for is()', () =>
      should(helloBill.is()).be.true());

    it('will be will true for is()', () =>
      should(helloBill.is()).be.true());

    it('will be false for isNothing()', () => {
      should(helloBill.isNothing()).be.false();
      should(helloBill.isNothing()).be.false();
    });

    it('will return valid to Maybe', () => {
      should(helloBill.toMaybe().is()).be.true();
    });

    it('will be transformed by a bind', () =>
      should(helloBill.bind(value => Maybe('Hello'))
        .get())
        .equal('Hello'));

    it('will be transformed by a map', () =>
      should(helloBill.map(value => 'Hello')
        .get())
        .equal('Hello'));

    it('will be transformed by a c', () =>
      should(helloBill.c(value => Maybe('Hello'))
        .get())
        .equal('Hello'));

    it('will be transformed to a none on bind that returns none', () => {
      should(helloBill.bind(value => Maybe()))
        .containEql(Maybe());

      should(helloBill.c(value => Maybe()))
        .containEql(Maybe());
    });

    it('will return the value when or() is called', () => {
      should(helloBill.or('no no!')).equal('Hello Bill');
      should(helloBill.or('no no!')).equal('Hello Bill');
    });

    it('will return the first monad on else', () =>
      should(helloBill.else(nothing).get()).equal("Hello Bill"));
  });

  describe('without a value', () => {
    it('will be true for isNothing()', () => {
      should(nothing.isNothing()).be.true();
      should(nothing.isNothing()).be.true();
    });

    it('will be false for is()', () =>
      should(nothing.is()).be.false());

    it('will always return a none on bind', () => {
      should(nothing.bind(() => Maybe()))
        .containEql(Maybe());

      should(nothing.c(() => Maybe()))
        .containEql(Maybe());
    });

    it('will always return a none on map', () => {
      should(nothing.map(value => value))
        .containEql(Maybe());

      should(nothing.map(value => { throw 'should not get here'; }))
        .containEql(Maybe());
    });

    it('will return the other value when or() is called', () =>
      should(nothing.or('yep')).equal('yep'));

    it('will return the supplied monad on else', () =>
      should(nothing.else(helloBill).get()).equal('Hello Bill'));
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
      should(Maybe('a').of("hello")
        .chain((a) => Maybe().of(a + " world"))
        .get()).equal("hello world");

      should(Maybe()
        .chain((a) => Maybe().of(a + " world")))
        .containEql(Maybe("hello world"));
    });
  });
});