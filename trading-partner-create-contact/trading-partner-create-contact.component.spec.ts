import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingPartnerCreateContactComponent } from './trading-partner-create-contact.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxBootstrapMultiselectModule } from 'ngx-bootstrap-multiselect';

describe('TradingPartnerCreateContactComponent', () => {
  let component: TradingPartnerCreateContactComponent;
  let fixture: ComponentFixture<TradingPartnerCreateContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradingPartnerCreateContactComponent ],
      imports:[RouterTestingModule, ReactiveFormsModule, HttpClientTestingModule,AutocompleteLibModule,NgxBootstrapMultiselectModule, ToastrModule.forRoot()],
      providers:[{provide: ToastrService, useClass: ToastrService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingPartnerCreateContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
