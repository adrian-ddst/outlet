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

  filterList = ["Filter Type 1", "Filter Type 2", "Filter Type 3", "Filter Type 4", "Filter Type 5"];
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

}
