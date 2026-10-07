import { validate } from 'class-validator';
import { ProcessGameActivityDto } from './game-input.model';
import { GameType } from '@nexosdi.synapxix/game-engine/core';

describe('ProcessGameActivityDto', () => {
  it('debería pasar la validación sin errores cuando los datos son correctos', async () => {
    const dto = new ProcessGameActivityDto();
    dto.studentId = 'user-123';
    dto.gameType = 'fill-in-the-blanks' as GameType; 
    dto.gameInput = { sentence: 'Hello ___' };
    dto.studentResult = { content: 'world', duration: 15, success: true };

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // 0 errores significa que todo está perfecto
  });

  it('debería fallar si studentId está vacío o no es un string', async () => {
    const dto = new ProcessGameActivityDto();
    // Omitimos studentId intencionalmente
    dto.gameType = 'speak-about-photo' as GameType;
    dto.gameInput = { imageUrl: 'http://test.com/img.png' };
    dto.studentResult = { content: 'audio', duration: 5, success: true };

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    
    // Verificamos que el error saltó específicamente en la propiedad studentId
    const studentIdError = errors.find(err => err.property === 'studentId');
    expect(studentIdError).toBeDefined();
    expect(studentIdError?.constraints).toHaveProperty('isNotEmpty');
    expect(studentIdError?.constraints).toHaveProperty('isString');
  });

  it('debería fallar si gameType no es un string o está vacío', async () => {
    const dto = new ProcessGameActivityDto();
    dto.studentId = 'user-123';
    // Omitimos gameType intencionalmente
    dto.gameInput = {};
    dto.studentResult = { content: 'test', duration: 5, success: true };

    const errors = await validate(dto);
    const gameTypeError = errors.find(err => err.property === 'gameType');
    
    expect(gameTypeError).toBeDefined();
    expect(gameTypeError?.constraints).toHaveProperty('isNotEmpty');
  });

  it('debería fallar si gameInput no es un objeto', async () => {
    const dto = new ProcessGameActivityDto();
    dto.studentId = 'user-123';
    dto.gameType = 'read-aloud' as GameType;
    // Forzamos un tipo incorrecto (string en lugar de objeto) saltándonos TypeScript
    (dto as any).gameInput = 'esto-deberia-ser-un-objeto'; 
    dto.studentResult = { content: 'test', duration: 5, success: true };

    const errors = await validate(dto);
    const inputError = errors.find(err => err.property === 'gameInput');
    
    expect(inputError).toBeDefined();
    expect(inputError?.constraints).toHaveProperty('isObject');
  });

  it('debería fallar si studentResult no es un objeto', async () => {
    const dto = new ProcessGameActivityDto();
    dto.studentId = 'user-123';
    dto.gameType = 'avatar' as GameType;
    dto.gameInput = { legend: 'test' };
    // Forzamos un tipo incorrecto (número en lugar de objeto)
    (dto as any).studentResult = 12345; 

    const errors = await validate(dto);
    const resultError = errors.find(err => err.property === 'studentResult');
    
    expect(resultError).toBeDefined();
    expect(resultError?.constraints).toHaveProperty('isObject');
  });
});