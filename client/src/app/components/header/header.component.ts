import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ColorPickerDialog } from '../../../dialogs/color-picker/color-picker-dialog.component';
import { ToolUtilService } from '../../../services/toolUtil/toolUtil.service';
import { ToolboxService } from '../../../services/toolbox/toolbox.service'
import { LineToolService } from 'src/services/tools/lineTool/line-tool.service';
import { PolygonToolService } from 'src/services/tools/polygonTool/polygon-tool.service';
import { PipetteToolService } from 'src/services/tools/pipetteTool/pipette-tool.service';
import { SprayToolService } from 'src/services/tools/sprayTool/spray-tool.service';
import { EraserToolService } from 'src/services/tools/eraserTool/eraser-tool.service';
import { GridToolService } from 'src/services/tools/gridTool/grid-tool.service';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { SelectionToolService } from 'src/services/tools/selectionTool/selection-tool.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('colorIcon', {read: ElementRef, static: false})
  colorIcon: ElementRef;
  @ViewChild('colorIcon2', {read: ElementRef, static: false})
  colorIcon2: ElementRef;
  currentTool: string;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private toolUtil: ToolUtilService,
    private toolbox: ToolboxService,
    private linetool: LineToolService,
    private polygonTool: PolygonToolService,
    private pipetteTool: PipetteToolService,
    private sprayTool: SprayToolService,
    private eraserTool: EraserToolService,
    private gridTool: GridToolService,
    private shapeContainer: ShapesContainerService,
    private selectionTool: SelectionToolService) {

    this.pipetteTool.pipette$.subscribe(
        () => this.setColorIcons()
    );
  }

  ngOnInit(): void {
    this.currentTool = this.toolbox.currentTool;
    this.gridTool
    this.eraserTool
    this.polygonTool
    this.sprayTool
    this.selectionTool
  }

  menuClick(): void{
    this.router.navigate(['app-menu']);
  }

  colorClick(): void{
    const dialogRef: MatDialogRef<ColorPickerDialog> = this.dialog.open(ColorPickerDialog, {
      width: '40%'
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.setColorIcons();
    });
  }

  brushTypeClick(value: string): void {
    this.toolUtil.setBrushType(value);
  }

  junctionTypeClick(value: boolean): void {
    this.linetool.point = value;
  }

  updateRadius(value: number): void {
    if (this.toolUtil.radius + value > 0) {
      this.toolUtil.radius += value;
    }
  }

  updateEmission(value: number): void {
    if (this.toolUtil.emission + value > 0) {
      this.toolUtil.emission += value;
    }
  }

  setColorIcons(): void {
    this.colorIcon.nativeElement.style.color = this.toolUtil.getPrimaryColor();
    this.colorIcon2.nativeElement.style.color = this.toolUtil.getSecondaryColor();
  }

  strokeSizeInc(value: number): void {
    if (this.toolUtil.strokeSize + value > 0) {
      this.toolUtil.strokeSize += value;
    }
  }

  toleranceInc(value: number): void {
    if (this.toolUtil.tolerance + value >= 0 && this.toolUtil.tolerance + value <= 100) {
      this.toolUtil.tolerance += value;
    }
  }

  transparancyInc(value: number): void {
    if(this.toolUtil.transparancy + value > 0 && this.toolUtil.transparancy + value < 11){
      this.toolUtil.transparancy += value;
      this.toolbox.selectTool('Grid');
      this.toolbox.changeTransparancy();
    }
  }

  eraserSizeInc(value: number): void {
    if (this.toolUtil.eraserSize + value > 2){
      this.toolUtil.eraserSize += value;
    }
  }

  nbOfSidesInc(value: number): void{
    if (this.toolUtil.nbSides + value > 2 && this.toolUtil.nbSides + value < 13) {
      this.toolUtil.nbSides += value;
    }
  }

  typeEllipse(type: string): void {
    this.toolUtil.typeEllipse = type;
  }
  undo(): void {
    this.shapeContainer.undo();
  }
  redo(): void {
    this.shapeContainer.redo();
  }
}
