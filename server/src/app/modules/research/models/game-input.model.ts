import{ IsString, IsNotEmpty, IsObject } from 'class-validator';
export type GameType = 'avatar' | 'read-select' | 'listen-type' |'fill-in-the-blank' |'read-aloud' |'speak-about-photo';

export interface BaseGameInput {
    locale: string;
    timeLimitSec?: number;
}

export interface SpeakAboutPhotoGameInput extends BaseGameInput {
   targetKeywords: string[];
   imageUrl: string;
}

export class ProcessGameActivityDto {
    @IsString()
    @IsNotEmpty()
    studentId!: string;

    @IsString()
    @IsNotEmpty()
    gameType!: GameType;

    @IsObject()
    gameInput!: Record<string,any>;

    @IsObject()
    studentResult!: {
        content: string | string[];
        duration: number;
        success: boolean;

    };
} 