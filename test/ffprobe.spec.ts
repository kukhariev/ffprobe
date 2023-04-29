import { expect } from 'chai';
import * as ffprobeStatic from 'ffprobe-static';
import { createReadStream } from 'fs';
import { Writable } from 'stream';
import { ffprobe, ffprobeSync } from '../src/ffprobe';

const testFile = './test/test file.mp4';
const testStream = createReadStream(testFile);
const testURL = 'https://github.com/kukhariev/ffprobe/raw/master/test/testfile.mp4';
const invalidStream = new Writable();

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
  // todo: https://github.com/kukhariev/ffprobe/issues/163#issue-1688898375
  (process.platform === 'linux' ? it.skip : it)('testURL', async () => {
    const metadata = await ffprobe(testURL);
    expect(metadata.format.filename).to.equal(testURL);
  }).timeout(5000);
  it('testStream', async () => {
    const metadata = await ffprobe(testStream);
    expect(+metadata.format.duration).to.equal(10);
  });
  it('invalidFile', async () => {
    let error: unknown;
    try {
      await ffprobe('');
    } catch (e) {
      error = e;
    }
    expect(error).to.be.an('Error');
  });
  it('invalidStream', async () => {
    let error: unknown;
    try {
      await ffprobe(invalidStream);
    } catch (e) {
      error = e;
    }
    expect(error).to.be.an('Error');
  });
  // todo: https://github.com/kukhariev/ffprobe/issues/163#issue-1688898375
  (process.platform === 'linux' ? it.skip : it)('invalidUrl', async () => {
    let error: unknown;
    try {
      await ffprobe('http://example.com/m.mp4');
    } catch (e) {
      error = e;
    }
    expect(error).to.be.an('Error');
  }).timeout(5000);
});

describe('ffprobe(input, cb)', () => {
  it('testFile', (done) => {
    ffprobe(testFile, (err, metadata) => {
      expect(Number(metadata?.format?.duration)).to.equal(10);
      expect(err).to.be.null;
      done();
    });
  });
  it('invalidFile', (done) => {
    ffprobe('', (err) => {
      expect(err).to.be.an('error');
      done();
    });
  });
});

describe('ffprobe path', () => {
  it('process.env.FFPROBE_PATH', async () => {
    ffprobe.path = '???';
    process.env.FFPROBE_PATH = ffprobeStatic.path;
    const metadata = await ffprobe(testFile);
    expect(+metadata.format.duration).to.equal(10);
  });

  it('invalid', async () => {
    ffprobe.path = '???';
    process.env.FFPROBE_PATH = undefined;
    let error: unknown;
    try {
      await ffprobe(testFile);
    } catch (e) {
      error = e;
    }
    expect(error).to.be.an('Error');
  });
});
