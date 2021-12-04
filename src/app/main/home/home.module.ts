import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { AppRoutingModule } from './app-routing.module';
import { MainModule } from '../main.module';
import { FlashSaleComponent } from './flash-sale/flash-sale.component';
import { MiddleBannerComponent } from './middle-banner/middle-banner.component';
import { NewItemComponent } from './new-item/new-item.component';
import { OffersComponent } from './offers/offers.component';



@NgModule({
  declarations: [
    HomeComponent,
    FlashSaleComponent,
    MiddleBannerComponent,
    NewItemComponent,
    OffersComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MainModule
  ]
})
export class HomeModule { }
