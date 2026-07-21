import {
  BadRequestException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import {
  readAloudAudioFilePipe,
  READ_ALOUD_MAX_FILE_SIZE_BYTES,
} from '../validators/read-aloud-audio.validation';
import {
  createMockAudioFile,
  createOversizedAudioFile,
  MP4_BUFFER,
  OGG_BUFFER,
  PNG_BUFFER,
  WEBM_BUFFER,
} from './fixtures/audio-file.fixtures';

describe('readAloudAudioFilePipe', () => {
  it('should accept a valid webm upload', async () => {
    const file = createMockAudioFile({
      buffer: WEBM_BUFFER,
      mimetype: 'audio/webm',
      originalname: 'recording.webm',
    });

    await expect(readAloudAudioFilePipe.transform(file)).resolves.toBe(file);
  });

  it('should accept browser recordings detected as video/webm', async () => {
    const file = createMockAudioFile({
      buffer: WEBM_BUFFER,
      mimetype: 'video/webm',
      originalname: 'recording.webm',
    });

    await expect(readAloudAudioFilePipe.transform(file)).resolves.toBe(file);
  });

  it('should accept a valid ogg upload', async () => {
    const file = createMockAudioFile({
      buffer: OGG_BUFFER,
      mimetype: 'audio/ogg',
      originalname: 'recording.ogg',
    });

    await expect(readAloudAudioFilePipe.transform(file)).resolves.toBe(file);
  });

  it('should accept a valid mp4 upload', async () => {
    const file = createMockAudioFile({
      buffer: MP4_BUFFER,
      mimetype: 'video/mp4',
      originalname: 'recording.mp4',
    });

    await expect(readAloudAudioFilePipe.transform(file)).resolves.toBe(file);
  });

  it('should reject missing files with 400 Bad Request', async () => {
    await expect(readAloudAudioFilePipe.transform(undefined)).rejects.toMatchObject({
      response: {
        statusCode: 400,
      },
    });

    await expect(readAloudAudioFilePipe.transform(undefined)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should reject files larger than 10MB with 413 Payload Too Large', async () => {
    const file = createOversizedAudioFile();

    await expect(readAloudAudioFilePipe.transform(file)).rejects.toBeInstanceOf(
      PayloadTooLargeException,
    );

    await expect(readAloudAudioFilePipe.transform(file)).rejects.toMatchObject({
      response: {
        statusCode: 413,
        message: 'Audio file must not exceed 10MB',
      },
    });
  });

  it('should reject unsupported formats with 415 Unsupported Media Type', async () => {
    const file = createMockAudioFile({
      buffer: PNG_BUFFER,
      mimetype: 'image/png',
      originalname: 'recording.png',
    });

    await expect(readAloudAudioFilePipe.transform(file)).rejects.toBeInstanceOf(
      UnsupportedMediaTypeException,
    );

    await expect(readAloudAudioFilePipe.transform(file)).rejects.toMatchObject({
      response: {
        statusCode: 415,
        message: 'Unsupported audio format. Allowed formats: webm, ogg, mp4',
      },
    });
  });

  it('should enforce the 10MB size limit constant', () => {
    expect(READ_ALOUD_MAX_FILE_SIZE_BYTES).toBe(10 * 1024 * 1024);
  });
});
