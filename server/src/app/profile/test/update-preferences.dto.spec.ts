import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdatePreferencesDto } from '../dto/updated-preferences';

describe('UpdatePreferencesDto', () => {
  async function validateDto(payload: Record<string, unknown>) {
    const dto = plainToInstance(UpdatePreferencesDto, payload);
    return validate(dto);
  }

  it('should pass validation with an empty payload since all fields are optional', async () => {
    const errors = await validateDto({});

    expect(errors).toHaveLength(0);
  });

  it('should pass validation with valid full payload', async () => {
    const errors = await validateDto({
      theme: 'dark',
      language: 'es',
      notifications: true,
    });

    expect(errors).toHaveLength(0);
  });

  it('should pass validation with valid partial payload', async () => {
    const errors = await validateDto({
      theme: 'light',
    });

    expect(errors).toHaveLength(0);
  });

  it('should fail validation when theme is not a string', async () => {
    const errors = await validateDto({
      theme: 12345,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((error) => error.property === 'theme')).toBe(true);
  });

  it('should fail validation when language is not a string', async () => {
    const errors = await validateDto({
      language: false,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((error) => error.property === 'language')).toBe(true);
  });

  it('should fail validation when notifications is not a boolean', async () => {
    const errors = await validateDto({
      notifications: 'not-a-boolean',
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((error) => error.property === 'notifications')).toBe(true);
  });
});
