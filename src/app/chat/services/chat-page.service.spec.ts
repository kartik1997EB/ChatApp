import { TestBed } from '@angular/core/testing';

import { ChatPageService } from './chat-page.service';

describe('ChatPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatPageService = TestBed.get(ChatPageService);
    expect(service).toBeTruthy();
  });
});
