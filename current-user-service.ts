import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";
import { UserService } from "./user.service";


@Injectable({ providedIn: "root" })
export class CurrentUserService {
    private _currentUser$ = new BehaviorSubject<User>(null);
    currentUser$ = this._currentUser$.asObservable();

    constructor(private userService: UserService) {
    }

    loadCurrentUser(): void {

        this.userService.getLoggedInUser().subscribe(data => {
            const user: User = new User();
            user.id = data['cognito:username'];
            user.email = data.email;
            user.familyName = data['family_name'];
            user.givenName = data['given_name'];

            const keys = Object.keys(data);
            for (var i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key.includes('custom:tenant:')) {
                    let conceptKey = key.replace('custom:tenant:', '');
                    conceptKey = conceptKey.replace(':roles', '');
                    const tenant = { 'conceptKey': conceptKey, 'role': data[key] };
                    user.tenants.push(tenant);
                }
            };
            this._currentUser$.next(user);
        });
    }

}