import { PointService } from 'src/services/point/point.service';
import { Ellipse } from '../ellipse/ellipse';
import { LineShape } from '../line/line';
import { PencilShape } from '../pencil-shape/pencil-shape';
import { Rectangle } from '../rectangle/rectangle';
const INIT = 5;
const VALUE = 20;
export class LinePointShape extends PencilShape {
  radius: number;
  private circles: Ellipse[];
  constructor(width: number, mainColor: string, secondaryColor: string) {
    super(width, mainColor, mainColor);
    this.radius = INIT;
    this.circles = [];
  }

  initialize(point: PointService): void {
    super.initialize(point);
    this.circles = new Array<Ellipse>();
  }

  drawLine(point: PointService): void {
    super.drawLine(point);
    const CIRCLE = new Ellipse(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
    CIRCLE.generateCirle(VALUE, point);
    this.circles.push(CIRCLE);
  }

  generate(): void {
    super.generate();
    for (const CIRCLE of this.circles) {
      this.instruction += CIRCLE.instruction;
    }
  }

  setCircles(circles: Ellipse[]): void {
    this.circles = circles;
  }

  addLine(line: LineShape): void {
    super.addLine(line);
    const CIRCLE = new Ellipse(this.getWidth(), this.getMainColor(), this.getMainColor());
    CIRCLE.generateCirle(VALUE, super.getLastLine().getOrigin());
    this.circles.push(CIRCLE);
    this.generate();
  }

  getLastPoint(): PointService {
    return super.getLastPoint();
  }

  removeLine(): void {
    super.removeLine();
    this.circles.pop();
    this.generate();
  }

  getLastLine(): LineShape {
    return super.getLastLine();
  }

  getNumberOfLines(): number {
    return super.getNumberOfLines();
  }
  getNumberOfCircles(): number {
    return this.circles.length;
  }

  findExtremums(): void {
    super.findExtremums();
    for (const CIRCLE of this.circles) {
      this.updateExtremums(CIRCLE.getMinimum());
      this.updateExtremums(CIRCLE.getMaximum());
    }
  }

  detectRectangleIntersection(rectangleToCheck: Rectangle): boolean {
    for (const CIRCLE of this.circles) {
      if (CIRCLE.detectRectangleIntersection(rectangleToCheck)) {
        return true;
      }
    }
    return super.detectRectangleIntersection(rectangleToCheck);
  }

  resetCircleExtremums(): void {
    for (const CIRCLE of this.circles) {
      this.updateExtremums(CIRCLE.getMinimum());
      this.updateExtremums(CIRCLE.getMaximum());
    }
  }

  resetCircles() {
    this.circles = [];
    for (var LINE of this.getLines()) {
      const CIRCLE = new Ellipse(this.getWidth(), this.getMainColor(), this.getMainColor());
      CIRCLE.generateCirle(VALUE, LINE.getOrigin());
      this.circles.push(CIRCLE);
    }
    this.generate();
  }

  translate(xTranslation: number, yTranslation: number): void {
    this.getLines()[0].getOrigin().setPositionX(this.getLines()[0].getOrigin().getPositionX() + xTranslation);
    this.getLines()[0].getOrigin().setPositionY(this.getLines()[0].getOrigin().getPositionY() + yTranslation);
    super.translate(xTranslation, yTranslation);
    for (const CIRCLE of this.circles) {
      CIRCLE.translate(xTranslation, yTranslation);
    }
    this.generate();
    this.resetCircleExtremums();
  }

  rotate(degree: number): void {
    this.getLines()[0].getOrigin().rotateAboutPoint(degree, this.center);
    super.rotate(degree);
    this.circles = [];
    for (const LINE of this.getLines()) {

      const CIRCLE = new Ellipse(this.getWidth(), this.getMainColor(), this.getMainColor());
      CIRCLE.generateCirle(VALUE, LINE.getOrigin());
      this.circles.push(CIRCLE);

      this.generate();
    }
  }

  rotateAboutPoint(degree: number, point: PointService): void {
    this.getLines()[0].getOrigin().rotateAboutPoint(degree, point);
    super.rotateAboutPoint(degree, point);
    this.circles = [];
    for (const LINE of this.getLines()) {

      const CIRCLE = new Ellipse(this.getWidth(), this.getMainColor(), this.getMainColor());
      CIRCLE.generateCirle(VALUE, LINE.getOrigin());
      this.circles.push(CIRCLE);

      this.generate();
    }
  }
}


