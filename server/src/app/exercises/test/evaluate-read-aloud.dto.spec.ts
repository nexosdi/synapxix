import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { EvaluateReadAloudDto } from '../dto/evaluate-read-aloud.dto';
import { validReadAloudDto } from './fixtures/audio-file.fixtures';

describe('EvaluateReadAloudDto', () => {
  async function validateDto(payload: Record<string, unknown>) {
    const dto = plainToInstance(EvaluateReadAloudDto, payload);
    return validate(dto);
  }

  it('should pass validation with all required fields', async () => {
    const errors = await validateDto(validReadAloudDto);

    expect(errors).toHaveLength(0);
  });

  it('should pass validation when optional durationSec is provided', async () => {
    const errors = await validateDto({
      ...validReadAloudDto,
      durationSec: '12',
    });

    expect(errors).toHaveLength(0);
  });

  it('should fail when expectedText is missing', async () => {
    const { expectedText: _ignored, ...payload } = validReadAloudDto;
    const errors = await validateDto(payload);

    expect(errors.some((error) => error.property === 'expectedText')).toBe(true);
  });

  it('should fail when expectedText is empty', async () => {
    const errors = await validateDto({
      ...validReadAloudDto,
      expectedText: '',
    });

    expect(errors.some((error) => error.property === 'expectedText')).toBe(true);
  });

  it('should fail when locale is missing', async () => {
    const { locale: _ignored, ...payload } = validReadAloudDto;
    const errors = await validateDto(payload);

    expect(errors.some((error) => error.property === 'locale')).toBe(true);
  });

  it('should fail when contentId is missing', async () => {
    const { contentId: _ignored, ...payload } = validReadAloudDto;
    const errors = await validateDto(payload);

    expect(errors.some((error) => error.property === 'contentId')).toBe(true);
  });
});
