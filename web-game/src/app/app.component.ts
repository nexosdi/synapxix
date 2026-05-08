import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthWidgetComponent } from '../components/auth-widget.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, AuthWidgetComponent],
  standalone: true,
})
export class AppComponent {
}
