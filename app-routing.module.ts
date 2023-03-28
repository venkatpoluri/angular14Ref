import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TenantselectionComponent } from './user-management/tenantselection/tenantselection.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserEditComponent } from './user-management/users/user-edit/user-edit.component';
import { UsersComponent } from './user-management/users/users.component';
import { ViewUserComponent } from './user-management/users/view-user/view-user.component';
import { TradingPartnerComponent } from './trading-partner/trading-partner.component';
import { NewUserComponent } from './user-management/users/new-user/new-user.component';
import { TradingPartnerGridComponent } from './trading-partner/trading-partner-grid/trading-partner-grid.component';
import { TradingPartnerViewComponent } from './trading-partner/trading-partner-view/trading-partner-view.component';
import { TradingPartnerInfoComponent } from './trading-partner/trading-partner-view/trading-partner-info/trading-partner-info.component';
import { TradingPartnerViewFacilityItemComponent } from './trading-partner/trading-partner-view/trading-partner-view-facility-item/trading-partner-view-facility-item.component';
import { TradingPartnerViewFacilityComponent } from './trading-partner/trading-partner-view/trading-partner-view-facility/trading-partner-view-facility.component';
import { TradingPartnerViewSupplyAgreementComponent } from './trading-partner/trading-partner-view/trading-partner-view-supply-agreement/trading-partner-view-supply-agreement.component';
import { TradingPartnerViewContactComponent } from './trading-partner/trading-partner-view/trading-partner-view-contact/trading-partner-view-contact.component';
import { TradingPartnerInfoEditComponent } from './trading-partner/trading-partner-edit/trading-partner-info-edit/trading-partner-info-edit.component';
import { TradingPartnerCreateComponent } from './trading-partner/trading-partner-create/trading-partner-create.component';
import { AllFacilityComponent } from './all-facility/all-facility.component';
import { AllSupplyAgreementsComponent } from './all-supply-agreements/all-supply-agreements.component';
import { TradingPartnerCreateFacilityComponent } from './trading-partner/trading-partner-create/trading-partner-create-facility/trading-partner-create-facility.component';
import { TradingPartnerCreateSupplyAgreementComponent } from './trading-partner/trading-partner-create/trading-partner-create-supply-agreement/trading-partner-create-supply-agreement.component';
import { TradingPartnerCreateContactComponent } from './trading-partner/trading-partner-create/trading-partner-create-contact/trading-partner-create-contact.component';
import { TradingPartnerFacilityViewEditComponent } from './trading-partner/trading-partner-edit-view/trading-partner-facility-view-edit/trading-partner-facility-view-edit.component';
import { TradingPartnerFacilityEditComponent } from './trading-partner/trading-partner-edit/trading-partner-facility-edit/trading-partner-facility-edit.component';
import { TradingPartnerSupplyagreementComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supplyagreement/trading-partner-supplyagreement.component';
import { TradingPartnerSupplyAgreementEditComponent } from './trading-partner/trading-partner-edit/trading-partner-supply-agreement-edit/trading-partner-supply-agreement-edit.component';
import { TradingPartnerContactEditComponent } from './trading-partner/trading-partner-edit/trading-partner-contact-edit/trading-partner-contact-edit.component';
import { TradingPartnerContactViewEditCreateComponent } from './trading-partner/trading-partner-edit-view/trading-partner-contact-view-edit-create/trading-partner-contact-view-edit-create.component';
import { AllContactsComponent } from './all-contacts/all-contacts.component';
import { AppLayoutComponent } from './components/layouts/app-layout/app-layout.component';
import { TradingPartnerContactComponent } from './trading-partner/trading-partner-edit-view/trading-partner-contact/trading-partner-contact.component';
import { TradingPartnerFacilityComponent } from './trading-partner/trading-partner-edit-view/trading-partner-facility/trading-partner-facility.component';
import { TradingPartnerSupplyAgreementEditViewComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/trading-partner-supply-agreement-edit-view.component';
import { AmendmentCreateEditViewComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/supply-agreement-amendment/amendment-create-edit-view/amendment.component';
import { AmendmentCreateComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/supply-agreement-amendment/amendment-create-edit-view/amendment-create/create.component';
import { AmendmentViewComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/supply-agreement-amendment/amendment-create-edit-view/amendment-view/view.component';
import { AmendmentGridComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/supply-agreement-amendment/amendment-grid/amendment-grid.component';
import { AmendmentEditComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/supply-agreement-amendment/amendment-create-edit-view/amendment-edit/edit.component';
import { FranchiseCreateComponent } from './franchise/franchise-create/franchise-create.component';
import { GeneralInfoComponent } from './franchise/franchise-create/general-info/general-info.component';
import { FranchiseEditComponent } from './franchise/franchise-edit/franchise-edit.component';
import { GeneralInfoComponentEdit } from './franchise/franchise-edit/general-info/general-info.component';
import { InfoComponent } from './franchise/franchise-view/info/info.component';
import { RestaurantComponent } from './franchise/franchise-view/restaurant/restaurant.component';
import { FranchiseViewComponent } from './franchise/franchise-view/franchise-view.component';
import { RestaurantCreateComponent } from './restaurant/restaurant-create/restaurant-create.component';
import { RestaurantEditViewComponent } from './restaurant/restaurant-edit-view/restaurant-edit-view.component';
import { RestaurantInfoEditComponent } from './restaurant/restaurant-edit-view/edit/restaurant-info-edit/restaurant-info-edit.component';
import { RestaurantInfoViewComponent } from './restaurant/restaurant-edit-view/view/restaurant-info-view/restaurant-info-view.component';
import { RestaurantFranchiseeListComponent } from './restaurant/restaurant-edit-view/view/restaurant-franchisee-list/restaurant-franchisee-list.component';
import { UserMfaGuardService } from './guards/user-mfa.guard';
import { AllFranchiseesComponent } from './all-franchisees/all-franchisees.component';
import { AllRestaurantsComponent } from './all-restaurants/all-restaurants.component';
import { AllDcAlignmentComponent } from './all-dc-alignment/all-dc-alignment.component';
import { RealignRestaurantToDCComponent } from './all-dc-alignment/realign-restaurant-to-dc/realign-restaurant-to-dc.component';
import { DcAlignmentGridComponent } from './all-dc-alignment/dc-alignment-grid/dc-alignment-grid.component';
import { AddItemComponent } from './items/add-item/add-item.component';
import { EditViewItemComponent } from './items/edit-view-item/edit-view-item.component';
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
import { AllSupplierItemsComponent } from './all-supplier-items/all-supplier-items.component';
import { ChildItemComponent } from './items/child-item/child-item.component';
import { AddChildItemComponent } from './items/child-item/add-child-item/add-child-item.component';
import { EditChildItemComponent } from './items/child-item/edit-child-item/edit-child-item.component';
import { ViewChildItemComponent } from './items/child-item/view-child-item/view-child-item.component';
import { AllDcItemsComponent } from './all-dc-items/all-dc-items.component';
import { DcItemsComponent } from './dc-items/dc-items.component';
import { AddDcItemComponent } from './dc-items/add-dc-item/add-dc-item.component';
import { EditDcItemComponent } from './dc-items/edit-dc-item/edit-dc-item.component';
import { ViewDcItemComponent } from './dc-items/view-dc-item/view-dc-item.component';
import { AllMenuItemsComponent } from './all-menu-items/all-menu-items.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { AddMenuItemComponent } from './menu-item/add-menu-item/add-menu-item.component';
import { EditMenuItemComponent } from './menu-item/edit-menu-item/edit-menu-item.component';
import { ViewMenuItemComponent } from './menu-item/view-menu-item/view-menu-item.component';
import { InfoMenuComponent } from './menu-item/view-menu-item/info-menu/info-menu.component';
import { PlateCostPeriodComponent } from './menu-item/view-menu-item/plate-cost-period/plate-cost-period.component';
import { SupplierItemComponent } from './supplier-item/supplier-item.component';
import { AddSupplierItemComponent } from './supplier-item/add-supplier-item/add-supplier-item.component';
import { EditSupplierItemComponent } from './supplier-item/edit-supplier-item/edit-supplier-item.component';
import { ViewSupplierItemComponent } from './supplier-item/view-supplier-item/view-supplier-item.component';
import { AddPlateComponent } from './menu-item/view-menu-item/plate-cost-period/add-plate/add-plate.component';
import { TradingPartnerDistributorComponent } from './trading-partner/trading-partner-view/trading-partner-view-facility-item/trading-partner-distributor/trading-partner-distributor.component';
import { TradingPartnerSupplierComponent } from './trading-partner/trading-partner-view/trading-partner-view-facility-item/trading-partner-supplier/trading-partner-supplier.component';
import { FacilityViewFacilityItemGridComponent } from './trading-partner/trading-partner-edit-view/trading-partner-facility-view-edit/facility-view-facility-item-grid/facility-view-facility-item-grid.component';
import { FacilityItemSupplierComponent } from './trading-partner/trading-partner-edit-view/trading-partner-facility-view-edit/facility-view-facility-item-grid/facility-item-supplier/facility-item-supplier.component';
import { FacilityItemDistributorComponent } from './trading-partner/trading-partner-edit-view/trading-partner-facility-view-edit/facility-view-facility-item-grid/facility-item-distributor/facility-item-distributor.component';
import { MenuItemBuildComponent } from './menu-item/view-menu-item/menu-item-build-add-edit/menu-item-build.component';
import { MenuItemBuildGridComponent } from './menu-item/view-menu-item/menu-item-build-grid/menu-item-build-grid.component';
import { AllItemXrefComponent } from './all-item-xref/all-item-xref.component';
import { ItemXrefGridComponent } from './all-item-xref/item-xref-grid/item-xref-grid.component';
import { AllHeirarchyComponent } from './all-heirarchy/all-heirarchy.component';
import { AddHeirarchyComponent } from './heirarchy/add-heirarchy/add-heirarchy.component';
import { EditHeirarchyComponent } from './heirarchy/edit-heirarchy/edit-heirarchy.component';
import { ViewHeirarchyComponent } from './heirarchy/view-heirarchy/view-heirarchy.component';
import { InfoHeirarchyComponent } from './heirarchy/view-heirarchy/info-heirarchy/info-heirarchy.component';
import { CategoryHeirarchyComponent } from './heirarchy/view-heirarchy/category-heirarchy/category-heirarchy.component';
import { LevelHeirarchyComponent } from './heirarchy/view-heirarchy/level-heirarchy/level-heirarchy.component';
import { ActionSupplyAgreementsComponent } from './action-supply-agreements/action-supply-agreements.component';
import { AllExchangeRatesComponent } from './all-exchange-rates/all-exchange-rates.component';
import { ExchangeRateAddComponent } from './exchange-rate/exchange-rate-add/exchange-rate-add.component';
import { ExchangeRateEditComponent } from './exchange-rate/exchange-rate-edit/exchange-rate-edit.component';
import { ExchangeRateViewComponent } from './exchange-rate/exchange-rate-view/exchange-rate-view.component';
 import { AllMarkupsComponent } from './all-markups/all-markups.component';
import { BaseMarkupComponent } from './pricing/base-markup/base-markup.component';
import { MarkupPeriodComponent } from './trading-partner/trading-partner-edit-view/facility-markup/markup-period/markup-period.component';
import { FacilityMarkupComponent } from './trading-partner/trading-partner-edit-view/facility-markup/facility-markup.component';
import { BaseMarkupsComponent } from './trading-partner/trading-partner-edit-view/facility-markup/base-markups/base-markups.component';
import { AddEditFacilityMarkupComponent } from './facility-markup/add-edit-facility-markup.component';
import { AddFacilityMarkupComponent } from './facility-markup/add-facility-markup/add-facility-markup.component';
import { EditFacilityMarkupComponent } from './facility-markup/edit-facility-markup/edit-facility-markup.component';
import { SupplierMarkupComponent } from './supplier-markup/supplier-markup.component';
import { AddSupplierMarkupComponent } from './supplier-markup/add-supplier-markup/add-supplier-markup.component';
import { EditSupplierMarkupComponent } from './supplier-markup/edit-supplier-markup/edit-supplier-markup.component';
import { ViewSupplierMarkupComponent } from './supplier-markup/view-supplier-markup/view-supplier-markup.component';
import { NewLaneSegmentComponent } from './pricing/item-pricing/lane-segments/new-lane-segment/new-lane-segment.component';
import { ItemPricingComponent } from './pricing/item-pricing/item-pricing.component';
import { LaneSegmentsComponent } from './pricing/item-pricing/lane-segments/lane-segments.component';
import { ItemPricingDetailsComponent } from './pricing/item-pricing/item-pricing-details/item-pricing-details.component';
import { LandedCostComponent } from './pricing/item-pricing/landed-cost/landed-cost.component';
import { AllPriceComponentComponent } from './all-price-component/all-price-component.component';
import { ViewFreightComponent } from './supply-agreement-freight/view-freight/view-freight.component';
import { PriceComponentEditComponent } from './price-component/price-component-edit/price-component-edit.component';
import { PriceComponentViewComponent } from './price-component/price-component-view/price-component-view.component';
import { PriceComponentComponent } from './price-component/price-component/price-component.component';

import { ActionPriceComponentComponent } from './action-price-component/action-price-component.component';
import { SupplyagreementItemsGridComponent } from './trading-partner/trading-partner-edit-view/trading-partner-supply-agreement-edit-view/supply-agreement-item/supplyagreement-items-grid/supplyagreement-items-grid.component';

const routes: Routes = [

  { path: 'auth', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
  {
    path: '',
    component: AppLayoutComponent,
     //canActivate:[UserMfaGuardService],
    children: [
      {
        path: '', component: DashboardComponent,
        //canActivate:[UserMfaGuardService]
      },
      { path: 'role-management', loadChildren: () => import('./user-role-management/user-role-management.module').then(m => m.UserRoleManagementModule) },
      {
        path: 'user-management', component: UserManagementComponent,
        children: [
          { path: '', component: TenantselectionComponent, pathMatch: 'full' },
          { path: 'users/:tenantid', component: UsersComponent },
          { path: 'newuser/:tenantid', component: NewUserComponent },
          { path: 'edituser/:userid/:tenantid', component: UserEditComponent },
          { path: 'user/:userid/:tenantid', component: ViewUserComponent },
        ]
      },
      {
        path: 'all-facilities', component: AllFacilityComponent,
      },
      {
        path: 'all-supply-agreements', component: AllSupplyAgreementsComponent
      },
      { path: 'action-supply-agreements/:expired/:range/:buyers', component: ActionSupplyAgreementsComponent },
      { path: 'action-supply-agreements', component: ActionSupplyAgreementsComponent },
      { path: 'action-supply-agreements/:range', component: ActionSupplyAgreementsComponent },
      { path: 'action-supply-agreements/:expired', component: ActionSupplyAgreementsComponent },
      { path: 'action-supply-agreements/:buyers', component: ActionSupplyAgreementsComponent },
      { path: 'action-supply-agreements/:range/:buyers', component: ActionSupplyAgreementsComponent },
      { path: 'action-supply-agreements/:expired/:buyers', component: ActionSupplyAgreementsComponent },
      { path: 'action-supply-agreements/:expired/:range', component: ActionSupplyAgreementsComponent },

      { path: 'action-price-component', component: ActionPriceComponentComponent },
      { path: 'all-contacts', component: AllContactsComponent },
      {
        path: 'trading-partners', component: TradingPartnerComponent,
        children: [
          { path: '', component: TradingPartnerGridComponent, pathMatch: 'full' },

          {
            path: 'view/:tradingPartnerId', component: TradingPartnerViewComponent, children: [
              { path: 'info', component: TradingPartnerInfoComponent },
              {
                path: 'facility-item', component: TradingPartnerViewFacilityItemComponent,
                children: [
                  { path: 'supplier', component: TradingPartnerSupplierComponent },
                  { path: 'distributor', component: TradingPartnerDistributorComponent },
                ]
              },
              { path: 'facility', component: TradingPartnerViewFacilityComponent },
              { path: 'supply-agreement', component: TradingPartnerViewSupplyAgreementComponent, },
              { path: 'contact', component: TradingPartnerViewContactComponent },
              { path: 'edit-info', component: TradingPartnerInfoEditComponent }
            ]
          },
          {
            path: 'supply-agreements/:supplyAgreementId', component: TradingPartnerSupplyAgreementEditViewComponent,
            children: [
              { path: 'edit', component: TradingPartnerSupplyAgreementEditComponent },
              { path: 'view', component: TradingPartnerSupplyagreementComponent },
              { path: 'amendments', component: AmendmentGridComponent },
              { path: 'items', component: SupplyagreementItemsGridComponent },
              { path: 'markup', component: ViewSupplierMarkupComponent },
              {path: 'freight', component: ViewFreightComponent}
            ]
          },
          {
            path: 'facilities/:tradingPartnerId/:facilityId', component: TradingPartnerFacilityViewEditComponent,
            children: [
              { path: 'edit', component: TradingPartnerFacilityEditComponent },
              { path: 'view', component: TradingPartnerFacilityComponent },
              {
                path: 'facility-item', component: FacilityViewFacilityItemGridComponent,
                children: [
                  { path: 'supplier', component: FacilityItemSupplierComponent },
                  { path: 'distributor', component: FacilityItemDistributorComponent },
                ]
              },
              {
                path: 'markup', component: FacilityMarkupComponent,
                children: [
                  {path:'', redirectTo: 'markup-period' },
                  { path: 'base-markup', component: BaseMarkupsComponent },
                  { path: 'markup-period', component: MarkupPeriodComponent },
                ]
              },
            ]
          },
          { path: 'create', component: TradingPartnerCreateComponent, pathMatch: 'full' },
          {
            path: 'facility', component: TradingPartnerCreateFacilityComponent, children: [
              { path: 'create/:tradingPartnerId', component: TradingPartnerCreateFacilityComponent }
            ]
          },
          {
            path: 'supply-agreement', component: TradingPartnerCreateSupplyAgreementComponent, children: [
              { path: 'create/:tradingPartnerId', component: TradingPartnerCreateSupplyAgreementComponent }
            ]
          },
          {
            path: 'contact', component: TradingPartnerContactViewEditCreateComponent,
            children: [
              {
                path: 'create', component: TradingPartnerCreateContactComponent, children: [
                  { path: ':tradingPartnerId', component: TradingPartnerCreateContactComponent }
                ]
              },
              { path: 'view/:contactId', component: TradingPartnerContactComponent },
              { path: 'edit/:contactId', component: TradingPartnerContactEditComponent }
            ]
          },
          {
            path: 'supply-agreement-amendment/:supplyagreementId', component: AmendmentCreateEditViewComponent,
            children: [
              { path: 'create', component: AmendmentCreateComponent },
              { path: 'view/:amendmentId', component: AmendmentViewComponent },
              { path: 'edit/:amendmentId', component: AmendmentEditComponent }
            ]
          }

        ]
      },
      {
        path: 'franchise/create', component: FranchiseCreateComponent, children: [
          {
            path: 'info', component: GeneralInfoComponent, children: [
              { path: ':restaurantID', component: GeneralInfoComponent }
            ]
          },
        ]
      },
      {
        path: 'franchise/:franchiseId/edit', component: FranchiseEditComponent, children: [
          { path: 'info', component: GeneralInfoComponentEdit },
        ]
      },
      {
        path: 'franchise/:franchiseId/view', component: FranchiseViewComponent, children: [
          { path: 'info', component: InfoComponent },
          { path: 'restaurant-list', component: RestaurantComponent }
        ]
      },
      { path: 'all-franchisees', component: AllFranchiseesComponent },
      { path: 'all-restaurants', component: AllRestaurantsComponent },
      {
        path: 'all-dc-alignment', component: AllDcAlignmentComponent, children: [
          { path: '', component: DcAlignmentGridComponent },
          { path: 're-align', component: RealignRestaurantToDCComponent }
        ]
      },


      {
        path: 'franchise/restaurant/create', component: RestaurantCreateComponent, children: [
          { path: ":franchiseId", component: RestaurantCreateComponent }
        ]
      },
      {
        path: 'franchise/restaurant/:restaurantId', component: RestaurantEditViewComponent, children: [
          { path: 'edit-info', component: RestaurantInfoEditComponent },
          {
            path: 'view', children: [
              { path: 'info', component: RestaurantInfoViewComponent },
              { path: 'franchisee-list', component: RestaurantFranchiseeListComponent }
            ]
          }]
      },
      { path: 'all-items', component: AllItemsComponent },
      { path: 'all-supplier-items', component: AllSupplierItemsComponent },
      { path: 'item/add', component: AddItemComponent },
      {
        path: 'item/:itemId', component: EditViewItemComponent,
        children: [
          {
            path: 'edit', children: [
              { path: 'info', component: EditInfoComponent }
            ]
          },
          {
            path: 'view', children: [
              { path: 'info', component: ViewInfoComponent },
              {
                path: 'facility-items', component: ViewFacilityItemsComponent,
                children: [
                  { path: 'supplier', component: SupplierComponent },
                  { path: 'distributor', component: DistributorComponent },
                ]
              },
              { path: 'menu-items', component: ViewMenuItemsComponent },
              { path: 'child-items', component: ViewChildItemsComponent },
              { path: 'alternate-items', component: ViewAlternateItemsComponent },
              { path: 'supply-agreements', component: ViewSupplyAgmtsComponent },              
              { path: 'new-lane-segment', component: NewLaneSegmentComponent },                          
              { path: 'new-lane-segment/:chainId', component: NewLaneSegmentComponent },
              { path: 'item-pricing', component: ItemPricingComponent, children: [
                {path:'', redirectTo:'item-pricing-details'},
                {
                  path: 'lane-segments', component: LaneSegmentsComponent,
                },
                { path: 'item-pricing-details', component: ItemPricingDetailsComponent },
                { path: 'landed-cost', component: LandedCostComponent }
              ] },
            ]
          }
        ]
      },
      {
        path: 'item/:itemId/child-item', component: ChildItemComponent,
        children: [
          { path: 'add', component: AddChildItemComponent },
          { path: 'edit/:childItemId', component: EditChildItemComponent },
          { path: 'view/:childItemId', component: ViewChildItemComponent }
        ]
      },
      { path: 'all-dc-items', component: AllDcItemsComponent },
      {
        path: 'dc-items', component: DcItemsComponent, children: [
          {
            path: 'add', component: AddDcItemComponent, children: [
              { path: ':itemId', component: AddDcItemComponent }
            ]
          },
          { path: 'edit/:dcItemId', component: EditDcItemComponent },
          { path: 'view/:dcItemId', component: ViewDcItemComponent }
        ]
      },
      { path: 'all-menu-items', component: AllMenuItemsComponent },
      {
        path: 'menu-item', component: MenuItemComponent, children: [
          { path: 'add', component: AddMenuItemComponent },
          { path: 'edit/:menuItemId', component: EditMenuItemComponent },
          {
            path: 'view/:menuItemId', component: ViewMenuItemComponent, children: [
              { path: 'info', component: InfoMenuComponent },
              { path: 'plate-cost-period', component: PlateCostPeriodComponent },
              { path: 'menu-item-build', component: MenuItemBuildGridComponent }
            ]
          }
        ]
      },
      {
        path: 'all-item-xref', component: AllItemXrefComponent, children: [
          { path: '', component: ItemXrefGridComponent }
        ]
      },
      {
        path: 'item/:itemId/supplier-item', component: SupplierItemComponent, children: [
          { path: 'add', component: AddSupplierItemComponent },
          { path: 'edit/:supplierItemId', component: EditSupplierItemComponent },
          { path: 'view/:supplierItemId', component: ViewSupplierItemComponent }
        ]
      },
      { path: 'menu-item/:menuItemId/plate-cost-period/add', component: AddPlateComponent },
      { path: 'all-heirarchy', component: AllHeirarchyComponent },
      {
        path: 'heirarchy', children: [
          { path: 'add', component: AddHeirarchyComponent },
          { path: 'edit/:heirarchyId', component: EditHeirarchyComponent },
          {
            path: 'view/:heirarchyId', component: ViewHeirarchyComponent, children: [
              { path: 'info', component: InfoHeirarchyComponent },
              { path: 'categories', component: CategoryHeirarchyComponent },
              { path: 'levels', component: LevelHeirarchyComponent },
            ]
          }
        ]
      },     
      { path: 'all-exchange-rates', component: AllExchangeRatesComponent },
      {
        path: 'exchange-rate', children: [
          { path: 'add', component: ExchangeRateAddComponent },
          { path: 'edit/:exchangeRateId', component: ExchangeRateEditComponent },
          { path: 'view/:exchangeRateId', component: ExchangeRateViewComponent }
        ]
      },
      { path: 'base-markup', component: AllMarkupsComponent },
      { path: 'facility-markup/:facilityId', component: AddEditFacilityMarkupComponent, children:[
        { path: 'add', component: AddFacilityMarkupComponent },
        { path: 'edit/:facilityMarkupId', component: EditFacilityMarkupComponent },
      ] },
      { path: 'supplier-markup/:supplyAgreementId', component: SupplierMarkupComponent, children:[
        { path: 'add', component: AddSupplierMarkupComponent },
        { path: 'edit/:supplierMarkupId', component: EditSupplierMarkupComponent }
      ] },
      { path: 'all-price-component', component: AllPriceComponentComponent },
      { path: 'pricing-component/:pricingComponentId', component: PriceComponentComponent,
        children:[
            {path: 'edit', component: PriceComponentEditComponent},
            {path: 'view', component: PriceComponentViewComponent}
    ] },
    ]
  }]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
