import {
  GlobalCognitiveAverageDto,
  IndividualCognitiveAverageDto,
  ClassProgressDto,
  StudentProgressDto,
  GlobalMotorAverageDto,
  GlobalEvaluativeAverageDto,
} from '../../dto';
import { KeycloakJwtPayload } from '../../../auth/jwt.strategy';

export const mockUserId = 'usr-1234-uuid-test';
export const mockTargetUserId = 'usr-5678-uuid-test';
export const mockClassId = 'cls-9999-uuid-test';

export const mockUserJwtPayload: KeycloakJwtPayload = {
  sub: mockUserId,
  email_verified: true,
  preferred_username: 'student_user',
  email: 'student@example.com',
  realm_access: { roles: ['user'] },
  resource_access: {},
};

export const mockTeacherJwtPayload: KeycloakJwtPayload = {
  sub: mockUserId,
  email_verified: true,
  preferred_username: 'teacher_user',
  email: 'teacher@example.com',
  realm_access: { roles: ['teacher'] },
  resource_access: {},
};

export const mockGlobalCognitiveAverageResponse: GlobalCognitiveAverageDto = {
  accuracy: 0.85,
  reaction_time: 1200,
  cognitive_load: 0.75,
  memory_retention: 0.9,
  attention_span: 0.8,
};

export const mockIndividualCognitiveAverageResponse: IndividualCognitiveAverageDto = {
  user_id: mockUserId,
  accuracy: 0.88,
  reaction_time: 1150,
  cognitive_load: 0.7,
  memory_retention: 0.92,
  attention_span: 0.85,
};

export const mockClassProgressResponse: ClassProgressDto = {
  class_id: mockClassId,
  progress: 0.78,
};

export const mockStudentProgressResponse: StudentProgressDto = {
  student_id: mockUserId,
  progress: 0.82,
};

export const mockGlobalMotorAverageResponse: GlobalMotorAverageDto = {
  average_score: 95.5,
  completed_quickly_rate: 0.6,
};

export const mockGlobalEvaluativeAverageResponse: GlobalEvaluativeAverageDto = {
  success_rate: 0.88,
};
