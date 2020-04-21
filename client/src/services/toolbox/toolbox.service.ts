import { ElementRef, Injectable } from '@angular/core';
import { BrushToolService } from '../tools/brushTool/brush-tool.service';
import { ColorToolService } from '../tools/colorTool/color-tool.service';
import { EllipseToolService } from '../tools/ellipseTool/ellipse-tool.service';
import { GridToolService } from '../tools/gridTool/grid-tool.service';
import { LineToolService } from '../tools/lineTool/line-tool.service';
import { PipetteToolService } from '../tools/pipetteTool/pipette-tool.service';
import { PolygonToolService } from '../tools/polygonTool/polygon-tool.service';
import { RectangleToolService } from '../tools/rectangleTool/rectangle-tool.service';
import { SelectionToolService } from '../tools/selectionTool/selection-tool.service';
import { SprayToolService } from '../tools/sprayTool/spray-tool.service';
import { EraserToolService } from '../tools/eraserTool/eraser-tool.service';
import { PencilService } from '../tools/pencilTool/pencil.service';
import { PaintBucketService } from '../tools/paintBucketTool/paint-bucket.service';

const SQUARESIZE = 20;
@Injectable({
  providedIn: 'root'
})
export class ToolboxService {

  currentTool: string;

  constructor(private pencil: PencilService, private rectangleTool: RectangleToolService,
    private ellipseTool: EllipseToolService, private brushTool: BrushToolService,
    private lineTool: LineToolService, 
    private polygonTool: PolygonToolService, private gridTool: GridToolService, private selectionTool: SelectionToolService,
    private sprayTool: SprayToolService, private pipetteTool: PipetteToolService, private colorTool: ColorToolService,
    private eraserTool: EraserToolService,
    private bucketTool: PaintBucketService) { }

  selectTool(tool: string): void {
    this.currentTool = tool;
  }

  getTool(): any {
    switch (this.currentTool) {
      case 'Pencil':
        return this.pencil;
      case 'Line':
        return this.lineTool;
      case 'Brush':
        return this.brushTool;
      case 'Rectangle':
        return this.rectangleTool;
      case 'Ellipse':
        return this.ellipseTool;
      case 'Polygon':
        return this.polygonTool;
      case 'Selection':
        return this.selectionTool;
      case 'Spray':
        return this.sprayTool;
      case 'Pipette':
        return this.pipetteTool;
      case 'Color':
        return this.colorTool;
      case 'Grid':
        return this.gridTool;
      case 'Eraser':
        return this.eraserTool;
      case 'Bucket':
        return this.bucketTool;
    }

    return null;

  }

  generateGrid(width: number, height: number): void {
    this.gridTool.generate(width, height, SQUARESIZE);
  }

  changeTransparancy(): void {
    this.gridTool.changeTransparency();
  }

  resizeGrid(isPositive: boolean): void {
    this.gridTool.resize(isPositive);
  }

  scroll(event: MouseEvent): void {
    if (this.currentTool === 'Selection') {
      this.getTool().scroll(event);
    }
  }

  shapeClicked(ref: ElementRef, mouseEvent: MouseEvent): void {
    switch (this.currentTool) {
      case 'Pipette': {
        this.pipetteTool.shapeClicked(ref, mouseEvent);
        break;
      }
      case 'Color': {
        this.colorTool.shapeClicked(ref, mouseEvent);
        break;
      }
      case 'Selection': {
        this.selectionTool.shapeClicked(ref, mouseEvent);
        break;
      }
    }
  }

}
