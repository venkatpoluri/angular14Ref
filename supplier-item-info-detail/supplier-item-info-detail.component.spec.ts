import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierItemInfoDetailComponent } from './supplier-item-info-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('SupplierItemInfoDetailComponent', () => {
  let component: SupplierItemInfoDetailComponent;
  let fixture: ComponentFixture<SupplierItemInfoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierItemInfoDetailComponent ],
      imports:[ReactiveFormsModule, HttpClientTestingModule,ToastrModule.forRoot(), FormsModule ],
      providers:[ {provide: ToastrService, useClass: ToastrService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierItemInfoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
