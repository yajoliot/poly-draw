import { ElementRef, Injectable } from '@angular/core';
import { DashedRectangle } from 'src/models/shapes/dashedRectangle/dashed-rectangle';
import { Ellipse } from 'src/models/shapes/ellipse/ellipse';
import { LineShape } from 'src/models/shapes/line/line';
import { LinePointShape } from 'src/models/shapes/linePointShape/line-point-shape';
import { PencilShape } from 'src/models/shapes/pencil-shape/pencil-shape';
import { Polygon } from 'src/models/shapes/polygon/polygon';
import { Rectangle } from 'src/models/shapes/rectangle/rectangle';
import { SelectionRectangle } from 'src/models/shapes/selectionRectangle/selection-rectangle';
import { Shape } from 'src/models/shapes/shape/shape';
import { PointService } from 'src/services/point/point.service';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { BoundingBoxToolService } from '../boundingBoxTool/bounding-box-tool.service';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { InversionToolService } from '../inversionTool/inversion-tool.service';
import { ToolService } from '../tool/tool.service';
import { CustomShape } from 'src/models/shapes/customShape/custom-shape';
import { SprayCircle } from 'src/models/shapes/sprayCircle/spray-circle';
import { SprayShape } from 'src/models/shapes/spray-shape/spray-shape';

const TEN = 10;
const MAX = 1000000;
const OFFSET = 75;
const ARROWTRANSLATION = 3;

@Injectable({
  providedIn: 'root'
})

export class SelectionToolService extends ToolService {
  mouseClicked: boolean;
  mouseMoved: boolean;
  lastPoint: PointService;
  shapeSelected: boolean;
  boundingBox: SelectionRectangle;
  selectionRectangle: DashedRectangle;
  firstDrag: boolean;
  translation: boolean;
  shapeIsClicked: boolean;
  toolUtil: any;
  newShape: Shape;
  shiftPressed: boolean;
  nPressed: boolean;
  oldPoint: PointService;

  private scrollSpeed: number;
  private shapesToDuplicate: string[];
  private typesOfDuplicateShapes: any[];
  private shapesToCopy: string[];
  private typesOfShapes: any[];
  private numberOfCopies: number;
  private rightClicked: boolean;
  private inversionTool: InversionToolService;
  protected boundingBoxTool: BoundingBoxToolService;

  constructor(sharedShapes: ShapesContainerService, private configEnv: ConfigEnvService) {
    super(sharedShapes);
    this.mouseClicked = false;
    this.mouseMoved = false;
    this.shapeSelected = false;
    this.firstDrag = true;
    this.translation = false;
    this.shapeIsClicked = false;
    this.rightClicked = false;
    this.boundingBox = new SelectionRectangle(1, '#000000', 'none');
    this.selectionRectangle = new DashedRectangle(1, '#000000', 'none');
    this.lastPoint = new PointService(0, 0);
    this.boundingBox.initialize(this.lastPoint);
    this.boundingBox.setLastPoint(this.lastPoint);
    this.boundingBox.generateRectangle();
    this.shapeContainer.addShapeInProgress(this.boundingBox);
    this.inversionTool = new InversionToolService(sharedShapes, this.boundingBox, this.selectionRectangle);
    this.boundingBoxTool = new BoundingBoxToolService(sharedShapes, this.boundingBox, this.selectionRectangle);
    this.boundingBoxTool.initialize(this.selectionRectangle);
    this.shapesToCopy = [];
    this.typesOfShapes = [];
    this.shapesToDuplicate = [];
    this.typesOfDuplicateShapes = [];
    this.numberOfCopies = 0;

    this.scrollSpeed = 15;
    this.shiftPressed = false;
    this.nPressed = false;
  }

  scroll(event: MouseEvent): void {
    if (event.altKey) {
      this.scrollSpeed = 1;
    } else {
      this.scrollSpeed = 15;
    }

    if (event.detail > 0) {
      if (this.shiftPressed) {
        this.rotate(this.scrollSpeed);
      } else {
        this.boundingBox.setCenter();
        this.rotateAboutPoint(this.scrollSpeed, this.boundingBox.getCenter());
      }
      // this.scrollSpeed = (this.scrollSpeed - 15)%360;

    } else {
      if (this.shiftPressed) {
        this.rotate(this.scrollSpeed);
      } else {
        this.boundingBox.setCenter();
        this.rotateAboutPoint(-this.scrollSpeed, this.boundingBox.getCenter());
      }
    }
  }

  shapeClicked(ref: ElementRef, event: MouseEvent): void {
    // temp

    // temp

    switch (event.button) {
      case 0:
        this.lastPoint = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
        if (this.boundingBox.isSelected(this.lastPoint)) {
          this.translation = true;
          this.oldPoint = this.lastPoint;
        }
        if (!this.translation) {
          this.shapeIsClicked = true;
          // reset all shape selections to false
          for (const SHAPE of this.shapeContainer.getShapes().values()) {
            SHAPE.setSelect(false);
          }
          const shapeNumber = this.shapeContainer.elementRefMap.get(ref);
          if (shapeNumber != undefined) {
            const SHAPE = this.shapeContainer.getShapes().get(shapeNumber);
            if (SHAPE != undefined) {

              const BOUNDINGBOXMINIMUM = new PointService(MAX, MAX);
              const BOUNDINGBOXMAXIMUM = new PointService(0, 0);

              this.shapeSelected = true;

              SHAPE.setSelect(true);
              this.boundingBoxTool.setBoundingBox(SHAPE, BOUNDINGBOXMINIMUM, BOUNDINGBOXMAXIMUM);
              this.boundingBoxTool.generateBoundingBox(BOUNDINGBOXMINIMUM, BOUNDINGBOXMAXIMUM);

            }
          }
        }
        break;

      case 2:
        this.inversionTool.shapeClicked(ref, event);
        this.shapeIsClicked = true;
        this.rightClicked = true;
        break;
    }
  }

  click(event: MouseEvent): void {

    this.lastPoint = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
    switch (event.button) {
      case 0: {
        if (this.boundingBox.isSelected(this.lastPoint)) {
          this.translation = true;
          this.oldPoint = this.lastPoint;
        } else {

          for (const SHAPE of this.shapeContainer.getShapes().values()) {
            SHAPE.setSelect(false);
          }
          this.selectionRectangle.initialize(this.lastPoint);
          this.shapeContainer.addShapeInProgress(this.selectionRectangle);

          this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
          this.boundingBoxTool.deRenderControlPoints();

          this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
          this.boundingBoxTool.click(event);
        }
        this.mouseClicked = true;
        break;
      }
      case 2: {
        if (!this.shapeIsClicked) {
          this.rightClicked = true;
          this.inversionTool.click(event);
        }
        break;
      }
    }
  }

  drag(event: MouseEvent): void {
    const CURRENTDRAGGEDPOINT = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
    switch (this.rightClicked) {
      case false:
        if (this.mouseClicked) {
          if (!this.translation && !this.shapeIsClicked) {
            if (this.firstDrag) {
              this.firstDrag = false;
            } else {
              this.selectionRectangle.setLastPoint(CURRENTDRAGGEDPOINT);
              this.selectionRectangle.generate();
              this.selectionRectangle.findExtremums();
              this.boundingBoxTool.deRenderControlPoints();
              this.boundingBoxTool.drag(event);
            }
          } else {
            this.translate(CURRENTDRAGGEDPOINT.getPositionX() - this.lastPoint.getPositionX(),
              CURRENTDRAGGEDPOINT.getPositionY() - this.lastPoint.getPositionY());
            this.lastPoint = CURRENTDRAGGEDPOINT;
          }
          this.mouseMoved = true;
        }
        break;
      case true:
        if (!this.shapeIsClicked) {
          this.inversionTool.drag(event);
        }

        break;

    }
  }

  release(event: MouseEvent): void {

    switch (event.button) {
      case 0:
        this.lastPoint = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);

        if (this.mouseMoved) {
          this.boundingBox.findExtremums();
        }

        this.shapeContainer.removeSpecificShapeInProgress(this.selectionRectangle);
        this.mouseClicked = false;
        this.mouseMoved = false;
        if (this.boundingBox.isSelected(this.lastPoint) && this.translation) {
          this.translation = false;

          const TRANSLATION = new PointService(this.lastPoint.getPositionX() - this.oldPoint.getPositionX(),
            this.lastPoint.getPositionY() - this.oldPoint.getPositionY());
          const SHAPESMOVED = [];

          for (const SHAPE of this.shapeContainer.getShapes().values()) {
            if (SHAPE.getSelect()) {
              SHAPESMOVED.push(SHAPE);

            }
          }
          this.shapeContainer.executeTranslationCommand(SHAPESMOVED, TRANSLATION);
        }
        this.shapeIsClicked = false;
        this.firstDrag = true;
        break;

      case 2:
        this.rightClicked = false;
        this.shapeIsClicked = false;
        this.shapeContainer.removeSpecificShapeInProgress(this.selectionRectangle);
        this.inversionTool.release(event);
        break;
    }
  }

  keyboardUp(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.shiftPressed = false;
      if (event.altKey) {
        this.scrollSpeed = 1;
      } else {
        this.scrollSpeed = 15;
      }
    }
  }

  keyboardDown(event: KeyboardEvent): void {
    const TRANSLATION = new PointService(0, 0);
    switch (event.key) {
      case 'ArrowUp': {
        this.translate(0, -ARROWTRANSLATION);
        TRANSLATION.setPositionX(0);
        TRANSLATION.setPositionY(-ARROWTRANSLATION);
        break;
      }
      case 'ArrowLeft': {
        this.translate(-ARROWTRANSLATION, 0);
        TRANSLATION.setPositionX(-ARROWTRANSLATION);
        TRANSLATION.setPositionY(0);
        break;
      }
      case 'ArrowRight': {
        this.translate(ARROWTRANSLATION, 0);
        TRANSLATION.setPositionX(ARROWTRANSLATION);
        TRANSLATION.setPositionY(0);
        break;
      }
      case 'ArrowDown': {
        this.translate(0, ARROWTRANSLATION);
        TRANSLATION.setPositionX(0);
        TRANSLATION.setPositionY(ARROWTRANSLATION);
        break;
      }
      case 'Shift': {

        this.shiftPressed = true;

        break;
      }
    }
    const SHAPESMOVED = [];
    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      if (SHAPE.getSelect()) {
        SHAPESMOVED.push(SHAPE);
      }
    }
    this.shapeContainer.executeTranslationCommand(SHAPESMOVED, TRANSLATION);

  }

  translate(xTranslate: number, yTranslate: number): void {
    this.boundingBox.translate(xTranslate, yTranslate);
    let shapesToTranslate: Shape[];
    shapesToTranslate = [];
    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      if (SHAPE.getSelect()) {
        shapesToTranslate.push(SHAPE);
      }
    }
    for (const SHAPE of shapesToTranslate) {
      SHAPE.translate(xTranslate, yTranslate);
      this.shapeContainer.removeShape(SHAPE);
      this.shapeContainer.addShape(SHAPE);
    }
  }

  rotateAboutPoint(degree: number, point: PointService): void {
    let shapesToRotate: Shape[];
    shapesToRotate = [];
    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      if (SHAPE.getSelect()) {
        shapesToRotate.push(SHAPE);
      }
    }
    this.boundingBox.setCenter();
    this.shapeContainer.executeRotationCommand(shapesToRotate, degree, this.boundingBox.getCenter(), true);
    // for (const SHAPE of shapesToRotate) {
    //   // this.shapeContainer.executeRotationCommand()
    //   SHAPE.rotateAboutPoint(degree, point);
    //   this.shapeContainer.removeShape(SHAPE);
    //   this.shapeContainer.addShape(SHAPE);
    // }
    this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
    this.boundingBox.setExtremums(this.shapeContainer);
    this.boundingBoxTool.generateBoundingBox(this.boundingBox.getMinimum(), this.boundingBox.getMaximum());
    this.shapeContainer.addShapeInProgress(this.boundingBox);
  }

  rotate(degree: number): void {
    let shapesToRotate: Shape[];
    shapesToRotate = [];
    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      if (SHAPE.getSelect()) {
        shapesToRotate.push(SHAPE);
      }
    }
    this.shapeContainer.executeRotationCommand(shapesToRotate, degree, new PointService(0,0), false);
    this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
    this.boundingBox.setExtremums(this.shapeContainer);
    this.boundingBoxTool.generateBoundingBox(this.boundingBox.getMinimum(), this.boundingBox.getMaximum());
    this.shapeContainer.addShapeInProgress(this.boundingBox);
  }

  onMouseLeave(event: MouseEvent): void {
    this.boundingBoxTool.deRenderControlPoints();
    this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
  }
  cut(): void {
    this.shapesToCopy = [];
    this.typesOfShapes = [];
    this.numberOfCopies = 0;
    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      if (SHAPE.getSelect()) {
        SHAPE.setSelect(false);
        this.shapesToCopy.push(JSON.stringify(SHAPE));
        this.typesOfShapes.push(SHAPE.constructor.name);
        this.shapeContainer.removeShape(SHAPE);
        this.boundingBoxTool.deRenderControlPoints()
        this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
      }
    }
  }

  copy(): void {
    console.log('asafh')
    this.shapesToCopy = [];
    this.typesOfShapes = [];
    this.numberOfCopies = 0;
    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      if (SHAPE.getSelect()) {
        this.shapesToCopy.push(JSON.stringify(SHAPE));
        this.typesOfShapes.push(SHAPE.constructor.name);
        SHAPE.setSelect(false);
      }
    }
  }

  delete(): void {
    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      if (SHAPE.getSelect()) {
        SHAPE.setSelect(false);
        this.shapeContainer.removeShape(SHAPE);
        this.derender();
      }
    }
  }

  duplicate(): void {
    this.shapesToDuplicate = [];
    this.typesOfDuplicateShapes = [];
    this.numberOfCopies = 0;
    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      if (SHAPE.getSelect()) {
        this.shapesToDuplicate.push(JSON.stringify(SHAPE));
        this.typesOfDuplicateShapes.push(SHAPE.constructor.name);
        SHAPE.setSelect(false);
      }
    }
    this.numberOfCopies += 1;
    this.injectShapes(this.shapesToDuplicate, this.typesOfDuplicateShapes);
    this.derender();
    this.boundingBoxTool.renderBoundingBoxClipboard();
    this.VerifieExtremum();
  }

  paste(): void {
    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      SHAPE.setSelect(false);
    }
    this.numberOfCopies += 1;
    this.injectShapes(this.shapesToCopy, this.typesOfShapes);
    this.derender();
    this.boundingBoxTool.renderBoundingBoxClipboard();
    this.VerifieExtremum();
  }

  derender(): void {
    this.boundingBoxTool.deRenderBoundingBox();
    this.boundingBoxTool.deRenderControlPoints();
    this.shapeContainer.removeSpecificShapeInProgress(this.boundingBox);
  }

  VerifieExtremum(): void {
    if (this.boundingBoxTool.getmaximum().getPositionX() > this.configEnv.width ||
        this.boundingBoxTool.getmaximum().getPositionY() > this.configEnv.height) {
      this.numberOfCopies = 0;
    }
  }

  injectShapes(shapesToCopy: string[], typesOfShapes: any[]): void {

    let i = 0;
    let shapes: Shape[];
    shapes = [];
    for (const TYPE of typesOfShapes) {
      const jsonShape = JSON.parse(shapesToCopy[i]);
      switch (TYPE) {
        case 'PencilShape':
          const PENCILSHAPE = new PencilShape(jsonShape.width, jsonShape.mainColor, jsonShape.secondaryColor);
          PENCILSHAPE.setLines(this.injectLines(jsonShape.lines, jsonShape.width, jsonShape.mainColor, jsonShape.secondaryColor));
          PENCILSHAPE.setInstruction(jsonShape.instruction);
          PENCILSHAPE.fill = jsonShape.fill;

          PENCILSHAPE.translate(this.numberOfCopies * TEN, this.numberOfCopies * TEN);
          PENCILSHAPE.findExtremums();
          PENCILSHAPE.setCenter();
          PENCILSHAPE.getLines()[0].setOrigin(PENCILSHAPE.getLines()[0].getDestination());
          PENCILSHAPE.setSelect(true);
          PENCILSHAPE.translate(this.numberOfCopies * TEN, this.numberOfCopies * TEN);
          shapes.push(PENCILSHAPE);
          break;
        case 'Rectangle':
          const RECTANGLE = new Rectangle(jsonShape.width, jsonShape.secondaryColor, jsonShape.mainColor);
          RECTANGLE.setInstruction(jsonShape.instruction);

          RECTANGLE.setMinimum(new PointService(jsonShape.minimum.x, jsonShape.minimum.y));
          RECTANGLE.setMaximum(new PointService(jsonShape.maximum.x, jsonShape.maximum.y));
          RECTANGLE.initialize(new PointService(jsonShape.initialPoint.x, jsonShape.initialPoint.y));
          RECTANGLE.setLastPoint(new PointService(jsonShape.lastPoint.x, jsonShape.lastPoint.y));

          RECTANGLE.setSelect(true);

          RECTANGLE.shiftPressed = jsonShape.shiftPressed;

          RECTANGLE.vertices = [];

          RECTANGLE.vertices[0] = new PointService(jsonShape.vertices[0]['x'], jsonShape.vertices[0]['y']);
          RECTANGLE.vertices[1] = new PointService(jsonShape.vertices[1]['x'], jsonShape.vertices[1]['y']);
          RECTANGLE.vertices[2] = new PointService(jsonShape.vertices[2]['x'], jsonShape.vertices[2]['y']);
          RECTANGLE.vertices[3] = new PointService(jsonShape.vertices[3]['x'], jsonShape.vertices[3]['y']);

          RECTANGLE.fill = jsonShape.fill;
          RECTANGLE.setShapeNumber(undefined);

          RECTANGLE.generateVertices();

          RECTANGLE.translate(this.numberOfCopies * TEN, this.numberOfCopies * TEN);

          shapes.push(RECTANGLE);

          break;
        case 'Ellipse':

          const ELLIPSE = new Ellipse(jsonShape.width, jsonShape.mainColor, jsonShape.secondaryColor);
          ELLIPSE.setShapeNumber(jsonShape.shapeNumber);
          ELLIPSE.setInstruction(jsonShape.instruction);
          ELLIPSE.setSelect(true);

          ELLIPSE.setMinimum(new PointService(jsonShape.minimum.x, jsonShape.minimum.y));
          ELLIPSE.setMaximum(new PointService(jsonShape.maximum.x, jsonShape.maximum.y));

          ELLIPSE.initialize(new PointService(jsonShape.initial.x, jsonShape.initial.y));
          ELLIPSE.setDestination(new PointService(jsonShape.destination.x, jsonShape.destination.y));

          ELLIPSE.findAndSetProperties();
          ELLIPSE.generate();

          ELLIPSE.fill = jsonShape.fill;
          ELLIPSE.setShapeNumber(undefined);
          ELLIPSE.translate(this.numberOfCopies * TEN, this.numberOfCopies * TEN);

          shapes.push(ELLIPSE);

          break;
        case 'LinePointShape':

          const LINEPOINTSHAPE = new LinePointShape(jsonShape.width, jsonShape.mainColor, jsonShape.secondaryColor);
          LINEPOINTSHAPE.setLines(this.injectLines(jsonShape.lines, jsonShape.width, jsonShape.mainColor, jsonShape.secondaryColor));
          LINEPOINTSHAPE.setInstruction(jsonShape.instruction);
          LINEPOINTSHAPE.fill = jsonShape.fill;
          LINEPOINTSHAPE.setSelect(true);
          LINEPOINTSHAPE.setCenter();
          LINEPOINTSHAPE.resetCircles();
          LINEPOINTSHAPE.findExtremums();

          LINEPOINTSHAPE.translate(this.numberOfCopies * TEN, this.numberOfCopies * TEN);

          shapes.push(LINEPOINTSHAPE);

          break;
        case 'Polygon':
          const POLYGON = new Polygon(jsonShape.width, jsonShape.mainColor, jsonShape.secondaryColor);

          POLYGON.fill = jsonShape.fill;
          POLYGON.sides = jsonShape.sides;
          console.log(new PointService(jsonShape.initialPoint['x'], jsonShape.initialPoint['y']));
          POLYGON.initialize(new PointService(jsonShape.initialPoint['x'], jsonShape.initialPoint['y']));
          POLYGON.setLastPoint(new PointService(jsonShape.lastPoint['x'], jsonShape.lastPoint['y']));
          POLYGON.generatePolygon(new PointService(jsonShape.lastPoint['x'], jsonShape.lastPoint['y']));
          POLYGON.setSelect(true);
          POLYGON.setShapeNumber(undefined);
          POLYGON.translate(this.numberOfCopies * TEN, this.numberOfCopies * TEN);

          shapes.push(POLYGON);

          break;
        case 'CustomShape':

          const CUSTOMSHAPE = new CustomShape(jsonShape.width, jsonShape.mainColor, jsonShape.secondaryColor);
          CUSTOMSHAPE.initialize();
          for (const dot of jsonShape.coloredDots) {
            CUSTOMSHAPE.coloredDots.push(new PointService(dot.x, dot.y));
          }
          CUSTOMSHAPE.colorArray();
          CUSTOMSHAPE.translate(this.numberOfCopies * TEN, this.numberOfCopies * TEN);

          shapes.push(CUSTOMSHAPE);
          break;
        case 'SprayShape':

          const SPRAYSHAPE = new SprayShape(jsonShape.width, jsonShape.mainColor, jsonShape.secondaryColor);
          SPRAYSHAPE.initialize();
          SPRAYSHAPE.radius = jsonShape.radius;
          SPRAYSHAPE.NUMDOTS = jsonShape.NUMDOTS;
          let circles: SprayCircle[];
          circles = [];
          for(const CIRCLE of jsonShape.circles){
            const SPRAYCIRCLE = new SprayCircle(jsonShape.width, jsonShape.mainColor, jsonShape.secondaryColor);
            SPRAYCIRCLE.setCircle(SPRAYSHAPE.radius, new PointService(CIRCLE.center.x,CIRCLE.center.y));
            SPRAYCIRCLE.setLines(this.injectLines(CIRCLE.lines,jsonShape.width, jsonShape.mainColor, jsonShape.secondaryColor));
            SPRAYCIRCLE.generate();
            circles.push(SPRAYCIRCLE);
          }

          SPRAYSHAPE.circles = circles;

          SPRAYSHAPE.generate();

          SPRAYSHAPE.translate(this.numberOfCopies * TEN, this.numberOfCopies * TEN);

          shapes.push(SPRAYSHAPE);
          break;
      }
      i++;
    }
    this.shapeContainer.executePasteCommand(shapes);
  }

  injectLines(lines: any[], width: number, mainColor: string, secondaryColor: string): LineShape[] {
    let linesRecreated: LineShape[];
    linesRecreated = [];

    for (const LINEJSON of lines) {

      const LINE = new LineShape(width, mainColor, secondaryColor);
      LINE.setInstruction(LINEJSON.instruction);
      LINE.fill = LINEJSON.fill;

      LINE.setMinimum(new PointService(LINEJSON.minimum.x, LINEJSON.minimum.y));
      LINE.setMaximum(new PointService(LINEJSON.maximum.x, LINEJSON.maximum.y));

      LINE.setSelect(LINEJSON.selected);

      LINE.setAngleMultiple(LINEJSON.angleMultiple);
      LINE.isRelative = LINEJSON.isRelative;

      LINE.setOrigin(new PointService(LINEJSON.origin.x, LINEJSON.origin.y));
      LINE.setDestination(new PointService(LINEJSON.destination.x, LINEJSON.destination.y));

      linesRecreated.push(LINE);
    }

    return linesRecreated;
  }
}
