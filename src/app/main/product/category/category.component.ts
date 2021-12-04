import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        this.slug = this.route.snapshot.paramMap.get('slug');
      }
    });
  }

  products: any[] = []
  slug: any = ''
  ngOnInit(): void {
    this.dataService.GET('api/category/getAll').subscribe(
      (res: any) => {
        let categories = res
        let category = categories.find((category: any) => category.slug == this.slug)

        if (category) {
          category.child = [category]
          categories.forEach((_category: any) => {
            if (category.categoryId == _category.parentId) {
              category.child.push(_category)
            }
          })
          this.dataService.GET('api/product/getAll').subscribe(
            (res: any) => {
              let products = res
              category.child.forEach((category: any) => {
                products.forEach((product: any) => {
                  if (category.categoryId == product.categoryId)
                    this.products.push(product)
                })
              })
            }
          )
        }
        else {
          if (this.router.url.includes('/all')) {
            this.route.queryParams.subscribe((params: any) => {
              if (Object.keys(params).length > 0) {
                if(params.s) {
                  this.dataService.GET('api/product/getAll?name=' + params.s).subscribe(
                    (res: any) => {
                      this.products = res
                      
                    }
                  )
                }
              }
              else {
                this.dataService.GET('api/product/getAll').subscribe(
                  (res: any) => {
                    this.products = res
                  }
                )
              }
            })

          }
        }
      }
    )

  }

}
