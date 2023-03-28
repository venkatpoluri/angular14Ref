import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelHeirarchyComponent } from './level-heirarchy.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LevelHeirarchyComponent', () => {
  let component: LevelHeirarchyComponent;
  let fixture: ComponentFixture<LevelHeirarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelHeirarchyComponent ],
      imports:[RouterTestingModule,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelHeirarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
