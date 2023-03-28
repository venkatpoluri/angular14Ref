import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { KeyValue } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { TradingPartnerDto } from '../../models/trading-partner';
import { TradingPartnerService } from '../../services/trading-partner.service';
import { ToastrService } from 'ngx-toastr';
import { GridViews } from './grid-view-columns';
import { Tenant } from '../../models/tenant';
import * as moment from 'moment';
import { ExportService } from 'src/app/services/export.service';
import { ItemAssociation } from 'src/app/models/item';
import { MenuItemService } from 'src/app/services/items-service/menu-item.service';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from 'src/app/services/current-user-service';
import * as uuid from 'uuid';
import { baseMarkup } from 'src/app/models/baseMarkup';
import { SharedEventService } from 'src/app/services/shared-event.service';
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

export class GridComponent implements OnInit, OnChanges {
  @Input() isSearchUI: boolean;
  @Input() gridData: any[] = [];
  @Input() currentView: string;
  @Input() filterKey: string;
  @Input() filterValue: string;
  @Input() viewPath: string;
  @Input() tenant: Tenant;
  @Input() showMenu: boolean;
  @Input() componentRouterLink: string;
  @Input() createButtonText: string;
  @Input() mouseOver: string;
  @Input() searchTerm: any[] = [];
  @Input() componentName: string;
  @Input() pagination: any;
  @Input() loading: boolean;
  @Input() associatedItems: any[] = [];
  @Input() itemId: string;
  @Input() parentitemId: string;
  @Input() currentNode: any;
  @Input() currentNodeName: string;
  @Input() classificationType: string;
  @Input() extend:boolean = false;
  @Input() hideAdd:boolean = false;
  @Input() hideDelete:boolean = false;
  @Input() baseMarkUp;
  @Input() parentFilter = null;
  @Input() parantComponent = '';
  @Input() parantComponentId;
  @ViewChild('gridViewTable') gridViewTable: ElementRef;
  @ViewChild('errorModal', { static: false }) private errorModal;
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onChangePageSize = new EventEmitter<object>();
  @Output() onApplyFilter = new EventEmitter<object>();
  @Output() onDeleteAll = new EventEmitter<object>();
  @Output() optionSelected = new EventEmitter<any>();
  @Output() onExtend = new EventEmitter<any>();
  @Output() addItemsToHeirarchy = new EventEmitter<any>();
  createErrors = [];
  masterData;
  filteredData;
  selectedAll: any;
  manageSelect = "Select All";
  manageExportSelect = "Select All";
  restaurantIds: any[] = [];
  menuItemId: string;
  facility: any[];
  showListDropFranchise: boolean;
  editBaseMarkUp;

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
  pageOffsets = 60;
  tableWidth = 100;
  multipleItemIds: any[];
  userCanDeleteElements = false;
  userCanEditElements = false;
  userCanAddNewElement = false;
  buildItemArray: any;
  tempGridData: any[] = [];
  tempDataHeader: any[] = [];
  isOpenMultiUpdateSupplierItems: boolean = true;
  isOpenMultiUpdateItems: boolean = true;
  baseMarkupInfo:baseMarkup;
  baseMarkUpId:string;
  isOpenMenuItemBuildEdit:boolean=true;
  uri:string;
  dateFormat:string;
  currentViewForMarkups;
  constructor(private service: TradingPartnerService, private offcanvasService: NgbOffcanvas, private menuItemSerivce: MenuItemService, private route: ActivatedRoute,
    private toastr: ToastrService, private elementRef: ElementRef, private exportService: ExportService, private modalService: NgbModal, private currentUserService: CurrentUserService,private sharedEventService:SharedEventService) {

  }

  ngOnInit(): void {
    this.sharedEventService.dateBasedOnRegion.subscribe((resp)=>{this.dateFormat=resp; })
    this.uri = window.location.href;
    this.tableWidth = window.innerWidth - this.pageOffsets;
    this.elementRef.nativeElement.style.setProperty('--table-width', this.tableWidth + 'px');
    this.elementRef.nativeElement.style.setProperty('--initial-table-width', this.tableWidth + 'px');
    this.currentUserService.loadCurrentUser();
    this.currentUserService.currentUser$.subscribe(user => {
      const currentConcept = this.tenant?.conceptKey;
      for (var i = 0; i < user?.tenants.length; i++) {
        const tenant = user.tenants[i];
        if (tenant.conceptKey === currentConcept && (tenant.role === "ADMIN" || tenant.role === "BUYER")) {
          this.userCanDeleteElements = true;
        }
        if (tenant.conceptKey === currentConcept && (this.currentView == 'Restaurants' && tenant.role === "BUYER")) {
          this.userCanEditElements = true;
        }
        if (tenant.conceptKey === currentConcept && (tenant.role === "ADMIN" || (tenant.role === "BUYER" && this.currentView !== 'Franchisees' && this.currentView !== 'Restaurants' && this.currentView !== 'FacilityDistributorItems'))) {
          this.userCanAddNewElement = true;
          this.userCanEditElements = true;
        }
        if(this.currentView=='FacilityDistributorItems'){
          this.userCanDeleteElements = false;
        }
      }
    });
    this.setupGrid();
    if (this.filterKey === "Status"|| this.filterKey ==='Item Status') {
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
    this.menuItemId = this.route.snapshot.parent.params['menuItemId'];
    this.sharedEventService.dateBasedOnRegion.subscribe((resp)=>{
      this.dateFormat=resp;
    })
  }

  setItemIds() {
    this.isOpenMultiUpdateSupplierItems = true;
    this.isOpenMultiUpdateItems = true;
    this.multipleItemIds = [];
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      if (doc.checked) {
        if (this.currentView == "FacilitySupplierItems") {
          let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
          let ItemIdindex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Item Id");
          let SupplierItemId = this.dataGridData[i][index];
          let ItemId = this.dataGridData[i][ItemIdindex];
          this.multipleItemIds.push({ SupplierItemId, ItemId });
        }
        else {

          let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
          let id = this.dataGridData[i][index];
          this.multipleItemIds.push(id);
        }
      }
    }

    if (this.multipleItemIds && this.multipleItemIds.length > 0) {
      this.isOpenMultiUpdateSupplierItems = true;
      this.isOpenMultiUpdateItems = true;
      // open the canvas

    }
    else {
      if (this.currentView == "FacilitySupplierItems") {
        this.toastr.error('Atleast one Supplier Item should be selected.');
        this.isOpenMultiUpdateSupplierItems = false;
      }
      else if (this.currentView == "Items") {
        this.toastr.error('Atleast one Item should be selected.');
        this.isOpenMultiUpdateItems = false;
      }
      else {

      }

    }

  }
  openAlignmentCanvas(alignmentContext: TemplateRef<any>) {
    this.restaurantIds = [];
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      if (doc.checked) {
        let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let id = this.dataGridData[i][index];
        this.restaurantIds.push(id);
      }
    }
    this.offcanvasService.open(alignmentContext, { position: 'end' });
  }
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
    if (this.currentView == "users") {
      this.search.total = this.dataGridData.length;
      this.search.currentStartIndex = this.search.total > this.search.pageSize ? this.search.pageSize : this.search.total;
    }
  }

  getViewPath(data: any, event: any, index: any) {
    var viewComponentPath: string;
    console.log('user ', this.tenant);
    switch (this.currentView) {
      case ("users"):
        viewComponentPath = this.viewPath + "/" + data.username + "/" + this.tenant.conceptKey;
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("TradingPartners"):
        let partneridrow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let tradingParnterid = this.dataGridData[index][partneridrow];
        viewComponentPath = this.viewPath + "/view/" + tradingParnterid + "/info";
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("Facilities"):
        let facilityidrow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let partnerIdrow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Trading Partner ID");
        let facilityId = this.dataGridData[index][facilityidrow];
        let partnerId = this.dataGridData[index][partnerIdrow];
        viewComponentPath = this.viewPath + "/facilities/" + partnerId + "/" + facilityId + "/view";
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("SupplyAgreements"):
        let supplyagreementidrow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let supplyAgreementId = this.dataGridData[index][supplyagreementidrow];
        viewComponentPath = this.viewPath + "/supply-agreements/" + supplyAgreementId + "/view";
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("Contacts"):
        let contactidrow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let contactId = this.dataGridData[index][contactidrow];
        viewComponentPath = this.viewPath + "/contact/view/" + contactId;
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("Amendments"):
        let amendmentIdRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let amendmentsupplyAgreementRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Supply Agreement ID");
        let amendmentRowId = this.dataGridData[index][amendmentIdRow];
        let amendmentsupplyAgreementId = this.dataGridData[index][amendmentsupplyAgreementRow];
        viewComponentPath = this.viewPath + "/supply-agreement-amendment/" + amendmentsupplyAgreementId + "/view/" + amendmentRowId;
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("Franchisees"):
        let franchiserow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let franchiseId = this.dataGridData[index][franchiserow];
        viewComponentPath = this.viewPath + franchiseId + "/view/info";
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("Restaurants"):
        let restaurantIdRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let restaurantId = this.dataGridData[index][restaurantIdRow];
        viewComponentPath = this.viewPath + "/restaurant/" + restaurantId + "/view/info";
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("Items"):
        let itemIdRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let itemId = this.dataGridData[index][itemIdRow];
        viewComponentPath = this.viewPath + itemId + "/view/info";
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("MenuItems"):
        let menuItemIdRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let menuItemId = this.dataGridData[index][menuItemIdRow];
        viewComponentPath = this.viewPath + "/view/" + menuItemId + "/info";
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("Hierarchies"):
        let hierarchyIdRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let hierarchyId = this.dataGridData[index][hierarchyIdRow];
        viewComponentPath = this.viewPath + "/view/" + hierarchyId + "/info";
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("ExchangeRates"):
        let exchangeRatesIdRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let exchangeRatesId = this.dataGridData[index][exchangeRatesIdRow];
        viewComponentPath = this.viewPath + "/view/" + exchangeRatesId;
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("FacilitySupplierItems"):
        let supplierItemIdRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let parentItemIdRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Item Id");
        let supplierItemId = this.dataGridData[index][supplierItemIdRow];
        let parentItemId = this.dataGridData[index][parentItemIdRow];
        viewComponentPath = this.viewPath + "/" + parentItemId + "/supplier-item/view/" + supplierItemId;
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("FacilityDistributorItems"):
        let distributorItemIdRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let distributorItemId = this.dataGridData[index][distributorItemIdRow];
        viewComponentPath = this.viewPath + "/view/" + distributorItemId;
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("childItems"):
          let childItemIdRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
          let childparentItemIdRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Item Id");
          let childItemId = this.dataGridData[index][childItemIdRow];
          let childparentItemId = this.dataGridData[index][childparentItemIdRow];
          viewComponentPath = this.viewPath + "/" + childparentItemId + "/child-item/view/" + childItemId;
          event.target.setAttribute('href', viewComponentPath);
          break;
      case ("PricingComponent"):
          let pricingComponentIdRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
          let pricingComponentId = this.dataGridData[index][pricingComponentIdRow];
          viewComponentPath = this.viewPath + "/" + pricingComponentId + "/view" ;
          event.target.setAttribute('href', viewComponentPath);
          break;
          case ("itemSupplyagreementView"):
            let itemSupplyagreementidrow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
            let itemsupplyAgreementId = this.dataGridData[index][itemSupplyagreementidrow];
            viewComponentPath = this.viewPath + "/supply-agreements/" + itemsupplyAgreementId + "/view";
            event.target.setAttribute('href', viewComponentPath);
            break;
            case ("supplyagrItmview"):
              let supplyagreementItemidrow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
              let supplyAgreementIditemId = this.dataGridData[index][supplyagreementItemidrow];
              viewComponentPath = this.viewPath  + "/"  + supplyAgreementIditemId + "/view/info";
              event.target.setAttribute('href', viewComponentPath);
              break;
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
  ngOnChanges(changes: SimpleChanges) {
    this.selectedAll = false;
    this.setupGrid();

    // check to make sure currentValue is defined. Updates from other rxjs subjects cause this method to fire
    // and currentValue won't always be defined. The check to get the current concept makes this method fire.
    if (changes['gridData']?.currentValue !== undefined) {
      this.gridData = changes['gridData'].currentValue;
      if (this.dataGridHeader.length > 0) {
        this.copyGridHeader = JSON.parse(JSON.stringify(this.dataGridHeader));
      }
      this.setupGrid();
      if (this.copyGridHeader != undefined && this.copyGridHeader.length > 0) {
        this.copyGridHeader.forEach(element => {
          if (
            typeof element === 'object' &&
            !Array.isArray(element) &&
            element !== null) {
            element.searchText = "";
          }
        });
        // this.dataGridHeader = this.copyGridHeader;
      }
    }
  }

  setupGrid() {
    this.dataGridHeader = [];
    this.dataGridData = [];
    if (this.currentView === "users") {
      if(this.isSearchUI){
        this.dataGridHeader = this.gridData[0].header;
        this.dataGridData = this.gridData[0].data;
        this.dataGridHeader.forEach(element => {
          this.search[element] = "";
        });
      }
      else{
        for (var j = 0; j < GridViews.users.length; j++) {
          this.dataGridHeader.push(GridViews.users[j]['column']);
        }
        this.gridData.forEach((element: any) => {
          const rowData = {};
          let name = "";
          let roles: any[] = [];
          rowData["username"] = element.username;
          rowData["created on"] = moment(element.userCreateDate).format('YYYY-MM-DD');
          const isActive = element.enabled;
          const attrs = element["attributes"];

          for (let i = 0; i < attrs.length; i++) {
            if (attrs[i].name === "given_name") {
              name += attrs[i].value;
              let familyName = attrs.find(key => {
                return key.name === "family_name";
              });
              name += ' ' + familyName?.value;
            } else if (attrs[i].name.includes("custom:tenant")) {
              let tenantName = attrs[i].name.replace("custom:tenant:", "")
              tenantName = tenantName.replace(":roles", "");
              roles.push({ tenant: tenantName, roles: attrs[i].value });
            }
            const exists = (Object.keys(GridViews.users)).find((key) => {
              return GridViews.users[key].column === attrs[i].name || GridViews.users[key].attributeName == attrs[i].name || attrs[i].name.includes("custom:tenant:");
            });
            if (exists) {
              if (attrs[i].name == "given_name") {
                rowData["name"] = name;
              } else if (attrs[i].name.includes("custom:tenant:")) {
                rowData["roles"] = roles;
              } else if (attrs[i].name.includes("custom:department")) {
                rowData["department"] = attrs[i].value;
              } else {
                rowData[attrs[i].name] = attrs[i].value;
              }
            }
          }
          rowData["active"] = isActive ? "Yes" : "No";
          this.dataGridData.push(rowData);
          const allData = [];
          for (var i = 0; i < this.dataGridData.length; i++) {
            const obj = { username: this.dataGridData[i]['username'] };
            for (var j = 0; j < GridViews.users.length; j++) {
              obj[GridViews.users[j]['column']] = this.dataGridData[i][GridViews.users[j]['column']];
              if (i === 0) {

                if (GridViews.users[j]['type'] === "dropdown") {
                  this.dropDownCols.push(GridViews.users[j]['column']);
                }
              }
            }
            allData.push(obj);
          }
          this.dataGridData = allData;

        });
        for (let i = 0; i < this.dataGridHeader.length; i++) {
          this.dataGridHeader[i] = this.dataGridHeader[i].charAt(0).toUpperCase() + this.dataGridHeader[i].slice(1);
        }
        this.dataGridHeader.forEach(element => {
          this.search[element] = "";
        });
      }
    }
    else if (this.gridData?.length > 0) {
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
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.tableWidth = window.innerWidth - this.pageOffsets;
    this.elementRef.nativeElement.style.setProperty('--table-width', this.tableWidth + "px");
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
    if (this.currentView == "supplierItemInfo") {
      this.checkIfAllSelected();
    }
  }
  checkIfAllSelected() {
    let optionChecked: boolean[] = [];
    this.facility = [];
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      optionChecked.push(doc.checked);
      if (doc.checked && this.currentView === "FacilitySupplierItems") {
        this.isOpenMultiUpdateSupplierItems = true;
      }

      if (doc.checked && this.currentView === "Items") {
        this.isOpenMultiUpdateItems = true;
      }

      if (this.currentView == "supplierItemInfo") {
        if (doc.checked) {
          let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
          let id = this.dataGridData[i][index];
          let nameIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Name");
          let name = this.dataGridData[i][nameIndex];
          this.facility.push({ id, name });
          this.optionSelected.emit(this.facility);
          this.isOpenMultiUpdateSupplierItems = true;
        }
      }
    }

    if (optionChecked.every(e => e)) {
      this.selectedAll = true;
    }
    else {
      this.selectedAll = false;
    }
  }

  setSearchTerm(event) {
    if (this.currentView === "users") {
      if (event.target.value.toLowerCase() === "select") {
        this.search[event.target.id] = "";
        this.clearFilter(event, { key: event.target.id }, false);
      } else {
        this.search[event.target.id] = event.target.value;
      }
    }
    else {
      this.filters.forEach(element => {
        let index = this.dataGridHeader.findIndex((head) => head["headerTitle"] == element.key);
        this.dataGridHeader[index]["searchText"] = element.value;
      });
      this.dataGridHeader[event.target.id]["searchText"] = event.target.value;
    }
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
  applyfilter(event) {
    if (this.currentView === "users") {
      for (const k in this.search) {
        const v = this.search[k];
        for (var i = 0; i < this.filters.length; i++) {
          if (this.filters[i]['key'] === k) {
            if (this.filters[i]['value'] !== v) {
              this.clearFilter(event, this.filters[i], false);
              this.filters[i] = { key: k, value: v };
            }
          }
        }
        const keyTest = this.filters.filter(ele => ele['key'] === k && ele['value'] === v);

        if (v !== "" && v !== undefined && k !== "pageNumber" && k !== "total" && k !== "pageSize" && k !== "currentStartIndex" && k !== "currentEndIndex" && keyTest.length === 0) {
          this.filters.push({ key: k, value: v });
          console.log(this.filters);
        }
      }

      this.filters.forEach(filter => {
        let results = this.dataGridData.filter(ele => {
          if (ele[filter['key']] !== undefined) {
            if (Array.isArray(ele[filter['key']])) {
              for (var i = 0; i < ele[filter['key']].length; i++) {
                if (filter['key'] === "roles" && (ele[filter['key']][i]['tenant']?.includes(filter['value']) || ele[filter['key']][i]['roles'].toLowerCase() === filter['value'].toLowerCase())) {
                  return true;
                } else {
                  return false;
                }
              }
            } else {
              const isFound = ele[filter['key']].toLowerCase().includes(filter['value'].toLowerCase());
              return isFound;
            }
          }
          return false;
        });
        this.filteredData = results;
        this.dataGridData = this.filteredData;
      });
    } else {
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
  }

  clearFilter(event, filter, clearAll) {
    if (this.currentView === "users") {
      if (!clearAll) {
        this.search[filter['key']] = "";
        this.filters = this.filters.filter(fl => { return fl['key'] !== filter['key']; });
        if (this.filters.length === 0) {
          this.resetFilters();
          this.dataGridData = this.masterData;
        } else {
          this.applyfilter(event);
        }
      } else {
        this.resetFilters();
        this.dataGridData = this.masterData;
      }
    } else {
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
                operator = element.dataType == "string" ? "@=*" : "==";
              }
              requestData = "," + element.attributeName + operator + element.searchText;
              this.searchTerms += requestData;
            }
          });
          this.search.searchData = this.searchTerms;
          this.search.pageNumber = 1;
          this.onApplyFilter.emit(this.search);
        }
      } else {
        this.filters = [];
        this.searchTerms = "";
        this.search.searchData = "";
        this.search.pageNumber = 1;
        this.onApplyFilter.emit(this.search);
      }
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
    else {
      this.search.pageNumber = event;
    }
  }
  isInGroup(roleTenant, tenantConceptKey) {
    const roleGroup = roleTenant.substring(0, roleTenant.indexOf("_"));
    const conceptGroup = tenantConceptKey.substring(0, tenantConceptKey.indexOf("_"));
    return roleGroup === conceptGroup;
  }
  pageChangeEvent(event: number) {
    if (this.currentView !== "users") {
      this.search.pageNumber = event;
      this.onApplyFilter.emit(this.search);
    }
    else {
      this.search.pageNumber = event;
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
    this.tempGridData = this.dataGridData;
    this.tempDataHeader = this.dataGridHeader;
    this.offcanvasService.dismiss('Cross click');
  }

  CloseQuickLookUp() {
    this.offcanvasService.dismiss('Cross click');
  }

  deleteRows(deleteRecords) {
    let deleteCount = 0;
    this.DeleteIds = [];
    if (this.currentView === 'FacilitySupplierItems') {
      for (let i = 0; i < this.dataGridData.length; i++) {
        const model = { SupplierItemId: "", ItemId: "" };
        let doc = document.getElementById("checked" + i) as HTMLInputElement;
        if (doc.checked) {
          let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
          let id = this.dataGridData[i][index];
          model.SupplierItemId = id;
          let index2 = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Item Id");
          let itemId = this.dataGridData[i][index2];
          model.ItemId = itemId;
          this.DeleteIds.push(model);
          deleteCount++;
        }
      }
      this.DeleteCount = deleteCount;
    }
    else if (this.currentView === 'childItems') {
      for (let i = 0; i < this.dataGridData.length; i++) {
        const model = { childItemId: "", associationId: "" };
        let doc = document.getElementById("checked" + i) as HTMLInputElement;
        if (doc.checked) {
          let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
          let id = this.dataGridData[i][index];
          model.childItemId = id;
          let index2 = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Association Id");
          let itemId = this.dataGridData[i][index2];
          model.associationId = itemId;
          this.DeleteIds.push(model);
          deleteCount++;
        }
      }
      this.DeleteCount = deleteCount;
    }
    else {
      for (let i = 0; i < this.dataGridData.length; i++) {
        let doc = document.getElementById("checked" + i) as HTMLInputElement;
        if (doc.checked) {
          if(this.currentView !='MarkUps'){
            let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
            let id = this.dataGridData[i][index];
            this.DeleteIds.push(id);
            deleteCount++;
          }
          if(this.currentView == 'MarkUps'){
            let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Markup_ID");
            let id = this.dataGridData[i][index];
            this.DeleteIds.push(id);
            deleteCount++;
          }
        }
      }
      this.DeleteCount = deleteCount;
    }
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
    this.filters = [];
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tempDataHeader, event.previousIndex, event.currentIndex);
    this.tempGridData.forEach(p => {
      moveItemInArray(p, event.previousIndex, event.currentIndex);
    });
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
      let tableWidth = 0;
      const tableCells = Array
        .from(this.gridViewTable.nativeElement.querySelectorAll(".header-cell"))
      for (const cell of tableCells) {
        tableWidth += cell['offsetWidth'];
      }
      this.tableWidth = tableWidth;
      this.elementRef.nativeElement.style.setProperty('--table-width', this.tableWidth + 'px');
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

  ExportData() {
    
    this.filters.forEach(element => {
      let index = this.dataGridHeader.findIndex((head) => head["headerTitle"] == element.key);
      this.dataGridHeader[index]["searchText"] = element.value;
    });
    let searchTerm='';
    if(this.parantComponent == 'tradingPartner'){
      searchTerm=`?tradingPartnerId=${this.parantComponentId}&Filters=`;
    }
    else if(this.parantComponent == 'facility'){
      searchTerm=`?facilityId=${this.parantComponentId}&Filters=`
    }
    else if(this.parantComponent =='supplyAgreement' || this.parantComponent == 'item'){
      searchTerm=`?id=${this.parantComponentId}&Filters=`
    }
    else if(this.parantComponent=='restaurant'){
      searchTerm=`?id=${this.parantComponentId}&type=Franchisee&Filters=`
    }
    else if(this.parantComponent == 'items'){
      searchTerm=`?itemId=${this.parantComponentId}&Filters=`
    }
    else if(this.currentView == 'childItems'){
      searchTerm = `?id=${this.parantComponentId}&association_type=Child Item&Filters=`
    }
    else if(this.currentView == 'AlternativeItems'){
      searchTerm = `?id=${this.parantComponentId}&association_type=Alternate Item&Filters=`
    }
    else if(this.currentView == 'menu-item-build' || this.currentView == 'PlateCostPeriod'){
      searchTerm =`?menuItemId=${this.parantComponentId}&Filters=`;
    }
    else if(this.currentView == 'heirarchy'){
      searchTerm = `?hierarchyId=${this.parantComponentId}&nodeId=${this.currentNode}&Filters=`;
    }
    else if(this.currentView == 'ItemLandedCost'){
      searchTerm = `?supplyChainId=${this.parantComponentId}&Filters=`;
    }
    else if(this.currentView == 'itemSupplyagreementView'){
      searchTerm = `?itemId=${this.parantComponentId}&Filters=`;
    }
    else if(this.currentView == 'supplyagrItmview'){
      searchTerm = `?supplyAgreementId=${this.parantComponentId}&Filters=`;
    }
    else{
      searchTerm='?Filters=';
    }
    if(this.parentFilter !== null){
      searchTerm+=this.parentFilter;
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
    const expCols = [];
    for (var i = 0; i < inps?.length; i++) {
      const input = inps[i];
      if (input.checked) {
        expCols.push(input.name);
      }
    }
    let additionalProp ='';
    if(this.currentView=='heirarchy'){
      additionalProp = this.classificationType;
    }
    else if(this.currentView=='ItemLandedCost'){
      additionalProp= this.parantComponentId;
    }
    else if(this.currentView=='itemSupplyagreements'){
      additionalProp= this.parantComponentId;
    }
    if (expCols.length > 0) {
      this.exportService.exportGridData(expCols,this.currentView, searchTerm, this.parantComponent,this.classificationType);
      this.offcanvasService.dismiss('Cross click');
    } else {
      this.toastr.error("Atleast one column should be selected", "Error")
    }

  }

  exportTable() {
    if (this.dataGridHeader.some(x => x.isExport)) {

      for (let i = 0; i < this.dataGridHeader.length; i++) {
        if (!this.dataGridHeader[i].isExport) {
          var ck = document.getElementsByClassName("cl" + i);
          let count = ck.length;
          for (let i = 0; i < count; i++) {
            ck[0].parentNode.removeChild(ck[0]);
          }
        }
        var searchClass = document.getElementsByClassName("search");
        let searchcount = searchClass.length;
        for (let i = 0; i < searchcount; i++) {
          searchClass[0].parentNode.removeChild(searchClass[0]);
        }
        var checkboxClass = document.getElementsByClassName("check-col");
        let checkboxcount = checkboxClass.length;
        for (let i = 0; i < checkboxcount; i++) {
          checkboxClass[0].parentNode.removeChild(checkboxClass[0]);
        }
      }
      this.offcanvasService.dismiss('Cross click');
    }
    else {
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
  openAlternativeItemSequenceCanvas(alternativeContext: TemplateRef<any>) {
    this.offcanvasService.open(alternativeContext, { position: 'end' });
  }
  openMenuItemBuildOverlay(buildContext: TemplateRef<any>) {
    this.offcanvasService.open(buildContext, { position: 'end', backdrop: true, keyboard: false })
  }
  setSelectedMenuItemBuild() {
    this.isOpenMenuItemBuildEdit = true;
    let buildItemArray = [];
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      if (doc.checked) {
        let buildItem = this.gridData[i];
        buildItemArray.push(buildItem);
      }
    }
    this.buildItemArray = buildItemArray;
    if (this.buildItemArray && this.buildItemArray.length > 0) {
      this.isOpenMenuItemBuildEdit = true;
    }
    else {
      this.toastr.error('Select Menu Item Build to Edit', 'Error')
      this.isOpenMenuItemBuildEdit = false;
    }
  }
  departments = ['Communications',
    'Finance', 'Food & Packaging', 'Human Resources', 'Information Technology', 'Logistics', 'PPIM'];
  roles = ['ADMIN', 'BUYER', 'GUEST'];
  openAddAlternativeItemSequenceCanvas(addAlternativeContext: TemplateRef<any>) {
    this.offcanvasService.open(addAlternativeContext, { position: 'end', backdrop: false, keyboard: false });
  }
  openMenuItemBuildCanvas(Context: TemplateRef<any>) {
    this.offcanvasService.open(Context, { position: 'end', backdrop: true, keyboard: false });
  }
  openPriceComponentCanvas(Context: TemplateRef<any>){
    this.offcanvasService.open(Context,{ position: 'end', backdrop: true, keyboard: false});
  }
  openHeirarchy(context:TemplateRef<any>){
    this.offcanvasService.open(context,{ position: 'end', backdrop:true, keyboard: false});
  }
  addBaseMarkup(context:TemplateRef<any>,view: any){
    this.currentViewForMarkups = view == 1? "add" : "edit";
    if(view==1){
      this.offcanvasService.open(context,{ position: 'end', backdrop:true, keyboard: false});
    }
    if(view ==2){
      let count=0;
      for (let i = 0; i < this.dataGridData.length; i++) {
        let doc = document.getElementById("checked" + i) as HTMLInputElement;
        if (doc.checked) {
          this.editBaseMarkUp = this.baseMarkUp[i];
          count++;
        }
      }
      if(count != 1){
        this.toastr.error('Select One Base Markup to Edit');
      }
      if(count==1){
        this.offcanvasService.open(context,{ position: 'end', backdrop:true, keyboard: false});
      }
    }
  }

  platePeriodsForm =
    {
      id: "",
      from_date: null,
      thru_date: null
    }
    ;
  baseMarkupForm = {
    id: uuid.v4(),
    name: '',
    type: 'base'
  }
  editPlateCostPeriodOveralay(editPlateCostPeriod) {
    const model = { id: "", from_date: "", thru_date: "" };
    let count = 0;
    if (this.currentView === 'PlateCostPeriod') {
      for (let i = 0; i < this.dataGridData.length; i++) {
        let doc = document.getElementById("checked" + i) as HTMLInputElement;
        if (doc.checked) {
          let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
          let id = this.dataGridData[i][index];
          model.id = id;
          let index2 = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Begin Date");
          let fromDate = this.dataGridData[i][index2]
          fromDate= this.convert(fromDate)
          model.from_date = fromDate?.split("T")[0];
          let index3 = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "End Date");
          let thruDate = this.dataGridData[i][index3];
          thruDate=(thruDate==""||thruDate==null)?null:this.convert(thruDate);
          model.thru_date = thruDate?.split("T")[0];
          this.platePeriodsForm = { ...model };
          count++;
        }
      }
    }
    if (count === 1) {
      this.offcanvasService.open(editPlateCostPeriod, { position: 'end', backdrop: true, keyboard: false });
    }
    else if (count >= 2) {
      this.toastr.error('Select One Record at a Time', 'Error')
    } else {
      this.toastr.error('Select One Record', 'Error')
    }
  }

  onSubmitPlateCostPeriod() {
    if (this.platePeriodsForm) {
      const end = moment(this.platePeriodsForm.thru_date);
      const start = moment(this.platePeriodsForm.from_date);
      if (end) {
        if (end.isBefore(start)) {
          this.toastr.error("End Date should be greater than Begin Date");
          return;
        }
      }
    }
    this.menuItemSerivce.updatePlateCostPeriod(this.menuItemId, this.platePeriodsForm.id, this.platePeriodsForm).subscribe({
      next: (resp) => {
        this.toastr.success('Plate Cost Period Updated Successfully', 'Success')
        this.offcanvasService.dismiss('Cross click');
        setTimeout(() => { window.location.reload() }, 2000)
      },
      error: (e) => {
        this.createErrors=[];
        if(e.error.status == 500){
          this.createErrors.push("Sorry an error occurred processing your request");
        }else{
          if(e.error?.errors['MenuItemDocument.Plate_cost_periods']!=null && e.error?.errors['MenuItemDocument.Plate_cost_periods'].length>0){
            e.error?.errors['MenuItemDocument.Plate_cost_periods'].forEach(element => {
              this.createErrors.push(element);
            });
          }
        }
        this.modalService.open(this.errorModal);
      },
    })
  }
  onSubmitBaseMarkup() {

  }
  openBaseMarkupCanvas(baseMarkupCanvas: TemplateRef<any>) {
    this.baseMarkupInfo= { id:uuid.v4(),name:'',type:'Base'};
     this.offcanvasService.open(baseMarkupCanvas, { position: 'end', backdrop: false, keyboard: false });

  }
  openEditBaseMarkupCanvas(baseMarkupCanvas: TemplateRef<any>) {
    let bCount = 0;
    //this.baseMarkUpId = '';
    this.baseMarkupInfo= { id:'', name:'',type:'Base'};
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      if (doc.checked) {
        let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let id = this.dataGridData[i][index];
        //this.baseMarkUpId=id;
        this.baseMarkupInfo.id = id;
        let indexName = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Name");
        let name = this.dataGridData[i][indexName];
        this.baseMarkupInfo.name = name;
        bCount++;
      }
    }
    if(bCount==1 && this.baseMarkupInfo)
    {
    this.offcanvasService.open(baseMarkupCanvas, { position: 'end', backdrop: true, keyboard: false });
    }
    else {
      this.toastr.error("Select one Base Markup to Edit")
    }

  }
  extendSelected() {
    var selected = [];
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      if (doc.checked) {
        let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let id = this.dataGridData[i][index];

        let endDateIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "End Date");
        let endDate = this.dataGridData[i][endDateIndex];
        selected.push({
          'id': id,
          'thruDate': new Date(endDate)
        });
      }

    }
    this.onExtend.emit(selected);
  }

  AddItemToHeirarchy(event){
    this.addItemsToHeirarchy.emit(event)
  }

  addFreightPeriod(addFreightPeriodOverlay: TemplateRef<any>){
    this.offcanvasService.open(addFreightPeriodOverlay, { position: 'end', backdrop: true, keyboard: false });
  }
  editAlternateForm={
    id: "",
    from_date: null,
    thru_date: null
  }
  openEditAlternatItem(editAlternate: TemplateRef<any>){
    const model = { id: "", from_date: "", thru_date: "" };
    let count = 0;
    if (this.currentView === 'AlternativeItems') {
      for (let i = 0; i < this.dataGridData.length; i++) {
        let doc = document.getElementById("checked" + i) as HTMLInputElement;
        if (doc.checked) {
          let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
          let id = this.dataGridData[i][index];
          model.id = id;
          let index2 = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Start Date");
          let fromDate = this.dataGridData[i][index2]
          fromDate=this.convert(fromDate);
          model.from_date = fromDate?.split("T")[0];
          let index3 = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "End Date");
          let thruDate = this.dataGridData[i][index3];
          thruDate = (thruDate==""||thruDate==null)?null:this.convert(thruDate);
          model.thru_date = thruDate?.split("T")[0];
          this.editAlternateForm = { ...model };
          count++;
        }
      }
    }
    if (count === 1) {
      this.offcanvasService.open(editAlternate, { position: 'end', backdrop: true, keyboard: false });
    }
    else if (count >= 2) {
      this.toastr.error('Select One Record at a Time', 'Error')
    } else {
      this.toastr.error('Select One Record', 'Error')
    }
  }
  convert(str) {
    if(this.dateFormat=="dd/MM/yyyy"){
      let d=str.split('/')[0];
      let m=str.split('/')[1];
      let y=str.split('/')[2];
      return [y,m,d].join("-");
    }else{
      var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }
  }

}

