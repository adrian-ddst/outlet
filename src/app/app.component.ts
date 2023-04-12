import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './services/app.service';
import { interval, take, tap } from 'rxjs';
import { User } from './interfaces/userInterface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'outlet';
  appRouter: Router;
  isLoggedIn: boolean = false;

  loginForm: FormGroup | undefined;
  user: User = {
    email: "aaaaaaaaaaaaaaaa",
    password: "bbbbbbbbbbbbbb"
  }

  static showLoginPopup: boolean = false;

  constructor(
    private router: Router,
    private appService: AppService
  ) {
    this.appRouter = this.router;
    this.appRouter.events.subscribe({
      next(res: any) {
        if (res && res?.url !== "/") {
          AppComponent.showLoginPopup = false;
        }
      }
    });
    this.loginForm = new FormGroup({
      userEmail: new FormControl(this.user.email, [
        Validators.required,
        Validators.minLength(3)
      ]),
      userPass: new FormControl(this.user.password, [
        Validators.required,
        Validators.minLength(8)
      ])
    })
  }

  get userEmail() {
    return this.loginForm!.get('userEmail');
  }

  updateUserEmailForm() {
    this.userEmail?.setValue(this.user.email);
  }

  get userPass() {
    return this.loginForm!.get('userPass');
  }

  updateUserPassForm() {
    this.userPass?.setValue(this.user.password);
  }

  get loginPopupDisplayState() {
    return AppComponent.showLoginPopup;
  }

  set loginPopupDisplayState(value) {
    AppComponent.showLoginPopup = value;
  }

  // Auth flow that should always be present in background
  goToAccountPage(): void {
    if (this.checkLoginState()) {
      this.appRouter.navigateByUrl('/account');
    } else {
      AppComponent.showLoginPopup = true;
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

  // Check login state ... TODO: check jwt
  checkLoginState(): boolean {
    return this.isLoggedIn;
  }

  login(): void {
    if (this.loginForm?.status === "INVALID") {
      const ticker = interval(110);
      ticker.pipe(
        tap(index => {
          if (index % 2 === 0) {
            document.getElementById("errorMsg")!.style.display = "block";
          } else {
            document.getElementById("errorMsg")!.style.display = "none";
          }
        }),
        take(7)
      ).subscribe();
    } else {
      this.appService.login(this.user).subscribe({
        next(response) {
          console.log(response);
          document.getElementById("errorMsg")!.style.display = "none";
        },
        error(err) {
          console.log(err);
          document.getElementById("errorMsg")!.style.display = "block";
        },
      })
      
    }
  }

  register(): void {

  }

  goToHome(): void {
    this.appRouter.navigateByUrl('/');
  }

  // Debug methods
  debugPost(): void { }

  debugGet(): void { }

}
