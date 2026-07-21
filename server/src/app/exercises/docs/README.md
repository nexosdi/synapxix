# 🎤 Exercises Module — Full Documentation

## 🎯 Overview

The **Exercises** module implements an interactive audio exercise evaluation system for Synapxix. It currently supports the **Read Aloud** exercise, where the student records audio while reading a text and the system evaluates it using AI.

### Core Responsibilities

1. Receive audio files uploaded by the student
2. Validate file format and size (webm/ogg/mp4, ≤ 10MB)
3. Validate exercise metadata (expectedText, locale, contentId)
4. Send the audio to an AI provider for analysis
5. Return a structured evaluation (score, feedback, isCorrect)

---

## 🏗️ Architecture

### Module Layers

```
┌─────────────────────────────────────────────────────────┐
│        ExercisesController (HTTP - Multipart)           │
│          POST /exercises/read-aloud                      │
└────────────────┬────────────────────────────────────────┘
                 │ DTO Validation (global class-validator)
                 │ File Validation (ParseFilePipe)
                 ▼
┌─────────────────────────────────────────────────────────┐
│         ExercisesService (Orchestration)                │
│  - Audio → base64 conversion                            │
│  - Send to AiProvider (Gemini)                          │
│  - JSON response parsing (with/without markdown)        │
│  - Safe fallback on parse errors                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│          AiProvider (Research Module)                   │
│  - analyzeAudio(expectedText, mimeType, base64Audio)    │
│  - Google Gemini integration                            │
└─────────────────────────────────────────────────────────┘
```

### Integration Flow

```
Frontend (Web-game)
    ↓
FormData with: audio (file) + expectedText + locale + contentId
    ↓
POST /exercises/read-aloud (multipart/form-data)
    ↓
FileInterceptor('audio') extracts the file
    ↓
ParseFilePipe validates: MIME type + max size
    ↓
Global ValidationPipe validates: DTO fields
    ↓
ExercisesService.evaluateAudio()
    ↓
AiProvider.analyzeAudio()
    ↓
200 OK + EvaluationResult
or
4xx (validation errors)
```

---

## Components

### 1. **ExercisesController**

**File**: `server/src/app/exercises/exercises.controller.ts`

**Responsibilities**:
- Expose REST endpoint: `POST /exercises/read-aloud`
- JWT guard: authenticated users only
- `FileInterceptor('audio')` for multipart handling
- Validation pipe for the audio file
- Delegate to the service

**Endpoint**:
```http
POST /exercises/read-aloud
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

Body (FormData):
  audio: <file>             // Audio file (webm/ogg/mp4)
  expectedText: "The quick brown fox..."  // Reference text
  locale: "en-US"           // Exercise locale
  contentId: "content-123"  // Content ID
  durationSec: "12"         // (Optional) Audio duration
```

---

### 2. **ExercisesService**

**File**: `server/src/app/exercises/exercises.service.ts`

**Responsibilities**:
- Orchestrate the audio evaluation flow
- Convert the file to base64 for AI submission
- Send expected text, MIME type, and base64 audio to `AiProvider`
- Parse the AI JSON response (may be wrapped in markdown ` ```json ``` ` blocks)
- Return a safe fallback if the response is not valid JSON

**Methods**:
- `evaluateAudio(dto: EvaluateReadAloudDto, file: Express.Multer.File): Promise<any>`
  - Converts `file.buffer` → base64
  - Calls `aiProvider.analyzeAudio(expectedText, mimeType, base64)`
  - Cleans the response (removes ` ```json ` and ` ``` `)
  - Parses JSON and returns `{ isCorrect, score, feedback }`
  - On parse failure → fallback: `{ isCorrect: false, score: 0, feedback: 'Could not parse AI response', rawResult }`

---

### 3. **ReadAloudMimeTypeValidator**

**File**: `server/src/app/exercises/validators/read-aloud-audio.validation.ts`

**Responsibilities**:
- Validate that the file MIME type is in the allowed format list
- Replaces NestJS native `FileTypeValidator` (which uses the `file-type` library to read magic bytes)

**Technical Detail**:
```typescript
export class ReadAloudMimeTypeValidator extends FileValidator<Record<string, unknown>> {
  isValid(file?: Express.Multer.File): boolean {
    if (!file?.mimetype) return false;
    return ALLOWED_AUDIO_MIME_REGEX.test(file.mimetype);
  }

  buildErrorMessage(): string {
    return 'Validation failed (expected type is audio)';
  }
}
```

---

### 4. **ParseFilePipe (readAloudAudioFilePipe)**

**File**: `server/src/app/exercises/validators/read-aloud-audio.validation.ts`

**Responsibilities**:
- Composite pipe that runs all file validations in order
- Requires the file to be present (`fileIsRequired: true`)
- Runs `MaxFileSizeValidator` (10MB)
- Runs `ReadAloudMimeTypeValidator` (allowed format)
- Maps errors to HTTP exceptions with clear messages

**Configuration**:
```typescript
export const readAloudAudioFilePipe = new ParseFilePipe({
  fileIsRequired: true,
  validators: [
    new MaxFileSizeValidator({ maxSize: READ_ALOUD_MAX_FILE_SIZE_BYTES }),
    new ReadAloudMimeTypeValidator({}),
  ],
  exceptionFactory: (error: string) => {
    const normalizedError = error.toLowerCase();

    if (normalizedError.includes('size')) {
      return new PayloadTooLargeException('Audio file must not exceed 10MB');
    }

    if (normalizedError.includes('type')) {
      return new UnsupportedMediaTypeException(
        'Unsupported audio format. Allowed formats: webm, ogg, mp4',
      );
    }

    return new BadRequestException(error);
  },
});
```

**Allowed MIME types**:

| MIME type     | Typical source                         |
|---------------|----------------------------------------|
| `audio/webm`  | Browser recordings (Chrome)            |
| `video/webm`  | MediaRecorder with video codec         |
| `audio/ogg`   | Firefox / Ogg recordings               |
| `audio/mp4`   | Safari / MP4 containers with audio     |
| `video/mp4`   | MP4 containers detected as video       |

> **Note**: The client-declared MIME type is validated, not the file magic bytes. This avoids false rejections of browser recordings that NestJS native `FileTypeValidator` often marks as invalid.

---

### 5. **EvaluateReadAloudDto**

**File**: `server/src/app/exercises/dto/evaluate-read-aloud.dto.ts`

**Responsibilities**:
- Define and validate multipart form fields (non-file part)
- Validation via `class-validator` with the controller's global `ValidationPipe`

**Fields**:

| Field          | Type     | Required | Description                              |
|----------------|----------|----------|------------------------------------------|
| `expectedText` | `string` | Yes      | Reference text the student was to read   |
| `locale`       | `string` | Yes      | Exercise locale (e.g. `en-US`)           |
| `contentId`    | `string` | Yes      | Content ID in the catalog                |
| `durationSec`  | `string` | No       | Audio duration in seconds                |

```typescript
export class EvaluateReadAloudDto {
  @IsString() @IsNotEmpty() expectedText!: string;
  @IsString() @IsNotEmpty() locale!: string;
  @IsString() @IsNotEmpty() contentId!: string;
  @IsOptional() @IsString() durationSec?: string;
}
```

---

### 6. **ExercisesModule**

**File**: `server/src/app/exercises/exercises.module.ts`

**Responsibilities**:
- Register controller and service
- Import `ResearchModule` to inject `AiProvider`

```typescript
@Module({
  imports: [ResearchModule],
  controllers: [ExercisesController],
  providers: [ExercisesService],
})
export class ExercisesModule {}
```

---

## API Reference

### `POST /exercises/read-aloud`

Requires JWT. The endpoint does not accept `userId` in the body; identity comes from the token.

**Request** (`multipart/form-data`):

| Field          | Type   | Required |
|----------------|--------|----------|
| `audio`        | file   | Yes      |
| `expectedText` | string | Yes      |
| `locale`       | string | Yes      |
| `contentId`    | string | Yes      |
| `durationSec`  | string | No       |

**Response 200** (successful evaluation):

```json
{
  "isCorrect": true,
  "score": 88,
  "feedback": "Great pronunciation and pacing."
}
```

**Response 200** (fallback when AI does not return valid JSON):

```json
{
  "isCorrect": false,
  "score": 0,
  "feedback": "Could not parse AI response",
  "rawResult": "..."
}
```

**Validation errors**:

| Code | Cause                                                       |
|------|-------------------------------------------------------------|
| 400  | Missing file or invalid DTO fields                          |
| 401  | Missing or invalid JWT                                      |
| 413  | Audio file exceeds 10 MB                                    |
| 415  | Unsupported audio format                                    |
| 500  | AI provider error (empty response or retries exhausted)     |

---

## Evaluation Flow (detail)

```
1. Client sends FormData with audio + metadata
2. JwtAuthGuard verifies authentication                    → 401 on failure
3. FileInterceptor extracts the 'audio' field
4. readAloudAudioFilePipe validates presence, size, MIME   → 400/413/415
5. ValidationPipe validates EvaluateReadAloudDto           → 400 on failure
6. ExercisesService converts buffer → base64
7. AiProvider.analyzeAudio(expectedText, mimeType, base64)
   - Loads prompt from AiPromptService (gameType: 'read-aloud')
   - Sends inline audio to Google Gemini with retries
8. ExercisesService parses JSON (strips markdown fences if present)
9. Returns { isCorrect, score, feedback } to the client
```

---

## Tests

```bash
# All module tests
npx jest server/src/app/exercises/test --runInBand

# By file
npx jest server/src/app/exercises/test/exercises.controller.spec.ts --runInBand
npx jest server/src/app/exercises/test/exercises.service.spec.ts --runInBand
npx jest server/src/app/exercises/test/read-aloud-audio.validation.spec.ts --runInBand
npx jest server/src/app/exercises/test/evaluate-read-aloud.dto.spec.ts --runInBand
```

**`exercises.controller.spec.ts`** — service delegation, unchanged response passthrough, error propagation.

**`exercises.service.spec.ts`** — base64/MIME submission to `AiProvider`, clean JSON parsing, markdown fence parsing, fallback on invalid response.

**`read-aloud-audio.validation.spec.ts`** — accepts webm/ogg/mp4 (incl. `video/webm`), rejects missing file (400), size > 10 MB (413), unsupported formats (415).

**`evaluate-read-aloud.dto.spec.ts`** — required fields, optional `durationSec`, rejection of empty strings.

**Fixtures**: `test/fixtures/audio-file.fixtures.ts` — buffers with real magic bytes (webm, ogg, mp4, png) and `createMockAudioFile` / `createOversizedAudioFile` helpers.

---

## Frontend Integration Example

```typescript
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');
formData.append('expectedText', 'The quick brown fox jumps over the lazy dog.');
formData.append('locale', 'en-US');
formData.append('contentId', 'content-123');
formData.append('durationSec', '12');

const response = await fetch('/exercises/read-aloud', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});

const evaluation = await response.json();
// { isCorrect, score, feedback }
```

---

## File Structure

```
server/src/app/exercises/
├── docs/
│   └── README.md
├── dto/
│   └── evaluate-read-aloud.dto.ts
├── test/
│   ├── fixtures/
│   │   └── audio-file.fixtures.ts
│   ├── evaluate-read-aloud.dto.spec.ts
│   ├── exercises.controller.spec.ts
│   ├── exercises.service.spec.ts
│   └── read-aloud-audio.validation.spec.ts
├── validators/
│   └── read-aloud-audio.validation.ts
├── exercises.controller.ts
├── exercises.module.ts
└── exercises.service.ts
```
