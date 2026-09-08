import 'multer';
import {
  BadRequestException,
  FileValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

export const READ_ALOUD_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const ALLOWED_AUDIO_MIME_REGEX =
  /^(audio\/(webm|ogg|mp4)|video\/(webm|mp4))$/;


export class ReadAloudMimeTypeValidator extends FileValidator<Record<string, unknown>> {
  isValid(file?: Express.Multer.File): boolean {
    if (!file?.mimetype) {
      return false;
    }
    return ALLOWED_AUDIO_MIME_REGEX.test(file.mimetype);
  }

  buildErrorMessage(): string {
    return 'Validation failed (expected type is audio)';
  }
}

export const readAloudAudioFilePipe = new ParseFilePipe({
  fileIsRequired: true,
  validators: [
    new MaxFileSizeValidator({ maxSize: READ_ALOUD_MAX_FILE_SIZE_BYTES }),
    new ReadAloudMimeTypeValidator({}),
  ],
  exceptionFactory: (error: string) => {
    const normalizedError = error.toLowerCase();

    if (normalizedError.includes('size')) {
      return new PayloadTooLargeException(
        'Audio file must not exceed 10MB',
      );
    }

    if (normalizedError.includes('type')) {
      return new UnsupportedMediaTypeException(
        'Unsupported audio format. Allowed formats: webm, ogg, mp4',
      );
    }

    return new BadRequestException(error);
  },
});
