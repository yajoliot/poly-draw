import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackBarService } from 'src/services/snackbar/snackbar.service';

const RGB_MAX = 255;
const ONE_HUNDRED = 100;
const HEIGHT_OFFSET = 85;
const WIDTH_OFFSET = 75;

@Component({
    selector: 'creation-dialog',
    templateUrl: './creation-dialog.component.html',
    styleUrls: ['./creation-dialog.component.scss']
  })

export class CreationDialog {
    minRGB: number;
    maxRGB: number;
    redRGB: number;
    greenRGB: number;
    blueRGB: number;
    opacity: number;
    width: number;
    height: number;

    constructor(private snackbar: SnackBarService, public dialogRef: MatDialogRef<CreationDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any){
        this.width = parseInt(data.width, 10) as number || ONE_HUNDRED;
        this.height = parseInt(data.height, 10) as number || ONE_HUNDRED;
        this.minRGB = 0;
        this.maxRGB = RGB_MAX;
        this.redRGB = RGB_MAX;
        this.greenRGB = RGB_MAX;
        this.blueRGB = RGB_MAX;
        this.opacity = RGB_MAX;
    }

    confirm(): void {
        if (this.redRGB < 0 || this.redRGB > RGB_MAX || this.greenRGB < 0 || this.greenRGB > RGB_MAX
            || this.blueRGB < 0 || this.blueRGB > RGB_MAX || this.opacity < 0 || this.opacity > RGB_MAX
            || this.width < 0 || this.height < 0) {
            this.snackbar.openSnackBar('Incorrect values', 'OK');
            this.dialogRef.close(null);
        } else {
            const creationRes = {
                r: this.redRGB,
                g: this.greenRGB,
                b: this.blueRGB,
                o: this.opacity,
                width: this.width,
                height: this.height
            };
            this.dialogRef.close(creationRes);
        }
    }
    cancel(): void {
        this.dialogRef.close(null);
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        this.height = window.innerHeight - HEIGHT_OFFSET;
        this.width = window.innerWidth - WIDTH_OFFSET;
    }

}
