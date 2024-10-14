import { TestBed } from '@angular/core/testing';

import { WebRtcService } from '../components/web-rtc.service';

describe('WebRtcService', () => {
  let service: WebRtcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebRtcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
