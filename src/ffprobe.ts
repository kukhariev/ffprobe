

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
  const meta: FfprobeData = JSON.parse(spawnSync('ffprobe',
    [
      '-v',
      'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      '-i', filePath
    ],
    { encoding: 'utf8' })
    .stdout);
  if (!Object.keys(meta).length) {
    throw new Error(`ffprobe: error getting information from '${filePath}'`);
  } else {
    return meta;
  }
}

/**
 * Return stream[], format object.
 */
function ffprobePromise(filePath: string): Promise<FfprobeData> {
  return new Promise((resolve, reject) => {
    let metastr = '';
    let metadata: FfprobeData;
    const child = spawn('ffprobe', [
      '-v',
      'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      '-i', filePath
    ])
      .on('error', err => { reject(err.message); });
    child.stdout.on('data', buffer => {
      metastr += buffer.toString();
    });

    child.stdout.on('end', () => {
      try {
        metadata = JSON.parse(metastr);
      } catch  {
        reject(`ffprobe: error getting information from '${filePath}'`);
      }
      if (Object.keys(metadata).length > 0) {
        resolve(metadata);
      } else {
        reject(`ffprobe: error getting information from '${filePath}'`);
      }
    });
  });
}

function ffprobe(filePath: string): Promise<FfprobeData>;
function ffprobe(filePath: string,
  callback: (err: any, data: FfprobeData) => void): void;
function ffprobe(filePath: string,
  callback?: (err: any, data?: FfprobeData) => void) {
  if (callback) {
    ffprobePromise(filePath)
      .then(data => callback(undefined, data))
      .catch(callback);
  } else return ffprobePromise(filePath);
}

export { ffprobe, ffprobeSync };
