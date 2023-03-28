import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router, Routes } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItemForm, Specification, SupplierItem } from 'src/app/models/item';
import { DataService } from 'src/app/services/data.service';
import { ItemService } from 'src/app/services/items-service/item.service';
import { SupplierItemService } from 'src/app/services/items-service/supplier-item.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SharedEventService } from 'src/app/services/shared-event.service';
import { TradingPartnerFacilityService } from 'src/app/services/trading-partner-facility.service';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { diffString, diff } from 'json-diff';
//import * as _ from "lodash"
import { Tenant } from 'src/app/models/tenant';
import { CurrentUserService } from 'src/app/services/current-user-service';
import { shareReplay, take } from 'rxjs';


@Component({
  selector: 'app-supplier-item-info-detail',
  templateUrl: './supplier-item-info-detail.component.html',
  styleUrls: ['./supplier-item-info-detail.component.scss']
})
export class SupplierItemInfoDetailComponent implements OnInit {

  chainbrand: boolean = true;
  allFacilities: any[] = [];
  searchFacilities: any[] = [];
  allItems: any[] = [];
  shelfLife: number = 0;
  itemInfo: ItemForm;
  supplierItem: SupplierItem;
  specifications: Specification[];
  supplierItemNo: string;
  supplierItemName: string;
  @Input() currentView: string;
  @Input() isEditing: boolean;
  @Input() itemId: string;
  @Input() supplierItemId: string;
  shelfLifeUomEnum: any[] = [];
  item_published_price_period_uom: any[] = [];
  units_per_package_uom: any[] = [];
  inner_pack_units_per_package_uom: any[] = [];
  item_cube_uom: any[] = [];
  item_weight_uom: any[] = [];
  item_shipment_package_type: any[] = [];
  spec_package_measurement_uom: any[] = [];
  facilityName: string;
  isParentItem: boolean = false;
  specificationId: string;
  facilityId: string;
  isParentItemIsChild: boolean = false;
  supplierNewSpecEffectiveDate: Date;
  dateFormat:string;
  //Copy Supplier Item
  effectiveDate: Date;
  facilities: any = [] = [];
  pagination: any;
  selectedfacility: any;
  search: any = { searchData: "", pageNumber: 1, pageSize: 10, total: 0 };

  //SpecLog
  specLogData: any = [];
  specSelected: any = 0;
  previousSpec: any = 1;
  casesPerShipping: any = 0;
  platformPerTruckload: any = 0;
  latestSpec: Specification;
  @ViewChild('newSpecEffectiveDate', { static: false }) private newSpecEffectiveDate;
  @ViewChild('newSpecEffectiveDateComponent', { static: false }) private newSpecEffectiveDateComponent;
  userCanDeleteElements = false;
  userCanAddNewElement = false;
  userCanEditElement = false;
  tenant: Tenant;
  autoCompleteFacilityName = 'name';
  autoCompleteItemName = 'name';
  facilityInfo: any;
  constructor(private _formBuilder: FormBuilder, private sharedEventService: SharedEventService, private dataService: DataService, private localStorageService: LocalStorageService, private itemService: ItemService, private toastr: ToastrService, private router: Router, private tpFacilityServce: TradingPartnerFacilityService, private supplierService: SupplierItemService, private modalService: NgbModal, private currentUserService: CurrentUserService) { }

  ngOnInit(): void {
    const tenantObs$ = this.localStorageService.tenantData$.pipe(take(1));
    tenantObs$.subscribe((tenant) => {
      this.tenant = tenant;
      this.currentUserService.loadCurrentUser();
      const userObs$ = this.currentUserService.currentUser$.pipe(shareReplay());
      userObs$.subscribe(user => {
        const currentConcept = this.tenant?.conceptKey;
        for (var i = 0; i < user?.tenants.length; i++) {
          const tenant = user.tenants[i];
          if (tenant.conceptKey === currentConcept && (tenant.role === "ADMIN" || tenant.role === "BUYER")) {
            this.userCanDeleteElements = true;
            this.userCanAddNewElement = true;
          }
          if (tenant.conceptKey === currentConcept && (tenant.role === "ADMIN" || tenant.role === "BUYER")) {
            this.userCanAddNewElement = true;
            this.userCanEditElement = true;
          }
        }
      });
    });
    if (this.currentView === 'add') {
      // this.getAllFacilities();
      if (this.itemId === 'xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxxx') {
        // this.getAllItems();
      }
      else {
        this.isParentItem = true;
        this.createSupplierItemFormGroup.get('itemId').patchValue(this.itemId);
        this.getParentItemInfo();
      }
    }
    else {
      if (this.supplierItemId && this.itemId)
        this.getSupplierItemInfo();
      else
        this.router.navigateByUrl('all-supplier-items');
    }
    this.shelfLifeUomEnum = this.dataService.getShelfLifeUomEnum();
    this.item_published_price_period_uom = this.dataService.getItem_published_price_period_uom();
    this.units_per_package_uom = this.dataService.getUnits_per_package_uom();
    this.inner_pack_units_per_package_uom = this.dataService.getInner_pack_units_per_package_uom();
    this.item_cube_uom = this.dataService.getitem_cube_uom();
    this.item_weight_uom = this.dataService.getitem_weight_uom();
    this.item_shipment_package_type = this.dataService.getitem_shipment_package_type();
    this.spec_package_measurement_uom = this.dataService.getpackage_measurement_uom();

    this.sharedEventService.dateBasedOnRegion.subscribe((resp)=>{
      this.dateFormat=resp;
    })
  }
  createSupplierItemFormGroup: FormGroup = this._formBuilder.group({
    facilityId: ['', Validators.required],
    supplierItemNum: ['', Validators.required],
    supplierItemName: ['', Validators.required],
    effectiveDate: [null, Validators.required],
    itemId: ['', Validators.required],
    gtin: [null],
    matrix: [''],
    itemShelfLife: [],
    itemShelfLifeDay: [],
    itemShelfLifeUOM: [],
    dcMinShelfLife: [],
    restMinShelfLife: [],
    unitsPerCase: [],
    unitRangePerCase: [],
    innerPacksPerCase: [],
    unitsPerInnerPack: ['',Validators.required],
    unitsPerInnerPackUOM: ['',Validators.required],
    // spec
    extnCaseDimensionUOM: ['', Validators.required],
    extnCaseLength: ['', Validators.required],
    extnCaseWidth: ['', Validators.required],
    extnCaseHeight: ['', Validators.required],
    itemCubeValue: ['', Validators.required],
    itemCuberUOM: ['Cubic Feet', Validators.required],
    weightPerCaseUOM: ['', Validators.required],
    grossWeightPerCase: ['', Validators.required],
    netWeightPerCase: ['', Validators.required],
    shippingPlatformType: ['', Validators.required],
    tieQty: [],
    highQty: [],
    casesPerShippingPlatform: [],
    casesPerOceanContainer: [],
    casesPerTruckLoad: [, Validators.required],
    platformTypePerTruckload: [],
    doubleStackingAllowed: []

  });

  updateSupplierItemSpecFormGroup: FormGroup = this._formBuilder.group({
    newSpeceffectiveDate: [null, [Validators.required, this.checkEffectiveDateFuture()]]
  });

  checkEffectiveDateFuture(): ValidatorFn {
    return (control: AbstractControl) => {
      const endDate = control.value;
      if (!endDate) {
        return null;
      }
      const effectiveDate = control.parent.get('newSpeceffectiveDate').value;
      const tday = moment(new Date().setHours(0, 0, 0));
      //const tday = moment(this.latestSpec?.from_date);
      const start = moment(effectiveDate);
      if (start) {
        if ((start.isSame(tday) || start.isBefore(tday)) && start.isBefore(this.latestSpec.from_date)) {
          return { errorDate: "Effective Date should be greater than today" };
        }
      }
      return null;
    }
  }
  getParentItemInfo() {
    this.itemService.getItemById(this.itemId).subscribe((resp) => {
      this.itemInfo = resp;
      if(this.currentView==='add')
      {
        this.createSupplierItemFormGroup.get('unitsPerInnerPack').patchValue(this.itemInfo?.itemDocument?.chain_item.inner_pack_units_per_package);
        this.createSupplierItemFormGroup.get('unitsPerInnerPackUOM').patchValue(this.itemInfo?.itemDocument?.chain_item.inner_pack_units_per_package_uom);

      }
    })
  }

  getAllItems() {
    this.itemService.getAllItems().subscribe((resp) => {
      this.allItems = resp;
    })
  }




  getAllFacilities() {
    this.tpFacilityServce.getFacilitiesInTradingPartner("").subscribe((resp) => {
      this.allFacilities = resp.body;
    })
  }

  updateFormDataFromAPI() {
    let supplierItemInfo = this.itemInfo.itemDocument.supplier_items[0];
    this.createSupplierItemFormGroup.patchValue({
      facilityId: supplierItemInfo.facility_id,
      supplierItemNum: supplierItemInfo.num,
      supplierItemName: supplierItemInfo.name,
      effectiveDate: this.latestSpec?.from_date,
      itemId: this.itemInfo.id,
      gtin: supplierItemInfo.gtin_case,
      matrix: supplierItemInfo.is_available_for_cost_matrix,
      itemShelfLife: supplierItemInfo.shelf_life,
      itemShelfLifeDay: supplierItemInfo.itm_shelf_life_days,
      itemShelfLifeUOM: supplierItemInfo.shelf_life_uom,
      dcMinShelfLife: supplierItemInfo.dc_min_shelf_life,
      restMinShelfLife: supplierItemInfo.rest_min_shelf_life,
      unitsPerCase: supplierItemInfo.unit_per_innerPack,
      //unitRangePerCase: supplierItemInfo.inner_pack_units_per_package,
      innerPacksPerCase: [],
      unitsPerInnerPack: supplierItemInfo.inner_pack_units_per_package,
      unitsPerInnerPackUOM: supplierItemInfo.inner_pack_units_per_package_uom,
      // spec
      extnCaseDimensionUOM: supplierItemInfo.specification?.package_measurement_uom,
      extnCaseLength: supplierItemInfo.specification?.package_length,
      extnCaseWidth: supplierItemInfo.specification?.package_width,
      extnCaseHeight: supplierItemInfo.specification?.package_height,
      itemCubeValue: supplierItemInfo.specification?.item_cube_value,
      itemCuberUOM: supplierItemInfo.specification?.item_cube_uom,
      weightPerCaseUOM: supplierItemInfo.specification?.weight_uom,
      grossWeightPerCase: supplierItemInfo.specification?.package_gross_weight,
      netWeightPerCase: supplierItemInfo.specification?.package_net_weight,
      shippingPlatformType: supplierItemInfo.specification?.shipment_package_type,
      tieQty: supplierItemInfo.specification?.tie_qty,
      highQty: supplierItemInfo.specification?.high_qty,
      casesPerShippingPlatform: Number(supplierItemInfo.specification?.tie_qty) * Number(supplierItemInfo.specification?.high_qty),
      casesPerOceanContainer: supplierItemInfo.specification?.cases_per_ocean_container,
      casesPerTruckLoad: supplierItemInfo.specification?.cases_per_truck_load,
      platformTypePerTruckload: supplierItemInfo.specification?.platform_per_truck_loaded,
      doubleStackingAllowed: supplierItemInfo.specification?.is_double_stack_allowed
    });
  }

  getSupplierItemInfo() {
    this.supplierService.ReadItemSupplierItemById(this.itemId, this.supplierItemId).subscribe((resp) => {
      this.itemInfo = resp;
      // if(!this.itemInfo.isBranded){
      //   this.createSupplierItemFormGroup.get('gtin').setValidators(Validators.required);
      // }
      this.isParentItemIsChild = this.itemInfo.isChild;
      if (this.itemInfo && this.itemInfo.itemDocument?.supplier_items && this.itemInfo.itemDocument?.supplier_items.length == 1) {
        this.sharedEventService.ItemSupplierItemNum.emit(this.itemInfo.itemDocument.supplier_items[0].num);
        this.supplierItemNo = this.itemInfo.itemDocument.supplier_items[0].num;
        this.supplierItemName = this.itemInfo.itemDocument.supplier_items[0].name;
        this.facilityId = this.itemInfo.itemDocument.supplier_items[0].facility_id;
        this.itemInfo.itemDocument.supplier_items[0].itm_dc_min_shelf_days = this.getdcMinShelfLifeDays(this.itemInfo.itemDocument.supplier_items[0].shelf_life);
        this.itemInfo.itemDocument.supplier_items[0].itm_shelf_life_days = this.getItemShelfLifeDays(this.itemInfo.itemDocument.supplier_items[0].shelf_life, this.itemInfo.itemDocument.supplier_items[0].dc_min_shelf_life_uom);
        this.itemInfo.itemDocument.supplier_items[0].itm_rest_min_shelf_days = this.getdcRestMinShelfLifeDays(this.itemInfo.itemDocument.supplier_items[0].shelf_life);
        this.itemInfo.itemDocument.supplier_items[0].unit_per_innerPack = this.getUnitsPerInnerPack(Number(this.itemInfo.itemDocument.supplier_items[0].inner_pack_units_per_package), Number(this.itemInfo.itemDocument.chain_item.units_per_package));
        if (this.itemInfo.itemDocument?.supplier_items[0].specifications && this.itemInfo.itemDocument?.supplier_items[0].specifications.length > 0) {

          //Spec Log
          this.specLogData.push(this.itemInfo.itemDocument?.supplier_items[0].specifications);
          this.casesPerShipping = (this.specLogData[0][this.specSelected].tie_qty == null ? 0 : this.specLogData[0][this.specSelected].tie_qty) * (this.specLogData[0][this.specSelected].high_qty == null ? 0 : this.specLogData[0][this.specSelected].high_qty);
          this.platformPerTruckload = 100 * (this.specLogData[0][this.specSelected].cases_per_truck_load == null ? 0 : this.specLogData[0][this.specSelected].cases_per_truck_load) / ((this.specLogData[0][this.specSelected].tie_qty == null ? 0 : this.specLogData[0][this.specSelected].tie_qty) * (this.specLogData[0][this.specSelected].high_qty == null ? 0 : this.specLogData[0][this.specSelected].high_qty));

          if (this.itemInfo.itemDocument?.supplier_items[0].specifications.length == 1) {
            this.itemInfo.itemDocument.supplier_items[0].specification = this.itemInfo.itemDocument.supplier_items[0].specifications[0];
            this.latestSpec = this.itemInfo.itemDocument.supplier_items[0].specification;
          }
          else {
            // select spec based on dates
            this.itemInfo.itemDocument.supplier_items[0].specification =
              this.itemInfo.itemDocument.supplier_items[0].specifications.filter(spec => {
                let today = moment(new Date().setHours(0, 0, 0, 0));
                return (today >= moment(spec.from_date) && (!spec.thru_date || spec.thru_date == null || spec.thru_date === undefined || (today <= moment(spec.thru_date))));
              }
              )[0];
            this.latestSpec = this.itemInfo.itemDocument.supplier_items[0].specifications.filter(spec => {
              return (!spec.thru_date || spec.thru_date == null || spec.thru_date === undefined);
            })[0];
          }
          if (this.itemInfo.itemDocument.supplier_items[0].specification) {
            this.specificationId = this.itemInfo.itemDocument.supplier_items[0].specification.id;
            this.itemInfo.itemDocument.supplier_items[0].specification.cases_per_shipping_platform = Number(this.itemInfo.itemDocument.supplier_items[0]?.specification.tie_qty) * Number(this.itemInfo.itemDocument?.supplier_items[0]?.specification.high_qty);
            let denominator = Number(this.itemInfo.itemDocument?.supplier_items[0]?.specification.tie_qty) * Number(this.itemInfo?.itemDocument?.supplier_items[0]?.specification.high_qty);
            this.itemInfo.itemDocument.supplier_items[0].specification.platform_per_truck_loaded = (100 * this.itemInfo.itemDocument.supplier_items[0].specification.cases_per_shipping_platform) / denominator == 0 ? 1 : denominator;
            this.getAllLogicalFacilities(this.search);
          }
        }
      }
      this.updateFormDataFromAPI();
    })
  }
  specChanged() {
    if (this.specSelected == this.specLogData[0].length - 1) {
      this.previousSpec = parseInt(this.specSelected);
    }
    else {
      this.previousSpec = parseInt(this.specSelected) + 1;
    }
    this.casesPerShipping = (this.specLogData[0][this.specSelected].tie_qty == null ? 0 : this.specLogData[0][this.specSelected].tie_qty) * (this.specLogData[0][this.specSelected].high_qty == null ? 0 : this.specLogData[0][this.specSelected].high_qty);
    this.platformPerTruckload = 100 * (this.specLogData[0][this.specSelected].cases_per_truck_load == null ? 0 : this.specLogData[0][this.specSelected].cases_per_truck_load) / ((this.specLogData[0][this.specSelected].tie_qty == null ? 0 : this.specLogData[0][this.specSelected].tie_qty) * (this.specLogData[0][this.specSelected].high_qty == null ? 0 : this.specLogData[0][this.specSelected].high_qty));

  }
  get ItemShelfLifeDays() {
    let shelfLife = this.createSupplierItemFormGroup.get('itemShelfLife').value;
    if (!shelfLife) shelfLife = 0;
    let shelfLifeDays = 0;
    switch (this.createSupplierItemFormGroup.get('itemShelfLifeUOM').value) {
      case ('Day(s)'):
        shelfLifeDays = Math.round(shelfLife);
        break;
      case ('Week(s)'):
        shelfLifeDays = Math.round(shelfLife * 7);
        break;
      case ('Month(s)'):
        shelfLifeDays = Math.round(shelfLife * 30.5);
        break;
      case ('Year(s)'):
        shelfLifeDays = Math.round(shelfLife * 365);
        break;
      default:
        shelfLifeDays = Math.round(shelfLife);
    }
    this.createSupplierItemFormGroup.get('itemShelfLifeDay').patchValue(shelfLifeDays);
    return shelfLifeDays;
  }
  getItemShelfLifeDays(shelfLife: number, shelfLifeUOM: string) {
    let shelfLifeDays = 0;
    switch (shelfLifeUOM) {
      case ('Day(s)'):
        shelfLifeDays = Math.round(shelfLife);
        break;
      case ('Week(s)'):
        shelfLifeDays = Math.round(shelfLife * 7);
        break;
      case ('Month(s)'):
        shelfLifeDays = Math.round(shelfLife * 30.5);
        break;
      case ('Year(s)'):
        shelfLifeDays = Math.round(shelfLife * 365);
        break;
      default:
        shelfLifeDays = Math.round(shelfLife);
    }
    this.createSupplierItemFormGroup.get('itemShelfLifeDay').patchValue(shelfLifeDays);
    return shelfLifeDays;
  }
  get dcMinShelfLifeDays() {
    let dcminDays = 0;
    dcminDays = Math.round(this.createSupplierItemFormGroup.get('itemShelfLifeDay').value * 0.67);
    this.createSupplierItemFormGroup.get('dcMinShelfLife').patchValue(dcminDays);
    return dcminDays;
  }
  getdcMinShelfLifeDays(shelfLifeDays: number) {
    let dcminDays = shelfLifeDays * 0.67;
    return dcminDays;
  }
  get dcRestMinShelfLifeDays() {
    let restShelfLife = Math.round(Number(this.createSupplierItemFormGroup.get('itemShelfLifeDay').value) * 0.33);
    this.createSupplierItemFormGroup.get('restMinShelfLife').patchValue(restShelfLife);
    return restShelfLife
  }
  getdcRestMinShelfLifeDays(shelfLifeDays: number) {
    let restShelfLife = Math.round(shelfLifeDays * 0.33);
    return restShelfLife
  }
  get innerPackUnits() { return this.createSupplierItemFormGroup.get('unitsPerInnerPack').value == 0 ? 1 : this.createSupplierItemFormGroup.get('unitsPerInnerPack').value; }

  get UnitsPerInnerPack() {
    let uperInnerPack = Number(this.createSupplierItemFormGroup.get('unitsPerInnerPack').value);

    return this.itemInfo?.itemDocument?.chain_item?.units_per_package / (uperInnerPack == 0 ? 1 : uperInnerPack);
  }

  getUnitsPerInnerPack(unitperInnerPack: number, chainUnitsPerPckg: number) {
    if (unitperInnerPack == 0) return unitperInnerPack;
    return chainUnitsPerPckg / unitperInnerPack;
  }

  get cubeValue() {
    let cubeMeasurement = this.createSupplierItemFormGroup.get('extnCaseLength').value * this.createSupplierItemFormGroup.get('extnCaseWidth').value * this.createSupplierItemFormGroup.get('extnCaseHeight').value;
    this.createSupplierItemFormGroup.get('itemCubeValue').patchValue(cubeMeasurement);
    return cubeMeasurement;
  }
  get casesPerShippingPlatform() {
    return this.createSupplierItemFormGroup.get('tieQty').value * this.createSupplierItemFormGroup.get('highQty').value;
  }
  get platformTypeTruckload() {
    let denominator = Number(this.createSupplierItemFormGroup.get('tieQty').value) * Number(this.createSupplierItemFormGroup.get('highQty').value);
    return (100 * Number(this.createSupplierItemFormGroup.get('casesPerTruckLoad').value)) / (denominator == 0 ? 1 : denominator);
  }

  getFacilityName() {
    let facilityId = this.createSupplierItemFormGroup.get('facilityId').value;
    this.facilityName = this.allFacilities.filter(fc => fc.id == facilityId)[0].name;
  }
  getItemInfo() {
    let itemId = this.createSupplierItemFormGroup.get('itemId').value;
    this.itemInfo = this.allItems.filter(itm => itm.id == itemId)[0];
  }


  getSupplierItemBody() {
    this.specifications = [];
    if (this.currentView === 'add') {
      let specification: Specification = {
        id: uuid.v4(),
        from_date: this.createSupplierItemFormGroup.get('effectiveDate').value,
        package_measurement_uom: this.createSupplierItemFormGroup.get('extnCaseDimensionUOM').value,
        package_length: String(this.createSupplierItemFormGroup.get('extnCaseLength').value),
        package_width: String(this.createSupplierItemFormGroup.get('extnCaseWidth').value),
        package_height: String(this.createSupplierItemFormGroup.get('extnCaseHeight').value),
        item_cube_value: String(this.createSupplierItemFormGroup.get('itemCubeValue').value),
        item_cube_uom: this.createSupplierItemFormGroup.get('itemCuberUOM').value,
        weight_uom: this.createSupplierItemFormGroup.get('weightPerCaseUOM').value,
        package_gross_weight: String(this.createSupplierItemFormGroup.get('grossWeightPerCase').value),
        package_net_weight: String(this.createSupplierItemFormGroup.get('netWeightPerCase').value),
        shipment_package_type: this.createSupplierItemFormGroup.get('shippingPlatformType').value,
        is_double_stack_allowed: this.createSupplierItemFormGroup.get('doubleStackingAllowed').value,
        tie_qty: String(this.createSupplierItemFormGroup.get('tieQty').value),
        high_qty: String(this.createSupplierItemFormGroup.get('highQty').value),
        cases_per_ocean_container: String(this.createSupplierItemFormGroup.get('casesPerOceanContainer').value),
        cases_per_truck_load: String(this.createSupplierItemFormGroup.get('casesPerTruckLoad').value),
        apply_rdc_flat_fee: false
      };
      this.specifications.push(specification);
      this.supplierItem = {
        id: uuid.v4(),
        facility_id: this.facilityInfo?.id,
        facility_name: this.facilityInfo?.name,
        num: this.createSupplierItemFormGroup.get('supplierItemNum').value,
        name: this.createSupplierItemFormGroup.get('supplierItemName').value,
        gtin_case: this.createSupplierItemFormGroup.get('gtin').value,
        short_name: null,
        description: null,
        shelf_life: Number(this.createSupplierItemFormGroup.get('itemShelfLife').value),
        shelf_life_uom: this.createSupplierItemFormGroup.get('itemShelfLifeUOM').value,
        rest_min_shelf_life: this.createSupplierItemFormGroup.get('restMinShelfLife').value,
        rest_min_shelf_life_uom: "Day(s)",
        package_type: "Case",
       inner_pack_units_per_package: this.createSupplierItemFormGroup.get('unitsPerInnerPack').value.toString(),
        inner_pack_units_per_package_uom: this.createSupplierItemFormGroup.get('unitsPerInnerPackUOM').value,

       // inner_pack_units_per_package: String( this.itemInfo?.itemDocument?.chain_item.inner_pack_units_per_package),
        //inner_pack_units_per_package_uom: this.itemInfo?.itemDocument?.chain_item.inner_pack_units_per_package_uom,

        is_available_for_cost_matrix: Boolean(this.createSupplierItemFormGroup.get('matrix').value ? "Yes" : "No"),
        is_redistribution_flat_fee: null,
        redistribution_flat_fee_dt: null,
        dc_min_shelf_life: this.createSupplierItemFormGroup.get('dcMinShelfLife').value,
        dc_min_shelf_life_uom: "Day(s)",
        specifications: this.specifications

      }
    }
    else if (this.currentView === 'edit' && this.isParentItemIsChild) {
      //this.specifications=this.itemInfo.itemDocument.supplier_items[0].specifications;
      this.itemInfo.itemDocument.supplier_items[0].num = this.createSupplierItemFormGroup.get('supplierItemNum').value;
      this.itemInfo.itemDocument.supplier_items[0].name = this.createSupplierItemFormGroup.get('supplierItemName').value;
      this.itemInfo.itemDocument.supplier_items[0].gtin_case = this.createSupplierItemFormGroup.get('gtin').value;
      this.supplierItem = this.itemInfo.itemDocument.supplier_items[0];
    }
    else {
      //  edit
      let editSupplierItem: SupplierItem;
      editSupplierItem = this.itemInfo.itemDocument.supplier_items[0];
      let newspecification: Specification = {
        id: uuid.v4(),
        package_measurement_uom: this.createSupplierItemFormGroup.get('extnCaseDimensionUOM').value,
        package_length: String(this.createSupplierItemFormGroup.get('extnCaseLength').value),
        package_width: String(this.createSupplierItemFormGroup.get('extnCaseWidth').value),
        package_height: String(this.createSupplierItemFormGroup.get('extnCaseHeight').value),
        item_cube_value: String(this.createSupplierItemFormGroup.get('itemCubeValue').value),
        item_cube_uom: this.createSupplierItemFormGroup.get('itemCuberUOM').value,
        weight_uom: this.createSupplierItemFormGroup.get('weightPerCaseUOM').value,
        package_gross_weight: String(this.createSupplierItemFormGroup.get('grossWeightPerCase').value),
        package_net_weight: String(this.createSupplierItemFormGroup.get('netWeightPerCase').value),
        shipment_package_type: this.createSupplierItemFormGroup.get('shippingPlatformType').value,
        is_double_stack_allowed: this.createSupplierItemFormGroup.get('doubleStackingAllowed').value,
        tie_qty: String(this.createSupplierItemFormGroup.get('tieQty').value),
        high_qty: String(this.createSupplierItemFormGroup.get('highQty').value),
        cases_per_ocean_container: String(this.createSupplierItemFormGroup.get('casesPerOceanContainer').value),
        cases_per_truck_load: String(this.createSupplierItemFormGroup.get('casesPerTruckLoad').value),
        apply_rdc_flat_fee: false
      };
      this.supplierItem = {
        id: editSupplierItem.id,
        facility_id: editSupplierItem.facility_id,
        facility_name: editSupplierItem.facility_name,
        num: this.createSupplierItemFormGroup.get('supplierItemNum').value,
        name: this.createSupplierItemFormGroup.get('supplierItemName').value,
        gtin_case: this.createSupplierItemFormGroup.get('gtin').value,
        short_name: null,
        description: null,
        shelf_life: Number(this.createSupplierItemFormGroup.get('itemShelfLife').value),
        shelf_life_uom: this.createSupplierItemFormGroup.get('itemShelfLifeUOM').value,
        rest_min_shelf_life: this.createSupplierItemFormGroup.get('restMinShelfLife').value,
        rest_min_shelf_life_uom: "Day(s)",
        package_type: "Case",
        inner_pack_units_per_package: this.createSupplierItemFormGroup.get('unitsPerInnerPack').value.toString(),
        inner_pack_units_per_package_uom: this.createSupplierItemFormGroup.get('unitsPerInnerPackUOM').value,
        is_available_for_cost_matrix: Boolean(this.createSupplierItemFormGroup.get('matrix').value),
        is_redistribution_flat_fee: null,
        redistribution_flat_fee_dt: null,
        dc_min_shelf_life: this.createSupplierItemFormGroup.get('dcMinShelfLife').value,
        dc_min_shelf_life_uom: "Day(s)",
        newSpecification: newspecification,
        specifications: editSupplierItem.specifications,
        specification: editSupplierItem.specification
      }
    }

  }
  CreateSupplierItem() {
        this.createSupplierItemFormGroup.markAllAsTouched();
    if (this.createSupplierItemFormGroup.invalid) {
    } else {
      this.getSupplierItemBody();
      if (this.supplierItem) {
        if (this.currentView === 'add') {
          delete this.supplierItem.specification;
          delete this.supplierItem.newSpecification;
          this.supplierService.createSupplierItem(this.itemInfo.id, this.supplierItem).subscribe({
            next: (n) => {
              this.toastr.success('Supplier Item has been created successfully!');
              if (this.isParentItem) {
                this.router.navigateByUrl(`/item/${this.itemInfo.id}/view/facility-items/supplier`);
              }
              else {
                this.router.navigateByUrl(`/item/${this.itemInfo.id}/supplier-item/view/${this.supplierItem.id})`);
              }


            },
            error: (e) => {
              this.toastr.error(
                'Sorry an error occurred while creating the supplier Item.'
              );
            },
          });
        }
        else if (this.currentView === 'edit' && this.isParentItemIsChild) {  //  update only a few fields
          this.updateSupplierItemWithSpec();

        }
        else if (this.currentView === 'edit' && !this.isParentItemIsChild) {
          // Open popup if any changes in spec; editSupplierItemEffectiveDate
          if (this.IsJsonDocumentSame(this.supplierItem.specification, this.supplierItem.newSpecification)) {
            this.updateSupplierItemWithSpec();
          }
          else {
            //this.modalService.open(this.newSpecEffectiveDateComponent);
            this.modalService.open(this.newSpecEffectiveDateComponent, { ariaLabelledBy: 'modal-basic-title-effectiveDate' }).result.then((result) => {
            }, (reason) => {
            });
          }
        }
      }
    }

  }

  IsJsonDocumentSame(oldspec: Specification, newSpec: Specification) {
    //let res = _.isEqual(oldspec, newSpec);
    if (oldspec.tie_qty != newSpec.tie_qty || oldspec.high_qty != newSpec.high_qty || oldspec.weight_uom != newSpec.weight_uom || oldspec.package_length != newSpec.package_length || oldspec.package_width != newSpec.package_width || oldspec.package_height != newSpec.package_height || oldspec.package_net_weight != newSpec.package_net_weight || oldspec.package_gross_weight != newSpec.package_gross_weight
      || oldspec.cases_per_truck_load != newSpec.cases_per_truck_load || oldspec.package_measurement_uom != newSpec.package_measurement_uom || oldspec.shipment_package_type != newSpec.shipment_package_type || oldspec.is_double_stack_allowed != newSpec.is_double_stack_allowed)
      return false;
    return true;
  }

  updateSupplierItemWithSpec() {
    delete this.supplierItem.specification;
    delete this.supplierItem.newSpecification;
    this.supplierService.updateSupplierItem(this.itemInfo.id, this.supplierItemId, this.supplierItem).subscribe({
      next: (n) => {
        this.toastr.success('Supplier Item has been updated successfully!');
        this.router.navigateByUrl(`/item/${this.itemInfo.id}/supplier-item/view/${this.supplierItemId})`);
        if (this.isEditing) this.modalService.dismissAll();
      },
      error: (e) => {
        this.toastr.error(
          'Sorry an error occurred while updating the supplier Item.'
        );
      },
    });
  }

  UpdateSupplierItemWithNewSpec() {
    // update active spec effective date and add new spec
    this.updateSupplierItemSpecFormGroup.markAllAsTouched();
    if (this.updateSupplierItemSpecFormGroup.invalid) {
      console.log('fill required field');
    } else {
      let activeSpec = this.supplierItem.specification;
      let newSpec = this.supplierItem.newSpecification;
      if (activeSpec.id === this.latestSpec.id) {
        newSpec.from_date = this.updateSupplierItemSpecFormGroup.get('newSpeceffectiveDate').value;
        activeSpec.thru_date = this.getPreviousDay(newSpec.from_date);
        this.supplierItem.specifications = this.supplierItem.specifications.filter(spec => spec.id != activeSpec.id);
        this.supplierItem.specifications.push(activeSpec);
      }
      else {
        newSpec.from_date = this.updateSupplierItemSpecFormGroup.get('newSpeceffectiveDate').value;
        //this.latestSpec.thru_date = this.getPreviousDay(newSpec.from_date);
        activeSpec.thru_date = this.getPreviousDay(newSpec.from_date);
        this.supplierItem.specifications = this.supplierItem.specifications.filter(spec => spec.id != activeSpec.id);
        this.supplierItem.specifications.push(activeSpec);
        // any spec > user entered effective date
        let futurespecs =
          this.supplierItem.specifications.filter(spec => {
            //let futureSpecStartFrom = moment(this.updateSupplierItemSpecFormGroup.get('newSpeceffectiveDate').value);
            return (moment(spec.from_date) > moment(activeSpec.from_date));
          }
          )
        if (futurespecs && futurespecs.length > 0) {
          for (let s = 0; s < futurespecs.length; s++) {
            this.supplierItem.specifications = this.supplierItem.specifications.filter(spec => spec.id != futurespecs[s].id);
          }
        }

      }
      this.supplierItem.specifications.push(newSpec);
      this.updateSupplierItemWithSpec();
    }

  }
  getPreviousDay(today: Date) {
    let previousDate = new Date(today);
    previousDate.setDate(previousDate.getDate() - 1);
    return previousDate;
  }

  deleteSupplierItem() {
    let supplierItems: string[] = [];
    supplierItems.push(this.supplierItemId);
    this.supplierService.deleteSupplierItemById(this.itemId, supplierItems).subscribe(res => {
      this.toastr.success('Supplier Item has been deleted successfully!');
      this.modalService.dismissAll();
      this.router.navigate(['/all-supplier-items']);
    })
  }
  opendeleteModal(deleteModal) {
    this.open(deleteModal);
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }
  openSpecLogModal(specLogModal) {
    this.modalService.open(specLogModal, { size: 'xl' });
  }
  openNewEffectivedateModal(effectivedateModal) {
    this.openEffectiveDate(effectivedateModal);
  }
  openEffectiveDate(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }

  ApplyFilter(event) {
    event.searchData = event.searchData.slice(1);
    var searchEvent = event;
    this.getAllLogicalFacilities(searchEvent);
  }

  getAllLogicalFacilities(search) {
    var searchTerm = "&Filters=" + search.searchData + "&PageNumber=" + search.pageNumber + "&PageSize=" + search.pageSize;
    this.tpFacilityServce.getFacilityForSupplierItem(searchTerm, this.facilityId).subscribe(async data => {
      this.pagination = JSON.parse(data.headers.get('X-Pagination'));
      let viewData = await this.tpFacilityServce.GetLogicalSupplierItemCopyData(data.body);
      this.facilities = viewData;
    });
  }
  optionSelected(event) {
    this.selectedfacility = event;
  }

  copySupplierItem() {
    if (this.selectedfacility == undefined || this.selectedfacility.length == 0) {
      this.toastr.error("Atleast one record should be selected", "Error")
    }
    else {
      let facilityArray = [];
      this.selectedfacility.forEach(element => {
        facilityArray.push(element.id);
      });
      this.supplierService.copySupplerItem(this.itemId, this.supplierItemId, this.specificationId, facilityArray, this.effectiveDate).subscribe(res => {
        this.toastr.success("Supplier Items has been copied successfully");
        setTimeout(this.windowReload, 3000);
      })
    }

  }
  windowReload() {
    window.location.reload();
  }
  Cancel() {
    if (this.currentView == "edit") {
      this.router.navigate(['/item/' + this.itemId + '/supplier-item/view/' + this.supplierItemId]);
    }
    else {
      this.router.navigate(['/all-supplier-items']);
    }
  }

  selectFacilityEvent(facility) {
    this.facilityInfo = facility;
    this.facilityName = this.facilityInfo?.name;
    this.facilityId = this.facilityInfo?.id;
  }

  onChangeSearchFacility($event) {
    if ($event && $event.length >= 3) {
      this.tpFacilityServce.getAllFacilitiesInfo("?Filters=name@=*" + $event + "&PageNumber=1&PageSize=20").subscribe(res => {
        this.searchFacilities = res;
      });
    }
  }
  onFocusedFacility(e) {

  }

  selectParentItemEvent(itm) {
    this.itemInfo = itm;

    if(this.itemInfo && this.currentView==='add')
      {
        this.createSupplierItemFormGroup.get('unitsPerInnerPack').patchValue(this.itemInfo?.itemDocument?.chain_item.inner_pack_units_per_package);
        this.createSupplierItemFormGroup.get('unitsPerInnerPackUOM').patchValue(this.itemInfo?.itemDocument?.chain_item.inner_pack_units_per_package_uom);

      }
  }

  onChangeParentItem($event) {
    if ($event && $event.length >= 3) {
      this.itemService.getItemsSearch("?Filters=name@=*" + $event + "&PageNumber=1&PageSize=20").subscribe(res => {
        this.allItems = res.body;
      });
    }
  }
  onFocusedParentItem(e) {

  }
}
