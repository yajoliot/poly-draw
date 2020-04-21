import { TestBed } from '@angular/core/testing';
import {  MatSnackBarModule } from '@angular/material';

import { SnackBarService } from './snackbar.service';

describe('SnackbarService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [MatSnackBarModule]
  }));

  it('should be created', () => {
    const service: SnackBarService = TestBed.get(SnackBarService);
    expect(service).toBeTruthy();
  });
});
