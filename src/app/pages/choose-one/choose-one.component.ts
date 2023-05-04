import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-choose-one',
  templateUrl: './choose-one.component.html',
  styleUrls: ['./choose-one.component.scss']
})
export class ChooseOneComponent implements OnInit {
  category: string | null | undefined;
  clothCategories: string[] | [] | undefined;
  isMan = true;
  isWoman = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.appService.getCategories().pipe(
      switchMap((res) => {
        if (res['categories']) {
          this.clothCategories = JSON.parse(res['categories']);
        }
        return this.route.params;
      })
    ).subscribe({
      next: (res: any) => {
        this.category = res['category'];
        if (this.category === 'men') {
          this.isMan = true;
          this.isWoman = false;
        } else if (this.category === 'women') {
          this.isMan = false;
          this.isWoman = true;
        }
      }
    });
  }

  navigateTo(specificCategory: string): void {
    this.router.navigateByUrl("/choose-one/" + this.category?.toLowerCase() + "/specific/" + specificCategory.toLowerCase());
  }
}
