import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'info-dialog',
    templateUrl: './info-dialog.component.html',
    styleUrls: []
  })

export class InfoDialog {
    title: string;
    content: string;

    constructor(
        public dialogRef: MatDialogRef<InfoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
      ) { this.title = data.title as string;
          this.content = data.content as string;
     }
    closeDialog(): void {
        this.dialogRef.close();
    }
}
