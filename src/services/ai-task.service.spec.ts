import { TestBed } from '@angular/core/testing';

import { AiTaskService } from './ai-task.service';

describe('AiTaskService', () => {
  let service: AiTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
