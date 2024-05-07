import {
  deleteDirectory,
  pathExists,
  createDirectory,
  readPathItem,
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
const __p = (path?: string): string => (typeof path === 'string' ? `${BASE_PATH}/${path}` : BASE_PATH);





/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */
describe('Filesystem', () => {
  beforeAll(() => { });

  afterAll(() => { deleteDirectory(__p()); });

  beforeEach(() => { deleteDirectory(__p()); });

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
      expect(pathExists(__p())).toBeFalsy();
    });

    test('can determine if a path exists', () => {
      createDirectory(__p());
      expect(pathExists(__p())).toBeTruthy();
    });

    test('returns null when a path item does not exist', () => {
      expect(readPathItem(__p())).toBeNull();
      expect(readPathItem(__p('test-file.txt'))).toBeNull();
    });

    test('can read a directory\'s item', () => {
      createDirectory(__p());
      const item = readPathItem(__p());
      expect(item).not.toBeNull();
      expect(item!.baseName).toBe(__p());
      expect(item!.path).toBe(__p());
      expect(typeof item!.creation).toBe('number');
      expect(item!.extName).toBe('');
      expect(item!.isDirectory).toBeTruthy();
      expect(item!.isFile).toBeFalsy();
      expect(item!.isSymbolicLink).toBeFalsy();
      expect(typeof item!.size).toBe('number');
    });

    test('can read a file\'s item', () => {
      createDirectory(__p());
      writeTextFile(__p('test-file.txt'), 'Hello World!!');
      const item = readPathItem(__p('test-file.txt'));
      expect(item).not.toBeNull();
      expect(item!.baseName).toBe('test-file.txt');
      expect(item!.path).toBe(__p('test-file.txt'));
      expect(typeof item!.creation).toBe('number');
      expect(item!.extName).toBe('.txt');
      expect(item!.isDirectory).toBeFalsy();
      expect(item!.isFile).toBeTruthy();
      expect(item!.isSymbolicLink).toBeFalsy();
      expect(typeof item!.size).toBe('number');
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
      expect(pathExists(__p())).toBeFalsy();
      createDirectory(__p());
      expect(pathExists(__p())).toBeTruthy();
      deleteDirectory(__p());
      expect(pathExists(__p())).toBeFalsy();
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
