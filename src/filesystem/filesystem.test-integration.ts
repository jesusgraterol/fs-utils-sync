import {
  deleteDirectory,
  pathExists,
  createDirectory,
  readPathElement,
  writeTextFile,
} from './filesystem.js';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the base path that will be used for the tests
const BASE_PATH = 'fs-test-dir';





/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

// builds a path inside of the base path
const p = (path?: string): string => (typeof path === 'string' ? `${BASE_PATH}/${path}` : BASE_PATH);





/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */
describe('Filesystem', () => {
  beforeAll(() => { });

  afterAll(() => { deleteDirectory(p()); });

  beforeEach(() => { deleteDirectory(p()); });

  afterEach(() => { });

  /* **********************************************************************************************
  *                                        GENERAL ACTIONS                                        *
  *********************************************************************************************** */
  describe('General Actions', () => {
    beforeAll(() => { });

    afterAll(() => { });

    beforeEach(() => { });

    afterEach(() => { });

    test('can determine if a path does not exist', () => {
      expect(pathExists(p())).toBeFalsy();
    });

    test('can determine if a path exists', () => {
      createDirectory(p());
      expect(pathExists(p())).toBeTruthy();
    });

    test('returns null when a path item does not exist', () => {
      expect(readPathElement(p())).toBeNull();
      expect(readPathElement(p('test-file.txt'))).toBeNull();
    });

    test('can read a directory\'s item', () => {
      createDirectory(p());
      const el = readPathElement(p());
      expect(el).not.toBeNull();
      expect(el!.baseName).toBe(p());
      expect(el!.path).toBe(p());
      expect(typeof el!.creation).toBe('number');
      expect(el!.extName).toBe('');
      expect(el!.isDirectory).toBeTruthy();
      expect(el!.isFile).toBeFalsy();
      expect(el!.isSymbolicLink).toBeFalsy();
      expect(typeof el!.size).toBe('number');
    });

    test('can read a file\'s item', () => {
      createDirectory(p());
      writeTextFile(p('test-file.txt'), 'Hello World!!');
      const el = readPathElement(p('test-file.txt'));
      expect(el).not.toBeNull();
      expect(el!.baseName).toBe('test-file.txt');
      expect(el!.path).toBe(p('test-file.txt'));
      expect(typeof el!.creation).toBe('number');
      expect(el!.extName).toBe('.txt');
      expect(el!.isDirectory).toBeFalsy();
      expect(el!.isFile).toBeTruthy();
      expect(el!.isSymbolicLink).toBeFalsy();
      expect(typeof el!.size).toBe('number');
    });
  });





  /* **********************************************************************************************
  *                                      DIRECTORY ACTIONS                                        *
  *********************************************************************************************** */
  describe('Directory Actions', () => {
    beforeAll(() => { });

    afterAll(() => { });

    beforeEach(() => { });

    afterEach(() => { });

    test.todo('can determine if a path exists and is a directory (not a symbolic link)');

    test.todo('can determine if a path exists and is a directory (a symbolic link)');

    test('can create, read and delete a directory', () => {
      expect(pathExists(p())).toBeFalsy();
      createDirectory(p());
      expect(pathExists(p())).toBeTruthy();
      deleteDirectory(p());
      expect(pathExists(p())).toBeFalsy();
    });
  });





  /* **********************************************************************************************
  *                                          FILE ACTIONS                                         *
  *********************************************************************************************** */
  describe('File Actions', () => {
    beforeAll(() => { });

    afterAll(() => { });

    beforeEach(() => { });

    afterEach(() => { });

    test.todo('can determine if a path exists and is a file (not a symbolic link)');

    test.todo('can determine if a path exists and is a file (a symbolic link)');

    test.todo('can write, read and delete a text file');
  });
});
