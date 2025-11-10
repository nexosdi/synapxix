// internal service event, if the user does not exist create it, idempotent check
export interface CreateUserDto {
  userId: string;
  name: string;
  embedding?: number[];
}

// user operations
export interface CreateTopicDto {
  userId: string;
  topicId: string;
  topicContent: string;
  topicVec?: number[];
  initialWeight?: number;
}

export interface ReinforceTopicDto {
  userId: string;
  topicId: string;
  delta: number;
}

export interface SetPreferencesDto {
  userId: string;
  prefKeys: string[];
  initWeight?: number;
}

export interface InitMethodDto {
  userId: string;
  methodKey: string;
  initWeight?: number;
}

export interface MethodFeedbackDto {
  userId: string;
  methodKey: string;
  delta: number;
}

export interface RefreshEmbeddingDto {
  userId: string;
}
