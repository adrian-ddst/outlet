import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  total: number = 0;

  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getOrderItems();
    this.calculateTotalPrice();
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

  calculateTotalPrice(): void {
    for (let i = 0; i < AppComponent.cartState.orderItems.length; i++) {
      this.total += (AppComponent.cartState.orderItems[i].product.price! * AppComponent.cartState.orderItems[i].qty);
    }
  }

  submitOrderDetails(): void {
    if (this.deliveryOptionsFormsValid()) {
      this.switchView('accountStep');
      sessionStorage.setItem("deliveryOptions", JSON.stringify(this.deliveryOptions)); // maybe he needs them later
    } else {
      this.toastr.error("Please make sure that all the delivery options are completed accordingly.", '', { positionClass: "toast-top-left" });
    }
  }

  switchView(view: 'orderDetailsStep' | 'accountStep' | 'paymentStep' | 'confirmationStep'): void {
    document.getElementById("orderDetailsStep")!.style.color = "#000";
    document.getElementById("accountStep")!.style.color = "#000";
    document.getElementById("paymentStep")!.style.color = "#000";
    document.getElementById("confirmationStep")!.style.color = "#000";
    document.getElementById(view)!.style.color = "#d30000";
    this.view = view;
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

  saveOrder(): void {
    if (!this.user) {
      this.toastr.error("You are not logged in!", '', { positionClass: "toast-top-left" });
      return;
    }
    const outerContext = this;
    this.appService.saveOrder(AppComponent.cartState, this.user, this.total, this.deliveryOptions).subscribe({
      next() {
        outerContext.switchView('confirmationStep');
        AppComponent.cartState.orderItems = [];
      },
      error() {
        outerContext.toastr.error("An error has occurred with your order. Please try again.", '', { positionClass: "toast-top-left" });
      }
    })
  }

  returnHome(): void {
    this.router.navigateByUrl('/');
  }

}
