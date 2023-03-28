import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoHeirarchyComponent } from './info-heirarchy.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('InfoHeirarchyComponent', () => {
  let component: InfoHeirarchyComponent;
  let fixture: ComponentFixture<InfoHeirarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoHeirarchyComponent ],
      imports:[RouterTestingModule, HttpClientTestingModule],
      providers:[
        InfoHeirarchyComponent,
        { provide: ActivatedRoute, useValue: { snapshot: { parent: {   params: { 'heirarchyId': '001ab478-5c94-ec11-aa21-bc16119e9c76' } } } } } 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoHeirarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
