import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    token: string = '';
    constructor(private router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
        // this.token="eyJraWQiOiJGa0lsWjgxZjQza2dGRnFPa0RtcmZRcU5HZWlrQU9EcVJFYVU5REhkZkZjPSIsImFsZyI6IlJTMjU2In0.eyJjdXN0b206dGVuYW50OkJLX1VTOnJvbGVzIjoiQWRtaW4sQURNSU4iLCJzdWIiOiJiOTMyOWEzMi1iYzIyLTQxYjctOTlhNy03NjYzNGRlMTFhNjQiLCJjdXN0b206dGVuYW50OmJrOnJlZ2lvbnMiOiJtdWx0aSIsImNvZ25pdG86Z3JvdXBzIjpbIkJLIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9ydmdVdlRNTEwiLCJjb2duaXRvOnVzZXJuYW1lIjoiYjkzMjlhMzItYmMyMi00MWI3LTk5YTctNzY2MzRkZTExYTY0Iiwib3JpZ2luX2p0aSI6IjVhNzNhMzk1LWM2ZGItNDk4Yi1hODk0LWQ0MGIzNWYyYzJkZSIsImN1c3RvbTp0ZW5hbnQ6YmtfdXM6cm9sZXMiOiJCdXllciIsImF1ZCI6IjJkMmNzM3M0bjluMXNmbmxybWlvN3M1cjByIiwiZXZlbnRfaWQiOiIwZDY2YTEwMS1kMGIxLTQyNTQtYTliNS0zZDM0ZTFmNWJkMGQiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY2MjExOTI5NCwiY3VzdG9tOnRlbmFudDpCS19NWDpyb2xlcyI6IkFkbWluLEFETUlOIiwibmFtZSI6IkNoYXNlIiwiY3VzdG9tOnRlbmFudDpCS19DQTpyb2xlcyI6IkFkbWluLEFETUlOIiwiZXhwIjoxNjYyMTIyODk0LCJpYXQiOjE2NjIxMTkyOTQsImp0aSI6IjMxMTMyNTNiLTdjNTAtNDU4NS1hNzU4LWY2ODBhMzQ3YjhhMyIsImVtYWlsIjoiY2NyYWZ0b25AcnNpbGluay5jb20ifQ.MkoVLJ3EstzWYRisZ8oRQADtm34eDoVyANQjZtby9gIsNLz_KwMu9cculUA1Nf4Ro-5ng_jZFznU-M96r_voIgkCZoYDMp2KxEvh5lsUYJKJHYa_hwuTrLBCw-tkkaCW_YpyUBAKtCpw5IZtQBP74IJBylWnmAcmDy073MDRrY788byPLflrNA3tumakYXYrwk67SXhUL4D1xb40UW_bwmEfQpS0FWbusB3aigL56KvJ3Lm7QugWZwHCo-lQv4kCpbGak0ecqy6xw_sdiW8bac8OVSo-S4xmkSIyGsnY2T0kO2GBvKE9y74ib_sDlz-__ipOF3Tl2BJvpsO5yohRug";
        // if (this.token) {
        //     request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + this.token) });
        // }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
         return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let data = {};
                console.log(error);
                if (error.status === 401) {

                }
                return throwError(error);
            }));
    }
}