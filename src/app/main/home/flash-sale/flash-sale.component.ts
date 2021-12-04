import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-flash-sale',
  templateUrl: './flash-sale.component.html',
  styleUrls: ['./flash-sale.component.css']
})
export class FlashSaleComponent implements OnInit {

  constructor(private dataService: DataService, private utilityService: UtilityService) {

  }

  flashSale: any = [];

  priceSale(price: any, percent: any) {
    return this.utilityService.priceSale(price, percent)
  }

  ngOnInit(): void {
    this.dataService.GET("api/product/paginate?pageNo=9&pageSize=3").subscribe((data: any) => {
      this.flashSale = data._listProduct;
    })
  }

}
