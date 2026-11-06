import { toReadSelectGameModel, ReadSelectInteractiveContent } from './read-select-game.model';

describe('read-select-game.model', () => {
  it('should map interactive content to game data correctly', () => {
    const mockContent: ReadSelectInteractiveContent = {
      contentType: 'read-select',
      gameInput: {
        prompt: 'Select the real ones',
        locale: 'en',
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
