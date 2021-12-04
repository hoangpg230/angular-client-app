import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart: any;

  rootCart: Subject<any> = new Subject<any>();

  constructor() {
    this.rootCart.subscribe((value) => {
      this.cart = value
    });
  }

  onChangeCart(cart: any) {
    this.rootCart.next(cart)
  }


}
