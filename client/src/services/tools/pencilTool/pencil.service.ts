import { Injectable } from '@angular/core';
import { PencilShape } from 'src/models/shapes/pencil-shape/pencil-shape';
import { PointService } from '../../point/point.service';
import { ShapesContainerService } from '../../shapesContainer/shapesContainer.service';
import { ToolService } from '../tool/tool.service';
import { ToolUtilService } from '../../toolUtil/toolUtil.service';
const OFFSET = 75;
@Injectable({
  providedIn: 'root'
})
export class PencilService extends ToolService {

  mouseClicked: boolean;
  mouseMoved: boolean;
  mouseReleased: boolean;
  shapeInProgress: PencilShape;

  constructor(sharedShapes: ShapesContainerService, private toolUtil: ToolUtilService) {
    super(sharedShapes);
    this.mouseClicked = false;
    this.mouseMoved = false;
    this.mouseReleased = false;
  }

  click(event: MouseEvent): void {
    this.mouseClicked = true;
    const initialPoint = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
    this.shapeInProgress = new PencilShape(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
    this.shapeInProgress.initialize(initialPoint);
    this.shapeContainer.addShapeInProgress(this.shapeInProgress);
    this.shapeInProgress.drawLine(initialPoint);
  }
  drag(event: MouseEvent): void {
    if (this.mouseClicked) {
      const pointInProgress = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
      this.shapeInProgress.drawLine(pointInProgress);
    }
    this.mouseMoved = true;
  }

  release(event: MouseEvent): void {
    const finalPoint = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
    this.shapeInProgress.drawLine(finalPoint);
    this.shapeInProgress.setCenter();
    this.shapeContainer.executeShapeCommand(this.shapeInProgress);
    this.shapeContainer.removeShapeInProgress();
    this.shapeInProgress = new PencilShape(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
    this.mouseClicked = false;
  }

  onMouseLeave(event: MouseEvent): void {
    this.shapeInProgress = new PencilShape(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
    this.mouseClicked = false;
  }
}
