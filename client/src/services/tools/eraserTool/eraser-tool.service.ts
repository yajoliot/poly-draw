import { Injectable } from '@angular/core';
import { DashedRectangle } from 'src/models/shapes/dashedRectangle/dashed-rectangle';
import { Rectangle } from 'src/models/shapes/rectangle/rectangle';
import { SelectionRectangle } from 'src/models/shapes/selectionRectangle/selection-rectangle';
import { Shape } from 'src/models/shapes/shape/shape';
import { PointService } from '../../point/point.service';
import { ShapesContainerService } from '../../shapesContainer/shapesContainer.service';
import { ToolUtilService } from '../../toolUtil/toolUtil.service';

import { ToolService } from '../tool/tool.service';
const OFFSET = 75;
const INITSIZE = 3;
@Injectable({
  providedIn: 'root'
})
export class EraserToolService extends ToolService {

  eraserSquare: Rectangle;
  eraserSize: number;
  selectionRectangle: DashedRectangle;
  shapeSelected: number;
  boundingBox: SelectionRectangle;
  currentShape: Shape;
  isClicked: boolean;
  strokeColor: string;
  shapesCommand: Shape[];

  constructor(sharedShapes: ShapesContainerService, private toolUtil: ToolUtilService) {
    super(sharedShapes);
    this.eraserSize = INITSIZE;
    this.isClicked = false;
    this.shapeSelected = 0;
    this.shapesCommand = [];
  }

  setEraserSize(value: number): void {
    this.eraserSize = value;
  }

  click(event: MouseEvent, drawnShape?: import('@angular/core').QueryList<import('@angular/core').ElementRef<any>> | undefined): void {
    this.isClicked = true;
    this.removeThisShape(this.currentShape);
  }

  removeThisShape(thisShape: Shape): void {
    if (this.currentShape.getSelect() && this.isClicked) {
      this.shapeContainer.removeShape(thisShape);
      this.shapeContainer.removeSpecificShapeInProgress(thisShape);
      this.currentShape.setSelect(false);
      this.shapeSelected--;
      thisShape.setMainColor(this.strokeColor);
      this.shapesCommand.push(thisShape);
    }
  }

  drag(event: MouseEvent): void {
    this.shapeContainer.removeSpecificShapeInProgress(this.eraserSquare);
    this.boundingBox = new SelectionRectangle(1, '#000000', 'none');
    const initialPoint = new PointService(event.clientX - OFFSET - (this.toolUtil.eraserSize / 2),
      event.clientY - OFFSET - (this.toolUtil.eraserSize / 2));
    this.eraserSquare = new Rectangle(1, '#ffffff', '#000000');
    this.eraserSquare.initialize(initialPoint);
    this.shapeContainer.addShapeInProgress(this.eraserSquare);

    const pointInProgress = new PointService(event.clientX - OFFSET + (this.toolUtil.eraserSize / 2),
      event.clientY - OFFSET + (this.toolUtil.eraserSize / 2));
    this.eraserSquare.setLastPoint(pointInProgress);

    this.eraserSquare.generate();
    this.renderBoundingBox();
    this.removeThisShape(this.currentShape);

  }

  release(event: MouseEvent): void {
    this.isClicked = false;
    this.shapeContainer.executeEraserCommand(this.shapesCommand);
    this.shapesCommand = [];
  }

  // tslint:disable-next-line: cyclomatic-complexity
  renderBoundingBox(): void {
    this.eraserSquare.findExtremums();

    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      const SHAPERECT = new Rectangle(1, '', '');
      SHAPERECT.initialize(SHAPE.getMinimum());
      SHAPERECT.setLastPoint(SHAPE.getMaximum());
      SHAPERECT.setMaximum(SHAPE.getMaximum());
      SHAPERECT.setMinimum(SHAPE.getMinimum());

      if (SHAPE.detectRectangleIntersection(this.eraserSquare) ||
        SHAPERECT.detectRectangleInclusion(this.eraserSquare) ||
        this.eraserSquare.detectRectangleInclusion(SHAPERECT) && this.shapeSelected <= 1) {
        if (!SHAPE.getSelect() && this.shapeSelected === 1) {
          this.shapeContainer.removeSpecificShapeInProgress(this.currentShape);
          this.currentShape.setSelect(false);
          this.shapeSelected--;
        }

        if (!SHAPE.getSelect() && this.shapeSelected === 0) {
          this.shapeContainer.removeSpecificShapeInProgress(this.eraserSquare);
          this.currentShape = SHAPE;
          this.strokeColor = SHAPE.getMainColor()
          if (SHAPE.getMainColor() === 'rgb(255,0,0,1)' || SHAPE.getMainColor() === 'rgb(254,0,0,1)'
            || SHAPE.getMainColor() === 'rgb(255,1,0,1)' || SHAPE.getMainColor() === 'rgb(255,2,0,1)'
            || SHAPE.getMainColor() === 'rgb(255,3,0,1)' || SHAPE.getMainColor() === 'rgb(255,4,0,1)') {
            this.currentShape.setMainColor('rgb(200,0,0)');
          } else {
            this.currentShape.setMainColor('rgb(255,0,0)');
          }
          this.shapeContainer.addShapeInProgress(this.currentShape);
          this.shapeContainer.addShapeInProgress(this.eraserSquare);
          SHAPE.setSelect(true);
          this.shapeSelected++;
        }
      } else {
        if (SHAPE.getSelect()) {
          this.shapeContainer.removeSpecificShapeInProgress(this.currentShape);
          this.currentShape.setSelect(false);
          this.shapeSelected--;

        }
      }
    }
  }
  onMouseLeave(event: MouseEvent): void {
    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      SHAPE.setSelect(false);
    }
    this.shapeContainer.removeSpecificShapeInProgress(this.eraserSquare);
  }
}
