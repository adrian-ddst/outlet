import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  items = ["Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket", "Armani Exchange Men's Jacket"];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.chooseOneSpecificRouter = router;
  }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.category = ((res['category'] ? res['category'] : "unknown") as string).toUpperCase();
      this.specificCategory = ((res['specificCategory'] ? res['specificCategory'] : "unknown") as string).toUpperCase();
    });
  }

}
