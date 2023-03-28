import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as uuid from 'uuid';

import { LocationCodes } from 'src/app/models/location.codes';

import {
  Alignment,
  ContactDocument,
  contactInfo,
  ElectronicAddresses,
  ElectronicEmailAddress,
  ElectronicWebsiteAddress,
  Note,
  PhoneAddress,
  PostalAddress,
} from 'src/app/models/contact';
import {
  IMultiSelectOption,
  IMultiSelectSettings,
} from 'ngx-bootstrap-multiselect';
import { TradingPartnerService } from 'src/app/services/trading-partner.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Tenant } from 'src/app/models/tenant';
import { DatePipe } from '@angular/common';
import { electronicAddressesValidator } from 'src/app/helpers/customValidators';
import { DataService } from 'src/app/services/data.service';
import { TradingPartnerContactsService } from 'src/app/services/trading-partner-contacts.service';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { TradingPartnerFacilityService } from 'src/app/services/trading-partner-facility.service';
import { FranchiseService } from 'src/app/services/franchise.service';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-trading-partner-create-contact',
  templateUrl: './trading-partner-create-contact.component.html',
  styleUrls: ['./trading-partner-create-contact.component.scss'],
})
export class TradingPartnerCreateContactComponent implements OnInit {

  tpId: string;
  tpName: string;
  hastpId: boolean = false;

  contactsDto: contactInfo;
  tenant: Tenant;
  tpRolesModel: number[];
  tenant$ = this.localStorageService.tenantData$;
  tradingPartners: any[];
  tradingPartnerInfo: any;
  restaurantInfo: any;
  facilityInfo: any;
  franchiseeInfo: any;
  availableGeoLocations = LocationCodes;
  titles: any[]
  alignmentHasError = 0;
  postalAddressType: string[] = [
    'P.O. Box',
    'General Delivery',
    'Street Address',
  ];
  phoneAddressType: string[] = [
    'Home Phone',
    'Cell Phone',
    'Office Phone',
    'Fax',
    'Toll Free',
  ];
  electronicAddressType: string[]
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
    dynamicTitleMaxItems: 3,
    maxHeight: '300px',
    isLazyLoad: true,
    loadViewDistance: 1,
    stopScrollPropagation: true,
    selectAddedValues: true,
  };
  roleMultiSelect: IMultiSelectOption[] = [
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
  autoCompleteTpName = 'name';
  autoCompleteFacName = 'name';
  autoCompleteRestName = 'name';
  autoCompleteFrnchName = 'name';
  keyword = "name";


  constructor(
    private _formBuilder: FormBuilder,
    private dataService: DataService,
    private tradingPartnerService: TradingPartnerService,
    private tradingPartnerContactService: TradingPartnerContactsService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private tpFacilityService: TradingPartnerFacilityService,
    private franchiseeService: FranchiseService,
    private restaurantService: RestaurantService

  ) { }
  franchisees: any[];
  restaurants: any[];
  facilities: any[];
  intitalFormValues: any;


  createContactFormGroup: FormGroup = this._formBuilder.group({
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    suffix: ['', Validators.required],
    title: [null],

    phoneNumber: this._formBuilder.array([]),
    postalAddress: this._formBuilder.array([]),
    email: this._formBuilder.array([]),
    notes: this._formBuilder.array([]),
    connectTp: this._formBuilder.array([]),
    connectFacility: this._formBuilder.array([]),
    connectMember: this._formBuilder.array([]),
    connectRestaurant: this._formBuilder.array([]),
  });

  get phoneNumber() {
    return this.createContactFormGroup.controls['phoneNumber'] as FormArray;
  }

  addPhoneNumber() {
    const phoneNoForm = this._formBuilder.group({
      type: ['', Validators.required],
      areaCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      extentsion: [null],
      countryCode: ['', Validators.required],
      isPrimary: [true],
    });
    this.phoneNumber.push(phoneNoForm);
    // this.phoneNumber.setValidators(primaryErrorValidation(this.phoneNumber))
  }
  addPhoneNumberWithoutPrimary() {
    const phoneNoForm = this._formBuilder.group({
      type: ['', Validators.required],
      areaCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      extentsion: [null],
      countryCode: ['', Validators.required],
      isPrimary: [false],
    });
    this.phoneNumber.push(phoneNoForm);
  }
  deletePhoneNumber(id: number) {
    if (this.phoneNumber.value[id].isPrimary) {
      if (id == 0) {
        this.phoneNumber.controls[1].get('isPrimary').setValue(true)
      }
      else {
        this.phoneNumber.controls[0].get('isPrimary').setValue(true)
      }
    }
    this.phoneNumber.removeAt(id);
  }

  get postalAddress() {
    return this.createContactFormGroup.controls['postalAddress'] as FormArray;
  }

  addPostalAddress() {
    const postalAddressForm = this._formBuilder.group({
      type: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [null],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      isPrimary: [true],
    });
    this.postalAddress.push(postalAddressForm);
  }
  addPostalAddressWithoutPrimary() {
    const postalAddressForm = this._formBuilder.group({
      type: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [null],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      isPrimary: [false],
    });
    this.postalAddress.push(postalAddressForm);
  }
  deletePostalAddress(id: number) {
    if (this.postalAddress.value[id].isPrimary) {
      if (id == 0) {
        this.postalAddress.controls[1].get('isPrimary').setValue(true)
      }
      else {
        this.postalAddress.controls[0].get('isPrimary').setValue(true)
      }
    }
    this.postalAddress.removeAt(id);
  }

  get email() {
    return this.createContactFormGroup.controls['email'] as FormArray;
  }
  addEmail() {
    const emailForm = this._formBuilder.group({
      type: ['', Validators.required],
      email: ['', [Validators.required, electronicAddressesValidator('type')]],
      isPrimary: [true],
    });
    this.email.push(emailForm);
  }
  addEmailWithoutPrimary() {
    const emailForm = this._formBuilder.group({
      type: ['', Validators.required],
      email: ['', [Validators.required, electronicAddressesValidator('type')]],
      isPrimary: [false],
    });
    this.email.push(emailForm);
  }
  deleteEmail(id) {
    if (this.email.value[id].isPrimary) {
      if (id == 0) {
        this.email.controls[1].get('isPrimary').setValue(true)
      }
      else {
        this.email.controls[0].get('isPrimary').setValue(true)
      }
    }
    this.email.removeAt(id);
  }

  get notes() {
    return this.createContactFormGroup.controls['notes'] as FormArray;
  }
  addNotes() {
    const notesForm = this._formBuilder.group({
      notes: [''],
    });
    this.notes.push(notesForm);
  }
  deleteNotes(id) {
    this.notes.removeAt(id);
  }

  get connectTp() {
    return this.createContactFormGroup.controls['connectTp'] as FormArray;
  }
  createConnectTp() {
    const connectTpForm = this._formBuilder.group({
      tradingPartner: [''],
      roleType: [null],
    });
    this.connectTp.push(connectTpForm);


    // if (this.connectTp.value.length > 1) {
    //   for (let i = 0; i < this.connectTp.value.length; i++) {

    //     this.tradingPartners = this.tradingPartners.filter(
    //       (el) => el.id !== this.connectTp.value[i].tradingPartner
    //     );
    //   }
    // }
  }
  deleteconnectTp(id) {
    this.connectTp.removeAt(id);
  }

  get connectFacility() {
    return this.createContactFormGroup.controls['connectFacility'] as FormArray;
  }
  createconnectFacility() {
    const connectFacilityForm = this._formBuilder.group({
      facility: [''],
      roleType: [null],
    });
    this.connectFacility.push(connectFacilityForm);
  }
  deleteConnectFacility(id) {
    this.connectFacility.removeAt(id);
  }

  get connectMember() {
    return this.createContactFormGroup.controls['connectMember'] as FormArray;
  }
  createConnectMember() {
    const connectMemberForm = this._formBuilder.group({
      member: [''],
      roleType: [null],
    });
    this.connectMember.push(connectMemberForm);
  }
  deleteConnectMember(id) {
    this.connectMember.removeAt(id);
  }

  get connectRestaurant() {
    return this.createContactFormGroup.controls[
      'connectRestaurant'
    ] as FormArray;
  }
  createConnectToRestaurant() {
    const createConnectRestaurantForm = this._formBuilder.group({
      restaurant: [''],
      roleType: [null],
    });
    this.connectRestaurant.push(createConnectRestaurantForm);
  }
  deleteConnectToRestaurant(id) {
    this.connectRestaurant.removeAt(id);
  }

  ngOnInit(): void {
    this.tpId = this.router.url.split('/')[4];
    console.log(this.tpId);
    this.addPhoneNumber();
    this.addPostalAddress();
    this.addEmail();
    this.addNotes();
    this.createConnectTp();
    this.createconnectFacility();
    this.createConnectMember();
    this.createConnectToRestaurant();

    this.electronicAddressType = this.dataService.getAllEmailTypes()

    this.titles = this.dataService.getAllTitles()


    if (this.tpId) {
      this.tradingPartnerService.getById(this.tpId).subscribe((res) => {
        this.hastpId = true;
        this.tpName = res.name
      });
    }

    this.intitalFormValues = this.createContactFormGroup.value;
  }

  modifyData(formData) {
    const postalAddArray: PostalAddress[] = [];


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
        countryName:null
      };
      postalAddArray.push(postalAdd);
    }


    const phAddArray: PhoneAddress[] = [];
    for (let p = 0; p < formData.phoneNumber.length; p++) {
      let phAdd: PhoneAddress = {
        id: uuid.v4(),
        type: formData.phoneNumber[p].type,
        country_code: formData.phoneNumber[p].countryCode,
        area_code: formData.phoneNumber[p].areaCode,
        phone_number: formData.phoneNumber[p].phoneNumber,
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

    const notesArr: Note[] = [];

    for (let n = 0; n < formData.notes.length; n++) {
      let pipe = new DatePipe('en-US');
      const note: Note = {
        id: uuid.v4(),
        type: 'General',
        note: formData.notes[n].notes,
        created_on: new Date(),
        last_modified_by: 'scodesido',
      };
      notesArr.push(note);
    }

    const alignments: Alignment[] = [];

    for (var i = 0; i < formData.connectTp.length; i++) {
      let roles = [];
      if (formData.connectTp[i]?.roleType?.length > 0) {
        roles = formData.connectTp[i].roleType;
        roles = roles.filter((ele) => ele.length > 0);
      }
      if (formData.connectTp[i].tradingPartner.id) {
        const alignment: Alignment =
        {
          id: formData.connectTp[i].tradingPartner.id,
          type: 'Trading Partner',
          roles: roles,
        };
        alignments.push(alignment)
      }
    }

    for (var i = 0; i < formData.connectFacility.length; i++) {
      let roles = [];
      if (formData.connectFacility[i]?.roleType?.length > 0) {
        roles = formData.connectFacility[i].roleType;
        roles = roles.filter((ele) => ele.length > 0);
      }
      if (formData.connectFacility[i].facility.id) {
        const alignment: Alignment = {
          id: formData.connectFacility[i].facility.id,
          type: 'Facility',
          roles: roles,
        };
        alignments.push(alignment);
      }
    }

    for (var i = 0; i < formData.connectMember.length; i++) {
      let roles = [];
      if (formData.connectMember[i]?.roleType?.length > 0) {
        roles = formData.connectMember[i].roleType;
        roles = roles.filter((ele) => ele.length > 0);
      }
      if (formData.connectMember[i].member.id) {
        const alignment: Alignment = {
          id: formData.connectMember[i].member.id,
          type: "Franchisee",
          roles: roles,
        };
        alignments.push(alignment);
      }
    }

    for (var i = 0; i < formData.connectRestaurant.length; i++) {
      let roles = [];
      if (formData.connectRestaurant[i]?.roleType?.length > 0) {
        roles = formData.connectRestaurant[i].roleType;
        roles = roles.filter((ele) => ele.length > 0);
      }
      if (formData.connectRestaurant[i].restaurant.id) {
        const alignment: Alignment = {
          id: formData.connectRestaurant[i].restaurant.id,
          type: 'Restaurant',
          roles: roles,
        };
        alignments.push(alignment);
      }
    }

    const contactDoc: ContactDocument = {
      postal_addresses: postalAddArray,
      phone_addresses: phAddArray,
      electronic_addresses: elecAdd,
      notes: notesArr,
      contact_properties: null,
      alignments: alignments,
    };
    const reqBody: contactInfo = {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      suffix: formData.suffix,
      title: formData.title,
      conceptId: '',
      conceptKey: '',
      contactDocument: contactDoc,
    };

    return reqBody;
  }

  multiSelectOnChange(event) {
    console.log(this.connectTp);
  }

  createContact() {
    this.alignmentHasError = 0;
    this.createContactFormGroup.markAllAsTouched();
    if (this.createContactFormGroup.invalid) {
      console.log('fill required field');
    } else {
      const reqBody = this.modifyData(this.createContactFormGroup.value);
      //////
      this.localStorageService.loadTenant();
      this.tenant$.subscribe((tenant) => {
        this.tenant = tenant;
        reqBody.conceptKey = this.tenant.conceptKey;
        reqBody.conceptId = this.tenant.id.toString();
      });

      if (
        reqBody.contactDocument.electronic_addresses.electronic_email_addresses
          .length === 0
      ) {
        reqBody.contactDocument.electronic_addresses.electronic_email_addresses =
          null;
      }
      if (
        reqBody.contactDocument.electronic_addresses
          .electronic_website_addresses.length === 0
      ) {
        reqBody.contactDocument.electronic_addresses.electronic_website_addresses =
          null;
      }

      if (this.alignmentHasError != 0) {
        return
      }


      this.tradingPartnerContactService.addNew(reqBody).subscribe({
        next: (n) => {
          if (this.hastpId) {
            this.toastr.success('A Contact successfully been created!'),
              this.router.navigate(['/trading-partners/view/' + this.tpId + '/contact']);
          } else {
            this.toastr.success('A Contact successfully been created!'),
              this.router.navigate(['/all-contacts']);
          }
        },
        error: (e) => {
          console.log(e);
          this.toastr.error(
            'Sorry an error occurred while creating the contact.'
          );
        },
      });
    }
  }
  onIsPrimaryPhoneChecked(frm: any, item, index: number, crntlName: string) {
    const formArray: FormArray = this.createContactFormGroup.get(crntlName) as FormArray;

    for (let i = 0; i < formArray.value.length; i++) {
      if (item.target.checked && index !== i) {
        formArray.controls[i].get('isPrimary').setValue(false);

      }
      if (!item.target.checked) {
        formArray.controls[0].get('isPrimary').setValue(true);
      }
    }
  }

  selectTradingPartnerEvent(tp) {
    this.tradingPartnerInfo = tp;
  }

  onChangeSearchTradingPartner($event) {
    if ($event && $event.length >= 3) {
      this.tradingPartnerService.getAllTradingPartnerInfo("?Filters=name@=*" + $event + "&PageNumber=1&PageSize=20").subscribe(res => {
        this.tradingPartners = res.body;
      });
    }
  }
  onFocusedTradingPartner(e) {
    // do something when input is focused
  }

  selectFacilityEvent(facility) {
    this.facilityInfo = facility;
  }

  onChangeSearchFacility($event) {
    if ($event && $event.length >= 3) {
      this.tpFacilityService.getAllFacilitiesInfo("?Filters=name@=*" + $event + "&PageNumber=1&PageSize=20").subscribe(res => {
        this.facilities = res;
      });
    }
  }
  onFocusedFacility(e) {

  }
  onFocusedFranchisee(e) {
    // do something when input is focused
  }

  selectFranchiseeEvent(franchisee) {
    this.franchiseeInfo = franchisee;
  }

  onChangeSearchFranchisee($event) {
    if ($event && $event.length >= 3) {
      this.franchiseeService.getAllFranchiseesInfo("?Filters=name@=*" + $event + "&PageNumber=1&PageSize=20").subscribe(res => {
        this.franchisees = res.body;
      });
    }
  }

  selectRestaurantEvent(restInfo) {
    this.restaurantInfo = restInfo;
  }

  onChangeSearchRestaurant($event) {
    if ($event && $event.length >= 3) {
      this.restaurantService.getAllRestaurants("?Filters=name@=*" + $event + "&PageNumber=1&PageSize=20").subscribe(res => {
        this.restaurants = res.body;
      });
    }
  }
  onFocusedRestaurant(e) {
    // do something when input is focused
  }

  backtoContact() {
    this.hastpId ? this.router.navigate(['trading-partners/view/' + this.tpId + '/contact']) :
      this.router.navigate(['all-contacts'])
  }

}
