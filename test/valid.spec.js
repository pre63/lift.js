/* global describe, it */

import { Valid } from '../dist/lift';
import should from 'should'; // eslint-disable-line

describe('A Validation', () => {
  const successString = Valid.success('abcd');

  describe('that is successful', () => {
    it('will be transformed by a map', () =>
      should(successString.map(val => val.length)
        .fold()).equal(4));

    it('will return true when isSuccess is called', () =>
      should(successString.isSuccess()).be.true());

    it('will return value when fold is called', () =>
      should(successString.fold()).equal('abcd'));

    it('will return false when isFail is called', () =>
      should(successString.isFail()).be.false());

    it('will be transformed by a bind', () => {
      should(successString.bind(() => Valid.success('efgh'))
        .fold()).equal('efgh');

      should(successString.bind(() => Valid.fail('big fail')))
        .containEql(Valid().f('big fail'));

      should(successString.chain(() => Valid().s('efgh'))
        .fold()).equal('efgh');

      should(successString.chain(() => Valid.fail('big fail')))
        .containEql(Valid().f('big fail'));
    });
  });

  const failString = Valid.fail('worng string');

  describe('that is a failure', () => {
    it('will not be transformed by a map', () =>
      should(failString.map(() => 'butterfly'))
        .containEql(Valid().f('worng string')));

    it('will not be transformed by a bind', () => {
      should(failString.bind(() => Valid.fail('big fail')))
        .containEql(Valid().f('worng string'));

      should(failString.chain(() => Valid.fail('big fail')))
        .containEql(Valid().f('worng string'));
    });

    it('will return false when isSuccess is called', () =>
      should(failString.isSuccess()).be.false());

    it('will return error value when fail() is called', () =>
      should(failString.fold())
        .equal('worng string'));

    it('will return true when isFail is called', () =>
      should(failString.isFail())
        .be.true());
  });
});
