import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  title = 'outlet';
  appRouter: Router;
  isLoggedIn: boolean = false;

  loginForm: FormGroup | undefined;
  user: User = {
    email: "",
    password: ""
  }
  username: String | undefined;

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

  ngOnInit(): void {
    this.tryAutoLogin();
  }

  goToAccountPage(): void {
    if (this.isLoggedIn) {
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
      var componentScope = this;
      this.appService.login(this.user).subscribe({
        next(response) {
          const user = response;
          document.getElementById("errorMsg")!.style.display = "none";
          localStorage.setItem("currentlyLoggedAs", JSON.stringify(user));
          componentScope.isLoggedIn = true;
          AppComponent.showLoginPopup = false;
          componentScope.goToAccountPage();
        },
        error(err) {
          console.log(err);
          document.getElementById("errorMsg")!.style.display = "block";
        }
      })
    }
  }

  tryAutoLogin(): void {
    const currentlyLoggedAs = JSON.parse(localStorage.getItem("currentlyLoggedAs")!);
    if (currentlyLoggedAs?.token) {
      this.appService.silentAutoLogin(currentlyLoggedAs.token).subscribe(() => {
        this.isLoggedIn = true;
        AppComponent.showLoginPopup = false;
        this.username = currentlyLoggedAs.firstName;
      });
    }
  }

  register(): void {

  }

  goToHome(): void {
    this.appRouter.navigateByUrl('/');
  }


  // Debug methods
  debugGet(): void {
    this.appService.debugGet().subscribe(res => {
      console.log(res);
    });
  }

  debugPost(): void {
    this.appService.debugPost().subscribe(res => {
      console.log(res);
    });
  }

}
