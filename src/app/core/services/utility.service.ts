import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(
    private router: Router,
  ) { }

  priceSale(price: any, percent: any) {
    return (price * 100) / (100 - percent);
  }

  Navigate(path: string) {
    this.router.navigate([path]);
  }

  convertDateTime(date: Date) {
    let _formattedDate = new Date(date.toString());
    return _formattedDate.toDateString();
  }
}
