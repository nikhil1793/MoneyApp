import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError,retry,map } from 'rxjs/operators';

/**
 * This interceptor automatically adds bearer token needed by our backend API if such token is present
 * in the current state of the application  and accessible for all the requests
 */
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = '53cc039a6d0f464f8195597d5760a5f3d204f96b7eed6108390f3a193148aa60';
    const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

    return next.handle(authReq)
      .pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          console.log(error);
          errorMessage = `Error : ${error.error.error.detail}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
      })
    )
  }
}