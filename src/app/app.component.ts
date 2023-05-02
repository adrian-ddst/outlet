import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './services/app.service';
import { interval, take, tap } from 'rxjs';
import { User } from './interfaces/userInterface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from './interceptors/SpinnerService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, AfterContentChecked {
  title = 'outlet';
  appRouter: Router;
  isLoggedIn: boolean = false;

  loginForm: FormGroup | undefined;
  registerForm: FormGroup | undefined;

  userForLogin: User = {
    email: "",
    password: ""
  }
  userForRegister: User = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  }

  username: String | undefined;

  static showLoginPopup: boolean = false;
  static showRegisterPopup: boolean = false;
  static showSpinner: boolean = true;

  constructor(
    private router: Router,
    private appService: AppService,
    private spinnerService: SpinnerService,
    private cdref: ChangeDetectorRef
  ) {
    this.appRouter = this.router;
    this.appRouter.events.subscribe({
      next(res: any) {
        if (res && res?.url !== "/") {
          AppComponent.showLoginPopup = false;
          AppComponent.showRegisterPopup = false;
        }
      }
    });
    this.loginForm = new FormGroup({
      userEmail: new FormControl(this.userForLogin.email, [
        Validators.required,
        Validators.minLength(3)
      ]),
      userPass: new FormControl(this.userForLogin.password, [
        Validators.required,
        Validators.minLength(8)
      ])
    });
    this.registerForm = new FormGroup({
      userFirstName: new FormControl(this.userForRegister.firstName, [
        Validators.required
      ]),
      userLastName: new FormControl(this.userForRegister.lastName, [
        Validators.required
      ]),
      userEmail: new FormControl(this.userForRegister.email, [
        Validators.required,
        Validators.minLength(3)
      ]),
      userPass: new FormControl(this.userForRegister.password, [
        Validators.required,
        Validators.minLength(8)
      ])
    });
  }

  ngOnInit(): void {
    this.tryAutoLogin();
    AppComponent.showSpinner = false;
  }

  ngAfterViewInit(): void {
    this.spinnerService.httpProgress().subscribe((status: boolean) => {
      if (status) {
        AppComponent.showSpinner = true;
      } else {
        AppComponent.showSpinner = false;
      }
    });
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
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
            document.getElementById("highlightableTitle")!.style.color = "#fff";
          } else {
            document.getElementById("highlightableTitle")!.style.color = "#2b2b2b";
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
      this.appService.login(this.userForLogin).subscribe({
        next(response) {
          const user = response;
          document.getElementById("errorMsg")!.style.display = "none";
          localStorage.setItem("currentlyLoggedAs", JSON.stringify(user));
          componentScope.isLoggedIn = true;
          AppComponent.showLoginPopup = false;
          componentScope.username = user['firstName'];
          componentScope.goToAccountPage();
        },
        error(err) {
          console.error(err);
          document.getElementById("errorMsg")!.style.display = "block";
        }
      })
    }
  }

  tryAutoLogin(): void {
    const currentlyLoggedAs = JSON.parse(localStorage.getItem("currentlyLoggedAs")!);
    var currentContext = this;
    if (currentlyLoggedAs?.token) {
      this.appService.silentAutoLogin(currentlyLoggedAs.token).subscribe({
        next() {
          currentContext.isLoggedIn = true;
          AppComponent.showLoginPopup = false;
          currentContext.username = currentlyLoggedAs.firstName;
        },
        error(err) {
          // BE returns 401 for bad token
          if (err && err['status'] === 401) {
            currentContext.isLoggedIn = false;
            localStorage.clear();
          }
        },
      })
    }
  }

  signOut(): void {
    localStorage.clear();
    this.isLoggedIn = false;
    this.goToHome();
  }

  register(): void {
    console.log("register ok");
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

  // -----------------------------------------------------------------------------------
  // ----------------------------- Getters, Setters, etc... ----------------------------
  // -----------------------------------------------------------------------------------

  get userForLoginEmail() {
    return this.loginForm!.get('userEmail');
  }

  updateUserForLoginEmailForm() {
    this.userForLoginEmail?.setValue(this.userForLogin.email);
  }

  get userForLoginPass() {
    return this.loginForm!.get('userPass');
  }

  updateUserForLoginPassForm() {
    this.userForLoginPass?.setValue(this.userForLogin.password);
  }

  get userForRegisterFirstName() {
    return this.registerForm!.get('userFirstName');
  }

  updateUserForRegisterFirstNameForm() {
    this.userForRegisterFirstName?.setValue(this.userForRegister.firstName);
  }

  get userForRegisterLastName() {
    return this.registerForm!.get('userLastName');
  }

  updateUserForRegisterLastNameForm() {
    this.userForRegisterLastName?.setValue(this.userForRegister.lastName);
  }

  get userForRegisterEmail() {
    return this.registerForm!.get('userEmail');
  }

  updateUserForRegisterEmailForm() {
    this.userForRegisterEmail?.setValue(this.userForRegister.email);
  }

  get userForRegisterPass() {
    return this.registerForm!.get('userPass');
  }

  updateUserForRegisterPassForm() {
    this.userForRegisterPass?.setValue(this.userForRegister.password);
  }

  get loginPopupDisplayState() {
    return AppComponent.showLoginPopup;
  }

  set loginPopupDisplayState(value) {
    AppComponent.showLoginPopup = value;
  }

  get registerPopupDisplayState() {
    return AppComponent.showRegisterPopup;
  }

  set registerPopupDisplayState(value) {
    AppComponent.showRegisterPopup = value
  }

  get spinnerDisplayState() {
    return AppComponent.showSpinner;
  }

  set spinnerDisplayState(value) {
    AppComponent.showSpinner = value;
  }

}
