import { Injectable } from '@angular/core';
import { SprayShape } from 'src/models/shapes/spray-shape/spray-shape';
import { PointService } from '../../point/point.service';
import { ShapesContainerService } from '../../shapesContainer/shapesContainer.service';
import { ToolService } from '../tool/tool.service';
import { ToolUtilService } from '../../toolUtil/toolUtil.service';

@Injectable({
  providedIn: 'root'
})
export class SprayToolService extends ToolService {

  mouseClicked: boolean;
  shapeInProgress: SprayShape;
  radius: number;
  emission: number;
  constructor(sharedShapes: ShapesContainerService, private toolUtil: ToolUtilService) {
    super(sharedShapes);
  }

  click(event: MouseEvent): void {
    // draw the first spray patern
    this.mouseClicked = true;
    const initialPoint = new PointService(event.offsetX, event.offsetY);
    this.shapeInProgress = new SprayShape(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
    this.shapeInProgress.initialize();
    this.shapeInProgress.radius = this.toolUtil.radius;
    this.shapeInProgress.NUMDOTS = this.toolUtil.emission;
    this.shapeInProgress.generateSpray(initialPoint);
    this.shapeContainer.addShapeInProgress(this.shapeInProgress);
  }
  drag(event: MouseEvent): void {
    if (this.mouseClicked) {
      const pointInProgress = new PointService(event.offsetX, event.offsetY);
      this.shapeInProgress.generateSpray(pointInProgress);
    }
  }

  release(event: MouseEvent): void {
    const finalPoint = new PointService(event.offsetX, event.offsetY);
    this.shapeInProgress.generateSpray(finalPoint);
    this.shapeInProgress.findExtremums();
    this.shapeInProgress.setCenter();
    this.shapeContainer.executeShapeCommand(this.shapeInProgress);
    this.mouseClicked = false;
  }

  onMouseLeave(event: MouseEvent): void {

    this.shapeInProgress = new SprayShape(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
    this.mouseClicked = false;
  }

  setRadius( radius: number): void {
    this.shapeInProgress.radius = radius;
    this.radius = radius;
  }

  setEmission( emission: number): void {
    this.shapeInProgress.NUMDOTS = emission;
    this.emission = emission;
  }

}
