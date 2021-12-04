import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';

import { Cart } from 'src/app/core/classes/cart'
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    private router: Router,
    private cartService: CartService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private authService: AuthenticationService
  ) { }

  cart: any
  ngOnInit(): void {
    this.cartService.rootCart.subscribe((res: any) => {
      this.cart = res
    })
    this.cart = JSON.parse(localStorage.getItem('Cart') as any)
    this.cartService.onChangeCart(this.cart)
  }

  removeCart(id: any) {
    console.log(id)
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

  addCart(id: any) {
    let quantity = 1
    this.cart = JSON.parse(localStorage.getItem('Cart') as any)
    this.dataService.GET('api/product/getById?id=' + id).subscribe(
      (res: any) => {
        let product = res
        if (product) {
          let tmp = 0
          let remainQuantity = 0
          if (localStorage.getItem('Cart')) {
            JSON.parse(localStorage.getItem('Cart') as string).products.forEach((val: any, i: any) => {
              if (val.productInfo.productId == id) {
                tmp = val.quantity
                remainQuantity = val.productInfo.remainQuantity
              }
            })
          }
          if (product) {
            if ((product.remainQuantity > 0 && tmp < product.remainQuantity)) {
              let oldCart = localStorage.getItem('Cart') ? localStorage.getItem('Cart') : null;
              let newCart = new Cart(oldCart)
              newCart.addCart(product, id, quantity)
              localStorage.setItem('Cart', JSON.stringify(newCart))
              this.cart = JSON.parse(localStorage.getItem('Cart') as string)
              this.cartService.onChangeCart(this.cart)
              this.notificationService.alertSuccessMS("Thông báo", "Cập nhập giỏ hàng thành công.")

            }
            else {
              alert("Số lượng sản phẩm này trong giỏ hàng đã tối đa")
            }
          }
        }
      }
    )
  }

  deleteCart(id: any) {
    this.cart = JSON.parse(localStorage.getItem('Cart') as any)
    this.dataService.GET('api/product/getById?id=' + id).subscribe((res: any) => {
      let product = res
      if (product) {
        let tmp = 0;
        JSON.parse(localStorage.getItem('Cart') as string).products.forEach((val: any, i: any) => {
          if (val.productInfo.productId == id) {
            tmp = val.quantity
          }
        })
        if (tmp > 1) {
          var oldCart = localStorage.getItem('Cart') ? localStorage.getItem('Cart') : null;
          var newCart = new Cart(oldCart)
          newCart.deleteCart(product, id);
          if (newCart.products.length > 0) {
            localStorage.setItem('Cart', JSON.stringify(newCart))
            this.cart = JSON.parse(localStorage.getItem('Cart') as any)
          } else {
            this.cart = null;
            localStorage.removeItem('Cart')
          }
          this.cartService.onChangeCart(this.cart)
          this.notificationService.alertSuccessMS("Thông báo", "Cập nhập giỏ hàng thành công.")

        } else {
          var bool = confirm("bạn có muốn xóa sản phẩm này không")
          if (bool == true) {
            this.removeCart(id)
          }
        }
      }
    })
  }

  updateCart(input: any, id: number) {
    let min = input.min
    let max = input.max


    if (~~input.value > max) {
      input.value = max
      let oldCart = localStorage.getItem('Cart') ? localStorage.getItem('Cart') : null;
      let newCart = new Cart(oldCart)
      newCart.updateCart(id, input.value);
      localStorage.setItem('Cart', JSON.stringify(newCart));
      this.cart = JSON.parse(localStorage.getItem('Cart') as any)
      this.cartService.onChangeCart(this.cart)
      alert("Xin lỗi bạn chỉ có thể mua tối đa " + input.value + " sản phẩm.")
    } else if (~~input.value < min) {
      input.value = min
      let oldCart = localStorage.getItem('Cart') ? localStorage.getItem('Cart') : null;
      let newCart = new Cart(oldCart)
      newCart.updateCart(id, input.value);
      localStorage.setItem('Cart', JSON.stringify(newCart));
      this.cart = JSON.parse(localStorage.getItem('Cart') as any)
      this.cartService.onChangeCart(this.cart)
      this.notificationService.alertSuccessMS("Thông báo", "Cập nhập giỏ hàng thành công.")
    }
    else {
      let oldCart = localStorage.getItem('Cart') ? localStorage.getItem('Cart') : null;
      let newCart = new Cart(oldCart)
      newCart.updateCart(id, input.value);
      localStorage.setItem('Cart', JSON.stringify(newCart));
      this.cart = JSON.parse(localStorage.getItem('Cart') as any)
      this.cartService.onChangeCart(this.cart)
      this.notificationService.alertSuccessMS("Thông báo", "Cập nhập giỏ hàng thành công.")

    }
  }


  checkOutLink() {
    if(this.authService.isAuthenticated()){
      this.router.navigate(['/checkout']);
    }
    else {
      const btnLogin = document.querySelector('.btn-login a') as any
      btnLogin.click();
    }
  }
}
