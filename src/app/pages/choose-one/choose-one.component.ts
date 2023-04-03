import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-choose-one',
  templateUrl: './choose-one.component.html',
  styleUrls: ['./choose-one.component.scss']
})
export class ChooseOneComponent implements OnInit {
  category: string | null | undefined;
  isMan = true;
  isWoman = false
  chooseOneRouter: Router;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.chooseOneRouter = router;
  }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.category = res['category'];
      if (this.category === 'men') {
        this.isMan = true;
        this.isWoman = false;
      } else if (this.category === 'women') {
        this.isMan = false;
        this.isWoman = true;
      }
    });
  }

  navigateTo(specificCategory: string): void {
    this.chooseOneRouter.navigateByUrl("/choose-one/" + this.category + "/specific/" + specificCategory);
  }
}
