import { ISortDirection } from 'web-utils-kit';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Path Element
 * The most relevant information regarding a path element, extracted by making use of the lstat
 * function.
 */
type IPathElement = {
  // the relative path of the el
  path: string;

  // the base name of the el
  baseName: string;

  // the ext of the el (e.g '.json'). If the el has no ext, it will be an empty string ('')
  extName: string;

  // true if the el is a file
  isFile: boolean;

  // true if the el is a directory
  isDirectory: boolean;

  // true if the el is a symbolic link
  isSymbolicLink: boolean; // when this property is true, isFile & isDirectory are false

  // the size in bytes of the el
  size: number;

  // the date in which the el was created (in milliseconds)
  creation: number;
};





/**
 * Read Directory Options
 * The options that can be provided to the readdirSync function to determine the output's format.
 */
type IReadDirectoryOptions = {
  encoding: BufferEncoding | null;
  withFileTypes?: false | undefined;
  recursive?: boolean | undefined;
} | BufferEncoding | null;





/**
 * Directory Elements Options
 * When querying the path elements from within a directory, a series of filters and sorting options
 * can be provided.
 */

type IDirectoryElementsKeySort = 'baseName' | 'size' | 'creation';

type IDirectoryElementsOptions = {
  // the key that will be used to sort the elements. Defaults to 'baseName'
  sortByKey: IDirectoryElementsKeySort;

  // the sort order that will be applied to the elements. Defaults to 'asc'
  sortOrder: ISortDirection;

  // the list of file extensions that will be included. Defaults to [] (includes all exts)
  includeExts: string[];
};

/**
 * Directory Path Elements
 * The output emitted when retrieving all the path elements within a directory.
 */
type IDirectoryPathElements = {
  directories: IPathElement[];
  files: IPathElement[];
  symbolicLinks: IPathElement[];
};





/**
 * Read File Options
 * The options that can be provided to the readFileSync function to determine the output's format.
 */

// string options
type IReadStringFileOptions = {
  encoding: BufferEncoding;
  flag?: string | undefined;
} | BufferEncoding;

// Buffer options
type IReadBufferFileOptions = {
  encoding?: null | undefined;
  flag?: string | undefined;
} | null;

// options
type IReadFileOptions = IReadBufferFileOptions | IReadStringFileOptions;





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IPathElement,
  IReadDirectoryOptions,
  IDirectoryElementsKeySort,
  IDirectoryElementsOptions,
  IDirectoryPathElements,
  IReadBufferFileOptions,
  IReadStringFileOptions,
  IReadFileOptions,
};
