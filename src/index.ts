import { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';
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
  openSync,
  closeSync,
  fchmodSync,
  fsyncSync,
  renameSync,
  statSync,
  fstatSync,
  readSync,
  constants,
} from 'node:fs';
import { basename, extname, dirname, join, relative, resolve, isAbsolute, sep } from 'node:path';
import { encodeError, extractMessage } from 'error-message-utils';
import { sortRecords } from 'web-utils-kit';
import {
  IPathElement,
  IDirectoryElementsKeySort,
  IReadDirectoryOptions,
  IDirectoryElementsOptions,
  IDirectoryPathElements,
  IReadFileOptions,
} from './shared/types.js';
import { ERRORS } from './shared/errors.js';
import { buildDirectoryElementsOptions } from './utils/index.js';

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

/**
 * Checks if the target path is the root path itself or is nested inside it. The check is lexical:
 * both paths are resolved without touching the filesystem, and symbolic links aren't followed.
 * Sibling paths that share a prefix, such as '/data/app' and '/data/application', aren't nested,
 * and neither is a path on another drive on Windows.
 * @param rootPath
 * @param targetPath
 * @returns boolean
 */
const isPathWithin = (rootPath: string, targetPath: string): boolean => {
  const relativePath = relative(resolve(rootPath), resolve(targetPath));
  return (
    relativePath === '' ||
    (relativePath !== '..' && !relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath))
  );
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
 * Creates a directory at a given path.
 * @param path
 * @param deleteIfExists?
 * @throws
 * - DIRECTORY_ALREADY_EXISTS: if the directory already exists and deleteIfExists is falsy
 */
const createDirectory = (path: string, deleteIfExists?: boolean): void => {
  // check if the dir already exists and if it should be deleted
  if (isDirectory(path)) {
    if (deleteIfExists) {
      deleteDirectory(path);
    } else {
      throw new Error(
        encodeError(`The directory ${path} already exists.`, ERRORS.DIRECTORY_ALREADY_EXISTS),
      );
    }
  }
  mkdirSync(path, { recursive: true });
};

/**
 * It copies a directory (and sub directories) from srcPath to destPath. Keep in mind the destPath
 * is completely overridden.
 * @param srcPath
 * @param destPath
 * @throws
 * - NOT_A_DIRECTORY: if the srcPath is not a directory
 */
const copyDirectory = (srcPath: string, destPath: string): void => {
  if (!isDirectory(srcPath)) {
    throw new Error(
      encodeError(`The srcPath '${srcPath}' is not a directory.`, ERRORS.NOT_A_DIRECTORY),
    );
  }
  deleteDirectory(destPath);
  cpSync(srcPath, destPath, { recursive: true });
};

/**
 * Creates a symlink for the target directory at path.
 * @param target
 * @param path
 * @throws
 * - NON_EXISTENT_DIRECTORY: if the target directory doesn't exist
 * - NOT_A_DIRECTORY: if the target directory is not considered a directory by the OS
 */
const createDirectorySymLink = (target: string, path: string): void => {
  const el = getPathElement(target);
  if (el === null) {
    throw new Error(
      encodeError(`The target dir '${target}' does not exist.`, ERRORS.NON_EXISTENT_DIRECTORY),
    );
  }
  if (!el.isDirectory) {
    throw new Error(
      encodeError(`The target dir '${target}' is not a directory.`, ERRORS.NOT_A_DIRECTORY),
    );
  }
  symlinkSync(target, path, 'dir');
};

/**
 * Reads the contents of a directory based on the provided options and returns them.
 * @param path
 * @param recursive?
 * @returns string[]
 * @throws
 * - NOT_A_DIRECTORY: if the directory is not considered a directory by the OS.
 */
const readDirectory = (path: string, recursive: boolean = false): string[] => {
  if (!isDirectory(path)) {
    throw new Error(encodeError(`The dir '${path}' is not a directory.`, ERRORS.NOT_A_DIRECTORY));
  }
  return readdirSync(path, <IReadDirectoryOptions>{ encoding: 'utf-8', recursive }).map(
    (contentPath) => `${path}/${contentPath}`,
  );
};

/**
 * Retrieves all the path elements in the given directory based on the provided options.
 * IMPORTANT: if the includeExts option is provided, make sure to lowercase all
 * extensions (e.g '.json').
 * @param path
 * @param options?
 * @returns IDirectoryPathElements
 * @throws
 * - NOT_A_DIRECTORY: if the directory doesn't exist or is not considered a directory by the OS
 */
const getDirectoryElements = (
  path: string,
  options?: Partial<IDirectoryElementsOptions>,
): IDirectoryPathElements => {
  if (!isDirectory(path)) {
    throw new Error(encodeError(`The path '${path} is not a directory'`, ERRORS.NOT_A_DIRECTORY));
  }
  // build the options
  const opts = buildDirectoryElementsOptions(options);

  // init the lists
  const directories: IPathElement[] = [];
  const files: IPathElement[] = [];
  const symbolicLinks: IPathElement[] = [];

  // read the directory contents and retrieve the path elements
  const els: IPathElement[] = readDirectory(path).map((p) => <IPathElement>getPathElement(p));

  // distribute the els accordingly and apply the file filter (if any)
  els.forEach((el: IPathElement) => {
    if (el.isDirectory) {
      directories.push(el);
    } else if (
      el.isFile &&
      (!opts.includeExts.length || opts.includeExts.includes(el.extName.toLowerCase()))
    ) {
      files.push(el);
    } else if (el.isSymbolicLink) {
      symbolicLinks.push(el);
    }
  });

  // sort the elements according to the provided options
  directories.sort(sortRecords(opts.sortByKey, opts.sortOrder));
  files.sort(sortRecords(opts.sortByKey, opts.sortOrder));
  symbolicLinks.sort(sortRecords(opts.sortByKey, opts.sortOrder));

  // finally, return the elements build
  return { directories, files, symbolicLinks };
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
 * @param options?
 */
const writeFile = (
  path: string,
  data: string | NodeJS.ArrayBufferView,
  options?: WriteFileOptions,
): void => {
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
 * @throws
 * - FILE_CONTENT_IS_EMPTY_OR_INVALID: if data is not a valid string.
 */
const writeTextFile = (path: string, data: string): void => {
  if (typeof data !== 'string' || !data.length) {
    throw new Error(
      encodeError(
        `The provided data for the file '${path}' is empty or invalid. Received: ${data}`,
        ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID,
      ),
    );
  }
  writeFile(path, data, { encoding: 'utf-8' });
};

/**
 * Writes a JSON file on a given path. If an object is provided, it will be stringified.
 * @param path
 * @param data
 * @param space?
 * @throws
 * - FILE_CONTENT_IS_EMPTY_OR_INVALID: if the JSON content cannot be stringified
 */
const writeJSONFile = <T = Record<string, any>>(
  path: string,
  data: T | string,
  space: number = 2,
): void => {
  let fileData: string;
  try {
    fileData = typeof data === 'string' ? data : JSON.stringify(data, undefined, space);
  } catch (e) {
    throw new Error(
      encodeError(
        `The JSON data for the file '${path}' could not be stringified: ${extractMessage(e)}`,
        ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID,
      ),
    );
  }
  writeTextFile(path, fileData);
};

/**
 * Writes a Buffer file on a given path.
 * @param path
 * @param data
 * @throws
 * - FILE_CONTENT_IS_EMPTY_OR_INVALID: if the provided data is not a valid Buffer
 */
const writeBufferFile = (path: string, data: Buffer): void => {
  if (!Buffer.isBuffer(data)) {
    throw new Error(
      encodeError(
        `The provided data is not a valid Buffer. Received: ${data}`,
        ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID,
      ),
    );
  }
  writeFile(path, data);
};

/**
 * Reads and returns the contents of a file.
 * @param path
 * @param options?
 * @returns string | Buffer
 * @throws
 * - NOT_A_FILE: if the path is not recognized by the OS as a file or if it doesn't exist
 */
const readFile = (path: string, options: IReadFileOptions = null): string | Buffer => {
  if (!isFile(path)) {
    throw new Error(encodeError(`The file '${path}' is not a file.`, ERRORS.NOT_A_FILE));
  }
  return readFileSync(path, options);
};

/**
 * Reads a text file and returns its contents.
 * @param path
 * @returns string
 * @throws
 * - NOT_A_FILE: if the path is not recognized by the OS as a file or if it doesn't exist
 * - FILE_CONTENT_IS_EMPTY_OR_INVALID: if the content of the file is empty or invalid
 */
const readTextFile = (path: string): string => {
  const content = readFile(path, { encoding: 'utf-8' });
  if (typeof content !== 'string' || !content.length) {
    throw new Error(
      encodeError(
        `The file '${path}' is empty or invalid.`,
        ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID,
      ),
    );
  }
  return content;
};

/**
 * Reads a text file, parses and returns its contents.
 * @param path
 * @returns object
 * @throws
 * - NOT_A_FILE: if the path is not recognized by the OS as a file or if it doesn't exist
 * - FILE_CONTENT_IS_EMPTY_OR_INVALID: if the content of the file is empty or invalid
 * - FILE_CONTENT_IS_EMPTY_OR_INVALID: if the file's JSON content cannot be parsed
 */
const readJSONFile = <T = Record<string, any>>(path: string): T => {
  const content = readTextFile(path);
  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error(
      encodeError(
        `The JSON file '${path}' cound not be parsed: ${extractMessage(e)}`,
        ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID,
      ),
    );
  }
};

/**
 * Reads a Buffer file and returns its contents.
 * @param path
 * @returns Buffer
 * @throws
 * - NOT_A_FILE: if the path is not recognized by the OS as a file or if it doesn't exist
 * - FILE_CONTENT_IS_EMPTY_OR_INVALID: if the content of the file is empty or is not a Buffer
 */
const readBufferFile = (path: string): Buffer => {
  const content = readFile(path, null);
  if (!Buffer.isBuffer(content) || !content.toString().length) {
    throw new Error(
      encodeError(
        `The file '${path}' is not a valid Buffer. Received: ${content}`,
        ERRORS.FILE_CONTENT_IS_EMPTY_OR_INVALID,
      ),
    );
  }
  return content;
};

/**
 * Copies a file from srcPath to destPath, replacing the destination if it exists.
 * @param srcPath
 * @param destPath
 * @throws
 * - NOT_A_FILE: if the srcPath doesnt exist or is not recognized as a file by the OS
 */
const copyFile = (srcPath: string, destPath: string): void => {
  if (!isFile(srcPath)) {
    throw new Error(encodeError(`The file '${srcPath}' is not a file.`, ERRORS.NOT_A_FILE));
  }
  copyFileSync(srcPath, destPath);
};

/**
 * Deletes the file located at the provided path.
 * @param path
 * @throws
 * - NOT_A_FILE: if the path doesnt exist or is not recognized as a file by the OS
 */
const deleteFile = (path: string): void => {
  if (!isFile(path)) {
    throw new Error(encodeError(`The file '${path} is not a file.'`, ERRORS.NOT_A_FILE));
  }
  unlinkSync(path);
};

/**
 * Creates a symlink for a given file.
 * @param target
 * @param path
 * @throws
 * - NON_EXISTENT_FILE: if the target file does not exist
 * - NOT_A_FILE: if the path is not recognized as a file by the OS
 */
const createFileSymLink = (target: string, path: string) => {
  const el = getPathElement(target);
  if (el === null) {
    throw new Error(
      encodeError(`The target file '${target}' does not exist.`, ERRORS.NON_EXISTENT_FILE),
    );
  }
  if (!el.isFile) {
    throw new Error(encodeError(`The target file '${target}' is not a file.`, ERRORS.NOT_A_FILE));
  }
  symlinkSync(target, path, 'file');
};

/**
 * Reads the permission bits of an existing file, or returns undefined when it doesn't exist.
 * @param path
 * @returns number | undefined
 */
const readPermissionBits = (path: string): number | undefined => {
  try {
    return statSync(path).mode & 0o777;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw e;
  }
};

/**
 * Flushes a directory's entries to disk, so a rename inside it survives a crash.
 * @param path
 */
const syncDirectory = (path: string): void => {
  const fd = openSync(path, 'r');
  try {
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
};

/**
 * Writes a file atomically: readers see either the previous content or the complete new content,
 * never a partial write. The data goes to a temporary file in the same directory, which is
 * flushed to disk and then renamed over the path. On POSIX, the directory is flushed as well.
 *
 * An explicit mode wins. Without one, a replaced file keeps its permission bits, and a new file
 * gets the platform default, as with writeFile. The temporary file is never readable more widely
 * than the final mode. The owner of a replaced file isn't preserved.
 *
 * When writing fails before the rename, the temporary file is removed, the destination is left
 * untouched and the original error is rethrown. If flushing the directory fails after the rename,
 * the error is thrown even though the destination already holds the new content.
 * @param path
 * @param data
 * @param mode? the permission bits of the written file, for example 0o600
 */
const writeFileAtomic = (
  path: string,
  data: string | NodeJS.ArrayBufferView,
  mode?: number,
): void => {
  const dirName = dirname(path);
  if (!pathExists(dirName)) {
    createDirectory(dirName);
  }
  const finalMode = mode ?? readPermissionBits(path);
  const tempPath = join(dirName, `.${randomUUID()}.tmp`);
  let isRenamed = false;
  try {
    // a known final mode is applied with fchmod, so the umask can't change it
    const fd = openSync(tempPath, 'wx', finalMode === undefined ? 0o666 : 0o600);
    try {
      if (finalMode !== undefined) {
        fchmodSync(fd, finalMode);
      }
      writeFileSync(fd, data);
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    renameSync(tempPath, path);
    isRenamed = true;
  } finally {
    if (!isRenamed) {
      rmSync(tempPath, { force: true });
    }
  }
  if (process.platform !== 'win32') {
    syncDirectory(dirName);
  }
};

// the number of bytes read per call by readBoundedFile
const BOUNDED_READ_CHUNK_SIZE = 65536;

/**
 * Opens a file for a bounded read without following a symbolic link in its final component.
 * @param path
 * @returns number
 * @throws
 * - NOT_A_FILE: if the path doesn't exist or its final component is a symbolic link
 */
const openWithoutFollowing = (path: string): number => {
  try {
    if (process.platform === 'win32') {
      // Windows has no O_NOFOLLOW, so a link swapped in after this check isn't detected
      if (lstatSync(path).isSymbolicLink()) {
        throw new Error(encodeError(`The file '${path}' is a symbolic link.`, ERRORS.NOT_A_FILE));
      }
      return openSync(path, constants.O_RDONLY);
    }
    // O_NONBLOCK keeps a named pipe at the path from blocking the open
    return openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    if (code === 'ENOENT' || code === 'ELOOP' || code === 'EMLINK') {
      throw new Error(
        encodeError(
          `The file '${path}' doesn't exist or is a symbolic link: ${extractMessage(e)}`,
          ERRORS.NOT_A_FILE,
        ),
      );
    }
    throw e;
  }
};

/**
 * Reads a regular file of at most maxBytes bytes and returns its content. It never follows a
 * symbolic link in the path's final component, but links in parent directories are followed, so
 * callers that need containment should combine it with isPathWithin and their own checks of the
 * parent directories. It reads at most maxBytes + 1 bytes, even when the file grows while it is
 * being read.
 * @param path
 * @param maxBytes
 * @returns Buffer
 * @throws
 * - NOT_A_FILE: if the path doesn't exist, its final component is a symbolic link, or it isn't a regular file
 * - FILE_TOO_LARGE: if the file holds more than maxBytes bytes
 */
const readBoundedFile = (path: string, maxBytes: number): Buffer => {
  const fd = openWithoutFollowing(path);
  try {
    const stats = fstatSync(fd);
    if (!stats.isFile()) {
      throw new Error(encodeError(`The file '${path}' is not a file.`, ERRORS.NOT_A_FILE));
    }
    const tooLarge = () =>
      new Error(
        encodeError(`The file '${path}' is larger than ${maxBytes} bytes.`, ERRORS.FILE_TOO_LARGE),
      );
    if (stats.size > maxBytes) {
      throw tooLarge();
    }
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    while (totalBytes <= maxBytes) {
      const chunk = Buffer.allocUnsafe(
        Math.min(BOUNDED_READ_CHUNK_SIZE, maxBytes + 1 - totalBytes),
      );
      const bytesRead = readSync(fd, chunk, 0, chunk.length, totalBytes);
      if (bytesRead === 0) {
        break;
      }
      chunks.push(chunk.subarray(0, bytesRead));
      totalBytes += bytesRead;
    }
    if (totalBytes > maxBytes) {
      throw tooLarge();
    }
    return Buffer.concat(chunks, totalBytes);
  } finally {
    closeSync(fd);
  }
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type IPathElement,
  type IDirectoryElementsKeySort,
  type IDirectoryElementsOptions,
  type IDirectoryPathElements,

  // general actions
  pathExists,
  getPathElement,
  isPathWithin,

  // directory actions
  isDirectory,
  createDirectory,
  copyDirectory,
  deleteDirectory,
  createDirectorySymLink,
  readDirectory,
  getDirectoryElements,

  // file actions
  isFile,
  writeFile,
  writeTextFile,
  writeJSONFile,
  writeBufferFile,
  readFile,
  readTextFile,
  readJSONFile,
  readBufferFile,
  copyFile,
  deleteFile,
  createFileSymLink,
  writeFileAtomic,
  readBoundedFile,
};
