import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  constructor(private dataService: DataService, private utilityService: UtilityService) { }

  offers: any = []

  priceSale(price: any, percent: any) {
    return this.utilityService.priceSale(price, percent)
  }

  ngOnInit(): void {
    this.dataService.GET("api/category/getAll").subscribe((categories: any) => {
      categories = categories.filter((c: any) => c.parentId == 0)
      this.dataService.GET("api/product/getAll").subscribe((products: any) => {
        categories.forEach((category: any) => {
          category.child = []
          products.forEach((product: any) => {
            if (category.name == product.subData.split(" ")[0]) {
              category.child.push(product)
            }
          })
        })

        this.offers = categories
      })
    })
  }

}
