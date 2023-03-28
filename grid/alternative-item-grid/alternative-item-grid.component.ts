import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { KeyValue } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Franchise } from 'src/app/models/franchise';
import { ExportService } from 'src/app/services/export.service';
import { FranchiseService } from 'src/app/services/franchise.service';
import { TradingPartnerFacilityService } from 'src/app/services/trading-partner-facility.service';
import { GridViews } from '../grid-view-columns';

@Component({
  selector: 'app-alternative-item-grid',
  templateUrl: './alternative-item-grid.component.html',
  styleUrls: ['./alternative-item-grid.component.scss']
})
export class AlternativeItemGridComponent implements OnInit, OnChanges {
  @Input() loading: boolean;
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
  @Input() filterKey: string;
  @Input() filterValue: string;
  @ViewChild('gridViewTable') gridViewTable: ElementRef;
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onChangePageSize = new EventEmitter<object>();
  @Output() onApplyFilter = new EventEmitter<object>();
  @Output() onSelectedAlternativeItems = new EventEmitter<object>();
  @Output() onSelectedItems = new EventEmitter<object>();
  @Output() onUpdateItem = new EventEmitter<object>();
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
  //selectedIds:any[]=[];
  pageOffsets = 40;
  dataFranchiseCanvas: any;
  dataFacilityCanvas: any;
  restaurantIds: any[] = [];
  @ViewChild('inputs') inputs: any;
  constructor(private offcanvasService: NgbOffcanvas, private toastr: ToastrService, private elementRef: ElementRef, private exportService: ExportService, private modalService: NgbModal, public router: Router, public franchiseeService: FranchiseService, private tradingPartnerFacilityService: TradingPartnerFacilityService) {

  }

  ngOnInit(): void {
    this.elementRef.nativeElement.style.setProperty('--table-width', (window.innerWidth - this.pageOffsets) - 800 + 'px');
    this.setupGrid();
    if (this.filterKey === "Status") {
      this.filters = this.filters.filter(fl => { return fl['key'] !== "Status"; });
       this.filters.push({ key: this.filterKey, value: this.filterValue });
       this.searchTerms = "";
       let requestData: string;
       this.filterKey= this.filterKey.replace(/\s/g, "");;
       requestData = this.filterKey + "==" + this.filterValue;
       this.searchTerms += requestData;
        this.search.searchData = this.searchTerms;
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
        event.target.setAttribute('href', viewComponentPath);
        break;
      case ("Alignments"):
        let dcRow = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID")
        let dcId = this.dataGridData[index][dcRow]
        viewComponentPath = this.viewPath + dcId + "/view/info";
        event.target.setAttribute('href', viewComponentPath);
        break;
      default:
        viewComponentPath = this.viewPath;
        event.target.setAttribute('href', viewComponentPath);
        break;
    }

  }


  ngOnChanges(changes: SimpleChanges) {
    this.gridData = changes['gridData']?.currentValue;
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


  setSearchTerm(event) {
    this.dataGridHeader[event.target.id]["searchText"] = event.target.value;
  }

  applyfilter(event) {
    this.searchTerms = '';
    this.filters = [];
    this.dataGridHeader.forEach((element: any) => {
      let requestData = "";
      if (element.searchText !== undefined && element.searchText != "") {
        let operator = "=="
        if (element.dataType != null) {
          operator = element.dataType == 'string' ? "@=*" : "==";
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
            let operator = '==';
            if (element.dataType != null) {
              operator = element.dataType == 'string' ? "@=*" : "==";
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
  checkIfAllItemSelected() {
    let optionChecked: boolean[] = [];
    let selectedIds = [];
    let selectedItems = [];
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("alternativechecked" + i) as HTMLInputElement;
      optionChecked.push(doc.checked);

      if (doc.checked) {
        let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let nameIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Item Description");
        let unitsPerCaseIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Units/Case");
        let uomIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "UOM");
        let id = this.dataGridData[i][index];
        if (this.currentView == 'MenuItemBuildAdd') {
          if ((this.dataGridData[i][unitsPerCaseIndex] == null || this.dataGridData[i][unitsPerCaseIndex] == 0) || (this.dataGridData[i][uomIndex] == null || this.dataGridData[i][uomIndex] == '')) {
            this.toastr.error(`${this.dataGridData[i][nameIndex]} is not a valid item`, "Error");
            optionChecked[i] = false
            doc.checked = false
          }
          let selectedItem = {
            item_id: id,
            serving_units: Number(this.dataGridData[i][8]),
            name: this.dataGridData[i][nameIndex],
            units_per_case: this.dataGridData[i][unitsPerCaseIndex],
            uom: this.dataGridData[i][uomIndex]
          }
          selectedItems.push(selectedItem);

        }
        selectedIds.push(id);
        this.onSelectedAlternativeItems.emit(selectedIds);
      }
    }
    this.onSelectedItems.emit(selectedItems);
  }
  close() {
    this.modalService.dismissAll();
  }

  getArray(data) {
    return data as Array<any>;
  }

  changeServingUnits(idx, event) {
    this.dataGridData[idx][7] = event.target.value;
    let selectedItems = []
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("alternativechecked" + i) as HTMLInputElement;
      if (doc.checked) {
        let index = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "ID");
        let nameIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Item Description");
        let unitsPerCaseIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "Units/Case");
        let uomIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle === "UOM");
        let id = this.dataGridData[i][index];
        let selectedItem = {
          item_id: id,
          serving_units: Number(this.dataGridData[i][7]),
          name: this.dataGridData[i][nameIndex],
          units_per_case: this.dataGridData[i][unitsPerCaseIndex],
          uom_index: this.dataGridData[i][uomIndex]
        }
        selectedItems.push(selectedItem);
      }
    }
    this.onSelectedItems.emit(selectedItems);
  }

  changeDates(idx, event, col) {
    let updatedMenuItemBuild = []
    for (let i = 0; i < this.dataGridData.length; i++) {
      let itemIdIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle == 'Item Id')
      let idIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle == 'ID')
      let servingUnitsIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle == 'Serving Units')
      let startDateIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle == 'Start Date')
      let endDateIndex = this.dataGridHeader.findIndex(f2 => f2.headerTitle == 'End Date')
      let itemId = this.dataGridData[i][itemIdIndex]
      let id = this.dataGridData[i][idIndex]
      let servingUnits = this.dataGridData[i][servingUnitsIndex]

      if (Number(col) == 8) {
        this.dataGridData[idx][startDateIndex] = event.target.value
      }
      if (Number(col) == 9) {
        this.dataGridData[idx][endDateIndex] = event.target.value
      }

      let updatedItem = {
        id: id,
        item_id: itemId,
        serving_units: servingUnits,
        from_date: this.dataGridData[i][startDateIndex],
        thru_date: this.dataGridData[i][endDateIndex]
      }
      updatedMenuItemBuild.push(updatedItem)
    }
    this.onUpdateItem.emit(updatedMenuItemBuild)
  }

  getSelectValues(col) {
    return [];
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
}
