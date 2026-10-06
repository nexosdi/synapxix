import { toSpotlightGameModel, SpotlightInteractiveContent } from './spotlight-game.model';

describe('toSpotlightGameModel', () => {
  it('should return gameInput from valid content', () => {
    const validContent: SpotlightInteractiveContent = {
      id: 'test-spotlight',
      gameType: 'spotlight',
      gameInput: {
        prompt: 'Busca los objetos',
        backgroundImage: 'bg.jpg',
        targets: [],
        locale: 'es-AR'
      }
    };
    expect(toSpotlightGameModel(validContent)).toBe(validContent.gameInput);
  });

  it('should throw when content is null', () => {
    expect(() => toSpotlightGameModel(null as unknown as SpotlightInteractiveContent)).toThrow('SpotlightInteractiveContent: gameInput is missing');
  });

  it('should throw when gameInput is undefined', () => {
    const invalidContent = { id: 'test', gameType: 'spotlight' } as SpotlightInteractiveContent;
    expect(() => toSpotlightGameModel(invalidContent)).toThrow('SpotlightInteractiveContent: gameInput is missing');
  });

  it('should preserve targets array with coordinates', () => {
    const content: SpotlightInteractiveContent = {
      id: 'test',
      gameType: 'spotlight',
      gameInput: {
        prompt: 'test',
        backgroundImage: 'bg.jpg',
        targets: [
          { id: '1', name: 'Manzana', x: 10, y: 20, found: false }
        ],
        locale: 'es-AR'
      }
    };
    
    const result = toSpotlightGameModel(content);
    expect(result.targets[0].name).toBe('Manzana');
    expect(result.targets[0].x).toBe(10);
    expect(result.targets[0].y).toBe(20);
  });
});
