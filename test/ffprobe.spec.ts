import * as ffprobeStatic from 'ffprobe-static';
process.env.FFPROBE_PATH = ffprobeStatic.path;

import { expect } from 'chai';
import { ffprobe, ffprobeSync } from '../src/';
const testFile = './test/testfile.mp4';

describe('ffprobeSync (sync)', () => {
  it('should return the duration', () => {
    const metadata = ffprobeSync(testFile);
    expect(+metadata.format.duration).to.equal(10);
  });
  it('should throw', () => {
    expect(() => ffprobeSync('')).to.throw();
  });
});

describe('ffprobe (async/await)', () => {
  it('should return the duration', async () => {
    const metadata = await ffprobe(testFile);
    expect(+metadata.format.duration).to.equal(10);
  });
  it('should catch the error', async () => {
    try {
      await ffprobe('');
      throw new Error('Expected an error!');
    } catch (err) {
      expect(err).to.be.an('error');
    }
  });
});

describe('ffprobe(node style callback)', () => {
  it('should return the duration', () => {
    ffprobe(testFile, (err, metadata) => {
      expect(+metadata.format.duration).to.equal(10);
      expect(err).to.be.null;
    });
  });
  it('should cause an error', () => {
    ffprobe('', err => {
      expect(err).to.be.an('error');
    });
  });
});
