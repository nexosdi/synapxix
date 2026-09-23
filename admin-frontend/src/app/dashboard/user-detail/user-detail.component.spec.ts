import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { AdminService } from '../../core/services/admin.service';
import { of } from 'rxjs';
import { UserMetrics } from '../../core/models/admin.models';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let mockAdminService: Partial<AdminService>;

  const mockMetrics: UserMetrics = {
    totalSessions: 10,
    totalTimeSpentMinutes: 500,
    averageScore: 90,
    gamesPlayed: [
      { gameId: 'g1', gameName: 'Dala', playCount: 5 }
    ]
  };

  beforeEach(async () => {
    mockAdminService = {
      getUserMetrics: jest.fn().mockReturnValue(of(mockMetrics))
    };

    await TestBed.configureTestingModule({
      imports: [UserDetailComponent],
      providers: [
        { provide: AdminService, useValue: mockAdminService },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '123'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user metrics on init', () => {
    expect(component.userId).toBe('123');
    expect(mockAdminService.getUserMetrics).toHaveBeenCalledWith('123');
    
    component.metrics$?.subscribe(metrics => {
      expect(metrics).toEqual(mockMetrics);
    });
  });

  it('should configure chart data properly', () => {
    expect(component.pieChartData).toBeDefined();
    expect(component.pieChartData?.labels).toContain('Dala');
    expect(component.pieChartData?.datasets[0].data).toContain(5);
  });
});
