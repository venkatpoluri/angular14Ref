import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightPeriodGridComponent } from './freight-period-grid.component';

describe('FreightPeriodGridComponent', () => {
  let component: FreightPeriodGridComponent;
  let fixture: ComponentFixture<FreightPeriodGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightPeriodGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreightPeriodGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
