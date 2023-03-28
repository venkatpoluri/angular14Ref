import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceBatchGridComponent } from './price-batch-grid.component';

describe('PriceBatchGridComponent', () => {
  let component: PriceBatchGridComponent;
  let fixture: ComponentFixture<PriceBatchGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceBatchGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceBatchGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
