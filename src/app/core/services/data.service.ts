import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

import { SystemConstants } from './../common/system.constants';
import { AuthenticationService } from './authentication.service';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  

  constructor(private http: HttpClient, private router: Router, private _authenticationService: AuthenticationService) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this._authenticationService.isAuthenticated() ? `Bearer ${this._authenticationService.getLoginUser().access_token}` : ''
    })
  }

  GET(url: string) {
    return this.http.get(`${SystemConstants.BASE_API}/${url}`, this.httpOptions)
      .pipe(
        catchError(this.handleError),
        tap(res => res)
      )
  }

  POST(url: string, data?: any) {
    return this.http.post(`${SystemConstants.BASE_API}/${url}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError),
        tap(res => res)
      )
  }

  PUT(url: string, data?: any) {
    return this.http.put(`${SystemConstants.BASE_API}/${url}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError),
        tap(res => res)
      )
  }

  DELETE(url: string, key: string, id: string) {
    return this.http.delete(`${SystemConstants.BASE_API}/${url}?${key}=${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError),
        tap(res => res)
      )
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
