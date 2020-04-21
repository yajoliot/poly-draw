import { PointService } from 'src/services/point/point.service';
import { LineShape } from '../line/line';
import { Rectangle } from './rectangle';

describe('Rectangle', () => {
  it('call to initialize should set the initialPoint, aswell as setting the instruction to the empty string', () => {
    const RECTANGLE: Rectangle = new Rectangle(1, '#000000', '#000000');
    RECTANGLE.initialize(new PointService(1, 1));
    expect(RECTANGLE.getInitialPoint()).toEqual(new PointService(1, 1));
    expect(RECTANGLE.instruction).toEqual('');
  });
  it('call to setLastPoint should set the initialPoint', () => {
    const RECTANGLE: Rectangle = new Rectangle(1, '#000000', '#000000');
    RECTANGLE.setLastPoint(new PointService(1, 1));
    expect(RECTANGLE.getLastPoint()).toEqual(new PointService(1, 1));
  });
  it('call to generateRectangle should set corresponding rectangle instruction', () => {
    const RECTANGLE: Rectangle = new Rectangle(1, '#000000', '#000000');
    RECTANGLE.initialize(new PointService(1, 1));
    RECTANGLE.setLastPoint(new PointService(2, 2));
    RECTANGLE.generateRectangle();
    expect(RECTANGLE.instruction).toEqual('M1,1L2,1L2,2L1,2L1,1');
  });
  it('call to generateSquare with sideX = sideY should set corresponding square instruction', () => {
    const SQUARE: Rectangle = new Rectangle(1, '#000000', '#000000');
    SQUARE.initialize(new PointService(30, 30));
    SQUARE.setLastPoint(new PointService(1, 1));
    SQUARE.generateSquare();
    expect(SQUARE.instruction).toEqual('M30,30L1,30L1,1L30,1L30,30');
  });
  it('call to generateSquare with sideX < sideY should set corresponding instruction', () => {
    const SQUARE: Rectangle = new Rectangle(1, '#000000', '#000000');
    SQUARE.initialize(new PointService(1, 1));
    SQUARE.setLastPoint(new PointService(30, 31));
    SQUARE.generateSquare();
    expect(SQUARE.instruction).toEqual('M1,1L30,1L30,30L1,30L1,1');
  });
  it('call to generateSquare with sideX > sideY should set corresponding instruction', () => {
    const SQUARE: Rectangle = new Rectangle(1, '#000000', '#000000');
    SQUARE.initialize(new PointService(1, 1));
    SQUARE.setLastPoint(new PointService(31, 30));
    SQUARE.generateSquare();
    expect(SQUARE.instruction).toEqual('M1,1L30,1L30,30L1,30L1,1');
  });
  it('call to generateSquare with sideX > sideY, and XDISPLACEMENT > 0 and YDISPLACEMENT < 0 should set corresponding instruction', () => {
    const SQUARE: Rectangle = new Rectangle(1, '#000000', '#000000');
    SQUARE.initialize(new PointService(5, 5));
    SQUARE.setLastPoint(new PointService(31, 4));
    SQUARE.generateSquare();
    expect(SQUARE.instruction).toEqual('M5,5L6,5L6,4L5,4L5,5');
  });
  it('call to generateSquare with sideY > side X, and XDISPLACEMENT < 0 and YDISPLACEMENT > 0 should set corresponding instruction', () => {
    const SQUARE: Rectangle = new Rectangle(1, '#000000', '#000000');
    SQUARE.initialize(new PointService(5, 5));
    SQUARE.setLastPoint(new PointService(4, 31));
    SQUARE.generateSquare();
    expect(SQUARE.instruction).toEqual('M5,5L4,5L4,6L5,6L5,5');
  });
  it('call to generate, shift = true should set corresponding instruction to the right square', () => {
    const SQUARE: Rectangle = new Rectangle(1, '#000000', '#000000');
    SQUARE.initialize(new PointService(30, 30));
    SQUARE.setLastPoint(new PointService(1, 1));
    SQUARE.shiftPressed = true;
    SQUARE.generate();
    expect(SQUARE.instruction).toEqual('M30,30L1,30L1,1L30,1L30,30');
  });
  it('call to generate, shift = false should set corresponding instruction to the right rectangle', () => {
    const RECTANGLE: Rectangle = new Rectangle(1, '#000000', '#000000');
    RECTANGLE.initialize(new PointService(1, 1));
    RECTANGLE.setLastPoint(new PointService(2, 2));
    RECTANGLE.shiftPressed = false;
    RECTANGLE.generate();
    expect(RECTANGLE.instruction).toEqual('M1,1L2,1L2,2L1,2L1,1');
  });
  it('call to detectRectangleIntersection on Rectangle 1: (1,1), (1,3), (3,1), (3,3) and' 
  + 'Rectangle 2: (2,2), (2,4), (4,2), (4,4) should return true', () => {
    const RECTANGLE1 = new Rectangle(1, '#000000', '#000000');
    const LINE1R1 = new LineShape(1, '#000000', '#000000');
    const LINE2R1 = new LineShape(1, '#000000', '#000000');
    const LINE3R1 = new LineShape(1, '#000000', '#000000');
    const LINE4R1 = new LineShape(1, '#000000', '#000000');
    LINE1R1.setOrigin(new PointService(1, 1));
    LINE1R1.setDestination(new PointService(1, 3));
    LINE2R1.setOrigin(new PointService(1, 3));
    LINE2R1.setDestination(new PointService(3, 3));
    LINE3R1.setOrigin(new PointService(3, 3));
    LINE3R1.setDestination(new PointService(3, 1));
    LINE4R1.setOrigin(new PointService(3, 1));
    LINE4R1.setDestination(new PointService(1, 1));
    const LINESR1: LineShape[] = [LINE1R1, LINE2R1, LINE3R1, LINE4R1];
    RECTANGLE1.setLines(LINESR1);
    const RECTANGLE2 = new Rectangle(1, '#000000', '#000000');
    const LINE1R2 = new LineShape(1, '#000000', '#000000');
    const LINE2R2 = new LineShape(1, '#000000', '#000000');
    const LINE3R2 = new LineShape(1, '#000000', '#000000');
    const LINE4R2 = new LineShape(1, '#000000', '#000000');
    LINE1R2.setOrigin(new PointService(2, 2));
    LINE1R2.setDestination(new PointService(2, 4));
    LINE2R2.setOrigin(new PointService(2, 4));
    LINE2R2.setDestination(new PointService(4, 4));
    LINE3R2.setOrigin(new PointService(4, 4));
    LINE3R2.setDestination(new PointService(4, 2));
    LINE4R2.setOrigin(new PointService(4, 2));
    LINE4R2.setDestination(new PointService(2, 2));
    const LINESR2: LineShape[] = [LINE1R2, LINE2R2, LINE3R2, LINE4R2];
    RECTANGLE2.setLines(LINESR2);
    expect(RECTANGLE1.detectRectangleIntersection(RECTANGLE2)).toBeTruthy();
  });
  it('call to detectRectangleIntersection on Rectangle 1: (1,1), (1,3), (3,1), (3,3) and'
  + 'Rectangle 2: (10,10), (10,15), (15,15), (15,10) should return false', () => {
    const RECTANGLE1 = new Rectangle(1, '#000000', '#000000');
    const LINE1R1 = new LineShape(1, '#000000', '#000000');
    const LINE2R1 = new LineShape(1, '#000000', '#000000');
    const LINE3R1 = new LineShape(1, '#000000', '#000000');
    const LINE4R1 = new LineShape(1, '#000000', '#000000');
    LINE1R1.setOrigin(new PointService(1, 1));
    LINE1R1.setDestination(new PointService(1, 3));
    LINE2R1.setOrigin(new PointService(1, 3));
    LINE2R1.setDestination(new PointService(3, 3));
    LINE3R1.setOrigin(new PointService(3, 3));
    LINE3R1.setDestination(new PointService(3, 1));
    LINE4R1.setOrigin(new PointService(3, 1));
    LINE4R1.setDestination(new PointService(1, 1));
    const LINESR1: LineShape[] = [LINE1R1, LINE2R1, LINE3R1, LINE4R1];
    RECTANGLE1.setLines(LINESR1);
    const RECTANGLE2 = new Rectangle(1, '#000000', '#000000');
    const LINE1R2 = new LineShape(1, '#000000', '#000000');
    const LINE2R2 = new LineShape(1, '#000000', '#000000');
    const LINE3R2 = new LineShape(1, '#000000', '#000000');
    const LINE4R2 = new LineShape(1, '#000000', '#000000');
    LINE1R2.setOrigin(new PointService(10, 10));
    LINE1R2.setDestination(new PointService(10, 15));
    LINE2R2.setOrigin(new PointService(10, 15));
    LINE2R2.setDestination(new PointService(15, 15));
    LINE3R2.setOrigin(new PointService(15, 15));
    LINE3R2.setDestination(new PointService(15, 10));
    LINE4R2.setOrigin(new PointService(15, 10));
    LINE4R2.setDestination(new PointService(10, 10));
    const LINESR2: LineShape[] = [LINE1R2, LINE2R2, LINE3R2, LINE4R2];
    RECTANGLE2.setLines(LINESR2);
    expect(RECTANGLE1.detectRectangleIntersection(RECTANGLE2)).toBeFalsy();
  });
  it('call to detectRectangleInclusion on Rectangle 1: (1,1), (5,5) and Rectangle 2: (2,2), (4,4) should return true', () => {
    const RECTANGLE1 = new Rectangle(1, '#000000', '#000000');
    RECTANGLE1.initialize(new PointService(1, 1));
    RECTANGLE1.setLastPoint(new PointService(5, 5));
    RECTANGLE1.generate();
    RECTANGLE1.findExtremums();

    const RECTANGLE2 = new Rectangle(1, '#000000', '#000000');
    RECTANGLE2.initialize(new PointService(2, 2));
    RECTANGLE2.setLastPoint(new PointService(4, 4));
    RECTANGLE1.generate();
    RECTANGLE2.findExtremums();

    expect(RECTANGLE1.getInitialPoint().getPositionX()).toEqual(1);
    expect(RECTANGLE1.getInitialPoint().getPositionY()).toEqual(1);
    expect(RECTANGLE1.getLastPoint().getPositionX()).toEqual(5);
    expect(RECTANGLE1.getLastPoint().getPositionY()).toEqual(5);
    expect(RECTANGLE2.getInitialPoint().getPositionX()).toEqual(2);
    expect(RECTANGLE2.getInitialPoint().getPositionY()).toEqual(2);
    expect(RECTANGLE2.getLastPoint().getPositionX()).toEqual(4);
    expect(RECTANGLE2.getLastPoint().getPositionY()).toEqual(4);
    expect(RECTANGLE1.detectRectangleInclusion(RECTANGLE2)).toBeTruthy();
  });
  it('call to detectRectangleInclusion on Rectangle 1: (1,1), (5,5) and Rectangle 2: (33,33), (44,44) should return false', () => {
    const RECTANGLE1 = new Rectangle(1, '#000000', '#000000');
    RECTANGLE1.initialize(new PointService(1, 1));
    RECTANGLE1.setLastPoint(new PointService(5, 5));
    RECTANGLE1.generate();
    RECTANGLE1.findExtremums();
    const RECTANGLE2 = new Rectangle(1, '#000000', '#000000');
    RECTANGLE2.initialize(new PointService(33, 33));
    RECTANGLE2.setLastPoint(new PointService(44, 44));
    RECTANGLE2.generate();
    RECTANGLE2.findExtremums();
    expect(RECTANGLE1.detectRectangleInclusion(RECTANGLE2)).toBeFalsy();
  });
  it('call to isSelected(6,6) with Rectangle (1,1), (5,5), should return false', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000000');
    RECTANGLE.initialize(new PointService(1, 1));
    RECTANGLE.setLastPoint(new PointService(5, 5));
    expect(RECTANGLE.isSelected(new PointService(6, 6))).toEqual(false);
  });
  it('call to isSelected(6,6) with Rectangle (5,5), (1,1), should return false', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000000');
    RECTANGLE.initialize(new PointService(5, 5));
    RECTANGLE.setLastPoint(new PointService(1, 1));
    expect(RECTANGLE.isSelected(new PointService(6, 6))).toEqual(false);
  });
  it('call to isSelected(4,4) with Rectangle (5,5), (1,1), should return true', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000000');
    RECTANGLE.initialize(new PointService(5, 5));
    RECTANGLE.setLastPoint(new PointService(1, 1));
    expect(RECTANGLE.isSelected(new PointService(4, 4))).toEqual(true);
  });
  it('call to getColorOfPosition(6,6) with Rectangle (1,1), (5,5), should return false', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000001');
    RECTANGLE.initialize(new PointService(1, 1));
    RECTANGLE.setLastPoint(new PointService(5, 5));
    expect(RECTANGLE.getColorOfPosition(new PointService(6, 6))).toEqual('#000001');
  });
  it('call to getColorOfPosition(6,6) with Rectangle (5,5), (1,1), should return false', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000001');
    RECTANGLE.initialize(new PointService(5, 5));
    RECTANGLE.setLastPoint(new PointService(1, 1));
    expect(RECTANGLE.getColorOfPosition(new PointService(6, 6))).toEqual('#000001');
  });
  it('call to getColorOfPosition(6,6) with Rectangle (1,1), (5,5), should return false', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000001');
    RECTANGLE.initialize(new PointService(1, 1));
    RECTANGLE.setLastPoint(new PointService(5, 5));
    expect(RECTANGLE.getColorOfPosition(new PointService(4, 4))).toEqual('#000000');
  });
  it('call to getColorOfPosition(6,6) with Rectangle (5,5), (1,1), should return false', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000001');
    RECTANGLE.initialize(new PointService(5, 5));
    RECTANGLE.setLastPoint(new PointService(1, 1));
    expect(RECTANGLE.getColorOfPosition(new PointService(4, 4))).toEqual('#000000');
  });
  it('call to translate (5,5) should translate the circle, as well as reset the extremums,'
      + ' and setting the right instruction ', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000000');
    RECTANGLE.initialize(new PointService(1, 1));
    RECTANGLE.setLastPoint(new PointService(5, 5));
    RECTANGLE.generate();
    RECTANGLE.translate(5, 5);
    expect(RECTANGLE.instruction).toEqual('M6,6L6,10L10,10L10,6L6,6');
    expect(RECTANGLE.getMaximum()).toEqual(new PointService(10, 10));
    expect(RECTANGLE.getMinimum()).toEqual(new PointService(6, 6));
  });
  it('call to findExtremums() with rectangle minimum (2,2), maximum (100,100), should return the updated extremums', () => {
    const SHAPE = new Rectangle(1, '', '');
    SHAPE.initialize(new PointService(100, 100));
    SHAPE.setLastPoint(new PointService(2, 2));
    SHAPE.generate();
    SHAPE.findExtremums();
    expect(SHAPE.getMaximum()).toEqual(new PointService(100, 100));
    expect(SHAPE.getMinimum()).toEqual(new PointService(2, 2));
  });
  it('call to getDash should return none', () => {
    const SHAPE = new Rectangle(1, '', '');
    expect(SHAPE.getDash()).toEqual('none');
  });

  it('call to rotate should rotate all the lines correctly yeet', () => {
    const SHAPE = new Rectangle(1, '', '');
    SHAPE.initialize(new PointService(0,10));
    SHAPE.setLastPoint(new PointService(20, 20));
    SHAPE.generateRectangle();
    console.log(SHAPE.instruction);

  });

  it('call to rotate should rotate all the lines correctly', () => {
    const SHAPE = new Rectangle(1, '', '');
    SHAPE.initialize(new PointService(0,10));
    SHAPE.setLastPoint(new PointService(20, 20));
    SHAPE.generateRectangle();
    console.log(SHAPE.instruction);

    SHAPE.rotate(90);
    SHAPE.rotate(90);

    console.log(SHAPE.instruction);
  });

});
