import { Shape } from 'src/models/shapes/shape/shape';
import { PointService } from 'src/services/point/point.service';
import { LineShape } from '../line/line';
import { Rectangle } from '../rectangle/rectangle';
const MAX = 1000000;
const LARGE_NUM = 10000;
const TWO = 2;
export class PencilShape extends Shape {
    private lines: LineShape[];
    private lastPoint: PointService;
    center: PointService;
    constructor(width: number, mainColor: string, secondaryColor: string) {
        super(width, mainColor, secondaryColor);
    }

    initialize(point: PointService): void {
      this.lines = new Array<LineShape>();
      this.lastPoint = point;
      this.minimum = new PointService(MAX, MAX);
      this.maximum = new PointService(0, 0);
      this.instruction = ' ';
    }

    drawLine(point: PointService): void {
      const LINE = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
      LINE.generateLine(this.lastPoint, point);
      this.lines.push(LINE);
      this.instruction += LINE.instruction;
      this.lastPoint = point;
      this.updateExtremums(this.lastPoint);
    }

    drawRelativeLine(point: PointService): void {
      const LINE = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
      LINE.generateRelativeLine(this.lastPoint, point);
      this.lines.push(LINE);
      this.instruction += LINE.instruction;
      this.lastPoint = point;
      this.updateExtremums(this.lastPoint);
    }

    generate(): void {
      this.instruction = '';
      for (const LINE of this.lines) {
        LINE.generate();
        this.instruction += LINE.instruction;
      }
    }

    addLine(line: LineShape): void {
      this.lines.push(line);
      this.lastPoint = line.getDestination();
      this.updateExtremums(this.lastPoint);
      this.generate();
    }

    getLastPoint(): PointService {
      return this.lastPoint;
    }

    removeLine(): void {
      this.lines.pop();
      if (this.isExtremum(this.lastPoint)) {
        this.findExtremums();
      }
      this.lastPoint = this.lines[this.lines.length - 1].getDestination();
      this.generate();
    }

    getLastLine(): LineShape {
      return this.lines[this.lines.length - 1];
    }

    getNumberOfLines(): number {
      return this.lines.length;
    }

    setL(line: LineShape): void {
      this.lines = new Array<LineShape>();
      this.lines.push(line);
    }

    setLines(lines: LineShape[]): void {
      this.lines = lines;
      let firstLine = true;

      let lastDestination: PointService;
      lastDestination = new PointService(0, 0);
      for (const LINE of lines) {
        if (firstLine) {
          lastDestination = LINE.getDestination();
          firstLine = false;
        } else {
          LINE.setOrigin(lastDestination);
          lastDestination = LINE.getDestination();
        }
      }

    }

    getLines(): LineShape[] {
      return this.lines;
    }

    detectRectangleIntersection(rectangleToCheck: Rectangle): boolean {
      let i = 0;
      for ( ; i < rectangleToCheck.lines.length; i++) {
          let j = 0;
          const SELECTLINE = rectangleToCheck.lines[i];
          for ( ; j < this.lines.length; j++) {
              const LINE = this.lines[j];
              if (SELECTLINE.detectLineIntersection(LINE)) {
                  return true;
              }
          }
      }
      return false;
    }

    updateExtremums(lastPoint: PointService): void {
      if (lastPoint.getPositionX() > this.maximum.getPositionX()) {
        this.maximum.setPositionX(lastPoint.getPositionX());
      }
      if (lastPoint.getPositionY() > this.maximum.getPositionY()) {
        this.maximum.setPositionY(lastPoint.getPositionY());
      }
      if (lastPoint.getPositionX() < this.minimum.getPositionX()) {
        this.minimum.setPositionX(lastPoint.getPositionX());
      }
      if (lastPoint.getPositionY() < this.minimum.getPositionY()) {
        this.minimum.setPositionY(lastPoint.getPositionY());
      }
    }

    isExtremum(pointToCheck: PointService): boolean {
      return pointToCheck.getPositionX() === this.minimum.getPositionX() ||
             pointToCheck.getPositionX() === this.maximum.getPositionX() ||
             pointToCheck.getPositionY() === this.minimum.getPositionY() ||
             pointToCheck.getPositionY() === this.maximum.getPositionY();
    }

    findExtremums(): void {

      this.minimum = new PointService(LARGE_NUM, LARGE_NUM);
      this.maximum = new PointService(0, 0);

      for (const LINE of this.lines) {

          LINE.findExtremums();

          if (LINE.getMinimum().getPositionY() < this.minimum.getPositionY()) {
              this.minimum.setPositionY(LINE.getMinimum().getPositionY());
          }
          if (LINE.getMinimum().getPositionX() < this.minimum.getPositionX()) {
              this.minimum.setPositionX(LINE.getMinimum().getPositionX());
          }
          if (LINE.getMaximum().getPositionY() > this.maximum.getPositionY()) {
              this.maximum.setPositionY(LINE.getMaximum().getPositionY());
          }
          if (LINE.getMaximum().getPositionX() > this.maximum.getPositionX()) {
              this.maximum.setPositionX(LINE.getMaximum().getPositionX());
          }
      }
    }

    resetExtremums(): void {

      this.minimum = new PointService(MAX, MAX);
      this.maximum = new PointService(0, 0);

      for (const LINE of this.lines) {
        if (LINE.getOrigin().getPositionX() < this.getMinimum().getPositionX()) {
          this.setMinimum(new PointService(LINE.getOrigin().getPositionX(), this.getMinimum().getPositionY()));
        } else if (LINE.getOrigin().getPositionY() < this.getMinimum().getPositionY()) {
          this.setMinimum(new PointService(this.getMinimum().getPositionX(), LINE.getOrigin().getPositionY()));
        } else if (LINE.getOrigin().getPositionX() > this.getMaximum().getPositionX()) {
          this.setMaximum(new PointService(LINE.getOrigin().getPositionX(), this.getMaximum().getPositionY()));
        } else if (LINE.getOrigin().getPositionY() > this.getMaximum().getPositionY()) {
          this.setMaximum(new PointService(this.getMaximum().getPositionX(), LINE.getOrigin().getPositionY()));
        }
      }
  }

    translate(xTranslation: number, yTranslation: number): void {

      for (const line of this.lines) {
        line.getDestination().setPositionX(line.getDestination().getPositionX() + xTranslation);
        line.getDestination().setPositionY(line.getDestination().getPositionY() + yTranslation);
      }

      this.resetExtremums();

      this.generate();

      this.setCenter();
    }

    setCenter(): void {
      this.findExtremums();

      const centerX = this.minimum.getPositionX() + (this.maximum.getPositionX() - this.minimum.getPositionX()) / TWO;
      const centerY = this.minimum.getPositionY() + (this.maximum.getPositionY() - this.minimum.getPositionY()) / TWO;

      this.center = new PointService(centerX, centerY);
    }

    rotate(degree: number): void {

      for (const line of this.lines) {
        line.getDestination().rotateAboutPoint(degree, this.center);
      }
      this.generate();
      this.setCenter();
    }

    rotateAboutPoint(degree: number, point: PointService){
      //this.lines[0].getOrigin().rotateAboutPoint(degree, this.center);
      
      for (const line of this.lines) {
        line.getDestination().rotateAboutPoint(degree, point);
      }
      this.generate();
      this.setCenter();
    }

}
