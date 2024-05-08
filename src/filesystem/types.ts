
/* ************************************************************************************************
 *                                          CORE TYPES                                            *
 ************************************************************************************************ */

/**
 * Path Element
 * The most relevant information regarding a path element, extracted by making use of the lstat
 * method.
 */
interface IPathElement {
  // the relative path of the el
  path: string,

  // the base name of the el
  baseName: string,

  // the ext of the el (e.g '.json'). If the el has no ext, it will be an empty string ('')
  extName: string,

  // true if the el is a file
  isFile: boolean,

  // true if the el is a directory
  isDirectory: boolean,

  // true if the el is a symbolic link
  isSymbolicLink: boolean, // when this property is true, isFile & isDirectory are false

  // the size in bytes of the el
  size: number,

  // the date in which the el was created (in milliseconds)
  creation: number,
}

/**
 * Read File Options
 * The options that can be provided to the readFileSync function and determine the output's format.
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
export {
  IPathElement,
  IReadBufferFileOptions,
  IReadStringFileOptions,
  IReadFileOptions,
};
