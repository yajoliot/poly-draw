import { Injectable } from '@angular/core';
import { PointService } from 'src/services/point/point.service';
import { SvgWorkerService } from 'src/services/svgWorker/svg-worker.service';
import { Rectangle } from '../rectangle/rectangle';
import { Shape } from '../shape/shape';
import { SprayCircle } from '../sprayCircle/spray-circle';
import { LineShape } from '../line/line';

const DEFAULT_RADIUS = 10;
const MAXVALUE = 1000000;
@Injectable({
  providedIn: 'root'
})
export class SprayShape extends Shape {
  circles: SprayCircle[];
  radius: number;
  oldsize: number;
  NUMDOTS: number;
  svgWorker: SvgWorkerService;

  center: PointService;

  constructor(width: number, mainColor: string, secondaryColor: string) {
    super(width, mainColor, secondaryColor);
    this.circles = [];
  }

  initialize(): void {
    this.instruction = '';
    this.oldsize = 0;
    this.radius = DEFAULT_RADIUS;
    this.svgWorker = new SvgWorkerService();
    this.circles = [];
  }

  createPattern(point: PointService): void {
    const CIRCLE = new SprayCircle(1, this.getMainColor(), this.getSecondaryColor());
    for (let i = 0 ; i < this.NUMDOTS ; i++) {
      const r = this.radius * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const X = Math.floor(point.getPositionX() + r * Math.cos(theta));
      const Y = Math.floor(point.getPositionY() + r * Math.sin(theta));
      const POINT = new PointService(X, Y);
      CIRCLE.initialize(POINT);
      CIRCLE.addLine(POINT);
      this.instruction += CIRCLE.instruction;
    }
    this.circles.push(CIRCLE);
  }

  generateSpray(point: PointService): void {
    this.oldsize = this.circles.length;
    this.createPattern(point);
  }

  detectRectangleIntersection(rectangleToCheck: Rectangle): boolean {
    for (const CIRCLE of this.circles) {
      if (CIRCLE.detectRectangleIntersection(rectangleToCheck)) {
          for (const LINE of CIRCLE.getLines()) {
          LINE.findExtremums();
          const LINEORIGX = LINE.getMinimum().getPositionX();
          const LINEORIGY = LINE.getMaximum().getPositionY();
          const DETECTIONAPPROXIMATION = new LineShape(1, '', '');
          DETECTIONAPPROXIMATION.setOrigin(new PointService((LINEORIGX + 1), (LINEORIGY + 1)));
          DETECTIONAPPROXIMATION.setDestination(LINE.getDestination());
          DETECTIONAPPROXIMATION.findExtremums();
          if (DETECTIONAPPROXIMATION.detectRectangleIntersection(rectangleToCheck)) {
            return true;
          }
        }
          return true;
      }
    }
    return false;
  }
  findExtremums(): void {
    for (const CIRCLE of this.circles) {
      for (const LINE of CIRCLE.getLines()) {
        this.updateExtremums(LINE.getOrigin());
        this.updateExtremums(LINE.getDestination());
      }
    }
  }

  generate(): void {
    this.instruction = '';
    for (const CIRCLE of this.circles) {
      this.instruction += CIRCLE.instruction;
    }
  }

  resetExtremums(): void {

    this.minimum = new PointService(MAXVALUE, MAXVALUE);
    this.maximum = new PointService(0, 0);

    for (const CIRCLE of this.circles) {

      if (CIRCLE.getMaximum().getPositionX() > this.maximum.getPositionX()) {
        this.setMaximum(new PointService(CIRCLE.getMaximum().getPositionX(), this.getMaximum().getPositionY()));
      }
      if (CIRCLE.getMaximum().getPositionY() > this.maximum.getPositionY()) {
        this.setMaximum(new PointService(this.maximum.getPositionX(), CIRCLE.getMaximum().getPositionY()));
      }
      if (CIRCLE.getMinimum().getPositionX() < this.minimum.getPositionX()) {
        this.setMinimum(new PointService(CIRCLE.getMinimum().getPositionX(), this.minimum.getPositionY()));
      }
      if (CIRCLE.getMinimum().getPositionY() < this.minimum.getPositionY()) {
        this.setMinimum(new PointService(this.minimum.getPositionX(), CIRCLE.getMinimum().getPositionY()));
      }
    }

  }

  setCenter(): void{
    this.findExtremums();

    const centerX = this.minimum.getPositionX() + (this.maximum.getPositionX() - this.minimum.getPositionX())/2;
    const centerY = this.minimum.getPositionY() + (this.maximum.getPositionY() - this.minimum.getPositionY())/2;

    this.center = new PointService(centerX, centerY);

  }

  translate(xTranslate: number, yTranslate: number): void {
    for (const CIRCLE of this.circles) {
      CIRCLE.translate(xTranslate, yTranslate);
    }
    this.generate();
    this.resetExtremums();
    this.setCenter();
  }

  rotate(degree: number): void {
    for (const SPRAYCIRCLE of this.circles) {
      SPRAYCIRCLE.rotateAboutPoint(degree, this.center);
    }
    this.generate();
    this.resetExtremums();
  }

  rotateAboutPoint(degree: number, point: PointService): void {
    for (const SPRAYCIRCLE of this.circles) {
      SPRAYCIRCLE.rotateAboutPoint(degree, point);
    }
    this.generate();
    this.resetExtremums();
  }
}
