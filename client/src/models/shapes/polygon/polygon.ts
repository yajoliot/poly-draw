import { Injectable } from '@angular/core';
import { PointService } from 'src/services/point/point.service';
import { LineShape } from '../line/line';
import { Rectangle } from '../rectangle/rectangle';
import { Shape } from '../shape/shape';
const RANDOMHIGHNUMBER = 16777215;
const ONESIX = 16;
const MAXVALUE = 1000000;
@Injectable({
  providedIn: 'root'
})
export class Polygon extends Shape {
  private vertices: PointService[];
  private lines: LineShape[];
  initialPoint: PointService;
  center: PointService;
  sides: number;
  private lastPoint: PointService;
  constructor(width: number, mainColor: string, secondaryColor: string) {
    super(width, secondaryColor, mainColor);
  }

  initialize(point: PointService): void {
    this.center = point;
    this.instruction = '';
    this.vertices = [];
    this.lines = [];
    this.initialPoint = point;
    this.initiatePolygonVertices(point);
  }

  initiatePolygonVertices(point: PointService): void {
    this.calculateCenter(point);
    const radius = this.getRadius();
    const angle = 2 * Math.PI / this.sides;
    for (let i = 0; i < this.sides; i++) {
      const x = this.center.getPositionX() + radius * Math.sin(i * angle);
      const y = this.center.getPositionY() + radius * -Math.cos(i * angle);
      this.vertices[i] = new PointService(x, y);
    }
  }

  setVertices(vertices: PointService[]): void {
    this.vertices = vertices;
  }

  getVertices(): PointService[] {
    return this.vertices;
  }

  setLines(lines: LineShape[]): void {
    this.lines = lines;
  }

  getLines(): LineShape[] {
    return this.lines;
  }

  generatePolygon(point: PointService): void {
    this.lastPoint = point;
    this.instruction = '';
    this.lines = [];

    const INITIALLINE = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());

    INITIALLINE.generateLine(this.vertices[0], this.vertices[1]);
    this.lines.push(INITIALLINE);
    this.instruction += INITIALLINE.instruction;

    this.initiatePolygonVertices(point);

    for (let i = 1; i < this.sides; i++) {

      const INTERMEDIATELINE = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
      INTERMEDIATELINE.generateRelativeLine(this.vertices[i % this.sides], this.vertices[(i + 1) % this.sides]);
      this.instruction += INTERMEDIATELINE.instruction;
      this.lines.push(INTERMEDIATELINE);
    }
  }

  calculateCenter(point: PointService): void {

    const dx = (point.getPositionX() - this.initialPoint.getPositionX()) / 2;
    const dy = (point.getPositionY() - this.initialPoint.getPositionY()) / 2;

    // deux positifs
    if (dx && dy > 0) {

      if (dx < dy) {
        this.center = new PointService(this.initialPoint.getPositionX() + dx, this.initialPoint.getPositionY() + dx);
      } else {
        this.center = new PointService(this.initialPoint.getPositionX() + dy, this.initialPoint.getPositionY() + dy);
      }
    }
    // deux negatifs
    if (dx && dy < 0) {

      if (Math.abs(dx) < Math.abs(dy)) {
        this.center = new PointService(this.initialPoint.getPositionX() + dx, this.initialPoint.getPositionY() + dx);
      } else {
        this.center = new PointService(this.initialPoint.getPositionX() + dy, this.initialPoint.getPositionY() + dy);
      }
    }
    if (dx > 0 && dy < 0) {

      if (dx < Math.abs(dy)) {
        this.center = new PointService(this.initialPoint.getPositionX() + dx, this.initialPoint.getPositionY() - dx);
      } else {
        this.center = new PointService(this.initialPoint.getPositionX() - dy, this.initialPoint.getPositionY() + dy);
      }
    }
    if (dx < 0 && dy > 0) {
      if (Math.abs(dx) < dy) {
        this.center = new PointService(this.initialPoint.getPositionX() + dx, this.initialPoint.getPositionY() - dx);
      } else {
        this.center = new PointService(this.initialPoint.getPositionX() - dy, this.initialPoint.getPositionY() + dy);
      }
    }
  }
  getRadius(): number {
    let r = 0;
    const dx = this.initialPoint.getPositionX() - this.center.getPositionX();
    const dy = this.initialPoint.getPositionY() - this.center.getPositionY();
    if (dx < dy) {
      r = dx;
    } else {
      r = dy;
    }
    return r;
  }

  isSelected(pointClicked: PointService): boolean {
    let previousSide = 'None';
    const NUMBEROFVERTICES = this.vertices.length;

    for (let n = 0; n < NUMBEROFVERTICES; n++) {
      const VERTICEONE = this.vertices[n];
      const VERTICETWO = this.vertices[(n + 1) % NUMBEROFVERTICES];

      const VERTICEVECTOR = this.verticeSubstition(VERTICETWO, VERTICEONE);
      const POINTVECTOR = this.verticeSubstition(pointClicked, VERTICEONE);

      const CURRENTSIDE = this.getSide(VERTICEVECTOR, POINTVECTOR);

      if (CURRENTSIDE === 'None') {

        return false;
      } else if (previousSide === 'None') {

        previousSide = CURRENTSIDE;
      } else if (previousSide !== CURRENTSIDE) {

        return false;
      }

    }

    this.setSecondaryColor(('#' + Math.floor(Math.random() * RANDOMHIGHNUMBER).toString(ONESIX)));
    this.setFill();
    return true;
  }

  private verticeSubstition(pointOne: PointService, pointTwo: PointService): PointService {
    return new PointService(pointOne.getPositionX() - pointTwo.getPositionX(), -(pointOne.getPositionY() - pointTwo.getPositionY()));
  }

  private getSide(verticeOne: PointService, verticeTwo: PointService): string {
    const SIGN = this.signOfCosine(verticeOne, verticeTwo);

    if (SIGN < 0) {
      return 'Left';
    } else if (SIGN > 0) {
      return 'Right';
    } else {
      return 'None';
    }
  }

  private signOfCosine(verticeOne: PointService, verticeTwo: PointService): number {
    return (verticeOne.getPositionX() * verticeTwo.getPositionY() - verticeOne.getPositionY() * verticeTwo.getPositionX());
  }

  findExtremums(): void {
    this.minimum = new PointService(MAXVALUE, MAXVALUE);
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

  detectRectangleIntersection(rectangleToCheck: Rectangle): boolean {
    let i = 0;
    for (; i < rectangleToCheck.lines.length; i++) {
      let j = 0;
      const SELECTLINE = rectangleToCheck.lines[i];
      for (; j < this.lines.length; j++) {
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

  resetExtremums(): void {
    this.minimum = new PointService(MAXVALUE, MAXVALUE);
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

    for (const LINE of this.lines) {
      if (LINE.getDestination().getPositionX() < this.getMinimum().getPositionX()) {
        this.setMinimum(new PointService(LINE.getDestination().getPositionX(), this.getMinimum().getPositionY()));
      } else if (LINE.getDestination().getPositionY() < this.getMinimum().getPositionY()) {
        this.setMinimum(new PointService(this.getMinimum().getPositionX(), LINE.getDestination().getPositionY()));
      } else if (LINE.getOrigin().getPositionX() > this.getMaximum().getPositionX()) {
        this.setMaximum(new PointService(LINE.getDestination().getPositionX(), this.getMaximum().getPositionY()));
      } else if (LINE.getDestination().getPositionY() > this.getMaximum().getPositionY()) {
        this.setMaximum(new PointService(this.getMaximum().getPositionX(), LINE.getDestination().getPositionY()));
      }
    }

  }

  translate(xTranslation: number, yTranslation: number): void {

    this.initialPoint.setPositionX(this.initialPoint.getPositionX() + xTranslation);
    this.initialPoint.setPositionY(this.initialPoint.getPositionY() + yTranslation);

    this.lastPoint.setPositionX(this.lastPoint.getPositionX() + xTranslation);
    this.lastPoint.setPositionY(this.lastPoint.getPositionY() + yTranslation);

    this.center.setPositionX(this.center.getPositionX() + xTranslation);
    this.center.setPositionY(this.center.getPositionY() + yTranslation);

    this.generatePolygon(this.lastPoint);
    this.resetExtremums();
  }

  setLastPoint(point: PointService): void {
    this.lastPoint = point;
  }

  public clone(): any {
    const cloneObj = new (<any>this.constructor)();
    for (const attribut in this) {
        cloneObj[attribut] = this[attribut];
    }
    return cloneObj;
}

rotate(degree: number): void {
  this.calculateCenter(this.lastPoint);

  for (const VERTICE of this.vertices) {
    VERTICE.rotateAboutPoint(degree, this.center);
  }

  

  this.instruction = '';
  this.lines = [];

  const INITIALLINE = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
  INITIALLINE.generateLine(this.vertices[0], this.vertices[1]);
  this.lines.push(INITIALLINE);
  this.instruction += INITIALLINE.instruction;

  for (let i = 1; i < this.sides; i++) {

    const INTERMEDIATELINE = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
    INTERMEDIATELINE.generateRelativeLine(this.vertices[i % this.sides], this.vertices[(i + 1) % this.sides]);
    this.instruction += INTERMEDIATELINE.instruction;
    this.lines.push(INTERMEDIATELINE);

  }

  this.findExtremums();

  // this.generatePolygon(this.lastPoint);
}

rotateAboutPoint(degree: number, point: PointService): void{
  this.calculateCenter(this.lastPoint);
  for (const VERTICE of this.vertices) {
    VERTICE.rotateAboutPoint(degree, point);
  }

  

  this.instruction = '';
  this.lines = [];

  const INITIALLINE = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
  INITIALLINE.generateLine(this.vertices[0], this.vertices[1]);
  this.lines.push(INITIALLINE);
  this.instruction += INITIALLINE.instruction;

  for (let i = 1; i < this.sides; i++) {

    const INTERMEDIATELINE = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
    INTERMEDIATELINE.generateRelativeLine(this.vertices[i % this.sides], this.vertices[(i + 1) % this.sides]);
    this.instruction += INTERMEDIATELINE.instruction;
    this.lines.push(INTERMEDIATELINE);

  }

  this.findExtremums();

}

}
