import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPricingDetailsComponent } from './item-pricing-details.component';

describe('ItemPricingDetailsComponent', () => {
  let component: ItemPricingDetailsComponent;
  let fixture: ComponentFixture<ItemPricingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemPricingDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemPricingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
