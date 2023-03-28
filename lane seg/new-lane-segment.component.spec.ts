import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLaneSegmentComponent } from './new-lane-segment.component';

describe('NewLaneSegmentComponent', () => {
  let component: NewLaneSegmentComponent;
  let fixture: ComponentFixture<NewLaneSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLaneSegmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLaneSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
