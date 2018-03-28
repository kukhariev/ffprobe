
import { spawnSync, spawn } from 'child_process';
export interface FfprobeData {
  stream: any[];
  format: any;
  chapters?: any[];
}
/**
 * Return stream[], format object.
 */
function ffprobeSync(filePath: string): FfprobeData {
  const child = spawnSync(process.env.FFPROBE_PATH || 'ffprobe',
    [
      '-v',
      'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      '-i', filePath
    ]);
  if (child.error) {
    throw new Error(child.error.message);
  }
  const data: FfprobeData = JSON.parse(child.stdout.toString());
  if (data.format) {
    return data;
  } else {
    throw new Error(`ffprobe: error getting information from '${filePath}'`);

  }
}

/**
 * Return stream[], format object.
 */
function ffprobePromise(filePath: string): Promise<FfprobeData> {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let data: FfprobeData;
    const child = spawn(process.env.FFPROBE_PATH || 'ffprobe',
      [
        '-v',
        'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        '-i', filePath
      ])
      .on('error', err => { reject(err); });
    child.stdout.on('data', chunk => {
      stdout += chunk.toString();
    });

    child.stdout.on('end', () => {
      data = JSON.parse(stdout);
      if (data.format) {
        resolve(data);
      } else {
        reject(new Error(`ffprobe: error getting information from '${filePath}'`));
      }
    });
  });
}

function ffprobe(filePath: string): Promise<FfprobeData>;
function ffprobe(filePath: string,
  callback: (err: Error, data: FfprobeData) => void): void;
function ffprobe(filePath: string,
  callback?: (err: Error, data?: FfprobeData) => void) {
  if (callback) {
    ffprobePromise(filePath)
      .then(data => callback(undefined, data))
      .catch(callback);
  } else return ffprobePromise(filePath);
}

export { ffprobe, ffprobeSync };
