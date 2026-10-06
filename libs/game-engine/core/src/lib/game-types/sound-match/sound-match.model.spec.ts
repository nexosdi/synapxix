import { toSoundMatchModel, SoundMatchInteractiveContent } from './sound-match.model';

describe('toSoundMatchModel', () => {
  it('should return gameInput from valid content', () => {
    const validContent: SoundMatchInteractiveContent = {
      id: 'test-id',
      gameType: 'sound-match',
      gameInput: {
        prompt: 'test',
        audioUrl: 'test.mp3',
        options: [],
        locale: 'es-AR'
      }
    };
    expect(toSoundMatchModel(validContent)).toBe(validContent.gameInput);
  });

  it('should throw when content is null', () => {
    expect(() => toSoundMatchModel(null as unknown as SoundMatchInteractiveContent)).toThrow('SoundMatchInteractiveContent: gameInput is missing');
  });

  it('should throw when gameInput is undefined', () => {
    const invalidContent = { id: 'test', gameType: 'sound-match' } as SoundMatchInteractiveContent;
    expect(() => toSoundMatchModel(invalidContent)).toThrow('SoundMatchInteractiveContent: gameInput is missing');
  });

  it('should preserve all SoundOption fields including optional imageUrl', () => {
    const content: SoundMatchInteractiveContent = {
      id: 'test',
      gameType: 'sound-match',
      gameInput: {
        prompt: 'test',
        audioUrl: 'test.mp3',
        options: [
          { id: '1', text: 'Option 1', isCorrect: true, imageUrl: 'img1.jpg' },
          { id: '2', text: 'Option 2', isCorrect: false }
        ],
        locale: 'es-AR'
      }
    };
    
    const result = toSoundMatchModel(content);
    expect(result.options[0].imageUrl).toBe('img1.jpg');
    expect(result.options[1].imageUrl).toBeUndefined();
    expect(result.options[0].id).toBe('1');
    expect(result.options[1].isCorrect).toBe(false);
  });
});
