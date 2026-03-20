export type GameType = 'avatar' | 'read-select' | 'listen-type' |'fill-in-the-blank' |'read-aloud' |'speak-about-photo';

export interface BaseaGameInput {
    locale: string;
    timeLimitSec?: number;
}

export interface SpeakAboutPhotoGameInput extends BaseaGameInput {
   targetKeywords: string[];
   imageUrl: string;
}

export class ProcessGameActivityDto {
    studentId: string;
    gameType: GameType;
    gameInput: any;
    studentResult: {
        content: string | string[];
        duration: number;
        succes: boolean;

    };
}