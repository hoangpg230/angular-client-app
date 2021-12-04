import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css']
})
export class NewItemComponent implements OnInit {

  constructor(private dataService: DataService, private utilityService: UtilityService) { }

  newItem: any = []

  priceSale(price: any, percent: any) {
    return this.utilityService.priceSale(price, percent)
  }

  ngOnInit(): void {

    this.dataService.GET("api/product/getAll").subscribe((data: any) => {
       data.sort((a: any, b: any) => {
        if(a.productId > b.productId){
          return -1
        }
        else return 1
      })
      this.newItem = data.slice(0, 12)
      
    })
  }


}
