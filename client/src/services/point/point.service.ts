import { Injectable } from '@angular/core';

const pi = 180;
const twoPi = 360;
@Injectable({
  providedIn: 'root'
})
export class PointService {

   x: number; // position en x
   y: number; // position en y

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getPositionX(): number {
    return this.x;
  }

  getPositionY(): number {
    return this.y;
  }

  setPositionX(position: number): void {
    this.x = position;
  }

  setPositionY(position: number): void {
    this.y = position;
  }
  clone(): any {
    const cloneObj = new (<any>this.constructor)(); // line fixed
    for (const attribut in this) {
      cloneObj[attribut] = this[attribut];
    }
    return cloneObj;
}
  rotateAboutPoint(degree: number, point: PointService): void{
    const DISPLACEMENT = new PointService(this.x - point.getPositionX(), -(this.y - point.getPositionY()));

    const LENGTHDISPLACEMENT = Math.sqrt((Math.pow(DISPLACEMENT.getPositionX(), 2) + Math.pow(DISPLACEMENT.getPositionY(), 2)));

    const ANGLE = Math.atan2(DISPLACEMENT.getPositionY(), DISPLACEMENT.getPositionX()) * pi / Math.PI;

    let NEWANGLE = ANGLE + degree;
    if (NEWANGLE < 1) {
      NEWANGLE = twoPi + NEWANGLE;
    }
    const NEWYDISPLACEMENT = -((LENGTHDISPLACEMENT * Math.sin(NEWANGLE * Math.PI / pi)));
    const NEWXDISPLACEMENT = (LENGTHDISPLACEMENT * Math.cos(NEWANGLE * Math.PI / pi));
    this.x = point.getPositionX() + NEWXDISPLACEMENT;
    this.y = point.getPositionY() +  NEWYDISPLACEMENT;
  }
}
