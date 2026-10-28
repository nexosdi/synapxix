import { Provider } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';

export const createMockPrismaService = () => ({
  app_user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  gameSession: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  cognitiveMetric: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  // Add other models as needed
});

export const MockPrismaServiceProvider: Provider = {
  provide: PrismaService,
  useValue: createMockPrismaService(),
};
