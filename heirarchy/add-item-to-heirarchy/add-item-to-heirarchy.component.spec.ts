import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemToHeirarchyComponent } from './add-item-to-heirarchy.component';

describe('AddItemToHeirarchyComponent', () => {
  let component: AddItemToHeirarchyComponent;
  let fixture: ComponentFixture<AddItemToHeirarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemToHeirarchyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemToHeirarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
