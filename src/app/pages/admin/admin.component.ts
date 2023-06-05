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

  categories = ['Jackets', 'Shoes', 'Sunglasses', 'Jeans', 'Sports', 'Caps', 'Sweaters', 'Backpacks', 'Dresses', 'Shorts', 'Accessories'];
  chartColors = ['#740000', '#00743e', '#574036', '#0000ff', '#64005f', '#00b1c9', '#000000', '#ad6a6a', '#e96b22', '#331a77', '#c29d22'];

  productsTableData: ClothItem[] = [];
  ordersTableData: any[] = [];

  selectedOrder: any;

  user: User | undefined;
  currentSection: 'widgets' | 'ordersMgmt' | 'addNew';

  productToAdd = {
    innerProduct: {
      itemName: "",
      genderName: "none",
      categoryName: "none",
      description: "",
      price: "",
      currency: "$"
    },
    image: ""
  }

  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    public router: Router
  ) {
    this.currentSection = 'widgets';
  }

  ngOnInit(): void {
    this.createChart();
    this.getProductsForTable();
    this.getOrdersForTable();
    this.user = JSON.parse(localStorage.getItem("currentlyLoggedAs")!);
  }

  createChart() {
    setTimeout(() => {
      this.salesChart = new Chart("SalesChart", {
        type: 'bar',
        data: {
          labels: this.categories,
          datasets: [{
            data: [500, 340, 200, 30, 45, 15, 160, 89, 400, 95, 50],
            backgroundColor: this.chartColors
          }]
        },
        options: { aspectRatio: 1.25, plugins: { legend: { display: false } } }
      });
    }, 500);
  }

  getProductsForTable(): void {
    this.appService.getClothesNoFilter().subscribe(res => {
      if (res) {
        this.productsTableData = res;
      }
    })
  }

  getOrdersForTable(): void {
    this.appService.getAllOrders().subscribe(res => {
      if (res) {
        this.ordersTableData = res;
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

  selectFirstOrderAtStart(): void {
    setTimeout(() => {
      const $ordersTableRowFirst = document.getElementById('orders-table-row-1');
      if ($ordersTableRowFirst) {
        $ordersTableRowFirst.style.backgroundColor = "#c0c0c0a9";
        this.selectedOrder = this.ordersTableData[0];
      }
    }, 500);
  }

  selectOrder(index: any, order: any): void {
    // make the rest back white
    Array.from(document.getElementById('orders-table-body')!.children!).forEach(child => {
      (child as any)!.style.backgroundColor = "#fff";
    });
    document.getElementById('orders-table-row-' + index)!.style.backgroundColor = "#c0c0c0a9";
    this.selectedOrder = order;
  }

  uploadProductImage(imageRef: any): void {
    const file: File = imageRef?.files[0];
    if (file) {
      var reader = new FileReader();
      var imageInBase64;
      var outerContext = this;
      reader.readAsDataURL(file as Blob);
      reader.onloadend = function () {
        imageInBase64 = reader.result;
        outerContext.populateImageContainerVisually(imageInBase64);
        (outerContext.productToAdd.image as any) = imageInBase64;
      }
    }
  }

  populateImageContainerVisually(imageUrl: string | ArrayBuffer | null): void {
    try {
      (document.getElementById("productImgOnSide") as any).src = imageUrl;
    } catch (err) { }
  }

  submit(): void {
    if (this.allFormsValid()) {
      this.appService.addNewProduct(this.productToAdd).subscribe(() => {
        this.toastr.success(`Product "${this.productToAdd.innerProduct.itemName}" has been created successfully!`, '', { positionClass: "toast-top-right" });
        this.reset();
      });
    } else {
      this.toastr.error("All the product's fields are mandatory. Please complete and validate them before submitting.", '', { positionClass: "toast-top-right" });
    }
  }

  allFormsValid(): boolean {
    const productImg = (document.getElementById("imageUrl") as any)?.value;
    return this.productToAdd.innerProduct.itemName?.length > 0 &&
      this.productToAdd.innerProduct.description?.length > 0 &&
      this.productToAdd.innerProduct.genderName !== "none" &&
      this.productToAdd.innerProduct.categoryName !== "none" &&
      this.productToAdd.innerProduct.price?.toString().length > 0 &&
      parseFloat(this.productToAdd.innerProduct.price) > 0 &&
      this.productToAdd.innerProduct.price?.toString().includes('e') === false &&
      productImg?.length > 0;
  }

  reset(): void {
    this.populateImageContainerVisually("../../../assets/image-not-found.png");
    (document.getElementById("imageUrl") as any).value = ""
    this.productToAdd.image = "";
    this.productToAdd.innerProduct.itemName = "";
    this.productToAdd.innerProduct.genderName = "none";
    this.productToAdd.innerProduct.categoryName = "none";
    this.productToAdd.innerProduct.description = "";
    this.productToAdd.innerProduct.price = "";
    this.productToAdd.innerProduct.currency = "$";
  }

}
