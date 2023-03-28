import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHeirarchyComponent } from './view-heirarchy.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewHeirarchyComponent', () => {
  let component: ViewHeirarchyComponent;
  let fixture: ComponentFixture<ViewHeirarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHeirarchyComponent ],
      imports:[RouterTestingModule,HttpClientTestingModule] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHeirarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
