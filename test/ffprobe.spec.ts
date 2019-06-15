import { expect } from 'chai';
import * as ffprobeStatic from 'ffprobe-static';
import { createReadStream } from 'fs';
import { Writable } from 'stream';
import { ffprobe, ffprobeSync } from '../src/';

const testFile = './test/testfile.mp4';
const testStream = createReadStream(testFile);
const testURL = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const invalidStream = new Writable();

// process.env.FFPROBE_PATH = ffprobeStatic.path;
ffprobe.path = ffprobeStatic.path;
describe('ffprobeSync(input)', () => {
  it('testFile', () => {
    const metadata = ffprobeSync(testFile);
    expect(+metadata.format.duration).to.equal(10);
  });
  it('invalidFile', () => {
    expect(() => ffprobeSync('')).to.throw();
  });
});

describe('ffprobe(input)', () => {
  it('testFile', async () => {
    const metadata = await ffprobe(testFile);
    expect(+metadata.format.duration).to.equal(10);
  });
  it('testURL', async () => {
    const metadata = await ffprobe(testURL);
    expect(metadata.format.filename).to.equal(testURL);
  });
  it('testStream', async () => {
    const metadata = await ffprobe(testStream);
    expect(+metadata.format.duration).to.equal(10);
  });
  it('invalidFile', async () => {
    let error;
    try {
      await ffprobe('');
    } catch (e) {
      error = e;
    }
    expect(error).to.be.an('Error');
  });
  it('invalidStream', async () => {
    let error;
    try {
      await ffprobe(invalidStream);
    } catch (e) {
      error = e;
    }
    expect(error).to.be.an('Error');
  });
  it('invalidUrl', async () => {
    let error;
    try {
      await ffprobe('http://example.com/m.mp4');
    } catch (e) {
      error = e;
    }
    expect(error).to.be.an('Error');
  });
});

describe('ffprobe(input, cb)', () => {
  it('testFile', done => {
    ffprobe(testFile, (err, metadata) => {
      const res = +metadata.format.duration;
      expect(res).to.equal(10);
      expect(err).to.be.null;
      done();
    });
  });
  it('invalidFile', done => {
    ffprobe('', err => {
      expect(err).to.be.an('error');
      done();
    });
  });
});
