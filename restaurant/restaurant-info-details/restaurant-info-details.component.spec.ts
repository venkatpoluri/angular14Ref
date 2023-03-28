import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantInfoDetailsComponent } from './restaurant-info-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('RestaurantInfoDetailsComponent', () => {
  let component: RestaurantInfoDetailsComponent;
  let fixture: ComponentFixture<RestaurantInfoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantInfoDetailsComponent ],
      imports:[RouterTestingModule,HttpClientModule, ReactiveFormsModule, ToastrModule.forRoot()],
      providers:[ {provide: ToastrService, useClass: ToastrService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantInfoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
