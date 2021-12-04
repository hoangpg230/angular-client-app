import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from 'src/app/core/services/authentication.service'
import { NotificationService } from 'src/app/core/services/notification.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router, 
    private AuthService: AuthenticationService,
    private NotificationService: NotificationService
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.AuthService.isAuthenticated())
    { 
      return true;
    }
    else {
      this.NotificationService.alertWarnMS("Thông báo", "Vui lòng đăng nhập trước khi thanh toán.")
      this.router.navigate(['/home'])
      return false;
    }
  }
  
}
