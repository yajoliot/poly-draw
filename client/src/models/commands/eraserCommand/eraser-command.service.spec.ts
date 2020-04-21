import { TestBed } from '@angular/core/testing';

import { EraserCommandService } from './eraser-command.service';

describe('EraserCommandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EraserCommandService = TestBed.get(EraserCommandService);
    expect(service).toBeTruthy();
  });
});
