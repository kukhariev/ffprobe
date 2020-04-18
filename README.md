# @dropb/ffprobe

[![npm](https://img.shields.io/npm/v/@dropb/ffprobe.svg?)](https://www.npmjs.com/package/@dropb/ffprobe)
[![build](https://img.shields.io/travis/kukhariev/ffprobe.svg?)](https://travis-ci.org/kukhariev/ffprobe)

simple ffprobe wrapper

## Install

```sh
npm install  @dropb/ffprobe
```

## Usage

```js
import { ffprobe, ffprobeSync } from '@dropb/ffprobe';
// optional: specify the ffprobe path
import * as ffprobeStatic from 'ffprobe-static';
process.env.FFPROBE_PATH = ffprobeStatic.path;
// or
// ffprobe.path = ffprobeStatic.path;

// async/await
async function run() {
  try {
    // file
    const data = await ffprobe('./testfile.mp4');
    console.log(data.format.duration);
  } catch (e) {
    console.error(e);
  }
  try {
    // URL
    const { streams } = await ffprobe('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4');
    console.log(streams[0].width);
  } catch (e) {
    console.error(e);
  }
  try {
    // Readable Stream
    const { format } = await ffprobe(createReadStream('./testfile.mp4'));
    console.log(format.duration);
  } catch (e) {
    console.error(e);
  }
}
run();

// node-style callback
ffprobe('./testfile.mp4', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data.format.duration);
  }
});

// sync
const data = ffprobeSync('./testfile.mp4');
console.log(data.format.duration);
```

## API

```ts
/**
 *
 * Run ffprobe on specified input
 * @param src FilePath / URL / Readable Stream
 */
function ffprobe(input: string | Stream): Promise<FfprobeData>;
function ffprobe(input: string | Stream, cb: (err: Error, data?: FfprobeData) => void): void;
```

> interface
> [FfprobeData](src/interfaces.ts)

## License

[MIT](LICENSE)
