/**
 * Error information
 *
 * @internal
 */
export interface FfprobeError {
  error: {
    code: number;
    string: string;
  };
}

/**
 * ffprobe info object
 */
export interface FfprobeData {
  streams: Stream[];
  format: Format;
  programs?: FfprobeProgram[];
}

interface Format {
  filename: string;
  nb_streams: number;
  nb_programs: number;
  format_name: string;
  format_long_name: string;
  start_time: string;
  duration: string;
  size: string;
  bit_rate: string;
  probe_score: number;
  tags: Tags;
}

interface Stream {
  index: number;
  codec_name: string;
  codec_long_name: string;
  profile: string;
  codec_type: string;
  codec_time_base: string;
  codec_tag_string: string;
  codec_tag: string;
  width: number;
  height: number;
  coded_width: number;
  coded_height: number;
  has_b_frames: number;
  sample_aspect_ratio: string;
  display_aspect_ratio: string;
  pix_fmt: string;
  level: number;
  chroma_location: string;
  refs: number;
  is_avc: string;
  nal_length_size: string;
  r_frame_rate: string;
  avg_frame_rate: string;
  time_base: string;
  start_pts: number;
  start_time: string;
  duration_ts: number;
  duration: string;
  bit_rate: string;
  bits_per_raw_sample: string;
  nb_frames: string;
  sample_fmt: string;
  sample_rate: string;
  channels: number;
  channel_layout: string;
  bits_per_sample: number;
  disposition: Disposition;
  tags: Tags;
}

export interface FfprobeOpts {
  startTime?: string;
  endTime?: string;
  path?: string;
}

export type FfprobeCallback = (err: Error, data?: FfprobeData) => void;

interface FfprobeProgram {
  program_id: number;
  program_num: number;
  nb_streams: number;
  pmt_pid: number;
  pcr_pid: number;
  start_pts: number;
  start_time: string;
  tags: Tags;
  streams: Stream[];
}

interface Disposition {
  default: number;
  dub: number;
  original: number;
  comment: number;
  lyrics: number;
  karaoke: number;
  forced: number;
  hearing_impaired: number;
  visual_impaired: number;
  clean_effects: number;
  attached_pic: number;
  timed_thumbnails: number;
}

interface Tags {
  [key: string]: string;
}
