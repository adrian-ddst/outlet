import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './services/app.service';
import { interval, take, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'outlet';
  appRouter: Router;
  isLoggedIn: boolean = false;
  showLoginPopup: boolean = false;

  constructor(
    private router: Router,
    private appService: AppService
  ) {
    this.appRouter = this.router;
  }

  goToHome(): void {
    this.appRouter.navigateByUrl('/');
  }

  goToAccountPage(): void {
    if (this.checkLoginState()) {
      this.appRouter.navigateByUrl('/account');
    } else {
      this.showLoginPopup = true;
      // highlight "You are not logged in" text ...
      const ticker = interval(110);
      ticker.pipe(
        tap(index => {
          if (index % 2 === 0) {
            document.getElementById("loginPopupTitle")!.style.color = "#fff";
          } else {
            document.getElementById("loginPopupTitle")!.style.color = "#2b2b2b";
          }
        }),
        take(7)
      ).subscribe();
    }
  }

  checkLoginState(): boolean {
    return this.isLoggedIn;
  }

  debugPost(): void { }

  debugGet(): void { }

}
