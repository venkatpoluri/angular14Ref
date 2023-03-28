import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LocationCodes } from 'src/app/models/location.codes';
import { Alignment, ElectronicAddresses, ElectronicEmailAddress, ElectronicWebsiteAddress, PhoneAddress, PostalAddress, RestaurantDocument, RestaurantDto, Status, Note } from 'src/app/models/restaurant';
import { Tenant } from 'src/app/models/tenant';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as uuid from 'uuid';
import { electronicAddressesValidator } from 'src/app/helpers/customValidators';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedEventService } from 'src/app/services/shared-event.service';
import { FranchiseService } from 'src/app/services/franchise.service';
import { TradingPartnerFacilityService } from 'src/app/services/trading-partner-facility.service';

@Component({
  selector: 'app-restaurant-info-details',
  templateUrl: './restaurant-info-details.component.html',
  styleUrls: ['./restaurant-info-details.component.scss']
})
export class RestaurantInfoDetailsComponent implements OnInit {
  conceptKey: string;
  conceptId: string;
  isCreate: boolean = false;
  isView: boolean = false;
  @Input() title;
  @Input() restaurantId;
  @Input() isEditing: boolean;
  readOnlyalignments: Alignment[];
  non_PrimaryPhoneAddress: PhoneAddress[];
  non_PrimaryPostalAddress: PostalAddress[];
  non_primaryEletronicsAddress: ElectronicEmailAddress[];
  franchiseeInfo: Alignment[];
  DCInfo: Alignment[];
  frachisees: any[];
  facilities: any[];
  activeStatuses: Status[];
  nonActiveStatues: Status[];

  dateFormat:any;
  alignedFranchisees: any;
  alignedFacilities: any;

  createRestaurantFormGroup: FormGroup = this._formBuilder.group({
    //name: ['', Validators.required],
    operatorName: ['', Validators.required],
    operatorNum: ['', Validators.required],
    projectedOpenDate: ['', Validators.required],
    dmaName: ['', Validators.required],
    dmaNumber: ['', Validators.required],
    regionalManager: ['', Validators.required],
    franchisee: [null, Validators.required],


    generalInfo: this._formBuilder.group({
      reportingUnitName: [''],
      reportingUnitNum: [''],
      landMarkDesc: [''],
      locationType: [null],
      locationGroup: [''],
      siteNum: [null],
      siteNumTransDate: [null],
      partkingSpace: [null],
      partkingSpaceType: [null],
      seatingCapacity: [null],
      mailAllowed: [null],
      dealType: [null],
      longitude: [''],
      latitude: [''],
      notes: ['']
    }),
    additionalInfo: this._formBuilder.group({
      rating: [null],
      archGroupType: [null],
      archType: [null],
      driveThruType: [null],
      driveThruCars: [null],
      playGroundType: [null],
      kitchenType: [null],
      dinningType: [null],
      propertyCD: [''],
      bldgArea: [null],
      bldgAreaUOM: [null],
      bldgFrontage: [null],
      bldgFrontageUOM: [null],
      landArea: [null],
      landAreaUOM: [null],
      landFrontageLength: [null],
      landFrontageLengthUOM: [null],
      operatorCompanyCD: [''],
      costCenterCD: [''],
      costGroup: [''],
      signImageCode: [''],
      signImageDate: [null],
      signImageExpInd: [''],
      debitCreditAllowedInd: [''],
      debitCreditTerms: [''],
      demographic: [''],
      opHrsStdCode: [''],
      opOpenCode: [''],
      opHrsLateNightCD: [''],
      opHrsEarlyBreakfastCD: [''],
      opHrs24CD: [''],
      crtCertDT: [null],
      crtCertInd: [null],
      crtIdfdInd: [null],
      reportingOptrName: [''],
      reportingOptrNum: ['']
    }),
    phoneNumber: this._formBuilder.array([]),
    postalAddress: this._formBuilder.array([]),
    email: this._formBuilder.array([]),
    statuses: this._formBuilder.array([])
  });
  restaurantDTO: RestaurantDto =
    {
      name: '',
      conceptId: '',
      conceptKey: '',
      restaurantDocument:
      {
        operator_name: '',
        franchise: false,
        dma_name: '',
        regional_manager: '',
        projected_open_date: new Date(),
        dma_number: null,
        operator_number: 0,
        last_updated_date: new Date(),
        reporting_unit_name: '',
        reporting_unit_number: '',
        landmark_description: '',
        location_type: '',
        location_group: '',
        site_number: '',
        site_number_transition_date: new Date(),
        parking_spaces: 0,
        parking_spaces_type: '',
        seating_capacity: 0,
        mail_allowed: false,
        deal_type: '',
        longitude: 0,
        latitude: 0,
        rating: '',
        arch_group_type: '',
        arch_type: '',
        // drive_thru_type_cars: '',
        drive_thru_cars: null,
        playground_type: '',
        kitchen_type: '',
        dining_type: '',
        property_code: '',
        building_area: 0,
        building_area_uom: '',
        building_frontage: 0,
        building_frontage_uom: '',
        land_area: 0,
        land_area_uom: '',
        land_frontage_length: 0,
        land_frontage_length_uom: '',
        operator_company_code: '',
        cost_center_code: '',
        cost_group_number: '',
        sign_image_code: '',
        sign_image_date: new Date(),
        sign_image_expiration_indicator: false,
        is_sign_image_expired: false,
        debit_credit_card_allowed_indicator: false,
        is_debit_credit_card_allowed: false,

        debit_credit_card_terms: '',
        demographic: '',
        operating_hours_standard_code: '',
        operating_open_code: '',
        operating_hours_late_night_code: '',
        operating_hours_early_breakfast_code: '',
        operating_hours_24_hours_code: '',
        crt_certification_date: new Date(),
        crt_certified_ind: false,
        is_crt_certified: false,
        crt_identified_ind: false,
        is_crt_identified: false,
        reporting_operator_number: '',
        reporting_operator_name: '',
        postal_addresses: [],
        phone_addresses: [],
        electronic_addresses:
        {
          electronic_email_addresses: [],
          electronic_website_addresses: []
        },
        notes: [],
        alignments: [],
        statuses: []
      }
    }
  constructor(private route: ActivatedRoute, private router: Router, private _formBuilder: FormBuilder,
    private toastr: ToastrService, private dataService: DataService, private localStorageService: LocalStorageService, private restaurantService: RestaurantService, private sharedEventService: SharedEventService, private franchiseeService: FranchiseService, private tpFacilityService: TradingPartnerFacilityService) {
  }

  ngOnInit(): void {
    this.postalAddressTypes = this.dataService.getAllPostalAddressTypes();
    this.allCountries = this.dataService.getAllCountries();
    this.allStates = this.dataService.getAllStates();
    this.allCities = this.dataService.getAllCities();
    this.allPhoneTypes = this.dataService.getAllPhoneTypes();
    this.allEmailTypes = this.dataService.getAllEmailTypes();
    this.locationTypes = this.dataService.getRestaurantLocationType();
    this.parkingSpacesTypes = this.dataService.getRestaurantParkingSpaces();
    this.ratingType = this.dataService.getRestaurantRating();
    this.archGroupTypes = this.dataService.getRestaurantArchGroupType();
    this.archTypes = this.dataService.getRestaurantArchType();
    this.driveThruTypes = this.dataService.getRestaurantDriveThruType();
    this.kitchenTypes = this.dataService.getRestaurantKitchenType();
    this.dinningTypes = this.dataService.getRestaurantDinningType();
    this.playgroundType = this.dataService.getRestaurantPlayGroundType();
    this.restaurantStatus = this.dataService.getRestaurantStatus();

    this.facilities = this.dataService.getAllFacilities();

    if (!this.restaurantId) {
      this.isCreate = true;
    }
    else {
      if (!this.isEditing) this.isView = true;
      this.franchiseeService.getAllLogicalFranchisees("").subscribe((res: any) => {
        this.frachisees = res.body;
      })

      this.restaurantService.getRestaurantById(this.restaurantId).subscribe((res: any) => {
        this.restaurantDTO = res;
        this.readOnlyalignments = this.restaurantDTO.restaurantDocument?.alignments;
        if (this.restaurantDTO.restaurantDocument?.alignments?.length > 0) {
          this.franchiseeInfo = this.restaurantDTO.restaurantDocument.alignments.filter(fr => fr.type === 'Franchisee' && (fr.thru_date == null || this.dateCheck(fr.from_dt, fr.thru_date, new Date())));
          if (this.franchiseeInfo && this.franchiseeInfo.length > 0) {
            let aFranchiseesIds =
              this.franchiseeInfo.map(frAligned => {
                return frAligned.aligned_id;
              })
            this.getAlignedFranchisee(aFranchiseesIds);
          }

          this.DCInfo = this.restaurantDTO.restaurantDocument.alignments.filter(dc => dc.type === 'Distribution Center' && (dc.thru_date == null || this.dateCheck(dc.from_dt, dc.thru_date, new Date())));
          if (this.DCInfo && this.DCInfo.length > 0) {
            let aFacilitiesIds =
              this.DCInfo.map(facAligned => {
                return facAligned.aligned_id;
              })
            this.getAlignedFacilities(aFacilitiesIds);
          }

        }
        if (this.restaurantDTO.restaurantDocument?.statuses?.length > 0) {
          this.activeStatuses = [];

          this.activeStatuses = this.restaurantDTO.restaurantDocument.statuses.filter(s => (s.thru_date == null || s.status === "Open" || this.dateCheck(s.from_date, s.thru_date, new Date())));
          if (this.activeStatuses?.length == 0)
            this.activeStatuses.push(this.restaurantDTO.restaurantDocument.statuses[0]);

          if (this.activeStatuses?.length > 0) {
            this.nonActiveStatues = this.restaurantDTO.restaurantDocument.statuses.filter(s => s.id != this.activeStatuses[0]?.id);
          }
          else {
            this.nonActiveStatues = this.restaurantDTO.restaurantDocument.statuses;
          }
        }
        else {
          this.activeStatuses = this.restaurantDTO.restaurantDocument.statuses;
        }

        this.sharedEventService.viewingRestaurantChange.emit(this.restaurantDTO);

        if (this.restaurantDTO) {
          if (!this.restaurantDTO.restaurantDocument.phone_addresses) {
            this.restaurantDTO.restaurantDocument.phone_addresses = [];
            this.addPhoneNumber();
          }
          if (!this.restaurantDTO.restaurantDocument.postal_addresses) {
            this.restaurantDTO.restaurantDocument.postal_addresses = [];
            this.addPostalAddress();
          }
          if (this.restaurantDTO.restaurantDocument.electronic_addresses) {

            if (
              !this.restaurantDTO.restaurantDocument.electronic_addresses
                ?.electronic_email_addresses
            ) {
              this.restaurantDTO.restaurantDocument.electronic_addresses.electronic_email_addresses = [];
            }
            if (
              !this.restaurantDTO.restaurantDocument.electronic_addresses
                ?.electronic_website_addresses
            ) {
              this.restaurantDTO.restaurantDocument.electronic_addresses.electronic_website_addresses =
                [];
            }
          } else {
            let webAddress: ElectronicWebsiteAddress[];
            let emailAddress: ElectronicEmailAddress[];
            let ele_address: ElectronicAddresses = { electronic_website_addresses: webAddress, electronic_email_addresses: emailAddress };
            this.restaurantDTO.restaurantDocument.electronic_addresses = ele_address;
          }
          if (this.restaurantDTO.restaurantDocument.electronic_addresses
            ?.electronic_email_addresses.length == 0 && this.restaurantDTO.restaurantDocument.electronic_addresses
              ?.electronic_website_addresses.length == 0) {
            this.addEmail();
          }

          if (
            this.restaurantDTO.restaurantDocument.electronic_addresses
              ?.electronic_website_addresses?.length > 0
          ) {

            if (
              this.restaurantDTO.restaurantDocument.electronic_addresses
                .electronic_email_addresses?.length > 0
            ) {
              for (
                let w = 0;
                w <
                this.restaurantDTO.restaurantDocument.electronic_addresses
                  .electronic_website_addresses?.length;
                w++
              ) {
                let websiteAddress: ElectronicEmailAddress = {
                  id: this.restaurantDTO.restaurantDocument
                    .electronic_addresses.electronic_website_addresses[w].id,
                  type: this.restaurantDTO.restaurantDocument
                    .electronic_addresses.electronic_website_addresses[w].type,
                  website:
                    this.restaurantDTO.restaurantDocument
                      .electronic_addresses.electronic_website_addresses[w]
                      .website,
                  email:
                    this.restaurantDTO.restaurantDocument
                      .electronic_addresses.electronic_website_addresses[w]
                      .website,
                  is_primary:
                    this.restaurantDTO.restaurantDocument
                      .electronic_addresses.electronic_website_addresses[w]
                      .is_primary,
                };
                this.restaurantDTO.restaurantDocument.electronic_addresses.electronic_email_addresses.push(
                  websiteAddress
                );
              }
            } else {
              this.restaurantDTO.restaurantDocument.electronic_addresses.electronic_email_addresses =
                [];
              for (
                let w = 0;
                w <
                this.restaurantDTO.restaurantDocument.electronic_addresses
                  .electronic_website_addresses?.length;
                w++
              ) {
                let websiteAddress: ElectronicEmailAddress = {
                  id: this.restaurantDTO.restaurantDocument
                    .electronic_addresses.electronic_website_addresses[w].id,
                  type: this.restaurantDTO.restaurantDocument
                    .electronic_addresses.electronic_website_addresses[w].type,
                  website:
                    this.restaurantDTO.restaurantDocument
                      .electronic_addresses.electronic_website_addresses[w]
                      .website,
                  email:
                    this.restaurantDTO.restaurantDocument
                      .electronic_addresses.electronic_website_addresses[w]
                      .website,
                  is_primary:
                    this.restaurantDTO.restaurantDocument
                      .electronic_addresses.electronic_website_addresses[w]
                      .is_primary,
                };
                this.restaurantDTO.restaurantDocument.electronic_addresses.electronic_email_addresses.push(
                  websiteAddress
                );
              }
            }
          }

          //  get non-primary
          this.non_PrimaryPhoneAddress = this.restaurantDTO.restaurantDocument.phone_addresses.filter(ph => ph.is_primary != true);
          this.non_PrimaryPostalAddress = this.restaurantDTO.restaurantDocument.postal_addresses.filter(ph => ph.is_primary != true);
          if (this.restaurantDTO.restaurantDocument.electronic_addresses?.electronic_email_addresses?.length > 0)
            this.non_primaryEletronicsAddress = this.restaurantDTO.restaurantDocument.electronic_addresses.electronic_email_addresses.filter(ph => ph.is_primary != true);
          this.updateFormDataFromAPI();
        }
      })
    }
    this.localStorageService.loadTenant();

    this.tenant$.subscribe((tenant) => {
      this.tenant = tenant;
      this.conceptKey = this.tenant.conceptKey;
      this.conceptId = this.tenant.id.toString();
    });

    this.sharedEventService.dateBasedOnRegion.subscribe((resp)=>{
      this.dateFormat=resp;
    })
  }

  getFranchiseeName(id) {
    return this.alignedFranchisees?.name;
    // if (this.alignedFranchisees?.length > 0) {
    //   const frFilter = this.alignedFranchisees.filter(fr => fr.id == id);
    //   return frFilter?.length > 0 ? frFilter[0].name : "";
    // }
    // return "";
  }

  getFacilityName(id) {
    return this.alignedFacilities?.name;
    // if (this.alignedFacilities?.length > 0) {
    //   const fcFilter = this.alignedFacilities.filter(fac => fac.id == id);
    //   return fcFilter?.length > 0 ? fcFilter[0].name : "";
    // }
    // return "";
  }

  updateFormDataFromAPI() {
    this.createRestaurantFormGroup.patchValue({
      name: this.restaurantDTO.name,
      operatorName: this.restaurantDTO.restaurantDocument.operator_name,


      operatorNum: this.restaurantDTO.restaurantDocument.operator_number,
      projectedOpenDate: this.restaurantDTO.restaurantDocument.projected_open_date,
      dmaName: this.restaurantDTO.restaurantDocument.dma_name,
      dmaNumber: this.restaurantDTO.restaurantDocument.dma_number,
      regionalManager: this.restaurantDTO.restaurantDocument.regional_manager,
      franchisee: this.restaurantDTO.restaurantDocument.is_franchisee ? "1" : "0",
      is_franchisee: this.restaurantDTO.restaurantDocument.is_franchisee,

      generalInfo:
      {
        reportingUnitName: this.restaurantDTO.restaurantDocument.reporting_unit_name ?? "",
        reportingUnitNum: this.restaurantDTO.restaurantDocument.reporting_unit_number ?? "",
        landMarkDesc: this.restaurantDTO.restaurantDocument.landmark_description,
        locationType: this.restaurantDTO.restaurantDocument.location_type,
        locationGroup: this.restaurantDTO.restaurantDocument.location_group,
        siteNum: this.restaurantDTO.restaurantDocument.site_number,
        siteNumTransDate: this.restaurantDTO.restaurantDocument.site_number_transition_date,
        partkingSpace: this.restaurantDTO.restaurantDocument.parking_spaces,
        partkingSpaceType: this.restaurantDTO.restaurantDocument.parking_spaces_type ?? null,
        seatingCapacity: this.restaurantDTO.restaurantDocument.seating_capacity,
        mailAllowed: this.restaurantDTO.restaurantDocument.is_mail_allowed ? "1" : "0",
        dealType: this.restaurantDTO.restaurantDocument.deal_type ?? null,
        longitude: this.restaurantDTO.restaurantDocument.longitude,
        latitude: this.restaurantDTO.restaurantDocument.latitude,
        notes: this.restaurantDTO.restaurantDocument.notes?.length > 0 ? this.restaurantDTO.restaurantDocument.notes[0].note : ""

      },
      additionalInfo:
      {
        rating: this.restaurantDTO.restaurantDocument.rating ?? null,
        archGroupType: this.restaurantDTO.restaurantDocument.arch_group_type ?? null,
        archType: this.restaurantDTO.restaurantDocument.arch_type ?? null,

        driveThruType: this.restaurantDTO.restaurantDocument.drive_thru_type ?? null,
        driveThruCars: this.restaurantDTO.restaurantDocument.drive_thru_cars,
        playGroundType: this.restaurantDTO.restaurantDocument.playground_type ?? null,
        kitchenType: this.restaurantDTO.restaurantDocument.kitchen_type ?? null,
        dinningType: this.restaurantDTO.restaurantDocument.dining_type ?? null,
        propertyCD: this.restaurantDTO.restaurantDocument.property_code,
        bldgArea: this.restaurantDTO.restaurantDocument.building_area,
        bldgAreaUOM: this.restaurantDTO.restaurantDocument.building_area_uom,
        bldgFrontage: this.restaurantDTO.restaurantDocument.building_frontage,
        bldgFrontageUOM: this.restaurantDTO.restaurantDocument.building_frontage_uom ?? null,
        landArea: this.restaurantDTO.restaurantDocument.land_area,
        landAreaUOM: this.restaurantDTO.restaurantDocument.land_area_uom,
        landFrontageLength: this.restaurantDTO.restaurantDocument.land_frontage_length,
        landFrontageLengthUOM: "Feet",
        operatorCompanyCD: this.restaurantDTO.restaurantDocument.operator_company_code,
        costCenterCD: this.restaurantDTO.restaurantDocument.cost_center_code,
        costGroup: this.restaurantDTO.restaurantDocument.cost_group_number,
        signImageCode: this.restaurantDTO.restaurantDocument.sign_image_code,
        signImageDate: this.restaurantDTO.restaurantDocument.sign_image_date,
        signImageExpInd: this.restaurantDTO.restaurantDocument.is_sign_image_expired ? "1" : "0",
        debitCreditAllowedInd: this.restaurantDTO.restaurantDocument.is_debit_credit_card_allowed ? "1" : "0",

        debitCreditTerms: this.restaurantDTO.restaurantDocument.debit_credit_card_terms,
        demographic: this.restaurantDTO.restaurantDocument.demographic,
        opHrsStdCode: this.restaurantDTO.restaurantDocument.operating_hours_standard_code,
        opOpenCode: this.restaurantDTO.restaurantDocument.operating_open_code,
        opHrsLateNightCD: this.restaurantDTO.restaurantDocument.operating_hours_late_night_code,
        opHrsEarlyBreakfastCD: this.restaurantDTO.restaurantDocument.operating_hours_early_breakfast_code,
        opHrs24CD: this.restaurantDTO.restaurantDocument.operating_hours_24_hours_code,
        crtCertDT: this.restaurantDTO.restaurantDocument.crt_certification_date,
        crtCertInd: this.restaurantDTO.restaurantDocument.is_crt_certified ? "1" : "0",
        crtIdfdInd: this.restaurantDTO.restaurantDocument.is_crt_identified ? "1" : "0",
        reportingOptrName: this.restaurantDTO.restaurantDocument.reporting_operator_name,
        reportingOptrNum: this.restaurantDTO.restaurantDocument.reporting_operator_number
      }
      // franchisee: this.restaurantDTO.restaurantDocument.is_franchisee?"1":"0",
    }
    );
    if (this.restaurantDTO.restaurantDocument.phone_addresses?.length > 0) {
      for (let ph = 0; ph < this.restaurantDTO.restaurantDocument.phone_addresses.length; ph++)
        this.addPhoneNumberWithValues(this.restaurantDTO.restaurantDocument.phone_addresses[ph]);
    }
    if (this.restaurantDTO.restaurantDocument.postal_addresses?.length > 0) {
      for (let ph = 0; ph < this.restaurantDTO.restaurantDocument.postal_addresses.length; ph++)
        this.addPostalAddressWithValues(this.restaurantDTO.restaurantDocument.postal_addresses[ph]);
    }
    if (this.restaurantDTO.restaurantDocument.electronic_addresses?.electronic_email_addresses?.length > 0) {
      for (let ph = 0; ph < this.restaurantDTO.restaurantDocument.electronic_addresses.electronic_email_addresses.length; ph++)
        this.addEmailWithValues(this.restaurantDTO.restaurantDocument.electronic_addresses.electronic_email_addresses[ph]);
    }
    //addStatusValues
    if (this.restaurantDTO.restaurantDocument.statuses?.length > 0) {
      for (let ph = 0; ph < this.restaurantDTO.restaurantDocument.statuses.length; ph++)
        this.addStatusValues(this.restaurantDTO.restaurantDocument.statuses[ph]);
    }

  }

  tenant: Tenant;
  tenant$ = this.localStorageService.tenantData$;

  postalAddressTypes: string[];
  allCities: any[];
  allStates: any[];
  allCountries: any[];
  allPhoneTypes: string[];
  allEmailTypes: string[];
  availableGeoLocations = LocationCodes;
  locationTypes: string[];
  parkingSpacesTypes: string[];
  ratingType: string[];
  archGroupTypes: string[];
  archTypes: string[];
  driveThruTypes: string[];
  kitchenTypes: string[];
  dinningTypes: string[];
  playgroundType: string[];
  restaurantStatus: string[];
  get phoneNumber() {
    return this.createRestaurantFormGroup.controls['phoneNumber'] as FormArray;
  }


  addPhoneNumber() {
    const phoneNoForm = this._formBuilder.group({
      id: [uuid.v4()],
      type: ['', Validators.required],
      areaCode: ['', Validators.required],
      phNumber: ['', Validators.required],
      extentsion: [''],
      countryCode: ['', Validators.required],
      isPrimary: [false],
    });
    this.phoneNumber.push(phoneNoForm);
  }
  addPhoneNumberWithValues(ph: PhoneAddress) {
    const phoneNoForm = this._formBuilder.group({
      id: [ph.id],
      type: [ph.type, Validators.required],
      areaCode: [ph.area_code, Validators.required],
      phNumber: [ph.phone_number, Validators.required],
      extentsion: [ph.phone_extension],
      countryCode: [ph.country_code, Validators.required],
      isPrimary: [ph.is_primary],
    });
    this.phoneNumber.push(phoneNoForm);
  }

  get postalAddress() {
    return this.createRestaurantFormGroup.controls['postalAddress'] as FormArray;
  }
  deletePhoneNumber(id: number) {
    this.phoneNumber.removeAt(id);
  }


  addPostalAddress() {
    const postalAddressForm = this._formBuilder.group({
      id: uuid.v4(),
      type: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      isPrimary: [false],
    });
    this.postalAddress.push(postalAddressForm);
  }

  addPostalAddressWithValues(pa: PostalAddress) {
    const postalAddressForm = this._formBuilder.group({
      id: pa.id,
      type: [pa.type, Validators.required],
      address1: [pa.address_1, Validators.required],
      address2: [pa.address_2],
      city: [pa.city, Validators.required],
      state: [pa.state_name, Validators.required],
      postalCode: [pa.postal_code, Validators.required],
      country: [pa.country_name, Validators.required],
      isPrimary: [pa.is_primary],
    });
    this.postalAddress.push(postalAddressForm);
  }
  deletePostalAddress(id: number) {
    this.postalAddress.removeAt(id);
  }

  get email() {
    return this.createRestaurantFormGroup.controls['email'] as FormArray;
  }
  addEmail() {
    const emailForm = this._formBuilder.group({
      id: uuid.v4(),
      type: ['', Validators.required],
      email: ['', [Validators.required, electronicAddressesValidator('type')]],
      isPrimary: [false],
    });
    this.email.push(emailForm);
  }
  addEmailWithValues(ea: ElectronicEmailAddress) {
    const emailForm = this._formBuilder.group({
      id: ea.id,
      type: [ea.type, Validators.required],
      email: [ea.email, Validators.required],
      isPrimary: [ea.is_primary],
    });
    this.email.push(emailForm);
  }
  deleteEmail(id) {
    this.email.removeAt(id);
  }

  get statuses() {
    return this.createRestaurantFormGroup.controls['statuses'] as FormArray;
  }
  addStatus() {
    const statusForm = this._formBuilder.group({
      id: uuid.v4(),
      status: ['', Validators.required],
      fromDate: ['', Validators.required],
      thruDate: ['']
    },
      { validator: this.endDateWithOptionalValidator('fromDate', 'thruDate') });
    this.statuses.push(statusForm);
  }
  endDateWithOptionalValidator(startDate: string, endDate: string) {
    return (formGroup: FormGroup) => {
      const startDateControl = formGroup.controls[startDate]
      const endDateControl = formGroup.controls[endDate]
      if (!startDateControl || !endDateControl) {
        return null;
      }
      if (endDateControl.hasError('required') && !endDateControl.hasError('endDateControl')) {
        return null;
      }
      if (endDateControl.value) {
        if (new Date(startDateControl.value) > new Date(endDateControl.value)) {
          endDateControl.setErrors({ endDateError: true })
        } else {
          endDateControl.setErrors(null);
        }
      }
      else {
        endDateControl.setErrors(null);
      }
    }
  }
  addStatusValues(s: Status) {

    const statusForm = this._formBuilder.group({
      id: s.id,
      status: [s.status, Validators.required],
      fromDate: [s.from_date.toString(), Validators.required],
      thruDate: [s.thru_date ?? ""]
    });
    this.statuses.push(statusForm);
  }
  deleteStatus(id) {
    this.statuses.removeAt(id);
  }

  getPostBody(formData) {

    let postalAddArray: PostalAddress[] = [];

    for (let p = 0; p < formData.postalAddress.length; p++) {
      let postalAdd: PostalAddress = {
        id: uuid.v4(),
        type: formData.postalAddress[p].type,
        address_1: formData.postalAddress[p].address1,
        address_2: formData.postalAddress[p].address2,
        city: formData.postalAddress[p].city,
        state_type: null,
        state_name: formData.postalAddress[p].state,
        state_code: null,
        country_name: formData.postalAddress[p].country,
        country_code: null,
        postal_code: formData.postalAddress[p].postalCode,
        is_concept_provided: false,
        is_primary: formData.postalAddress[p].isPrimary,
        is_emergency_contact: false,
        is_do_not_contact: false,
        note: null,
        latitude: null,
        longitude: null,
      };
      postalAddArray.push(postalAdd);
    }
    try {
      if (postalAddArray?.length > 0) {
        postalAddArray.forEach(
          (element) => {
            element.state_code = this.allStates.find(
              (x) =>
                x.state_name.toLowerCase() == element.state_name.toLowerCase()
            ).state_code;
            element.country_code = this.allCountries.find(
              (x) =>
                x.country_name.toLowerCase() ==
                element.country_name.toLowerCase()
            ).country_code;
          }
        );
      }
    }
    catch (e) {
    }

    const phAddArray: PhoneAddress[] = [];
    for (let p = 0; p < formData.phoneNumber.length; p++) {
      let phAdd: PhoneAddress = {
        id: uuid.v4(),
        type: formData.phoneNumber[p].type,
        country_code: formData.phoneNumber[p].countryCode,
        area_code: formData.phoneNumber[p].areaCode,
        phone_number: formData.phoneNumber[p].phNumber,
        phone_extension: formData.phoneNumber[p].extentsion,
        is_concept_provided: false,
        is_primary: formData.phoneNumber[p].isPrimary,
        is_emergency_contact: false,
        is_do_not_contact: false,
        note: null,
      };
      phAddArray.push(phAdd);
    }

    const emailArr: ElectronicEmailAddress[] = [];
    const websiteArr: ElectronicWebsiteAddress[] = [];

    for (let e = 0; e < formData.email.length; e++) {
      if (formData.email[e].type === 'Email') {
        const emailAdd: ElectronicEmailAddress = {
          id: uuid.v4(),
          type: formData.email[e].type,
          email: formData.email[e].email,
          is_concept_provided: false,
          is_primary: formData.email[e].isPrimary,
          is_emergency_contact: false,
          is_do_not_contact: false,
          note: null,
        };
        emailArr.push(emailAdd);
      }
      if (formData.email[e].type === 'Website') {
        const webAdd: ElectronicWebsiteAddress = {
          id: uuid.v4(),
          type: formData.email[e].type,
          website: formData.email[e].email,
          is_concept_provided: false,
          is_primary: formData.email[e].isPrimary,
          is_emergency_contact: false,
          is_do_not_contact: false,
          note: null,
        };
        websiteArr.push(webAdd);
      }
    }

    const elecAdd: ElectronicAddresses = {
      electronic_email_addresses: emailArr,
      electronic_website_addresses: websiteArr,
    };


    const statusAddArray: Status[] = [];
    for (let p = 0; p < formData.statuses.length; p++) {
      let statusAdd: Status = {
        id: uuid.v4(),
        status: formData.statuses[p].status,
        from_date: formData.statuses[p].fromDate,
        thru_date: (formData.statuses[p].thruDate === "" ? null : formData.statuses[p].thruDate)
      };
      statusAddArray.push(statusAdd);
    }

    const notes: Note[] =
      [
        {
          id: uuid.v4(),
          type: 'General',
          note: formData.generalInfo.notes,
          created_on: new Date()
        }
      ];

    const restaurantDoc: RestaurantDocument = {
      postal_addresses: postalAddArray,
      phone_addresses: phAddArray,
      electronic_addresses: elecAdd,
      franchise: Boolean(formData.franchisee),
      is_franchisee: Boolean(Number(formData.franchisee)),
      regional_manager: formData.regionalManager,
      operator_name: formData.operatorName,
      operator_number: Number(formData.operatorNum),
      projected_open_date: formData.projectedOpenDate,
      dma_name: formData.dmaName,
      dma_number: Number(formData.dmaNumber),
      // general info
      reporting_unit_name: formData.generalInfo.reportingUnitName,
      reporting_unit_number: formData.generalInfo.reportingUnitNum,
      landmark_description: formData.generalInfo.landMarkDesc,
      location_type: formData.generalInfo.locationType,
      location_group: formData.generalInfo.locationGroup,
      site_number: formData.generalInfo.siteNum,
      site_number_transition_date: formData.generalInfo.siteNumTransDate,
      parking_spaces: Number(formData.generalInfo.partkingSpace),
      parking_spaces_type: formData.generalInfo.partkingSpaceType,
      seating_capacity: Number(formData.generalInfo.seatingCapacity),
      mail_allowed: Boolean(Number(formData.generalInfo.mailAllowed)),
      is_mail_allowed: Boolean(Number(formData.generalInfo.mailAllowed)),
      deal_type: formData.generalInfo.dealType,
      longitude: Number(formData.generalInfo.longitude),
      latitude: Number(formData.generalInfo.latitude),

      // additional info
      rating: formData.additionalInfo.rating ?? null,
      arch_group_type: formData.additionalInfo.archGroupType ?? null,
      arch_type: formData.additionalInfo.archType ?? null,
      drive_thru_type: formData.additionalInfo.driveThruType ?? null,
      //drive_thru_type_cars: formData.additionalInfo.driveThruCars,
      drive_thru_cars: Number(formData.additionalInfo.driveThruCars),
      playground_type: formData.additionalInfo.playGroundType ?? null,
      kitchen_type: formData.additionalInfo.kitchenType ?? null,
      dining_type: formData.additionalInfo.dinningType ?? null,
      property_code: formData.additionalInfo.propertyCD,
      building_area: Number(formData.additionalInfo.bldgArea),
      building_area_uom: formData.additionalInfo.bldgAreaUOM,
      building_frontage: Number(formData.additionalInfo.bldgFrontage),
      building_frontage_uom: formData.additionalInfo.bldgFrontageUOM,
      land_area: Number(formData.additionalInfo.landArea),
      land_area_uom: formData.additionalInfo.landAreaUOM,
      land_frontage_length: Number(formData.additionalInfo.landFrontageLength),
      land_frontage_length_uom: formData.additionalInfo.landFrontageLengthUOM,
      operator_company_code: formData.additionalInfo.operatorCompanyCD,
      cost_center_code: formData.additionalInfo.costCenterCD,
      cost_group_number: formData.additionalInfo.costGroup,
      sign_image_code: formData.additionalInfo.signImageCode,
      sign_image_date: formData.additionalInfo.signImageDate,
      sign_image_expiration_indicator: Boolean(Number(formData.additionalInfo.signImageExpInd)),
      is_sign_image_expired: Boolean(Number(formData.additionalInfo.signImageExpInd)),
      is_debit_credit_card_allowed: Boolean(Number(formData.additionalInfo.debitCreditAllowedInd)),
      debit_credit_card_terms: formData.additionalInfo.debitCreditTerms,
      demographic: formData.additionalInfo.demographic,
      operating_hours_standard_code: formData.additionalInfo.opHrsStdCode,
      operating_open_code: formData.additionalInfo.opOpenCode,
      operating_hours_late_night_code: formData.additionalInfo.opHrsLateNightCD,
      operating_hours_early_breakfast_code: formData.additionalInfo.opHrsEarlyBreakfastCD,
      operating_hours_24_hours_code: formData.additionalInfo.opHrs24CD,
      crt_certification_date: formData.additionalInfo.crtCertDT,
      is_crt_certified: Boolean(Number((formData.additionalInfo.crtCertInd))),
      is_crt_identified: Boolean(Number(formData.additionalInfo.crtIdfdInd)),
      reporting_operator_number: formData.additionalInfo.reportingOptrNum,
      reporting_operator_name: formData.additionalInfo.reportingOptrName,
      notes: notes,
      restaurant_history: null,
      alignments: this.readOnlyalignments,
      statuses: statusAddArray
    };



    const reqBody: RestaurantDto = {
      name: this.restaurantDTO.name,
      num: this.restaurantDTO.num,
      conceptId: this.conceptId,
      conceptKey: this.conceptKey,
      restaurantDocument: restaurantDoc
    };
    return reqBody;
  }

  get franchisee() {
    return this.createRestaurantFormGroup.get('alignmentInfo').get('franchisee');
  }
  get alignStartDate() {
    return this.createRestaurantFormGroup.get('alignmentInfo').get('fromDate');
  }
  get statusStartDate() {

    let tests: any = this.createRestaurantFormGroup.get('statusInfo').get('fromDate');
    return this.createRestaurantFormGroup.get('statusInfo').get('fromDate');
  }
  get statusName() {
    return this.createRestaurantFormGroup.get('statusInfo').get('status');
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
  hideDivPostal(i) {

    if (document.getElementById('icon-up_postal' + i).style.display == "inline-block") {
      document.getElementById('icon-down_postal' + i).style.display = "inline-block";
      document.getElementById('icon-up_postal' + i).style.display = "none";
    }
    else {
      document.getElementById('icon-down_postal' + i).style.display = "none";
      document.getElementById('icon-up_postal' + i).style.display = "inline-block";
    }
  }

  hideDivEmail(i) {

    if (document.getElementById('icon-up_email' + i).style.display == "inline-block") {
      document.getElementById('icon-down_email' + i).style.display = "inline-block";
      document.getElementById('icon-up_email' + i).style.display = "none";
    }
    else {
      document.getElementById('icon-down_email' + i).style.display = "none";
      document.getElementById('icon-up_email' + i).style.display = "inline-block";
    }
  }

  hideDivStatus(i) {

    if (document.getElementById('icon-up_status' + i).style.display == "inline-block") {
      document.getElementById('icon-down_status' + i).style.display = "inline-block";
      document.getElementById('icon-up_status' + i).style.display = "none";
    }
    else {
      document.getElementById('icon-down_status' + i).style.display = "none";
      document.getElementById('icon-up_status' + i).style.display = "inline-block";
    }
  }
  dateCheck(from, to, check) {
    let fDate, lDate, cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);
    if ((cDate <= lDate && cDate >= fDate)) return true
    return false;
  }

  updateRestaurant() {

    // validation
    const reqBody = this.getPostBody(this.createRestaurantFormGroup.value);
    this.createRestaurantFormGroup.markAllAsTouched();
    this.getFormValidationErrors();
    if (this.createRestaurantFormGroup.invalid) {
      console.log('fill required field');
    } else {

      this.restaurantService.update(this.restaurantId, reqBody).subscribe({
        next: (n) => {
          this.toastr.success('A Restaurant successfully been updated!');
          this.router.navigateByUrl('franchise/restaurant/' + this.restaurantId + '/view/info');
        },
        error: (e) => {
          console.log(e);
          this.toastr.error(
            'Sorry an error occurred while updating the Restaurant.'
          );
        },
      });
    }
  }
  goback() {
    this.router.navigateByUrl('franchise/restaurant/' + this.restaurantId + '/view/info');
  }
  getFormValidationErrors() {

    console.log('%c ==>> Validation Errors: ', 'color: red; font-weight: bold; font-size:25px;');

    let totalErrors = 0;

    Object.keys(this.createRestaurantFormGroup.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.createRestaurantFormGroup.get(key).errors;
      if (controlErrors != null) {
        totalErrors++;
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });

    console.log('Number of errors: ', totalErrors);

  }
  onIsPrimaryAddressChecked(frm: any, item, index: number, crntlName: string) {
    const formArray: FormArray = this.createRestaurantFormGroup.get(crntlName) as FormArray;
    for (let i = 0; i < formArray.value.length; i++) {
      if (item.target.checked && index !== i) {
        formArray.controls[i].get('isPrimary').setValue(false);

      }
      if (!item.target.checked) {
        formArray.controls[0].get('isPrimary').setValue(true);
      }
    }
  }
  getAlignedFranchisees(ids: string[]) {
    this.franchiseeService.getFranchiseesByIds(ids).subscribe((res: any) => {
      this.alignedFranchisees = res;
    });
  }
  getAlignedFranchisee(ids: string[]) {
    if (ids && ids.length > 0) {
      this.franchiseeService.getFranchiseById(ids[0]).subscribe((res: any) => {
        this.alignedFranchisees = res;
      });
    }
  }
  getAlignedFacilities(ids: string[]) {
    if (ids && ids.length > 0) {
      this.tpFacilityService.getFacilityById(ids[0]).subscribe((res: any) => {
        this.alignedFacilities = res;
      });
    }
  }

}
