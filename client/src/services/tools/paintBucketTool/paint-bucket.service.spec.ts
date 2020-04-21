import { inject, TestBed } from '@angular/core/testing';
import { CustomShape } from 'src/models/shapes/customShape/custom-shape';
import { PointService } from 'src/services/point/point.service';
import { PaintBucketService } from './paint-bucket.service';

describe('PaintBucketService', () => {
  beforeEach(() => TestBed.configureTestingModule({
  }));

  it('should be created', () => {
    const service: PaintBucketService = TestBed.get(PaintBucketService);
    expect(service).toBeTruthy();
  });

  it('on mouseEnter should call init canvas on service ', () => {
    const service: PaintBucketService = TestBed.get(PaintBucketService);

    spyOn(service, 'initCanvas');
    service.onMouseEnter();
    expect(service.initCanvas).toHaveBeenCalled();
  });

  it('setDrawing should set the drawing data ', () => {
    const service: PaintBucketService = TestBed.get(PaintBucketService);

    const data = 'data';
    service.setDrawing(data);
    expect(service.drawing).toBe(data);
  });

  it('initCanvas should create the canvas from the data ', () => {
    const service: PaintBucketService = TestBed.get(PaintBucketService);

    document.createElement('div');
    service.drawing = {nativeElement: document.getElementsByTagName('div')[0]};
    service.initCanvas();
    expect(service.ctx.getImageData.length).toEqual(4);
  });

  it('on mouseClick should initializeColor ', () => {
    const service: PaintBucketService = TestBed.get(PaintBucketService);

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 100});
    service.drawing = {nativeElement: document.getElementsByTagName('div')[0]};
    service.initCanvas();
    setTimeout(() => service.click(mockMouseEvent), 2000);

  });

  it('isAvailable should return false if out of bound ', inject([PaintBucketService], (service: PaintBucketService) => {
    const mockPoint = new PointService(-1,-1);
    const availlable = service.isAvailable(mockPoint, 0, 0);
    expect(availlable).toBe(false);

  }));

  it('isAvailable should return true if in bound  and has same color', inject([PaintBucketService], (service: PaintBucketService) => {
    const mockPoint = new PointService(0,0);
    service.startR = 0;
    service.startG = 0;
    service.startB = 0;
    service['configEnv'].width = 10;
    service['configEnv'].height = 10;
    service.image = new Uint8ClampedArray(3);
    service.image[0] = 0;
    service.image[1] = 0;
    service.image[2] = 0;
    const availlable = service.isAvailable(mockPoint, 0, 0);
    expect(availlable).toBe(true);

  }));

  it('initializeColor should set the starting rgb to comparing color', inject([PaintBucketService], (service: PaintBucketService) => {

    service.comparingColor = new Uint8ClampedArray(3);
    service.comparingColor[0] = 0;
    service.comparingColor[1] = 0;
    service.comparingColor[2] = 0;
    service.initializeColor();
    expect(service.startR).toBe(0);
    expect(service.startG).toBe(0);
    expect(service.startB).toBe(0);

  }));
  it('compareColor should return true if same color', inject([PaintBucketService], (service: PaintBucketService) => {

    service.comparingColor = new Uint8ClampedArray(3);
    service.image = new Uint8ClampedArray(3);
    service.image[0] = 0;
    service.image[1] = 0;
    service.image[2] = 0;
    service.comparingColor[0] = 0;
    service.comparingColor[1] = 0;
    service.comparingColor[2] = 0;
    service.initializeColor();
    const comparaison = service.compareColor(0);
    expect(comparaison).toBe(true);

  }));

  it('setColor should set the color as visited', inject([PaintBucketService], (service: PaintBucketService) => {

    service.comparingColor = new Uint8ClampedArray(3);
    service.image = new Uint8ClampedArray(3);
    service.image[0] = 1;
    service.image[1] = 0;
    service.image[2] = 0;
    service.setColor(new PointService(0, 0));
    expect( service.image[0]).toBe(1);
    expect( service.image[1]).toBe(0);
    expect( service.image[2]).toBe(0);

  }));

  it('setTolerance should set the tolerance of the bucket', inject([PaintBucketService], (service: PaintBucketService) => {
    service.tolerance = 0;
    service.setTolerance(1);
    expect(service.tolerance).toBe(1);
  }));

  it('on mouseLeave should create a new shape', inject([PaintBucketService], (service: PaintBucketService) => {
    const mockMouseEvent = new MouseEvent('over', {clientX: 100, clientY: 100});
    service.onMouseLeave(mockMouseEvent);
    expect(service.shapeInProgress).toBeDefined();
  }));

  it('on fillColor should add the first pixel if none are availlable', inject([PaintBucketService], (service: PaintBucketService) => {
    const mockMouseEvent = new MouseEvent('over', {clientX: 0, clientY: 0});
    service.shapeInProgress = new CustomShape(100, '#000000', '#000000');
    service.shapeInProgress.coloredDots = [new PointService(1, 1)];
    service.drawing = {nativeElement: document.getElementsByTagName('div')[0]};
    service.initCanvas();
    service.comparingColor = new Uint8ClampedArray(3);
    service.image = new Uint8ClampedArray(3);
    service.ctx.fillStyle = '#FF0000';
    service.startR = 255;
    service.startB = 0;
    service.startG = 0;
    service.ctx.fillRect(0, 0, 1, 1);
    spyOn(service.shapeInProgress, 'addPixel');
    spyOn(service, 'setColor');
    service.fillColor(mockMouseEvent);
    setTimeout(() => service.fillColor(mockMouseEvent), 2000);
    expect(service.shapeInProgress.addPixel).toHaveBeenCalledTimes(2);
    expect(service.setColor).toHaveBeenCalledTimes(0);
  }));

  it('on fillColor should add the first pixel if none are availlable', inject([PaintBucketService], (service: PaintBucketService) => {
    const mockMouseEvent = new MouseEvent('over', {clientX: 0, clientY: 0});
    service.shapeInProgress = new CustomShape(100, '#000000', '#000000');
    service.shapeInProgress.coloredDots = [new PointService(1, 1)];
    service.drawing = {nativeElement: document.getElementsByTagName('div')[0]};
    setTimeout(() => service.initCanvas(), 2000);
    service.comparingColor = new Uint8ClampedArray(3);
    service.image = new Uint8ClampedArray(4);
    service.ctx.fillStyle = '#000000';
    service.startR = 0;
    service.startB = 0;
    service.startG = 0;
    service.ctx.fillRect(1, 1, 1, 1);
    spyOn(service.shapeInProgress, 'addPixel');
    spyOn(service, 'setColor');
    service.fillColor(mockMouseEvent);
    setTimeout(() => service.fillColor(mockMouseEvent), 2000);
  }));

  
});
