import { toReadSelectGameModel, ReadSelectInteractiveContent } from './read-select-game.model';

describe('read-select-game.model', () => {
  it('debe mapear el contenido interactivo a los datos del juego', () => {
    const mockContent: ReadSelectInteractiveContent = {
      contentType: 'read-select',
      gameInput: {
        prompt: 'Selecciona las reales',
        locale: 'es',
        minCorrectToPass: 2,
        timeLimitSec: 60,
        options: []
      }
    };
    
    const result = toReadSelectGameModel(mockContent);
    expect(result).toBe(mockContent.gameInput);
    expect(result.minCorrectToPass).toBe(2);
  });
});
