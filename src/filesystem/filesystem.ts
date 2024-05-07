
import {
  accessSync,
  lstatSync,
  Stats,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, extname } from 'node:path';
import { encodeError } from 'error-message-utils';
import { IPathElement } from './types.js';
import { ERRORS } from './filesystem.errors.js';

/* ************************************************************************************************
 *                                        GENERAL ACTIONS                                         *
 ************************************************************************************************ */

/**
 * Checks if a path exists (file or directory).
 * @param path
 * @returns boolean
 */
const pathExists = (path: string): boolean => {
  try {
    accessSync(path);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Reads the content of a given path and returns the stats. If the path doesn't exist,
 * it returns null
 * @param path
 * @returns IPathElement | null
 */
const readPathElement = (path: string): IPathElement | null => {
  try {
    const item: Stats = lstatSync(path);
    return {
      path,
      baseName: basename(path),
      extName: extname(path),
      isFile: item.isFile(),
      isDirectory: item.isDirectory(),
      isSymbolicLink: item.isSymbolicLink(),
      size: item.size,
      creation: Math.round(item.birthtimeMs),
    };
  } catch (e) {
    // throw new Error(`ENOENT: no such file or directory, lstat '${path}'`); // original error
    return null;
  }
};



/* ************************************************************************************************
 *                                       DIRECTORY ACTIONS                                        *
 ************************************************************************************************ */

/**
 * Verifies if a given path exists and is a directory.
 * @param path
 * @param allowSymbolicLink?
 * @returns boolean
 */
const isDirectory = (path: string, allowSymbolicLink: boolean = true): boolean => {
  const el = readPathElement(path);
  if (el) {
    return el.isDirectory && (
      !el.isSymbolicLink || (el.isSymbolicLink && allowSymbolicLink)
    );
  }
  return false;
};

/**
 * Deletes the directory located in the given path.
 * @param path
 */
const deleteDirectory = (path: string): void => rmSync(path, { recursive: true, force: true });

/**
 * Creates a directory at a given path. Note that if the directory already exists and
 * deleteIfExists is falsy, it will throw the DIRECTORY_ALREADY_EXISTS error.
 * @param path
 * @param deleteIfExists?
 */
const createDirectory = (path: string, deleteIfExists?: boolean): void => {
  // check if the dir already exists and if it should be deleted
  if (isDirectory(path)) {
    if (deleteIfExists) {
      deleteDirectory(path);
    } else {
      throw new Error(encodeError(`The directory ${path} already exists.`, ERRORS.DIRECTORY_ALREADY_EXISTS));
    }
  }
  mkdirSync(path);
};





/* ************************************************************************************************
 *                                          FILE ACTIONS                                          *
 ************************************************************************************************ */

/**
 * Writes a text file on a given path.
 * @param path
 * @param data
 */
const writeTextFile = (path: string, data: string): void => writeFileSync(
  path,
  data,
  { encoding: 'utf-8' },
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // general actions
  pathExists,
  readPathElement,

  // directory actions
  isDirectory,
  createDirectory,
  deleteDirectory,

  // file actions
  writeTextFile,
};
