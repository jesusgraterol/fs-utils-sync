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
  // some-dir/file-01.txt
  // some-dir/file-02.json
  // some-dir/inner
  // some-dir/inner/inner-01.txt
  ```
</details>

<details>
  <summary><code>getDirectoryElements</code></summary>
  
  Reads the contents of a directory based on the provided options and returns them.
  ```typescript
  import { readDirectory } from 'fs-utils-sync';

  readDirectory('some-dir', true);
  // some-dir/file-01.txt
  // some-dir/file-02.json
  // some-dir/inner
  // some-dir/inner/inner-01.txt
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
  <summary><code>IReadDirectoryOptions</code></summary>
  
  The options that can be provided to the `readdirSync` function to determine the output's format.
  ```typescript
  type IReadDirectoryOptions = {
    encoding: BufferEncoding | null;
    withFileTypes?: false | undefined;
    recursive?: boolean | undefined;
  } | BufferEncoding | null;
  ```
</details>

<details>
  <summary><code>IDirectoryElementsKeySort</code></summary>
  
  When querying the path elements from within a directory, a series of filters and sorting options can be provided.
  ```typescript
  type IDirectoryElementsKeySort = 'baseName' | 'size' | 'creation';
  ```
</details>

<details>
  <summary><code>IDirectoryElementsKeySort</code></summary>
  
  When querying the path elements from within a directory, a series of filters and sorting options can be provided.
  ```typescript
  type IDirectoryElementsKeySort = 'baseName' | 'size' | 'creation';
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
