import { Injectable } from '@angular/core';

const TEN = 10;
const FIVE = 5;
const EIGHT = 8;
const ZERO = 0;

@Injectable({
  providedIn: 'root'
})
export class ToolUtilService {
  // 0: primary, 1: secondary, 2-11: 10 most recent confirmed colors
  colors: string[] = ['rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
                      'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)'];
  private brushType: string;
  strokeSize: number;
  eraserSize: number;
  transparancy: number;
  nbSides: number;
  typeEllipse: string;
  radius: number;
  emission: number;
  tolerance: number;
  constructor() {
    this.brushType = 'Type1';
    this.strokeSize = 1;
    this.eraserSize = TEN;
    this.transparancy = FIVE;
    this.nbSides = EIGHT;
    this.typeEllipse = 'contour';
    this.radius = TEN;
    this.emission = FIVE;
    this.tolerance = ZERO;
  }

  switch(): void {
    const TEMP: string = this.colors[0];
    this.colors[0] = this.colors[1];
    this.colors[1] = TEMP;
  }

  addPrimaryColor(value: string): void {
    this.colors.pop();
    this.colors.unshift(value);
    const TEMP: string = this.colors[2];
    this.colors[2] = this.colors[1];
    this.colors[1] = TEMP;
  }

  addSecondaryColor(value: string): void {
    this.colors.pop();
    this.colors.splice(1, 0, value);
  }

  getPrimaryColor(): string {
    if (typeof this.colors[0] === 'undefined') {
      return 'rgb(0,0,0,1)';
    } else {
      return this.colors[0];
    }
  }

  getSecondaryColor(): string {
    if (typeof this.colors[1] === 'undefined') {
      return 'rgb(0,0,0,1)';
    } else {
      return this.colors[1];
    }
  }

  getPrimaryColorEllipse(): string {
    if (this.typeEllipse === 'contour') {
      return 'none';
    } else {
      return this.colors[0];
    }
  }
  getSecondaryColorEllipse(): string {
    if (this.typeEllipse === 'plein') {
      return 'none';
    } else {
      return this.colors[1];
    }
  }

  getBrushType(): string {
    return this.brushType || 'Type1';
  }

  setBrushType(brushType: string): void {
    this.brushType = brushType || 'Type1';
  }

  getTransparancy(): string {
    return (this.transparancy / TEN).toString();
  }

  setTransparancy(value: number): void {
    value = (value * TEN);
    value = Math.round(value);
    value = (value / TEN);
  }
}
