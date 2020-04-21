import { ElementRef, Injectable } from '@angular/core';
import { BoundingBoxToolService } from '../boundingBoxTool/bounding-box-tool.service';
import { DashedRectangle } from 'src/models/shapes/dashedRectangle/dashed-rectangle';
import { PointService } from 'src/services/point/point.service';
import { SelectionRectangle } from 'src/models/shapes/selectionRectangle/selection-rectangle';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { ToolService } from '../tool/tool.service';

const OFFSET = 75;

@Injectable({
  providedIn: 'root'
})

export class InversionToolService extends ToolService {
  private lastPoint: PointService;
  private boundingBox: SelectionRectangle;
  private selectionRectangle: DashedRectangle;

  private boundingBoxTool: BoundingBoxToolService;

  constructor(sharedShapes: ShapesContainerService, boundingBox: SelectionRectangle, selectionRectangle: DashedRectangle) {
    super(sharedShapes);
    this.boundingBox = boundingBox;
    this.selectionRectangle = selectionRectangle;
    this.boundingBoxTool = new BoundingBoxToolService(sharedShapes, this.boundingBox, this.selectionRectangle);
    this.boundingBoxTool.initialize(this.selectionRectangle);
  }

  shapeClicked(ref: ElementRef, event: MouseEvent): void {
    this.lastPoint = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
    this.selectionRectangle.initialize(this.lastPoint);
    this.selectionRectangle.setLastPoint(this.lastPoint);
    this.selectionRectangle.generate();
    this.selectionRectangle.findExtremums();

    this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
    this.boundingBoxTool.deRenderControlPoints();

    this.boundingBoxTool.deRenderBoundingBox();
    this.boundingBoxTool.resetBoundingBox();

    this.boundingBoxTool.release(event);
  }

  click(event: MouseEvent): void {
    this.lastPoint = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
    this.selectionRectangle.initialize(this.lastPoint);
    this.shapeContainer.addShapeInProgress(this.selectionRectangle);
  }

  drag(event: MouseEvent): void {

    const CURRENTDRAGGEDPOINT = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);

    this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
    this.boundingBoxTool.deRenderControlPoints();

    this.selectionRectangle.setLastPoint(CURRENTDRAGGEDPOINT);
    this.selectionRectangle.generate();
    this.selectionRectangle.findExtremums();

    this.boundingBoxTool.deRenderBoundingBox();
    this.boundingBoxTool.resetBoundingBox();
  }

  release(event: MouseEvent): void {
    this.boundingBoxTool.release(event);

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
