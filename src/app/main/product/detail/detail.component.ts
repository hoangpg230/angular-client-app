import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';

import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';

import { Cart } from 'src/app/core/classes/cart'
import { CartService } from 'src/app/core/services/cart.service'
import { NotificationService } from 'src/app/core/services/notification.service'
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  $: any = document.querySelector.bind(document);
  constructor(
    private dataService: DataService,
    private utilityService: UtilityService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }
  cart: any = {}
  paramId: any
  product: any = {}
  brand: string = ''
  newProduct: any = []
  soldProduct: any = []

  priceSale(price: number, percent: number) {
    return this.utilityService.priceSale(price, percent)
  }

  scrollToDesc() {
    this.$('#desc').scrollIntoView({
      behavior: 'smooth'
    });
  }

  getProductBySlug() {
    this.dataService.GET(`api/product/getBySlug?slug=${this.paramId}`).subscribe(
      (res: any) => {
        this.product = res
        this.brand = res.subData
        this.getNewProduct(this.brand.split(' ')[0])
        this.dataService.PUT('api/product/update', {
          ...res,
          views: res.views + 1
        }).subscribe(res=>res)
        
      }
    )
  }

  getNewProduct(brand: any) {
    this.dataService.GET("api/product/getAll").subscribe(
      (res: any) => {
        this.newProduct = res.filter((product: any) => product.subData.split(' ')[0] == brand).slice(0, 12)

      }
    )
  }

  getSoldProduct() {
    this.dataService.GET("api/product/getAll").subscribe(
      (res: any) => {
        this.soldProduct = res.sort((a: any, b: any) => {
          if (a.sold > b.sold)
            return 1
          return -1
        }).slice(0, 12)

      }
    )
  }

  init() {
    this.paramId = this.route.snapshot.paramMap.get('id');
    this.getProductBySlug()
    this.getSoldProduct()
  }

  // cart
  plusQuantity(quantity: any) {
    this.cart = JSON.parse(localStorage.getItem('Cart') as any)
    let addQuantity = () => {
      if (~~quantity.value < ~~this.product.remainQuantity) {

        quantity.value = ~~quantity.value + 1
      }
      else {
        console.log(this.product)
        alert("Số lượng sản phẩm đã tối đa.")
      }
    }

    if (this.cart) {
      var product = this.cart.products.find((val: any) => {
        return val.productInfo.productId == this.product.productId
      })
      if (product) {
        if (~~quantity.value < ~~this.product.remainQuantity - ~~product.quantity) {
          quantity.value = ~~quantity.value + 1
        }
        else {
          alert("Số lượng sản phẩm đã tối đa.")
        }
      }
      else {

        addQuantity()
      }
    }
    else {

      addQuantity()
    }
  }

  minusQuantity(quantity: any) {
    this.cart = JSON.parse(localStorage.getItem('Cart') as any)
    if (quantity.value > 1) {
      quantity.value = ~~quantity.value - 1
    }
    return
  }

  onChangeValue(quantity: any) {
    this.cart = JSON.parse(localStorage.getItem('Cart') as any)
    let addQuantity = () => {
      if (~~quantity.value > ~~this.product.remainQuantity) {
        alert(`Trong kho chỉ còn ${~~this.product.remainQuantity} sản phẩm.`)
        quantity.value = this.product.remainQuantity
      }

    }

    if (typeof ~~quantity.value === 'number') {
      if (~~quantity.value > 0) {
        if (this.cart) {
          var product = this.cart.products.find((val: any) => {
            return val.productInfo.productId == this.product.productId
          })

          if (product) {
            if (~~quantity.value > ~~this.product.remainQuantity - ~~product.quantity) {
              alert(`Bạn chỉ có thể thêm ${~~this.product.remainQuantity} sản phẩm.`)
              quantity.value = ~~this.product.remainQuantity - ~~product.quantity
              if (quantity.value == 0) {
                quantity.value = 1
              }
            }
            else {
              alert("Số lượng sản phẩm đã tối đa.")
            }
          }
          else {
            addQuantity()
          }
        }
        else {
          addQuantity()
        }
      }
      else {
        quantity.value = 1
      }
    }
    else {
      quantity.value = 1
    }
  }

  addCart(id: any, quantity: any) {
    
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
              newCart.addCart(product, id, quantity.value)
              localStorage.setItem('Cart', JSON.stringify(newCart))
              this.cart = JSON.parse(localStorage.getItem('Cart') as string)
              this.cartService.onChangeCart(this.cart)

              this.notificationService.alertSuccessMS("Thông báo", "Cập nhập giỏ hàng thành công.")
              let _product = this.cart.products.find(function (val: any) {
                return val.productInfo.productId == id
              })

              if (_product) {
                if (~~quantity.value > (~~_product.productInfo.remainQuantity - ~~_product.quantity)) {
                  quantity.value = (~~_product.productInfo.remainQuantity - ~~_product.quantity)
                }

                if (quantity.value == 0) {
                  quantity.value = 1
                  alert("Bạn đã mua hết sản phẩm này")
                }
              }
            }
            else {
              alert("Số lượng sản phẩm này trong giỏ hàng đã tối đa")
            }
          }
        }
      }
    )
   
  }

  buyCart(id: any, quantity: any) {
    
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
              newCart.addCart(product, id, quantity.value)
              localStorage.setItem('Cart', JSON.stringify(newCart))
              this.cart = JSON.parse(localStorage.getItem('Cart') as string)
              this.cartService.onChangeCart(this.cart)
              this.notificationService.alertSuccessMS("Thông báo", "Cập nhập giỏ hàng thành công.")

              this.router.navigate(['/cart'])
              
            }
            else {
              alert("Số lượng sản phẩm này trong giỏ hàng đã tối đa")
            }
          }
        }
      }
    )
  }

  ngOnInit(): void {
    this.init()
    this.cart = JSON.parse(localStorage.getItem('Cart') as any)
    this.cartService.onChangeCart(this.cart)
  }

}
