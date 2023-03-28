import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryHeirarchyComponent } from './category-heirarchy.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CategoryHeirarchyComponent', () => {
  let component: CategoryHeirarchyComponent;
  let fixture: ComponentFixture<CategoryHeirarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryHeirarchyComponent ],
      imports:[RouterTestingModule,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryHeirarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
