# Filesystem Utils Sync

The `fs-utils-sync` package provides a collection of well-tested, synchronous file system utility functions. It promotes consistency and readability across projects by providing a unified approach to common file operations, saving you development time and improving code quality.



</br>

## Getting Started

Install the package:
```bash
npm install -S fs-utils-sync
```

### Examples
```
project
    │
    some-dir/
    │    └───...
    │
    some-file.json
```
```typescript
import { pathExist, getPathElement, deleteFile } from 'fs-utils-sync';

pathExists('project'); // true
pathExists('project/some-dir'); // true
pathExists('project/some-other-dir'); // false
pathExists('project/some-file.json'); // true
pathExists('project/other-file.json'); // false

getPathElement('project/other-file.json'); // null
getPathElement('project/some-file.json');
// {
//    path: 'project/some-file.json',
//    baseName: 'some-file.json',
//    extName: '.json',
//    isFile: true,
//    isDirectory: false,
//    isSymbolicLink: false,
//    size: 8647,
//    creation: 1715264137289,
// }

deleteFile('project/some-file.json');
getPathElement('project/some-file.json'); // null
```





<br/>

## API Reference

### General Actions

<details>
  <summary><code>pathExists</code></summary>
  
  Checks if a path exists (file or directory).
  ```typescript
  import { pathExists } from 'fs-utils-sync';

  pathExists('some-existent-dir'); // true
  pathExists('some-non-existent-file.json'); // false
  ```
</details>

<details>
  <summary><code>getPathElement</code></summary>
  
  Reads the content of a given path and returns the stats. If the path doesn't exist, it returns `null`
  ```typescript
  import { getPathElement } from 'fs-utils-sync';

  getPathElement('project/some-file.json');
  // {
  //    path: 'project/some-file.json',
  //    baseName: 'some-file.json',
  //    extName: '.json',
  //    isFile: true,
  //    isDirectory: false,
  //    isSymbolicLink: false,
  //    size: 8647,
  //    creation: 1715264137289,
  // }
  ```
</details>

### Directory Actions

<details>
  <summary><code>isDirectory</code></summary>
  
  Verifies if a given path exists and is a directory.
  ```typescript
  import { isDirectory } from 'fs-utils-sync';

  isDirectory('some-existent-dir'); // true
  isDirectory('some-non-existent-dir'); // false
  isDirectory('some-existent-file.json'); // false
  ```
</details>

<details>
  <summary><code>deleteDirectory</code></summary>
  
  Deletes the directory located in the given path.
  ```typescript
  import { isDirectory, deleteDirectory } from 'fs-utils-sync';

  isDirectory('some-existent-dir'); // true
  deleteDirectory('some-non-existent-dir');
  isDirectory('some-existent-dir'); // false
  ```
</details>

<details>
  <summary><code>createDirectory</code></summary>
  
  Creates a directory at a given path.
  ```typescript
  import { isDirectory, createDirectory } from 'fs-utils-sync';

  isDirectory('some-dir'); // false
  createDirectory('some-dir');
  isDirectory('some-dir'); // true
  ```
</details>

<details>
  <summary><code>copyDirectory</code></summary>
  
  It copies a directory (and sub directories) from `srcPath` to `destPath`. Keep in mind the `destPath` is completely overridden.
  ```typescript
  import { isDirectory, copyDirectory } from 'fs-utils-sync';

  isDirectory('some-dir'); // true
  isDirectory('my-copy'); // false
  copyDirectory('some-dir', 'my-copy');
  isDirectory('my-copy'); // true
  ```
</details>

<details>
  <summary><code>createDirectorySymLink</code></summary>
  
  Creates a symlink for the `target` directory at `path`.
  ```typescript
  import { createDirectorySymLink } from 'fs-utils-sync';

  createDirectorySymLink('some-dir', 'some-dir-symlink');
  ```
</details>

<details>
  <summary><code>readDirectory</code></summary>
  
  Reads the contents of a directory based on the provided options and returns them.
  ```typescript
  import { readDirectory } from 'fs-utils-sync';

  readDirectory('some-dir', true);
  // [
  //   'some-dir/file-01.txt',
  //   'some-dir/file-02.json',
  //   'some-dir/inner',
  //   'some-dir/inner/inner-01.txt'
  // ]
  ```
</details>

<details>
  <summary><code>getDirectoryElements</code></summary>
  
  Retrieves all the path elements in the given directory based on the provided options. 
  IMPORTANT: if the `includeExts` option is provided, make sure to lowercase all extensions (e.g `'.json'`).
  ```typescript
  import { getDirectoryElements } from 'fs-utils-sync';

  getDirectoryElements('fs-test-dir');
  // {
  //   directories: [
  //     {
  //       path: 'fs-test-dir/another-dir',
  //       baseName: 'another-dir',
  //       extName: '',
  //       isFile: false,
  //       isDirectory: true,
  //       isSymbolicLink: false,
  //       size: 4096,
  //       creation: 1733515026497
  //     },
  //     {
  //       path: 'fs-test-dir/some-dir',
  //       baseName: 'some-dir',
  //       extName: '',
  //       isFile: false,
  //       isDirectory: true,
  //       isSymbolicLink: false,
  //       size: 4096,
  //       creation: 1733515026497
  //     }
  //   ],
  //   files: [
  //     {
  //       path: 'fs-test-dir/aafile.json',
  //       baseName: 'aafile.json',
  //       extName: '.json',
  //       isFile: true,
  //       isDirectory: false,
  //       isSymbolicLink: false,
  //       size: 18,
  //       creation: 1733515026497
  //     },
  //     {
  //       path: 'fs-test-dir/afile.txt',
  //       baseName: 'afile.txt',
  //       extName: '.txt',
  //       isFile: true,
  //       isDirectory: false,
  //       isSymbolicLink: false,
  //       size: 12,
  //       creation: 1733515026497
  //     }
  //   ],
  //   symbolicLinks: [
  //     {
  //       path: 'fs-test-dir/aafile-sl.json',
  //       baseName: 'aafile-sl.json',
  //       extName: '.json',
  //       isFile: false,
  //       isDirectory: false,
  //       isSymbolicLink: true,
  //       size: 23,
  //       creation: 1733515026497
  //     },
  //     {
  //       path: 'fs-test-dir/some-dir-sl',
  //       baseName: 'some-dir-sl',
  //       extName: '',
  //       isFile: false,
  //       isDirectory: false,
  //       isSymbolicLink: true,
  //       size: 20,
  //       creation: 1733515026497
  //     }
  //   ]
  // }
  ```
</details>


### File Actions

<details>
  <summary><code>isFile</code></summary>
  
  Verifies if a given path exists and is a file.
  ```typescript
  import { isFile } from 'fs-utils-sync';

  isFile('existent-file.json'); // true
  isFile('non-existent-file.json'); // false
  ```
</details>

<details>
  <summary><code>writeFile</code></summary>
  
  Creates the base directory for a file in case it doesn't exist and then it writes the file.
  ```typescript
  import { writeFile } from 'fs-utils-sync';

  writeFile('test-file.txt', 'Hello World!', { encoding: 'utf-8' });
  ```
</details>

<details>
  <summary><code>writeTextFile</code></summary>
  
  Writes a text file on a given path.
  ```typescript
  import { writeTextFile } from 'fs-utils-sync';

  writeTextFile('test-file.txt', 'Hello World!');
  ```
</details>

<details>
  <summary><code>writeJSONFile</code></summary>
  
  Writes a JSON file on a given path. If an object is provided, it will be stringified.
  ```typescript
  import { writeJSONFile } from 'fs-utils-sync';

  writeJSONFile('test-file.json', { id: 1, nickname: 'test-user' });
  ```
</details>

<details>
  <summary><code>writeBufferFile</code></summary>
  
  Writes a JSON file on a given path. If an object is provided, it will be stringified.
  ```typescript
  import { Buffer } from 'node:buffer';
  import { writeBufferFile } from 'fs-utils-sync';

  writeBufferFile('test-file', Buffer.from('Hello World!'));
  ```
</details>

<details>
  <summary><code>readFile</code></summary>
  
  Reads and returns the contents of a file.
  ```typescript
  import { readFile } from 'fs-utils-sync';

  readFile('test-file.txt', { encoding: 'utf-8' }); // 'Hello World!'
  ```
</details>

<details>
  <summary><code>readTextFile</code></summary>
  
  Reads a text file and returns its contents.
  ```typescript
  import { readTextFile } from 'fs-utils-sync';

  readTextFile('test-file.txt'); // 'Hello World!'
  ```
</details>

<details>
  <summary><code>readJSONFile</code></summary>
  
  Reads a text file, parses and returns its contents.
  ```typescript
  import { readJSONFile } from 'fs-utils-sync';

  readJSONFile('test-file.json'); // { id: 1, nickname: 'test-user' }
  ```
</details>

<details>
  <summary><code>readBufferFile</code></summary>
  
  Reads a Buffer file and returns its contents.
  ```typescript
  import { readBufferFile } from 'fs-utils-sync';

  readBufferFile('test-file'); // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64 21>
  ```
</details>

<details>
  <summary><code>copyFile</code></summary>
  
  Copies a file from `srcPath` to `destPath`, replacing the destination if it exists.
  ```typescript
  import { isFile, copyFile } from 'fs-utils-sync';

  isFile('file-a.json'); // true
  isFile('file-b.json'); // false
  copyFile('file-a.json', 'file-b.json');
  isFile('file-b.json'); // true
  ```
</details>

<details>
  <summary><code>deleteFile</code></summary>
  
  Deletes the file located at the provided `path`.
  ```typescript
  import { isFile, deleteFile } from 'fs-utils-sync';

  isFile('file-a.json'); // true
  deleteFile('file-a.json');
  isFile('file-a.json'); // false
  ```
</details>

<details>
  <summary><code>createFileSymLink</code></summary>
  
  Creates a symlink for a given file.
  ```typescript
  import { createFileSymLink } from 'fs-utils-sync';

  createFileSymLink('test-file.txt', 'test-file-symlink.txt');
  ```
</details>





<br/>

## Types

<details>
  <summary><code>IPathElement</code></summary>
  
  The most relevant information regarding a path element, extracted by making use of the `lstat` function.
  ```typescript
  interface IPathElement {
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
  }
  ```
</details>

<details>
  <summary><code>IDirectoryElementsOptions</code></summary>
  
  When querying the path elements from within a directory, a series of filters and sorting options can be provided.
  ```typescript
  import { ISortDirection } from 'web-utils-kit';

  type IDirectoryElementsKeySort = 'baseName' | 'size' | 'creation';

  type IDirectoryElementsOptions = {
    // the key that will be used to sort the elements. Defaults to 'baseName'
    sortByKey: IDirectoryElementsKeySort;

    // the sort order that will be applied to the elements. Defaults to 'asc'
    sortOrder: ISortDirection;

    // the list of file extensions that will be included. Defaults to [] (includes all exts)
    includeExts: string[];
  };
  ```
</details>

<details>
  <summary><code>IDirectoryPathElements</code></summary>
  
  The output emitted when retrieving all the path elements within a directory.
  ```typescript
  type IDirectoryPathElements = {
    directories: IPathElement[];
    files: IPathElement[];
    symbolicLinks: IPathElement[];
  };
  ```
</details>





<br/>

## Built With

- TypeScript




<br/>

## Running the Tests

```bash
# unit tests
npm run test:unit

# integration tests
npm run test:integration
```





<br/>

## License

[MIT](https://choosealicense.com/licenses/mit/)





<br/>

## Deployment

Install dependencies:
```bash
npm install
```


Build the library:
```bash
npm start
```


Publish to `npm`:
```bash
npm publish
```
