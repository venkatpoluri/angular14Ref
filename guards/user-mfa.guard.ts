import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class UserMfaGuardService implements CanActivate {

    constructor(public auth: AuthService, public router: Router) { }

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const mfaPref = await this.auth.checkUserMfa().pipe(first()).toPromise();
        if (mfaPref !== null) {
            const isMfaEnabled = mfaPref.mfaPreference.length > 0 && mfaPref.mfaPreference === 'SOFTWARE_TOKEN_MFA';
            if (!isMfaEnabled) {
                return this.router.parseUrl('/auth/enable-mfa');
            }
        }else {
             this.auth.logout();
        }
        return true;

    }

}