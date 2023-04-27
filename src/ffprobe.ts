import { ChildProcess, spawn, spawnSync } from 'child_process';
import { Readable, Stream } from 'stream';
import { deprecate } from 'util';
import { FfprobeData, FfprobeError, FfprobeCallback } from './interfaces';

const args = [
  '-v',
  'quiet',
  '-print_format',
  'json',
  '-show_format',
  '-show_streams',
  '-show_error',
  '-i'
] as const;

ffprobe.path = 'ffprobe';
/**
 * @internal
 */
const parseStdout = (stdout: string) => {
  try {
    const value = JSON.parse(stdout) as FfprobeData | FfprobeError;
    if ('format' in value) {
      return { value };
    }
    if ('error' in value) {
      return { error: new Error(value.error.string) };
    } else {
      return { error: new Error('No data available') };
    }
  } catch (error) {
    return { error: error as Error };
  }
};

/**
 * @internal
 */
const ffprobePromise = (input: string | Stream): Promise<FfprobeData> => {
  return new Promise((resolve, reject) => {
    const buffer: unknown[] = [];
    let spawned: ChildProcess;
    if (typeof input === 'string') {
      spawned = spawn(process.env.FFPROBE_PATH || ffprobe.path, [...args, input]);
    } else if (isStream(input)) {
      spawned = spawn(process.env.FFPROBE_PATH || ffprobe.path, [...args, 'pipe:0']);
      input.once('error', reject);
      if (!spawned.stdin) return reject(new Error('Error starting ffprobe'));
      input.pipe(spawned.stdin);
    } else {
      return reject(new TypeError('Provided argument is neither a string, nor a stream'));
    }
    if (!spawned.stdout) return reject(new Error('Error starting ffprobe'));
    spawned.once('error', reject);
    spawned.stdout.on('data', (chunk) => buffer.push(chunk));
    spawned.stdout.once('end', () => {
      const data = parseStdout(buffer.join(''));
      data.error ? reject(data.error) : resolve(data.value);
    });
  });
};

/**
 *
 * Run ffprobe on specified input
 * @param input FilePath / URL / Readable Stream
 */
export function ffprobe(input: string | Stream): Promise<FfprobeData>;
export function ffprobe(input: string | Stream, cb: FfprobeCallback): void;
export function ffprobe(input: string | Stream, cb?: FfprobeCallback) {
  if (cb) {
    ffprobePromise(input)
      .then((data) => cb(null, data))
      .catch(cb);
  } else {
    return ffprobePromise(input);
  }
}

function isStream(input: string | Stream): input is Stream {
  return input instanceof Stream && typeof (input as Readable)._read === 'function';
}

/**
 * @deprecated
 */
function ffprobeSyncDeprecated(input: string): FfprobeData {
  const { error, stdout } = spawnSync(process.env.FFPROBE_PATH || ffprobe.path, [...args, input]);
  if (error) {
    throw error;
  }
  const data = parseStdout(stdout.toString());
  if (data.error) {
    throw data.error;
  }
  return data.value;
}
/**
 * Return ffprobe info object for the specified file
 * @deprecated Use async versions
 */
export const ffprobeSync = deprecate(ffprobeSyncDeprecated, 'ffprobeSync() is deprecated.');
