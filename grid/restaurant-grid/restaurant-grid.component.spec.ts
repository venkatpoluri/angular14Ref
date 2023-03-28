import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantGridComponent } from './restaurant-grid.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxPaginationModule } from 'ngx-pagination';

describe('RestaurantGridComponent', () => {
  let component: RestaurantGridComponent;
  let fixture: ComponentFixture<RestaurantGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantGridComponent ],
      imports:[ToastrModule.forRoot(), HttpClientTestingModule, NgxPaginationModule],
      providers:[ {provide: ToastrService, useClass: ToastrService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
