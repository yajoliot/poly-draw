import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

const DURATION = 1750;

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: DURATION
    });
  }

}
