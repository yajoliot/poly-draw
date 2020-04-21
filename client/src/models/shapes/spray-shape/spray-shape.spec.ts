
import {PointService} from '../../../services/point/point.service';
import { LineShape } from '../line/line';
import { Rectangle } from '../rectangle/rectangle';
import { SprayCircle } from '../sprayCircle/spray-circle';
import { SprayShape } from './spray-shape';

describe('SprayShape', () => {
  it('should be constructed correctly', () => {
    const SHAPE: SprayShape = new SprayShape(1, '', '');
    expect(SHAPE).toBeTruthy();
    expect(SHAPE.circles).toEqual([]);
  });
  it('call to initialize should set the instruction to the empty string', () => {
    const SHAPE: SprayShape = new SprayShape(1, '#000000', '#000000');
    SHAPE.initialize();
    expect(SHAPE.instruction).toEqual('');
    expect(SHAPE.oldsize).toEqual(0);
    expect(SHAPE.radius).toEqual(10);
  });

  it('call to generateSpray should call create pattern', () => {
    const sprayshape: SprayShape = new SprayShape(1, '#000000', '#000000');
    const PT = new PointService(1, 1);
    sprayshape.initialize();
    spyOn(sprayshape, 'createPattern');
    sprayshape.generateSpray(PT);
    expect(sprayshape.createPattern).toHaveBeenCalledWith(PT);
  });

  it('call to translate should reset extremum', () => {
    const sprayshape: SprayShape = new SprayShape(1, '#000000', '#000000');
    sprayshape.initialize();
    spyOn(sprayshape, 'resetExtremums');
    sprayshape.translate(1, 1);
    expect(sprayshape.resetExtremums).toHaveBeenCalled();
  });

  it('call to updateExtremums(0,3) and updateExtremums(3,0) with SHAPE min (1, 1), max (2,2) should set appropriate extremums', () => {
    const SPRAYSHAPE: SprayShape = new SprayShape(1, '#000000', '#000000');
    SPRAYSHAPE.setMinimum(new PointService(1, 1));
    SPRAYSHAPE.setMaximum(new PointService(2, 2));
    SPRAYSHAPE.updateExtremums(new PointService(0, 3));
    SPRAYSHAPE.updateExtremums(new PointService(3, 0));
    expect(SPRAYSHAPE.getMaximum()).toEqual(new PointService(3, 3));
    expect(SPRAYSHAPE.getMinimum()).toEqual(new PointService(0, 0));
  });

  // tslint:disable-next-line: max-line-length
  it('call to detectRectangleIntersection on Rectangle (1,1), (1,3), (3,1), (3,3) and sprayShape generated at (11,11) - (7,7) - (12,12) - (13,13) should return true', () => {
    const RECTANGLE = new Rectangle(1, '', '');
    const LINE1R = new LineShape(1, '', '');
    const LINE2R = new LineShape(1, '', '');
    const LINE3R = new LineShape(1, '', '');
    const LINE4R = new LineShape(1, '', '');
    LINE1R.setOrigin(new PointService(1, 1));
    LINE1R.setDestination(new PointService(1, 3));
    LINE1R.findExtremums();
    LINE2R.setOrigin(new PointService(1, 3));
    LINE2R.setDestination(new PointService(3, 3));
    LINE2R.findExtremums();
    LINE3R.setOrigin(new PointService(3, 3));
    LINE3R.setDestination(new PointService(3, 1));
    LINE3R.findExtremums();
    LINE4R.setOrigin(new PointService(3, 1));
    LINE4R.setDestination(new PointService(1, 1));
    LINE4R.findExtremums();
    const LINESR: LineShape[] = [LINE1R, LINE2R, LINE3R, LINE4R];
    RECTANGLE.setLines(LINESR);
    const SHAPE = new SprayShape(1, '', '');
    SHAPE.initialize();
    SHAPE.radius = 10;
    SHAPE.NUMDOTS = 100;
    SHAPE.generateSpray(new PointService(11, 11));
    SHAPE.generateSpray(new PointService(7, 7));
    SHAPE.generateSpray(new PointService(12, 12));
    SHAPE.generateSpray(new PointService(13, 13));
    expect(SHAPE.detectRectangleIntersection(RECTANGLE)).toBeTruthy();
    SHAPE.circles = [];
    expect(SHAPE.detectRectangleIntersection(RECTANGLE)).toBeFalsy();
  });
  it('call to resetExtremums() with sprayShape minimum (2,2), maximum (100,100), circle1 with minimum (0,0)'
    + 'and maximum (101,101), circle with minimum/maximum (10,10) should set the right extremum', () => {
    const SHAPE = new SprayShape(1, '', '');
    SHAPE.setMinimum(new PointService(2, 2));
    SHAPE.setMaximum(new PointService(100, 100));
    const CIRCLE1 = new SprayCircle(1, '', '');
    CIRCLE1.setMaximum(new PointService(101, 101));
    CIRCLE1.setMinimum(new PointService(1, 1));
    SHAPE.circles.push(CIRCLE1);
    SHAPE.resetExtremums();
    expect(SHAPE.getMaximum()).toEqual(new PointService(101, 101));
    expect(SHAPE.getMinimum()).toEqual(new PointService(1, 1));
    const CIRCLE2 = new SprayCircle(1, '', '');
    CIRCLE2.setMaximum(new PointService(10, 10));
    CIRCLE2.setMinimum(new PointService(10, 10));
    SHAPE.circles.push(CIRCLE2);
    SHAPE.resetExtremums();
    expect(SHAPE.getMaximum()).toEqual(new PointService(101, 101));
    expect(SHAPE.getMinimum()).toEqual(new PointService(1, 1));
  });
  it('call to findExtremums() with sprayShape minimum (2,2), maximum (100,100),'
     + ' circle with Line(200, 0), should return the updated extremums', () => {
    const SHAPE = new SprayShape(1, '', '');
    SHAPE.setMinimum(new PointService(2, 2));
    SHAPE.setMaximum(new PointService(100, 100));
    const CIRCLE1 = new SprayCircle(1, '', '');
    SHAPE.circles.push(CIRCLE1);
    CIRCLE1.addLine(new PointService(200, 0));
    SHAPE.findExtremums();
    expect(SHAPE.getMaximum()).toEqual(new PointService(200, 100));
    expect(SHAPE.getMinimum()).toEqual(new PointService(2, 0));
  });
  it('call to createPattern(10, 10) should instantiate and push the corresponding sprayCircle in circles,'
    + ' as well as generate the corresponding instruction', () => {
    const SHAPE = new SprayShape(1, '', '');
    SHAPE.initialize();
    SHAPE.NUMDOTS = 10;
    SHAPE.createPattern(new PointService(10, 10));
    expect(SHAPE.circles.length).toEqual(1);
    expect(SHAPE.circles[0].getLines().length).toEqual(SHAPE.NUMDOTS);
    expect(SHAPE.instruction).toBeDefined();
  });
  it('call to translate (5,5) should translate its containing circles, as well as reset the extremums,'
      + ' and setting the right instruction ', () => {
    const SHAPE = new SprayShape(1, '', '');
    const CIRCLE1 = new SprayCircle(1, '', '');
    SHAPE.initialize();
    CIRCLE1.initialize(new PointService(100, 100));
    CIRCLE1.addLine(new PointService(200, 0));
    CIRCLE1.addLine(new PointService(0, 200));
    SHAPE.findExtremums();
    SHAPE.circles.push(CIRCLE1);
    SHAPE.generate();
    expect(CIRCLE1.instruction).toEqual('M200,0L200,0M0,200L0,200');
    expect(CIRCLE1.getLines()[0].getMaximum()).toEqual(new PointService(200, 0));
    expect(CIRCLE1.getLines()[0].getMinimum()).toEqual(new PointService(200, 0));
    expect(CIRCLE1.getLines()[1].getMaximum()).toEqual(new PointService(0, 200));
    expect(CIRCLE1.getLines()[1].getMinimum()).toEqual(new PointService(0, 200));
    SHAPE.translate(5, 5);
    expect(SHAPE.instruction).toEqual('M205,5L205,5M5,205L5,205');
    expect(SHAPE.getMaximum()).toEqual(new PointService(205, 205));
    expect(SHAPE.getMinimum()).toEqual(new PointService(5, 5));
  });
});
