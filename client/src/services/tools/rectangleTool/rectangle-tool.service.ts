import { Injectable } from '@angular/core';
import { Rectangle } from 'src/models/shapes/rectangle/rectangle';
import { PointService } from '../../point/point.service';
import { ShapesContainerService } from '../../shapesContainer/shapesContainer.service';
import { ToolService } from '../tool/tool.service';
import { ToolUtilService } from '../../toolUtil/toolUtil.service';

const OFFSET = 75;
@Injectable({
  providedIn: 'root'
})
export class RectangleToolService extends ToolService {

  mouseClicked: boolean;
  mouseMoved: boolean;
  mouseReleased: boolean;
  shapeInProgress: Rectangle;

  constructor(sharedShapes: ShapesContainerService, private toolUtil: ToolUtilService) {
    super(sharedShapes);
    this.mouseClicked = false;
    this.mouseMoved = false;
    this.mouseReleased = false;

  }

  click(event: MouseEvent): void {
    this.mouseClicked = true;

    const initialPoint = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);

    this.shapeInProgress = new Rectangle(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColorEllipse(),
     this.toolUtil.getSecondaryColorEllipse());
    this.shapeInProgress.initialize(initialPoint);
    this.shapeContainer.addShapeInProgress(this.shapeInProgress);
  }
  drag(event: MouseEvent): void {
    if (this.mouseClicked) {

      const pointInProgress = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
      this.shapeInProgress.setLastPoint(pointInProgress);

      this.shapeInProgress.generate();
    }
  }

  release(event: MouseEvent): void {

    const finalPoint = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);

    this.shapeInProgress.setLastPoint(finalPoint);
    this.shapeInProgress.generate();
    this.shapeInProgress.findExtremums();
    this.shapeContainer.removeShapeInProgress();
    this.shapeContainer.executeShapeCommand(this.shapeInProgress);
    this.shapeInProgress = new Rectangle(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
    this.mouseClicked = false;
  }

  keyboardDown(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.shapeInProgress.shiftPressed = true;
      this.shapeInProgress.generate();
    }
    this.shapeInProgress.generate();

  }

  keyboardUp(event: KeyboardEvent): void {
    if (event.key === 'Shift' && this.mouseClicked) {
      this.shapeInProgress.shiftPressed = false;
    }
    this.shapeInProgress.generate();
  }

  onMouseLeave(event: MouseEvent): void {
    const finalPoint = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
    this.shapeInProgress.setLastPoint(finalPoint);
    this.shapeInProgress.generate();
    this.shapeInProgress.findExtremums();
    this.shapeContainer.removeShapeInProgress();
    this.shapeContainer.executeShapeCommand(this.shapeInProgress);
    this.shapeInProgress = new Rectangle(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());

    this.mouseClicked = false;
  }

  onDblClick(event: MouseEvent): void {
  }

}
