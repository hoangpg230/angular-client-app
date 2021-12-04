import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ExistSlugGuard implements CanActivate {
  constructor(private router: Router, private dataService: DataService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const slug = state.url.split('/').pop()
    return new Promise((resolve, reject) => {
      this.dataService.GET("api/product/getBySlug?slug=" + slug).subscribe(
        (product: any) => {
          this.dataService.GET("api/category/getBySlug?slug=" + slug).subscribe(
            (category: any)=> {
              resolve({product, category})
            }
          )
          
        }
      )
    })
      .then((res: any) => {
        let {product, category} = res
        if (product || category) return true
        else {
          this.router.navigate(['/home'])
          return false
        }
      })
  }
}
