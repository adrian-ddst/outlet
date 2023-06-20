import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})
export class AccountGuard {

  constructor(
    public router: Router,
    private appService: AppService,
    private toastr: ToastrService
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const currentlyLoggedAs = JSON.parse(sessionStorage.getItem("currentlyLoggedAs")!);
    const outerContext = this;
    return new Observable<boolean>(observer => {
      if (!currentlyLoggedAs || !currentlyLoggedAs?.token) {
        this.preventAccessVisually();
        observer.next(false);
      }
      this.appService.checkUserTokenSimple(currentlyLoggedAs.token).subscribe({
        next() {
          observer.next(true);
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
