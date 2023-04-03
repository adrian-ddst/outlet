import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'outlet';

  constructor() {}

  goToLogin(): void {
    console.log("go to login ...");
  }
}
