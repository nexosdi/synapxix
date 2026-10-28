import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { User, PaginatedResponse } from '../../core/models/admin.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  
  users$: Observable<PaginatedResponse<User>> | null = null;
  currentPage = 1;
  limit = 10;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 1): void {
    this.currentPage = page;
    this.users$ = this.adminService.getUsers(this.currentPage, this.limit);
  }

  onPageChange(newPage: number): void {
    if (newPage > 0) {
      this.loadUsers(newPage);
    }
  }
}
