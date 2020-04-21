import { Component, OnInit } from '@angular/core';
import { ServerReqService } from '../../../services/http/server-req.service';
import { Drawing } from '../../../models/shapes/drawing/drawing';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { ConfirmDialog } from '../../../dialogs/confirm/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-server-select',
  templateUrl: './server-select.component.html',
  styleUrls: ['./server-select.component.scss']
})
export class ServerSelectComponent implements OnInit {

  filterByName: string;
  filterByLabel: string;
  drawingMap: any;
  loading: boolean;

  constructor(
    private serverReq: ServerReqService,
    private snackbar: SnackBarService,
    private router: Router,
    private configEnv: ConfigEnvService,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.loading = true;
    this.drawingMap = new Map();
    this.serverReq.getDrawings().subscribe((res:any) => {
      res.forEach((elem: any) => {
        if (elem.name) {
          this.drawingMap.set(
            elem._id,
            new Drawing(elem.name, elem.width, elem.height, elem.backgroundColor, elem.shapes,
               elem.labels, elem.types, elem.png, elem.instructions));
        }
      });
      this.loading = false;
    });
  }

  navigateMenuClick(): void{
    this.router.navigate(['app-menu']);
  }

  openDrawingClick(value: string): void {
    if (this.configEnv.drawingInProgress) {
      const dialogRef: MatDialogRef<ConfirmDialog> = this.dialog.open(ConfirmDialog, {
        width: '40%',
        data: {
          title: 'Warning',
          content: 'You have a drawing in progress. Are you sure you want to overwrite it?'
        }
      });

      dialogRef.afterClosed().subscribe((res: any) => {
        if (res) {
          this.configEnv.serverInstructions = this.drawingMap.get(value).instructions;
          this.configEnv.openFromServerClicked = true;
          this.configEnv.drawingInProgress = true;
          this.configEnv.backgroundColor = this.drawingMap.get(value).backgroundColor;
          this.configEnv.width = this.drawingMap.get(value).width;
          this.configEnv.height = this.drawingMap.get(value).height;
          this.router.navigate(['app-draw']);
        }
      });
    } else {
      this.configEnv.serverInstructions = this.drawingMap.get(value).instructions;
      this.configEnv.openFromServerClicked = true;
      this.configEnv.drawingInProgress = true;
      this.configEnv.backgroundColor = this.drawingMap.get(value).backgroundColor;
      this.configEnv.width = this.drawingMap.get(value).width;
      this.configEnv.height = this.drawingMap.get(value).height;
      this.router.navigate(['app-draw']);
    }
  }

  deleteDrawingClick(value: string): void{
    this.serverReq.deleteDrawing(value).subscribe((res: any) => {
      this.snackbar.openSnackBar(this.drawingMap.get(value).name + ' drawing deleted', 'OK');
      this.drawingMap.delete(value);
    });
  }

  applyClick(): void {
    let toElimName = false;
    let toElimLabel = true;

    for (const key of this.drawingMap.keys()) {
      toElimName = false;
      toElimLabel = true;
      if (typeof this.filterByName === 'undefined') {
        toElimName = false;

      } else if (!this.drawingMap.get(key).name.includes(this.filterByName)) {
        toElimName = true;
      }

      if (typeof this.filterByLabel === 'undefined') {
        toElimLabel = false;
      } else if (this.drawingMap.get(key).labels.Length === 0) {
        toElimLabel = true;

      } else {
        this.drawingMap.get(key).labels.forEach((label: string) => {
          if (label.includes(this.filterByLabel)) {
            toElimLabel = false;

          }
        });
      }
      if (toElimName || toElimLabel) {
        this.drawingMap.delete(key);
      }
    }
  }

  undoFilterClick(): void {
    this.ngOnInit();
  }
}
