import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { AdminService } from '../../core/services/admin.service';
import { of } from 'rxjs';
import { PaginatedResponse, User } from '../../core/models/admin.models';
import { provideRouter } from '@angular/router';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let mockAdminService: Partial<AdminService>;

  const mockPaginatedResponse: PaginatedResponse<User> = {
    data: [{
      id: '1',
      email: 'test@example.com',
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

  beforeEach(async () => {
    mockAdminService = {
      getUsers: jest.fn().mockReturnValue(of(mockPaginatedResponse))
    };

    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        { provide: AdminService, useValue: mockAdminService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(mockAdminService.getUsers).toHaveBeenCalledWith(1, 10);
    component.users$?.subscribe(res => {
      expect(res).toEqual(mockPaginatedResponse);
    });
  });

  it('should change page', () => {
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(mockAdminService.getUsers).toHaveBeenCalledWith(2, 10);
  });
});
