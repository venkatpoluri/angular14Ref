import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingPartnerContactDetailComponent } from './trading-partner-contact-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ContactsPrimaryPipe } from 'src/app/customPipes/contacts-primary.pipe';

describe('TradingPartnerContactDetailComponent', () => {
  let component: TradingPartnerContactDetailComponent;
  let fixture: ComponentFixture<TradingPartnerContactDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradingPartnerContactDetailComponent, ContactsPrimaryPipe ],
      imports:[RouterTestingModule,HttpClientTestingModule, ReactiveFormsModule,FormsModule, ToastrModule.forRoot()],
      providers:[DatePipe, {provide: ToastrService, useClass: ToastrService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingPartnerContactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
