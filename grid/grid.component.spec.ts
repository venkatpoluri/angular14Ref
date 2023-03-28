import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridComponent } from './grid.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridComponent ],
      imports:[HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot(), NgxPaginationModule],
      providers:[
        GridComponent,
        { provide: ActivatedRoute, useValue: { snapshot: { parent: {params:{'menuItemId':'1234'}, parent: { params: { 'tradingPartnerId': '001ab478-5c94-ec11-aa21-bc16119e9c76' } } } } } },
        {provide: ToastrService, useClass: ToastrService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
