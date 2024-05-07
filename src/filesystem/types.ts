
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

  // the extension of the el. If the el has no extension, it will be an empty string ('')
  extName: string,

  // true if the el is a file
  isFile: boolean,

  // true if the el is a directory
  isDirectory: boolean,

  // true if the el is a symbolic link
  isSymbolicLink: boolean,

  // the size in bytes of the el
  size: number,

  // the date in which the el was created (in milliseconds)
  creation: number,
}





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // eslint-disable-next-line import/prefer-default-export
  IPathElement,
};
