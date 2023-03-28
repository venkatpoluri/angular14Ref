import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, take } from 'rxjs';
import { Tenant } from '../models/tenant';
import { LocalStorageRefService } from './local-storage-ref.service';
import { LocalStorageService } from './local-storage.service';

export class AddHeaderInterceptor implements HttpInterceptor {
    private localStorageService: LocalStorageService = inject(LocalStorageService);
    tenant$ = this.localStorageService.tenantData$;
    private cookieService = inject(CookieService);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let tenant: Tenant;
        this.localStorageService.loadTenant();
        const sub = this.tenant$.pipe(take(1)).subscribe(value => tenant = value);
        sub.unsubscribe();
        const conceptKey =  tenant!==null?tenant.conceptKey:"BK_CA";
        const clonedRequest = req.clone({ headers: req.headers.append('tenant', conceptKey) });

        // Pass the cloned request instead of the original request to the next handle
        return next.handle(clonedRequest);
    }
}