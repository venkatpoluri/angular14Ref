import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Tenant } from "../models/tenant";
import { LocalStorageRefService } from "./local-storage-ref.service";


@Injectable({ providedIn: "root" })
export class LocalStorageService {
  private _localStorage: Storage;

  private _tenantData$ = new BehaviorSubject<Tenant>(null);
  tenantData$ = this._tenantData$.asObservable();
  private _tradingPartnerId$ = new BehaviorSubject<string>(null);
  tradingPartnerId$ = this._tradingPartnerId$.asObservable();

  constructor(private _localStorageRefService: LocalStorageRefService) {
    this._localStorage = _localStorageRefService.localStorage;
  }

  setTenant(data: Tenant): void {
    const jsonData = JSON.stringify(data);
    this._localStorage.setItem("tenant", jsonData);
    this._tenantData$.next(data);
  }

  loadTenant(): void {
    const data = JSON.parse(this._localStorage.getItem("tenant"));
    this._tenantData$.next(data);
  }

  clearTenant() {
    this._localStorage.removeItem("tenant");
    this._tenantData$.next(null);
  }

  setTradingPartnerId(data: string): void {
    this._localStorage.setItem("tradingPartnerId", data);
    this._tradingPartnerId$.next(data);
  }

  loadTradingPartnerId(): void {
    const data = this._localStorage.getItem("tradingPartnerId");
    this._tradingPartnerId$.next(data);
  }

  clearTradingPartnerId() {
    this._localStorage.removeItem("tradingPartnerId");
    this._tradingPartnerId$.next(null);
  }

  clearAllLocalStorage(): void {
    this._localStorage.clear();
    this._tenantData$.next(null);
    this._tradingPartnerId$.next(null);
  }
}