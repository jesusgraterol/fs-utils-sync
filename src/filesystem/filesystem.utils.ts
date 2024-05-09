import { IDirectoryElementsOptions } from './types.js';

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





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // constants
  DIRECTORY_ELEMENTS_DEFAULT_OPTIONS,

  // directory elements
  buildDirectoryElementsOptions,
};
