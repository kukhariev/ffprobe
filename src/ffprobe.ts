import { execFile, spawnSync } from 'node:child_process';
import { type Readable, Stream } from 'node:stream';
import { deprecate } from 'node:util';
import type { FfprobeCallback, FfprobeData, FfprobeError } from './interfaces.js';

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
      return {
        error: Object.assign(new Error(value.error.string), {
          name: 'FfprobeError',
          code: value.error.code
        })
      };
    }
  } catch {}
  return {
    error: Object.assign(new Error('Erroneous response from ffprobe'), { stdout })
  };
};

/**
 * @internal
 */
const ffprobePromise = (input: string | Stream): Promise<FfprobeData> => {
  return new Promise((resolve, reject) => {
    const inputIsStream = isStream(input);
    const source = inputIsStream ? 'pipe:0' : input;
    const { stdin } = execFile(
      process.env.FFPROBE_PATH || ffprobe.path,
      [...args, source],
      (ex, stdout, stderr) => {
        if (!stdout) return reject(ex || new Error('No output from ffprobe'));
        const { error, value } = parseStdout(stdout);
        return error ? reject(error) : resolve(value);
      }
    );
    if (inputIsStream) {
      if (!stdin) return reject(new Error('Error opening stdin'));
      input.pipe(stdin);
    }
  });
};

/**
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
