import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { LoadingSpinnerService } from '../services/loading-spinner.service';
import { Router, RouterLink } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {



  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
   private loadingSpinner: LoadingSpinnerService,
   private router : Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingSpinner.show()
    return this.handleAccess(request, next);
  }

  private handleAccess(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Only add an access token to allowed origins
    const allowedOrigins = ['http://localhost', 'https://c2.mtattab.com', 'http://127.0.0.1','https://c2-server.mtattab.com',
    "https://file7exfilterate.azurewebsites.net","https://c2-server-tvan66p23a-uc.a.run.app",
    "https://email-spammer-tvan66p23a-uc.a.run.app","https://command-and-control-de293e318d06.herokuapp.com"];
    if (allowedOrigins.some(url => request.urlWithParams.includes(url))) {
      const accessToken = this.oktaAuth.getAccessToken();
      // console.log(accessToken);
      
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken
        }
      });
    }
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        // Handle successful responses here
        if (event instanceof HttpResponse) {
          this.loadingSpinner.hide()

           
          
        }
      }),
      catchError((error) => {
        this.loadingSpinner.hide()

        // Handle errors here
        if (error instanceof HttpErrorResponse && (error.status == 500 || error.status == 401)) {
          console.error('HTTP error:', error);
          this.router.navigate(['/error'], {queryParams: {error: error.message}} )

        }
        return throwError(error); // Re-throw the error to propagate it
      }),
      
    )
  }
}
