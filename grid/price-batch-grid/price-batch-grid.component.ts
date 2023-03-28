import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { KeyValue } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import {PriceBatchUploadService } from '../../../services/price-batch-upload.service';

import { PriceBatchItem, PriceComponent} from '../../../models/priceBatch'; 
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-price-batch-grid',
  templateUrl: './price-batch-grid.component.html',
  styleUrls: ['./price-batch-grid.component.scss']
})
export class PriceBatchGridComponent implements OnInit {


  pageSize = 10;
  

  @Input()
  buildingGrid = false;

  @Input()
  sheetData=[];

  pageNumber = 1;
  currentStartIndex=0;
  currentEndIndex = this.pageSize;

  headersMap = {
    "ItemName":"RSCI Item Description",
    "ItemNo":"RSCI Item #",
    "UOM":"Price Unit of Measure", 
    "Facility":"Shipping Facility", 
    "FromDate":"Begin Date", 
    "ThruDate":"End Date",
    "SANumber":"SA #", 
    "FOB":"Contract FOB", 
    "InvoiceFOB":"Invoice FOB",
    "Revenue":"Revenue",
    "Duty":"Duty", 
    "Brokerage":"Brokerage",
    "Quota":"Quota"
  };

  // fetch using service
  unitsOfMeasure = ['Case(s)', 'Kilogram(s)'];

  headers = ["ItemNo", "ItemName", "SANumber", "Facility", "UOM", "FromDate","ThruDate", "FOB", "Revenue", "InvoiceFOB", "Duty", "Brokerage" ];
  showHeaders = this.headers.map(h => this.headersMap[h]);
  editableHeaders = ["UOM", "FromDate","SANumber", "ThruDate", "FOB", "Revenue", "Duty", "Brokerage", "InvoiceFOB"];
  
  priceBatchItems = []

  constructor(private priceBatchUploadService: PriceBatchUploadService, 
    private spinner: NgxUiLoaderService) { }


  ngOnInit(): void {
    this.loadInitialGrid();
  
  }

  loadInitialGrid()
  {      
    this.priceBatchItems = [];
      
    this.sheetData.forEach(pbd=>{
      var item = new PriceBatchItem();


      item.ItemNo = pbd[this.headersMap["ItemNo"]];
      item.ItemName = pbd[this.headersMap["ItemName"]];
      item.Facility = pbd[this.headersMap["Facility"]];
      item.SANumber = pbd[this.headersMap["SANumber"]];
      item.FromDate = pbd[this.headersMap["FromDate"]];
      item.ThruDate = pbd[this.headersMap["ThruDate"]];
      item.UOM = pbd[this.headersMap["UOM"]];
      item.FOB = parseFloat(pbd[this.headersMap["FOB"]]);
      item.Revenue = parseFloat(pbd[this.headersMap["Revenue"]]);
      item.Duty = parseFloat(pbd[this.headersMap["Duty"]]);
      item.Brokerage = parseFloat(pbd[this.headersMap["Brokerage"]]);
      item.Quota = parseFloat(pbd[this.headersMap["Quota"]]);
      this.priceBatchItems.push(item);
      item.LoadingValidation = true;
      this.priceBatchUploadService.validatePriceBatchItem(item).subscribe(v =>{
         item.Validation = v;
         item.LoadingValidation = false;
      });
    });

  }
  changePageSize() {
      this.pageNumber = 1;
      this.currentStartIndex = 0;
      this.currentEndIndex = this.pageSize;
  }
  pageChangeEvent(event: number) {
      this.pageNumber = event;
      this.currentStartIndex = (this.pageNumber -1)*this.pageSize;
      this.currentEndIndex =this.pageNumber*this.pageSize;
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    if ('sheetData' in changes) {
      this.loadInitialGrid();
    }
  
  }

  asIsOrder(a, b) {
    return 1;
  }

  isEditable(data, key)
  {
    return data.isEditing && this.editableHeaders.includes(key);
  }

  validationText(data, key)
  {
    return data.Validation[key];
  }

  inputType(key)
  {
    if(key === "FromDate" || key === "ThruDate" ) return "date";
    if (key ==="FOB" || key === "Revenue" || key === "Quota" || key === "Brokerage" ||key === "Duty") return "number";
    return "text";
  }
  getMin(key)
  {
    if (key === "Revenue" || key === "Quota" || key === "Brokerage" ||key === "Duty") return 0;
    if (key === "FOB") return 0.00001;
    return undefined;
  }
  updateData(data, key, $event)
  {
    data[key] = ($event.target as HTMLInputElement).value;
  }

  reValidate(data, $event){

    data.LoadingValidation = true;
    this.priceBatchUploadService.validatePriceBatchItem(data).subscribe(v => {
      data.Validation = v;
      data.LoadingValidation = false;
    });
  }

  isValid(data, key){
    return !(key in data.Validation);
  }
  batchIsValid(){
    return this.priceBatchItems.every(item => item.IsValid && !item.LoadingValidation);

  }

  updatePricing(){
    this.priceBatchUploadService.updating$.subscribe(data => {
      if (data) 
      {
        this.spinner.start();
      } else {
        this.spinner.stop();
      }});
    this.priceBatchUploadService.updatePriceBatch(this.priceBatchItems);
  }


  getInvoiceFOB(data){
    return data.FOB + data.Revenue;
  }

  getValue(data, key){
    return data[key];
  }
 
}