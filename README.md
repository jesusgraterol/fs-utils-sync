# Filesystem Utils Sync

Streamline synchronous file system interactions in your Node.js projects with the lightweight `fs-utils-sync` package. It provides a collection of well-defined utility functions that enforce consistency across projects, ensuring an unified approach to file system operations.





</br>

## Getting Started

Install the package:
```bash
$ npm install -S fs-utils-sync
```





</br>

## Usage Examples
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

pathExists('project/some-dir'); // true
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

#### `pathExists(path: string): boolean`

#### `getPathElement(path: string): IPathElement | null`



### Directory Actions

#### `isDirectory(path: string): boolean`

#### `deleteDirectory(path: string): void`

#### `createDirectory(path: string, deleteIfExists?: boolean): void`

#### `copyDirectory(srcPath: string, destPath: string): void`

#### `createDirectorySymLink(target: string, path: string): void`

#### `readDirectory(path: string, options?: IReadDirectoryOptions)`


### File Actions

#### `isFile(path: string): boolean`

#### `writeFile(path: string, data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions): void`

#### `writeTextFile(path: string, data: string): void`

#### `writeJSONFile(path: string, data: object | string, space?: number): void`

#### `writeBufferFile(path: string, data: Buffer): void`

#### `readFile(path: string, options?: IReadFileOptions): string | Buffer`

#### `readTextFile(path: string): string`

#### `readJSONFile(path: string): object`

#### `readBufferFile(path: string): Buffer`

#### `copyFile(srcPath: string, destPath: string): void`

#### `deleteFile(path: string): void`

#### `createFileSymLink(target: string, path: string)`

<br/>

## Built With

- TypeScript




<br/>

## Running the Tests

```bash
# Unit Tests
$ npm run test:unit

# Integration Tests
$ npm run test:integration
```





<br/>

## License

[MIT](https://choosealicense.com/licenses/mit/)





<br/>

## Acknowledgments

- ...





<br/>

## @TODOS

- [ ] Upgrade the package's documentation
- [ ] Implement and test `compressDirectory` and `decompressDirectory`
- [ ] Implement and test `compressFile` and `decompressFile`





<br/>

## Deployment

Install dependencies:
```bash
$ npm install
```


Build the library:
```bash
$ npm start
```


Publish to `npm`:
```bash
$ npm publish
```
