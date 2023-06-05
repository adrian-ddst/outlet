import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { ClothItem } from 'src/app/interfaces/clothItemInterface';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {
  category: string | null | undefined;
  specificCategory: string | null | undefined;
  product: ClothItem | undefined;
  quantity: number = 1;

  torsoSizes = ["XL", "L", "M", "S", "XS"];
  // torsoSizes = [];

  // legSizes = ["36/36", "36/34", "34/34", "34/32", "32/32"];
  legSizes = [];

  // shoeSizes = ["44", "43", "42", "41", "40", "39", "38", "37", "36", "35"];
  shoeSizes = [];

  selectedSize: any = null;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((res) => {
        this.category = res['category'];
        this.specificCategory = res['specificCategory'];
        return this.appService.getProductByName(res['productName']);
      })
    ).subscribe((product) => {
      this.product = product;
    });
  }

  minusQty() {
    if (this.quantity === 0) {
      return;
    }
    this.quantity -= 1;
  }

  plusQty() {
    this.quantity += 1;
  }

  calculateProductPrice(): number {
    if (this.quantity === 0) {
      return this.product?.price!;
    }
    return this.product?.price! * this.quantity
  }

  addToCart(): void {
    if (AppComponent.cartState.orderItems.find(orderItem => orderItem.product?._id === this.product?._id)) {
      AppComponent.cartState.orderItems.find(orderItem => orderItem.product?._id === this.product?._id)!.qty += this.quantity;
    } else {
      AppComponent.cartState.orderItems.push({ product: this.product!, qty: this.quantity });
    }
    this.toastr.success("Product has been successfully added to cart!", '', { positionClass: "toast-top-left" });
  }

}
