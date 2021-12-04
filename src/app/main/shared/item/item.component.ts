import { Component, OnInit, Input } from '@angular/core';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  constructor(private utilityService: UtilityService) { }
  @Input() productInfo: any

  priceSale(price: number, percent: number) {
    return this.utilityService.priceSale(price, percent)
  }
  ngOnInit(): void {
    
  }

}
