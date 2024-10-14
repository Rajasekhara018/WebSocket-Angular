import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoShareComponent } from './video-share.component';

describe('VideoShareComponent', () => {
  let component: VideoShareComponent;
  let fixture: ComponentFixture<VideoShareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoShareComponent]
    });
    fixture = TestBed.createComponent(VideoShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
