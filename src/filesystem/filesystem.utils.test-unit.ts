import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from 'vitest';
import { IDirectoryElementsOptions } from './types.js';
import {
  DIRECTORY_ELEMENTS_DEFAULT_OPTIONS,
  buildDirectoryElementsOptions,
} from './filesystem.utils.js';


/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// ...





/* ************************************************************************************************
 *                                       DIRECTORY ELEMENTS                                       *
 ************************************************************************************************ */
describe('Directory Elements', () => {
  beforeAll(() => { });

  afterAll(() => { });

  beforeEach(() => { });

  afterEach(() => { });

  describe('buildDirectoryElementsOptions', () => {
    test('can build the default options by providing invalid values ', () => {
      expect(buildDirectoryElementsOptions()).toStrictEqual(DIRECTORY_ELEMENTS_DEFAULT_OPTIONS);
      expect(buildDirectoryElementsOptions(undefined)).toStrictEqual(
        DIRECTORY_ELEMENTS_DEFAULT_OPTIONS,
      );
      // @ts-ignore
      expect(buildDirectoryElementsOptions(null)).toStrictEqual(DIRECTORY_ELEMENTS_DEFAULT_OPTIONS);
      expect(buildDirectoryElementsOptions({})).toStrictEqual(DIRECTORY_ELEMENTS_DEFAULT_OPTIONS);
    });

    test('can build the options by providing all values', () => {
      const opts: IDirectoryElementsOptions = {
        sortByKey: 'size',
        sortOrder: 'desc',
        includeExts: ['.json', '.txt', '.h5'],
      };
      expect(buildDirectoryElementsOptions(opts)).toStrictEqual(opts);
    });

    test('can build the options by providing a single custom value', () => {
      expect(buildDirectoryElementsOptions({ sortByKey: 'creation' })).toStrictEqual({
        ...DIRECTORY_ELEMENTS_DEFAULT_OPTIONS,
        sortByKey: 'creation',
      });
      expect(buildDirectoryElementsOptions({ sortOrder: 'desc' })).toStrictEqual({
        ...DIRECTORY_ELEMENTS_DEFAULT_OPTIONS,
        sortOrder: 'desc',
      });
      expect(buildDirectoryElementsOptions({ includeExts: ['.json'] })).toStrictEqual({
        ...DIRECTORY_ELEMENTS_DEFAULT_OPTIONS,
        includeExts: ['.json'],
      });
    });
  });
});
