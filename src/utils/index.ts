import {
  IDirectoryElementsKeySort,
  IDirectoryElementsOptions,
  IDirectoryElementsSortOrder,
  IPathElement,
} from '../shared/types.js';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the default options for querying directory elements
const DIRECTORY_ELEMENTS_DEFAULT_OPTIONS: IDirectoryElementsOptions = {
  sortByKey: 'baseName',
  sortOrder: 'asc',
  includeExts: [],
};





/* ************************************************************************************************
 *                                       DIRECTORY ELEMENTS                                       *
 ************************************************************************************************ */

/**
 * Builds the options that will be used to query the directory elements. Properties that are not
 * provided are filled with defaults.
 * @param options?
 * @returns IDirectoryElementsOptions
 */
const buildDirectoryElementsOptions = (
  options?: Partial<IDirectoryElementsOptions>,
): IDirectoryElementsOptions => ({
  sortByKey: options?.sortByKey ?? DIRECTORY_ELEMENTS_DEFAULT_OPTIONS.sortByKey,
  sortOrder: options?.sortOrder ?? DIRECTORY_ELEMENTS_DEFAULT_OPTIONS.sortOrder,
  includeExts: options?.includeExts ?? DIRECTORY_ELEMENTS_DEFAULT_OPTIONS.includeExts,
});

/**
 * Sorts a list of path elements by their baseName based on the provided sort order.
 * @param sortOrder
 * @returns number
 */
const __sortByBaseName = (sortOrder: IDirectoryElementsSortOrder) => (
  a: IPathElement,
  b: IPathElement,
): number => {
  const nameA: string = a.baseName.toLowerCase();
  const nameB: string = b.baseName.toLowerCase();
  if (nameA < nameB) {
    return sortOrder === 'asc' ? -1 : 1;
  }
  if (nameA > nameB) {
    return sortOrder === 'asc' ? 1 : -1;
  }
  return 0;
};

/**
 * Sorts a list of path elements by any numeric value based on the provided sort order.
 * @param key
 * @param sortOrder
 * @returns number
 */
const __sortByNumericValue = (key: 'creation' | 'size', sortOrder: IDirectoryElementsSortOrder) => (
  a: IPathElement,
  b: IPathElement,
): number => (sortOrder === 'asc' ? a[key] - b[key] : b[key] - a[key]);

/**
 * Returns the sort function based on the provided key and order.
 * @param key
 * @param order
 * @returns (a: IPathElement, b: IPathElement) => number
 */
const getDirectoryElementsSortFunc = (
  key: IDirectoryElementsKeySort,
  order: IDirectoryElementsSortOrder,
): (a: IPathElement, b: IPathElement) => number => {
  if (key === 'baseName') {
    return __sortByBaseName(order);
  }
  return __sortByNumericValue(key, order);
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // constants
  DIRECTORY_ELEMENTS_DEFAULT_OPTIONS,

  // directory elements
  buildDirectoryElementsOptions,
  getDirectoryElementsSortFunc,
};
