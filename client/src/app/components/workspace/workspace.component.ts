import { Component,  ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { CreationDialog } from '../../../dialogs/creation/creation-dialog.component';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  windowWidth: number;
  windowHeight: number;
  @ViewChild('pixelRef', {static: false})
  pixelRef: ElementRef;
  drawingData: object;
  ctrlFlag: boolean;

  constructor(private dialog: MatDialog, private configEnv: ConfigEnvService) {
    this.ctrlFlag = false;
   }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.windowHeight = event.target.innerHeight;
    this.windowWidth = event.target.innerWidth;
  }

  ngOnInit(): void {
    this.checkIfLocalStorage();
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  receiveFromDrawing(drawing: any): void {
    this.autoSave(drawing);
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent): void {
    if (event.key === 'Control') {
      this.ctrlFlag = true;
    }
  }
  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent): void {
    if (event.key === 'Control') {
      this.ctrlFlag = false;
    }
  }
  @HostListener('window:keydown', ['$event'])
  keyDown2(event: KeyboardEvent): void {
    if (!this.configEnv.blockKeyEvents && event.key === 'o'){
      this.createDrawingClick();
    }
  }

  createDrawingClick(): void {
    this.configEnv.blockKeyEvents = true;
    const dialogRef: MatDialogRef<CreationDialog> = this.dialog.open(CreationDialog, {
      width: '40%',
      data: {
        width: this.pixelRef.nativeElement.offsetWidth,
        height: this.pixelRef.nativeElement.offsetHeight
      }
    });

    dialogRef.afterClosed().subscribe((data: object) => {
      this.configEnv.blockKeyEvents = false;
      if (data != null) {
        this.configEnv.drawingInProgress = true;
        this.drawingData = data;
      }
    });
  }

  checkIfLocalStorage(): void {
    if (window.localStorage.getItem('drawing') != null && this.configEnv.continuDrawingClicked) {
      this.configEnv.drawingInProgress = true;
    }
  }

  autoSave(drawing: ElementRef): void {

    const drawingDim: object = {
      width: this.configEnv.width,
      height: this.configEnv.height,
      backgroundColor: this.configEnv.backgroundColor
    };

    window.localStorage.setItem('drawing', JSON.stringify(drawingDim))
    const instructions: string[] = drawing.nativeElement.innerHTML.split('<path');

    window.localStorage.setItem('svgNum', instructions.length.toString());

    for (let i = 1; i < instructions.length; i++) {
      window.localStorage.setItem('svg' + i, '<path' + instructions[i]);
    }
  }
}
