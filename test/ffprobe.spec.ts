import { expect } from 'chai';
import { ffprobe, ffprobeSync } from '../src/';

const testFile = './test/SampleVideo_640x360_1mb.flv';

describe('ffprobeSync (sync)', () => {
  it('should return sample duration', () => {
    const metadata = ffprobeSync(testFile);
    expect(metadata.format.duration).to.equal('6.893000');
  });
  it('should throw Error', () => {
    expect(() => ffprobeSync('')).to.throw();
  });
});

describe('ffprobe (async/await)', () => {
  it('should return sample duration', async () => {
    const metadata = await ffprobe(testFile);
    expect(metadata.format.duration).to.equal('6.893000');
  });
  it('should catch error', async () => {
    try {
      await ffprobe('');
    } catch (error) {
      expect(error).to.be.an('string');
    }
  });
});

describe('ffprobe(nodeCallback)', () => {
  it('should return sample duration', () => {
    ffprobe(testFile, (err, data) => {
      expect(data.format.duration).to.equal('6.893000');
    });
  });
  it('should error', () => {
    ffprobe('', (err) => {
      expect(err).to.be.an('string');
    });
  });
});
