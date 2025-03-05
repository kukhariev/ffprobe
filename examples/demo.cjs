const { ffprobe } = require('../lib/index.js');
const { createReadStream } = require('node:fs');
// optional: specify the ffprobe path
ffprobe.path = require('ffprobe-static').path;
// or
// process.env.FFPROBE_PATH = require('ffprobe-static').path;

// async/await
async function run() {
  try {
    // file
    const data = await ffprobe('../test/test file.mp4');
    console.log(data.format.duration);
  } catch (e) {
    console.error(e);
  }
  try {
    // URL
    const { streams } = await ffprobe(
      'https://github.com/kukhariev/ffprobe/raw/master/test/test%20file.mp4'
    );
    console.log(streams[0]?.duration);
  } catch (e) {
    console.error(e);
  }
  try {
    // Readable Stream
    const { format } = await ffprobe(createReadStream('../test/test file.mp4'));
    console.log(format.duration);
  } catch (e) {
    console.error(e);
  }
}

run();

// node-style callback
ffprobe('../test/test file.mp4', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data.format.duration);
  }
});
