import { toMemoryGameModel, MemoryInteractiveContent } from './neural-link-game.model';

describe('neural-link-game.model', () => {
  it('debe mapear el contenido interactivo a los datos del juego', () => {
    const mockContent: MemoryInteractiveContent = {
      contentType: 'neural-link',
      gameInput: {
        prompt: 'Encuentra las parejas',
        locale: 'es',
        cards: []
      }
    };
    
    const result = toMemoryGameModel(mockContent);
    expect(result).toBe(mockContent.gameInput);
    expect(result.prompt).toBe('Encuentra las parejas');
  });
});
