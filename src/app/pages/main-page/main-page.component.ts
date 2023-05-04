import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  constructor(
    public router: Router
  ) { }

  navigateTo(category: string): void {
    this.router.navigateByUrl("/choose-one/" + category);
  }
}
