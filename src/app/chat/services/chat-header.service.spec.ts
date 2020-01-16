import { TestBed } from '@angular/core/testing';

import { ChatHeaderService } from './chat-header.service';

describe('ChatHeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatHeaderService = TestBed.get(ChatHeaderService);
    expect(service).toBeTruthy();
  });
});
