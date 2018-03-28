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
// optional: specify the binary path
process.env.FFPROBE_PATH = '/usr/bin/ffprobe';
const { ffprobe, ffprobeSync } = require('@dropb/ffprobe');

// sync
const data = ffprobeSync('./testfile.mp4');
console.log(data.format.duration);

// promise
ffprobe('./testfile.mp4')
  .then(data => console.log(data.format.duration))
  .catch(err => console.error(err));

// async/await
async function run() {
  const data = await ffprobe('./testfile.mp4');
  console.log(data.format.duration)
}
run();

// node-style callback
ffprobe('./testfile.mp4', (err, data) => {
  if (err) { console.error(err); }
  else { console.log(data.format.duration); }
});
```

## License

[MIT](LICENSE)
