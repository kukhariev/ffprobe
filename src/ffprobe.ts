import { spawnSync, spawn } from 'child_process';
/**
 * ffprobe info object
 */
export interface FfprobeData {
  streams: any[];
  format: any;
  error?: { code: number; string: string };
}

const args = [
  '-v',
  'quiet',
  '-print_format',
  'json',
  '-show_format',
  '-show_streams',
  '-show_error',
  '-i'
];
/**
 * Return ffprobe info object for the specified file
 */
function ffprobeSync(filePath: string): FfprobeData {
  const ffprobe = spawnSync(process.env.FFPROBE_PATH || 'ffprobe', [
    ...args,
    filePath
  ]);
  if (ffprobe.error) {
    throw new Error(ffprobe.error.message);
  }
  const data: FfprobeData = JSON.parse(ffprobe.stdout.toString());
  if (data.error) {
    throw new Error(data.error.string);
  }
  return data;
}

/**
 * Return promise for ffprobe data object.
 * @internal
 */
function ffprobePromise(filePath: string): Promise<FfprobeData> {
  return new Promise((resolve, reject) => {
    let stdout = '';
    const ffprobe = spawn(process.env.FFPROBE_PATH || 'ffprobe', [
      ...args,
      filePath
    ]).once('error', err => reject(err));
    ffprobe.stdout.on('data', chunk => {
      stdout += chunk.toString();
    });
    ffprobe.stdout.once('end', () => {
      try {
        const data: FfprobeData = JSON.parse(stdout);
        data.error ? reject(new Error(data.error.string)) : resolve(data);
      } catch (err) {
        reject(err);
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
