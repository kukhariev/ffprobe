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
  const { error, stdout } = spawnSync(process.env.FFPROBE_PATH || 'ffprobe', [...args, filePath]);
  if (error) {
    throw error;
  }
  const data: FfprobeData = JSON.parse(stdout.toString() || 'null');
  if (!data) {
    throw new Error('No data available');
  }
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
    const ffprobe = spawn(process.env.FFPROBE_PATH || 'ffprobe', [...args, filePath]).once(
      'error',
      reject
    );
    ffprobe.stdout.on('data', chunk => {
      stdout += chunk;
    });
    ffprobe.stdout.once('end', () => {
      const data: FfprobeData = JSON.parse(stdout.toString() || 'null');
      !data && reject(new Error('No data available'));
      data.error ? reject(new Error(data.error.string)) : resolve(data);
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
function ffprobe(filePath: string, callback: (err: Error, data?: FfprobeData) => void): void;

function ffprobe(filePath: string, callback?) {
  if (callback) {
    ffprobePromise(filePath)
      .then(data => callback(null, data))
      .catch(callback);
  } else return ffprobePromise(filePath);
}

export { ffprobe, ffprobeSync };
