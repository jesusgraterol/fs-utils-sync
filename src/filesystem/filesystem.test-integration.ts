import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from 'vitest';
import { Buffer } from 'node:buffer';
import { writeFileSync } from 'node:fs';
import {
  deleteDirectory,
  pathExists,
  createDirectory,
  getPathElement,
  writeTextFile,
  isDirectory,
  createDirectorySymLink,
  isFile,
  createFileSymLink,
  deleteFile,
  readTextFile,
  writeJSONFile,
  readJSONFile,
  copyFile,
  copyDirectory,
  readDirectory,
  readBufferFile,
  writeBufferFile,
} from './filesystem.js';
import { ERRORS } from './filesystem.errors.js';

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
    describe('pathExists', () => {
      test('can determine if a path does not exist', () => {
        expect(pathExists(p())).toBeFalsy();
        expect(pathExists(p('some-file.txt'))).toBeFalsy();
      });

      test('can determine if a path exists', () => {
        createDirectory(p());
        expect(pathExists(p())).toBeTruthy();
        writeTextFile(p('some-file.txt'), 'Hello World!');
        expect(pathExists(p('some-file.txt'))).toBeTruthy();
      });
    });

    describe('getPathElement', () => {
      test('returns null when a path element does not exist', () => {
        expect(getPathElement(p())).toBeNull();
        expect(getPathElement(p('test-file.txt'))).toBeNull();
      });

      test('can read a directory\'s element', () => {
        createDirectory(p());
        const el = getPathElement(p());
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

      test('can read a file\'s element', () => {
        createDirectory(p());
        writeTextFile(p('test-file.txt'), 'Hello World!!');
        const el = getPathElement(p('test-file.txt'));
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
  });





  /* **********************************************************************************************
  *                                      DIRECTORY ACTIONS                                        *
  *********************************************************************************************** */
  describe('Directory Actions', () => {
    describe('isDirectory', () => {
      test('can determine if a path is a directory', () => {
        expect(isDirectory(p())).toBeFalsy();
        writeTextFile(p('some-file.txt'), 'Hello world!');
        expect(isDirectory(p())).toBeTruthy();
        expect(pathExists(p('some-file.txt'))).toBeTruthy();
        expect(isDirectory(p('some-file.txt'))).toBeFalsy();
      });
    });

    describe('createDirectory & deleteDirectory', () => {
      test('can create, read and delete a directory', () => {
        expect(pathExists(p())).toBeFalsy();
        createDirectory(p());
        expect(pathExists(p())).toBeTruthy();
        deleteDirectory(p());
        expect(pathExists(p())).toBeFalsy();
      });

      test('throws an error when attempting to create a directory on top of an existing one', () => {
        expect(isDirectory(p('test-dir'))).toBeFalsy();
        createDirectory(p('test-dir'));
        expect(isDirectory(p('test-dir'))).toBeTruthy();
        expect(() => createDirectory(p('test-dir'))).toThrowError(ERRORS.DIRECTORY_ALREADY_EXISTS);
      });

      test('can create a directory on top of another if the deleteIfExists arg is provided', () => {
        createDirectory(p('test-dir'));
        expect(() => createDirectory(p('test-dir'), true)).not.toThrowError();
      });
    });

    describe('copyDirectory', () => {
      test('throws an error if the source path is not a directory', () => {
        expect(() => copyDirectory(p('dir-a'), p('dir-b'))).toThrow(ERRORS.NOT_A_DIRECTORY);
      });

      test('can copy a directory with some files and sub directories in it', () => {
        writeTextFile(p('dir-a/file-a.txt'), 'This is file a!');
        writeTextFile(p('dir-a/file-b.txt'), 'This is file b!');
        writeTextFile(p('dir-a/b/file-ab.txt'), 'This is file ab!');
        writeJSONFile(p('dir-a/b/c/file-abc.json'), { name: 'file-abc.json', description: 'This is file abc!' });

        copyDirectory(p('dir-a'), p('dir-b'));
        expect(isDirectory(p('dir-b'))).toBeTruthy();
        expect(readTextFile(p('dir-b/file-a.txt'))).toBe('This is file a!');
        expect(readTextFile(p('dir-b/file-b.txt'))).toBe('This is file b!');
        expect(isDirectory(p('dir-b/b'))).toBeTruthy();
        expect(readTextFile(p('dir-b/b/file-ab.txt'))).toBe('This is file ab!');
        expect(isDirectory(p('dir-b/b/c'))).toBeTruthy();
        expect(readJSONFile(p('dir-b/b/c/file-abc.json'))).toStrictEqual({ name: 'file-abc.json', description: 'This is file abc!' });
      });

      test('can copy a directory with some files in it, overriding the destination', () => {
        writeTextFile(p('dir-a/file-a.txt'), 'This is file a!');
        writeTextFile(p('dir-a/file-b.txt'), 'This is file b!');
        writeTextFile(p('dir-b/file-a.txt'), 'This is file ba!');
        writeTextFile(p('dir-b/file-b.txt'), 'This is file bb!');

        copyDirectory(p('dir-a'), p('dir-b'));
        expect(readTextFile(p('dir-b/file-a.txt'))).toBe('This is file a!');
        expect(readTextFile(p('dir-b/file-b.txt'))).toBe('This is file b!');
      });
    });

    describe('createDirectorySymLink', () => {
      test('can create a symbolic link for a directory', () => {
        createDirectory(p('test-dir'));
        let el = getPathElement(p('test-dir'));
        expect(el!.isSymbolicLink).toBeFalsy();
        createDirectorySymLink(p('test-dir'), p('test-dir-symlink'));
        el = getPathElement(p('test-dir'));
        expect(el!.isSymbolicLink).toBeFalsy();
        el = getPathElement(p('test-dir-symlink'));
        expect(el!.isSymbolicLink).toBeTruthy();
      });

      test('throws if the target directory does not exist', () => {
        expect(() => createDirectorySymLink(p('test-dir'), p('test-dir-symlink'))).toThrowError(ERRORS.NON_EXISTENT_DIRECTORY);
      });

      test('throws if the target directory is not a directory', () => {
        writeTextFile(p('some-file.txt'), 'Hello World!');
        expect(() => createDirectorySymLink(p('some-file.txt'), p('test-dir-symlink'))).toThrowError(ERRORS.NOT_A_DIRECTORY);
      });
    });

    describe('readDirectory', () => {
      test('throws if the directory doesnt exist', () => {
        expect(() => readDirectory(p())).toThrowError(ERRORS.NOT_A_DIRECTORY);
      });

      test('can read all the contents of a directory', () => {
        writeTextFile(p('file-01.txt'), 'Hello There!! 01');
        writeTextFile(p('file-02.txt'), 'Hello There!! 02');
        writeJSONFile(p('file-03.json'), { hello: 'World' });
        writeTextFile(p('inner/file-01.txt'), 'Hello There!! inner/01');
        writeTextFile(p('inner/inner-01.txt'), 'Hello There!! inner/01');
        writeJSONFile(p('inner/inner-02.json'), { foo: 'bar' });
        createDirectory(p('inner/inner2'));
        expect(readDirectory(p(), true)).toEqual([
          p('file-01.txt'),
          p('file-02.txt'),
          p('file-03.json'),
          p('inner'),
          p('inner/file-01.txt'),
          p('inner/inner-01.txt'),
          p('inner/inner-02.json'),
          p('inner/inner2'),
        ]);
      });
    });

    describe('getDirectoryElements', () => {
      test.todo('throws if attempting to read a non-existent directory');

      test.todo('can read the directory elements separated by directories, files & symlinks');

      test.todo('can filter files by any number of extensions');

      test.todo('can sort elements by creation ascendingly');

      test.todo('can sort elements by creation descendingly');
    });
  });





  /* **********************************************************************************************
  *                                          FILE ACTIONS                                         *
  *********************************************************************************************** */
  describe('File Actions', () => {
    describe('isFile', () => {
      test('can determine if a path is a file', () => {
        expect(isFile(p())).toBeFalsy();
        createDirectory(p());
        expect(isFile(p())).toBeFalsy();
        expect(isFile(p('some-file.txt'))).toBeFalsy();
        writeTextFile(p('some-file.txt'), 'Hello World!');
        expect(isFile(p('some-file.txt'))).toBeTruthy();
      });
    });

    describe('writeTextFile & readTextFile', () => {
      test('attempting to write an empty file throws an error', () => {
        expect(() => writeTextFile(p('file.txt'), '')).toThrowError(ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID);
      });

      test('can write and read a text file', () => {
        writeTextFile(p('file.txt'), 'Hello World!');
        expect(readTextFile(p('file.txt'))).toBe('Hello World!');
      });

      test('attempting to read a text file that doesnt exist throws an error', () => {
        expect(() => readTextFile(p('file.txt'))).toThrowError(ERRORS.NOT_A_FILE);
      });

      test('attempting to read an empty text file throws an error', () => {
        createDirectory(p());
        writeFileSync(p('file.txt'), '', { encoding: 'utf-8' });
        expect(() => readTextFile(p('file.txt'))).toThrowError(ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID);
      });
    });

    describe('writeJSONFile & readJSONFile', () => {
      test('attempting to write an empty or invalid file throws an error', () => {
        expect(() => writeJSONFile(p('file.json'), '')).toThrowError(ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID);
      });

      test('can write and read a JSON file by providing a string', () => {
        writeJSONFile(p('file.json'), JSON.stringify({ foo: 'bar', baz: true, tan: 123 }));
        expect(readJSONFile(p('file.json'))).toStrictEqual({ foo: 'bar', baz: true, tan: 123 });
      });

      test('can write and read a JSON file by providing an object', () => {
        writeJSONFile(p('file.json'), { foo: 'bar', baz: true, tan: 123 });
        expect(readJSONFile(p('file.json'))).toStrictEqual({ foo: 'bar', baz: true, tan: 123 });
      });

      test('attempting to read a JSON file that doesnt exist throws an error', () => {
        expect(() => readJSONFile(p('file.json'))).toThrowError(ERRORS.NOT_A_FILE);
      });

      test('attempting to read an empty/invalid json file throws an error', () => {
        createDirectory(p());
        writeFileSync(p('file.json'), '', { encoding: 'utf-8' });
        expect(() => readJSONFile(p('file.json'))).toThrowError(ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID);
      });
    });

    describe('writeBufferFile & readBufferFile', () => {
      test('attempting to write an empty or invalid file throws an error', () => {
        // @ts-ignore
        expect(() => writeBufferFile(p('file'), undefined)).toThrowError(ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID);
      });

      test('can write and read a Buffer file', () => {
        const file = Buffer.from('This is a Buffer File!');
        writeBufferFile(p('file'), file);
        expect(readBufferFile(p('file')).toString()).toBe('This is a Buffer File!');
      });

      test('attempting to read a Buffer file that doesnt exist throws an error', () => {
        expect(() => readBufferFile(p('file'))).toThrowError(ERRORS.NOT_A_FILE);
      });

      test('attempting to read an empty/invalid Buffer file throws an error', () => {
        createDirectory(p());
        writeFileSync(p('file'), '', { encoding: 'utf-8' });
        expect(() => readBufferFile(p('file'))).toThrowError(ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID);
      });
    });

    describe('copyFile', () => {
      test('throws if the source path is not a file', () => {
        expect(() => copyFile(p('file.txt'), p('file-b.txt'))).toThrowError(ERRORS.NOT_A_FILE);
      });

      test('can copy a text file from a to b', () => {
        writeTextFile(p('file-a.txt'), 'This is file-a.txt!');
        copyFile(p('file-a.txt'), p('file-b.txt'));
        expect(readTextFile(p('file-b.txt'))).toBe('This is file-a.txt!');
      });

      test('can copy a JSON file from a to b', () => {
        writeJSONFile(p('file-a.json'), { id: 1, name: 'jess' });
        copyFile(p('file-a.json'), p('file-b.json'));
        expect(readJSONFile(p('file-b.json'))).toStrictEqual({ id: 1, name: 'jess' });
      });

      test('can override the destination path if it already exists', () => {
        writeTextFile(p('file-a.txt'), 'This is file-a.txt!');
        expect(readTextFile(p('file-a.txt'))).toBe('This is file-a.txt!');
        writeTextFile(p('file-b.txt'), 'This is file-b.txt!');
        expect(readTextFile(p('file-b.txt'))).toBe('This is file-b.txt!');
        copyFile(p('file-b.txt'), p('file-a.txt'));
        expect(readTextFile(p('file-a.txt'))).toBe('This is file-b.txt!');
      });
    });

    describe('deleteFile', () => {
      test('can delete a file', () => {
        writeTextFile(p('some-file.txt'), 'Hello World!');
        expect(isFile(p('some-file.txt'))).toBeTruthy();
        deleteFile(p('some-file.txt'));
        expect(isFile(p('some-file.txt'))).toBeFalsy();
      });

      test('throws if the file does not exist or if it isn\'t a file', () => {
        expect(() => deleteFile(p('some-file.txt'))).toThrowError(ERRORS.NOT_A_FILE);
      });

      test('throws if attempting to delete a directory', () => {
        createDirectory(p());
        expect(() => deleteFile(p())).toThrowError(ERRORS.NOT_A_FILE);
      });

      test('throws if attempting to delete a symlink', () => {
        writeTextFile(p('some-file.txt'), 'Hello World!');
        createFileSymLink(p('some-file.txt'), p('some-file-symlink.txt'));
        expect(() => deleteFile(p('some-file-symlink.txt'))).toThrowError(ERRORS.NOT_A_FILE);
      });
    });

    describe('createFileSymLink', () => {
      test('can create a symbolic link for a file', () => {
        writeTextFile(p('test-file.txt'), 'Hello World!');
        let el = getPathElement(p('test-file.txt'));
        expect(el!.isSymbolicLink).toBeFalsy();
        createFileSymLink(p('test-file.txt'), p('test-file-symlink.txt'));
        el = getPathElement(p('test-file.txt'));
        expect(el!.isSymbolicLink).toBeFalsy();
        el = getPathElement(p('test-file-symlink.txt'));
        expect(el!.isSymbolicLink).toBeTruthy();
      });

      test('throws if the target file does not exist', () => {
        expect(() => createFileSymLink(p('test-file.txt'), p('test-file-symlink.txt'))).toThrowError(ERRORS.NON_EXISTENT_FILE);
      });

      test('throws if the target file is not a file', () => {
        createDirectory(p('some-file'));
        expect(() => createFileSymLink(p('some-file'), p('some-file.txt'))).toThrowError(ERRORS.NOT_A_FILE);
      });
    });
  });
});
