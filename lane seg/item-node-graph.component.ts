import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { TradingPartnerFacilityService } from 'src/app/services/trading-partner-facility.service';
import { ToastrService } from 'ngx-toastr';
import { SupplyChainService } from 'src/app/services/supply-chain.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { router } from 'ngx-bootstrap-icons';
import { SupplyChainDocument, SupplyChainForUpdateDto } from 'src/app/models/supplyChain';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ConceptService } from 'src/app/services/concept.service';
//import { jq, evaluate, parse } from '@jq-tools/jq';

@Component({
  selector: 'app-item-node-graph',
  templateUrl: './item-node-graph.component.html',
  styleUrls: ['./item-node-graph.component.scss']
})
export class ItemNodeGraphComponent implements OnInit, OnChanges {
  isEditing = true;
  parentFacilityToAddTo: any;
  editingNode: any;
  editingNodeIndex: number;
  @Input()
  isCreateNewLaneSegment: boolean;
  @Input()
  openNewLane: Observable<void>;
  @Input()
  newLaneSegmentBeginDate;
  @Input()
  newLaneSegmentEndDate;
  @Input()
  newLaneSegmentType;
  @Input()
  newLaneSegmentPricingType;
  @Input()
  newLaneSegmentUOM;
  @Input()
  supplyChain: any;
  prevSupplyChain: any;
  nodes: any[] = [];
  @ViewChild('addfacilityoffcanvas', { static: true }) input: ElementRef;
  facilities: any[] = [];
  rdcDistributionFacilities: any[] = [];
  facilityFormGroup: FormGroup;
  mfgNode: any;
  shipNode: any;
  rdcNode: any;
  dcNodes: any = [];
  masterSegments: any[] = [];
  finalSegmentsCopy: any[] = [];
  itemId: string = '';
  supplyChainId: string = '';
  manufactureFacilityRole: string[] = ["Manufacturing Facility"];
  shippingFacilityRole: string[] = ["Shipping Facility"];
  rdcFacilityRole: string[] = ["Redistribution Center"];
  distributionFacilityRole: string[] = ["Distribution Center"];
  pageLoaded = false;
  manufacturingFacilities: any = [];
  shippingFacilities: any = [];
  manAndshipFacilities: any = [];
  rdcFacilities: any = [];
  dcFacilities: any = [];
  rdcDCFacilities: any = [];
  isSegmentChanged = false;
  private lookup = {};
  private nodesOnCanvas = {};
  exchangeRates: any[] = [];
  exchangeRatesToDisplay: any[] = [];
  private rdcDCCurrencies = {};
  selectedExchangeRates = {};
  isEditRDCDC = false;
  checkNodesLookup = {};
  laneSegmentHasManuAndShipping = false;

  currentConcept: any;
  currentTenant: any;
  constructor(private offcanvasService: NgbOffcanvas, private exchangeRateService: ExchangeRateService, private route: ActivatedRoute, private ref: ChangeDetectorRef, private toastr: ToastrService, private facilityService: TradingPartnerFacilityService, private formBuilder: FormBuilder, private supplyChainService: SupplyChainService, private router: Router, private localStorageService: LocalStorageService, private conceptService: ConceptService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.nodes && this.supplyChain?.id !== this.prevSupplyChain?.id) {
      this.prevSupplyChain = this.supplyChain
      this.lookup = {};
      this.nodes = [];
      console.log('changed')
      this.nodes = JSON.parse(JSON.stringify(this.supplyChain.supplyChainDocument['lane_segments']));
      this.masterSegments = JSON.parse(JSON.stringify(this.nodes));
      this.finalSegmentsCopy = JSON.parse(JSON.stringify(this.nodes));
      this.preProcessNodes();
      this.pageLoaded = true;
    }
  }

  ngOnInit(): void {
    if (this.openNewLane) {
      this.openNewLane?.subscribe(eve => {
        this.openEnd(this.input, null);
      });
      this.initModelForm();
    }
    this.localStorageService.tenantData$.subscribe(tenant => {
      this.currentTenant = tenant;
    })
    this.exchangeRateService.getAllExchangeRates().subscribe(data => {
      this.exchangeRates = data;
    });
    if (this.isCreateNewLaneSegment) {
      this.supplyChainId = this.route.snapshot.params['chainId'];
      this.route.parent.parent.params.subscribe(p => {
        this.itemId = p['itemId'];
        if (this.itemId && this.itemId.length > 0) {
          this.setFacilities();
        }
      });
    }
    if (!this.isCreateNewLaneSegment) {
      this.route.parent.parent.parent.params.subscribe(p => {
        this.itemId = p['itemId'];

        if (this.itemId && this.itemId.length > 0) {
          this.setFacilities();
        }
      });
    }
  }
  setFacilities() {
    this.supplyChainService.getFacilitiesByItemIdAndRoles(this.itemId, this.manufactureFacilityRole).subscribe({
      next: (mData) => {
        this.manufacturingFacilities = mData;
        if (this.manufacturingFacilities) {
          this.manufacturingFacilities = this.manufacturingFacilities.filter(sfa => sfa.id != '40fdaeae-f8aa-de11-8056-005056873740');

          this.manufacturingFacilities.map((mfac) => {
            mfac.manfCheck = false;
            mfac.shipCheck = false;
            return mfac;
          })

          this.manAndshipFacilities = [...this.manAndshipFacilities, ...this.manufacturingFacilities];
        }
      },
      error: (e) => {
        console.log('sFac' + e);
      }
    });

    this.supplyChainService.getFacilitiesByItemIdAndRoles(this.itemId, this.shippingFacilityRole).subscribe({
      next: (sData) => {
        if (sData) {
          this.shippingFacilities = sData;
          if (this.shippingFacilities) {

            this.shippingFacilities.map((sfac) => {
              sfac.manfCheck = false;
              sfac.shipCheck = true;
              return sfac;
            })
            this.manAndshipFacilities = [...this.manAndshipFacilities, ...this.shippingFacilities];
          }
        }
      },
      error: (e) => {
        console.log('SFac' + e);
      }
    });
    this.supplyChainService.getFacilitiesByItemIdAndRoles(this.itemId, this.rdcFacilityRole).subscribe({
      next: (sData) => {
        if (sData) {
          this.dcFacilities = sData;
          if (this.rdcFacilities) {

            this.rdcFacilities.map((sfac) => {
              sfac.rdcCheck = true;
              sfac.dcCheck = false;
              return sfac;
            })
            this.rdcDCFacilities = [...this.rdcFacilities, ...this.dcFacilities];
          }
        }
      },
      error: (e) => {
        console.log('DCFac' + e);
      }
    });
    this.supplyChainService.getFacilitiesByItemIdAndRoles(this.itemId, this.distributionFacilityRole).subscribe({
      next: (sData) => {
        if (sData) {
          this.dcFacilities = sData;
          if (this.dcFacilities) {

            this.dcFacilities.map((sfac) => {
              sfac.rdcCheck = false;
              sfac.dcCheck = true;
              return sfac;
            })
            this.rdcDCFacilities = [...this.rdcFacilities, ...this.dcFacilities];
          }
        }
      },
      error: (e) => {
        console.log('DCFac' + e);
      }
    });
  }
  preProcessNodes() {
    this.transform(this.nodes);
    this.checkNodesOnCanvas();
  }

  transform(arr: any) {
    let dropList = [];
    arr.forEach((i, index) => {
      let existing = this.lookup[i.source_facility_id + i.source_facility_role_type];
      if (!existing) {
        this.lookup[i.source_facility_id + i.source_facility_role_type] = i;
      } else {
        if (existing.destination_facility_id) {
          let child = {
            source_facility_id: existing.destination_facility_id,
            source_facility_name: existing.destination_facility_name,
            source_facility_role_type: existing.destination_facility_role_type,
            source_currency: existing.destination_currency,
            children: null
          }
          delete existing.destination_facility_id;
          delete existing.destination_facility_name;
          delete existing.destination_facility_role_type;
          delete existing.destination_currency;
          (existing.children ??= []).push(child);

          this.lookup[child.source_facility_id + child.source_facility_role_type] = child;
        }
        dropList.push(index);

        let child = {
          id: i.id,
          source_facility_id: i.destination_facility_id,
          source_facility_name: i.destination_facility_name,
          source_facility_role_type: i.destination_facility_role_type,
          source_currency: i.destination_currency,
          children: null
        };

        if (child.source_facility_role_type === 'Distribution Center' && existing.children) {
          existing.children.splice(0, 0, child);
        } else {
          (existing.children ??= []).push(child)
        }
        this.lookup[child.source_facility_id + child.source_facility_role_type] = child;
      }
      if (i.children) {
        this.transform(i.children)
      }
    });

    dropList.reverse().forEach(index => arr.splice(index, 1));
  }

  checkNodesOnCanvas() {
    this.checkNodesLookup = {};
    this.nodesOnCanvas = null;
    this.nodesOnCanvas = Array(this.nodes.length).fill({});
    for (var i = 0; i < this.nodes.length; i++) {
      this.checkNodesLookup = {};
      const node = JSON.parse(JSON.stringify(this.nodes[i]));
      this.nodesOnCanvas[i][`${node.source_facility_id}-${node.source_facility_role_type}-${i}`] = node.source_facility_name;
      this.iterateListOfNodes(i, node.children);
    }
  }

  iterateListOfNodes(nodeIndex: number, arr: any) {
    arr.forEach((i, index) => {
      const obj = {};
      obj[`${i.source_facility_id}-${i.source_facility_role_type}-${nodeIndex}`] = i.source_facility_name;
      const res = Object.assign(this.nodesOnCanvas[nodeIndex], obj);
      this.nodesOnCanvas[nodeIndex] = res;
      if (i.children) {
        this.iterateListOfNodes(nodeIndex, i.children);
      }
    });
  }

  deleteNode(node: any, type: any, nodeIndex: number) {
    if (this.masterSegments[nodeIndex].id === node.id) {
      this.masterSegments.forEach(idx => this.masterSegments.splice(idx, 1))
      this.nodes.forEach(idx => this.nodes.splice(nodeIndex, 1))
    } else {
      this.walkAndDeleteNode(node.source_facility_id, type, this.masterSegments[nodeIndex].children);
    }
    this.nodes = JSON.parse(JSON.stringify(this.masterSegments));
    this.lookup = null;
    this.lookup = {};
    this.preProcessNodes();
    this.isSegmentChanged = true;
  }

  walkAndDeleteNode(id: any, type: any, arr: any) {
    let dropList = [];
    arr.forEach((i, index) => {
      if (i.source_facility_id === id && i.source_facility_role_type === type) {
        dropList.push(index);
      } else if (i.destination_facility_id === id && i.destination_facility_role_type === type) {
        dropList.push(index);
      }
      if (i.children) {
        this.walkAndDeleteNode(id, type, i.children)
      }
    });
    dropList.reverse().forEach(index => arr.splice(index, 1));
  }

  getExchangeRate(id: string) {
    const idx = this.exchangeRatesToDisplay.findIndex(ele => {
      return ele.id == id;
    });
    if (idx > -1) {
      return this.exchangeRatesToDisplay[idx];
    }
    return undefined;
  }

  async updateNodeFacility(edited, exchangeRate, node, newNode) {
    const addChild = newNode ? true : false;
    const rateId = exchangeRate ? exchangeRate.value : newNode.exchange_rate_id;
    const exchangeRateObj = this.getExchangeRate(rateId);

    let facId;
    let facName;
    let vals;
    this.lookup = {};
    if (!addChild) {
      const parts = edited.value.split(':::');
      facId = parts[0];
      facName = parts[1];
      vals = {
        source_facility_name: facName,
        source_facility_id: facId,
        source_currency: exchangeRateObj ? exchangeRateObj.sourceCurrencyName : exchangeRate.value,
        exchange_rate_id: exchangeRateObj ? exchangeRateObj.id : null,
        exchange_rate_name: exchangeRateObj ? exchangeRateObj.name : null,
        detination_currency: exchangeRateObj ? exchangeRateObj.destinationCurrencyName : exchangeRate.value
      }
    }
    if (this.editingNodeIndex && this.masterSegments[this.editingNodeIndex].id === this.editingNode?.id) {
      this.masterSegments[this.editingNodeIndex].source_facility_name = facName;
      this.masterSegments[this.editingNodeIndex].source_facility_id = facId;
      this.masterSegments[this.editingNodeIndex].source_currency = exchangeRateObj ? exchangeRateObj.sourceCurrencyName : exchangeRate.value;
      this.masterSegments[this.editingNodeIndex].source_currency = exchangeRateObj ? exchangeRateObj.id : null;
      this.masterSegments[this.editingNodeIndex].source_currency = exchangeRateObj ? exchangeRateObj.name : null;
      this.masterSegments[this.editingNodeIndex].source_currency = exchangeRateObj ? exchangeRateObj.destinationCurrencyName : exchangeRate.value;
    } else {
      const id = node ? node.source_facility_id : this.editingNode.source_facility_id;
      const type = node ? node.source_facility_role_type : this.editingNode.source_facility_role_type;
      this.walkAndUpdateNodes(id, type, this.masterSegments, vals, addChild, newNode);
    }
    this.nodes = [];
    this.nodes = JSON.parse(JSON.stringify(this.masterSegments));
    this.lookup = {};
    this.preProcessNodes();
    this.isSegmentChanged = true;
    this.offcanvasService.dismiss('Cross Click');
  }
  cancelNewLaneSegment() {
    this.router.navigate(["."]);
  }
  saveNewLaneSegment() {
    console.log(this.newLaneSegmentBeginDate, ' ', this.newLaneSegmentEndDate, ' ', this.newLaneSegmentType);
    if (this.supplyChainId) {
      this.supplyChainService.getSupplyChainById(this.supplyChainId).subscribe(chain => {
        chain.FromDate = this.newLaneSegmentBeginDate;
        chain.ThruDate = this.newLaneSegmentEndDate;
        chain.PricingMethodType=this.newLaneSegmentPricingType;
        chain.UnitOfMeasureType = this.newLaneSegmentUOM;
        chain.IsCurrent = this.newLaneSegmentType==='current'?true:false;
        chain.supplyChainDocument.lane_segments.push(this.masterSegments[0]);
        this.supplyChainService.updateSupplyChain(this.supplyChainId, chain).subscribe({
          next: rep => {
            this.toastr.success('Supply chain updated');
            this.router.navigate([".."]);
          },
          error: (e) => {
            this.toastr.error('Sorry an error occurred updating the supplychain');
            console.log(e);
          }
        });
      });
    } else {
      const newSupplyChain = new SupplyChainForUpdateDto();
      newSupplyChain.ItemId = this.itemId;
      newSupplyChain.PricingMethodType = this.newLaneSegmentPricingType;
      newSupplyChain.FromDate = this.newLaneSegmentBeginDate;
      newSupplyChain.ThruDate = this.newLaneSegmentEndDate;
      newSupplyChain.Type = 'FinishedGoods';
      newSupplyChain.UnitOfMeasureType = this.newLaneSegmentUOM;
      newSupplyChain.IsCurrent = this.newLaneSegmentType==='current'?true:false;
      newSupplyChain.IsFinalized = false;
      newSupplyChain.IsPriceNotificationGenerated = false;
      newSupplyChain.IsLegacy = false;
      newSupplyChain.IsIncludedInLandedCost = false;
      newSupplyChain.NoMatrixCost = 0;
      newSupplyChain.NoMatrixCostCurrency = '';
      const supplyDoc = new SupplyChainDocument();
      supplyDoc.lane_segments = [];
      supplyDoc.lane_segments.push(this.masterSegments[0]);
      newSupplyChain.SupplyChainDocument=supplyDoc;
      this.conceptService.getAllConcepts().subscribe(concepts => {
        for (var i = 0; i < concepts.length; i++) {
          if (concepts[i].conceptKey === this.currentTenant.conceptKey) {
            this.currentConcept = concepts[i];
            break;
          }
        }
        newSupplyChain.ConceptKey = this.currentConcept.conceptKey;
        newSupplyChain.ConceptId = this.currentConcept.id;
        console.log(newSupplyChain)
        this.supplyChainService.createSupplyChain(newSupplyChain).subscribe({
          next: rep => {
            this.toastr.success('Supply chain updated');
            this.router.navigate([`item/${this.itemId}/view/item-pricing`]);
          },
          error: (e) => {
            this.toastr.error('Sorry an error occurred updating the supplychain');
            console.log(e);
          }
        });
      });

    }
  }
  walkAndUpdateNodes(id: any, type: any, arr: any, vals: any, addChild: any, newNode: any) {
    arr.forEach((i, index) => {
      if (addChild && i.destination_facility_id === id && i.destination_facility_role_type === type) {
        (i.children ??= []).push(newNode);
      } else if (!addChild && i.source_facility_id === id && i.source_facility_role_type === type) {
        i.source_facility_id = vals.source_facility_id;
        i.source_facility_name = vals.source_facility_name;
        i.source_currency = vals.source_currency;
      } else if (addChild && i.destination_facility_id === id && i.destination_facility_role_type === type) {
        i.destination_facility_id = newNode.source_facility_id;
        i.destination_facility_name = newNode.source_facility_name;
        i.destination_currency = newNode.source_currency;
      } else if (!addChild && i.destination_facility_id === id && i.destination_facility_role_type === type) {
        i.destination_facility_id = vals.source_facility_id;
        i.destination_facility_name = vals.source_facility_name;
        i.destination_currency = vals.source_currency;
      }

      if (i.children) {
        this.walkAndUpdateNodes(id, type, i.children, vals, addChild, newNode)
      }
    });
  }
  nodeAndRoleExistOnCanvas(loc, type) {
    return this.nodesOnCanvas[this.editingNodeIndex][`${loc['id']}-${type}-${this.editingNodeIndex}`];
  }
  openEnd(content: any, node: any, isEditing = false, nodeIndex = -1) {
    this.editingNodeIndex = nodeIndex
    if (isEditing) {
      this.editingNode = node;
      if (node.source_facility_role_type === 'Manufacturing Facility' || node.source_facility_role_type === 'Shipping Facility') {
        this.isEditRDCDC = false;
      } else {
        this.isEditRDCDC = true;
      }
    }
    if (this.manAndshipFacilities && this.manAndshipFacilities.length) {
      const key = 'id';
      this.facilities = [...new Map(this.manAndshipFacilities.map(item =>
        [item[key], item])).values()];

    }
    if (this.rdcDCFacilities && this.rdcDCFacilities.length) {
      const key = 'id';
      const locs = [...new Map(this.rdcDCFacilities.map(item =>
        [item[key], item])).values()];
      this.rdcDistributionFacilities = locs;

    }
    if (node) {
      this.parentFacilityToAddTo = node;
      this.setDisplayExchangeRates(node.source_currency);
    }
    for (let val of this.facilities) {
      this.rdcDCCurrencies[val.id] = this.exchangeRatesToDisplay ? this.exchangeRatesToDisplay[0] : undefined;
    }
    for (let val of this.rdcDistributionFacilities) {
      this.rdcDCCurrencies[val.id] = this.exchangeRatesToDisplay ? this.exchangeRatesToDisplay[0] : undefined;
    }
    this.hasManuOrShip();
    this.offcanvasService.open(content, { position: 'end' });
  }
  setDisplayExchangeRates(sourceCurrency: string) {
    const rates = this.exchangeRates.filter(ele => {
      return ele.sourceCurrencyName = sourceCurrency;
    });
    this.exchangeRatesToDisplay = [];
    // this.exchangeRatesToDisplay =   Array.from(new Set(rates));
    this.exchangeRatesToDisplay = rates.reduce(
      (unique, item) => (unique.findIndex(e => e.sourceCurrencyName === item.sourceCurrencyName) > -1 ? unique : [...unique, item]),
      [],
    );
  }

  getType(type: string) {
    if (type === "Manufacturing Facility") {
      return "M";
    } else if (type === "Shipping Facility") {
      return "S";
    } else if (type === "Redistribution Center") {
      return "RDC";
    } else if (type === "Distribution Center") {
      return "DC";
    }
    return type;
  }

  initModelForm() {
    this.facilityFormGroup = this.formBuilder.group({
      otherControls: [''],
      // The formArray, empty
      myChoices: new FormArray([]),
    });
  }

  selectMfgNode(row: number, event: any, ele) {
    this.mfgNode = this.facilities[row];
    if (this.mfgNode && this.manufacturingFacilities) {
      let manfExists = this.manufacturingFacilities.filter(mf => mf.id === this.mfgNode.id);
      if (manfExists && manfExists.length == 1)
        this.mfgNode.manfCheck = true;
      this.mfgNode.currency = ele.value;
    }

  }

  isManufacturedRole(row) {
    let manf = this.facilities[row];
    if (manf && this.manufacturingFacilities) {
      let manfExists = this.manufacturingFacilities.filter(mf => mf.id === manf.id);
      if (manfExists && manfExists.length == 1)
        return true;
    }
    return false;
  }

  isShippingRole(row) {
    let manf = this.facilities[row];
    if (manf && this.shippingFacilities) {
      let shifExists = this.shippingFacilities.filter(mf => mf.id === manf.id);
      if (shifExists && shifExists.length == 1)
        return true;
    }
    return false;
  }

  hasManuOrShip() {
    let currentSegmentHasManu = false;
    let currentSegmentHasShipping = false;
    if (this.editingNodeIndex >= 0) {
      if (this.masterSegments[this.editingNodeIndex].type === "Manufacturing to Shipping") {
        currentSegmentHasManu = true;
      }
      if (this.masterSegments[this.editingNodeIndex]?.children.length > 0 && this.masterSegments[this.editingNodeIndex].children[0].type.includes("Shipping")) {
        currentSegmentHasShipping = true;
      }
    } else {
      if (this.mfgNode) {
        currentSegmentHasManu = true;
      }
      if (this.shipNode) {
        currentSegmentHasShipping = true;
      }
    }
    this.laneSegmentHasManuAndShipping = currentSegmentHasManu && currentSegmentHasShipping;
  }

  selectShipNode(row: number, event: any, ele) {
    this.shipNode = this.facilities[row];
    this.shipNode.shipCheck = event.target.checked;
    this.shipNode.currency = ele.value;
    if (event.target.checked) {
      let manRole = this.isManufacturedRole(row);

      this.selectMfgNode(row, event, ele);
    }
    else {
      if (this.facilities[row].manfCheck) {
        this.facilities[row].manfCheck = false;
      }
    }
  }

  selectRdcNode(row: number, event) {

    if (event.target.checked) {
      this.rdcNode = this.rdcDistributionFacilities[row];
      this.rdcNode.currency = this.rdcDCCurrencies[this.rdcNode.id];
      this.rdcNode.exchange_rate_name = this.rdcDCCurrencies[this.rdcDistributionFacilities[row].id]?.name;
      this.rdcNode.exchange_rate_id = this.rdcDCCurrencies[this.rdcDistributionFacilities[row].id]?.id;
      this.rdcNode.destination_currency = this.rdcDCCurrencies[this.rdcDistributionFacilities[row].id]?.destinationCurrencyName;
    } else {
      this.rdcNode = undefined;
    }
  }

  selectDCNodes(row: number, event) {
    if (event.target.checked) {
      this.rdcDistributionFacilities[row].currency = this.rdcDCCurrencies[this.rdcDistributionFacilities[row].id]?.sourceCurrencyName;
      this.rdcDistributionFacilities[row].exchange_rate_name = this.rdcDCCurrencies[this.rdcDistributionFacilities[row].id]?.name;
      this.rdcDistributionFacilities[row].exchange_rate_id = this.rdcDCCurrencies[this.rdcDistributionFacilities[row].id]?.id;
      this.rdcDistributionFacilities[row].destination_currency = this.rdcDCCurrencies[this.rdcDistributionFacilities[row].id]?.destinationCurrencyName;
      this.dcNodes.push(this.rdcDistributionFacilities[row]);
    } else {
      this.dcNodes = this.dcNodes.filter(ele => {
        return ele.id !== this.rdcDistributionFacilities[row]?.id;
      });
    }
  }

  addMfgShipNodes() {
    if (!this.supplyChainId) {
      if (!this.mfgNode && this.shipNode) {
        this.toastr.warning('Please select a manufacuring and shipping facility');
        return;
      }
      if (!this.newLaneSegmentBeginDate || !this.newLaneSegmentEndDate) {
        this.toastr.warning('Please select beginning and end dates for the new segment')
        return;
      }
      if (!this.newLaneSegmentType) {
        this.toastr.warning('Please select a type for the new segment');
        return;
      }
    }
    if (this.mfgNode && this.shipNode) {
      const mfgNode = {
        id: uuidv4(),
        type: "Manufacturing to Shipping",
        pricing_type: null,
        source_currency: this.mfgNode.currency,
        exchange_rate_id: null,
        exchange_rate_name: null,
        percent_allocation: 0.0,
        source_facility_id: this.mfgNode.id,
        supply_agreement_id: null,
        destination_currency: this.shipNode.currency,
        source_facility_name: this.mfgNode.name,
        destination_facility_id: this.shipNode.id,
        destination_facility_name: this.shipNode.name,
        source_facility_role_type: "Manufacturing Facility",
        destination_facility_role_type: "Shipping Facility",
        price_components: [],
        children: []
      };
      const shipNode = {
        id: uuidv4(),
        pricing_type: "FOB",
        source_currency: mfgNode.source_currency,
        exchange_rate_id: null,
        exchange_rate_name: null,
        percent_allocation: 0.0,
        source_facility_id: this.shipNode.id,
        supply_agreement_id: null,
        destination_currency: this.shipNode.currency,
        source_facility_name: this.shipNode.name,
        destination_facility_id: null,
        destination_facility_name: null,
        source_facility_role_type: "Shipping Facility",
        destination_facility_role_type: null,
        type: 'Shipping to Distribution',
        price_components: [],
        children: []
      };
      mfgNode.children.push(shipNode);

      this.masterSegments.push(JSON.parse(JSON.stringify(mfgNode)));
      this.lookup = {}
      this.nodes = JSON.parse(JSON.stringify(this.masterSegments))
      this.preProcessNodes();
      this.offcanvasService.dismiss('Cross Click');
    } else {
      this.toastr.error('Error', 'Please select a Mfg and ship facility');
    }
  }
  setRDCDCCurreny(facility, event) {
    this.rdcDCCurrencies[facility.id] = event.target.value;
    this.selectedExchangeRates[facility.id] = event.target.value;
  }
  checkRDCDCExchangeRateExists(id: string) {
    return this.selectedExchangeRates[id] !== undefined;
  }
  addRdcDCNodes(parentNode: any) {
    if (!this.rdcNode && this.dcNodes?.length > 0 && parentNode.source_facility_role_type === 'Redistribution Center') {
      const newNodes = [];
      for (var i = 0; i < this.dcNodes.length; i++) {
        const node = this.dcNodes[i];
        const dcNode = {
          id: uuidv4(),
          type: "Redistribution to Distribution",
          pricing_type: "FOB",
          source_currency: parentNode.source_currency,
          exchange_rate_id: node.exchange_rate_id,
          exchange_rate_name: node.exchange_rate_name,
          percent_allocation: 0.0,
          source_facility_id: parentNode.source_facility_id,
          supply_agreement_id: null,
          destination_currency: node.destination_currency,
          source_facility_name: parentNode.source_facility_name,
          destination_facility_id: node.id,
          destination_facility_name: node.name,
          source_facility_role_type: "Redistribution Center",
          destination_facility_role_type: "Distribution Center",
          price_components: [],
          children: null
        };
        newNodes.push(dcNode);

      }
      for (let node of newNodes) {
        this.updateNodeFacility(null, null, parentNode, node);
      }
      this.rdcNode = undefined;
      this.dcNodes = [];
      this.selectedExchangeRates = {};
    } else if (!this.rdcNode && this.dcNodes?.length > 0) {
      const newNodes = [];
      for (var i = 0; i < this.dcNodes.length; i++) {
        const node = this.dcNodes[i];

        const dcNode = {
          id: uuidv4(),
          type: "Shipping to Distribution",
          pricing_type: "FOB",
          source_currency: this.shipNode?.currency ?? parentNode?.source_currency,
          exchange_rate_id: node.exchange_rate_id,
          exchange_rate_name: node.exchange_rate_name,
          percent_allocation: 0.0,
          source_facility_id: this.shipNode?.id ?? parentNode?.source_facility_id,
          supply_agreement_id: null,
          destination_currency: node.destination_currency,
          source_facility_name: this.shipNode?.name ?? parentNode?.source_facility_name,
          destination_facility_id: node.id,
          destination_facility_name: node.name,
          source_facility_role_type: "Shipping Facility",
          destination_facility_role_type: "Distribution Center",
          price_components: [],
          children: null
        };
        newNodes.push(dcNode);

      }
      for (let node of newNodes) {
        this.updateNodeFacility(null, null, parentNode, node);
      }
      this.rdcNode = undefined;
      this.dcNodes = [];
      this.selectedExchangeRates = {};
    } else if (this.rdcNode && this.dcNodes?.length > 0) {
      const rdcNode = {
        id: uuidv4(),
        type: "Redistribution to Distribution",
        pricing_type: "FOB",
        source_currency: parentNode.source_currency,
        exchange_rate_id: this.rdcNode.exchange_rate_id,
        exchange_rate_name: this.rdcNode.exchange_rate_name,
        percent_allocation: 0.0,
        source_facility_id: parentNode.source_facility_id,
        supply_agreement_id: null,
        destination_currency: this.rdcNode.destination_currency,
        source_facility_name: parentNode.source_facility_name,
        destination_facility_id: this.rdcNode.id,
        destination_facility_name: this.rdcNode.name,
        source_facility_role_type: parentNode.source_facility_role_type,
        destination_facility_role_type: "Redistribution Center",
        price_components: [],
        children: []
      };
      rdcNode.type = "Redistribution to Distribution";
      parentNode.type = "Shipping to Redistribution";

      const newNodes = [];
      for (var i = 0; i < this.dcNodes.length; i++) {
        const node = this.dcNodes[i];
        const dcNode = {
          id: uuidv4(),
          type: "Redistribution to Distribution",
          pricing_type: "FOB",
          source_currency: rdcNode.destination_currency,
          exchange_rate_id: node.exchange_rate_id,
          exchange_rate_name: node.exchange_rate_name,
          percent_allocation: 0.0,
          source_facility_id: rdcNode.destination_facility_id,
          supply_agreement_id: null,
          destination_currency: node.destination_currency,
          source_facility_name: rdcNode.destination_facility_name,
          destination_facility_id: node.id,
          destination_facility_name: node.name,
          source_facility_role_type: "Redistribution Center",
          destination_facility_role_type: "Distribution Center",
          price_components: [],
          children: null
        };
        newNodes.push(dcNode);

      }
      rdcNode.children = newNodes;
      this.updateNodeFacility(null, null, parentNode, rdcNode);
      this.rdcNode = undefined;
      this.dcNodes = [];
      this.selectedExchangeRates = {}
    } else if (this.rdcNode) {
      const rdcNode = {
        id: uuidv4(),
        type: "Redistribution to Distribution",
        pricing_type: "FOB",
        source_currency: parentNode.source_currency,
        exchange_rate_id: this.rdcNode.exchange_rate_id,
        exchange_rate_name: this.rdcNode.exchange_rate_name,
        percent_allocation: 0.0,
        source_facility_id: parentNode.source_facility_id,
        supply_agreement_id: null,
        destination_currency: this.rdcNode.destination_currency,
        source_facility_name: parentNode.source_facility_name,
        destination_facility_id: this.rdcNode.id,
        destination_facility_name: this.rdcNode.name,
        source_facility_role_type: parentNode.source_facility_role_type,
        destination_facility_role_type: "Redistribution Center",
        price_components: [],
        children: []
      };
      rdcNode.type = "Redistribution to Distribution";
      parentNode.type = "Shipping to Redistribution";

      this.updateNodeFacility(null, null, parentNode, rdcNode);
      this.rdcNode = undefined;
      this.dcNodes = [];
      this.selectedExchangeRates = {};
    }
    this.offcanvasService.dismiss('Cross Click');
  }

  updateSegment() {
    this.supplyChain.supplyChainDocument['lane_segments'] = this.masterSegments;
    this.supplyChainService.updateSupplyChainDoc(this.supplyChain.id, this.supplyChain).subscribe({
      next: (rep) => {
        this.toastr.success("Lane segment facility updated", "Success");
      },
      error: (err) => {
        this.toastr.error("The lane segment failed to update.", "Error");
      }
    });
    this.isSegmentChanged = false;
  }
  cancelSegmentChanges() {
    this.mfgNode = undefined;
    this.shipNode = undefined;
    this.masterSegments = JSON.parse(JSON.stringify(this.finalSegmentsCopy));
    this.nodes = JSON.parse(JSON.stringify(this.masterSegments));
    this.lookup = null;
    this.lookup = {};
    this.nodesOnCanvas = {};
    this.preProcessNodes();
    this.isSegmentChanged = false;
  }
  deleteLaneSegment(idx: number) {
    this.masterSegments.splice(idx, 1);
    this.nodes = JSON.parse(JSON.stringify(this.masterSegments));
    this.lookup = null;
    this.lookup = {};
    this.preProcessNodes();
    this.isSegmentChanged = true;
  }
  cancel() {
    this.offcanvasService.dismiss('Cross Click');
  }

}
