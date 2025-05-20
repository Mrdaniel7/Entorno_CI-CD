import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token") || '';
    let clonedReq: HttpRequest<any>;

    // Only prepend apiBaseUrl if the request URL is relative
    if (/^https?:\/\//i.test(req.url)) {
      // Absolute URL, don't modify it
      clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    } else {
      // Relative URL, prepend the API base
      clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        url: environment.apiBaseUrl + req.url
      });
    }

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const errMsg = error?.error?.errMsg || 'Unauthorized';
          this.router.navigate(['/login', { isError: true, errMsg, errDetail: '' }]);
          this.authenticationService.logout();
        }
        return throwError(error);
      })
    );
  }
}
