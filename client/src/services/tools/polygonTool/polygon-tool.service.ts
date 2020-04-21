import { Injectable } from '@angular/core';
import { DashedRectangle } from 'src/models/shapes/dashedRectangle/dashed-rectangle';
import { Polygon } from 'src/models/shapes/polygon/polygon';
import { Rectangle } from 'src/models/shapes/rectangle/rectangle';
import { PointService } from '../../point/point.service';
import { ShapesContainerService } from '../../shapesContainer/shapesContainer.service';
import { ToolService } from '../tool/tool.service';
import { ToolUtilService } from '../../toolUtil/toolUtil.service';

@Injectable({
  providedIn: 'root'
})
export class PolygonToolService extends ToolService {

  mouseClicked: boolean;
  shapeInProgress: Polygon;
  rectangleInProgress: Rectangle;

  constructor(sharedShapes: ShapesContainerService, private toolUtil: ToolUtilService) {
    super(sharedShapes);
    this.mouseClicked = false;
  }

  click(event: MouseEvent): void {
    this.mouseClicked = true;
    const initialPoint = new PointService(event.offsetX, event.offsetY);
    this.shapeInProgress = new Polygon(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
    this.shapeInProgress.sides = this.toolUtil.nbSides;
    this.rectangleInProgress = new DashedRectangle(1, '#000000', 'none');

    this.rectangleInProgress.initialize(initialPoint);
    this.shapeInProgress.initialize(initialPoint);

    this.shapeInProgress.generatePolygon(initialPoint);

    this.shapeContainer.addShapeInProgress(this.shapeInProgress);
    this.shapeContainer.addShapeInProgress(this.rectangleInProgress);
  }

  drag(event: MouseEvent): void {
    if (this.mouseClicked) {
      const pointInProgress = new PointService(event.offsetX, event.offsetY);
      this.shapeInProgress.generatePolygon(pointInProgress);
      this.rectangleInProgress.setLastPoint(pointInProgress);
      this.rectangleInProgress.generate();
    }
  }

  release(event: MouseEvent): void {
    const finalPoint = new PointService(event.offsetX, event.offsetY);
    this.mouseClicked = false;
    this.shapeInProgress.generatePolygon(finalPoint);
    this.shapeInProgress.findExtremums();
    this.shapeContainer.removeShapeInProgress();
    this.shapeContainer.removeShapeInProgress();
    this.shapeContainer.executeShapeCommand(this.shapeInProgress);
  }

  onMouseLeave(event: MouseEvent): void {
    this.shapeInProgress.findExtremums();
    this.shapeContainer.removeSpecificShapeInProgress(this.shapeInProgress);
    this.shapeContainer.removeSpecificShapeInProgress(this.rectangleInProgress);
    if (this.mouseClicked === true) {
      this.mouseClicked = false;
      this.shapeContainer.executeShapeCommand(this.shapeInProgress);
    }
    this.shapeInProgress = new Polygon(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
  }

  setSides(value: number): void {
    this.shapeInProgress.sides = value;
  }

}
