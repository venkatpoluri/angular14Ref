import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedEventService {
    conceptChange = new EventEmitter<any>();
    viewingTradingPartnerChange = new EventEmitter<any>();
    viewingContactChange = new EventEmitter<any>();
    viewingSupplyAgreementAmendmentType = new EventEmitter<any>();
    viewingSupplyAgreementAmendmentNumber = new EventEmitter<any>();
    viewingSupplyAgreementChange = new EventEmitter<any>();
    facilityName = new EventEmitter<any>();
    facilityAddNew = new EventEmitter<any>();
    facilityEditUrl = new EventEmitter<any>();
    facilityDeleteObject = new EventEmitter<any>();
    franchiseMember = new EventEmitter<any>();
    viewingRestaurantChange = new EventEmitter<any>();
    restaurantNum = new EventEmitter<any>();
    itemNum = new EventEmitter<any>();
    menuitemNum = new EventEmitter<any>();
    ItemSupplierItemNum = new EventEmitter<any>();
    hierarchyName = new EventEmitter<any>();
    itemPricingNum = new EventEmitter<any>();
    dcItemNum= new EventEmitter<any>();
    pricingPeriod = new EventEmitter<any>();
    pricingPeriodActions=new EventEmitter<any>();
    dateBasedOnRegion = new EventEmitter<any>();
}
