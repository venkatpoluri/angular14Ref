import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHeirarchyComponent } from './add-heirarchy.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddHeirarchyComponent', () => {
  let component: AddHeirarchyComponent;
  let fixture: ComponentFixture<AddHeirarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHeirarchyComponent ],
      imports:[RouterTestingModule,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHeirarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
