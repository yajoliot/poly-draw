import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmDialog } from '../../../dialogs/confirm/confirm-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  constructor(private router: Router, private configEnv: ConfigEnvService, private dialog: MatDialog) { }

  newDrawingClick(): void {
    if (this.configEnv.drawingInProgress) {
      const dialogRef: MatDialogRef<ConfirmDialog> = this.dialog.open(ConfirmDialog, {
        width: '40%',
        data: {
          title: 'Attention',
          content: 'Vous avez un dessin en cours. Voulez-vous vraiment écraser?'
        }
      });

      dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          this.configEnv.drawingInProgress = false;
          this.configEnv.overwriteShapes();
          this.router.navigate(['app-draw']);
        }
      });
    } else {
      this.router.navigate(['app-draw']);
    }
  }

  continueDrawingClick(): void {
    this.configEnv.continuDrawingClicked = true;
    this.router.navigate(['app-draw']);
  }

  openDrawingClick(): void {
    this.router.navigate(['app-server-select']);
  }

  guideClick(): void{
    this.router.navigate(['app-userguide']);
  }

}
