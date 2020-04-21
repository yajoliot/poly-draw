import { TestBed } from '@angular/core/testing';
import { PointService } from 'src/services/point/point.service';
import { LineShape } from '../line/line';
import { Rectangle } from '../rectangle/rectangle';
import { CustomShape } from './custom-shape';

describe('CustomShapeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('call to initialize should initiate empty array', () => {
    const custom = new CustomShape(1, '#000000', '#000000');
    custom.initialize();
    expect (custom.colorArray.length).toEqual(0);
  });

  it('call to addPixel should add the colored pixel to the array', () => {
    const custom = new CustomShape(1, '#000000', '#000000');
    const pixel = new PointService(1, 1);
    custom.initialize();
    custom.addPixel(pixel);
    expect (custom.coloredDots[0].x).toEqual(1);
    expect (custom.coloredDots[0].y).toEqual(1);
  });

  it('call to colorArray should draw a line for each pixel', () => {
    const custom = new CustomShape(1, '#000000', '#000000');
    const INIT = new PointService(0, 0);
    const FINAL = new PointService(1, 1);
    custom.initialize();
    custom.addPixel(INIT);
    custom.addPixel(FINAL);
    custom.colorArray();
    expect (custom.instruction).toEqual(' M0,0L1,1');
  });

  it('call to rotate should rotate around the center and change the instruction ', () => {
    const custom = new CustomShape(1, '#000000', '#000000');
    const INIT = new PointService(0, 0);
    const FINAL = new PointService(1, 1);
    custom.initialize();
    custom.addPixel(INIT);
    custom.addPixel(FINAL);
    custom.rotate(45);
    expect (custom.instruction).toEqual(' M-1,0L1,0');
  });

  it('call to translate should translate instruction ', () => {
    const custom = new CustomShape(1, '#000000', '#000000');
    const INIT = new PointService(0, 0);
    const FINAL = new PointService(1, 1);
    custom.initialize();
    custom.addPixel(INIT);
    custom.addPixel(FINAL);
    custom.translate(1, 1);
    expect (custom.instruction).toEqual(' M1,1L2,2');
  });

  it('call to detectRectangleIntersection on Rectangle: (1,1), (1,3), (3,1), (3,3) and custom shape: (2,2),'
  + ' (11,3) should return true', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000000');
    const LINE1R = new LineShape(1, '#000000', '#000000');
    const LINE2R = new LineShape(1, '#000000', '#000000');
    const LINE3R = new LineShape(1, '#000000', '#000000');
    const LINE4R = new LineShape(1, '#000000', '#000000');
    LINE1R.setOrigin(new PointService(1, 1));
    LINE1R.setDestination(new PointService(1, 3));
    LINE2R.setOrigin(new PointService(1, 3));
    LINE2R.setDestination(new PointService(3, 3));
    LINE3R.setOrigin(new PointService(3, 3));
    LINE3R.setDestination(new PointService(3, 1));
    LINE4R.setOrigin(new PointService(3, 1));
    LINE4R.setDestination(new PointService(1, 1));
    const LINESR: LineShape[] = [LINE1R, LINE2R, LINE3R, LINE4R];
    RECTANGLE.setLines(LINESR);
    const custom = new CustomShape(1, '#000000', '#000000');
    const LINE1 = new LineShape(1, '#000000', '#000000');
    const LINE2 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(2, 2));
    LINE2.setOrigin(new PointService(1, 1));
    LINE2.setDestination(new PointService(3, 3));
    custom.initialize();
    custom.lines.push(LINE1);
    custom.lines.push(LINE2);
    expect(custom.detectRectangleIntersection(RECTANGLE)).toBeTruthy();
  });
  it('call to detectRectangleIntersection on Rectangle: (1,1), (1,3), (3,1), (3,3) and custom shape: (0,0),'
  + ' (0,100) should return false', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000000');
    const LINE1R = new LineShape(1, '#000000', '#000000');
    const LINE2R = new LineShape(1, '#000000', '#000000');
    const LINE3R = new LineShape(1, '#000000', '#000000');
    const LINE4R = new LineShape(1, '#000000', '#000000');
    LINE1R.setOrigin(new PointService(1, 1));
    LINE1R.setDestination(new PointService(1, 3));
    LINE2R.setOrigin(new PointService(1, 3));
    LINE2R.setDestination(new PointService(3, 3));
    LINE3R.setOrigin(new PointService(3, 3));
    LINE3R.setDestination(new PointService(3, 1));
    LINE4R.setOrigin(new PointService(3, 1));
    LINE4R.setDestination(new PointService(1, 1));
    const LINESR: LineShape[] = [LINE1R, LINE2R, LINE3R, LINE4R];
    RECTANGLE.setLines(LINESR);
    const custom = new CustomShape(1, '#000000', '#000000');
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(0, 0));
    LINE1.setDestination(new PointService(0, 100));
    custom.initialize();
    custom.lines.push(LINE1);
    expect(custom.detectRectangleIntersection(RECTANGLE)).toBe(false);
  });

});
