import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  SaleReceiptId: any
  SaleReceipt: any = {}
  user: any
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.SaleReceiptId = this.route.snapshot.paramMap.get('id')
    this.user = this.authService.getLoginUser()
  }


  ngOnInit(): void {
    this.dataService.GET('api/SaleReceipt/getById?id=' + this.SaleReceiptId).subscribe((SaleReceipt: any) => {
      this.SaleReceipt = SaleReceipt
      this.dataService.GET('api/SaleReceiptProduct/getAll').subscribe(
        (res: any) => {
          let SaleReceiptProduct = res
          this.SaleReceipt.detail_sales_invoice = [];
          SaleReceiptProduct.forEach((val: any) => {
            if (val.saleReceiptId == this.SaleReceipt.saleReceiptId) {
              this.SaleReceipt.detail_sales_invoice.push(val)
            }
          })
          this.dataService.GET('api/product/getAll').subscribe(
            (res: any) => {
              let products = res
              this.SaleReceipt.detail_sales_invoice.forEach((val: any) => {
                val.product = []
                products.forEach((product: any) => {
                  if (val.productId == product.productId) {
                    val.product.push(product)
                    
                  }
                })
              })
              
              this.http.post('http://127.0.0.1:8000/api/home', {
                sales_invoice: this.SaleReceipt,
                email: this.user.Email,
              }).subscribe((res: any)=>{
                localStorage.removeItem('Cart')
              })
            }
          )
        }
      )
    })
  }

}
