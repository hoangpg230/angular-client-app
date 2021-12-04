import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ExistSlugGuard } from 'src/app/core/guards/exist-slug.guard';
import { CartComponent } from './cart/cart.component';
import { CategoryComponent } from './category/category.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DetailComponent } from './detail/detail.component';
import { ProductComponent } from './product.component';
import { SuccessComponent } from './success/success.component';


const routes: Routes = [
  {
    path: '', component: ProductComponent, children: [
      {
        path: 'all', component: CategoryComponent
      },
      { path: 'cart', component: CartComponent},
      { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard]},

      { path: 'cart-success/:id', component: SuccessComponent, canActivate: [AuthGuard]},
      {
        path: ':id', component: DetailComponent, canActivate: [ExistSlugGuard],
      }, {
        path: 'danh-muc/:slug', component: CategoryComponent, canActivate: [ExistSlugGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
