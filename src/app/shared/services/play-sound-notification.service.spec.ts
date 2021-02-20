import { TestBed } from '@angular/core/testing';

import { PlaySoundNotificationService } from './play-sound-notification.service';

describe('PlaySoundNotificationService', () => {
  let service: PlaySoundNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaySoundNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
