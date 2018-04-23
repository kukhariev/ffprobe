import * as ffprobeStatic from 'ffprobe-static';
process.env.FFPROBE_PATH = ffprobeStatic.path;
import { expect } from 'chai';
import { ffprobe, ffprobeSync } from '../src/';
const testFile = './test/testfile.mp4';

describe('ffprobeSync (sync)', () => {
  it('should return the duration', () => {
    const metadata = ffprobeSync(testFile);
    expect(metadata.format.duration).to.equal('10.000000');
  });
  it('should throw', () => {
    expect(() => ffprobeSync('')).to.throw();
  });
});

describe('ffprobe (async/await)', () => {
  it('should return the duration', async () => {
    const metadata = await ffprobe(testFile);
    expect(metadata.format.duration).to.equal('10.000000');
  });
  it('should catch the error', async () => {
    try {
      await ffprobe('');
    } catch (error) {
      expect(error).to.be.an('error');
    }
  });
});

describe('ffprobe(node style callback)', () => {
  it('should return the duration', () => {
    ffprobe(testFile, (err, data) => {
      expect(data.format.duration).to.equal('10.000000');
    });
  });
  it('should cause an error', () => {
    ffprobe('', err => {
      expect(err).to.be.an('error');
    });
  });
});
