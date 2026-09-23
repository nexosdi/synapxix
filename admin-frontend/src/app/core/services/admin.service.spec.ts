import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { User, PaginatedResponse, UserMetrics } from '../models/admin.models';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users with pagination', () => {
    const mockResponse: PaginatedResponse<User> = {
      data: [{
        id: '1',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        roles: ['teacher'],
        isActive: true,
        createdAt: '2023-01-01'
      }],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1
    };

    service.getUsers(1, 10).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/admin/users?page=1&limit=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch user metrics', () => {
    const mockMetrics: UserMetrics = {
      totalSessions: 5,
      totalTimeSpentMinutes: 120,
      averageScore: 85,
      gamesPlayed: []
    };

    service.getUserMetrics('1').subscribe(metrics => {
      expect(metrics).toEqual(mockMetrics);
    });

    const req = httpMock.expectOne('/api/admin/users/1/metrics');
    expect(req.request.method).toBe('GET');
    req.flush(mockMetrics);
  });
});
