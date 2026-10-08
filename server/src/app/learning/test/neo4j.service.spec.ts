import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from '../neo4j.service';

jest.mock('neo4j-driver', () => {
  const mockSession = {
    run: jest.fn(),
    close: jest.fn(),
  };
  const mockDriver = {
    verifyConnectivity: jest.fn(),
    close: jest.fn(),
    session: jest.fn().mockReturnValue(mockSession),
  };
  return {
    driver: jest.fn().mockReturnValue(mockDriver),
    auth: {
      basic: jest.fn(),
    },
    session: {
      WRITE: 'WRITE',
      READ: 'READ',
    },
  };
});

describe('Neo4jService', () => {
  let service: Neo4jService;
  let driver: Record<string, jest.Mock>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Neo4jService],
    }).compile();

    service = module.get<Neo4jService>(Neo4jService);
    
    // Simular el onModuleInit para que se cree el mock de driver
    await service.onModuleInit();
    // @ts-expect-error accessing private property for testing
    driver = service.driver as unknown as Record<string, jest.Mock>;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should verify connectivity on init', () => {
    expect(driver.verifyConnectivity).toHaveBeenCalled();
  });

  it('should close the driver on destroy', async () => {
    await service.onModuleDestroy();
    expect(driver.close).toHaveBeenCalled();
  });

  it('should return ok for healthcheck if connected', async () => {
    driver.verifyConnectivity.mockResolvedValueOnce(true);
    const health = await service.healthcheck();
    expect(health).toEqual({ status: 'ok' });
  });

  it('should return error for healthcheck if disconnected', async () => {
    driver.verifyConnectivity.mockRejectedValueOnce(new Error('Connection failed'));
    const health = await service.healthcheck();
    expect(health).toEqual({ status: 'error', message: 'Connection failed' });
  });

  it('should execute a write query', async () => {
    const raw = service.raw('CREATE (n:Test) RETURN n');
    const mockSession = driver.session();
    mockSession.run.mockResolvedValueOnce({ records: [] });
    
    await service.write(raw);
    expect(mockSession.run).toHaveBeenCalledWith('CREATE (n:Test) RETURN n', {});
    expect(mockSession.close).toHaveBeenCalled();
  });
});
