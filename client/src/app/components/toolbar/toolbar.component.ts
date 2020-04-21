import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ExporterDialogComponent } from 'src/dialogs/exporter-dialog/exporter-dialog.component';
import { Drawing } from 'src/models/shapes/drawing/drawing';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { SaveDialog } from '../../../dialogs/save-dialog/save-dialog.component';
import { ServerReqService } from '../../../services/http/server-req.service';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { ToolboxService } from '../../../services/toolbox/toolbox.service';
import { SelectionToolService } from 'src/services/tools/selectionTool/selection-tool.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  selectedButton: ElementRef | undefined;
  @ViewChild('Pencil', {static: false, read: ElementRef}) private pencilRef: ElementRef;
  @ViewChild('Brush', {static: false, read: ElementRef}) private brushRef: ElementRef;
  @ViewChild('Rectangle', {static: false, read: ElementRef}) private rectangleRef: ElementRef;
  @ViewChild('Ellipse', {static: false, read: ElementRef}) private ellipseRef: ElementRef;
  @ViewChild('Line', {static: false, read: ElementRef}) private lineRef: ElementRef;
  @ViewChild('Polygon', {static: false, read: ElementRef}) private polygonRef: ElementRef;
  @ViewChild('Grid', {static: false, read: ElementRef}) private gridRef: ElementRef;
  @ViewChild('Selection', {static: false, read: ElementRef}) private selectionRef: ElementRef;
  @ViewChild('Spray', {static: false, read: ElementRef}) private sprayRef: ElementRef;
  @ViewChild('Pipette', { static: false, read: ElementRef }) private pipetteRef: ElementRef;
  @ViewChild('Eraser', { static: false, read: ElementRef }) private eraserRef: ElementRef;
  @ViewChild('Color', { static: false, read: ElementRef }) private colorRef: ElementRef;
  @ViewChild('Bucket', { static: false, read: ElementRef }) private bucketRef: ElementRef;
  private gridOn: boolean;

  constructor(
    private toolboxService: ToolboxService,
    private snackbar: SnackBarService,
    private router: Router,
    private configEnv: ConfigEnvService,
    private serverReq: ServerReqService,
    private dialog: MatDialog,
    private selectionTool: SelectionToolService,
    private shapesContainer: ShapesContainerService) {
    this.gridOn = false;
  }

  guideClick(): void {
    this.router.navigate(['app-userguide']);
  }

  getGridOn(): boolean {
    return this.gridOn;
  }
  setGridOn(state: boolean): void {
    this.gridOn = state;
  }
  selectTool(tool: string): void {
    this.buttonToggle(tool);
    this.toolboxService.selectTool(tool);
    this.snackbar.openSnackBar(`${tool} a été sélectionné`, 'OK');
  }

  buttonToggle(value: string): void {
    if (typeof this.selectedButton !== 'undefined') {
      this.selectedButton.nativeElement.style.backgroundColor = '#0274A9';
    }
    switch (value) {
      case 'Pencil':
        this.selectedButton = this.pencilRef;
        break;
      case 'Brush':
        this.selectedButton = this.brushRef;
        break;
      case 'Ellipse':
        this.selectedButton = this.ellipseRef;
        break;
      case 'Rectangle':
        this.selectedButton = this.rectangleRef;
        break;
      case 'Line':
        this.selectedButton = this.lineRef;
        break;
      case 'Polygon':
        this.selectedButton = this.polygonRef;
        break;
      case 'Selection':
        this.selectedButton = this.selectionRef;
        break;
      case 'Spray':
        this.selectedButton = this.sprayRef;
        break;
      case 'Pipette':
        this.selectedButton = this.pipetteRef;
        break;
      case 'Eraser':
        this.selectedButton = this.eraserRef;
        break;
      case 'Color':
        this.selectedButton = this.colorRef;
        break;
      case 'Grid':
        this.selectedButton = this.gridRef;
        this.grid();
        break;
       case 'Bucket':
        this.selectedButton = this.bucketRef;
        break;

    }
    if (typeof this.selectedButton !== 'undefined'){
      this.selectedButton.nativeElement.style.backgroundColor = '#7434eb';
    }

  }
  grid(): void {
    if (this.gridOn) {
      this.toolboxService.generateGrid(this.configEnv.width, this.configEnv.height);
      this.gridOn = false;
    } else {
      this.toolboxService.generateGrid(this.configEnv.width, this.configEnv.height);
      this.gridOn = true;
    }
  }
  saveDrawingClick(): void {

    this.configEnv.blockKeyEvents = true;
    if (this.gridOn) {
      this.toolboxService.generateGrid(this.configEnv.width, this.configEnv.height);
    }
    const DIALOGREF = this.dialog.open(SaveDialog, {
      width: '40%',
      data: {
        drawing: this.configEnv.drawingElement.nativeElement
      }
    });

    DIALOGREF.afterClosed().subscribe((res) => {
      this.configEnv.blockKeyEvents = false;
      if (this.gridOn) {
        this.toolboxService.generateGrid(this.configEnv.width, this.configEnv.height);
      }
      if (res.res) {
        if (res.name !== null) {
          this.serverReq.saveDrawing(new Drawing(res.name, this.configEnv.width, this.configEnv.height, this.configEnv.backgroundColor,
                                                 this.shapesContainer.getShapes(), res.labels, [], res.image, res.instructs))
            .subscribe((result: any) => {
              this.snackbar.openSnackBar(result, 'OK');
              this.configEnv.drawingSaved = true;
            });
        } else {
          this.snackbar.openSnackBar('Drawing Must Contain a Name', 'Error');
        }
      }
    });
  }

  openExporterDialog(): void {
    this.configEnv.blockKeyEvents = true;
    if (this.gridOn) {
      this.toolboxService.generateGrid(this.configEnv.width, this.configEnv.height);
    }
    const DIALOGREF = this.dialog.open(ExporterDialogComponent, {
      width: '40%',
      data: {
        drawing: this.configEnv.drawingElement.nativeElement
      }
    });
    DIALOGREF.afterClosed().subscribe((res) => {
      this.configEnv.blockKeyEvents = false;
      if (this.gridOn) {
        this.toolboxService.generateGrid(this.configEnv.width, this.configEnv.height);
      }
    });
  }

  // tslint:disable-next-line: cyclomatic-complexity
  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent): void {
    if (!this.configEnv.blockKeyEvents) {

      switch (event.key) {
        case '1':
          this.selectTool('Rectangle');
          break;

        case 'x':
          if (event.ctrlKey) {
            this.selectionTool.cut();

          }
          break;

        case 'Delete':
          this.selectionTool.delete();
        break;

        case 'v':
          if (event.ctrlKey) {
            this.selectionTool.paste();
          }
          break;

        case 'd':
          if (event.ctrlKey) {
          this.selectionTool.duplicate();
          }
          break;

        case 'c':
          if (event.ctrlKey) {
            this.selectionTool.copy();
          } else {
            this.selectTool('Pencil');

          }
          break;
        case 'l':
          this.selectTool('Line');
          break;
        case 'w':
          this.selectTool('Brush');
          break;
        case '3':
          this.selectTool('Polygon');
          break;
        case 'a':
          this.selectTool('Spray');
          break;
        case '-':
          this.toolboxService.resizeGrid(false);
          break;
        case '=':
          this.toolboxService.resizeGrid(true);
          break;
        case 'g':
          if (event.ctrlKey) {
            this.router.navigate(['app-userguide']);
          } else if (this.gridOn) {
            this.selectTool('Grid');
            this.gridOn = false;
          } else {
            this.selectTool('Grid');
            this.gridOn = true;
          }
          break;
        case 'e':
          if (event.ctrlKey) {
            this.openExporterDialog();
          } else {
            this.selectTool('Eraser');
          }
          break;
        case 's':
          if (event.ctrlKey){
            this.saveDrawingClick();
          } else {
            this.selectTool('Selection');
          }
          break;
        case 'i':
          this.selectTool('Pipette');
          break;
        case '2':
          this.selectTool('Selection');
          break;
        case 'r':
          this.selectTool('Color');
          break;
        case 'b':
          this.selectTool('Bucket');
      }
    }
  }
}
