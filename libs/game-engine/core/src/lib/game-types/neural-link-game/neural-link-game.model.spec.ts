import { toMemoryGameModel, MemoryInteractiveContent } from './neural-link-game.model';

describe('neural-link-game.model', () => {
  it('should map interactive content to game data correctly', () => {
    const mockContent: MemoryInteractiveContent = {
      contentType: 'neural-link',
      gameInput: {
        prompt: 'Find the pairs',
        locale: 'en',
        cards: []
      }
    };
    
    const result = toMemoryGameModel(mockContent);
    expect(result).toBe(mockContent.gameInput);
    expect(result.prompt).toBe('Find the pairs');
  });
});
