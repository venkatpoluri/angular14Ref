import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TradingPartnerComponent } from './trading-partner/trading-partner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { ToastrModule } from 'ngx-toastr';
import { UserManagementComponent } from './user-management/user-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TenantselectionComponent } from './user-management/tenantselection/tenantselection.component';
import { UsersComponent } from './user-management/users/users.component';
import { NbLayoutModule, NbSelectModule, NbThemeModule } from '@nebular/theme';
import { ViewUserComponent } from './user-management/users/view-user/view-user.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCheckboxDefaultOptions, MatCheckboxModule, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { NavbarComponent } from './navbar/navbar.component';
import { MultileveldropdownComponent } from './multileveldropdown/multileveldropdown.component';
import { HttpConfigInterceptor } from './helpers/httpconfig.interceptor';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NewUserComponent } from './user-management/users/new-user/new-user.component';
import { TradingPartnerGridComponent } from './trading-partner/trading-partner-grid/trading-partner-grid.component';
import { TradingPartnerViewComponent } from './trading-partner/trading-partner-view/trading-partner-view.component';
import { TradingPartnerCreateComponent } from './trading-partner/trading-partner-create/trading-partner-create.component';
import { TradingPartnerInfoComponent } from './trading-partner/trading-partner-view/trading-partner-info/trading-partner-info.component';
import { TradingPartnerViewFacilityComponent } from './trading-partner/trading-partner-view/trading-partner-view-facility/trading-partner-view-facility.component';
import { TradingPartnerViewFacilityItemComponent } from './trading-partner/trading-partner-view/trading-partner-view-facility-item/trading-partner-view-facility-item.component';
import { TradingPartnerViewSupplyAgreementComponent } from './trading-partner/trading-partner-view/trading-partner-view-supply-agreement/trading-partner-view-supply-agreement.component';
import { TradingPartnerViewContactComponent } from './trading-partner/trading-partner-view/trading-partner-view-contact/trading-partner-view-contact.component';
import { TradingPartnerInfoEditComponent } from './trading-partner/trading-partner-edit/trading-partner-info-edit/trading-partner-info-edit.component';
import { TradingPartnerFacilityEditComponent } from './trading-partner/trading-partner-edit/trading-partner-facility-edit/trading-partner-facility-edit.component';
import { TradingPartnerFacilityDetailComponent } from './components/trading-partner-details/trading-partner-facility-detail/trading-partner-facility-detail.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ComponentsModule } from './components/components-module';
import { UserEditComponent } from './user-management/users/user-edit/user-edit.component';
import { SharedEventService } from './services/shared-event.service';
import { AllSupplyAgreementsComponent } from './all-supply-agreements/all-supply-agreements.component';
import { AllFacilityComponent } from './all-facility/all-facility.component';
import { TradingPartnerCreateFacilityComponent } from './trading-partner/trading-partner-create/trading-partner-create-facility/trading-partner-create-facility.component';
import { TradingPartnerCreateSupplyAgreementComponent } from './trading-partner/trading-partner-create/trading-partner-create-supply-agreement/trading-partner-create-supply-agreement.component';
import { TradingPartnerCreateContactComponent } from './trading-partner/trading-partner-create/trading-partner-create-contact/trading-partner-create-contact.component';
import { TradingPartnerFacilityViewEditComponent } from './trading-partner/trading-partner-edit-view/trading-partner-facility-view-edit/trading-partner-facility-view-edit.component';
import { TradingPartnerSupplyagreementComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supplyagreement/trading-partner-supplyagreement.component';
import { TradingPartnerSupplyAgreementEditComponent } from './trading-partner/trading-partner-edit/trading-partner-supply-agreement-edit/trading-partner-supply-agreement-edit.component';
import { TradingPartnerContactEditComponent } from './trading-partner/trading-partner-edit/trading-partner-contact-edit/trading-partner-contact-edit.component';
import { NgxBootstrapMultiselectModule } from 'ngx-bootstrap-multiselect';
import { MatStepperModule } from '@angular/material/stepper';
import { LocalStorageRefService } from './services/local-storage-ref.service';
import { TradingPartnerFacilityComponent } from './trading-partner/trading-partner-edit-view/trading-partner-facility/trading-partner-facility.component';
import { TradingPartnerSupplyAgreementEditViewComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/trading-partner-supply-agreement-edit-view.component';
import { TradingPartnerContactViewEditCreateComponent } from './trading-partner/trading-partner-edit-view/trading-partner-contact-view-edit-create/trading-partner-contact-view-edit-create.component';
import { TradingPartnerContactComponent } from './trading-partner/trading-partner-edit-view/trading-partner-contact/trading-partner-contact.component';
import { AddHeaderInterceptor } from './services/add-header-interceptor';
import { CookieService } from 'ngx-cookie-service';
import { AmendmentCreateComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/supply-agreement-amendment/amendment-create-edit-view/amendment-create/create.component';
import { AmendmentEditComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/supply-agreement-amendment/amendment-create-edit-view/amendment-edit/edit.component';
import { AmendmentViewComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/supply-agreement-amendment/amendment-create-edit-view/amendment-view/view.component';
import { SupplyAgreementAmendmentDetailsComponent } from './components/trading-partner-details/supply-agreement-amendment-details/supply-agreement-amendment-details.component';
import { AmendmentCreateEditViewComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/supply-agreement-amendment/amendment-create-edit-view/amendment.component';
import { AmendmentGridComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/supply-agreement-amendment/amendment-grid/amendment-grid.component';
import { AllContactsComponent } from './all-contacts/all-contacts.component';
import { FranchiseCreateComponent } from './franchise/franchise-create/franchise-create.component';
import { FranchiseEditComponent } from './franchise/franchise-edit/franchise-edit.component';
import { FranchiseViewComponent } from './franchise/franchise-view/franchise-view.component';
import { GeneralInfoComponent } from './franchise/franchise-create/general-info/general-info.component';
import { InfoComponent } from './franchise/franchise-view/info/info.component';
import { RestaurantComponent } from './franchise/franchise-view/restaurant/restaurant.component';
import { FranchiseInfoDetailComponent } from './components/franchise/franchise-info-detail/franchise-info-detail.component';
import { GeneralInfoComponentEdit } from './franchise/franchise-edit/general-info/general-info.component';
import { RestaurantCreateComponent } from './restaurant/restaurant-create/restaurant-create.component';
import { RestaurantEditViewComponent } from './restaurant/restaurant-edit-view/restaurant-edit-view.component';
import { RestaurantInfoEditComponent } from './restaurant/restaurant-edit-view/edit/restaurant-info-edit/restaurant-info-edit.component';
import { RestaurantInfoViewComponent } from './restaurant/restaurant-edit-view/view/restaurant-info-view/restaurant-info-view.component';
import { RestaurantFranchiseeListComponent } from './restaurant/restaurant-edit-view/view/restaurant-franchisee-list/restaurant-franchisee-list.component';
import { RestaurantInfoDetailsComponent } from './components/restaurant/restaurant-info-details/restaurant-info-details.component';
import { UserMfaGuardService } from './guards/user-mfa.guard';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SupplyAgreementsChartComponent } from './dashboard/supply-agreements-chart/supply-agreements-chart.component';
import { PriceComponentsChartComponent } from './dashboard/price-components-chart/price-components-chart.component';
import { DataIssuesChartComponent } from './dashboard/data-issues-chart/data-issues-chart.component';
import { NgxUiLoaderModule,
  NgxUiLoaderHttpModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION } from 'ngx-ui-loader';
import { AllFranchiseesComponent } from './all-franchisees/all-franchisees.component';
import { RestaurantGridComponent } from './components/grid/restaurant-grid/restaurant-grid.component';
import { AllRestaurantsComponent } from './all-restaurants/all-restaurants.component';
import { RealignRestaurantToDCComponent } from './all-dc-alignment/realign-restaurant-to-dc/realign-restaurant-to-dc.component';
import { DcAlignmentGridComponent } from './all-dc-alignment/dc-alignment-grid/dc-alignment-grid.component';
import { BItemFilterPipe } from './b-item-filter.pipe';
import { AllDcAlignmentComponent } from './all-dc-alignment/all-dc-alignment.component';
import { AddItemComponent } from './items/add-item/add-item.component';
import { EditViewItemComponent } from './items/edit-view-item/edit-view-item.component';
import { ItemInfoDetailComponent } from './components/items/item-info-detail/item-info-detail.component';
import { EditInfoComponent } from './items/edit-view-item/edit/edit-info/edit-info.component';
import { ViewInfoComponent } from './items/edit-view-item/view/view-info/view-info.component';
import { ViewFacilityItemsComponent } from './items/edit-view-item/view/view-facility-items/view-facility-items.component';
import { ViewMenuItemsComponent } from './items/edit-view-item/view/view-menu-items/view-menu-items.component';
import { ViewAlternateItemsComponent } from './items/edit-view-item/view/view-alternate-items/view-alternate-items.component';
import { ViewSupplyAgmtsComponent } from './items/edit-view-item/view/view-supply-agmts/view-supply-agmts.component';
import { SupplierComponent } from './items/edit-view-item/view/view-facility-items/supplier/supplier.component';
import { DistributorComponent } from './items/edit-view-item/view/view-facility-items/distributor/distributor.component';
import { AllItemsComponent } from './all-items/all-items.component';
import { ViewChildItemsComponent } from './items/edit-view-item/view/view-child-items/view-child-items.component';
import { ChildItemInfoDetailComponent } from './components/child-item-info-detail/child-item-info-detail.component';
import { ViewChildItemComponent } from './items/child-item/view-child-item/view-child-item.component';
import { EditChildItemComponent } from './items/child-item/edit-child-item/edit-child-item.component';
import { DateBeforeValidationDirective } from './components/directives/date-before-validation.directive';
import { EmailOrWebsiteValidationDirective } from './components/directives/email-or-website-validation.directive';
import { AllSupplierItemsComponent } from './all-supplier-items/all-supplier-items.component';
import { ChildItemComponent } from './items/child-item/child-item.component';
import { AddChildItemComponent } from './items/child-item/add-child-item/add-child-item.component';
import { AllDcItemsComponent } from './all-dc-items/all-dc-items.component';
import { DcItemsComponent } from './dc-items/dc-items.component';
import { AddDcItemComponent } from './dc-items/add-dc-item/add-dc-item.component';
import { EditDcItemComponent } from './dc-items/edit-dc-item/edit-dc-item.component';
import { ViewDcItemComponent } from './dc-items/view-dc-item/view-dc-item.component';
import { DcItemInfoDetailComponent } from './components/dc-items/dc-item-info-detail/dc-item-info-detail.component';
import { AllMenuItemsComponent } from './all-menu-items/all-menu-items.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { AddMenuItemComponent } from './menu-item/add-menu-item/add-menu-item.component';
import { EditMenuItemComponent } from './menu-item/edit-menu-item/edit-menu-item.component';
import { ViewMenuItemComponent } from './menu-item/view-menu-item/view-menu-item.component';
import { MenuItemInfoDetailComponent } from './components/menu-item-info-detail/menu-item-info-detail.component';
import { InfoMenuComponent } from './menu-item/view-menu-item/info-menu/info-menu.component';
import { PlateCostPeriodComponent } from './menu-item/view-menu-item/plate-cost-period/plate-cost-period.component';
import { SupplierItemComponent } from './supplier-item/supplier-item.component';
import { AddSupplierItemComponent } from './supplier-item/add-supplier-item/add-supplier-item.component';
import { EditSupplierItemComponent } from './supplier-item/edit-supplier-item/edit-supplier-item.component';
import { ViewSupplierItemComponent } from './supplier-item/view-supplier-item/view-supplier-item.component';
import { SupplierItemInfoDetailComponent } from './components/supplier-item-info-detail/supplier-item-info-detail.component';
import { MenuItemBuildComponent } from './menu-item/view-menu-item/menu-item-build-add-edit/menu-item-build.component';
import { AddPlateComponent } from './menu-item/view-menu-item/plate-cost-period/add-plate/add-plate.component';
import { EditPeriodComponent } from './menu-item/view-menu-item/plate-cost-period/edit-period/edit-period.component';
import { TradingPartnerSupplierComponent } from './trading-partner/trading-partner-view/trading-partner-view-facility-item/trading-partner-supplier/trading-partner-supplier.component';
import { TradingPartnerDistributorComponent } from './trading-partner/trading-partner-view/trading-partner-view-facility-item/trading-partner-distributor/trading-partner-distributor.component';
import { FacilityViewFacilityItemGridComponent } from './trading-partner/trading-partner-edit-view/trading-partner-facility-view-edit/facility-view-facility-item-grid/facility-view-facility-item-grid.component';
import { FacilityItemDistributorComponent } from './trading-partner/trading-partner-edit-view/trading-partner-facility-view-edit/facility-view-facility-item-grid/facility-item-distributor/facility-item-distributor.component';
import { FacilityItemSupplierComponent } from './trading-partner/trading-partner-edit-view/trading-partner-facility-view-edit/facility-view-facility-item-grid/facility-item-supplier/facility-item-supplier.component';
import { MenuItemBuildGridComponent } from './menu-item/view-menu-item/menu-item-build-grid/menu-item-build-grid.component';
import { ItemXrefGridComponent } from './all-item-xref/item-xref-grid/item-xref-grid.component';
import { AllItemXrefComponent } from './all-item-xref/all-item-xref.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AllHeirarchyComponent } from './all-heirarchy/all-heirarchy.component';
import { AddHeirarchyComponent } from './heirarchy/add-heirarchy/add-heirarchy.component';
import { EditHeirarchyComponent } from './heirarchy/edit-heirarchy/edit-heirarchy.component';
import { ViewHeirarchyComponent } from './heirarchy/view-heirarchy/view-heirarchy.component';
import { InfoHeirarchyComponent } from './heirarchy/view-heirarchy/info-heirarchy/info-heirarchy.component';
import { CategoryHeirarchyComponent } from './heirarchy/view-heirarchy/category-heirarchy/category-heirarchy.component';
import { LevelHeirarchyComponent } from './heirarchy/view-heirarchy/level-heirarchy/level-heirarchy.component';
import { HeirarchyInfoDetailComponent } from './components/heirarchy-info-detail/heirarchy-info-detail.component';
import {MatTreeModule} from '@angular/material/tree';

import { EmailWebValTradingDirective } from './components/directives/email-web-val-trading.directive';
import { ActionSupplyAgreementsComponent } from './action-supply-agreements/action-supply-agreements.component';
import { NewCategoryComponent } from './heirarchy/view-heirarchy/category-heirarchy/new-category/new-category.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AllExchangeRatesComponent } from './all-exchange-rates/all-exchange-rates.component';
import { ExchangeRateInfoDetailComponent } from './components/exchange-rate-info-detail/exchange-rate-info-detail.component';
import { ExchangeRateAddComponent } from './exchange-rate/exchange-rate-add/exchange-rate-add.component';
import { ExchangeRateEditComponent } from './exchange-rate/exchange-rate-edit/exchange-rate-edit.component';
import { ExchangeRateViewComponent } from './exchange-rate/exchange-rate-view/exchange-rate-view.component';
import { AllMarkupsComponent } from './all-markups/all-markups.component';
import { FacilityMarkupComponent } from './trading-partner/trading-partner-edit-view/facility-markup/facility-markup.component';
import { MarkupPeriodComponent } from './trading-partner/trading-partner-edit-view/facility-markup/markup-period/markup-period.component';
import { BaseMarkupsComponent } from './trading-partner/trading-partner-edit-view/facility-markup/base-markups/base-markups.component';
import { AddFacilityMarkupComponent } from './facility-markup/add-facility-markup/add-facility-markup.component';
import { EditFacilityMarkupComponent } from './facility-markup/edit-facility-markup/edit-facility-markup.component';
import { AddEditFacilityMarkupComponent } from './facility-markup/add-edit-facility-markup.component';
import { FacilityMarkupInfoDetailComponent } from './components/facility-markup-info-detail/facility-markup-info-detail.component';
import { SupplierMarkupComponent } from './supplier-markup/supplier-markup.component';
import { AddSupplierMarkupComponent } from './supplier-markup/add-supplier-markup/add-supplier-markup.component';
import { EditSupplierMarkupComponent } from './supplier-markup/edit-supplier-markup/edit-supplier-markup.component';
import { ViewSupplierMarkupComponent } from './supplier-markup/view-supplier-markup/view-supplier-markup.component';
import { SupplierMarkupInfoDetailComponent } from './components/supplier-markup-info-detail/supplier-markup-info-detail.component';
import { ActionPriceComponentComponent } from './action-price-component/action-price-component.component';

import { ItemPricingDetailsComponent } from './pricing/item-pricing/item-pricing-details/item-pricing-details.component';
import { LaneSegmentsComponent } from './pricing/item-pricing/lane-segments/lane-segments.component';
import { LandedCostComponent } from './pricing/item-pricing/landed-cost/landed-cost.component';
import { ItemPricingComponent } from './pricing/item-pricing/item-pricing.component';
import { NewLaneSegmentComponent } from './pricing/item-pricing/lane-segments/new-lane-segment/new-lane-segment.component';
import { AddDcBaseMarkupComponent } from './trading-partner/trading-partner-edit-view/facility-markup/base-markups/add-dc-base-markup/add-dc-base-markup.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CopySidePopComponent } from './trading-partner/trading-partner-edit-view/facility-markup/markup-period/copy-side-pop/copy-side-pop.component';
import { AllPriceComponentComponent } from './all-price-component/all-price-component.component';
import { ViewFreightComponent } from './supply-agreement-freight/view-freight/view-freight.component';
import { FreightPeriodGridComponent } from './components/grid/freight-period-grid/freight-period-grid.component';
import { PriceComponentEditComponent } from './price-component/price-component-edit/price-component-edit.component';
import { PriceComponentViewComponent } from './price-component/price-component-view/price-component-view.component';
import { PriceComponentInfoDetailComponent } from './components/price-component-info-detail/price-component-info-detail.component';
import { PriceComponentComponent } from './price-component/price-component/price-component.component';
import { EndDateValidatorFieldDirective } from './components/directives/end-date-validator-field.directive';
import { SortDirective } from './components/directives/sort.directive';
import { SupplyagreementItemsGridComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/supply-agreement-item/supplyagreement-items-grid/supplyagreement-items-grid.component';
import { FreightCopyOverlayComponent } from './components/freight-copy-overlay/freight-copy-overlay.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "#2F4E6D",
  bgsPosition: POSITION.bottomRight,
  bgsSize:20,
  bgsType: SPINNER.ballSpinClockwise,
  fgsColor: "white",
  fgsType: SPINNER.ballSpinClockwise,
  hasProgressBar: false,
};

@NgModule({
  declarations: [
    AppComponent,
    TradingPartnerComponent,
    UserManagementComponent,
    DashboardComponent,
    TenantselectionComponent,
    UsersComponent,
    ViewUserComponent,
    UserEditComponent,
    NavbarComponent,
    MultileveldropdownComponent,
    NewUserComponent,
    TradingPartnerGridComponent,
    TradingPartnerViewComponent,
    TradingPartnerCreateComponent,
    TradingPartnerInfoComponent,
    TradingPartnerViewFacilityComponent,
    TradingPartnerViewFacilityItemComponent,
    TradingPartnerViewSupplyAgreementComponent,
    TradingPartnerViewContactComponent,
    TradingPartnerInfoEditComponent,
    TradingPartnerFacilityEditComponent,
    TradingPartnerFacilityDetailComponent,
    AllSupplyAgreementsComponent,
    AllFacilityComponent,
    TradingPartnerCreateFacilityComponent,
    TradingPartnerCreateSupplyAgreementComponent,
    TradingPartnerCreateContactComponent,
    TradingPartnerFacilityViewEditComponent,
    TradingPartnerSupplyAgreementEditViewComponent,
    TradingPartnerFacilityComponent,
    TradingPartnerSupplyagreementComponent,
    TradingPartnerSupplyAgreementEditComponent,
    TradingPartnerContactEditComponent,
    TradingPartnerContactViewEditCreateComponent,
    TradingPartnerContactComponent,
    AmendmentCreateComponent,
    AmendmentEditComponent,
    AmendmentViewComponent,
    SupplyAgreementAmendmentDetailsComponent,
    AmendmentCreateEditViewComponent,
    AmendmentGridComponent,
    AllContactsComponent,
    FranchiseCreateComponent,
    FranchiseEditComponent,
    FranchiseViewComponent,
    GeneralInfoComponent,
    InfoComponent,
    RestaurantComponent,
    FranchiseInfoDetailComponent,
    GeneralInfoComponentEdit,
    RestaurantCreateComponent,
    RestaurantEditViewComponent,
    RestaurantInfoEditComponent,
    RestaurantInfoViewComponent,
    RestaurantFranchiseeListComponent,
    RestaurantInfoDetailsComponent,
    AllFranchiseesComponent,
    RestaurantGridComponent,
    AllRestaurantsComponent,
    BItemFilterPipe,
    AllDcAlignmentComponent,
    RealignRestaurantToDCComponent,
    DcAlignmentGridComponent,
    AddItemComponent,
    EditViewItemComponent,
    ItemInfoDetailComponent,
    EditInfoComponent,
    ViewInfoComponent,
    ViewFacilityItemsComponent,
    ViewMenuItemsComponent,
    ViewAlternateItemsComponent,
    ViewSupplyAgmtsComponent,
    SupplierComponent,
    DistributorComponent,
    AllItemsComponent,
    ViewChildItemsComponent,
    DateBeforeValidationDirective,
    EmailOrWebsiteValidationDirective,
    AllSupplierItemsComponent,
    ChildItemComponent,
    AddChildItemComponent,
    ChildItemInfoDetailComponent,
    ViewChildItemComponent,
    EditChildItemComponent,
    AllDcItemsComponent,
    DcItemsComponent,
    AddDcItemComponent,
    EditDcItemComponent,
    ViewDcItemComponent,
    DcItemInfoDetailComponent,
    AllMenuItemsComponent,
    MenuItemComponent,
    AddMenuItemComponent,
    EditMenuItemComponent,
    ViewMenuItemComponent,
    MenuItemInfoDetailComponent,
    InfoMenuComponent,
    PlateCostPeriodComponent,
    SupplierItemComponent,
    AddSupplierItemComponent,
    EditSupplierItemComponent,
    ViewSupplierItemComponent,
    SupplierItemInfoDetailComponent,
    AddPlateComponent,
    EditPeriodComponent,
    TradingPartnerSupplierComponent,
    TradingPartnerDistributorComponent,
    FacilityViewFacilityItemGridComponent,
    FacilityItemDistributorComponent,
    FacilityItemSupplierComponent,
    SupplyAgreementsChartComponent,
    PriceComponentsChartComponent,
    DataIssuesChartComponent,
    MenuItemBuildGridComponent,
    ItemXrefGridComponent,
    AllItemXrefComponent,
    AllHeirarchyComponent,
    AddHeirarchyComponent,
    EditHeirarchyComponent,
    ViewHeirarchyComponent,
    InfoHeirarchyComponent,
    CategoryHeirarchyComponent,
    LevelHeirarchyComponent,
    HeirarchyInfoDetailComponent,
    EmailWebValTradingDirective,
    ActionSupplyAgreementsComponent,
    NewCategoryComponent,
    AllExchangeRatesComponent,
    ExchangeRateInfoDetailComponent,
    ExchangeRateAddComponent,
    ExchangeRateEditComponent,
    ExchangeRateViewComponent,
    AllMarkupsComponent,
    FacilityMarkupComponent,
    MarkupPeriodComponent,
    BaseMarkupsComponent,
    AddFacilityMarkupComponent,
    EditFacilityMarkupComponent,
    AddEditFacilityMarkupComponent,
    FacilityMarkupInfoDetailComponent,
    SupplierMarkupComponent,
    AddSupplierMarkupComponent,
    EditSupplierMarkupComponent,
    ViewSupplierMarkupComponent,
    SupplierMarkupInfoDetailComponent,
    ActionPriceComponentComponent,

    ItemPricingComponent,
    ItemPricingDetailsComponent,
    LaneSegmentsComponent,
    LandedCostComponent,
    NewLaneSegmentComponent,
    CopySidePopComponent,
    AllPriceComponentComponent,
    ViewFreightComponent,
    FreightPeriodGridComponent,
    PriceComponentEditComponent,
    PriceComponentViewComponent,
    PriceComponentInfoDetailComponent,
    PriceComponentComponent,
    EndDateValidatorFieldDirective,
    SortDirective,
    SupplyagreementItemsGridComponent,
    FreightCopyOverlayComponent,
  ],
  imports: [
    MatAutocompleteModule,
    NbLayoutModule,
    BrowserAnimationsModule,
    BrowserModule,
    ComponentsModule,
    HttpClientModule,
    AppRoutingModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    NgxBootstrapIconsModule.pick(allIcons),
    DragDropModule,
    ToastrModule.forRoot(),
    NbThemeModule.forRoot(),
    NbSelectModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatCardModule,
    MatCheckboxModule,
    MatStepperModule,
    MatTabsModule,
    MatDialogModule,
    RouterModule,
    AppRoutingModule,
    NgxBootstrapMultiselectModule,
    NgxSpinnerModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule,
    AutocompleteLibModule,
    MatTreeModule,
    NgxChartsModule,
    NgxSkeletonLoaderModule,

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [UserMfaGuardService, SharedEventService, DatePipe, LocalStorageRefService,HttpClientModule,
    {
      provide: { MAT_CHECKBOX_DEFAULT_OPTIONS, HTTP_INTERCEPTORS }, useValue: { clickAction: 'check', indeterminate: false } as MatCheckboxDefaultOptions,
      useClass: HttpConfigInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddHeaderInterceptor,
      multi: true
    },
    CookieService
  ]
})
export class AppModule { }
