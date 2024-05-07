
import {
  accessSync,
  lstatSync,
  Stats,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, extname } from 'node:path';
import { IPathElement } from './types.js';


/* **********************************************************************************************
  *                                       GENERAL ACTIONS                                        *
  ********************************************************************************************** */

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
 * Reads the content of a given path and returns the stats.
 * If the path doesn't exist, it returns null
 * @param path
 * @returns IPathElement | null
 */
const readPathItem = (path: string): IPathElement | null => {
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



/* **********************************************************************************************
  *                                      DIRECTORY ACTIONS                                       *
  ********************************************************************************************** */

/**
 * Verifies if a given path exists and is a directory.
 * @param path
 * @param allowSymbolicLink?
 * @returns boolean
 */
const isDirectory = (path: string, allowSymbolicLink: boolean = true): boolean => {
  // retrieve the item
  const item = readPathItem(path);
  if (item) {
    return item.isDirectory && (
      !item.isSymbolicLink || (item.isSymbolicLink && allowSymbolicLink)
    );
  }
  return false;
};

/**
 * Creates a directory at a given path.
 * @param path
 */
const createDirectory = (path: string): void => mkdirSync(path);

/**
 * Deletes the directory located in the given path.
 * @param path
 */
const deleteDirectory = (path: string): void => rmSync(path, { recursive: true, force: true });





/* **********************************************************************************************
  *                                         FILE ACTIONS                                         *
  ********************************************************************************************** */

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
  readPathItem,

  // directory actions
  isDirectory,
  createDirectory,
  deleteDirectory,

  // file actions
  writeTextFile,
};
