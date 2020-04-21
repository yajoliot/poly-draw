import { Injectable } from '@angular/core';
import { LineShape } from 'src/models/shapes/line/line';
import { LinePointShape } from 'src/models/shapes/linePointShape/line-point-shape';
import { PencilShape } from 'src/models/shapes/pencil-shape/pencil-shape';
import { PointService } from '../../point/point.service';
import { ShapesContainerService } from '../../shapesContainer/shapesContainer.service';
import { ToolService } from '../tool/tool.service';
import { ToolUtilService } from '../../toolUtil/toolUtil.service';
const DECALAGEANGLE = 45;
const TROIS = 3;
@Injectable({
  providedIn: 'root'
})
export class LineToolService extends ToolService {
    shapeInProgress: PencilShape | LinePointShape | null;
    temporaryLine: LineShape | null;
    mousePosition: PointService;
    origin: PointService;
    point: boolean;
    offset: number;

    constructor(sharedShapes: ShapesContainerService, private toolUtil: ToolUtilService) {
      super(sharedShapes);
      this.point = true;
      // tslint:disable-next-line: no-magic-numbers
      this.offset = 75;
    }

    click(event: MouseEvent): void {
    this.mousePosition = new PointService(event.clientX - this.offset, event.clientY - this.offset);

    if (this.temporaryLine != null && this.shapeInProgress != null) {
      this.shapeInProgress.generate();
      const nextLine = new LineShape(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
      nextLine.setAngleMultiple(this.temporaryLine.getAngleMultiple());
      nextLine.generateLine(this.temporaryLine.getDestination(), this.mousePosition);
      this.temporaryLine = nextLine;
    } else {
      if (this.point) {
        this.shapeInProgress = new LinePointShape(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(),
                                                  this.toolUtil.getSecondaryColor());
      } else {
        this.shapeInProgress = new PencilShape(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(),
                                               this.toolUtil.getSecondaryColor());
      }
      this.shapeInProgress.initialize(this.mousePosition);
      this.temporaryLine = new LineShape(this.toolUtil.strokeSize, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
      this.temporaryLine.generateLine(this.mousePosition, this.mousePosition);
      this.shapeContainer.addShapeInProgress(this.shapeInProgress);
      this.origin = this.mousePosition;
    }
    this.shapeInProgress.addLine(this.temporaryLine);
    this.shapeInProgress.setCenter();
  }

  drag(event: MouseEvent): void {
    if (this.temporaryLine != null && this.shapeInProgress != null) {
      this.mousePosition = new PointService(event.clientX - this.offset, event.clientY - this.offset);
      this.temporaryLine.generateLine(this.temporaryLine.getOrigin(), this.mousePosition);
      this.shapeInProgress.generate();
    }
  }

  release(event: MouseEvent): void {
    // TODO: Fix en amont la surdefinition vide
  }

  keyboardDown(event: KeyboardEvent): void {
    if (this.temporaryLine != null && this.shapeInProgress != null) {
      if (event.key === 'Shift') {
        this.temporaryLine.setAngleMultiple(DECALAGEANGLE);
        this.temporaryLine.generate();
        this.shapeInProgress.generate();
      } else if (event.key === 'Backspace' && this.shapeInProgress.getNumberOfLines() > 1 && this.temporaryLine != null) {
        this.shapeInProgress.removeLine();
        this.temporaryLine = this.shapeInProgress.getLastLine();
        this.temporaryLine.setAngleMultiple(1);
        this.temporaryLine.generateLine(this.temporaryLine.getOrigin(), this.mousePosition);
        this.shapeInProgress.generate();
      } else if (event.key === 'Escape' && this.shapeInProgress != null) {
        this.shapeContainer.removeShapeInProgress();
        this.shapeInProgress = null;
        this.temporaryLine = null;
      }
    }
  }

  keyboardUp(event: KeyboardEvent): void {
    if (this.temporaryLine != null && this.shapeInProgress != null) {
      if (event.key === 'Shift') {
        this.temporaryLine.setAngleMultiple(1);
      }
      this.temporaryLine.generateLine(this.temporaryLine.getOrigin(), this.mousePosition);
      this.shapeInProgress.generate();
    }
  }

  onMouseLeave(): void {
    // TODO: Implementer
  }

  onDblClick(event: MouseEvent): void {
    if (this.temporaryLine != null && this.shapeInProgress != null) {
      this.shapeInProgress.setCenter();
      if (this.isInsideCircle(this.mousePosition)) {
        this.shapeInProgress.removeLine();
        this.shapeInProgress.removeLine();
        this.temporaryLine = this.shapeInProgress.getLastLine();
        if (this.temporaryLine != null) {
          this.temporaryLine.setAngleMultiple(1);
          this.temporaryLine.generateLine(this.temporaryLine.getOrigin(), this.origin);
        }
        this.shapeInProgress.generate();
      } else {
        this.shapeInProgress.removeLine();
      }
    }
    this.shapeContainer.removeShapeInProgress();
    if (this.shapeInProgress != null) {
      this.shapeContainer.executeShapeCommand(this.shapeInProgress);
    }
    this.shapeInProgress = null;
    this.temporaryLine = null;
  }

  isInsideCircle(point: PointService): boolean {
    const yDisplacement = this.origin.getPositionY() - point.getPositionY();
    const xDisplacement = point.getPositionX() - this.origin.getPositionX();
    const lineLength = Math.sqrt((Math.pow(yDisplacement, 2) + Math.pow(xDisplacement, 2)));
    return lineLength < TROIS;
  }
}
