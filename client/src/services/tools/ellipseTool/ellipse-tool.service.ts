import { Injectable } from '@angular/core';
import { DashedRectangle } from 'src/models/shapes/dashedRectangle/dashed-rectangle';
import { Ellipse } from 'src/models/shapes/ellipse/ellipse';
import { PointService } from '../../point/point.service';
import { ShapesContainerService } from '../../shapesContainer/shapesContainer.service';
import { ToolUtilService } from '../../toolUtil/toolUtil.service';
import { ToolService } from '../tool/tool.service';
const OFFSET = 75;
@Injectable({
  providedIn: 'root'
})
export class EllipseToolService extends ToolService {

  mouseClicked: boolean;
  mouseMoved: boolean;
  mouseReleased: boolean;
  mouseLeftWhileClicked: boolean;
  shapeInProgress: Ellipse;
  rectangleInProgress: DashedRectangle;
  constructor(sharedShapes: ShapesContainerService, private toolUtil: ToolUtilService) {
    super(sharedShapes);
    this.mouseClicked = false;
    this.mouseLeftWhileClicked = false;
  }

  click(event: MouseEvent): void {
    this.mouseClicked = true;
    const INIT = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
    this.shapeInProgress = new Ellipse(this.toolUtil.strokeSize, this.toolUtil.getSecondaryColorEllipse(),
      this.toolUtil.getPrimaryColorEllipse());
    this.rectangleInProgress = new DashedRectangle(1, '#000000', 'none');
    this.shapeInProgress.initialize(INIT);
    this.shapeInProgress.initialRect = INIT;
    this.shapeContainer.addShapeInProgress(this.shapeInProgress);
    this.rectangleInProgress.initialize(INIT);
    this.shapeContainer.addShapeInProgress(this.rectangleInProgress);

  }
  drag(event: MouseEvent): void {
    if (this.mouseClicked) {
      this.shapeInProgress.initialize(this.shapeInProgress.initialRect);
      const pointInProgress = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
      this.rectangleInProgress.setLastPoint(pointInProgress);
      this.shapeInProgress.setDestination(pointInProgress);
      this.shapeInProgress.findAndSetProperties();
      this.shapeInProgress.generate();
      this.rectangleInProgress.generateRectangle();
    }
  }
  release(event: MouseEvent): void {
    if (this.mouseClicked) {
      this.shapeContainer.removeShapeInProgress();
      this.shapeContainer.removeShapeInProgress();
      this.shapeContainer.executeShapeCommand(this.shapeInProgress);
      this.shapeInProgress = new Ellipse(this.toolUtil.strokeSize, this.toolUtil.getSecondaryColor(), this.toolUtil.getPrimaryColor());
      this.mouseClicked = false;
    }
  }

  keyboardDown(event: KeyboardEvent): void {
    if (event.key === 'Shift' && this.mouseClicked) {
      this.shapeInProgress.shiftPressed = true;
      this.shapeInProgress.generate();
    }
    this.shapeInProgress.generate();

  }

  keyboardUp(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.shapeInProgress.shiftPressed = false;
    }
    this.shapeInProgress.generateEllipse();
  }
  onMouseLeave(event: MouseEvent): void {
    this.shapeContainer.removeSpecificShapeInProgress(this.shapeInProgress)
    this.shapeContainer.removeSpecificShapeInProgress(this.rectangleInProgress)
    this.shapeInProgress = new Ellipse(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
    this.mouseClicked = false;
    this.mouseMoved = false;
  }
}
