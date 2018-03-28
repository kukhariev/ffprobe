process.env.FFPROBE_PATH = 'ffprobe';
import { expect } from 'chai';
import { ffprobe, ffprobeSync } from '../src/';
const testFile = './test/SampleVideo_640x360_1mb.flv';

describe('ffprobeSync (sync)', () => {
  it('should return the duration', () => {
    const metadata = ffprobeSync(testFile);
    expect(metadata.format.duration).to.equal('6.893000');
  });
  it('should throw', () => {
    expect(() => ffprobeSync('')).to.throw();
  });
});

describe('ffprobe (async/await)', () => {
  it('should return the duration', async () => {
    const metadata = await ffprobe(testFile);
    expect(metadata.format.duration).to.equal('6.893000');
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
      expect(data.format.duration).to.equal('6.893000');
    });
  });
  it('should cause an error', () => {
    ffprobe('', (err) => {
      console.log(err.message);
      expect(err).to.be.an('error');
    });
  });
});
