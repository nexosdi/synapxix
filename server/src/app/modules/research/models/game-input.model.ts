import { GameType } from '@nexosdi.synapxix/game-engine/core';
import{ IsString, IsNotEmpty, IsObject } from 'class-validator';

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