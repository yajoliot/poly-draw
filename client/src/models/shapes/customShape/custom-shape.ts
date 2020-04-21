import { Injectable } from '@angular/core';
import { PointService } from 'src/services/point/point.service';
import { SvgWorkerService } from 'src/services/svgWorker/svg-worker.service';
import { Shape } from '../shape/shape';
import { LineShape } from '../line/line';
import { Rectangle } from '../rectangle/rectangle';

const MAXIMUM = 10000;
@Injectable({
  providedIn: 'root'
})
export class CustomShape extends Shape {
  svgWorker: SvgWorkerService;
  coloredDots: PointService[];
  center: PointService;
  lines: LineShape[];
  constructor(width: number, mainColor: string, secondaryColor: string) {
    super(width, mainColor, secondaryColor);
    this.lines = [];
    this.coloredDots =  [];
  }

  initialize(): void {
    this.instruction = ' ';
    this.svgWorker = new SvgWorkerService();
    this.coloredDots =  [];
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

  colorArray(): void {
    this.instruction = ' ';
    this.lines = [];
    for (let i = 0; i < this.coloredDots.length - 1; i = i + 2) {
    const line = new LineShape(1, '', '');
    line.generateRelativeLine(this.coloredDots[i ], this.coloredDots[i + 1]);
    this.lines.push(line);
    this.instruction += this.svgWorker.move(this.coloredDots[i ]);
    this.instruction += this.svgWorker.line(this.coloredDots[i + 1]);
    }
    this.findExtremums();
  }
  addPixel(pixel: PointService): void {
    this.coloredDots.push(new PointService( pixel.x, pixel.y));
    this.findExtremums();
    this.setCenter();
  }
  translate(xTranslation: number, yTranslation: number): void {
    // To be surdefined down the tree
    for (const pixel of this.coloredDots) {
      pixel.setPositionX(pixel.x + xTranslation);
      pixel.setPositionY(pixel.y + yTranslation);
    }
    this.findExtremums();
    this.colorArray();
  }

  rotate(degree: number): void {
    this.setCenter();
    for (const pixel of this.coloredDots) {
      pixel.rotateAboutPoint(degree, this.center);
    }

    this.findExtremums();
    this.colorArray();
  }

  rotateAboutPoint(degree: number, point: PointService): void {
    for (const pixel of this.coloredDots) {
      pixel.rotateAboutPoint(degree, point);
    }

    this.findExtremums();
    this.colorArray();
  }

  setCenter(): void {

    this.findExtremums();
    const deltaX = this.maximum.getPositionX() - this.minimum.getPositionX();
    const deltaY = this.maximum.getPositionY() - this.minimum.getPositionY();
    this.center = new PointService(this.minimum.getPositionX() + deltaX / 2, this.minimum.getPositionY() + deltaY / 2);
  }

  findExtremums(): void {
    this.minimum = new PointService(MAXIMUM, MAXIMUM);
    this.maximum = new PointService(0, 0);

    for (const pixel of this.coloredDots) {
      if (pixel.getPositionX() > this.maximum.getPositionX()) {
        this.maximum.setPositionX(pixel.getPositionX());
      }
      if (pixel.getPositionY() > this.maximum.getPositionY()) {
        this.maximum.setPositionY(pixel.getPositionY());
      }
      if (pixel.getPositionY() < this.minimum.getPositionY()) {
        this.minimum.setPositionY(pixel.getPositionY());
      }
      if (pixel.getPositionX() < this.minimum.getPositionX()) {
        this.minimum.setPositionX(pixel.getPositionX());
      }
    }
  }

}
