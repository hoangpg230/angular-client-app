import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CartService } from 'src/app/core/services/cart.service'

import { Cart } from 'src/app/core/classes/cart'
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cart: any
  user: any
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthenticationService,
    private notificationService: NotificationService
  ) {
    cartService.rootCart.subscribe((res: any) => {
      this.cart = res
    })

  }

  searchText: string = '';

  handleSearch(search: any) {
    this.router.navigate(['/all'], { queryParams: { s: search.value } });
  }

  removeCart(id: number) {
    let oldCart = localStorage.getItem('Cart') ? localStorage.getItem('Cart') : null;
    let newCart = new Cart(oldCart)
    newCart.removeCart(id);

    if (newCart.products.length > 0) {
      localStorage.setItem('Cart', JSON.stringify(newCart));
      this.cart = JSON.parse(localStorage.getItem('Cart') as any)
    } else {
      this.cart = null;
      localStorage.removeItem('Cart')
    }
    this.cartService.onChangeCart(this.cart)
    this.notificationService.alertSuccessMS("Thông báo", "Cập nhập giỏ hàng thành công.")

  }

  logOut() {
    this.authService.Logout()

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);

  }

  ngOnInit(): void {

    this.route.queryParams.subscribe((param: any) => {
      if (param.s) {
        this.searchText = param.s;
      }
    })
    this.cartService.rootCart.subscribe((res: any) => {
      this.cart = res
    })
    this.cart = JSON.parse(localStorage.getItem('Cart') as any)
    this.cartService.onChangeCart(this.cart)

    this.user = this.authService.getLoginUser()
  }
}
