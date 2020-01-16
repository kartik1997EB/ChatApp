import { TestBed } from '@angular/core/testing';

import { RecentChatService } from './recent-chat.service';

describe('RecentChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecentChatService = TestBed.get(RecentChatService);
    expect(service).toBeTruthy();
  });
});
