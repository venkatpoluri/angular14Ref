import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, forkJoin, take, zip } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SharedEventService } from 'src/app/services/shared-event.service';
import { SupplyChainService } from 'src/app/services/supply-chain.service';
import { TradingPartnerSupplyagreementService } from 'src/app/services/trading-partner-supplyagreement.service';
import * as moment from 'moment';
import { TradingPartnerFacilityService } from 'src/app/services/trading-partner-facility.service';
import { ToastrService } from 'ngx-toastr';
import { PricingComponentService } from 'src/app/services/pricing-component.service';

@Component({
  selector: 'app-item-pricing-details',
  templateUrl: './item-pricing-details.component.html',
  styleUrls: ['./item-pricing-details.component.scss']
})
export class ItemPricingDetailsComponent implements OnInit {
  selectedAll: any;
  dataGridHeader: any[];
  dataGridData: any[];
  isMexicanConcept: boolean = false;
  isEditing: boolean = false;
  tradingPartnerId: string;
  supplyChainId: string;
  supplyChain: any;
  supplyAgreements: any[][] = [[]];
  priceComponentCols: any[] = [];
  conceptKey: string;
  constructor(private _formBuilder: FormBuilder, private toastr: ToastrService, private tradingPartnerFacilityService: TradingPartnerFacilityService, private tradingPartnerSupplyagreementService: TradingPartnerSupplyagreementService, private localStorageService: LocalStorageService, private supplyChainService: SupplyChainService, private sharedEventService: SharedEventService, private router: Router, private pricingComponentService: PricingComponentService) { }

  tableForm: FormGroup = this._formBuilder.group({
    itemPricingDetails: this._formBuilder.array([])
  });

  ngOnInit(): void {
    this.localStorageService.loadTenant();
    this.localStorageService.tenantData$.pipe(take(1)).subscribe(ele => {
      this.conceptKey = ele.conceptKey;
    });
    this.sharedEventService.pricingPeriod.subscribe(period => {
      this.supplyChain = period.selectedPricingPeriod;
      this.supplyChainService.ReadSupplyChainDetailBySupplyChainId(period.selectedPricingPeriod.id).subscribe(chainDet => {
        this.supplyChainId = period.selectedPricingPeriod.id;
        this.dataGridData = chainDet;
        this.pricingComponentService.ReadPriceComponentLanesByIsLaneComponent(true).subscribe(rep => {
          const cols = rep.filter(data => data.conceptKey === this.conceptKey && data.name !== 'New compo');
          const sortedCols = cols.sort((a, b) => a.seq < b.seq ? -1 : 1);
          sortedCols.forEach(col => {
            this.priceComponentCols.push({ name: col.name, varName: col.name.replace(/\s/g, "") })
          });
          this.loadItemPricingDetails();
        });
      });
    });
    this.sharedEventService.pricingPeriodActions.subscribe(val => {
      this.isEditing = val.isEditing;
      if (this.isEditing) {
        this.tableForm.enable();
      }
      if (val.deleteRows) {
        this.deleteSelectedRows();
      }
    })
  }

  get itemPricingDetails() {
    return this.tableForm.controls['itemPricingDetails'] as FormArray;
  }

  clearItemPricingDetails() {
    while (this.itemPricingDetails.length) {
      this.itemPricingDetails.removeAt(0);
    }
  }

  CheckAllOptions(event: any) {
    if (event.target.checked) {
      this.selectedAll = true;
    } else {
      this.selectedAll = false;
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

  deleteSelectedRows() {
    for (let i = 0; i < this.dataGridData.length; i++) {
      let doc = document.getElementById("checked" + i) as HTMLInputElement;
      if (doc.checked) {
        console.log('delete ' + i)
      }
    }
  }

  loadItemPricingDetails() {
    this.clearItemPricingDetails();
    const from = moment(this.supplyChain.fromDate + 'T00:00:00');
    const to = moment(this.supplyChain.thruDate + 'T00:00:00');
    const tasks$ = [];
    const supplyTasks$ = [];
    console.log(this.dataGridData);
    for (let i = 0; i < this.dataGridData.length; i++) {
      const val = this.dataGridData[i];
      const req = this.tradingPartnerFacilityService.getFacilityById(val.sourceFacilityId);
      tasks$.push(req);
      const details = this._formBuilder.group({
        sourceFacilityName: new FormControl(val.sourceFacilityName, [Validators.required]),
        sourceFacilityId: new FormControl(val.sourceFacilityId, [Validators.required]),
        type: new FormControl(val.sourceFacilityRoleType, Validators.nullValidator),
        destinationFacilityId: new FormControl(val.sourceFacilityId, [Validators.required]),
        destinationFacilityName: new FormControl(val.destinationFacilityName, [Validators.required]),
        pricingType: new FormControl(val.pricingType, [Validators.required]),
        // FOB: new FormControl(val.priceComponents['FOB'] ?? "0", [Validators.required]),
        // Revenue: new FormControl(val.priceComponents['Revenue'] ?? "0", [Validators.required]),
        // Invoice: new FormControl(val.priceComponents['Invoice'] ?? '', [Validators.nullValidator]),
        // ImportCostSource: new FormControl(val.priceComponents['ImportCostSource'] ?? '', [Validators.nullValidator]),
        // ImportCostDestination: new FormControl(val.priceComponents['ImportCostDestination'] ?? '', [Validators.nullValidator]),
        allocation: new FormControl(val.percent_allocation, [Validators.nullValidator]),
        supplyAgreement: new FormControl(val?.supplyAgreeement ?? '', [Validators.nullValidator]),
        freightPeriodStatus: new FormControl(val.freightPeriodStatus, [Validators.nullValidator]),
        supplyAgreementId: new FormControl(val.supplyAgreeementId ?? '', Validators.nullValidator)
      })
      for (var j = 0; j < this.priceComponentCols.length; j++) {
        const name = this.priceComponentCols[j].varName;
        details.addControl(name, new FormControl(val.priceComponents[name] ?? "", [Validators.nullValidator]));
      }
      this.itemPricingDetails.push(details);
    }
    const zipCall = zip(...tasks$);
    zipCall.subscribe(data => {
      for (var i = 0; i < data.length; i++) {
        const req = this.tradingPartnerSupplyagreementService.getAllSupplyAgreements(`?Filters=TradingPartnerId==${data[i]['tradingPartnerId']},IsFinalized=true`);
        supplyTasks$.push(req);
      }
      zip(...supplyTasks$).subscribe(data => {

        for (var i = 0; i < data.length; i++) {
          this.supplyAgreements[i] = data[i]['body'].filter(ele => {
            if (ele.thruDate) {
              return from.isAfter(moment(ele.fromDate)) && to.isBefore(moment(ele.thruDate));
            } else {
              return from.isAfter(moment(ele.fromDate));
            }

          });
        }
      });
    })


    this.tableForm.disable();

  }


  navigateToFrietPeriod(sAgreeId: string) {
    // Navigation
    this.router.navigate([`/trading-partners/supply-agreements/${sAgreeId}/freight`])
  }
  cancel() {
    this.isEditing = false;
    this.tableForm.disable();
  }
  save() {
    if (this.tableForm.valid) {
      const vals = this.itemPricingDetails.controls;
      const details = [];
      for (var i = 0; i < vals.length; i++) {
        const row = vals[i]['controls'];
        const obj = {
          sourceFacilityName: row.sourceFacilityName.value,
          sourceFacilityId: row.sourceFacilityId.value,
          sourceFacilityRoleType: row.type.value,
          destinationFacilityId: row.destinationFacilityId.value,
          destinationFacilityName: row.destinationFacilityName.value,
          pricingType: row.pricingType.value,
          priceComponents: {
            FOB: row.FOB.value,
            Revenue: row.Revenue.value,
            Invoice: row.Invoice.value,
            ImportCostSource: row.ImportCostSource.value,
            ImportCostDestination: row.ImportCostDestination.value,
          },
          percent_allocation: row.allocation.value?.length > 0 ? +row.allocation.value : 0,
          supplyAgreement: row.supplyAgreement.value,
          supplyAgreementId: row.supplyAgreementId.value,
          freightPeriodStatus: row.freightPeriodStatus.value
        }
        details.push(obj);
      }
      this.supplyChainService.UpdateSupplyChainLaneSegmentsById(this.supplyChainId, details).subscribe({
        next: (rep) => this.toastr.success('Item pricing successfully updated'),
        error: (err) => this.toastr.error('An error ocurred updating the pricing details')
      })
    }
    this.isEditing = false;
    this.tableForm.disable();
  }
}
