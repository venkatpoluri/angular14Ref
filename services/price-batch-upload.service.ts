import { Injectable } from '@angular/core';
import { PriceBatchItem } from '../models/priceBatch';
import { TradingPartnerSupplyagreementService } from './trading-partner-supplyagreement.service';
import { PricingSupplierMarkupService } from './pricing.supplier-markup.service';
import { Observable, Subject, BehaviorSubject, combineLatestWith } from 'rxjs';

import { ItemService } from './items-service/item.service';
import { PricingService } from './pricing.service';
import {SupplyChainService } from './supply-chain.service';
import {FreightPeriodService} from './freight-period.service';

import { CopySupplyChainParams, SupplyChainForUpdateDto, SupplyChainDocument } from '../models/supplyChain';


@Injectable({
  providedIn: 'root'
})
export class PriceBatchUploadService {


  constructor(private supplyAgreementService: TradingPartnerSupplyagreementService, private pricingService : PricingService, 
    private pricingSupplierMarkupService: PricingSupplierMarkupService, 
    private itemService: ItemService, 
    private supplyChainService: SupplyChainService, 
    private freightPeriodService: FreightPeriodService ) { }

    private _updating = new BehaviorSubject<boolean>(false);
    updating$ = this._updating.asObservable();

  private validateReferenceSupplyChain(item: PriceBatchItem)
  {
    var errorMessages = {};
    var subject = new Subject<Object>();

    //get last supply chain by item DONE
    this.itemService.getItemByNumber(parseInt(item.ItemNo)).subscribe(data => {
      if (data.body.length == 0 || data.body[0].id=== undefined) {
        errorMessages["ItemNo"] =errorMessages["ItemNo"] ?? [];
        errorMessages["ItemNo"].push("There is no previous lane for this item/facility."); 
      }
      else{
        var itemId = data.body[0].id;
        this.supplyChainService.getSupplyChainByItemId(itemId).subscribe(data => {
          if (data.length == 0)
          {
            errorMessages["ItemNo"] =errorMessages["ItemNo"] ?? [];
            errorMessages["ItemNo"].push("There is no previous lane for this item/facility."); 
          }
          else {

            var itemSupplyChainList = data;
            if (itemSupplyChainList.some(sc => datesOverlap(item.FromDate, item.ThruDate, sc.fromDate, sc.thruDate))) {
              errorMessages["ThruDate"] = errorMessages["ThruDate"] ?? [];
              errorMessages["ThruDate"].push("Supply Chain periods cannot overlap");
              
              
              errorMessages["FromDate"] = errorMessages["FromDate"] ?? [];
              errorMessages["FromDate"].push("Supply Chain periods cannot overlap");
            }
            var lastSupplyChain = itemSupplyChainList.sort((a, b) => (new Date(a.thruDate) > new Date(b.thruDate)) ? -1 : 1)[0];
            item.LastSupplyChainId = lastSupplyChain.id;
            item.ItemId = itemId;
          }
          subject.next(errorMessages);
        });


      }
    });

    return subject.asObservable();

  }

  private validateSupplyAgreement(item: PriceBatchItem): Observable<Object>{
    var errorMessages = {};
    var subject = new Subject<Object>();

      
      //get SupplyAgreement by item.SupplyAgreementNumber DONE
      this.supplyAgreementService.getSupplyAgreementByNumber(item.SANumber).subscribe(response =>{
        var supplyAgreement = response.body[0];
        if (supplyAgreement === undefined)
        {
          errorMessages["SANumber"] = errorMessages["SANumber"] ?? [];
          errorMessages["SANumber"].push("Supply Agreement does not exist");
          subject.next(errorMessages);
        }
        else{
        //check if freight period is defined for fromDate-thruDate DONE
        this.freightPeriodService.getFreightPeriodsBySupplyAgreementId(supplyAgreement.id).subscribe(freightPeriods=>{
          var periods = freightPeriods.map(fp => ({
            from_date : new Date(fp.fromDate), 
            thru_date : new Date(fp.thruDate)
          }));
          var freightPeriodOk = this.checkPeriods(periods, item);
          if (!freightPeriodOk){
          
            errorMessages["SANumber"] = errorMessages["SANumber"] ?? [];
            errorMessages["SANumber"].push(`Freight Period does not exist for ${supplyAgreement.classificationType} Supply Agreement # ${supplyAgreement.num} for entered date range`);
          }
          subject.next(errorMessages);
        });


        //check if markup is defined for fromDate-thruDate DONE
          if(supplyAgreement.classificationType === "Re-Distribution")
          {
            this.pricingSupplierMarkupService.getSupplierMarkupsPeriods(supplyAgreement.id).subscribe(mp =>{
              var markupPeriods = mp.body;
              if (markupPeriods === undefined){
                errorMessages["SANumber"] = errorMessages["SANumber"] ?? [];
                errorMessages["SANumber"].push(`Markup Period does not exist for Re-Distribution Supply Agreement ${supplyAgreement.num} for entered date range`);
              }
              else {
                var periods = markupPeriods.map(mp => ({
                  from_date : new Date(mp.from_date), 
                  thru_date : new Date(mp.thru_date)
                }));
                var markupPeriodOk = this.checkPeriods(periods, item);
                if (!markupPeriodOk){
                  errorMessages["SANumber"] = errorMessages["SANumber"] ?? [];
                  errorMessages["SANumber"].push(`Markup Period does not exist for Re-Distribution Supply Agreement ${supplyAgreement.num} for entered date range`);
                }
              }
              subject.next(errorMessages);
            });
          }
        }
    
       
      }
      );
      return subject.asObservable();

  }

  private checkPeriods(periods, item)
  {
    if (periods === undefined || periods.length === 0) return false;
    periods.sort((a, b) =>a.from_date < b.from_date ? -1 : (a.from_date > b.from_date ? 1 : 0));
    var first = periods[0];
    var last = periods[periods.length - 1];
    var itemFrom = new Date(item.FromDate);
    var itemThru = new Date(item.ThruDate);
    if (first.from_date > itemFrom) return false;
    if (last.thru_date < itemThru) return false;

    for(var i = 1; i < periods.length; i++){
      var last_thru = first.thru_date;
      if (periods[i].from_date > last_thru.setDate(last_thru.getDate() + 1)) return false;
      first = periods[i];
    }
    return true;

  }



  private validateDateRange(item: PriceBatchItem) 
  {
    var errorMessages = {};
    var today = new Date();
    today.setDate(today.getDate() - 6);
    if (item.FromDate > item.ThruDate) {
      errorMessages["ThruDate"] = errorMessages["ThruDate"] ?? [];
      errorMessages["ThruDate"].push("Thru Date must be greater than From Date");


      errorMessages["FromDate"] = errorMessages["FromDate"] ?? [];
      errorMessages["FromDate"].push("Thru Date must be greater than From Date");
    }
    
    if (item.FromDate > today) {
      errorMessages["FromDate"] = errorMessages["FromDate"] ?? [];
      errorMessages["FromDate"].push("From Date must not be more than six days before today's date");
    }
    return errorMessages;
  }

  private validateExchangeRate(item: PriceBatchItem) : Observable<Object> 
  {
    var errorMessages = {};
    var subject = new Subject<Object>();

    
    this.supplyChainService.getSupplyChainLaneSegments(item.LastSupplyChainId).subscribe(lanes => {
      //check if there is an exchange rate id for lanes
      var exchangeRates = lanes.map(lane => lane.Exchange_rate_id).filter(er => er !==undefined);
      if (exchangeRates.length > 0){
        for (var er in exchangeRates) {
        // check if there is an exchange rate defined for fromDate-thruDate DONE
        this.pricingService.getExchangeRateById(er).subscribe(rate => {
          var exchangeRateDoc = rate.exchangeRateDocument;
          var periods = exchangeRateDoc.exchange_rate_periods.map(erp => ({
            from_date : new Date(erp.from_date),
            thru_date : new Date(erp.thru_date)
          }));

          var exchangeratePeriodsOk = this.checkPeriods(periods, item);
          if (!exchangeratePeriodsOk){
            errorMessages["FromDate"] = errorMessages["FromDate"] ?? [];
            errorMessages["FromDate"].push("Exchange rate period must be created for entered date range");
    
            errorMessages["ThruDate"] = errorMessages["ThruDate"] ?? [];
            errorMessages["ThruDate"].push("Exchange rate period must be created for entered date range");
            
            subject.next(errorMessages);
          }
          else {
            subject.next({});
          }
        });
      }
    }
    else{
      subject.next({});
    }
        
    });


      return subject.asObservable();

  }

  private validateComponents(item: PriceBatchItem) {
    var invalidPriceComponents ={};

    if (item.FOB <=0) {
      invalidPriceComponents["FOB"] = invalidPriceComponents["FOB"] ?? [];
      invalidPriceComponents["FOB"].push("FOB must be greater than zero");
    }
    if (item.Duty <0){
      invalidPriceComponents["Duty"] = invalidPriceComponents["Duty"] ?? [];
      invalidPriceComponents["Duty"].push("Duty must be greater than or equal zero");
    }
    if (item.Brokerage <0) {
      invalidPriceComponents["Brokerage"] = invalidPriceComponents["Brokerage"] ?? [];
      invalidPriceComponents["Brokerage"].push("Brokerage must be greater than or equal zero");
    }

    if (item.Quota < 0){
      invalidPriceComponents["Quota"] = invalidPriceComponents["Quota"] ?? [];
      invalidPriceComponents["Quota"].push("Quota must be greater than or equal zero");
    }
    if (item.Duty <0 ){
      invalidPriceComponents["Duty"] = invalidPriceComponents["Duty"] ?? [];
      invalidPriceComponents["Duty"].push("Duty must be greater than or equal zero");
    }
    if (item.Revenue < 0) {
      invalidPriceComponents["Revenue"] = invalidPriceComponents["Revenue"] ?? [];
      invalidPriceComponents["Revenue"].push("Revenue must be greater than or equal zero");
    }
    return invalidPriceComponents;
  }

 
  validatePriceBatchItem(item: PriceBatchItem){
    var errorMessages = new Subject<Object>();
    var dre = this.validateDateRange(item);
    var ce=  this.validateComponents(item);
      this.validateReferenceSupplyChain(item).subscribe(em => {
        
        const exchangeRateValidation$ = this.validateExchangeRate(item);
        const supplyAgreementValidation$ = this.validateSupplyAgreement(item);
      
        supplyAgreementValidation$.pipe(
          combineLatestWith(exchangeRateValidation$)
        )
        .subscribe(([sae, ere]) => {
          var merge = concat(ce, concat(dre, concat(em, concat(ere, sae))));
            if (Object.keys(merge).length > 0) {
              item.IsValid = false;
            }
            else {
              item.IsValid = true;
            }
            errorMessages.next(merge);
         });
      });
 
      return errorMessages.asObservable();
  }


  updatePriceBatch(items: PriceBatchItem[]){

    const groupedItems = items.reduce((group, item) => {
      const { ItemNo } = item;
      group[ItemNo] = group[ItemNo] ?? [];
      group[ItemNo].push(item);
      return group;
    }, {});
    //create supply chains
    for (var itemNo in groupedItems)
    {
      // get first of the elements in the item group
      var firstItem = groupedItems[itemNo][0];
      this.createSupplyChain(firstItem);
    }
    
    //create child supply chains 
    this.itemService.getChildItems(firstItem.ItemId).subscribe(data => {
      var child_items = data.body;
      child_items.forEach(item =>{
        this.supplyChainService.getSupplyChainByItemId(item.id).subscribe(data => {
          var itemDto = Object.assign({}, firstItem);
          itemDto.ItemId = item.id;
          itemDto.ItemNo = item.num;
          itemDto.ItemName = item.name;
          this.createSupplyChain(itemDto);
        });
      })

    });
    return true;
  }

  private createSupplyChain(item){
    this._updating.next(true);

    // create supply chain copying the old values, except for the dates, UOM
    var copyParams = new CopySupplyChainParams();
    copyParams.SupplyChainId = item.LastSupplyChainId;
    copyParams.ItemId = item.ItemId;
    copyParams.FromDate = item.FromDate;
    copyParams.ThruDate = item.ThruDate;
    copyParams.UnitOfMeasureType = item.UOM;
    
    
    this.supplyChainService.copySupplyChainbyId(copyParams).subscribe(copiedSupplyChain => {
      var id = copiedSupplyChain.id;
      var lane_queue = [];
      copiedSupplyChain.supplyChainDocument.lane_segments.forEach(ls => lane_queue.push(ls));
      var supplyChainForUpdate = new SupplyChainForUpdateDto();

      // copy the document values (new IDS) for the supply chain and upate the amounts in the price components 
      while(lane_queue.length > 0){
        var lane  = lane_queue.shift();
        // in lanes where source_facility = ShippingFacility
        if (lane.source_facility_name == item.Facility){
          lane.price_components = [
              {
                "type":"Duty",
                "amount":item.Duty
             },
             {
                "type":"Brokerage",
                "amount":item.Brokerage
             },
             {
                "type":"Invoice",
                "amount":item.InvoiceFOB
             },
             {
                "type":"FOB",
                "amount":item.FOB
             },
             {
                "type":"Revenue",
                "amount":item.Revenue
             },
             {
                "type":"Quota",
                "amount":item.Quota
             }
          ];
        }
        if (lane.children !== undefined){
          for(var child of lane.children)
          {
            if (child !== undefined){
              lane_queue.push(child);
            }
          }
        }
      }
      supplyChainForUpdate.SupplyChainDocument = new SupplyChainDocument();
      supplyChainForUpdate = JSON.parse(JSON.stringify(copiedSupplyChain));
      this.supplyChainService.updateSupplyChain(id, supplyChainForUpdate).subscribe(result => this._updating.next(false));
    });
        
    
    
  }


}
function concat(a, b)
{
  for (let b_key in b)  
  {
    a[b_key] = a[b_key] ?? [];
    a[b_key] = a[b_key].concat(b[b_key]);
  };
  return a;

}

function datesOverlap(from1:Date, to1:Date, from2:Date, to2:Date){
  return (from1 >= from2 && from1 <= to2) || (from2 >= from1 && from2 <= to1); 
}


