import { Buffer } from 'node:buffer';
import {
  accessSync,
  lstatSync,
  Stats,
  mkdirSync,
  rmSync,
  writeFileSync,
  readFileSync,
  symlinkSync,
  unlinkSync,
  copyFileSync,
  cpSync,
  readdirSync,
  WriteFileOptions,
} from 'node:fs';
import { basename, extname, dirname } from 'node:path';
import { encodeError, extractMessage } from 'error-message-utils';
import { IPathElement, IReadDirectoryOptions, IReadFileOptions } from './types.js';
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
const getPathElement = (path: string): IPathElement | null => {
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
 * @returns boolean
 */
const isDirectory = (path: string): boolean => {
  const el = getPathElement(path);
  return el === null ? false : el.isDirectory;
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
  mkdirSync(path, { recursive: true });
};

/**
 * It copies a directory (and sub directories) from srcPath to destPath. Throws if the srcPath is
 * not a directory. Keep in mind the destPath is completely overridden.
 * @param srcPath
 * @param destPath
 */
const copyDirectory = (srcPath: string, destPath: string) => {
  if (!isDirectory(srcPath)) {
    throw new Error(encodeError(`The srcPath '${srcPath}' is not a directory.`, ERRORS.NOT_A_DIRECTORY));
  }
  deleteDirectory(destPath);
  cpSync(srcPath, destPath, { recursive: true });
};

/**
 * Creates a symlink for a given directory. It throws if the target dir doesnt exist or if it is
 * not considered to be a dir by the OS.
 * @param target
 * @param path
 */
const createDirectorySymLink = (target: string, path: string) => {
  const el = getPathElement(target);
  if (el === null) {
    throw new Error(encodeError(`The target dir '${target}' does not exist.`, ERRORS.NON_EXISTENT_DIRECTORY));
  }
  if (!el.isDirectory) {
    throw new Error(encodeError(`The target dir '${target}' is not a directory.`, ERRORS.NOT_A_DIRECTORY));
  }
  symlinkSync(target, path, 'dir');
};

/**
 * Reads the contents of a directory based on the provided options and returns them. Throws if the
 * directory doesn't exist.
 * @param path
 * @returns string[]
 */
const readDirectory = (
  path: string,
  options: IReadDirectoryOptions = { encoding: 'utf-8', recursive: true },
): string[] | Buffer[] => {
  if (!isDirectory(path)) {
    throw new Error(encodeError(`The dir '${path}' is not a directory.`, ERRORS.NOT_A_DIRECTORY));
  }
  return readdirSync(path, options).map((contentPath) => `${path}/${contentPath}`);
};



/* ************************************************************************************************
 *                                          FILE ACTIONS                                          *
 ************************************************************************************************ */

/**
 * Verifies if a given path exists and is a file.
 * @param path
 * @returns boolean
 */
const isFile = (path: string): boolean => {
  const el = getPathElement(path);
  return el === null ? false : el.isFile;
};

/**
 * Creates the base directory for a file in case it doesn't exist and then it writes the file.
 * @param path
 * @param data
 * @param options
 */
const writeFile = (
  path: string,
  data: string | NodeJS.ArrayBufferView,
  options: WriteFileOptions | undefined,
) => {
  const dirName = dirname(path);
  if (!pathExists(dirName)) {
    createDirectory(dirName);
  }
  writeFileSync(path, data, options);
};

/**
 * Writes a text file on a given path.
 * @param path
 * @param data
 */
const writeTextFile = (path: string, data: string): void => {
  if (typeof data !== 'string' || !data.length) {
    console.log(data);
    throw new Error(encodeError(`The provided data for the file '${path}' is empty or invalid. Received: ${data}`, ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID));
  }
  writeFile(path, data, { encoding: 'utf-8' });
};

/**
 * Writes a JSON file on a given path. If an object is provided, it will be stringified.
 * @param path
 * @param data
 * @param space?
 */
const writeJSONFile = (path: string, data: object | string, space: number = 2) => {
  let fileData: string;
  try {
    fileData = typeof data === 'string' ? data : JSON.stringify(data, undefined, space);
  } catch (e) {
    throw new Error(encodeError(`The JSON data for the file '${path}' could not be stringified: ${extractMessage(e)}`, ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID));
  }
  writeTextFile(path, fileData);
};

/**
 * Reads and returns the contents of a file. Throws an error if the file does not exist or if it
 * is not considered a file by the OS.
 * @param path
 * @param options?
 * @returns string | Buffer
 */
const readFile = (path: string, options: IReadFileOptions = null): string | Buffer => {
  if (!isFile(path)) {
    throw new Error(encodeError(`The file '${path}' is not a file.`, ERRORS.NOT_A_FILE));
  }
  return readFileSync(path, options);
};

/**
 * Reads a text file and returns its contents. Throws if the file doesn't exist or is empty/invalid.
 * @param path
 * @returns string
 */
const readTextFile = (path: string): string => {
  const content = readFile(path, { encoding: 'utf8' });
  if (typeof content !== 'string' || !content.length) {
    throw new Error(encodeError(`The file '${path}' is empty or invalid.`, ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID));
  }
  return content;
};

/**
 * Reads a text file and returns its contents. Throws if the file doesn't exist or is empty/invalid.
 * @param path
 * @returns object
 */
const readJSONFile = (path: string): object => {
  const content = readTextFile(path);
  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error(encodeError(`The JSON file '${path}' cound not be parsed: ${extractMessage(e)}`, ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID));
  }
};

/**
 * Copies a file from srcPath to destPath, replacing the destination if it exists. Throws if the
 * srcPath doesn't exist or is not considered a file by the OS.
 * @param srcPath
 * @param destPath
 */
const copyFile = (srcPath: string, destPath: string) => {
  if (!isFile(srcPath)) {
    throw new Error(encodeError(`The file '${srcPath}' is not a file.`, ERRORS.NOT_A_FILE));
  }
  copyFileSync(srcPath, destPath);
};

/**
 * Deletes the file located at the provided path. Throws if the file does not exist or if it isn't
 * considered a file by the OS.
 * @param path
 */
const deleteFile = (path: string) => {
  if (!isFile(path)) {
    throw new Error(encodeError(`The file '${path} is not a file.'`, ERRORS.NOT_A_FILE));
  }
  unlinkSync(path);
};

/**
 * Creates a symlink for a given file. It throws if the target file doesnt exist or if it is
 * not considered to be a file by the OS.
 * @param target
 * @param path
 */
const createFileSymLink = (target: string, path: string) => {
  const el = getPathElement(target);
  if (el === null) {
    throw new Error(encodeError(`The target file '${target}' does not exist.`, ERRORS.NON_EXISTENT_FILE));
  }
  if (!el.isFile) {
    throw new Error(encodeError(`The target file '${target}' is not a file.`, ERRORS.NOT_A_FILE));
  }
  symlinkSync(target, path, 'file');
};



/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // general actions
  pathExists,
  getPathElement,

  // directory actions
  isDirectory,
  createDirectory,
  copyDirectory,
  deleteDirectory,
  createDirectorySymLink,
  readDirectory,

  // file actions
  isFile,
  writeFile,
  writeTextFile,
  writeJSONFile,
  readFile,
  readTextFile,
  readJSONFile,
  copyFile,
  deleteFile,
  createFileSymLink,
};
