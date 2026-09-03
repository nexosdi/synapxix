import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MockPrismaServiceProvider } from './mock-prisma.service';

/**
 * Creates a NestJS TestingModuleBuilder pre-configured with common mocks.
 * Includes ConfigModule and MockPrismaServiceProvider by default.
 */
export const createTestingModule = (metadata: ModuleMetadata): TestingModuleBuilder => {
  const imports = metadata.imports || [];
  const providers = metadata.providers || [];

  return Test.createTestingModule({
    ...metadata,
    imports: [ConfigModule.forRoot({ isGlobal: true }), ...imports],
    providers: [MockPrismaServiceProvider, ...providers],
  });
};
