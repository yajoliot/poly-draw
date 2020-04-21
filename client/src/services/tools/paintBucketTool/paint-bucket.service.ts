
import { Injectable } from '@angular/core';
import { CustomShape } from 'src/models/shapes/customShape/custom-shape';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { PointService } from 'src/services/point/point.service';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { ToolUtilService } from 'src/services/toolUtil/toolUtil.service';
import { ToolService } from '../tool/tool.service';

const SIZE = 2.5;
const PIXELWIDTH = 4;
const SETTINGRB = 3;
@Injectable({
  providedIn: 'root'
})

export class PaintBucketService extends ToolService {
  shapeInProgress: CustomShape;
  tolerance: number;
  image: Uint8ClampedArray;
  ctx: CanvasRenderingContext2D;
  comparingColor: Uint8ClampedArray;
  startR: number;
  startG: number;
  startB: number;
  pixelQueue: PointService[];
  newImg: HTMLImageElement;
  canvas: HTMLCanvasElement;
  drawing: any;

  constructor(sharedShapes: ShapesContainerService, private toolUtil: ToolUtilService, private configEnv: ConfigEnvService) {
    super(sharedShapes);
    this.tolerance = this.toolUtil.tolerance;
    this.pixelQueue = [];
  }

  onMouseEnter(): void {
    this.initCanvas();
  }
  click(event: MouseEvent): void {

    this.comparingColor = this.ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
    this.image = this.ctx.getImageData(0, 0, this.configEnv.width, this.configEnv.height).data; // all the data
    this.initializeColor();
    this.shapeInProgress = new CustomShape(SIZE, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());
    this.shapeInProgress.initialize();
    this.fillColor(event);
    this.shapeInProgress.colorArray();
    this.shapeContainer.executeShapeCommand(this.shapeInProgress);
  }

  setDrawing(currentDrawing: any): void {
    this.drawing = currentDrawing;
  }

  initCanvas(): void {

    this.canvas = document.createElement('canvas');
    this.newImg = document.createElement('img');
    this.newImg.width = this.configEnv.width;
    this.newImg.height = this.configEnv.height;
    const xml = new XMLSerializer().serializeToString(this.drawing.nativeElement);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const img64 = b64Start + svg64;
    this.newImg.src = img64;
    this.canvas.height = this.configEnv.height;
    this.canvas.width = this.configEnv.width;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    const image = this.newImg;
    this.newImg.onload = () => {
            this.ctx.drawImage(image, 0, 0);

    };

  }

  // inspiré de l'algorithm sur http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
  fillColor(init: MouseEvent): void {
    let pixelToFill: PointService[];
    const LEFT = -1;

    pixelToFill = [];
    pixelToFill.push(new PointService(init.offsetX, init.offsetY));

    while (pixelToFill.length > 0) {

      const currentPoint = pixelToFill.pop();
      if (currentPoint != undefined) {
      while (this.isAvailable(currentPoint, 0, LEFT)) {
        // go up until you reach the highest available pixel
        currentPoint.y--;
      }
      const startLine = new PointService( currentPoint.x, currentPoint.y);
      this.shapeInProgress.addPixel(startLine);
      // go down and save points until max
      let reachLeft = false;
      let reachRight = false;
      while (this.isAvailable(currentPoint, 0, 0)) {
        // check if left neighbour is available
        if (this.isAvailable(currentPoint, LEFT, 0)) {
          if (!reachLeft) {
            // save the new left neighbour in queue
            pixelToFill.push(new PointService(currentPoint.x - 1, currentPoint.y));
            reachLeft = true;
          }
        } else {
          reachLeft = reachLeft ? false : reachLeft;
        }
        // Check if right neighbour is available
        if (this.isAvailable(currentPoint, 1, 0)) {
          if (!reachRight) {
            // save the new right neighbour in queue
            pixelToFill.push(new PointService(currentPoint.x + 1, currentPoint.y));
            reachRight = true;
          }
        } else {
          reachRight = reachRight ? false : reachRight;
        }
        // fill the current point
        this.setColor(currentPoint);
        currentPoint.y++;
      }
      const endLine = new PointService( currentPoint.x, currentPoint.y - 1);
      this.shapeInProgress.addPixel(endLine);
    }
    }
  }

  isAvailable(pt: PointService, direcX: number, direcY: number): boolean {
    const newX = pt.x + direcX;
    const newY = pt.y + direcY;
    const pixelPos = (newX + (newY * this.configEnv.width)) * PIXELWIDTH;
    if (newX >= 0 && newX <= this.configEnv.width && newY >= 0 && newY <= this.configEnv.height) {
      // check if the same starting color
      if (this.compareColor(pixelPos)) {

        return true;
      }
    }
    return false;
  }

  initializeColor(): void {

    this.startR = this.comparingColor[0];
    this.startG = this.comparingColor[1];
    this.startB = this.comparingColor[2];
  }

  // formule de wikipedia sur la color difference
    compareColor(pixelPos: number): boolean {

    const r = this.image[pixelPos];
    const g = this.image[pixelPos + 1];
    const b = this.image[pixelPos + 2];
    const DELTAR = this.startR - r;
    const DELTAG = this.startG - g;
    const DELTAB = this.startB - b;
    const vectorR = (r + this.startR) / 2;
    // tslint:disable-next-line: no-magic-numbers
    const DELTA = Math.sqrt( (2 + vectorR / 256 )  * DELTAR * DELTAR + 4 * DELTAG * DELTAG
    // tslint:disable-next-line: no-magic-numbers
    + (2 + ((255 - vectorR) / 256)) * DELTAB * DELTAB );
    // tslint:disable-next-line: no-magic-numbers
    return (DELTA * 100 / 673 <=  this.tolerance  );

  }

  setColor(pt: PointService): void {
    const pixelPos = (pt.getPositionX() + (pt.getPositionY() * this.configEnv.width)) * PIXELWIDTH;
    this.image[pixelPos] = 0;
    this.image[pixelPos + 1] = SETTINGRB;
    this.image[pixelPos + 2] = 0;
  }
  drag(event: MouseEvent): void {
    // do nothing
  }

  release(event: MouseEvent): void {
    // do nothing
  }

  setTolerance(value: number): void {
    this.tolerance = value;

  }

  onMouseLeave(event: MouseEvent): void {
    this.shapeInProgress = new CustomShape(SIZE, this.toolUtil.getPrimaryColor(), this.toolUtil.getSecondaryColor());

  }
}
