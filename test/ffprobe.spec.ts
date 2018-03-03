import { expect } from 'chai';
import { ffprobe, ffprobeSync } from '../src/';
const testFile = './test/SampleVideo_640x360_1mb.flv';

describe('ffprobe', () => {
  describe('ffprobe (Async)', () => {
    it('Should return sample duration', async () => {
      const metadata = await ffprobe(testFile);
      expect(metadata.format.duration).to.equal('6.893000');
    });
    it('Should catch Error on wrong path', async () => {
      try {
        await ffprobe('');
      } catch (error) {
        expect(error).to.be.an('error');
      }
    });
  });

  describe('ffprobeSync (Sync)', () => {
    it('Should return sample duration', () => {
      const metadata = ffprobeSync(testFile);
      expect(metadata.format.duration).to.equal('6.893000');
    });
    it('Should throw Error on wrong path', () => {
      expect(() => ffprobeSync('')).to.throw();
    });
  });
});