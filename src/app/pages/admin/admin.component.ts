import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { ClothItem } from 'src/app/interfaces/clothItemInterface';
import { User } from 'src/app/interfaces/userInterface';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  salesChart: any;
  productsTableData: ClothItem[] = [];
  user: User | undefined;

  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.createChart();
    this.getProductsForTable();
    this.user = JSON.parse(localStorage.getItem("currentlyLoggedAs")!);
  }

  createChart() {
    this.salesChart = new Chart("SalesChart", {
      type: 'bar',
      data: {
        labels: ['Jackets', 'Shoes', 'Sunglasses', 'Jeans', 'Sports', 'Caps', 'Sweaters', 'Backpacks', 'Dresses', 'Shorts', 'Accessories'],
        datasets: [{
          data: [500, 340, 200, 30, 45, 15, 160, 89, 400, 95, 50],
          backgroundColor: [
            '#740000',
            '#00743e',
            '#574036',
            '#0000ff',
            '#64005f',
            '#00b1c9',
            '#000000',
            '#ad6a6a',
            '#e96b22',
            '#331a77',
            '#c29d22'
          ]
        }]
      },
      options: {
        aspectRatio: 1.25,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  getProductsForTable(): void {
    this.appService.getClothesNoFilter().subscribe(res => {
      if (res) {
        this.productsTableData = res;
      }
    })
  }

  goToCloudinary(url: string) {
    window.open(url, "_blank");
  }

  goToItem(item: ClothItem) {
    this.router.navigateByUrl("/choose-one/" + item.genderName?.toLowerCase() + "/specific/" + item.categoryName?.toLowerCase() + "/" + item.itemName);
  }

  getTimestamp(): string {
    const time = new Date();
    return time.toString();
  }

}
