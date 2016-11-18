/* global describe, it */

import { IO } from '../dist/lift';
import should from 'should'; // eslint-disable-line

describe('A IO', () => {
  describe('that is ran', () => {
    it('will be delayed', () => {
      const writeFile = IO((fileName, contents) => `contents ${contents} was written to ${fileName}`);
      const result = writeFile('/file.js', 'some example contents')
        .run();

      should(result).equal('contents some example contents was written to /file.js');
    });
  });

  describe('that has no parameters', () => {
    it('will return hello', () => {
      const writeFile = IO(() => 'hello');
      const result = writeFile()
        .run();

      should(result).equal('hello');
    });
  });
});
