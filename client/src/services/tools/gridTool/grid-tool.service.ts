import { Injectable } from '@angular/core';
import { ToolService } from '../tool/tool.service';
import { ShapesContainerService } from '../../shapesContainer/shapesContainer.service';
import { ToolUtilService } from '../../toolUtil/toolUtil.service';
import { PointService } from '../../point/point.service';
import { GridShape } from 'src/models/shapes/grid/grid-shape';

const SQUAREDELTA = 5;
@Injectable({
  providedIn: 'root'
})

export class GridToolService extends ToolService {
  width: number;
  height: number;
  squareSize: number;
  shapeInProgress: GridShape;
  isActive: boolean;

  constructor(sharedShapes: ShapesContainerService, private toolUtil: ToolUtilService) {
    super(sharedShapes);
    this.shapeInProgress = new GridShape(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
    this.isActive = false;
  }

  generate(width: number, height: number, squareSize: number): void {
    this.width = width;
    this.height = height;
    this.squareSize = squareSize;
    if (!this.isActive) {
      this.shapeContainer.removeSpecificShapeInProgress(this.shapeInProgress);
      this.shapeContainer.addShapeInProgress(this.shapeInProgress);
      this.generateGrid(width, height, this.squareSize);
      this.isActive = true;
    } else {
      this.shapeInProgress.reset();
      this.isActive = false;
    }
  }

  changeTransparency(): void {
    this.shapeInProgress.reset();
    this.generateGrid(this.width, this.height, this.squareSize);
  }

  resize(isPositive: boolean): void {
    if (isPositive && this.isActive) {
      this.shapeInProgress.reset();
      this.squareSize += SQUAREDELTA;
      this.generateGrid(this.width, this.height, this.squareSize);
    } else if (this.squareSize - SQUAREDELTA > 0 && this.isActive) {
      this.shapeInProgress.reset();
      this.squareSize -= SQUAREDELTA;
      this.generateGrid(this.width, this.height, this.squareSize);
    }
  }
  generateGrid(width: number, height: number, squareSize: number): void {
    this.shapeInProgress.setOpacity(this.toolUtil.getTransparancy());
    for (let i = 0; i < width; i += this.squareSize) {
      const initialPoint = new PointService(i, 0);
      const finalPoint = new PointService(i, height);
      this.shapeInProgress.drawLine(initialPoint, finalPoint);
    }

    for (let i = 0; i < height; i += this.squareSize) {
      const initialPoint = new PointService(0, i);
      const finalPoint = new PointService(width, i);
      this.shapeInProgress.drawLine(initialPoint, finalPoint);
    }

    this.shapeInProgress.generate();
  }

  click(event: MouseEvent): void {
  }
  drag(event: MouseEvent): void {
  }
  release(event: MouseEvent): void {
  }

  keyboardDown(event: KeyboardEvent): void {
  }

  keyboardUp(event: KeyboardEvent): void {
  }

  onMouseLeave(event: MouseEvent): void {
  }

  onDblClick(event: MouseEvent): void {
  }
}
