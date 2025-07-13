import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVideoCallComponent } from './new-video-call.component';

describe('NewVideoCallComponent', () => {
  let component: NewVideoCallComponent;
  let fixture: ComponentFixture<NewVideoCallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewVideoCallComponent]
    });
    fixture = TestBed.createComponent(NewVideoCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
