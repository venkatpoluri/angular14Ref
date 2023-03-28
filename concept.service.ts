import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UserService } from './user.service';
import { map, Observable, take } from 'rxjs';
import { Tenant } from '../models/tenant';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class ConceptService {
  apiRoot: string = `${environment.securityUrl}/api/securityservice/concepts`;
  headers = { 'content-type': 'application/json' };
  constructor(private http: HttpClient, private userService: UserService, private toastr: ToastrService, private localStorageService: LocalStorageService) { }

  getAllConcepts() {
    const url = `${this.apiRoot}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        const transformedData: Tenant[] = [];
        for (let i = 0; i < response.length; i++) {
          if (response[i].tenantAlias === "BK") {
            response[i].img = '../assets/BK logo.svg';
            transformedData.push(response[i]);
          } else if (response[i].tenantAlias === "PLK") {
            response[i].img = '../assets/PLK logo.svg';
            transformedData.push(response[i]);
          }
        }
        return transformedData
      })
    )
  }

  getAllConceptsForUser(): Observable<Tenant[]> {
    const self = this;
    return new Observable(function (observer) {
      const tenants: Tenant[] = [];
      const conceptKeys: string[] = [];
      self.userService.getLoggedInUser().subscribe(user => {
        const keys = Object.keys(user);
        keys.forEach((key, index) => {
          if (key.includes('custom:tenant:')) {
            let conceptKey = key.replace('custom:tenant:', '');
            conceptKey = conceptKey.replace(':roles', '');
            conceptKeys.push(conceptKey);
          }
        });
        self.localStorageService.tenantData$.pipe(take(1)).subscribe(cachedTenant => {         
          self.getAllConcepts().subscribe(data => {

            data.forEach(group => {
              const exists = conceptKeys.find(e => e === group.conceptKey);
              if (exists && group.conceptKey.substring(0, 2) === "BK") {
                group.img = '../assets/BK logo.svg';
                const exists = tenants.filter(ele => {
                  return ele.conceptKey === group.conceptKey;
                });
                if (group.conceptKey !== "BK_US") { //ignore anything US for now
                  tenants.push(group);
                }
              }
              else if (exists && group.conceptKey.substring(0, 3) === "PLK") {
                group.img = '../assets/PLK logo.svg';
                const exists = tenants.filter(ele => {
                  return ele.conceptKey === group.conceptKey;
                });
                tenants.push(group);
              }
            });
            if (!self.userHasAccessToTenant(cachedTenant, conceptKeys) && conceptKeys.length > 0) {
              self.localStorageService.setTenant(tenants[0]);
              self.toastr.info('We reset your currently selected concept region');
            }
            if (conceptKeys.length === 0) {
              self.toastr.warning('You currently have no access to any concepts or regions');
              return;
            }

            observer.next(tenants);

          });
        });
      });
    });
  }
  userHasAccessToTenant(tenant, conceptKeys) {
    if (tenant === null) {
      return false;
    }
    const exists = conceptKeys.find(key => {
      return key === tenant.conceptKey;
    });
    return exists !== null && exists !== undefined;
  }
}