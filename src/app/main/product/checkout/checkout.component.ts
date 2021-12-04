import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';

declare const Validator: any
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cart: any
  user: any

  constructor(
    private router: Router,
    private cartService: CartService,
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private dataService: DataService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {

    this.cartService.rootCart.subscribe((res: any) => {
      this.cart = res
    })
    this.cart = JSON.parse(localStorage.getItem('Cart') as any)
    this.cartService.onChangeCart(this.cart)

    this.user = this.authService.getLoginUser()
    this.validate()
  }

  insertSaleReceiptProduct(SaleReceiptId: any, ProductId: any, Quantity: any, Price: any) {
    return new Promise<any>((resolve, reject) => {
      this.dataService.POST('api/SaleReceiptProduct/insert', {
        SaleReceiptId: SaleReceiptId,
        ProductId: ProductId,
        Quantity: Quantity,
        Price: Price
      }).subscribe((res: any) => {
        this.dataService.GET('api/product/getById?id=' + ProductId).subscribe(
          (res: any) => {
            this.dataService.PUT('api/product/update', {
              ...res,
              remainQuantity: res.remainQuantity - Quantity,
              sold: res.sold + Quantity,
            }).subscribe((res: any) => resolve(res))
          }
        )
      })
    })
  }

  validate() {
    Validator({
      form: '#checkout-address',
      formGroupSelector: '.form-group',
      errorSelector: '.form-message',
      rules: [
        Validator.isRequired('#name'),
        Validator.isPhoneNumber('#phoneNumber'),
        Validator.isRequired('#address'),
      ],
      onSubmit: (data: any) => {
        let date = new Date()
        if (this.cart) {
          this.dataService.POST('api/SaleReceipt/insert', {
            Status: "Chờ Xác Nhận",
            Prepayment: true,
            Quantity: this.cart.totalQuantity,
            Total: this.cart.totalPrice,
            Customer: data.name,
            Address: data.address,
            PhoneNumber: data.phoneNumber,
            Note: data.note,
            OrderDate: this.utilityService.convertDateTime(date),
            DeliveryDate: '',
            UserId: this.user.UserId
          }).subscribe((res: any) => {
            let requests: any = [];
            this.cart.products.forEach((val: any) => {
              requests.push(this.insertSaleReceiptProduct(res.saleReceiptId, val.productInfo.productId, val.quantity, val.price))
            })
            let saleReceiptId = res.saleReceiptId
            Promise.all(requests).then((res: any) => {
              this.notificationService.alertSuccessMS("Thông báo", "Bạn đã thanh toán thành công.")
              console.log(saleReceiptId)
              this.utilityService.Navigate('/cart-success/' + saleReceiptId)
            })
          })
        }
        else {
          this.notificationService.alertErrorMS("Thông báo", "Không có sản phẩm nào trong giỏ hàng.")
        }
      }
    })
  }

  checkOut(form: any) {
    form.click()
  }
}
