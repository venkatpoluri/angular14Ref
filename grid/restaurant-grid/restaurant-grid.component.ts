import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { KeyValue } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { itemXrefModel } from 'src/app/models/dcItem';
import { Franchise } from 'src/app/models/franchise';
import { ExportService } from 'src/app/services/export.service';
import { FranchiseService } from 'src/app/services/franchise.service';
import { DistributorItemService } from 'src/app/services/items-service/distributor-item.service';
import { ItemService } from 'src/app/services/items-service/item.service';
import { SharedEventService } from 'src/app/services/shared-event.service';
import { TradingPartnerFacilityService } from 'src/app/services/trading-partner-facility.service';
import { GridViews } from '../grid-view-columns';
import * as uuid from 'uuid';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Tenant } from 'src/app/models/tenant';
import { CurrentUserService } from 'src/app/services/current-user-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter, map } from 'rxjs';

@Component({
  selector: 'app-restaurant-grid',
  templateUrl: './restaurant-grid.component.html',
  styleUrls: ['./restaurant-grid.component.scss']
})

export class RestaurantGridComponent implements OnInit, OnChanges {

  @Input() gridData: any[] = [];
  @Input() currentView: string;
  @Input() viewPath: string;
  @Input() showMenu: boolean;
  @Input() componentRouterLink: string;
  @Input() createButtonText: string;
  @Input() mouseOver: string;
  @Input() searchTerm: any[] = [];
  @Input() componentName: string;
  @Input() pagination: any;
  @Input() tenant: Tenant;
  @Input() itemXrefDetails:any;
  @Input() hideAdd:boolean=false;
  @Input() hideDelete:boolean=false;
  @Input() filterKey: string;
  @Input() filterValue: string;
  @Input() loading: boolean;
  @Input() parantComponent:string;
  @Input() parantComponentId:string;
  @ViewChild('gridViewTable') gridViewTable: ElementRef;
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onChangePageSize = new EventEmitter<object>();
  @Output() onApplyFilter = new EventEmitter<object>();
  @Output() onDeleteAll = new EventEmitter<object>();
  masterData;
  filteredData;
  selectedAll: any;
  manageSelect = "Select All";
  manageExportSelect = "Select All";

  copyGridHeader;
  copyGridData;
  dataGridData: any[] = [];
  dataGridHeader: any[] = [];
  search: any = { searchData: "", pageNumber: 1, pageSize: 10, total: 0, currentStartIndex: 0, currentEndIndex: 0 };
  headerIndexes: number[] = [];
  filters: any[] = [];
  customAttributes: any[] = [];
  dropDownCols: string[] = [];
  searchTerms = "";
  searchRow = "<td></td>";
  quickLookupData: any[] = [];
  exportCount: number;
  DeleteCount: number;
  DeleteIds: any[] = [];
  pageOffsets = 40;
  dataFranchiseCanvas: any;
  dataItemCanvas: any;
  dataFacilityCanvas: any;
  restaurantIds: any[] = [];
  userCanDeleteElements = false;
  userCanAddNewElement = false;
  userCanEditElement = false;
  tempGridData: any[] = [];
  tempDataHeader: any[] = [];
  autoCompleteItemName:string='itemNum';
  itemInfoInfo:any;
  dateFormat:string;
  isItemSelected:boolean=true;
  @ViewChild('multiUpditem') multiUpditem;
  @ViewChild('SingleUpdDititem') SingleUpdDititem;

  constructor(private offcanvasService: NgbOffcanvas, private toastr: ToastrService, private elementRef: ElementRef, private exportService: ExportService, private modalService: NgbModal, public router: Router, public franchiseeService: FranchiseService, private tradingPartnerFacilityService: TradingPartnerFacilityService,
    private fb:FormBuilder,private itemService: ItemService, private dcItemService: DistributorItemService, private sharedEventService: SharedEventService, private localStorageService: LocalStorageService, private currentUserService: CurrentUserService) {

  }
  tenant$ = this.localStorageService.tenantData$;
  tenantX: Tenant;
  XrefEditFormGroup: FormGroup;
  itemEnum: any[] = [];
  ngOnInit(): void {
    this.elementRef.nativeElement.style.setProperty('--table-width', (window.innerWidth - this.pageOffsets) + 'px');
    this.currentUserService.loadCurrentUser();
    this.currentUserService.currentUser$.subscribe(user => {
      const currentConcept = this.tenant?.conceptKey;
      for (var i = 0; i < user?.tenants.length; i++) {
        const tenant = user.tenants[i];
        if (tenant.conceptKey === currentConcept && tenant.role === "ADMIN") {
          this.userCanDeleteElements = true;
          this.userCanEditElement = true;
        }
        if (tenant.conceptKey === currentConcept && (tenant.role === "BUYER" && this.currentView !== 'ItemXref')) {
          this.userCanEditElement = true;
          this.userCanDeleteElements = true;
        }
        if (tenant.conceptKey === currentConcept && (tenant.role === "BUYER" && this.currentView == 'ItemXref')) {
          this.userCanEditElement = true;
        }
        if (tenant.conceptKey === currentConcept && (tenant.role === "ADMIN" || (tenant.role === "BUYER" && this.currentView !== 'Franchisees' && this.currentView !== 'Restaurants' && this.currentView !== 'FacilityDistributorItems'))) {
          this.userCanAddNewElement = true;
        }
        if(this.currentView=='Alignments' || this.currentView=='ItemXref'){
          this.userCanDeleteElements = false;
        }
      }
    });
    this.setupGrid();
    if (this.filterKey === "Status" || this.filterKey === "Item XRef Status") {
      this.filters = this.filters.filter(fl => { return fl['key'] !== "Status"; });
       this.filters.push({ key: this.filterKey, value: this.filterValue });
       this.searchTerms = "";
       let requestData: string;
       this.filterKey= this.filterKey.replace(/\s/g, "");;
       console.log(this.filterKey);

       requestData = this.filterKey + "==" + this.filterValue;
       this.searchTerms += requestData;
        this.search.searchData = this.searchTerms;
    }
    // this.itemService.getItems("?Filters=&PageSize="+20).subscribe((resp) => {
    //   this.itemEnum = resp.body;
    // })
    this.tenant$.subscribe(tenant => {
      this.tenant = tenant;
      this.conceptKey = this.tenant?.conceptKey;
      this.conceptId = this.tenant?.id.toString();

    });
    this.sharedEventService.dateBasedOnRegion.subscribe((resp)=>{
      this.dateFormat=resp;
    })
    this.XrefEditFormGroup = this.fb.group({
      'item':['']
    })

    this.XrefEditFormGroup.get('item').valueChanges.pipe(
      filter(res=> res.length >= 3)
      ,debounceTime(500)
    ).subscribe(text=>{
      this.itemService.getItems("?Filters=status==Active,itemNum@=" + text + "&PageNumber=1&PageSize=20").subscribe({
        next: (res) => {
          if (res) {
            this.itemEnum = res.body;
            if(this.itemEnum.length ==1){
              this.itemInfoInfo = this.itemEnum[0];
              this.itemId = this.itemEnum[0].id;
              this.itemNum=this.itemEnum[0].num;
              this.itemStatus = this.itemEnum[0].status;
              this.shortName = this.itemEnum[0].name;
              this.isBranded = this.itemEnum[0].is_Branded;
              this.isMasterCase = this.itemEnum[0].isMasterCase;
              this.gtinCase = this.itemEnum[0].gtinCase;
            }
          }
        },
        error: (e) => {
          this.itemEnum = [];
        }
      });
    }
  )}

  ngAfterViewChecked(): void {
    if (this.dataGridHeader !== undefined && this.currentView !== "users") {
      this.ShowColumns();
      if (this.pagination !== undefined) {
        this.search.total = this.pagination.totalCount;
        this.search.pageNumber = this.pagination.pageNumber;
        this.search.pageSize = this.pagination.pageSize;
        this.search.currentStartIndex = this.pagination.currentStartIndex;
        this.search.currentEndIndex = this.pagination.currentEndIndex;
      }
    }
    else if (this.dataGridHeader !== undefined) {
      this.search.total = this.gridData.length;
      this.search.currentStartIndex = this.search.total > this.search.pageSize ? this.search.pageSize : this.search.total;
    }
  }

  getViewPath(data: any, event: any, index: any) {
    var viewComponentPath: string;

    switch (this.currentView) {
      case ("Restaurants"):
        let restaurantrow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let restaurantId = this.dataGridData[index][restaurantrow];
        viewComponentPath = this.viewPath + restaurantId + "/view/info";
        event.target.parentElement.setAttribute('href', viewComponentPath);
        break;
      case ("Alignments"):
        let dcRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID")
        let dcId = this.dataGridData[index][dcRow]
        viewComponentPath = this.viewPath + dcId + "/view/info";
        event.target.parentElement.setAttribute('href', viewComponentPath);
        break;
      // case ("ItemXref"):
      //   let xRefRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID")
      //   let xRefId = this.dataGridData[index][dcRow]
      //   viewComponentPath = this.viewPath + xRefId + "/view/info";
      //   event.target.parentElement.setAttribute('href', viewComponentPath);
      //   break;
      default:
        if (this.viewPath === undefined) {

        }
        else {
          viewComponentPath = this.viewPath;
          event.target.setAttribute('href', viewComponentPath);
        }
        break;
    }

  }

  getFacilityInfoPath(index: any) {
    switch (this.currentView) {
      case ("Alignments"):
        var facilityid = "";
        var tpId = "";
        var dcNum = this.getDcNum(index);
        var searchTerm = "?Filters=num==" + dcNum;
        this.tradingPartnerFacilityService.getFacilitiesInTradingPartner(searchTerm).subscribe(res => {
          tpId = res.body[0].tradingPartnerId;
          facilityid = res.body[0].id;
          this.router.navigate(['/trading-partners/facilities/' + tpId + '/' + facilityid + '/view'])
        })
        break;
    }
  }

  getInfoPath(index: any) {
    switch (this.currentView) {
      case ("Restaurants"):
        var franchiseId = this.getFranchiseeId(index);
        this.router.navigate(['/franchise/' + franchiseId + "/view/info"]);
        break;
      case ("Alignments"):
        var franchiseId = this.getFranchiseeId(index);
        this.router.navigate(['/franchise/' + franchiseId + "/view/info"]);
        break;
      case ("ItemXref"):
        var itemNum = this.getItemName(index);

        var searchTerm = "?Filters=num==" + itemNum;
        this.itemService.getItems(searchTerm).subscribe(res => {
          if (res != null && res.body != null && res.body != undefined) {
            let itemId = res.body[0].id;
            this.router.navigate(['item/' + itemId + '/view/info'])
          }
        });

    }
  }


  getFranchiseeId(index: any) {
    let franchiseNameIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Franchisee ID");
    return this.dataGridData[index][franchiseNameIndex];
  }
  getFranchiseeName(index: any) {
    let franchiseNameIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Franchisee Name");
    return this.dataGridData[index][franchiseNameIndex];
  }
  getItemName(index: any) {
    let itemNameIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Item");
    return this.dataGridData[index][itemNameIndex];
  }
  getDcName(index: any) {
    let dcNameIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "DC Name");
    return this.dataGridData[index][dcNameIndex];
  }

  getDcNum(index: any) {
    let dcNumIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "DC Num")
    return this.dataGridData[index][dcNumIndex]
  }

  ngOnChanges(changes: SimpleChanges) {
    this.selectedAll = false;
    if (changes['gridData']?.currentValue != undefined) {
      this.gridData = changes['gridData'].currentValue;
      if (this.dataGridHeader.length > 0) {
        this.copyGridHeader = JSON.parse(JSON.stringify(this.dataGridHeader));
      }
      this.setupGrid();
      if (this.copyGridHeader != undefined && this.copyGridHeader.length > 0) {
        this.copyGridHeader.forEach(element => {
          element.searchText = "";
        });
        this.dataGridHeader = this.copyGridHeader;
      }
    }
  }
  franchiseeNameIndex: number = -1;
  dcNameIndex: number = -1;
  itemIndex: number = -1;
  setupGrid() {
    this.dataGridHeader = [];
    this.dataGridData = [];
    if (this.gridData?.length > 0) {
      this.dataGridHeader = this.gridData[0];
      this.gridData.forEach((element: any) => {
        const record = [];
        element.forEach((elements: any) => {
          record.push(elements.value);
        });
        this.dataGridData.push(record);
      });
    }
    this.masterData = this.dataGridData;


    this.setFranchiseeNameIndex();
    this.setDcNameIndex();
    this.setItemIndex();

  }
  setFranchiseeNameIndex() {
    let headerIndex = 0;
    if (this.currentView === "Restaurants" || this.currentView === 'Alignments') {
      for (let header of this.dataGridHeader) {
        if (header.headerTitle == "Franchisee Name") {
          this.franchiseeNameIndex = headerIndex;
          break;
        }
        else {
          headerIndex++;
        }
      }
    }
  }
  setDcNameIndex() {
    let headerIndex = 0;
    if (this.currentView === "Alignments" || this.currentView === "ItemXref") {
      for (let header of this.dataGridHeader) {
        if (header.headerTitle === "DC Name") {
          this.dcNameIndex = headerIndex;
          break;
        }
        else {
          headerIndex++;
        }
      }
    }
  }
  setItemIndex() {
    let headerIndex = 0;
    if (this.currentView === "ItemXref") {
      for (let header of this.dataGridHeader) {
        if (header.headerTitle === "Item") {
          this.itemIndex = headerIndex;
          break;
        }
        else {
          headerIndex++;
        }
      }
    }

  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.elementRef.nativeElement.style.setProperty('--table-width', (window.innerWidth - this.pageOffsets) + "px");
  }

  colIsDropDown(col) {
    return this.dropDownCols.includes(col);
  }
  asIsOrder(a, b) {
    return 1;
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  CheckAllOptions(event: any) {
    if (event.target.value == 'Select-All') {
      this.selectedAll = true;
    }
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      if (this.selectedAll) {
        doc.checked = true;
      }
      else {
        doc.checked = false;
      }
    }

  }
  checkIfAllSelected() {
    this.selectedDCitems = [];
    let optionChecked: boolean[] = [];
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      if (doc.checked) {
        let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let id = this.dataGridData[i][index];
        this.selectedDCitems.push(id);
      }
      optionChecked.push(doc.checked);
    }
    if (optionChecked.every(e => e)) {
      this.selectedAll = true;
    }
    else {
      this.selectedAll = false;
    }
  }

  setSearchTerm(event) {
    this.filters.forEach(element => {
      let index = this.dataGridHeader.findIndex(head => head["headerTitle"] == element.key)
      this.dataGridHeader[index]["searchText"] = element.value;
    })
    this.dataGridHeader[event.target.id]["searchText"] = event.target.value;
  }

  applyfilter(event) {
    this.searchTerms = '';
    this.filters = []
    this.dataGridHeader.forEach((element: any) => {
      let requestData = "";

      if (element.searchText !== undefined && element.searchText != "") {
        let operator = "==";
        if (element.dataType != null) {
          operator = element.dataType == 'string' ? "@=*" : "=="
        }
        requestData += "," + element.attributeName + operator + element.searchText;
        this.searchTerms += requestData;
        this.filters.push({ key: element.headerTitle, value: element.searchText })
      }
    });
    this.search.searchData = this.searchTerms;
    this.search.pageNumber = 1;
    this.onApplyFilter.emit(this.search);

  }

  FilterNew(event){
        this.filters.forEach(element => {
          let index = this.dataGridHeader.findIndex((head) => head["headerTitle"] == element.key);
          this.dataGridHeader[index]["searchText"] = element.value;
        });
        this.dataGridHeader[event.target.id]["searchText"] = event.target.value;
        this.searchTerms = '';
        this.filters = [];
        this.dataGridHeader.forEach((element: any) => {
          let requestData = "";
          if (element.searchText !== undefined && element.searchText != "") {
            let operator = "==";
            if (element.dataType != null) {
              operator = element.dataType == "string" ? "@=*" : "==";
            }
            requestData += "," + element.attributeName + operator + element.searchText;
            this.searchTerms += requestData;
            this.filters.push({ key: element.headerTitle, value: element.searchText })
          }
        });
        this.search.searchData = this.searchTerms;
        this.search.pageNumber = 1;
        this.onApplyFilter.emit(this.search);
      }

  clearFilter(event, filter, clearAll) {
    if (!clearAll) {
      this.filters = this.filters.filter(fl => { return fl['key'] !== filter['key']; });
      if (this.filters.length === 0) {
        this.filters = [];
        this.searchTerms = "";
        this.search.searchData = "";
        this.search.pageNumber = 1;
        this.onApplyFilter.emit(this.search);
      } else {
        this.filters.forEach(data => {
          this.dataGridHeader.find(fl => { fl['headerTitle'] === data.key ? fl['searchText'] = data.value : fl['searchText'] = fl['searchText'] });
        });
        this.searchTerms = "";
        this.dataGridHeader.forEach((element: any) => {
          let requestData: string;
          if (element.searchText !== undefined && element.searchText != "") {
            let operator = '=='
            if (element.dataType != null) {
              operator = element.dataType == 'string' ? "@=*" : "=="
            }
            requestData = "," + element.attributeName + operator + element.searchText;
            this.searchTerms += requestData;
          }
        });
        this.search.searchData = this.searchTerms;
        this.search.pageNumber = 1;
        this.onApplyFilter.emit(this.search);
      }
    }
    else {
      this.filters = [];
      this.searchTerms = "";
      this.search.searchData = "";
      this.search.pageNumber = 1;
      this.onApplyFilter.emit(this.search);
    }
  }
  resetFilters() {
    this.filters = [];
    for (const k in this.search) {
      const v = this.search[k];
      if (v !== "" && v !== undefined && k !== "pageNumber" && k !== "total" && k !== "pageSize") {
        this.search[k] = "";
      }
    }
  }
  changePageSize() {
    if (this.currentView !== "users") {
      this.search.pageNumber = 1;
      this.onApplyFilter.emit(this.search);
    }
  }

  pageChangeEvent(event: number) {
    if (this.currentView !== "users") {
      this.search.pageNumber = event;
      this.onApplyFilter.emit(this.search);
    }
  }

  openEnd(content: TemplateRef<any>) {
    this.tempDataHeader = JSON.parse(JSON.stringify(this.dataGridHeader));
    this.tempGridData = JSON.parse(JSON.stringify(this.dataGridData));
    this.offcanvasService.open(content, { position: 'end', backdrop: true, keyboard: false });
  }

  openEndQuickLookUp(quickLookupContent: TemplateRef<any>, data: any) {
    this.quickLookupData = data;
    this.offcanvasService.open(quickLookupContent, { position: 'end' });
  }

  ManageColumnData() {
    this.tempGridData= this.dataGridData;
    this.tempDataHeader = this.dataGridHeader;
    this.offcanvasService.dismiss('Cross click');
  }

  CloseQuickLookUp() {
    this.offcanvasService.dismiss('Cross click');
  }

  deleteRows(deleteRecords) {
    let deleteCount = 0;
    this.DeleteIds = [];
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      if (doc.checked) {
        let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let id = this.dataGridData[i][index];
        this.DeleteIds.push(id);
        deleteCount++;
      }
    }
    this.DeleteCount = deleteCount;
    if (this.DeleteCount > 0) {
      this.openDelete(deleteRecords);
    }
    else {
      this.toastr.error("Atleast one records should be selected", "Error")
    }
  }

  openDelete(deleteRecords) {
    this.modalService.open(deleteRecords, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }

  DeleteAllRecords() {
    this.onDeleteAll.emit(this.DeleteIds);
    this.close();
  }

  close() {
    this.modalService.dismissAll();
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tempDataHeader, event.previousIndex, event.currentIndex);
    this.tempGridData.forEach(p => {
      moveItemInArray(p, event.previousIndex, event.currentIndex);
    });
    this.setFranchiseeNameIndex();
    this.setDcNameIndex();
    this.setItemIndex();
  }

  getArray(data) {
    return data as Array<any>;
  }

  UpdateColumn() {
    this.dataGridHeader = this.tempDataHeader
    this.dataGridData = this.tempGridData
    if (this.dataGridHeader.some(x => x.isShow)) {
      for (let i = 0; i < this.dataGridHeader.length; i++) {
        var ck = document.getElementsByClassName("cl" + i);
        if (!this.dataGridHeader[i].isShow) {
          var doc = document.getElementById("cl" + i);
          doc.classList.add("display-none");
          for (let i = 0; i < ck.length; i++) {
            ck[i].classList.add("display-none");
          }
        }
        else {
          var doc = document.getElementById("cl" + i);
          doc.classList.remove("display-none");
          for (let i = 0; i < ck.length; i++) {
            ck[i].classList.remove("display-none");
          }
        }
      }
      this.offcanvasService.dismiss('Cross click');
    }
    else {
      this.toastr.error("Atleast one column should be selected", "Error")
    }
  }

  ShowColumns() {
    if (this.dataGridHeader.some(x => x.isShow)) {
      for (let i = 0; i < this.dataGridHeader.length; i++) {
        var ck = document.getElementsByClassName("cl" + i);
        if (!this.dataGridHeader[i].isShow) {
          var doc = document.getElementById("cl" + i);
          doc.classList.add("display-none");
          for (let i = 0; i < ck.length; i++) {
            ck[i].classList.add("display-none");
          }
        }
        else {
          var doc = document.getElementById("cl" + i);
          doc.classList.remove("display-none");
          for (let i = 0; i < ck.length; i++) {
            ck[i].classList.remove("display-none");
          }
        }
      }
    }
  }

  manageSelectAll() {
    if (this.manageSelect === "Select All") {
      this.tempDataHeader.forEach(element => {
        element.isShow = true;
      });
      this.manageSelect = "Deselect All"
    } else {
      this.tempDataHeader.forEach(element => {
        element.isShow = false;
      });
      this.manageSelect = "Select All"
    }
    if (this.manageSelect === "Select All") {
      this.toastr.error("Atleast one column should be selected", "Error")
    }
  }

  openExport(exportDataContext: TemplateRef<any>) {
    this.offcanvasService.open(exportDataContext, { position: 'end' });
    this.dataGridHeader.forEach((element: any) => {
      element['isExport'] = element.isShow;
    });
    this.exportCount = this.dataGridHeader.filter(x => x.isExport).length;
  }

  openFranchiseeCanvas(franchiseeDataContext: TemplateRef<any>, index: any) {
    var franchiseeName = this.getFranchiseeName(index);
    var searchTerm = "?Filters=name@=*" + franchiseeName.trim()
    this.franchiseeService.getAllLogicalFranchisees(searchTerm).subscribe(res => {
      if (res != null && res.body != null && res.body != undefined)
        this.dataFranchiseCanvas = res.body[0];
    });

    this.offcanvasService.open(franchiseeDataContext, { position: 'end' });
  }
  openItemCanvas(itemDataContext: TemplateRef<any>, index: any) {
    var itemName = this.getItemName(index);
    var searchTerm = "?Filters=num==" + itemName;
    this.itemService.getItems(searchTerm).subscribe(res => {
      if (res != null && res.body != null && res.body != undefined)
        this.dataItemCanvas = res.body[0];
    });
    this.offcanvasService.open(itemDataContext, { position: 'end' });
  }
  openDcNameCanvas(itemDataContext: TemplateRef<any>, index: any) {
    var dcName = this.getDcName(index);
    var searchTerm = "?Filters=dcName@=*" + dcName.trim();
    this.itemService.getItems(searchTerm).subscribe(res => {
      if (res != null && res.body != null && res.body != undefined)
        this.dataItemCanvas = res.body[0];
    });
    this.offcanvasService.open(itemDataContext, { position: 'end' });
  }
  openFacilityCanvas(facilityDataContext: TemplateRef<any>, index) {
    var dcNum = this.getDcNum(index);
    var searchTerm = "?Filters=num==" + dcNum;
    this.tradingPartnerFacilityService.getFacilitiesInTradingPartner(searchTerm).subscribe(res => {
      this.dataFacilityCanvas = res.body;
    })
    this.offcanvasService.open(facilityDataContext, { position: 'end' })
  }
  openAlignmentCanvas(alignmentContext: TemplateRef<any>) {
    let count = 0;
    this.restaurantIds = [];
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      if (doc.checked) {
        let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let id = this.dataGridData[i][index];
        this.restaurantIds.push(id);
        count++;
      }
    }
    if (count >= 1) {
      this.offcanvasService.open(alignmentContext, { position: 'end' });
    }
    else {
      this.toastr.error('Select Atleast One Record', 'Error')
    }
  }


  ExportData() {
    this.filters.forEach(element => {
      let index = this.dataGridHeader.findIndex((head) => head["headerTitle"] == element.key);
      this.dataGridHeader[index]["searchText"] = element.value;
    });
    let searchTerm='';
    if(this.parantComponent == 'Date'){
      searchTerm=`?alignDate=${this.parantComponentId}&Filters=`
    }else if(this.parantComponent == 'RestaurantID'){
      searchTerm= `?id=${this.parantComponentId}&Filters=`
    }
    else{
      searchTerm='?Filters=';
    }
    this.dataGridHeader.forEach((element: any) => {
      let requestData = "";
      if (element.searchText !== undefined && element.searchText != "") {
        let operator = "==";
        if (element.dataType != null) {
          operator = element.dataType == "string" ? "@=*" : "==";
        }
        requestData += "," + element.attributeName + operator + element.searchText;
        searchTerm += requestData;
      }
    });
    const list = document.getElementById('export-cols-list');
    const inps = list.getElementsByTagName('input');
    const expCols=[];
    for(var i=0;i< inps?.length;i++){
      const input = inps[i];
      if(input.checked){
        expCols.push(input.name);
      }
    }
    if (expCols.length > 0) {
      this.exportService.exportGridData(expCols,this.currentView, searchTerm, this.parantComponent);
      this.offcanvasService.dismiss('Cross click');
    } else {
      this.toastr.error("Atleast one column should be selected", "Error")
    }
  }

  exportElmToExcel(): void {
    this.exportService.exportTableElmToExcel(this.gridViewTable, this.componentName + 'GridData');
    location.reload();
  }

  canExport(header) {
    header.isExport = !header.isExport;
    this.exportCount = this.dataGridHeader.filter(x => x.isExport).length;
  }
  manageExportSelectAll() {
    if (this.manageExportSelect === "Select All") {
      this.dataGridHeader.forEach(element => {
        element.isExport = true;
      });
      this.manageExportSelect = "Deselect All";
      this.exportCount = this.dataGridHeader.filter(x => x.isExport).length;
    } else {
      this.dataGridHeader.forEach(element => {
        element.isExport = false;
      });
      this.manageExportSelect = "Select All";
      this.exportCount = this.dataGridHeader.filter(x => x.isExport).length;
    }
    if (this.manageExportSelect === "Select All") {
      this.toastr.error("Atleast one column should be selected", "Error")
    }
  }

  getSelectValues(col) {
    if (col === "roles") {
      return this.roles;
    } else if (col === "department") {
      return this.departments
    } else if (col === "active") {
      return ['Yes', 'No'];
    }
    return [];
  }
  departments = ['Communications',
    'Finance', 'Food & Packaging', 'Human Resources', 'Information Technology', 'Logistics', 'PPIM'];
  roles = ['ADMIN', 'BUYER', 'GUEST'];

  dismissItemXref() {
    this.close()
  }

  openEditOv(ove: TemplateRef<any>) {
    this.offcanvasService.open(ove, { position: 'end' });
  }

  itemXref: itemXrefModel = {
    id: '',
    dcItemId: '',
    dcItemName: '',
    dcName: '',
    proposedDcItemDescription: '',
    proposedDcItemChainBranded: true,
    proposedDcItemNum: '',
    proposedDcItemGtin: '',
    proposedDcItemUom: '',
    itemNum: 0,
    itemDescription: '',
    itemXrefStatus: '',
    previousItemXRefStatus: '',
    lastLoadedDate: null,
    lastLoadedOn: null,
    lastLoadedBy: '',
    comments: [{
      id: '',
      comment: '',
    }],
    dcItem: '',
    num: 8,
    fileLogId: 0,
    createdOn: null,
    createdBy: '',
    isDeleted: false,
    domainEvents: [],
  };
  itemStatus: string;
  statusXref = ["New", "DC Priority", "DC Follow up", "Processed", "Updated"];
  selectedDCitem: any;
  selectedDCitems = [];
  selectedXref={
    id:'',
    dcItemName:'',
    dcItemNum:'',
    itemNum:null,
    proposedDcItemNum:'',
    dcName:'',
    previousItemXRefStatus:'',
    itemDescription:'',
    proposedDcItemChainBranded:'',
    proposedDcItemDescription:'',
    proposedDcItemGtin:'',
    proposedDcItemUom:'',
    lastLoadedBy:'',
    lastLoadedDate:'',
    lastLoadedOn:'',
    dcItemId:'',
    itemXrefStatus:'',
    comments:[]
  };
  reversedComment=[];
  xrefId: string = "";
  initialValue: string;
  itemXrefEdit() {
    this.itemId = '';
    this.itemNum='';
    this.itemStatus = '';
    this.shortName = '';
    this.isBranded = '';
    this.gtinCase = '';
    this.isMasterCase = null;
    this.selectedDCitems = [];
    this.reversedComment=[];
    let count = 0;
    let dcNameLocal;
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      if (doc.checked) {
        this.selectedXref=this.itemXrefDetails[i];
        console.log(this.selectedXref);
        this.itemEnum.push({num:this.selectedXref.itemNum.toString(), itemNum:this.selectedXref.itemNum.toString()})
        this.XrefEditFormGroup.get('item').setValue(this.selectedXref.itemNum.toString());


        this.changeSetObject.itemXrefStatus.status = this.selectedXref.itemXrefStatus;
        // this.selectedXref.comments.filter(el=> el.comment !='')
        if(this.selectedXref.comments?.length>0){

          this.reversedComment = this.selectedXref.comments.reverse();
        }
        let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let dcItemIdindex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Dc Item ID");
        let nameIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle == "DC Name");
        let id = this.dataGridData[i][index];
        let decItemId= this.dataGridData[i][dcItemIdindex];
        dcNameLocal = this.dataGridData[i][nameIndex]
        this.selectedDCitems.push(decItemId)
        this.xrefId = id;
        count++;
      }
    }
    if(this.selectedDCitems.length != 1){
      this.toastr.error('Please select one item to update');
    }


  }
  xrefDropStatus: string = "";
  shortName: string='';
  isBranded: string='';
  gtinCase: string='';
  isMasterCase: boolean;
  itemId:string;
  itemNum;
  changeSetObject ={
    changesetIds: [],
    itemXrefStatus: {
      id: uuid.v4(),
      status: "",
      from_date: new Date(Date.now()),
      thru_date: null
    },
    comments: {
      id: uuid.v4(),
      comment: ''
    }
  }

  changeItem(event) {
    this.itemId = event.target.value;

    this.itemNum=this.itemEnum.filter(item=>item.id == this.itemId)[0].num
    let item;
    item = this.itemEnum.filter(element => {
      return element.id == this.xrefDropStatus
    })[0]
    this.itemStatus = item.status
    this.shortName = item.description;
    this.isBranded = item.is_Branded;
    this.gtinCase = item.gtinCase;
    this.isMasterCase = item.isMasterCase;
  }
  conceptKey: string;
  conceptId: string;
  updateChangeSet() {
    if(this.changeSetObject.comments.comment == ''){
      this.changeSetObject.comments=null;
    }
    let updatedDCitem = {
      conceptId: this.conceptId,
      conceptKey: this.conceptKey,
      itemId: this.itemInfoInfo.id
    }

    this.dcItemService.UpdateItemIdForMultipleDcItemIds(this.itemInfoInfo.id, [this.selectedXref.dcItemId]).subscribe((resp) => {
      this.changeSetObject.changesetIds= [this.selectedXref?.id];
      this.itemService.UpdateMultipleChangesets(this.changeSetObject).subscribe((resp) => {
        this.toastr.success('Changesets Updated', 'Success');
        setTimeout(() => { window.location.reload() }, 2000)
      })
    })
  }

  selectNum: any;
  multiUpdateNum = [];
  selectedItem: any;
  selectedXrefIds=[]
  getDataMultiUpdate() {
    this.selectedXrefIds=[];
    this.itemService.getItems('?PageNumber=1&PageSize=20').subscribe((resp) => {
      this.multiUpdateNum = resp.body
    })
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      if(doc.checked) {
        this.selectedXrefIds.push(this.itemXrefDetails[i].dcItemId);
      }
    }
    if(this.selectedXrefIds.length < 1){
      this.toastr.error('Please select atleast one item to update');
    }
  }
  selectingValueMulti() {
    this.selectedItem = this.multiUpdateNum.find((mun) => {
      return mun.num == this.selectNum
    })
  }

  statusOfChangeSet: string = ""
  commentsOfChangeSet: string = "";
  multiUpdateChangeSet() {
    this.dcItemService.UpdateItemIdForMultipleDcItemIds(this.itemInfoInfo.id, this.selectedXrefIds).subscribe((resp) => {
      let changeSetObject = {
        changesetIds: this.selectedDCitems,
        itemXrefStatus: {
          id: uuid.v4(),
          status: this.statusOfChangeSet,
          from_date: new Date().toISOString(),
          thru_date: null
        },
        comments: {
          id: uuid.v4(),
          comment: this.commentsOfChangeSet
        }
      }
      this.itemService.UpdateMultipleChangesets(changeSetObject).subscribe((resp) => {
        this.toastr.success(`${this.selectedDCitems.length} items updated`, 'Success');
        setTimeout(() => { window.location.reload() }, 2000)
      });
    })
  }
  selectItemEvent(itm) {

    this.itemInfoInfo = itm;
    this.selectedItem=itm;
    this.itemId = this.itemInfoInfo.id;
    this.itemNum=this.itemInfoInfo.num;
    this.itemStatus = this.itemInfoInfo.status
    this.shortName = this.itemInfoInfo.name;
    this.isBranded = this.itemInfoInfo.is_Branded;
    this.gtinCase = this.itemInfoInfo.gtinCase;
    this.isMasterCase = this.itemInfoInfo.isMasterCase;
  }
//Filters=num==" +
//Filters=name@=*"
setItemValue(event){
  this.itemInfoInfo = event;
    this.itemId = event.id;
    this.itemNum=event.num;
    this.itemStatus = event.status
    this.shortName = event.name;
    this.isBranded = event.is_Branded;
    this.gtinCase = event.gtinCase;
    this.isMasterCase = event.isMasterCase;

  }
  onChangeSearchItem($event) {
    if ($event && $event.length >= 3) {
      this.itemService.getItems("?Filters=status==Active,itemNum@=" + $event + "&PageNumber=1&PageSize=20").subscribe({
        next: (res) => {
          if (res) {
            this.itemEnum = res.body;
          }
        },
        error: (e) => {
          this.itemEnum = [];
        }
      });
    }
  }
  onFocusedItem(e) {

  }

  CancelUpdate()
  {
    this.itemEnum=[];
    this.SingleUpdDititem.clear();
    this.multiUpditem.clear();
    this.selectedItem= {};
    this.statusOfChangeSet="";
    this.shortName="";
    this.commentsOfChangeSet="";
    this.itemStatus="";
    this.changeSetObject ={
      changesetIds: [],
      itemXrefStatus: {
        id: uuid.v4(),
        status: "",
        from_date: new Date(Date.now()),
        thru_date: null
      },
      comments: {
        id: uuid.v4(),
        comment: ''
      }
    }
  }
}


