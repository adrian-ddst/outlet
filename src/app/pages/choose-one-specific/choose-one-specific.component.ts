import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
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
  chooseOneSpecificRouter: Router;

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
      filterName: "Color",
      opts: ["Black", "Blue", "White", "Red", "Green"]
    },
    {
      filterName: "Material",
      opts: ["Leather", "Polymer", "Cotton"]
    }
  ];
  rawItems: ClothItem[] | undefined = [];
  items: ClothItem[] | undefined = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService
  ) {
    this.chooseOneSpecificRouter = this.router;
  }

  ngOnInit(): void {
    this.appService.getClothesNoFilter().pipe(
      switchMap((res) => {
        if (res) {
          this.rawItems = res;
        }
        return this.route.params;
      })
    ).subscribe(res => {
      this.category = ((res['category'] ? res['category'] : "unknown") as string).toUpperCase();
      this.specificCategory = ((res['specificCategory'] ? res['specificCategory'] : "unknown") as string).toUpperCase();
      this.items = this.rawItems?.filter(item =>
        ((item.genderName === "any") ? true : (item.genderName === this.category?.toLowerCase())) &&
        (item.categoryName === this.specificCategory?.toLowerCase())
      );
    });
  }

  addToCart(): void {
    console.log("add to cart works!");
  }
  
  registerMinPriceChange(event: any): void {
    this.moneyFilterMin = parseInt(event.target.value);
  }

  registerMaxPriceChange(event: any): void {
    this.moneyFilterMax = parseInt(event.target.value);
  }

}
