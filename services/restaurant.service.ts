import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Gridview } from '../models/gridview';
import { DataService } from './data.service';
import { SharedEventService } from './shared-event.service';
@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

   apiRoot: string = `${environment.restaurantsUrl}/api/restaurants`;
   
   dateFormat:string

   constructor(private http: HttpClient,private dataService: DataService, private sharedEventService:SharedEventService) {
    this.sharedEventService.dateBasedOnRegion.subscribe((resp)=>{
      this.dateFormat=resp;
    })
    }

  addNew(restaurant: any) {
    let result = this.http.post(this.apiRoot, restaurant);
    return result;
  }
  getAll() {
    let result = this.http.get(this.apiRoot);
    return result;
  }
  getLogicalAll() {
    let result = this.http.get(this.apiRoot + "/GetLogicalRestaurants");
    return result;
  }

  getAllLogicalRestaurants(searchTerm: string) {
    const url = `${this.apiRoot}` + "/GetLogicalRestaurants" + searchTerm;
    return this.http.get<any>(url, { observe: 'response' });
  }

  deleteRestaurants(restaurantId: any[]) {
    const url = `${this.apiRoot}/`;
    return this.http.delete<any>(url, { body: restaurantId });
  }

  GetLogicalRestaurantsData(restaurants: any) {
    let statusType=this.dataService.getRestaurantStatus()
    let addressTypeEnum = this.dataService.getAllPostalAddressTypes()
    let phoneTypeEnum = this.dataService.getAllPhoneTypes()
    let emailTypeEnum = this.dataService.getAllEmailTypes()
    let stateTypeEnum = this.dataService.getAllStateType()
    var restaurantLists = [];
        
    let dateFormat=this.dateFormat
    
    function formatDate(date){
      let actualDate=date.split('T')[0]
      let d=actualDate.split('-')[2]
      let m=actualDate.split('-')[1]
      let y=actualDate.split('-')[0]

      let transformDate;
      switch(dateFormat){
        case 'dd/MM/yyyy':
          transformDate=`${d}/${m}/${y}`;
           break;
        case 'MM/dd/yyyy':
          transformDate=`${m}/${d}/${y}`;
          break;
      }
      return transformDate
      
    }
    restaurants.forEach(function (restaurant) {
      var rowData = [];
      var name: Gridview = { headerTitle: "Name", value: restaurant.name, mouseOver: "Restaurant Name", isShow: true, attributeName: "name",dataType:'string' };
      rowData.push(name);
      var id: Gridview = { headerTitle: "ID", value: restaurant.id, mouseOver: "Restaurant Id", isShow: false, attributeName: "id",dataType:'guid' };
      rowData.push(id);
      var num: Gridview = { headerTitle: "Number", value: restaurant.num, mouseOver: "Restaurant Number", isShow: false, attributeName: "num",dataType:'int' };
      rowData.push(num);
      var siteNumber: Gridview = { headerTitle: "Site Number", value: restaurant.site_number, mouseOver: "Site Number", isShow: true, attributeName: "site_number",dataType:'string' };
      rowData.push(siteNumber);
      var status: Gridview = { headerTitle: "Status", value: restaurant.status, mouseOver: "Status", isShow: true, attributeName: "status", dataType:'enum', enum:statusType };
      rowData.push(status);
      var franchiseId: Gridview = { headerTitle: "Franchisee ID", value: restaurant.franchiseId, mouseOver: "Franchisee ID", isShow: false, attributeName: "franchiseId",dataType:'guid' };
      rowData.push(franchiseId);
      var franchiseNumber: Gridview = { headerTitle: "Franchisee Number", value: restaurant.franchiseNum, mouseOver: "Franchisee Number", isShow: false, attributeName: "franchiseNum",dataType:'int' };
      rowData.push(franchiseNumber);
      var franchiseeName: Gridview = { headerTitle: "Franchisee Name", value: restaurant.franchiseName, mouseOver: "Franchisee Name", isShow: true, attributeName: "franchiseName",dataType:'string' };
      rowData.push(franchiseeName);
      var alignmentStartDate: Gridview = { headerTitle: "Start Date", value: (restaurant.alignmentStartDate==null||restaurant.alignmentStartDate=="")?"":formatDate(restaurant.alignmentStartDate), mouseOver: "Franchisee Alignment Start Date", isShow: false, attributeName: "alignmentStartDate" };
      rowData.push(alignmentStartDate);
      var alignmentEndDate: Gridview = { headerTitle: "End Date", value: (restaurant.alignmentEndDate==null||restaurant.alignmentEndDate=="")?"":formatDate(restaurant.alignmentEndDate), mouseOver: "Franchisee Alignment End Date", isShow: false, attributeName: "alignmentEndDate" };
      rowData.push(alignmentEndDate);
      var addressType: Gridview = { headerTitle: "Address Type", value: restaurant.addressType, mouseOver: "Address Type", isShow: false, attributeName: "addressType",dataType:'enum', enum:addressTypeEnum };
      rowData.push(addressType);
      var address_1: Gridview = { headerTitle: "Address 1", value: restaurant.address_1, mouseOver: "Address 1", isShow: false, attributeName: "address_1",dataType:'string' };
      rowData.push(address_1);
      var address_2: Gridview = { headerTitle: "Address 2", value: restaurant.address_2, mouseOver: "Address 2", isShow: false, attributeName: "address_2",dataType:'string' };
      rowData.push(address_2);
      var city: Gridview = { headerTitle: "City", value: restaurant.city, mouseOver: "City", isShow: true, attributeName: "city",dataType:'string' };
      rowData.push(city);
      var stateType: Gridview = { headerTitle: "State Type", value: restaurant.stateType, mouseOver: "State Type", isShow: false, attributeName: "stateType",dataType:'enum', enum:stateTypeEnum };
      rowData.push(stateType);
      var stateName: Gridview = { headerTitle: "State", value: restaurant.state, mouseOver: "State Name", isShow: true, attributeName: "state",dataType:'string' };
      rowData.push(stateName);
      var stateCode: Gridview = { headerTitle: "State Code", value: restaurant.stateCode, mouseOver: "State Code", isShow: false, attributeName: "stateCode",dataType:'string' };
      rowData.push(stateCode);
      var dmaNumber: Gridview = { headerTitle: "DMA Number", value: restaurant.dMANumber, mouseOver: "DMA Number", isShow: false, attributeName: "dMANumber",dataType:'string' };
      rowData.push(dmaNumber);
      var dmaName: Gridview = { headerTitle: "DMA Name", value: restaurant.dMAName, mouseOver: "DMA Name", isShow: true, attributeName: "dMAName",dataType:'string' };
      rowData.push(dmaName);
      var postalCode: Gridview = { headerTitle: "Postal Code", value: restaurant.postalCode, mouseOver: "Postal Code", isShow: true, attributeName: "postalCode",dataType:'string' };
      rowData.push(postalCode);
      var countryName: Gridview = { headerTitle: "Country", value: restaurant.countryName, mouseOver: "Country Name", isShow: false, attributeName: "countryName",dataType:'string' };
      rowData.push(countryName);
      var countryCode: Gridview = { headerTitle: "Country Code", value: restaurant.countryCode, mouseOver: "Country Code", isShow: false, attributeName: "countryCode",dataType:'string' };
      rowData.push(countryCode);
      var isPostalPrimary: Gridview = { headerTitle: "Address Primary", value: restaurant.isPostalPrimary, mouseOver: "Address Is Primary", isShow: false, attributeName: "isPostalPrimary",dataType:'boolean' };
      rowData.push(isPostalPrimary);
      var isDoNotContact: Gridview = { headerTitle: "Address Do Not Contact", value: restaurant.isDoNotContact, mouseOver: "Address Is Do Not Contact", isShow: false, attributeName: "isDoNotContact",dataType:'boolean' };
      rowData.push(isDoNotContact);
      var phoneType: Gridview = { headerTitle: "Phone Type", value: restaurant.phoneType, mouseOver: "Phone Type", isShow: false, attributeName: "phoneType",dataType:'enum', enum: phoneTypeEnum };
      rowData.push(phoneType);
      var phoneCountryCode: Gridview = { headerTitle: "Phone Country Code", value: restaurant.phoneCountryCode, mouseOver: "Phone Country Code", isShow: false, attributeName: "phoneCountryCode",dataType:'string' };
      rowData.push(phoneCountryCode);
      var phoneAreaCode: Gridview = { headerTitle: "Phone Code", value: restaurant.areaCode, mouseOver: "Phone Code", isShow: false, attributeName: "areaCode",dataType:'string' };
      rowData.push(phoneAreaCode);
      var phoneNumber: Gridview = { headerTitle: "Phone", value: restaurant.phoneNumber, mouseOver: "Phone", isShow: false, attributeName: "phoneNumber",dataType:'string' };
      rowData.push(phoneNumber);
      var phoneExtension: Gridview = { headerTitle: "Extension", value: restaurant.phoneExtension, mouseOver: "Phone Extension", isShow: false, attributeName: "phoneExtension",dataType:'string' };
      rowData.push(phoneExtension);
      var isPhonePrimary: Gridview = { headerTitle: "Phone Is Primary", value: restaurant.isPhonePrimary, mouseOver: "Phone Is Primary", isShow: false, attributeName: "isPhonePrimary",dataType:'boolean' };
      rowData.push(isPhonePrimary);
      var isPhoneDoNotContact: Gridview = { headerTitle: "Phone Do Not Contact", value: restaurant.isPhoneDoNotContact, mouseOver: "Phone Is Do Not Contact", isShow: false, attributeName: "isPhoneDoNotContact",dataType:'boolean' };
      rowData.push(isPhoneDoNotContact);
      var emailType: Gridview = { headerTitle: "Email Type", value: restaurant.emailType, mouseOver: "Email Type", isShow: false, attributeName: "emailType",dataType:'enum', enum:emailTypeEnum };
      rowData.push(emailType);
      var email: Gridview = { headerTitle: "Email", value: restaurant.email, mouseOver: "Email", isShow: false, attributeName: "email",dataType:'string' };
      rowData.push(email);
      var isEmailPrimary: Gridview = { headerTitle: "Email Is Primary", value: restaurant.isEmailPrimary, mouseOver: "Email Is Primary", isShow: false, attributeName: "isEmailPrimary",dataType:'boolean' };
      rowData.push(isEmailPrimary);
      var isEmailDoNotContact: Gridview = { headerTitle: "Email Do Not Contact", value: restaurant.isEmailDoNotContact, mouseOver: "Email Is Do Not Contact", isShow: false, attributeName: "isEmailDoNotContact",dataType:'boolean' };
      rowData.push(isEmailDoNotContact);
      restaurantLists.push(rowData);
    });
    return restaurantLists;
  }
  getRestaurantById(id:string) {
    let result = this.http.get(`${this.apiRoot}/${id}`);
    return result;
  }
  update(id:string,restaurant: any) {
    let result = this.http.put<any>(`${this.apiRoot}/${id}`,restaurant);
    return result;
  }
  deleteRestaurant(restaurantIds:any[]){
    const url=`${this.apiRoot}`
    return this.http.delete<any>(url,{body:restaurantIds})
}

deleteById(id: string) {
  const url = `${this.apiRoot}/${id}`;
 return this.http.delete<any>(url);
}



  updateAlignmentByRestaurantIds(alignmentId:string, alignmentType:string, effectiveDate:Date, restaurantIds:any[])
  {
    return this.http.put<any>(`${this.apiRoot}/UpdateAlignmentsByRestaurantIds?alignmentsId=${alignmentId}&alignmentsType=${alignmentType}&effectiveDate=${effectiveDate}`,restaurantIds);
  }

  getDCAlignmentsByDate(searchTerm){

    const url = `${this.apiRoot}` + "/ReadDCAlignmentsByDate" + searchTerm;
    return this.http.get<any>(url, { observe: 'response' });
  }

  getDCAlignmentsByRestaurantId(searchTerm){
    const url = this.apiRoot + "/ReadDCAlignmentsByRestaurantId" + searchTerm;
    return this.http.get<any>(url, {observe: 'response'})
  }


  getDCAlignmentsByDateData(restaurants: any){
    let statusType=this.dataService.getRestaurantStatus()
    var dcAlignmentsList =[];
            
    let dateFormat=this.dateFormat
    
    function formatDate(date){
      let actualDate=date.split('T')[0]
      let d=actualDate.split('-')[2]
      let m=actualDate.split('-')[1]
      let y=actualDate.split('-')[0]

      let transformDate;
      switch(dateFormat){
        case 'dd/MM/yyyy':
          transformDate=`${d}/${m}/${y}`;
           break;
        case 'MM/dd/yyyy':
          transformDate=`${m}/${d}/${y}`;
          break;
      }
      return transformDate
      
    }
    restaurants.forEach(function (dcAlignment){
      var rowData =[]
      var name: Gridview ={ headerTitle:"Name", value:dcAlignment.name , mouseOver: "Restaurant Name", isShow: true, attributeName: "name",dataType:'string'  }
      rowData.push(name)
      var id: Gridview ={ headerTitle:"ID", value:dcAlignment.id , mouseOver: "Restaurant Id", isShow: false, attributeName: "id",dataType:'guid'  }
      rowData.push(id)
      var restaurantNumber: Gridview ={ headerTitle:"Number", value:dcAlignment.num , mouseOver: "Restaurant Number", isShow: false, attributeName: "num",dataType:'int'  }
      rowData.push(restaurantNumber)
      var DcNum: Gridview ={ headerTitle:"DC Num", value:dcAlignment.dcNum , mouseOver: "DC Num", isShow: false, attributeName: "dcNum",dataType:'int'  }
      rowData.push(DcNum)
      var DcName: Gridview ={ headerTitle:"DC Name", value:dcAlignment.dcName , mouseOver: "DC Name", isShow: true, attributeName: "dcName",dataType:'string'  }
      rowData.push(DcName)
      var startDate: Gridview ={ headerTitle:"DC Alignment Start Date", value:(dcAlignment.dcAlignmentStartDate==null||dcAlignment.dcAlignmentStartDate=="")?"":formatDate(dcAlignment.dcAlignmentStartDate) , mouseOver: "DC Alignment Start Date", isShow: true, attributeName: "dcAlignmentStartDate"  }
      rowData.push(startDate)
      var endDate: Gridview ={ headerTitle:"DC Alignment End Date", value:(dcAlignment.dcAlignmentEndDate==null|| dcAlignment.dcAlignmentEndDate=="")?"":formatDate(dcAlignment.dcAlignmentEndDate) , mouseOver: "DC Alignment End Date", isShow: true, attributeName: "dcAlignmentEndDate"  }
      rowData.push(endDate)
      var markupStartDate: Gridview ={ headerTitle:"Markup Period Start Date", value:dcAlignment.markUpPeriodStartDate , mouseOver: "Markup Period Start Date", isShow: true, attributeName: "markUpPeriodStartDate"  }
      rowData.push(markupStartDate)
      var markUpEndDate: Gridview ={ headerTitle:"Markup Period End Date", value:dcAlignment.markUpPeriodEndDate , mouseOver: "Markup Period End Date", isShow: true, attributeName: "markUpPeriodEndDate"  }
      rowData.push(markUpEndDate)
      var baseMarkUpName: Gridview ={ headerTitle:"Base Markup Name", value:dcAlignment.baseMarkUpName , mouseOver: "Base Markup Name", isShow: true, attributeName: "baseMarkUpName",dataType:'string'  }
      rowData.push(baseMarkUpName)
      var markUpAlignmentStart: Gridview ={ headerTitle:"Markup Alignment Start Date", value:dcAlignment.markUpAlignmentStartDate , mouseOver: "Markup Alignment Start Date", isShow: true, attributeName: "markUpAlignmentStartDate"  }
      rowData.push(markUpAlignmentStart)
      var markUpAlignmentEnd: Gridview ={ headerTitle:"Markup Alignment End Date", value:dcAlignment.markUpAlignmentEndDate , mouseOver: "Markup Alignment End Date", isShow: true, attributeName: "markUpAlignmentEndDate"  }
      rowData.push(markUpAlignmentEnd)
      var baseMarkUp: Gridview ={ headerTitle:"Base Markup", value:dcAlignment.baseMarkUp , mouseOver: "Base Markup", isShow: true, attributeName: "baseMarkUp",dataType:'string'  }
      rowData.push(baseMarkUp)
      var baseMarkUpTotal: Gridview ={ headerTitle:"Total Markup", value:dcAlignment.baseMarkUpTotal , mouseOver: "Total Markup", isShow: true, attributeName: "baseMarkUpTotal",dataType:'string'  }
      rowData.push(baseMarkUpTotal)
      var SiteNum: Gridview ={ headerTitle:"Site Number", value:dcAlignment.site_number , mouseOver: "Site Number", isShow: false, attributeName: "site_number",dataType:'string'  }
      rowData.push(SiteNum)
      var status: Gridview ={ headerTitle:"Restaurant Status", value:dcAlignment.status , mouseOver: "Restaurant Status", isShow: true, attributeName: "status",dataType:'enum', enum:statusType  }
      rowData.push(status)
      var franchiseNum: Gridview ={ headerTitle:"Franchisee Number", value:dcAlignment.franchiseNum , mouseOver: "Franchisee Number", isShow: false, attributeName: "franchiseNum",dataType:'int'  }
      rowData.push(franchiseNum)
      var franchiseId: Gridview ={ headerTitle:"Franchisee ID", value:dcAlignment.franchiseId , mouseOver: "Franchisee Name", isShow: false, attributeName: "franchiseId",dataType:'guid'  }
      rowData.push(franchiseId)
      var franchiseName: Gridview ={ headerTitle:"Franchisee Name", value:dcAlignment.franchiseName , mouseOver: "Franchisee Name", isShow: true, attributeName: "franchiseName",dataType:'string'  }
      rowData.push(franchiseName)
      var FranchiseAlignmentStart: Gridview ={ headerTitle:"Franchisee Alignment Start Date", value:(dcAlignment.franchiseAlignmentStartDate==null||dcAlignment.franchiseAlignmentStartDate=="")?"":formatDate(dcAlignment.franchiseAlignmentStartDate) , mouseOver: "Franchisee Alignment Start Date", isShow: false, attributeName: "franchiseAlignmentStartDate"  }
      rowData.push(FranchiseAlignmentStart)
      var FranchiseAlignmentEnd: Gridview ={ headerTitle:"Franchisee Alignment End Date", value:(dcAlignment.franchiseAlignmentEndDate==null||dcAlignment.franchiseAlignmentEndDate=="")?"":formatDate(dcAlignment.franchiseAlignmentEndDate) , mouseOver: "Franchisee Alignment End Date", isShow: false, attributeName: "franchiseAlignmentEndDate"  }
      rowData.push(FranchiseAlignmentEnd)
      var lastInvoicedBY: Gridview ={ headerTitle:"Last Invoiced By", value:dcAlignment.lastInvoicedBY , mouseOver: "Last Invoiced By", isShow: true, attributeName: "lastInvoicedBY",dataType:'string'  }
      rowData.push(lastInvoicedBY)
      var lastInvoicedDate: Gridview ={ headerTitle:"Last Invoiced Date", value:(dcAlignment.lastInvoicedDate==null||dcAlignment.lastInvoicedDate=="")?"":formatDate(dcAlignment.lastInvoicedDate) , mouseOver: "Last Invoiced Date", isShow: true, attributeName: "lastInvoicedDate",dataType:'string'  }
      rowData.push(lastInvoicedDate)
      var dmaNumber: Gridview = { headerTitle: "Restaurant DMA Number", value: dcAlignment.dmaNumber, mouseOver: "Restaurant DMA Number", isShow: false, attributeName: "dmaNumber",dataType:'string' };
      rowData.push(dmaNumber);
      var dmaName: Gridview = { headerTitle: "Restaurant DMA Name", value: dcAlignment.dmaName, mouseOver: "Restaurant DMA Name", isShow: true, attributeName: "dmaName",dataType:'string' };
      rowData.push(dmaName);

      dcAlignmentsList.push(rowData)
    });
    return dcAlignmentsList;
  }
  getAllRestaurants(searchTerm: string) {
    const url = `${this.apiRoot}`  + searchTerm;
    return this.http.get<any>(url, { observe: 'response' });
  }


}
