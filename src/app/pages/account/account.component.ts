import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/userInterface';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  user: User | undefined;
  expensesChart: any;

  currentPass: string | undefined;
  newPass: string | undefined;

  isEditMode = false;
  isViewMode = true;

  constructor(
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    try {
      this.user = JSON.parse(localStorage.getItem("currentlyLoggedAs")!);
      this.createChart();
    } catch (error) {
      console.error(error);
      this.toastr.error("You are not logged in!", '', { positionClass: "toast-top-left" });
    }
  }

  createChart() {
    this.expensesChart = new Chart("MyChart", {
      type: 'doughnut',

      data: {
        labels: ['Jackets', 'Shoes', 'Sunglasses'],
        datasets: [{
          data: [500, 340, 200],
          backgroundColor: [
            '#1275c7',
            '#e96b22',
            '#4903b9'
          ],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 1.25
      }

    });
  }

  saveData(): void {
    console.log("Save data works!");
  }

}
