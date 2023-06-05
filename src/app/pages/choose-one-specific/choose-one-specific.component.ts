import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { ClothItem } from 'src/app/interfaces/clothItemInterface';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-choose-one-specific',
  templateUrl: './choose-one-specific.component.html',
  styleUrls: ['./choose-one-specific.component.scss']
})
export class ChooseOneSpecificComponent implements OnInit {
  category: string | null | undefined;
  specificCategory: string | null | undefined;

  moneyFilterMin: number | undefined = 825;
  moneyFilterMax: number | undefined = 3100;

  filterList = [
    {
      filterName: "Brand",
      opts: ["Armani Exchange", "Gucci", "Nike", "Tommy Jeans", "Tommy Hillfiger"]
    },
    {
      filterName: "Size",
      opts: ["XL", "L", "M", "S", "XS"]
    },
    {
      filterName: "Material",
      opts: ["Leather", "Polymer", "Cotton"]
    }
  ];

  rawItems: ClothItem[] | undefined = [];
  items: ClothItem[] | undefined = [];

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.appService.getClothesNoFilter().pipe(
      switchMap((res) => {
        if (res) {
          this.rawItems = res;
        }
        return this.route.params;
      })
    ).subscribe(res => {
      this.category = (res['category'] as string).toUpperCase();
      this.specificCategory = (res['specificCategory'] as string).toUpperCase();
      this.items = this.rawItems?.filter(item =>
        ((item.genderName === "any") ? true : (item.genderName === this.category?.toLowerCase())) &&
        (item.categoryName === this.specificCategory?.toLowerCase())
      );
    });
  }

  navigateTo(item: ClothItem): void {
    this.router.navigateByUrl("/choose-one/" + this.category?.toLowerCase() + "/specific/" + this.specificCategory?.toLowerCase() + "/" + item.itemName);
  }

  addToCart(item: ClothItem): void {
    if (AppComponent.cartState.orderItems.find(orderItem => orderItem.product?._id === item?._id)) {
      AppComponent.cartState.orderItems.find(orderItem => orderItem.product?._id === item?._id)!.qty += 1;
    } else {
      AppComponent.cartState.orderItems.push({ product: item!, qty: 1 });
    }
    this.toastr.success("Product has been successfully added to cart!", '', { positionClass: "toast-top-left" });
  }

  registerMinPriceChange(event: any): void {
    this.moneyFilterMin = parseInt(event.target.value);
  }

  registerMaxPriceChange(event: any): void {
    this.moneyFilterMax = parseInt(event.target.value);
  }

}
