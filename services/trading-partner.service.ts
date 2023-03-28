import { Injectable } from '@angular/core';
import { TradingPartner, TradingPartnerDto } from '../models/trading-partner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TradingPartnersDto } from '../models/trading-partner-type';
import { contactInfo } from '../models/contact';
import { Gridview } from '../models/gridview';
import { DataService } from './data.service';
@Injectable({
  providedIn: 'root'
})
export class TradingPartnerService {
  headers = { 'content-type': 'application/json' };
  _baseUrl = `${environment.tradingPartnerUrl}/api`;
  constructor(private http: HttpClient, private dataService: DataService) { }
  apiRoot: string = `${environment.tradingPartnerUrl}/api/tradingpartners`;
  tradingPartnerApiRoot = `${environment.tradingPartnerUrl}/api/tradingpartners`;
  tradingPartner: TradingPartner[];
  data: any;
  getAll(search: any): Observable<TradingPartnerDto[]> {
    // let searchUrl = this.apiRoot+"?Filters=Name@="+ search.name+"&Type=="
    // +search.type+"&Status=="+search.status+"&PageNumber="+search.pageNumber+"&PageSize="+search.pageSize;
    let searchUrl = `${this._baseUrl}/tradingpartners/GetLogicalTradingPartners`;
    return this.http.get<TradingPartnerDto[]>(searchUrl);
  }

  getAllTradingPartners(searchTerm: string) {
    const url = this.apiRoot + '/GetLogicalTradingPartners' + searchTerm;
    return this.http.get<any>(url, {observe: 'response'});
  }

  getAllTradingPartner(){
    const url = this.apiRoot + '/GetLogicalTradingPartners';
    return this.http.get<any>(url);
  }

  getById(id: string) {
    const url = this._baseUrl + '/tradingpartners/' + id;
    return this.http.get<TradingPartnersDto>(url);
  }

  create(tradingpartnerInfo: any) {
    let result = this.http.post(this._baseUrl + '/tradingpartners', tradingpartnerInfo);
    return result;
  }
  createFacility(facilityInfo: any) {
    let result = this.http.post(this._baseUrl + '/facilities', facilityInfo);
    return result;
  }

  getTradingPartnersById(id: string) {
    const url = `${this.tradingPartnerApiRoot}/${id}`;
    return this.http.get<any>(url);

  }
  updateTradingPartnerById(id: string, tradingPartnerDto: TradingPartnersDto) {
    const url = `${this.tradingPartnerApiRoot}/${id}`;
    return this.http.put<any>(url, tradingPartnerDto);
  }
  getContactsForTradingPartner(tradingPartnerId:string) {
    let result = this.http.get(this._baseUrl + `/api/contacts/ReadContactsByTradingPartnerId?tradingPartnerId=${tradingPartnerId}`);
    return result;
  }

  createContact(contact:contactInfo){
    let result = this.http.post(this._baseUrl + '/api/contacts', contact);
    return result;
  }

  GetLogicalData(tradingPartners: any) {
    let postalAddressTypeEnum=this.dataService.getAllPostalAddressTypes()
    let phoneTypeEnum=this.dataService.getAllPhoneTypes()
    let stateTypeEnum=this.dataService.getAllStateType()
    let emailTypeEnum=this.dataService.getAllEmailTypes()
    const tradingPartnerList = [];
    tradingPartners.forEach(function (trading) {
      const rowData = [];
      var name: Gridview = { headerTitle: "Name", value: trading.name, mouseOver: "trading Partner Name", isShow: true, attributeName: "name", dataType: "string" };
      rowData.push(name);
      var id: Gridview = { headerTitle: "ID", value: trading.id, mouseOver: "trading Partner Id", isShow: false, attributeName: "id",dataType: "guid" };
      rowData.push(id);
      var num: Gridview = { headerTitle: "Number", value: trading.num, mouseOver: "trading Partner #", isShow: false, attributeName: "num",dataType: "int" };
      rowData.push(num);
      var shortName: Gridview = { headerTitle: "Short Name", value: trading.shortName, mouseOver: "trading Partner Short Name", isShow: false, attributeName: "shortName", dataType: "string" };
      rowData.push(shortName);
      var role: Gridview = { headerTitle: "Role", value: trading.type, mouseOver: "Role ", isShow: true, attributeName: "type", dataType:'enum', enum:['Distributor','Premiums','Food/Packaging','Bakery','Supplier','Equipment Distributor','Equipment/Smallwares'] };
      rowData.push(role);
      var status: Gridview = { headerTitle: "Status", value: trading.status, mouseOver: "Status", isShow: true, attributeName: "status", dataType:'enum', enum:['Active','Inactive'] };
      rowData.push(status);
      var dunsNum: Gridview = { headerTitle: "Duns", value: trading.dunsNum, mouseOver: "Duns Number", isShow: false, attributeName: "dunsNum", dataType: "string" };
      rowData.push(dunsNum);
      var federalNum: Gridview = { headerTitle: "FEIN", value: trading.federalEmployerIdent, mouseOver: "FEIN Number", isShow: false, attributeName: "federalEmployerIdent",dataType:'string' };
      rowData.push(federalNum);
      var isSubsidiary: Gridview = { headerTitle: "Is_Subsidiary", value: trading.isSubsidiary, mouseOver: "Is_Subsidiary", isShow: false, attributeName: "issubsidiary", dataType: "boolean" };
      rowData.push(isSubsidiary);
      var minorityVendor: Gridview = { headerTitle: "Minority Vendors", value: trading.minorityVendors, mouseOver: "Minority Vendors", isShow: false, attributeName: "minorityVendors" };
      rowData.push(minorityVendor);
      var addressType: Gridview = { headerTitle: "Address Type", value: trading.addressType, mouseOver: "Address Type", isShow: false, attributeName: "addressType", dataType:'enum', enum:postalAddressTypeEnum};
      rowData.push(addressType);
      var address1: Gridview = { headerTitle: "Address 1", value: trading.address_1, mouseOver: "Address 1", isShow: false, attributeName: "address_1",dataType:"string" };
      rowData.push(address1);
      var address2: Gridview = { headerTitle: "Address 2", value: trading.address_2, mouseOver: "Address 2", isShow: false, attributeName: "address_2",dataType:"string"  };
      rowData.push(address2);
      var city: Gridview = { headerTitle: "City", value: trading.city, mouseOver: "City", isShow: true, attributeName: "city",dataType:"string"  };
      rowData.push(city);
      var statetype: Gridview = { headerTitle: "State Type", value: trading.stateType, mouseOver: "State Type", isShow: false, attributeName: "stateType",dataType:'enum', enum:stateTypeEnum };
      rowData.push(statetype);
      var statename: Gridview = { headerTitle: "State", value: trading.state, mouseOver: "State Name", isShow: true, attributeName: "state",dataType:"string" };
      rowData.push(statename);
      var stateCode: Gridview = { headerTitle: "State Code", value: trading.stateCode, mouseOver: "State Code", isShow: false, attributeName: "stateCode",dataType:"string" };
      rowData.push(stateCode);
      var postalcode: Gridview = { headerTitle: "Postal Code", value: trading.postalCode, mouseOver: "Postal Code", isShow: true, attributeName: "postalCode",dataType:"string" };
      rowData.push(postalcode);
      var countryname: Gridview = { headerTitle: "Country", value: trading.countryName, mouseOver: "Country Name", isShow: true, attributeName: "countryName",dataType:"string" };
      rowData.push(countryname);
      var countrycode: Gridview = { headerTitle: "Country Code", value: trading.countryCode, mouseOver: "Address Country Code", isShow: false, attributeName: "countryCode",dataType:"string" };
      rowData.push(countrycode);
      var IsPostalPrimary: Gridview = { headerTitle: "Address Primary", value: trading.isPostalPrimary, mouseOver: "Address Is Primary", isShow: false, attributeName: "isPostalPrimary",dataType:"boolean"};
      rowData.push(IsPostalPrimary);
      var IspostalDonotcontact: Gridview = { headerTitle: "Address Do Not Contact", value: trading.isDoNotContact, mouseOver: "Address Is Do Not Contact", isShow: false, attributeName: "isDoNotContact",dataType:"boolean" };
      rowData.push(IspostalDonotcontact);
      var phonetype: Gridview = { headerTitle: "Phone Type", value: trading.phoneType, mouseOver: "Phone Type", isShow: false, attributeName: "phoneType", dataType:'enum', enum:phoneTypeEnum };
      rowData.push(phonetype);
      var phoneCountrycode: Gridview = { headerTitle: "Phone Country Code", value: trading.phoneCountryCode, mouseOver: "Phone Country Code", isShow: true, attributeName: "phoneCountryCode",dataType:"string" };
      rowData.push(phoneCountrycode);
      var areacode: Gridview = { headerTitle: "Phone Code", value: trading.areaCode, mouseOver: "Phone Code", isShow: true, attributeName: "areaCode",dataType:"string" };
      rowData.push(areacode);
      var phonenumber: Gridview = { headerTitle: "Phone", value: trading.phoneNumber, mouseOver: "Phone Number", isShow: true, attributeName: "phoneNumber",dataType:"string" };
      rowData.push(phonenumber);
      var phoneextension: Gridview = { headerTitle: "Phone Extension", value: trading.phoneExtension, mouseOver: "Phone Extension", isShow: false, attributeName: "phoneExtension",dataType:"string" };
      rowData.push(phoneextension);
      var IsphonePrimary: Gridview = { headerTitle: "Is Primary", value: trading.isPhonePrimary, mouseOver: "Phone Is Primary", isShow: false, attributeName: "isPhonePrimary",dataType:"boolean" };
      rowData.push(IsphonePrimary);
      var IsphonelDonotcontact: Gridview = { headerTitle: "Do Not Contact", value: trading.isPhoneDoNotContact, mouseOver: "Phone Is Do Not Contact", isShow: false, attributeName: "isPhoneDoNotContact",dataType:"boolean" };
      rowData.push(IsphonelDonotcontact);
      var emailtype: Gridview = { headerTitle: "Email Type", value: trading.emailType, mouseOver: "Email Type", isShow: false, attributeName: "emailType", dataType:'enum', enum:emailTypeEnum };
      rowData.push(emailtype);
      var email: Gridview = { headerTitle: "Email", value: trading.email, mouseOver: "Email", isShow: true, attributeName: "email",dataType:"string" };
      rowData.push(email);
      var IsemailPrimary: Gridview = { headerTitle: "Is Primary", value: trading.isEmailPrimary, mouseOver: "Email Is Primary", isShow: false, attributeName: "isEmailPrimary",dataType:"boolean" };
      rowData.push(IsemailPrimary);
      var IsemailDonotcontact: Gridview = { headerTitle: "Do Not Contact", value: trading.isEmailDoNotContact, mouseOver: "Email Is Do Not Contact", isShow: false, attributeName: "isEmailDoNotContact",dataType:"boolean" };
      rowData.push(IsemailDonotcontact);
      tradingPartnerList.push(rowData);
    });
    return tradingPartnerList;

  }

  deleteTradingpartner(tradingPartnersId:any[]){
    const url = `${this.apiRoot}/`;
    return this.http.delete<any>(url,{body: tradingPartnersId});
}
deleteById(id: string) {
  const url = `${this.apiRoot}/${id}`;
 return this.http.delete<any>(url);
}
getAllTradingPartnerInfo(searchTerm: string) {
  const url = `${this.apiRoot}` + searchTerm;
  return this.http.get<any>(url, {observe: 'response'});
}
}
