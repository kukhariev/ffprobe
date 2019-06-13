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
// optional: specify the binary path:
process.env.FFPROBE_PATH = '/usr/bin/ffprobe';
const { ffprobe, ffprobeSync } = require('@dropb/ffprobe');
// it's also possible:
ffprobe.FFPROBE_PATH = '/usr/bin/ffprobe';

// promise
ffprobe('./testfile.mp4')
  .then(data => console.log(data.format.duration))
  .catch(e => console.error(e));

// async/await
async function run() {
  try {
    // file
    const data = await ffprobe('./testfile.mp4');
    console.log(data.format.duration);
  } catch (e){
    console.error(e)
  }
  try {
    // URL
    const { streams } = await ffprobe('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4');
    console.log(streams[0].width);
  } catch (e){
    console.error(e)
  }
  try {
    // Readable Stream
    const { format } = await ffprobe(createReadStream('./testfile.mp4'));
    console.log(format.duration);
  } catch (e){
    console.error(e)
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

## License

[MIT](LICENSE)
