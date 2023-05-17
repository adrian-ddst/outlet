import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {

  constructor(
    public router: Router,
    private appService: AppService,
    private toastr: ToastrService
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const currentlyLoggedAs = JSON.parse(localStorage.getItem("currentlyLoggedAs")!);
    const outerContext = this;
    return new Observable<boolean>(observer => {
      if (!currentlyLoggedAs || !currentlyLoggedAs?.token) {
        this.preventAccessVisually();
        observer.next(false);
      }
      this.appService.checkUserRole(currentlyLoggedAs.token).subscribe({
        next(res) {
          if (res && (res?.role === "ROLE_MASTER_ADMIN" || res?.role === "ROLE_EDITOR")) {
            observer.next(true);
          } else {
            outerContext.preventAccessVisually();
            observer.next(false);
          }
        },
        error() {
          outerContext.preventAccessVisually();
          observer.next(false);
        }
      });
    });
  }

  // if anything fails ...
  preventAccessVisually(): void {
    this.router.navigateByUrl("/"); // return to main page
    this.toastr.error("You are not authorized to access this page!", '', { positionClass: "toast-top-left" });
  }

}
