import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'outlet';
  mainRouter: Router;

  constructor(
    private router: Router,
    private appService: AppService
  ) {
    this.mainRouter = this.router;
  }

  goToHome(): void {
    this.mainRouter.navigateByUrl('/');
  }

  goToLogin(): void {
    this.mainRouter.navigateByUrl('/login');
  }

  debugPost(): void {}

  debugGet(): void {}

}
