/* jshint -W097, esversion: 6, strict: true, node: true */
/* global module, describe, it */
'use strict';

import { Valid } from './lift';
import should from 'should';

describe('A Validation', () => {
  const successString = Valid.success("abcd");
  const successMap = (val) => "success " + val;

  describe('that is successful', () => {
    it('will be transformed by a map', () =>
      should(successString.map((val) => val.length)
        .get()).equal(4));

    it('will return true when isSuccess is called', () =>
      should(successString.isSuccess()).be.true());

    it('will return value when get is called', () =>
      should(successString.get()).equal("abcd"));

    it('will return false when isFail is called', () =>
      should(successString.isFail()).be.false());

    it('will be transformed by a bind', () => {
      should(successString.bind((val) => Valid.success("efgh"))
        .get()).equal("efgh");

      should(successString.bind((val) => Valid.fail("big fail")))
        .containEql(Valid().f("big fail"));

      should(successString.chain((val) => Valid().s("efgh"))
        .get()).equal("efgh");

      should(successString.chain((val) => Valid.fail("big fail")))
        .containEql(Valid().f("big fail"));
    });
  });

  const failString = Valid.fail("error dude");
  const failMap = (val) => "fail: " + val;

  describe('that is a failure', () => {
    it('will not be transformed by a map', () =>
      should(failString.map((val) => "butterfly"))
        .containEql(Valid().f("error dude")));

    it('will not be transformed by a bind', () => {
      should(failString.bind((val) => Valid.fail("big fail")))
        .containEql(Valid().f("error dude"));

      should(failString.chain((val) => Valid.fail("big fail")))
        .containEql(Valid().f("error dude"));
    });

    it('will return false when isSuccess is called', () =>
      should(failString.isSuccess()).be.false());

    it('will return error value when fail() is called', () =>
      should(failString.get())
        .equal("error dude"));

    it('will return true when isFail is called', () =>
      should(failString.isFail())
        .be.true());
  });
});