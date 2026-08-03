import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { GameSessionController } from '../game-session.controller';
import { GameSessionService } from '../game-session.service';
import { KeycloakJwtPayload } from '../../auth/jwt.strategy';

describe('GameSessionController', () => {
  let controller: GameSessionController;

  const mockService = {
    startSession: jest.fn(),
    submitAttempt: jest.fn(),
    completeSession: jest.fn(),
    getUserReport: jest.fn(),
  };

  const STUDENT_ID = '00000000-0000-4000-8000-000000000001';
  const OTHER_ID = '00000000-0000-4000-8000-000000000002';

  /** Arma un Request con el payload de Keycloak que inyecta el guard. */
  const requestAs = (sub: string, roles: string[]) =>
    ({ user: { sub, realm_access: { roles } } } as Request & { user: KeycloakJwtPayload });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameSessionController],
      providers: [{ provide: GameSessionService, useValue: mockService }],
    }).compile();

    controller = module.get<GameSessionController>(GameSessionController);
    jest.clearAllMocks();
  });

  // ─── GET /game-session/me/report ──────────────────────────────────────────

  it('should build the own report from the token subject, ignoring any other id', () => {
    controller.getOwnReport(requestAs(STUDENT_ID, ['student']));

    expect(mockService.getUserReport).toHaveBeenCalledWith(STUDENT_ID);
  });

  // ─── GET /game-session/user/:userId/report ────────────────────────────────

  it('should let a student read their own report', () => {
    controller.getUserReport(requestAs(STUDENT_ID, ['student']), STUDENT_ID);

    expect(mockService.getUserReport).toHaveBeenCalledWith(STUDENT_ID);
  });

  it('should let a teacher read another user report', () => {
    controller.getUserReport(requestAs(OTHER_ID, ['teacher']), STUDENT_ID);

    expect(mockService.getUserReport).toHaveBeenCalledWith(STUDENT_ID);
  });

  it('should reject a student reading another user report', () => {
    expect(() =>
      controller.getUserReport(requestAs(OTHER_ID, ['student']), STUDENT_ID),
    ).toThrow(ForbiddenException);

    expect(mockService.getUserReport).not.toHaveBeenCalled();
  });

  it('should reject a token with no roles reading another user report', () => {
    const noRoles = { user: { sub: OTHER_ID } } as Request & { user: KeycloakJwtPayload };

    expect(() => controller.getUserReport(noRoles, STUDENT_ID)).toThrow(ForbiddenException);

    expect(mockService.getUserReport).not.toHaveBeenCalled();
  });
});
