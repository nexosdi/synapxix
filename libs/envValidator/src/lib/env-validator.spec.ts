import { envValidator } from './env-validator';

describe('envValidator', () => {
  it('should work', () => {
    expect(envValidator()).toEqual('envValidator');
  });
});
