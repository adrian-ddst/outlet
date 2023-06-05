import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/userInterface';
import { Chart } from 'chart.js/auto';
import { AppService } from 'src/app/services/app.service';
import { Router } from '@angular/router';

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

  customerOrders: any[] = [];

  isEditMode = false;
  isViewMode = true;
  isEditor = true;

  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    public router: Router
  ) { }

  ngOnInit(): void {
    try {
      this.user = JSON.parse(localStorage.getItem("currentlyLoggedAs")!);
      this.createChart();
      this.checkRole();
      this.getOrders();
    } catch (error) {
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

  checkRole(): void {
    this.appService.checkUserRole(this.user?.token!).subscribe(res => {
      if (res?.role) {
        this.user!.role = res?.role;
      }
    });
  }

  getOrders(): void {
    this.appService.getAllOrders().subscribe(res => {
      if (res) {
        this.customerOrders = res.filter((order: any) =>
          order?.user?.firstName === this.user?.firstName &&
          order?.user?.lastName === this.user?.lastName &&
          order?.user?.email === this.user?.email
        );
      }
    });
  }

  goToAdmin(): void {
    this.router.navigateByUrl('/admin');
  }

  saveData(): void {
    console.log("Save data works!");
  }

}
