

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
function ffprobe(filePath: string): Promise<FfprobeData> {
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
    ]);
    // child.on('exit', (code, signal) => { reject(signal); });
    child.stdout.on('data', buffer => {
      metastr += buffer.toString();
    });
    child.stdout.on('end', () => {
      try {
        metadata = JSON.parse(metastr);
      } catch  {
        reject(new Error(`ffprobe: error getting information from '${filePath}'`));
      }
      if (Object.keys(metadata).length > 0) {
        resolve(metadata);
      } else {
        reject(new Error(`ffprobe: error getting information from '${filePath}'`));
      }
    });
  });
}
export { ffprobe, ffprobeSync };
