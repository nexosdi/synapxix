import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationToastComponent } from './shared/components/notification-toast/notification-toast.component';

@Component({
  standalone: true,
  imports: [RouterModule, NotificationToastComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'admin-frontend';
}
