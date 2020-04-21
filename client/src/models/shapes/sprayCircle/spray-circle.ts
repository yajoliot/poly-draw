import { PointService } from 'src/services/point/point.service';
import { Ellipse } from '../ellipse/ellipse';
import { LineShape } from '../line/line';
const MAX = 1000000;
const INITRAD = 10;
export class SprayCircle extends Ellipse {
  private lines: LineShape[];
  private radius: number;
  constructor(width: number, mainColor: string, secondaryColor: string) {
    super(1, 'none', 'none');
    this.radius = INITRAD;
    this.lines = [];
  }
  initialize(point: PointService): void {
    this.setCircle(this.radius, point);
  }
  setCircle(radius: number, center: PointService): void {
    this.minimum.setPositionX(center.getPositionX() - radius);
    this.minimum.setPositionY(center.getPositionY() - radius);
    this.maximum.setPositionX(center.getPositionX() + radius);
    this.maximum.setPositionY(center.getPositionY() + radius);
    super.initialize(this.minimum);
    super.setDestination(this.maximum);
    this.radii.setPositionX(radius);
    this.radii.setPositionY(radius);
    this.center.setPositionX(center.getPositionX());
    this.center.setPositionY(center.getPositionY());
  }

  getLines(): LineShape[] {
    return this.lines;
  }

  setLines(newLines: LineShape[]): void {
    this.lines = newLines;
  }

  addLine(point: PointService): void {
    const LINE: LineShape = new LineShape(1, this.getMainColor(), this.getSecondaryColor());
    LINE.generateLine(point, new PointService(point.getPositionX(), point.getPositionY()));
    this.instruction += LINE.instruction;
    this.lines[this.lines.length] = LINE;
    /* console.log('this.lines');
    console.log(this.lines); */
  }

  generate(): void {
    this.instruction = '';
    for (const LINE of this.lines) {
      this.instruction += LINE.instruction;
    }
  }

  resetExtremums(): void {

    this.minimum = new PointService(MAX, MAX);
    this.maximum = new PointService(0, 0);

    for (const LINE of this.lines) {
      if (LINE.getOrigin().getPositionX() < this.getMinimum().getPositionX()) {
        this.setMinimum(new PointService(LINE.getOrigin().getPositionX(), this.getMinimum().getPositionY()));
      }
      if (LINE.getOrigin().getPositionY() < this.getMinimum().getPositionY()) {
        this.setMinimum(new PointService(this.getMinimum().getPositionX(), LINE.getOrigin().getPositionY()));
      }
      if (LINE.getOrigin().getPositionX() > this.getMaximum().getPositionX()) {
        this.setMaximum(new PointService(LINE.getOrigin().getPositionX(), this.getMaximum().getPositionY()));
      }
      if (LINE.getOrigin().getPositionY() > this.getMaximum().getPositionY()) {
        this.setMaximum(new PointService(this.getMaximum().getPositionX(), LINE.getOrigin().getPositionY()));
      }
    }

    for (const LINE of this.lines) {
      if (LINE.getDestination().getPositionX() < this.getMinimum().getPositionX()) {
        this.setMinimum(new PointService(LINE.getDestination().getPositionX(), this.getMinimum().getPositionY()));
      }
      if (LINE.getDestination().getPositionY() < this.getMinimum().getPositionY()) {
        this.setMinimum(new PointService(this.getMinimum().getPositionX(), LINE.getDestination().getPositionY()));
      }
      if (LINE.getDestination().getPositionX() > this.getMaximum().getPositionX()) {
        this.setMaximum(new PointService(LINE.getDestination().getPositionX(), this.getMaximum().getPositionY()));
      }
      if (LINE.getDestination().getPositionY() > this.getMaximum().getPositionY()) {
        this.setMaximum(new PointService(this.getMaximum().getPositionX(), LINE.getDestination().getPositionY()));
      }
    }
  }

  translate(xTranslate: number, yTranslate: number): void {
    super.translate(xTranslate, yTranslate);
    for (const LINE of this.lines) {
      LINE.getOrigin().setPositionX(LINE.getOrigin().getPositionX() + xTranslate);
      LINE.getOrigin().setPositionY(LINE.getOrigin().getPositionY() + yTranslate);

      LINE.translate(xTranslate, yTranslate);
    }

    this.generate();
    this.resetExtremums();

  }

  rotateAboutPoint(degree: number, center: PointService): void{
    for (const LINE of this.lines) {
      LINE.rotateAboutPoint(degree, center);
    }
    this.center.rotateAboutPoint(degree, center);
    this.setCircle(this.radius, this.center);
    this.generate();
    this.resetExtremums();
  }
}
