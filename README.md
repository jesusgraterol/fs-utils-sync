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
import { pathExist, getPathElement } from 'fs-utils-sync';

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
```



</br>

## API

### General Actions

- `pathExists(path: string): boolean`

- `getPathElement(path: string): IPathElement | null`



### Directory Actions

- `isDirectory(path: string): boolean`

- `deleteDirectory(path: string): void`

- `createDirectory(path: string, deleteIfExists?: boolean): void`

- `copyDirectory(srcPath: string, destPath: string): void`

- `createDirectorySymLink(target: string, path: string): void`

- `readDirectory(path: string, recursive?: boolean): string[]`

- `getDirectoryElements(path: string, options?: Partial<IDirectoryElementsOptions>): IDirectoryPathElements`


### File Actions

- `isFile(path: string): boolean`

- `writeFile(path: string, data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions): void`

- `writeTextFile(path: string, data: string): void`

- `writeJSONFile(path: string, data: object | string, space?: number): void`

- `writeBufferFile(path: string, data: Buffer): void`

- `readFile(path: string, options?: IReadFileOptions): string | Buffer`

- `readTextFile(path: string): string`

- `readJSONFile(path: string): object`

- `readBufferFile(path: string): Buffer`

- `copyFile(srcPath: string, destPath: string): void`

- `deleteFile(path: string): void`

- `createFileSymLink(target: string, path: string)`





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
