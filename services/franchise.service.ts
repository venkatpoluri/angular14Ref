import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gridview } from '../models/gridview';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class FranchiseService {
  private apiRoot: string = `${environment.envUrl}/api`;
  private headers = { 'content-type': 'application/json' };

  constructor(private http: HttpClient,private dataService:DataService) { }

  createFranchise(data: any) {
    const url = `${this.apiRoot}/franchisees`;
    return this.http.post<any>(url, JSON.stringify(data), { 'headers': this.headers });
  }

  getFranchiseById(id: string) {
    const url = `${this.apiRoot}/franchisees/${id}`
    return this.http.get<any>(url);
  }

  putFranchiseById(id: string, data: any) {
    const url = `${this.apiRoot}/franchisees/${id}`;
    return this.http.put<any>(url, JSON.stringify(data), { 'headers': this.headers });
  }

  getAllLogicalFranchisees(searchTerm: string) {
    const url = `${this.apiRoot}` + "/franchisees/GetLogicalFranchisees" + searchTerm;
    return this.http.get<any>(url, { observe: 'response' });
  }


  deleteFranchisees(contactsId: any[]) {
    const url = `${this.apiRoot}/franchisees`;
    return this.http.delete<any>(url, { body: contactsId });
  }

  GetLogicalFranchiseesData(franchisees: any) {
    let addressTypeEnum = this.dataService.getAllPostalAddressTypes()
    let phoneTypeEnum = this.dataService.getAllPhoneTypes()
    let emailTypeEnum = this.dataService.getAllEmailTypes()
    let stateTypeEnum = this.dataService.getAllStateType()
    var franchiseeLists = [];
    franchisees.forEach(function (franchisee) {
      var rowData = [];
      var name: Gridview = { headerTitle: "Name", value: franchisee.name, mouseOver: "Franchisee Name", isShow: true, attributeName: "name",dataType:'string' };
      rowData.push(name);
      var id: Gridview = { headerTitle: "ID", value: franchisee.id, mouseOver: "Franchisee Id", isShow: false, attributeName: "id",dataType:'guid' };
      rowData.push(id);
      var num: Gridview = { headerTitle: "Number", value: franchisee.num, mouseOver: "Franchisee Number", isShow: true, attributeName: "num",dataType:'int' };
      rowData.push(num);
      var type: Gridview = { headerTitle: "Type", value: franchisee.type, mouseOver: "Franchisee Type", isShow: true, attributeName: "type",dataType:'enum', enum:['Individual','Organization'] };
      rowData.push(type);
      var addressType: Gridview = { headerTitle: "Address Type", value: franchisee.addressType, mouseOver: "Address Type", isShow: false, attributeName: "addressType",dataType:'enum', enum:addressTypeEnum };
      rowData.push(addressType);
      var address_1: Gridview = { headerTitle: "Address 1", value: franchisee.address_1, mouseOver: "Address 1", isShow: false, attributeName: "address_1",dataType:'string' };
      rowData.push(address_1);
      var address_2: Gridview = { headerTitle: "Address 2", value: franchisee.address_2, mouseOver: "Address 2", isShow: false, attributeName: "address_2",dataType:'string' };
      rowData.push(address_2);
      var city: Gridview = { headerTitle: "City", value: franchisee.city, mouseOver: "city", isShow: true, attributeName: "city",dataType:'string' };
      rowData.push(city);
      var stateType: Gridview = { headerTitle: "State Type", value: franchisee.stateType, mouseOver: "State Type", isShow: false, attributeName: "stateType",dataType:'enum',enum:stateTypeEnum };
      rowData.push(stateType);
      var state: Gridview = { headerTitle: "State", value: franchisee.state, mouseOver: "State Name", isShow: true, attributeName: "state", dataType:'string' };
      rowData.push(state);
      var stateCode: Gridview = { headerTitle: "State Code", value: franchisee.stateCode, mouseOver: "State Code", isShow: false, attributeName: "stateCode",dataType:'string' };
      rowData.push(stateCode);
      var postalCode: Gridview = { headerTitle: "Postal Code", value: franchisee.postalCode, mouseOver: "Postal Code", isShow: true, attributeName: "postalCode",dataType:'string' };
      rowData.push(postalCode);
      var countryName: Gridview = { headerTitle: "Country", value: franchisee.countryName, mouseOver: "Country Name", isShow: false, attributeName: "countryName",dataType:'string' };
      rowData.push(countryName);
      var countryCode: Gridview = { headerTitle: "Country Code", value: franchisee.countryCode, mouseOver: "Country Code", isShow: false, attributeName: "countryCode",dataType:'string' };
      rowData.push(countryCode);
      var isPostalPrimary: Gridview = { headerTitle: "Address Primary", value: franchisee.isPostalPrimary, mouseOver: "Address Is Primary", isShow: false, attributeName: "isPostalPrimary",dataType:'boolean' };
      rowData.push(isPostalPrimary);
      var isDoNotContact: Gridview = { headerTitle: "Address Do Not Contact", value: franchisee.isDoNotContact, mouseOver: "Address Is Do Not Contact", isShow: false, attributeName: "isDoNotContact",dataType:'boolean' };
      rowData.push(isDoNotContact);
      var phoneType: Gridview = { headerTitle: "Phone Type", value: franchisee.phoneType, mouseOver: "Phone Type", isShow: false, attributeName: "phoneType",dataType:'enum', enum:phoneTypeEnum };
      rowData.push(phoneType);
      var phoneCountryCode: Gridview = { headerTitle: "Phone Country Code", value: franchisee.phoneCountryCode, mouseOver: "Phone Country Code", isShow: true, attributeName: "phoneCountryCode", dataType:'string' };
      rowData.push(phoneCountryCode);
      var areaCode: Gridview = { headerTitle: "Phone Code", value: franchisee.areaCode, mouseOver: "Phone Code", isShow: true, attributeName: "areaCode",dataType:'string' };
      rowData.push(areaCode);
      var phoneNumber: Gridview = { headerTitle: "Phone", value: franchisee.phoneNumber, mouseOver: "Phone", isShow: true, attributeName: "phoneNumber",dataType:'string' };
      rowData.push(phoneNumber);
      var phoneExtension: Gridview = { headerTitle: "Extension", value: franchisee.phoneExtension, mouseOver: "Phone Extension", isShow: false, attributeName: "phoneExtension",dataType:'string' };
      rowData.push(phoneExtension);
      var isPhonePrimary: Gridview = { headerTitle: "Phone Is Primary", value: franchisee.isPhonePrimary, mouseOver: "Phone Is Primary", isShow: false, attributeName: "isPhonePrimary",dataType:'boolean' };
      rowData.push(isPhonePrimary);
      var isPhoneDoNotContact: Gridview = { headerTitle: "Phone Do Not Contact", value: franchisee.isPhoneDoNotContact, mouseOver: "Phone Is Do Not Contact", isShow: false, attributeName: "isPhoneDoNotContact",dataType:'boolean' };
      rowData.push(isPhoneDoNotContact);
      var emailType: Gridview = { headerTitle: "Email Type", value: franchisee.emailType, mouseOver: "Email Type", isShow: false, attributeName: "emailType",dataType:'enum', enum:emailTypeEnum };
      rowData.push(emailType);
      var email: Gridview = { headerTitle: "Email", value: franchisee.email, mouseOver: "Email", isShow: true, attributeName: "email",dataType:'string' };
      rowData.push(email);
      var isEmailPrimary: Gridview = { headerTitle: "Email Is Primary", value: franchisee.isEmailPrimary, mouseOver: "Email Is Primary", isShow: false, attributeName: "isEmailPrimary",dataType:'boolean' };
      rowData.push(isEmailPrimary);
      var isEmailDoNotContact: Gridview = { headerTitle: "Email Do Not Contact", value: franchisee.isEmailDoNotContact, mouseOver: "Email Is Do Not Contact", isShow: false, attributeName: "isEmailDoNotContact",dataType:'boolean' };
      rowData.push(isEmailDoNotContact);
      var chainProvidedNumber: Gridview = { headerTitle: "Chain Provided Number", value: franchisee.chainProvidedNumber, mouseOver: "Chain Provided Number", isShow: false, attributeName: "chainProvidedNumber",dataType:'string' };
      rowData.push(chainProvidedNumber);
      var registrationDate: Gridview = { headerTitle: "Registration Date", value: franchisee.registrationDate, mouseOver: "Registration Date", isShow: false, attributeName: "registrationDate" };
      rowData.push(registrationDate);
      var status: Gridview = { headerTitle: "Status", value: franchisee.status, mouseOver: "Status", isShow: true, attributeName: "status",dataType:'enum', enum:['Active','Inactive'] };
      rowData.push(status);
      franchiseeLists.push(rowData);
    });
    return franchiseeLists;
  }

  getFranchiseeByRestaurantId(searchTerm: string) {
    const url = `${this.apiRoot}` + "/franchisees/ReadFranchiseeListByRestaurantId" + searchTerm;
    return this.http.get<any>(url, { observe: 'response' });
  }
  getAllFranchisees() {
    const url = `${this.apiRoot}` + "/franchisees" ;
    return this.http.get<any>(url);
  }

  GetFranchiseesByRestaurantId(franchisees: any) {
    var franchiseeLists = [];
    franchisees.forEach(function (franchisee) {
      var rowData = [];
      var name: Gridview = { headerTitle: "Name", value: franchisee.name, mouseOver: "Franchisee Name", isShow: true, attributeName: "name" };
      rowData.push(name);
      var id: Gridview = { headerTitle: "ID", value: franchisee.id, mouseOver: "Franchisee Id", isShow: false, attributeName: "id" };
      rowData.push(id);
      var num: Gridview = { headerTitle: "Number", value: franchisee.num, mouseOver: "Franchisee Number", isShow: true, attributeName: "num" };
      rowData.push(num);
      var type: Gridview = { headerTitle: "Type", value: franchisee.type, mouseOver: "Franchisee Type", isShow: true, attributeName: "type" };
      rowData.push(type);
      var alignmentStartDate: Gridview = { headerTitle: "Start Date", value: franchisee.alignmentStartDate, mouseOver: "Restaurant Alignment Start Date", isShow: true, attributeName: "alignmentStartDate" };
      rowData.push(alignmentStartDate);
      var alignmentEndDate: Gridview = { headerTitle: "End Date", value: franchisee.alignmentEndDate, mouseOver: "Restaurant Alignment End Date", isShow: true, attributeName: "alignmentEndDate" };
      rowData.push(alignmentEndDate);
      var addressType: Gridview = { headerTitle: "Address Type", value: franchisee.addressType, mouseOver: "Address Type", isShow: false, attributeName: "addressType" };
      rowData.push(addressType);
      var address_1: Gridview = { headerTitle: "Address 1", value: franchisee.address_1, mouseOver: "Address 1", isShow: false, attributeName: "address_1" };
      rowData.push(address_1);
      var address_2: Gridview = { headerTitle: "Address 2", value: franchisee.address_2, mouseOver: "Address 2", isShow: false, attributeName: "address_2" };
      rowData.push(address_2);
      var city: Gridview = { headerTitle: "City", value: franchisee.city, mouseOver: "city", isShow: true, attributeName: "city" };
      rowData.push(city);
      var stateType: Gridview = { headerTitle: "State Type", value: franchisee.stateType, mouseOver: "State Type", isShow: false, attributeName: "stateType" };
      rowData.push(stateType);
      var state: Gridview = { headerTitle: "State", value: franchisee.state, mouseOver: "State Name", isShow: true, attributeName: "state" };
      rowData.push(state);
      var stateCode: Gridview = { headerTitle: "State Code", value: franchisee.stateCode, mouseOver: "State Code", isShow: false, attributeName: "stateCode" };
      rowData.push(stateCode);
      var postalCode: Gridview = { headerTitle: "Postal Code", value: franchisee.postalCode, mouseOver: "Postal Code", isShow: true, attributeName: "postalCode" };
      rowData.push(postalCode);
      var countryName: Gridview = { headerTitle: "Country", value: franchisee.countryName, mouseOver: "Country Name", isShow: false, attributeName: "countryName" };
      rowData.push(countryName);
      var countryCode: Gridview = { headerTitle: "Country Code", value: franchisee.countryCode, mouseOver: "Country Code", isShow: false, attributeName: "countryCode" };
      rowData.push(countryCode);
      var isPostalPrimary: Gridview = { headerTitle: "Address Primary", value: franchisee.isPostalPrimary, mouseOver: "Address Is Primary", isShow: false, attributeName: "isPostalPrimary" };
      rowData.push(isPostalPrimary);
      var isDoNotContact: Gridview = { headerTitle: "Address Do Not Contact", value: franchisee.isDoNotContact, mouseOver: "Address Is Do Not Contact", isShow: false, attributeName: "isDoNotContact" };
      rowData.push(isDoNotContact);
      var phoneType: Gridview = { headerTitle: "Phone Type", value: franchisee.phoneType, mouseOver: "Phone Type", isShow: false, attributeName: "phoneType" };
      rowData.push(phoneType);
      var phoneCountryCode: Gridview = { headerTitle: "Phone Country Code", value: franchisee.phoneCountryCode, mouseOver: "Phone Country Code", isShow: true, attributeName: "phoneCountryCode" };
      rowData.push(phoneCountryCode);
      var areaCode: Gridview = { headerTitle: "Phone Code", value: franchisee.areaCode, mouseOver: "Phone Code", isShow: true, attributeName: "areaCode" };
      rowData.push(areaCode);
      var phoneNumber: Gridview = { headerTitle: "Phone", value: franchisee.phoneNumber, mouseOver: "Phone", isShow: true, attributeName: "phoneNumber" };
      rowData.push(phoneNumber);
      var phoneExtension: Gridview = { headerTitle: "Extension", value: franchisee.phoneExtension, mouseOver: "Phone Extension", isShow: false, attributeName: "phoneExtension" };
      rowData.push(phoneExtension);
      var isPhonePrimary: Gridview = { headerTitle: "Phone Is Primary", value: franchisee.isPhonePrimary, mouseOver: "Phone Is Primary", isShow: false, attributeName: "isPhonePrimary" };
      rowData.push(isPhonePrimary);
      var isPhoneDoNotContact: Gridview = { headerTitle: "Phone Do Not Contact", value: franchisee.isPhoneDoNotContact, mouseOver: "Phone Is Do Not Contact", isShow: false, attributeName: "isPhoneDoNotContact" };
      rowData.push(isPhoneDoNotContact);
      var emailType: Gridview = { headerTitle: "Email Type", value: franchisee.emailType, mouseOver: "Email Type", isShow: false, attributeName: "emailType" };
      rowData.push(emailType);
      var email: Gridview = { headerTitle: "Email", value: franchisee.email, mouseOver: "Email", isShow: true, attributeName: "email" };
      rowData.push(email);
      var isEmailPrimary: Gridview = { headerTitle: "Email Is Primary", value: franchisee.isEmailPrimary, mouseOver: "Email Is Primary", isShow: false, attributeName: "isEmailPrimary" };
      rowData.push(isEmailPrimary);
      var isEmailDoNotContact: Gridview = { headerTitle: "Email Do Not Contact", value: franchisee.isEmailDoNotContact, mouseOver: "Email Is Do Not Contact", isShow: false, attributeName: "isEmailDoNotContact" };
      rowData.push(isEmailDoNotContact);
      var chainProvidedNumber: Gridview = { headerTitle: "Chain Provided Number", value: franchisee.chainProvidedNumber, mouseOver: "Chain Provided Number", isShow: false, attributeName: "chainProvidedNumber" };
      rowData.push(chainProvidedNumber);
      var registrationDate: Gridview = { headerTitle: "Registration Date", value: franchisee.registrationDate, mouseOver: "Registration Date", isShow: false, attributeName: "registrationDate" };
      rowData.push(registrationDate);
      var status: Gridview = { headerTitle: "Status", value: franchisee.status, mouseOver: "Status", isShow: true, attributeName: "status" };
      rowData.push(status);
      var restaurantName: Gridview = { headerTitle: "Restaurant Name", value: franchisee.restaurantName, mouseOver: "Restaurant Name", isShow: false, attributeName: "restaurantName" };
      rowData.push(restaurantName);
      franchiseeLists.push(rowData);
    });
    return franchiseeLists;
  }
  getAllFranchiseesInfo(searchTerm: string) {
    const url = `${this.apiRoot}/franchisees` + searchTerm;
    return this.http.get<any>(url, { observe: 'response' });
  }
  getFranchiseesByIds(ids: any) {
    const url = `${this.apiRoot}` + "/franchisees/GetFranchiseesByIds"
    return this.http.post<any>(url, ids);
  }
}
