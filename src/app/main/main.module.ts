import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MainComponent } from './main.component';
import { AppRoutingModule } from './app-routing.module';
import { CategoriesComponent } from './shared/categories/categories.component';
import { ItemComponent } from './shared/item/item.component';
import { ListItemComponent } from './shared/list-item/list-item.component';
import { AuthModalComponent } from './shared/auth-modal/auth-modal.component';




@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MainComponent,
    CategoriesComponent,
    ItemComponent,
    ListItemComponent,
    AuthModalComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [
    CategoriesComponent,
    ItemComponent,
    ListItemComponent
  ]
})
export class MainModule { }
