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
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Obtener token
    const token = localStorage.getItem("token") || '';
    const reqUrl = environment.apiBaseUrl;

    // Sólo anteponer apiBaseUrl si la URL es relativa
    if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
      // URL absoluta → sólo añade el header
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    } else {
      // URL relativa → antepone apiBaseUrl + añade header
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        url: reqUrl + req.url
      });
    }

    return next.handle(req).pipe(
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
