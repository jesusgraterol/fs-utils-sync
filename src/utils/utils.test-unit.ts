import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from 'vitest';
import { IDirectoryElementsOptions, IPathElement } from '../shared/index.js';
import {
  DIRECTORY_ELEMENTS_DEFAULT_OPTIONS,
  buildDirectoryElementsOptions,
  getDirectoryElementsSortFunc,
} from './utils.js';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

// builds a mock element based on the provided partial
const buildEl = (el: Partial<IPathElement>): IPathElement => <IPathElement>el;





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

  describe('sortFunc.__sortByBaseName', () => {
    test('can sort a list of elements by baseName ascendingly', () => {
      const arr: IPathElement[] = [
        buildEl({ baseName: 'z-file.json' }),
        buildEl({ baseName: 'a-file.json' }),
        buildEl({ baseName: 'b-file.json' }),
        buildEl({ baseName: 'a-eile.json' }),
      ];
      arr.sort(getDirectoryElementsSortFunc('baseName', 'asc'));
      expect(arr).toStrictEqual([
        buildEl({ baseName: 'a-eile.json' }),
        buildEl({ baseName: 'a-file.json' }),
        buildEl({ baseName: 'b-file.json' }),
        buildEl({ baseName: 'z-file.json' }),
      ]);
    });

    test('can sort a list of elements by baseName descendingly', () => {
      const arr: IPathElement[] = [
        buildEl({ baseName: 'z-file.json' }),
        buildEl({ baseName: 'a-file.json' }),
        buildEl({ baseName: 'b-file.json' }),
        buildEl({ baseName: 'a-eile.json' }),
      ];
      arr.sort(getDirectoryElementsSortFunc('baseName', 'desc'));
      expect(arr).toStrictEqual([
        buildEl({ baseName: 'z-file.json' }),
        buildEl({ baseName: 'b-file.json' }),
        buildEl({ baseName: 'a-file.json' }),
        buildEl({ baseName: 'a-eile.json' }),
      ]);
    });
  });

  describe('sortFunc.__sortByNumericValue', () => {
    test('can sort a list of elements by creation ascendingly', () => {
      const arr: IPathElement[] = [
        buildEl({ creation: 1715264137299 }),
        buildEl({ creation: 1715264137279 }),
        buildEl({ creation: 1715264137239 }),
        buildEl({ creation: 1715264137259 }),
      ];
      arr.sort(getDirectoryElementsSortFunc('creation', 'asc'));
      expect(arr).toStrictEqual([
        buildEl({ creation: 1715264137239 }),
        buildEl({ creation: 1715264137259 }),
        buildEl({ creation: 1715264137279 }),
        buildEl({ creation: 1715264137299 }),
      ]);
    });

    test('can sort a list of elements by creation descendingly', () => {
      const arr: IPathElement[] = [
        buildEl({ creation: 1715264137299 }),
        buildEl({ creation: 1715264137279 }),
        buildEl({ creation: 1715264137239 }),
        buildEl({ creation: 1715264137259 }),
      ];
      arr.sort(getDirectoryElementsSortFunc('creation', 'desc'));
      expect(arr).toStrictEqual([
        buildEl({ creation: 1715264137299 }),
        buildEl({ creation: 1715264137279 }),
        buildEl({ creation: 1715264137259 }),
        buildEl({ creation: 1715264137239 }),
      ]);
    });

    test('can sort a list of elements by size ascendingly', () => {
      const arr: IPathElement[] = [
        buildEl({ size: 854612 }),
        buildEl({ size: 766518 }),
        buildEl({ size: 987425 }),
        buildEl({ size: 1501211 }),
      ];
      arr.sort(getDirectoryElementsSortFunc('size', 'asc'));
      expect(arr).toStrictEqual([
        buildEl({ size: 766518 }),
        buildEl({ size: 854612 }),
        buildEl({ size: 987425 }),
        buildEl({ size: 1501211 }),
      ]);
    });

    test('can sort a list of elements by size descendingly', () => {
      const arr: IPathElement[] = [
        buildEl({ size: 854612 }),
        buildEl({ size: 766518 }),
        buildEl({ size: 987425 }),
        buildEl({ size: 1501211 }),
      ];
      arr.sort(getDirectoryElementsSortFunc('size', 'desc'));
      expect(arr).toStrictEqual([
        buildEl({ size: 1501211 }),
        buildEl({ size: 987425 }),
        buildEl({ size: 854612 }),
        buildEl({ size: 766518 }),
      ]);
    });
  });
});
