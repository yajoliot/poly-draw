import { ElementRef, Injectable } from '@angular/core';
import { ShapesContainerService } from '../shapesContainer/shapesContainer.service';

const MAX = 255;
const CSS_RGB_MAX = 'rgb(255,255,255,1)';
const CSS_RGB_MIN = 'rgb(0,0,0,1)';
@Injectable({
  providedIn: 'root'
})
export class ConfigEnvService {

  drawingInProgress: boolean;
  backgroundColor: string;
  height: number;
  width: number;
  blockKeyEvents: boolean;
  drawingElement: ElementRef;
  drawingSaved: boolean;
  continuDrawingClicked: boolean;
  openFromServerClicked: boolean;
  serverInstructions: string[];

  constructor(private shapeContainer: ShapesContainerService) {
    this.drawingInProgress = false;
    this.blockKeyEvents = false;
    this.drawingSaved = false;
    this.drawingSaved = true;
    this.continuDrawingClicked = false;
    this.openFromServerClicked = false;
    this.serverInstructions = [];
   }

  getBackgroundColor(): string {
    return this.backgroundColor;
  }

  overwriteShapes(): void {
    this.shapeContainer.emptyShapes();
  }

  saveDrawingBackground(r: number, g: number, b: number, o: number, height: number, width: number): void {
    this.backgroundColor = this.rgbToStringColor(r, g, b, o);
    this.height = height;
    this.width = width;
  }

  changeBackgroundColor(value: string): void {
    this.backgroundColor = value;
    this.drawingElement.nativeElement.style.backgroundColor = value;
  }

  rgbToStringColor(red: number, green: number, blue: number, opacity: number): string {
    if (red > MAX || green > MAX || blue > MAX || opacity > MAX) {
      return CSS_RGB_MAX;
    } else if (red < 0 || green < 0 || blue < 0 || opacity < 0) {
      return CSS_RGB_MIN;
    } else {
      return `rgb(${red},${green},${blue},${opacity / MAX})`;
    }
  }

  loadFromServer(shapes: any): void {
    for (let i = 1; i <= this.serverInstructions.length - 1; i++) {
      shapes.nativeElement.innerHTML += this.serverInstructions[i];
    }
  }
}
