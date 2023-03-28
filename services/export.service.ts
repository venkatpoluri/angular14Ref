/* export.service.ts */
import { HttpClient } from '@angular/common/http';
import { Injectable, ElementRef } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { TradingPartnerService } from './trading-partner.service';
import { TradingPartnerSupplyagreementService } from './trading-partner-supplyagreement.service';
import { ItemService } from './items-service/item.service';
import { TradingPartnerContactsService } from './trading-partner-contacts.service';
import { RestaurantService } from './restaurant.service';
import { DistributorItemService } from './items-service/distributor-item.service';
import { PricingService } from './pricing.service';
import { TradingPartnerFacilityService } from './trading-partner-facility.service';
import { FranchiseService } from './franchise.service';
import { HierarchyService } from './items-service/hierarchy.service';
import { PriceMarkupService } from './price-markup.service';
import { MenuItemService } from './items-service/menu-item.service';
import { SupplierItemService } from './items-service/supplier-item.service';
import { PricingComponentService } from './pricing-component.service';
import { FacilityMarkupService } from './facility-markup.service';
import { ItemAssociationService } from './items-service/item-association.service';
import { LaneSegmentPricingService } from './lane-segment-pricing.service';
import { PricingSupplierMarkupService } from './pricing.supplier-markup.service';

const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private laneSegmentService: LaneSegmentPricingService, private http: HttpClient, private itemAssService:ItemAssociationService,private tradingPartnerService: TradingPartnerService,private facilityMarkupService: FacilityMarkupService,private supplierItemService:SupplierItemService, private franchiseService: FranchiseService, private markupService: PriceMarkupService, private hierarchyService: HierarchyService, private tradingPartnerFacilityService: TradingPartnerFacilityService, private pricingService: PricingService, private tradingPartnerContactsService: TradingPartnerContactsService,private menuItemService: MenuItemService, private itemsService: ItemService, private supplyAgreementService: TradingPartnerSupplyagreementService, private restaurantService: RestaurantService, private distributorItemService: DistributorItemService,private pricingComponentservice: PricingComponentService,private suuplyagreemtService:PricingSupplierMarkupService) { }

  /**
   * Creates excel from the table element reference.
   *
   * @param element DOM table element reference.
   * @param fileName filename to save as.
   */
  public exportTableElmToExcel(element: ElementRef, fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element.nativeElement);
    // generate workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);

  }

  public exportJSONToExcel(data: any, viewName:string) {
    if(viewName =='FacilityDistributorItems'){
      viewName = 'DistributorItems'
    }
    var fileName = `${viewName}GridData`
    var workSheet = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, workSheet, fileName);
    // save to file
    XLSX.writeFile(wb, `${fileName}${EXCEL_EXTENSION}`);
  }

  public exportGridData(cols: any, view: string, queryArgs: string, parantComp?:string, additionalProp?:string) {
    if (queryArgs) {
      queryArgs = queryArgs + '&ReturnAll=true'
    } else {
      queryArgs = queryArgs + '?ReturnAll=true';
    }
    let query;
    switch (view) {
      case 'TradingPartners':
        query = this.tradingPartnerService.getAllTradingPartners(queryArgs);
        break;
      case 'SupplyAgreements':
        query = this.supplyAgreementService.getSupplyAgreementsByTradingPartners(queryArgs);
        break;
      case 'Items':
        query = this.itemsService.getItems(queryArgs);
        break;
      case 'Contacts':
        if(parantComp=='tradingPartner'){
          query = this.tradingPartnerContactsService.getContactsByTradingPartners(queryArgs);
        }else{
          query = this.tradingPartnerContactsService.getAllContacts(queryArgs);
        }
        break;
      case 'Alignments': //@Todo pass in dates
      if(parantComp == 'Date'){
        query = this.restaurantService.getDCAlignmentsByDate(queryArgs);
      }else if(parantComp =='RestaurantID'){
        query = this.restaurantService.getDCAlignmentsByRestaurantId(queryArgs);
      }
        break;
      case 'FacilityDistributorItems':
        if(parantComp == 'tradingPartner'){
          query = this.distributorItemService.getDistributorItemsByTradingPartnerId(queryArgs);
        }else if(parantComp == 'facility'){
          query = this.distributorItemService.getDistributorItemsByFacilityId(queryArgs);
        }else if(parantComp == 'items'){
          query = this.distributorItemService.getDistributorItemsById(queryArgs);
        }
        else{
          query = this.distributorItemService.getDistributorItems(queryArgs);
        }
        break;
      case 'ExchangeRates':
        query = this.pricingService.getAllExchangeRates(queryArgs);
        break;
      case 'Facilities':
        query = this.tradingPartnerFacilityService.getFacilitiesInTradingPartner(queryArgs);
        break;
      case 'Franchisees':
        if(parantComp == 'restaurant'){
          query = this.franchiseService.getFranchiseeByRestaurantId(queryArgs);
        }
        else{
          query = this.franchiseService.getAllLogicalFranchisees(queryArgs);
        }
        break;
      case 'Hierarchies':
        query = this.hierarchyService.gethierarchy(queryArgs);
        break;
      case 'ItemXref':
        query = this.itemsService.getAllItemXref(queryArgs);
        break;
      case 'base-markup':
        query = this.markupService.getAllMarkups(queryArgs);
        break;
      case 'MarkUps':
        query = this.facilityMarkupService.getMarkUpByFacilityId(queryArgs);
        break;
      case 'MenuItems':
        if(parantComp =='items'){
          query = this.menuItemService.getMenuItemsListByItemId(queryArgs);
        }else{
          query=this.menuItemService.getmenuItems(queryArgs);
        }
        break;
      case 'Restaurants':
        query = this.restaurantService.getAllLogicalRestaurants(queryArgs);
        break;
      case 'FacilitySupplierItems':
        if(parantComp == 'tradingPartner'){
          query = this.supplierItemService.getSupplierItemsByTradingPartnerId(queryArgs);
        }
        else if(parantComp =='facility'){
          query = this.supplierItemService.getSupplierItemsByFacilityId(queryArgs);
        }
        else if( parantComp == 'item'){
          query = this.supplierItemService.getSupplierItemsById(queryArgs);
        }
        else{
          query = this.supplierItemService.getAllSupplierItems(queryArgs);
        }
        break;
      case 'PricingComponent':
        query = this.pricingComponentservice.getAllPricingComponents(queryArgs);
        break;
      case 'Amendments':
        query = this.supplyAgreementService.getSupplyAgreementsAmendments(queryArgs);
        break;
      case 'childItems':
        query = this.itemAssService.getAllLogicalAssociateItems(queryArgs);
        break;
      case 'AlternativeItems':
        query = this.itemAssService.getAllLogicalAssociateItems(queryArgs);
        break;
      case 'menu-item-build':
        query = this.menuItemService.getMenuItemBuildByMenuItemId(queryArgs);
        break;
      case 'PlateCostPeriod':
        query = this.menuItemService.getplateCostPeriods(queryArgs);
        break;
      case 'ItemLandedCost':
          query = this.laneSegmentService.getAllLandedCostBySupplyChainId(additionalProp, queryArgs);
        break;
      case 'heirarchy':
        if(additionalProp == 'Menu Items'){
          query = this.menuItemService.GetMenuItemsInLeafCategory(queryArgs);
        }else{
          query = this.itemsService.GetItemsInLeafCategory(queryArgs);
        }
        
        break;
        case 'itemSupplyagreementView':
          query =   this.suuplyagreemtService.getupplyAgreementListByItemId(queryArgs);
        break;
        case 'supplyagrItmview':
          query =   this.suuplyagreemtService.getItemsBySupplyagreementId(queryArgs);
        break;
        default:
          break;

    }
    // console.log(cols);
    //  const url ='http://localhost:5002/api/franchisees/GetLogicalFranchisees?Filters=status==Active&PageNumber=1&PageSize=10&ReturnAll=true';
    query.subscribe(data => {
      const rows: any = data.body;
      const dataToExport = [];
      for (var i = 0; i < rows?.length; i++) {
        const row = rows[i];
        for (var key in row) {
          if (!cols.includes(key)) {
            delete row[key];
          }
        };
        dataToExport.push(row)
      }
      this.exportJSONToExcel(dataToExport,view);
    })
  }
}
