/* global describe, it */

import { Maybe } from '../dist/lift';
import should from 'should'; // eslint-disable-line

describe('A Maybe', () => {
  const helloBill = Maybe('Hello Bill');
  const nothing = Maybe();

  describe('with a value', () => {
    it('will be transformed by a map', () =>
      should(helloBill.map(value => value.length).fold()).equal(10));

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
      should(helloBill.bind(() => Maybe('Hello'))
        .fold())
        .equal('Hello'));

    it('will be transformed by a map', () =>
      should(helloBill.map(() => 'Hello')
        .fold())
        .equal('Hello'));

    it('will be transformed by a chain', () =>
      should(helloBill.chain(() => Maybe('Hello'))
        .fold())
        .equal('Hello'));

    it('will be transformed to a none on bind that returns none', () => {
      should(helloBill.bind(() => Maybe()))
        .containEql(Maybe());

      should(helloBill.chain(() => Maybe()))
        .containEql(Maybe());
    });

    it('will return the value when or() is called', () => {
      should(helloBill.or('no no!')).equal('Hello Bill');
      should(helloBill.or('no no!')).equal('Hello Bill');
    });

    it('will return the first monad on else', () =>
      should(helloBill.else(nothing).fold()).equal('Hello Bill'));
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

      should(nothing.chain(() => Maybe()))
        .containEql(Maybe());
    });

    it('will always return a none on map', () => {
      should(nothing.map(value => value))
        .containEql(Maybe());

      should(nothing.map(() => { throw 'should not get here'; })) // eslint-disable-line
        .containEql(Maybe());
    });

    it('will return the other value when or() is called', () =>
      should(nothing.or('yep')).equal('yep'));

    it('will return the supplied monad on else', () =>
      should(nothing.else(helloBill).fold()).equal('Hello Bill'));
  });

  describe('complies with FantasyLand spec for', () => {
    it("'of'", () =>
      should(Maybe().of('hello')
        .fold())
        .equal('hello'));

    it("'chain'", () => {
      should(Maybe('a').of('hello')
        .chain(a => Maybe().of(`${a} world`))
        .fold()).equal('hello world');

      should(Maybe()
        .chain(a => Maybe().of(`${a} world`)))
        .containEql(Maybe('hello world'));
    });
  });
});
