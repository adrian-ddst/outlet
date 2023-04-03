import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'outlet';
  mainRouter: Router;

  constructor(router: Router) {
    this.mainRouter = router;
  }

  goToHome(): void {
    this.mainRouter.navigateByUrl('/');
  }

  goToLogin(): void {
    this.mainRouter.navigateByUrl('/login');
  }
}
