import { InteractiveContentBase } from '../../models/history.model';

/** * Definimos el literal exacto que se usará en el Mock (gameType)
 */
export type SoundMatchGameType = 'sound-match';

/** * Interfaz para cada opción de respuesta.
 * imageUrl es opcional (?) para permitir emojis como fallback.
 */
export interface SoundOption {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect: boolean;
}

/** * Interfaz que define la estructura exacta dentro de 'gameInput'
 */
export interface SoundMatchData {
  prompt: string;
  audioUrl: string;
  options: SoundOption[];
  locale: string;
}

/** * Esta es la interfaz que el componente recibirá como Input.
 * Hereda de la base genérica de tu proyecto Nx.
 */
export type SoundMatchInteractiveContent = InteractiveContentBase<
  SoundMatchGameType,
  SoundMatchData
>;

/** * Función transformadora para extraer los datos del Input.
 * Agregamos una validación simple por si el contenido viene mal formado.
 */
export function toSoundMatchModel(content: SoundMatchInteractiveContent): SoundMatchData {
  if (!content || !content.gameInput) {
    throw new Error('SoundMatchInteractiveContent: gameInput is missing');
  }
  return content.gameInput;
}