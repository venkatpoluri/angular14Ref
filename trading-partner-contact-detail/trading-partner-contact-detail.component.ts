import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as uuid from 'uuid';
import {
  Alignment,
  contactInfo,
  ElectronicEmailAddress,
} from 'src/app/models/contact';
import { SharedEventService } from 'src/app/services/shared-event.service';
import { DataService } from 'src/app/services/data.service';
import { TradingPartnerService } from 'src/app/services/trading-partner.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import {
  IMultiSelectSettings,
  IMultiSelectOption,
} from 'ngx-bootstrap-multiselect';
import { TradingPartnerContactsService } from 'src/app/services/trading-partner-contacts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, map, shareReplay, take } from 'rxjs';
import { LocationCodes } from 'src/app/models/location.codes';
import { TradingPartnerFacilityService } from 'src/app/services/trading-partner-facility.service';
import { FranchiseService } from 'src/app/services/franchise.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { Tenant } from 'src/app/models/tenant';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CurrentUserService } from 'src/app/services/current-user-service';


@Component({
  selector: 'app-trading-partner-contact-detail',
  templateUrl: './trading-partner-contact-detail.component.html',
  styleUrls: ['./trading-partner-contact-detail.component.scss'],
})
export class TradingPartnerContactDetailComponent implements OnInit {
  roleMultiSelect: IMultiSelectOption[];
  connectToTps: Alignment[];
  tpconnect: string;
  tradingPartnerInfo: any;
  restInfo: any;
  facInfo: any;
  frInfo: any;
  alignmentHasError=0;
  autoCompleteTpName: string = 'name';
  autoCompleteRestName: string = 'name';
  autoCompleteFrName: string = 'name';
  autoCompleteFacName: string = 'name';
  selectSettings: IMultiSelectSettings = {
    pullRight: false,
    enableSearch: false,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-secondary role-select',
    selectionLimit: 0,
    closeOnSelect: false,
    autoUnselect: false,
    showCheckAll: true,
    showUncheckAll: true,
    fixedTitle: false,
    dynamicTitleMaxItems: 1,
    maxHeight: '300px',
    isLazyLoad: true,
    loadViewDistance: 1,
    stopScrollPropagation: true,
    selectAddedValues: true,
  };

  viewedit = false;
  validateEmail(type: string, email: string) {
    let inValid = false;

    if (type === 'Email') {
      const mailformat =
        /^(?=^.{1,150}$)([a-zA-Z0-9]+(?:[._-][0-9a-zA-Z]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,15})$)/;
      const valid = email.match(mailformat);
      inValid = valid ? false : true;
    }

    if (type === 'Website') {
      const valid = email.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      valid ? (inValid = false) : (inValid = true);
    }

    return inValid;
  }

  tradingPartnerDetails: contactInfo = {
    contactDocument: {
      alignments: [],
      notes: [],
      postal_addresses: [],
      phone_addresses: [],
      electronic_addresses: {
        electronic_email_addresses: [],
        electronic_website_addresses: [],
      },
      connectToEntity: {
        trading_partner: [],
        facility: [],
        franchisee: [],
        restaurant: [],
      },
    },
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    title: '',
    conceptId: '',
    conceptKey: '',
  };

  connectToTp: Alignment = { id: '', type: 'Trading Partner', roles: [] };

  constructor(
    private _formBuilder: FormBuilder,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private tradingPartnerService: TradingPartnerService,
    private dataService: DataService,
    private fb: FormBuilder,
    private sharedEventService: SharedEventService,
    private contactService: TradingPartnerContactsService,
    private router: Router,
    private tpFacilityService: TradingPartnerFacilityService,
    private franchiseeService: FranchiseService,
    private restaurantService: RestaurantService,
    private localStorageService: LocalStorageService,
    private currentUserService: CurrentUserService
  ) { }

  postalAddressTypes!: string[];
  allCountries!: any[];
  allStates!: any[];
  allCities: any[];
  allPhoneTypes: any[];
  allEmailTypes: any[];
  allRoleTypes: any[];
  availableGeoLocations = LocationCodes;

  partnerAlignment: Alignment;
  facilityAlignment: Alignment;

  @Input() isEdit!: boolean;
  @Input() tradingPartnerId!: string;
  @Input() contactId!: string;
  @Input() isEditing: boolean;
  @Input() show: boolean = false;
  tradingpartners: any[];
  franchisees: any[];
  restaurants: any[];
  facilities: any[];

  mappedTradingpartners: any[];
  mappedFranchisees: any[] = [];
  mappedRestaurants: any[] = [];
  mappedFacilities: any[] = [];

  mappedTradingpartnerIds: any[] = [];
  mappedFranchiseesIds: any[] = [];
  mappedRestaurantsIds: any[] = [];
  mappedFacilitiesIds: any[] = [];

  titles: any[];
  tenant: Tenant;
  userCanDeleteElements = false;
  userCanAddNewElement = false;
  userCanEditElement = false;
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
          }
          if (tenant.conceptKey === currentConcept && (tenant.role === "ADMIN" || tenant.role === "BUYER")) {
            this.userCanAddNewElement = true;
            this.userCanEditElement = true;
          }
        }
      });
    });
    this.tradingpartners = [];
    this.facilities = [];
    this.franchisees = [];
    this.restaurants = [];
    this.connectToTps = [];
    this.connectToTp = {
      id: '',
      type: 'Trading Partner',
      roles: ['Contact'],
    };
    this.connectToTps.push(this.connectToTp);
    this.roleMultiSelect = [
      { id: 'Account Manager', name: 'Account Manager' },
      { id: 'Accounting', name: 'Accounting' },
      { id: 'BKC R&D', name: 'BKC R&D' },
      { id: 'Buyer', name: 'Buyer' },
      { id: 'Contact', name: 'Contact' },
      { id: 'Customer Service', name: 'Customer Service' },
      { id: 'Emergency Contact', name: 'Emergency Contact' },
      { id: 'Executive', name: 'Executive' },
      { id: 'Marketing', name: 'Marketing' },
      { id: 'Office Manager', name: 'Office Manager' },
      { id: 'Operator', name: 'Operator' },
      { id: 'Plant Manager', name: 'Plant Manager' },
      { id: 'Sales Contact', name: 'Sales Contact' },
      { id: 'Service Contact', name: 'Service Contact' },
    ];
    
    this.contactService.getInfo(this.contactId).subscribe((res: any) => {
      this.tradingPartnerDetails = res;
      this.sharedEventService.viewingContactChange.emit(this.tradingPartnerDetails);

      if (this.tradingPartnerDetails) {

        if (!this.tradingPartnerDetails.contactDocument.notes) {
          this.tradingPartnerDetails.contactDocument.notes = [];
        }
        if (!this.tradingPartnerDetails.contactDocument.phone_addresses) {
          this.tradingPartnerDetails.contactDocument.phone_addresses = [];
        }
        if (!this.tradingPartnerDetails.contactDocument.postal_addresses) {
          this.tradingPartnerDetails.contactDocument.postal_addresses = [];
        }
        if (
          !this.tradingPartnerDetails.contactDocument.electronic_addresses
            ?.electronic_email_addresses
        ) {
          this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_email_addresses =
            [];
        }
        if (
          !this.tradingPartnerDetails.contactDocument.electronic_addresses
            ?.electronic_website_addresses
        ) {
          this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_website_addresses =
            [];
        }

        this.partnerAlignment = {};
        this.tradingPartnerDetails.contactDocument.connectToEntity = {
          trading_partner: [],
          facility: [],
          franchisee: [],
          restaurant: [],
        };
        this.getConnectEntity();
        if (
          this.tradingPartnerDetails.contactDocument.electronic_addresses
            ?.electronic_website_addresses?.length > 0
        ) {
          if (
            this.tradingPartnerDetails.contactDocument.electronic_addresses
              .electronic_email_addresses?.length > 0
          ) {
            for (
              let w = 0;
              w <
              this.tradingPartnerDetails.contactDocument.electronic_addresses
                .electronic_website_addresses?.length;
              w++
            ) {
              let websiteAddress: ElectronicEmailAddress = {
                id: this.tradingPartnerDetails.contactDocument
                  .electronic_addresses.electronic_website_addresses[w].id,
                type: this.tradingPartnerDetails.contactDocument
                  .electronic_addresses.electronic_website_addresses[w].type,
                website:
                  this.tradingPartnerDetails.contactDocument
                    .electronic_addresses.electronic_website_addresses[w]
                    .website,
                email:
                  this.tradingPartnerDetails.contactDocument
                    .electronic_addresses.electronic_website_addresses[w]
                    .website,
                is_primary:
                  this.tradingPartnerDetails.contactDocument
                    .electronic_addresses.electronic_website_addresses[w]
                    .is_primary,
              };
              this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_email_addresses.push(
                websiteAddress
              );
            }
            //this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_email_addresses.concat(this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_website_addresses);
          } else {
            this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_email_addresses =
              [];
            //this.tradingPartnerDetails.contactDocument.electronic_addresses?.electronic_email_addresses.concat(this.tradingPartnerDetails.contactDocument.electronic_addresses?.electronic_website_addresses);
            for (
              let w = 0;
              w <
              this.tradingPartnerDetails.contactDocument.electronic_addresses
                .electronic_website_addresses?.length;
              w++
            ) {
              let websiteAddress: ElectronicEmailAddress = {
                id: this.tradingPartnerDetails.contactDocument
                  .electronic_addresses.electronic_website_addresses[w].id,
                type: this.tradingPartnerDetails.contactDocument
                  .electronic_addresses.electronic_website_addresses[w].type,
                website:
                  this.tradingPartnerDetails.contactDocument
                    .electronic_addresses.electronic_website_addresses[w]
                    .website,
                email:
                  this.tradingPartnerDetails.contactDocument
                    .electronic_addresses.electronic_website_addresses[w]
                    .website,
                is_primary:
                  this.tradingPartnerDetails.contactDocument
                    .electronic_addresses.electronic_website_addresses[w]
                    .is_primary,
              };
              this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_email_addresses.push(
                websiteAddress
              );
            }
          }
        }
        this.tradingPartnerDetails.contactDocument.postal_addresses.forEach(element => {
          switch(element.country_name){
            case  'United States of America':
              element.countryName = "United States of America";
              break;
            case  'usa':
              element.countryName = "United States of America";
              break;
            case  'USA':
              element.countryName = "United States of America";
              break;
            case  'Usa':
                element.countryName = "United States of America";
                break;
            case 'Canada':
              element.countryName = "Canada";
              break;
            case 'canada':
              element.countryName = "Canada";
              break;
            case 'Mexico':
              element.countryName = "Mexico";
              break;
            case 'mexico':
              element.countryName = "Mexico";
              break;
            case 'China':
              element.countryName = "China";  
              break;
            case 'china':
              element.countryName = "China";  
              break;
            case 'australia':
              element.countryName = "Australia";
              break;
            case 'Australia':
              element.countryName = "Australia";
              break;
            case 'guatemala':
              element.countryName = "Guatemala";
              break;
            case 'Guatemala':
              element.countryName = "Guatemala";
              break;
            case 'netherlands':
              element.countryName = "Netherlands";
              break;
            case 'Netherlands':
              element.countryName = "Netherlands";
              break;
          }
        });
      }
      console.log(this.tradingPartnerDetails.contactDocument.postal_addresses);
    });
    this.titles = this.dataService.getAllTitles();
    this.postalAddressTypes = this.dataService.getAllPostalAddressTypes();
    this.allCountries = this.dataService.getAllCountries();
    this.allStates = this.dataService.getAllStates();
    this.allCities = this.dataService.getAllCities();
    this.allPhoneTypes = this.dataService.getAllPhoneTypes();
    this.allEmailTypes = this.dataService.getAllEmailTypes();
    this.allRoleTypes = this.dataService.getAllRoleTypes();

  }

  getConnectEntity() {
    if (this.tradingPartnerDetails) {
      this.mappedTradingpartnerIds = [];
      this.mappedFacilitiesIds = [];
      this.mappedFranchiseesIds = [];
      this.mappedRestaurantsIds = [];

      if (this.tradingPartnerDetails.contactDocument?.alignments?.length > 0) {
        for (
          let e = 0;
          e < this.tradingPartnerDetails.contactDocument?.alignments?.length;
          e++
        ) {
          if (
            this.tradingPartnerDetails.contactDocument.alignments[e].type ===
            'Trading Partner'
          ) {
            let alignment = {
              id: this.tradingPartnerDetails.contactDocument.alignments[e].id,
              type: this.tradingPartnerDetails.contactDocument.alignments[e]
                .type,
              roles:
                this.tradingPartnerDetails.contactDocument.alignments[e].roles,
            };
            this.mappedTradingpartnerIds.push(alignment.id);
            this.tradingPartnerDetails.contactDocument.connectToEntity.trading_partner.push(
              alignment
            );
          } else if (
            this.tradingPartnerDetails.contactDocument.alignments[e].type ===
            'Facility'
          ) {
            let alignment = {
              id: this.tradingPartnerDetails.contactDocument.alignments[e].id,
              type: this.tradingPartnerDetails.contactDocument.alignments[e]
                .type,
              roles:
                this.tradingPartnerDetails.contactDocument.alignments[e].roles,
            };
            this.mappedFacilitiesIds.push(alignment.id);
            this.tradingPartnerDetails.contactDocument.connectToEntity.facility.push(
              alignment
            );
          } else if (
            this.tradingPartnerDetails.contactDocument.alignments[e].type ===
            'Franchisee'
          ) {
            let alignment = {
              id: this.tradingPartnerDetails.contactDocument.alignments[e].id,
              type: this.tradingPartnerDetails.contactDocument.alignments[e]
                .type,
              roles:
                this.tradingPartnerDetails.contactDocument.alignments[e].roles,
            };
            this.mappedFranchiseesIds.push(alignment.id);

            this.tradingPartnerDetails.contactDocument.connectToEntity.franchisee.push(
              alignment
            );
          } else if (
            this.tradingPartnerDetails.contactDocument.alignments[e].type ===
            'Restaurant'
          ) {
            let alignment = {
              id: this.tradingPartnerDetails.contactDocument.alignments[e].id,
              type: this.tradingPartnerDetails.contactDocument.alignments[e]
                .type,
              roles:
                this.tradingPartnerDetails.contactDocument.alignments[e].roles,
            };
            this.mappedRestaurantsIds.push(alignment.id);

            this.tradingPartnerDetails.contactDocument.connectToEntity.restaurant.push(
              alignment
            );
          } else {
          }
        }
        // facilities
        if (this.mappedFacilitiesIds && this.mappedFacilitiesIds.length > 0) {
          for (let f = 0; f < this.mappedFacilitiesIds.length; f++) {
            this.getFacilityNameById(this.mappedFacilitiesIds[f]);
          }
        }
        if (this.mappedFranchiseesIds && this.mappedFranchiseesIds.length > 0) {
          for (let f = 0; f < this.mappedFranchiseesIds.length; f++) {
            this.getFranchiseNameById(this.mappedFranchiseesIds[f]);
          }
        }
        if (this.mappedRestaurantsIds && this.mappedRestaurantsIds.length > 0) {
          for (let f = 0; f < this.mappedRestaurantsIds.length; f++) {
            this.getRestaurantNameById(this.mappedRestaurantsIds[f]);
          }
        }
        if (this.mappedTradingpartnerIds && this.mappedTradingpartnerIds.length > 0) {
          for (let f = 0; f < this.mappedTradingpartnerIds.length; f++) {
            this.getTradingPartnerNameById(this.mappedTradingpartnerIds[f]);
          }
        }
      }
    }
  }

  tradingPartnerView(id: any) {
    //  this.tradingPartnerDetails = { "id": "00524e9e-ea97-4448-96cf-d471456c64ad", "firstName": "Venkat", "middleName": "Rao", "lastName": "Poluri", "suffix": "Mr.", "title": "title 2", "conceptId": "ed546a5a-7063-4416-a3f5-ad4ec94f8d09", "conceptKey": "BK_CA", "contactDocument": { "postal_addresses": [{ "id": "c3bcbdb3-ee82-4f29-ac2c-7de877535314", "type": "P.O. Box", "address_1": "address", "address_2": "add", "city": "city", "state_name": "BC:British Columbia", "country_name": "canada", "postal_code": "89990004", "is_concept_provided": false, "is_primary": true, "is_emergency_contact": false, "is_do_not_contact": false }], "phone_addresses": [{ "id": "4d91ebe4-e2a3-4635-bcd8-3d761b7d716d", "type": "Home Phone", "country_code": "001", "area_code": "8999", "phone_number": "888777666", "phone_extension": "90", "is_concept_provided": false, "is_primary": true, "is_emergency_contact": false, "is_do_not_contact": false }], "electronic_addresses": { "electronic_email_addresses": [{ "id": "efa6ec31-ba0d-47f9-8aa4-f5ba8f65ed6a", "type": "Email", "email": "venkat@gmail.com", "is_concept_provided": false, "is_primary": true, "is_emergency_contact": false, "is_do_not_contact": false }], "electronic_website_addresses": [] }, "notes": [{ "id": "1875d757-0ec5-e511-823c-005056873740", "type": "Contact", "note": "Contact for Heinz and Kraft since 'merger'.", "created_on": "2016-01-27", "last_modified_by": "scodesido" }], "alignments": [{ "id": "001ab478-5c94-ec11-aa21-bc16119e9c76", "type": "Trading Partner", "roles": ["Accounting", "Buyer"] }, { "id": "33fdaeae-f8aa-de11-8056-005056873740", "type": "Facility", "roles": ["Contact", "Account Manager"] }, { "id": "9384ae92-f4aa-de11-8056-005056873740", "type": "Trading Partner", "roles": ["Contact", "Account Manager"] }] } }
  }

  addNewAddressType() {
    this.tradingPartnerDetails.contactDocument.postal_addresses.push({
      id: uuid.v4(),
      address_1: '',
      address_2: '',
      city: '',
      country_code: '',
      country_name: '',
      is_primary: true,
      postal_code: '',
      state_code: '',
      state_name: '',
      type: '',
      countryName:''
    });
  }
  addNewAddressTypeWithoutPrimary() {
    this.tradingPartnerDetails.contactDocument.postal_addresses.push({
      id: uuid.v4(),
      address_1: '',
      address_2: '',
      city: '',
      country_code: '',
      country_name: '',
      is_primary: false,
      postal_code: '',
      state_code: '',
      state_name: '',
      type: '',
      countryName:''
    });
  }

  removePostalAddress(i) {
    if(this.tradingPartnerDetails.contactDocument.postal_addresses[i].is_primary){
      if(i==0){
        this.tradingPartnerDetails.contactDocument.postal_addresses[1].is_primary=true
      }
      else{
        this.tradingPartnerDetails.contactDocument.postal_addresses[0].is_primary=true
      }
    }
    if (
      this.tradingPartnerDetails.contactDocument.postal_addresses.length > 1
    ) {
      this.tradingPartnerDetails.contactDocument.postal_addresses.splice(i, 1);
    }
  }

  addNewPhone() {
    this.tradingPartnerDetails.contactDocument.phone_addresses.push({
      id: uuid.v4(),
      type: '',
      country_code: '',
      area_code: '',
      phone_number: '',
      phone_extension: '',
      is_primary: true,
    });
  }
  addNewPhoneWithoutPrimary() {
    this.tradingPartnerDetails.contactDocument.phone_addresses.push({
      id: uuid.v4(),
      type: '',
      country_code: '',
      area_code: '',
      phone_number: '',
      phone_extension: '',
      is_primary: false,
    });
  }
  removePhone(i) {
    if(this.tradingPartnerDetails.contactDocument.phone_addresses[i].is_primary){
      if(i==0){
        this.tradingPartnerDetails.contactDocument.phone_addresses[1].is_primary=true
      }
      else{
        this.tradingPartnerDetails.contactDocument.phone_addresses[0].is_primary=true
      }
    }

    if (this.tradingPartnerDetails.contactDocument.phone_addresses.length > 1) {
      this.tradingPartnerDetails.contactDocument.phone_addresses.splice(i, 1);
    }
  }

  removeEmail(i) {
    if(this.tradingPartnerDetails.contactDocument.electronic_addresses
      .electronic_email_addresses[i].is_primary){
      if(i==0){
        this.tradingPartnerDetails.contactDocument.electronic_addresses
        .electronic_email_addresses[1].is_primary=true
      }
      else{
        this.tradingPartnerDetails.contactDocument.electronic_addresses
        .electronic_email_addresses[0].is_primary=true
      }
    }
    if (
      this.tradingPartnerDetails.contactDocument.electronic_addresses
        .electronic_email_addresses.length > 1
    ) {
      this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_email_addresses.splice(
        i,
        1
      );
    }
  }
  addNewEmail() {
    this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_email_addresses.push(
      {
        id: uuid.v4(),
        email: '',
        website: '',
        is_primary: true,
        type: '',
      }
    );
  }
  addNewEmailWithoutPrimary() {
    this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_email_addresses.push(
      {
        id: uuid.v4(),
        email: '',
        website: '',
        is_primary: false,
        type: '',
      }
    );
  }


  addNewNote() {
    this.tradingPartnerDetails.contactDocument.notes.push(
      {
        note: ''
      }
    )
  }

  removeNote(i) {
    if (this.tradingPartnerDetails.contactDocument.notes.length > 1) {
      this.tradingPartnerDetails.contactDocument.notes.splice(i, 1)
    }
  }

  addTpEnity() {
    this.tradingPartnerDetails.contactDocument.connectToEntity.trading_partner.push(
      {
        id: '',
        type: 'Trading Partner',
        roles: [],
      }
    );
  }
  removeTpEnity(i) {
    if (
      this.tradingPartnerDetails.contactDocument.connectToEntity.trading_partner
        .length > 1
    ) {
      this.tradingPartnerDetails.contactDocument.connectToEntity.trading_partner.splice(
        i,
        1
      );
    }
  }

  removeFranchiseeEnity(i) {
    if (
      this.tradingPartnerDetails.contactDocument.connectToEntity.franchisee
        .length > 1
    ) {
      this.tradingPartnerDetails.contactDocument.connectToEntity.franchisee.splice(
        i,
        1
      );
    }
  }

  addFranchiseeEnity() {
    this.tradingPartnerDetails.contactDocument.connectToEntity.franchisee.push({
      id: '',
      type: 'Franchisee',
      roles: [],
    });
  }

  //  facility

  removeFacilityEnity(i) {
    if (
      this.tradingPartnerDetails.contactDocument.connectToEntity.facility
        .length > 1
    ) {
      this.tradingPartnerDetails.contactDocument.connectToEntity.facility.splice(
        i,
        1
      );
    }
  }

  addFacilityEnity() {
    this.tradingPartnerDetails.contactDocument.connectToEntity.facility.push({
      id: '',
      type: 'Facility',
      roles: [],
    });
  }

  //Restaurant

  removeRestaurantEnity(i) {
    if (
      this.tradingPartnerDetails.contactDocument.connectToEntity.restaurant
        .length > 1
    ) {
      this.tradingPartnerDetails.contactDocument.connectToEntity.restaurant.splice(
        i,
        1
      );
    }
  }

  addRestaurantEnity() {
    this.tradingPartnerDetails.contactDocument.connectToEntity.restaurant.push({
      id: '',
      type: 'Restaurant',
      roles: [],
    });
  }
  multiSelectOnChange(event) {
    console.log(event);
  }
  createContactFormGroup: FormGroup = this._formBuilder.group({
    connectTp: this._formBuilder.array([]),
    connectFacility: this._formBuilder.array([]),
    connectMember: this._formBuilder.array([]),
    connectRestaurant: this._formBuilder.array([]),
  });

  get connectTp() {
    return this.createContactFormGroup.controls['connectTp'] as FormArray;
  }
  createConnectTp() {
    const connectTpForm = this._formBuilder.group({
      tradingPartner: [''],
      roleType: [''],
    });
    this.connectTp.push(connectTpForm);
  }
  deleteconnectTp(id) {
    this.connectTp.removeAt(id);
  }
  onSubmit(form) {
    this.alignmentHasError=0;
    if (form.valid) {
      if (this.tradingPartnerDetails) {
        this.tradingPartnerDetails.contactDocument.alignments = [];
        if (
          this.tradingPartnerDetails.contactDocument?.connectToEntity &&
          this.tradingPartnerDetails.contactDocument?.connectToEntity
            .trading_partner?.length > 0
        ) {
          for (
            let t = 0;
            t <
            this.tradingPartnerDetails.contactDocument?.connectToEntity
              .trading_partner?.length;
            t++
          ) {
            let cInfo: any;
            if (typeof this.tradingPartnerDetails.contactDocument?.connectToEntity
              .trading_partner[t].id === "string") {
              // get info based on Id
              let objInfo = this.mappedTradingpartners.filter(tp => tp.name === this.tradingPartnerDetails.contactDocument?.connectToEntity
                .trading_partner[t].id);
              if (objInfo && objInfo.length > 0)
                cInfo = objInfo[0];

            }
            else {
              cInfo = this.tradingPartnerDetails.contactDocument?.connectToEntity
                .trading_partner[t].id;
            }

            if (cInfo) {
              let align: Alignment = {
                id: cInfo.id,
                type: 'Trading Partner',
                roles:
                  this.tradingPartnerDetails.contactDocument?.connectToEntity
                    .trading_partner[t].roles,
              };

              this.tradingPartnerDetails.contactDocument?.alignments.push(align);
            }
          }
        }
        if (
          this.tradingPartnerDetails.contactDocument?.connectToEntity &&
          this.tradingPartnerDetails.contactDocument?.connectToEntity.facility
            ?.length > 0
        ) {
          for (
            let f = 0;
            f <
            this.tradingPartnerDetails.contactDocument?.connectToEntity.facility
              ?.length;
            f++
          ) {
            let cInfo: any;
            if (typeof this.tradingPartnerDetails.contactDocument?.connectToEntity
              .facility[f].id === "string") {
              // get info based on Id
              let objInfo = this.mappedFacilities.filter(tp => tp.name === this.tradingPartnerDetails.contactDocument?.connectToEntity
                .facility[f].id);
              if (objInfo && objInfo.length > 0)
                cInfo = objInfo[0];

            }
            else {
              cInfo = this.tradingPartnerDetails.contactDocument?.connectToEntity
                .facility[f].id;
            }
            if (cInfo) {
              let align: Alignment = {
                id: cInfo.id,
                type: 'Facility',
                roles:
                  this.tradingPartnerDetails.contactDocument?.connectToEntity
                    .facility[f].roles,
              };
              this.tradingPartnerDetails.contactDocument?.alignments.push(align);
            }
          }
        }
        if (
          this.tradingPartnerDetails.contactDocument?.connectToEntity &&
          this.tradingPartnerDetails.contactDocument?.connectToEntity.franchisee
            ?.length > 0
        ) {


          for (
            let f = 0;
            f <
            this.tradingPartnerDetails.contactDocument?.connectToEntity
              .franchisee?.length;
            f++
          ) {

            let cInfo: any;
            if (typeof this.tradingPartnerDetails.contactDocument?.connectToEntity
              .franchisee[f].id === "string") {
              // get info based on Id
              let objInfo = this.mappedFranchisees.filter(tp => tp.name === this.tradingPartnerDetails.contactDocument?.connectToEntity
                .franchisee[f].id);
              if (objInfo && objInfo.length > 0)
                cInfo = objInfo[0];

            }
            else {
              cInfo = this.tradingPartnerDetails.contactDocument?.connectToEntity
                .franchisee[f].id;
            }
            if (cInfo) {
              let align: Alignment = {
                id: cInfo.id,
                type: 'Franchisee',
                roles:
                  this.tradingPartnerDetails.contactDocument?.connectToEntity
                    .franchisee[f].roles,
              };
              this.tradingPartnerDetails.contactDocument?.alignments.push(align);
            }
          }
        }
        if (
          this.tradingPartnerDetails.contactDocument?.connectToEntity &&
          this.tradingPartnerDetails.contactDocument?.connectToEntity.restaurant
            ?.length > 0
        ) {
          for (
            let f = 0;
            f <
            this.tradingPartnerDetails.contactDocument?.connectToEntity
              .restaurant?.length;
            f++
          ) {
            let cInfo: any;
            if (typeof this.tradingPartnerDetails.contactDocument?.connectToEntity
              .restaurant[f].id === "string") {
              // get info based on Id
              let objInfo = this.mappedRestaurants.filter(tp => tp.name === this.tradingPartnerDetails.contactDocument?.connectToEntity
                .restaurant[f].id);
              if (objInfo && objInfo.length > 0)
                cInfo = objInfo[0];

            }
            else {
              cInfo = this.tradingPartnerDetails.contactDocument?.connectToEntity
                .restaurant[f].id;
            }
            if (cInfo) {
              let align: Alignment = {
                id: cInfo.id,
                type: 'Restaurant',
                roles:
                  this.tradingPartnerDetails.contactDocument?.connectToEntity
                    .restaurant[f].roles,
              };
              this.tradingPartnerDetails.contactDocument?.alignments.push(align);
            }
          }
        }
      }
      if(this.alignmentHasError !=0){
        return;
      }
      if (
        this.tradingPartnerDetails.contactDocument.postal_addresses?.length > 0
      ) {
        this.tradingPartnerDetails.contactDocument.postal_addresses.forEach(
          (element) => {
            element.state_code = this.allStates.find(
              (x) =>
                x.state_name.toLowerCase() == element.state_name.toLowerCase()
            )?.state_code;
            element.country_code = this.allCountries.find(
              (x) =>
                x.country_name.toLowerCase() ==
                element.country_name.toLowerCase()
            )?.country_code;
          }
        );
      }

      if (
        this.tradingPartnerDetails.contactDocument.electronic_addresses
          .electronic_email_addresses?.length > 0
      ) {
        this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_email_addresses.forEach(
          (ec) => (ec.website = ec.email)
        );

        let emailAddress =
          this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_email_addresses.filter(
            function (email) {
              return email.type === 'Email';
            }
          );

        let webistAddress =
          this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_email_addresses.filter(
            function (email) {
              return email.type === 'Website';
            }
          );
        if (webistAddress?.length > 0) {
          webistAddress = webistAddress.filter(function (props) {
            delete props.email;
            return true;
          });
        }
        if (emailAddress?.length > 0) {
          emailAddress = emailAddress.filter(function (props) {
            delete props.website;
            return true;
          });
        }

        this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_email_addresses =
          emailAddress;
        // web site
        this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_website_addresses =
          webistAddress;
        if (
          this.tradingPartnerDetails.contactDocument.electronic_addresses
            .electronic_website_addresses?.length > 0
        ) {
          this.tradingPartnerDetails.contactDocument.electronic_addresses.electronic_website_addresses.forEach(
            (website) => (website.type = 'Website')
          );
        }
      }

      this.contactService
        .edit(this.tradingPartnerDetails.id, this.tradingPartnerDetails)
        .subscribe({
          next: (response: any) => {
            this.toastr.success(
              'Contact details has been updated successfully!'
            );
            this.router.navigate(['trading-partners/contact/view/' + this.tradingPartnerDetails.id])
          },
          error: (e) => {
            console.error(e);
          },
          complete: () => console.info('complete'),
        });
    } else {
      console.log('fill required fieds', form);
    }
  }
  getFacilityName(id: string) {
    try {
      if (this.mappedFacilities) {
        let facilityInfo = this.mappedFacilities.filter((facility) => facility.id === id);
        return (facilityInfo && facilityInfo.length > 0 ? facilityInfo[0].name : id);
      }
    }
    catch {
    }
    return id;
  }
  getTradingPartnerName(id: string) {
    try {
      if (this.mappedTradingpartners) {
        let tpinfo = this.mappedTradingpartners.filter((tp) => tp.id === id);
        return (tpinfo && tpinfo.length > 0 ? tpinfo[0].name : id);
      }
    }
    catch {

    }
    return id;
  }
  getFranchiseName(id: string) {
    try {
      if (this.mappedFranchisees) {
        let franchiseesinfo = this.mappedFranchisees.filter((franchisee) => franchisee.id === id);
        return (franchiseesinfo && franchiseesinfo.length > 0 ? franchiseesinfo[0].name : id);
      }
    }
    catch {

    }
    return id;

  }
  getRestaurantName(id: string) {
    try {
      if (this.mappedRestaurants) {
        let restinfo = this.mappedRestaurants.filter((restaurant) => restaurant.id === id)
        return (restinfo && restinfo.length > 0 ? restinfo[0].name : id);
      }
    }
    catch {

    }
    return id;

  }

  getFacilityNameById(id: string) {
    if (!this.mappedFacilities) this.mappedTradingpartners = [];
    this.tpFacilityService.getFacilityById(id).subscribe((res: any) => {
      this.mappedFacilities.push(res);

    });
  }
  getTradingPartnerNameById(id: string) {
    if (!this.mappedTradingpartners) this.mappedTradingpartners = [];
    this.tradingPartnerService.getTradingPartnersById(id).subscribe((res: any) => {
      this.mappedTradingpartners.push(res);

    });
  }

  getFranchiseNameById(id: string) {
    if (!this.mappedFranchisees) this.mappedFranchisees = [];
    this.franchiseeService.getFranchiseById(id).subscribe((res: any) => {
      this.mappedFranchisees.push(res);

    });
  }
  getRestaurantNameById(id: string) {
    if (!this.mappedRestaurants) this.mappedRestaurants = [];
    this.restaurantService.getRestaurantById(id).subscribe((res: any) => {
      this.mappedRestaurants.push(res);

    });
  }


  createNewContanct() {
    this.router.navigateByUrl('/trading-partners/contact/create');
  }
  gotoEdit() {
    this.router.navigateByUrl(
      '/trading-partners/contact/edit/' + this.contactId
    );
  }
  opendeleteModal(deletecontact) {
    this.open(deletecontact);
  }
  deletecontactbyId() {
    this.contactService.delete(this.tradingPartnerDetails.id).subscribe({
      next: (response: any) => {
        this.close();
        this.toastr.success(
          `${this.tradingPartnerDetails.firstName} ${this.tradingPartnerDetails.lastName} deleted successfully.`,
          'Success'
        );
        this.router.navigateByUrl('/all-contacts');
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => console.info('complete'),
    });
  }
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }
  close() {
    this.modalService.dismissAll();
  }

  goBackToView() {
    this.router.navigate(['trading-partners/contact/view/' + this.tradingPartnerDetails.id])
  }

  changePrimary(array, arrayName, index, item) {

    for (let i = 0; i < array.length; i++) {
      if (item.target.checked && index !== i) {
        array[i].is_primary = false
      }
      if (!item.target.checked) {
        array[0].is_primary = true
      }
    }
  }
  hideDivPh(i) {

    if (document.getElementById('icon-up_ph' + i).style.display == "inline-block") {
      document.getElementById('icon-down_ph' + i).style.display = "inline-block";
      document.getElementById('icon-up_ph' + i).style.display = "none";
    }
    else {
      document.getElementById('icon-down_ph' + i).style.display = "none";
      document.getElementById('icon-up_ph' + i).style.display = "inline-block";
    }
  }
  postalmoreInfoOpen: boolean = false
  hideDivPostal(i) {
    this.postalmoreInfoOpen=!this.postalmoreInfoOpen
    if (this.postalmoreInfoOpen) {
      document.getElementById('icon-down_postal' + i).style.display = "none";
      document.getElementById('icon-up_postal' + i).style.display = "inline-block";
    }
    else {
      document.getElementById('icon-down_postal' + i).style.display = "inline-block";
      document.getElementById('icon-up_postal' + i).style.display = "none";
    }
  }
  emailMoreInfoOpen: boolean = false;
  hideDivEmail(i) {
    this.emailMoreInfoOpen = !this.emailMoreInfoOpen;
    if (!this.emailMoreInfoOpen) {
      document.getElementById('icon-down_email' + i).style.display = "inline-block";
      document.getElementById('icon-up_email' + i).style.display = "none";
    }
    else {
      document.getElementById('icon-down_email' + i).style.display = "none";
      document.getElementById('icon-up_email' + i).style.display = "inline-block";
    }
  }

  selectExistingTradingPartnerEvent(tp, id: string) {

    this.tradingPartnerInfo = tp;
    let existTp = this.mappedTradingpartners.filter(tp => tp.id === id);
    if (existTp && existTp.length > 0) {
      this.tradingPartnerInfo = existTp[0];
      this.selectTradingPartnerEvent(existTp[0]);
    }
  }
  selectExistingTradingPartnerEventName(tp, id: string) {

    this.tradingPartnerInfo = tp;
    let existTp = this.mappedTradingpartners.filter(tp => tp.id === id);
    if (existTp && existTp.length > 0) {
      this.tradingPartnerInfo = existTp[0];
      //  this.selectTradingPartnerEvent(existTp[0]);
      return this.tradingPartnerInfo.name;
    }
  }

  selectExistingTradingPartnerEventId(id: string) {

    let existTp = this.mappedTradingpartners.filter(tp => tp.id === id);
    if (existTp && existTp.length > 0) {
      this.tradingPartnerInfo = existTp[0];
      //  this.selectTradingPartnerEvent(existTp[0]);
      return this.tradingPartnerInfo.name;
    }
    return null;
  }


  selectTradingPartnerEvent(tp) {

    this.tradingPartnerInfo = tp;
  }

  onChangeSearchTradingPartner($event, id) {
    if ($event && $event.length >= 3) {
      this.tradingPartnerService.getAllTradingPartnerInfo("?Filters=name@=*" + $event + "&PageNumber=1&PageSize=20").subscribe(res => {
        this.tradingpartners = res.body;
      });
    }
  }
  onFocusedTradingPartner(e) {
    // do something when input is focused
  }


  //Restaurant


  selectExistingRestEvent(tp, id: string) {

    this.restInfo = tp;
    let existRest = this.mappedTradingpartners.filter(tp => tp.id === id);
    if (existRest && existRest.length > 0) {
      this.restInfo = existRest[0];
      this.selectRestEvent(existRest[0]);
    }
  }
  selectExistingRestEventName(tp, id: string) {

    this.restInfo = tp;
    let existTp = this.mappedRestaurants.filter(tp => tp.id === id);
    if (existTp && existTp.length > 0) {
      this.restInfo = existTp[0];
      //  this.selectTradingPartnerEvent(existTp[0]);
      return this.restInfo.name;
    }
  }

  selectExistingRestEventId(id: string) {

    let existTp = this.mappedRestaurants.filter(tp => tp.id === id);
    if (existTp && existTp.length > 0) {
      this.restInfo = existTp[0];
      //  this.selectTradingPartnerEvent(existTp[0]);
      return this.restInfo.name;
    }
    return null;
  }


  selectRestEvent(tp) {

    this.restInfo = tp;
  }

  onChangeSearchRest($event, id) {
    if ($event && $event.length >= 3) {
      this.restaurantService.getAllRestaurants("?Filters=name@=*" + $event + "&PageNumber=1&PageSize=20").subscribe(res => {
        this.restaurants = res.body;
      });
    }
  }
  onFocusedRest(e) {
    // do something when input is focused
  }

  //  Franchisee


  selectExistingFranchiseeEvent(tp, id: string) {

    this.tradingPartnerInfo = tp;
    let existFranchisee = this.mappedFranchisees.filter(tp => tp.id === id);
    if (existFranchisee && existFranchisee.length > 0) {
      this.frInfo = existFranchisee[0];
      this.selectFranchiseeEvent(existFranchisee[0]);
    }
  }
  selectExistingFranchiseeEventName(tp, id: string) {

    this.frInfo = tp;
    let existTp = this.mappedFranchisees.filter(tp => tp.id === id);
    if (existTp && existTp.length > 0) {
      this.frInfo = existTp[0];
      //  this.selectTradingPartnerEvent(existTp[0]);
      return this.frInfo.name;
    }
  }

  selectExistingFranchiseeEventId(id: string) {

    let existTp = this.mappedFranchisees.filter(tp => tp.id === id);
    if (existTp && existTp.length > 0) {
      this.frInfo = existTp[0];
      //  this.selectTradingPartnerEvent(existTp[0]);
      return this.frInfo.name;
    }
    return null;
  }


  selectFranchiseeEvent(tp) {

    this.frInfo = tp;
  }

  onChangeSearchFranchisee($event, id) {
    if ($event && $event.length >= 3) {
      this.franchiseeService.getAllFranchiseesInfo("?Filters=name@=*" + $event + "&PageNumber=1&PageSize=20").subscribe(res => {
        this.franchisees = res.body;
      });
    }
  }
  onFocusedFranchisee(e) {
    // do something when input is focused
  }

  // Facility


  selectExistingFacilityEvent(tp, id: string) {

    this.facInfo = tp;
    let existFacility = this.mappedFacilities.filter(tp => tp.id === id);
    if (existFacility && existFacility.length > 0) {
      this.facInfo = existFacility[0];
      this.selectFacilityEvent(existFacility[0]);
    }
  }
  selectExistingFacilityEventName(tp, id: string) {

    this.facInfo = tp;
    let existTp = this.mappedFacilities.filter(tp => tp.id === id);
    if (existTp && existTp.length > 0) {
      this.facInfo = existTp[0];
      //  this.selectTradingPartnerEvent(existTp[0]);
      return this.facInfo.name;
    }
  }

  selectExistingFacilityEventId(id: string) {

    let existTp = this.mappedFacilities.filter(tp => tp.id === id);
    if (existTp && existTp.length > 0) {
      this.facInfo = existTp[0];
      //  this.selectTradingPartnerEvent(existTp[0]);
      return this.facInfo.name;
    }
    return null;
  }


  selectFacilityEvent(tp) {

    this.facInfo = tp;
  }

  onChangeSearchFacility($event, id) {
    if ($event && $event.length >= 3) {
      this.tpFacilityService.getAllFacilities("?Filters=name@=*" + $event + "&PageNumber=1&PageSize=20").subscribe(res => {
        this.facilities = res;
      });
    }
  }
  onFocusedFacility(e) {
    // do something when input is focused
  }

}
