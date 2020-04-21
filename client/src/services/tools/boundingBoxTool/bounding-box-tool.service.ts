import { Injectable } from '@angular/core';
import { DashedRectangle } from 'src/models/shapes/dashedRectangle/dashed-rectangle';
import { Rectangle } from 'src/models/shapes/rectangle/rectangle';
import { SelectionRectangle } from 'src/models/shapes/selectionRectangle/selection-rectangle';
import { PointService } from 'src/services/point/point.service';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { ToolService } from '../tool/tool.service';

const LARGE_INT = 1000000;

import { Shape } from 'src/models/shapes/shape/shape';

const OFFSET = 75;
@Injectable({
  providedIn: 'root'
})

export class BoundingBoxToolService extends ToolService {
  private boundingBox: SelectionRectangle;
  private selectionRectangle: DashedRectangle;
  private lastPoint: PointService;
  private shapesUnselected: Shape[];
  private maximum: PointService;

  constructor(sharedShapes: ShapesContainerService, boundingBox: SelectionRectangle, selectionRectangle: DashedRectangle) {
    super(sharedShapes);
    this.boundingBox = boundingBox;
    this.selectionRectangle = selectionRectangle;
    this.shapesUnselected = [];
  }

  initialize(selectionRectangle: DashedRectangle): void {
    this.selectionRectangle = selectionRectangle;
  }

  click(event: MouseEvent): void {

    this.lastPoint = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);

    this.boundingBox.initialize(this.lastPoint);
    this.boundingBox.setLastPoint(this.lastPoint);
    this.boundingBox.generateRectangle();
    this.shapeContainer.addShapeInProgress(this.boundingBox);
  }

  drag(event: MouseEvent): void {

    this.renderBoundingBox();

  }

  renderBoundingBox(): void {
    this.selectionRectangle.findExtremums();
    // TODO Change magic number (SZ)
    const BOUNDINGBOXMINIMUM = new PointService(LARGE_INT,LARGE_INT);
    const BOUNDINGBOXMAXIMUM = new PointService(0, 0);
    let emptyBoundingBox = true;

    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      const SHAPERECT = new Rectangle(1, '', '');
      SHAPERECT.initialize(SHAPE.getMinimum());
      SHAPERECT.setLastPoint(SHAPE.getMaximum());
      SHAPERECT.setMinimum(SHAPE.getMinimum());
      SHAPERECT.setMaximum(SHAPE.getMaximum());

      if (SHAPE.detectRectangleIntersection(this.selectionRectangle) ||
      SHAPERECT.detectRectangleInclusion(this.selectionRectangle) ||
      this.selectionRectangle.detectRectangleInclusion(SHAPERECT)) {
        this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
        this.shapeContainer.addShapeInProgress(this.boundingBox);
        emptyBoundingBox = false;
        SHAPE.setSelect(true);
        this.setBoundingBox(SHAPE, BOUNDINGBOXMINIMUM, BOUNDINGBOXMAXIMUM);
      } else {
        SHAPE.setSelect(false);
      }
      this.boundingBox.setExtremums(this.shapeContainer);
    }

    if (!emptyBoundingBox) {
      this.generateBoundingBox(BOUNDINGBOXMINIMUM, BOUNDINGBOXMAXIMUM);
    } else {
      this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
    }
  }

  renderBoundingBoxClipboard(): void {

    const BOUNDINGBOXMINIMUM = new PointService(LARGE_INT, LARGE_INT);
    const BOUNDINGBOXMAXIMUM = new PointService(0, 0);
    let emptyBoundingBox = true;

    // let i = 0;
    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      const SHAPERECT = new Rectangle(1, '', ''); // <- d
      SHAPERECT.initialize(SHAPE.getMinimum()); // <- d
      SHAPERECT.setLastPoint(SHAPE.getMaximum()); // <- d
      SHAPERECT.setMinimum(SHAPE.getMinimum()); // <- d
      SHAPERECT.setMaximum(SHAPE.getMaximum()); // <- d

      if (SHAPE.getSelect()) {
        this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
        this.shapeContainer.addShapeInProgress(this.boundingBox);
        emptyBoundingBox = false;
        SHAPE.setSelect(true);
        this.setBoundingBox(SHAPE, BOUNDINGBOXMINIMUM, BOUNDINGBOXMAXIMUM);
      } else {
        SHAPE.setSelect(false);
      }
      this.boundingBox.setExtremums(this.shapeContainer);
    }

    if (!emptyBoundingBox) {
      this.generateBoundingBox(BOUNDINGBOXMINIMUM, BOUNDINGBOXMAXIMUM);
    } else {
      this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
    }
    this.maximum = BOUNDINGBOXMAXIMUM;
  }

  getmaximum(): any{
    return this.maximum;
  }
//////////////////
  release(event: MouseEvent): void {
    this.shapeContainer.removeSpecificShapeInProgress(this.selectionRectangle);
    for (const SHAPE of this.shapesUnselected){
      SHAPE.setSelect(false);
    }
    this.shapesUnselected = [];
  }

  setBoundingBox(SHAPE: Shape, BOUNDINGBOXMINIMUM: PointService, BOUNDINGBOXMAXIMUM: PointService): void {
    if (BOUNDINGBOXMINIMUM.getPositionX() > SHAPE.getMinimum().getPositionX()) {
      BOUNDINGBOXMINIMUM.setPositionX(SHAPE.getMinimum().getPositionX());
    }
    if (BOUNDINGBOXMINIMUM.getPositionY() > SHAPE.getMinimum().getPositionY()) {
      BOUNDINGBOXMINIMUM.setPositionY(SHAPE.getMinimum().getPositionY());
    }
    if (BOUNDINGBOXMAXIMUM.getPositionX() < SHAPE.getMaximum().getPositionX()) {
      BOUNDINGBOXMAXIMUM.setPositionX(SHAPE.getMaximum().getPositionX());
    }
    if (BOUNDINGBOXMAXIMUM.getPositionY() < SHAPE.getMaximum().getPositionY()) {
      BOUNDINGBOXMAXIMUM.setPositionY(SHAPE.getMaximum().getPositionY());
    }
  }

  generateBoundingBox(BOUNDINGBOXMINIMUM: PointService, BOUNDINGBOXMAXIMUM: PointService): void{
    this.boundingBox.initialize(BOUNDINGBOXMINIMUM);
    this.boundingBox.setLastPoint(BOUNDINGBOXMAXIMUM);
    this.boundingBox.generateRectangle();
    this.deRenderControlPoints();
    this.renderControlPoints();
  }

  renderControlPoints(): void {
    for (const CONTROLPOINT of this.boundingBox.getControlPoints()) {
      this.shapeContainer.addShapeInProgress(CONTROLPOINT);
    }
  }

  deRenderControlPoints(): void {
    for ( const _CONTROLPOINT of this.boundingBox.getControlPoints()) {
      this.shapeContainer.removeSpecificShapeInProgress(_CONTROLPOINT);
    }
  }

  deRenderBoundingBox(): void {
    this.selectionRectangle.findExtremums();

    this.shapesUnselected = [];

    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      const SHAPERECT = new Rectangle(1, '', '');
      SHAPERECT.initialize(SHAPE.getMinimum());
      SHAPERECT.setLastPoint(SHAPE.getMaximum());
      SHAPERECT.setMinimum(SHAPE.getMinimum());
      SHAPERECT.setMaximum(SHAPE.getMaximum());

      if (SHAPE.detectRectangleIntersection(this.selectionRectangle) ||
      SHAPERECT.detectRectangleInclusion(this.selectionRectangle) ||
      this.selectionRectangle.detectRectangleInclusion(SHAPERECT)) {
        this.shapesUnselected.push(SHAPE);
      }
    }

  }

  resetBoundingBox(): void {

    for (const SHAPE of this.shapesUnselected) {
      SHAPE.setSelect(false);
    }

    const BOUNDINGBOXMINIMUM = new PointService(LARGE_INT, LARGE_INT);
    const BOUNDINGBOXMAXIMUM = new PointService(0, 0);
    let emptyBoundingBox = true;

    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      if (SHAPE.getSelect()) {
        emptyBoundingBox = false;
        this.setBoundingBox(SHAPE, BOUNDINGBOXMINIMUM, BOUNDINGBOXMAXIMUM);
      }
    }

    for (const SHAPE of this.shapesUnselected) {
      SHAPE.setSelect(true);
    }
    this.boundingBox.setExtremums(this.shapeContainer);

    if (!emptyBoundingBox) {
      this.boundingBox.initialize(BOUNDINGBOXMINIMUM);
      this.boundingBox.setLastPoint(BOUNDINGBOXMAXIMUM);
      this.boundingBox.generateRectangle();
      this.deRenderControlPoints();
      this.renderControlPoints();
      this.shapeContainer.addShapeInProgress(this.boundingBox);
      // this.renderControlPoints();
    } else {
      this.boundingBox.initialize(new PointService(0, 0));
      this.boundingBox.setLastPoint(new PointService(0, 0));
      this.boundingBox.generateRectangle();
      this.deRenderControlPoints();
    }
  }
}
