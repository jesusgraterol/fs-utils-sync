

/* ************************************************************************************************
 *                                             ERRORS                                             *
 ************************************************************************************************ */
type IErrorCode = 'NOT_A_DIRECTORY' | 'NON_EXISTENT_DIRECTORY' | 'DIRECTORY_ALREADY_EXISTS'
| 'NON_EXISTENT_FILE' | 'NOT_A_FILE' | 'FILE_CONTENT_IS_EMPTY_OR_INVALID';
const ERRORS: { [key in IErrorCode]: IErrorCode } = {
  NOT_A_DIRECTORY: 'NOT_A_DIRECTORY',
  NON_EXISTENT_DIRECTORY: 'NON_EXISTENT_DIRECTORY',
  DIRECTORY_ALREADY_EXISTS: 'DIRECTORY_ALREADY_EXISTS',
  NON_EXISTENT_FILE: 'NON_EXISTENT_FILE',
  NOT_A_FILE: 'NOT_A_FILE',
  FILE_CONTENT_IS_EMPTY_OR_INVALID: 'FILE_CONTENT_IS_EMPTY_OR_INVALID',
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  ERRORS,
};
