import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { CartItem } from 'src/app/interfaces/cartStateInterface';
import { User } from 'src/app/interfaces/userInterface';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  view: 'orderDetailsStep' | 'accountStep' | 'paymentStep' | 'confirmationStep' = 'orderDetailsStep';
  deliveryOptions = {
    address: "",
    country: "Romania",
    city: "",
    phone: ""
  }
  user: User | undefined;
  orderItems: CartItem[] = [];

  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getOrderItems();
    this.switchView('orderDetailsStep');
    this.populateDeliveryOptionsIfPossible();
    this.getLoggedUser();
  }

  cartStateOk(): boolean {
    return AppComponent.cartState.orderItems.length > 0;
  }

  getOrderItems(): void {
    this.orderItems = AppComponent.cartState.orderItems;
  }

  submitOrderDetails(): void {
    if (this.deliveryOptionsFormsValid()) {
      this.switchView('accountStep');
      sessionStorage.setItem("deliveryOptions", JSON.stringify(this.deliveryOptions)); // maybe he needs them later
    } else {
      this.toastr.error("Please make sure that all the delivery options are completed accordingly.", '', { positionClass: "toast-top-left" });
    }
  }

  switchView(view: 'orderDetailsStep' | 'accountStep' | 'paymentStep' | 'confirmationStep', delay?: boolean): void {
    if (delay) {
      AppComponent.showSpinner = true;
      interval(3000).subscribe(() => {
        document.getElementById("orderDetailsStep")!.style.color = "#000";
        document.getElementById("accountStep")!.style.color = "#000";
        document.getElementById("paymentStep")!.style.color = "#000";
        document.getElementById("confirmationStep")!.style.color = "#000";
        document.getElementById(view)!.style.color = "#d30000";
        this.view = view;
        AppComponent.showSpinner = false;
      })
    } else {
      document.getElementById("orderDetailsStep")!.style.color = "#000";
      document.getElementById("accountStep")!.style.color = "#000";
      document.getElementById("paymentStep")!.style.color = "#000";
      document.getElementById("confirmationStep")!.style.color = "#000";
      document.getElementById(view)!.style.color = "#d30000";
      this.view = view;
    }
  }

  populateDeliveryOptionsIfPossible(): void {
    if (sessionStorage.getItem("deliveryOptions") !== null) {
      this.deliveryOptions = JSON.parse(sessionStorage.getItem("deliveryOptions")!);
    }
  }

  getLoggedUser(): any {
    this.user = JSON.parse(localStorage.getItem("currentlyLoggedAs")!);
    return this.user;
  }

  evalUser(): boolean {
    if (this.user) {
      return true;
    }
    return false;
  }

  deliveryOptionsFormsValid(): boolean {
    return this.deliveryOptions.address.length > 0 &&
      this.deliveryOptions.country === "Romania" &&
      this.deliveryOptions.city.length > 0 &&
      this.deliveryOptions.phone.toString().length > 0 &&
      this.deliveryOptions.phone.toString().includes('e') === false;
  }

  returnHome(): void {
    this.router.navigateByUrl('/');
  }

}
