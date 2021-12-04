import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail/detail.component';
import { ProductComponent } from './product.component';
import { AppRoutingModule } from './app-routing.module';
import { MainModule } from '../main.module';
import { CategoryComponent } from './category/category.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './success/success.component';



@NgModule({
  declarations: [
    DetailComponent,
    ProductComponent,
    CategoryComponent,
    CartComponent,
    CheckoutComponent,
    SuccessComponent,
    
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MainModule
  ]
})
export class ProductModule { }
