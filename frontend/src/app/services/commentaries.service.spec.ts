import { TestBed } from '@angular/core/testing';

import { CommentariesService } from './commentaries.service';

describe('CommentariesService', () => {
  let service: CommentariesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentariesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
