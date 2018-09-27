import { spawnSync, spawn } from 'child_process';
/**
 * ffprobe info object
 */
export interface FfprobeData {
  stream: any[];
  format: any;
  chapters?: any[];
}

const args = [
  '-v',
  'quiet',
  '-print_format',
  'json',
  '-show_format',
  '-show_streams',
  '-i'
];
/**
 * Return ffprobe info object for the specified file
 */
function ffprobeSync(filePath: string): FfprobeData {
  const child = spawnSync(process.env.FFPROBE_PATH || 'ffprobe', [
    ...args,
    filePath
  ]);
  if (child.error) {
    throw new Error(child.error.message);
  }
  let data: FfprobeData;
  try {
    data = JSON.parse(child.stdout.toString());
  } catch {}
  if (data && data.format) {
    return data;
  } else {
    throw new Error(`ffprobe: error getting information from '${filePath}'`);
  }
}

/**
 * Return promise for ffprobe data object.
 * @internal
 */
function ffprobePromise(filePath: string): Promise<FfprobeData> {
  return new Promise((resolve, reject) => {
    let stdout = '';
    const child = spawn(process.env.FFPROBE_PATH || 'ffprobe', [
      ...args,
      filePath
    ]).on('error', err => {
      reject(err);
    });
    child.stdout.on('data', chunk => {
      stdout += chunk.toString();
    });

    child.stdout.on('end', () => {
      let data: FfprobeData;
      try {
        data = JSON.parse(stdout);
      } catch {}
      if (data && data.format) {
        resolve(data);
      } else {
        reject(
          new Error(`ffprobe: error getting information from '${filePath}'`)
        );
      }
    });
  });
}
/**
 * Returns promise for an object with the ffprobe info for the specified file
 */
function ffprobe(filePath: string): Promise<FfprobeData>;
/**
 * Asynchronous ffprobe
 * @param filePath path/URL to a media file
 */
function ffprobe(
  filePath: string,
  callback: (err: Error, data?: FfprobeData) => void
): void;

function ffprobe(filePath: string, callback?) {
  if (callback) {
    ffprobePromise(filePath)
      .then(data => callback(undefined, data))
      .catch(callback);
  } else return ffprobePromise(filePath);
}

export { ffprobe, ffprobeSync };
