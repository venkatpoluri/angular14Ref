import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativeItemGridComponent } from './alternative-item-grid.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxPaginationModule } from 'ngx-pagination';

describe('AlternativeItemGridComponent', () => {
  let component: AlternativeItemGridComponent;
  let fixture: ComponentFixture<AlternativeItemGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlternativeItemGridComponent ],
      imports:[ToastrModule.forRoot(), HttpClientTestingModule, NgxPaginationModule],
      providers:[ {provide: ToastrService, useClass: ToastrService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlternativeItemGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
