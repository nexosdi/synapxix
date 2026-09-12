import { Test, TestingModule } from '@nestjs/testing';
import { ArchetypeController } from './archetype.controller';
import { ArchetypeService } from './archetype.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

describe('ArchetypeController', () => {
  let controller: ArchetypeController;
  let service: ArchetypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArchetypeController],
      providers: [
        {
          provide: ArchetypeService,
          useValue: {
            calculateArchetype: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ArchetypeController>(ArchetypeController);
    service = module.get<ArchetypeService>(ArchetypeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getArchetype', () => {
    it('should return calculated archetype', async () => {
      const mockResult = { status: 'calculated', archetype: { name: 'Analítico' } };
      jest.spyOn(service, 'calculateArchetype').mockResolvedValue(mockResult as any);

      const result = await controller.getArchetype('test-user');
      
      expect(service.calculateArchetype).toHaveBeenCalledWith('test-user');
      expect(result).toEqual(mockResult);
    });
  });
});
