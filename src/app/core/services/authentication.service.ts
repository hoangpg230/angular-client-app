import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';

import { SystemConstants } from '../common/system.constants';
import { LoginUser } from '../domain/login.user'


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  getUser(): LoginUser {
    return JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER) as string);
  }

  setUser(value: any) {
    return localStorage.setItem(SystemConstants.CURRENT_USER, JSON.stringify(value))
  }

  Login(username: string, password: string): Observable<LoginUser> {
    let body = {
      Email: username,
      Password: password
    }
    return this.http.post<LoginUser>(`${SystemConstants.BASE_API}/api/user/login`, body, this.httpOptions)
      .pipe(
        catchError(this.handleError),
        tap(res => {
          let user: LoginUser = res
          if (user && user.access_token) {
            this.setUser(user)
          }
          setTimeout(() => {
            this.Logout()
          }, 1000 * 60 * 60 * 12)
          return true
        })
      )

  }

  Logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER)
  }

  isAuthenticated(): boolean {
    if (this.getUser())
      return true
    return false
  }

  getLoginUser(): any {
    let user: LoginUser
    if (this.getUser()) {
      user = new LoginUser(this.getUser().access_token, this.getUser().UserId, this.getUser().Email, this.getUser().Name, this.getUser().Avatar, this.getUser().Address, this.getUser().PhoneNumber)
    }
    else user = null as any
    return user;
  }

  handleError(error: HttpErrorResponse) {
    let strMsg = "";
    if (error.error instanceof ErrorEvent) {
      strMsg = 'An error occurred: ' + error.error.message
      console.log('An error occurred: ' + error.error.message)
    }
    else {
      strMsg = 'Back end return code: ' + error.status + '; body was: ' + JSON.stringify(error.error)
      console.log('Back end return code: ' + error.status + '; body was: ' + JSON.stringify(error.error))
    }
    return throwError(strMsg)
  }
}
