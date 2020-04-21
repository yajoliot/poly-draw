import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material';

@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: []
  })

export class ConfirmDialog{
    title: string;
    content: string;

    constructor(
        public dialogRef: MatDialogRef<ConfirmDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.title = data["title"] as string;
        this.content = data["content"] as string;
                                                        }

    confirm(): void {
        this.dialogRef.close(true);
    }
    cancel(): void{
        this.dialogRef.close(false);
    }
}
