import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-choose-one-specific',
  templateUrl: './choose-one-specific.component.html',
  styleUrls: ['./choose-one-specific.component.scss']
})
export class ChooseOneSpecificComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log("im up!")
  }
}
