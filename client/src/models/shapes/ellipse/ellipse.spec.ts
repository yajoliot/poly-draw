import { PointService } from 'src/services/point/point.service';
import { LineShape } from '../line/line';
import { Rectangle } from '../rectangle/rectangle';
import { Ellipse } from './ellipse';

describe('Ellipse', () => {
  it('call to initialize should instantiate parameter as initial point of ellispe', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.initialize(new PointService(1, 1));
    expect(SHAPE.getInitial()).toEqual(new PointService(1, 1));
  });
  it('call to setDestination should instantiate parameter as destination of ellipse', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.initialize(new PointService(1, 1));
    SHAPE.setDestination(new PointService(11, 12));
    expect(SHAPE.getDestination()).toEqual(new PointService(11, 12));
  });
  // tslint:disable-next-line: max-line-length
  it('call to generate with shiftPressed = f, initial = (1,1) destination = (11,12) should set the instruction to the corresponding ellipse', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.shiftPressed = false;
    SHAPE.initialize(new PointService(1, 1));
    SHAPE.setDestination(new PointService(11, 12));
    SHAPE.findAndSetProperties();
    SHAPE.generate();
    expect(SHAPE.instruction).toEqual('M6,1 A5 , 5 0 0, 1 6 12 M6,1 A5 , 5 0 0, 0 6 12 ');
  });
  // tslint:disable-next-line: max-line-length
  it('call to generate with shiftPressed = t, initial = (1,1) destination = (11,12) should set the instruction to the corresponding ellipse', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.shiftPressed = true;
    SHAPE.initialize(new PointService(1, 1));
    SHAPE.setDestination(new PointService(11, 12));
    SHAPE.findAndSetProperties();
    SHAPE.generate();
    expect(SHAPE.instruction).toEqual('M6,1 A5 , 5 0 0, 1 6 11 M6,1 A5 , 5 0 0, 0 6 11 ');
  });
  // tslint:disable-next-line: max-line-length
  it('call to generate with shiftPressed = t, initial = (1,1) destination = (12,11) should set the instruction to the corresponding ellipse', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.shiftPressed = true;
    SHAPE.initialize(new PointService(1, 1));
    SHAPE.setDestination(new PointService(12, 11));
    SHAPE.findAndSetProperties();
    SHAPE.generate();
    expect(SHAPE.instruction).toEqual('M6,1 A5 , 5 0 0, 1 6 11 M6,1 A5 , 5 0 0, 0 6 11 ');
  });
  it('call to generateCircle(1, (2,2)), should set the instruction to the corresponding Circle', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.generateCirle(1, new PointService(2, 2));
    expect(SHAPE.instruction).toEqual('M2,3 A1 , 1 0 0, 1 2 1 M2,3 A1 , 1 0 0, 0 2 1 ');
  });
  // tslint:disable-next-line: max-line-length
  it('call to findAndSetProperties with, initial = (1,1) destination = (11,12) should set the maximum and minimum of ellipse', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.shiftPressed = false;
    SHAPE.initialize(new PointService(1, 1));
    SHAPE.setDestination(new PointService(11, 12));
    SHAPE.findAndSetProperties();
    expect(SHAPE.getMaximum()).toEqual(new PointService(11, 12));
    expect(SHAPE.getMinimum()).toEqual(new PointService(1, 1));
  });
  // tslint:disable-next-line: max-line-length
  it('call to findAndSetProperties with, initial = (11,12) destination = (1,1) should set the  maximum and minimum of ellipse', () => {
    const SHAPE: Ellipse = new Ellipse(4, '000000', '000000');
    SHAPE.shiftPressed = false;
    SHAPE.initialize(new PointService(11, 12));
    SHAPE.setDestination(new PointService(1, 1));
    SHAPE.findAndSetProperties();
    expect(SHAPE.getMaximum()).toEqual(new PointService(11, 12));
    expect(SHAPE.getMinimum()).toEqual(new PointService(1, 1));
    expect(SHAPE.getCenter()).toEqual(new PointService(6, 6.5));
    expect(SHAPE.getRaddii()).toEqual(new PointService(3, 3.5));
  });
  it('call to findHorizontalLineIntersection with Ellipse init(5,5) dest(11,17)  and line (0,17) -> (12,17) should return true', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.initialize(new PointService(5, 5));
    SHAPE.setDestination(new PointService(11, 17));
    SHAPE.findAndSetProperties();
    const LINE: LineShape = new LineShape(1, '000000', '000000');
    LINE.setOrigin(new PointService(0, 17));
    LINE.setDestination(new PointService(12, 17));
    // SHAPE.generateSvgInstruction(new PointService(0, 2));
    expect(SHAPE.findHorizontalLineIntersection(LINE)).toBeTruthy();
  });
  it('call to findVerticalLineIntersection with Ellipse init(5,5) dest(11,17)  and line (17,0) -> (17,12) should return true', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.initialize(new PointService(5, 5));
    SHAPE.setDestination(new PointService(11, 17));
    SHAPE.findAndSetProperties();
    const LINE: LineShape = new LineShape(1, '000000', '000000');
    LINE.setOrigin(new PointService(11, 0));
    LINE.setDestination(new PointService(11, 12));
    // SHAPE.generateSvgInstruction(new PointService(0, 2));
    expect(SHAPE.findVerticalLineIntersection(LINE)).toBeTruthy();
  });
  it('call to detecLineIntersection with Ellipse init(5,5) dest(11,17)  and line (4,11) -> (8,11) should return true', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.initialize(new PointService(5, 5));
    SHAPE.setDestination(new PointService(11, 17));
    SHAPE.findAndSetProperties();
    const LINE: LineShape = new LineShape(1, '000000', '000000');
    LINE.setOrigin(new PointService(4, 12));
    LINE.setDestination(new PointService(8, 12));
    expect(SHAPE.detectLineIntersection(LINE)).toBeTruthy();
  });
  it('call to detecLineIntersection with Ellipse init(5,5) dest(11,17)  and line (11,4) -> (11,8) should return true', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.initialize(new PointService(5, 5));
    SHAPE.setDestination(new PointService(11, 17));
    SHAPE.findAndSetProperties();
    const LINE: LineShape = new LineShape(1, '000000', '000000');
    LINE.setOrigin(new PointService(11, 4));
    LINE.setDestination(new PointService(11, 8));
    expect(SHAPE.detectLineIntersection(LINE)).toBeFalsy();
  });
  it('call to detecLineIntersection with Ellipse init(5,5) dest(11,17)  and line (11,4) -> (12,8) should return false', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.initialize(new PointService(5, 5));
    SHAPE.setDestination(new PointService(11, 17));
    SHAPE.findAndSetProperties();
    const LINE: LineShape = new LineShape(1, '000000', '000000');
    LINE.setOrigin(new PointService(11, 4));
    LINE.setDestination(new PointService(12, 8));
    expect(SHAPE.detectLineIntersection(LINE)).toBeFalsy();
  });
  // tslint:disable-next-line: max-line-length
  it('call to translate(1,1) should change initial parameters (initial, destination), as well as generating the corresponding instruction', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.initialize(new PointService(1, 1));
    SHAPE.setDestination(new PointService(11, 17));
    SHAPE.translate(1, 1);
    expect(SHAPE.getInitial()).toEqual(new PointService(2, 2));
    expect(SHAPE.getDestination()).toEqual(new PointService(12, 18));
    expect(SHAPE.instruction).toEqual('M7,2 A5 , 8 0 0, 1 7 18 M7,2 A5 , 8 0 0, 0 7 18 ');
  });
  // tslint:disable-next-line: max-line-length
  it('call to detectRectangleIntersection on Rectangle 1: (1,1), (1,3), (3,1), (3,3) and ellipse (1,1) -> (3, 3) should return true', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000000');
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
    RECTANGLE.setLines(LINESR1);
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.initialize(new PointService(1, 1));
    SHAPE.setDestination(new PointService(3, 3));
    SHAPE.findAndSetProperties();
    expect(SHAPE.detectRectangleIntersection(RECTANGLE)).toBeTruthy();
  });
  // tslint:disable-next-line: max-line-length
  it('call to detectRectangleIntersection on Rectangle: (1,1), (1,3), (3,1), (3,3) and ellipse (100,100) -> (200, 200) should return false', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000000');
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
    RECTANGLE.setLines(LINESR1);
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.initialize(new PointService(100, 100));
    SHAPE.setDestination(new PointService(200, 200));
    SHAPE.findAndSetProperties();
    expect(SHAPE.detectRectangleIntersection(RECTANGLE)).toBeFalsy();
  });
  it('call to isLineVertical on Line (1,0) -> (1,11) should return true', () => {
    const SHAPE = new Ellipse(1, '', '');
    const LINE = new LineShape(1, '', '');
    LINE.setOrigin(new PointService(1, 0));
    LINE.setDestination(new PointService(1, 11));
    expect(SHAPE.isLineVertical(LINE)).toBeTruthy();
  });
  it('call to isLineHorizontal on Line (0,1) -> (0,11) should return true', () => {
    const SHAPE = new Ellipse(1, '', '');
    const LINE = new LineShape(1, '', '');
    LINE.setOrigin(new PointService(0, 1));
    LINE.setDestination(new PointService(0, 11));
    expect(SHAPE.isLineVertical(LINE)).toBeTruthy();
  });
  it('call to rotate(15) with Ellipse init(5,5) dest(11,17)  and line (11,4) -> (11,8) should rotate ellipse and' +
    'set the corresponding bouding box', () => {
      const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
      SHAPE.initialize(new PointService(5, 5));
      SHAPE.setDestination(new PointService(11, 17));
      SHAPE.findAndSetProperties();
      SHAPE.rotate(15);
      expect(SHAPE.getRotation()).toEqual(15);
      expect(SHAPE.getRaddii()).toEqual(new PointService(3, 6));
      expect(SHAPE.getCenter()).toEqual(new PointService(8, 11));
      expect(SHAPE.getMinimum()).toEqual(new PointService(4.7123477907616085, 5.152663602024429));
      expect(SHAPE.getMaximum()).toEqual(new PointService(11.287652209238392, 16.84733639797557));
      expect(SHAPE.instruction).toEqual('M-2.574416106440273,2.4453682716404117 A3 , 6 -15 1, 0 -2.574416106440273 2.4453682716404117' +
                                        '  A3 , 6 -15 0, 0 -2.574416106440273 2.4453682716404117 ');
    });
  it('call to rotate(195) on Ellipse init(5,5) dest(11,17) should rotate the ellipse, as well as set the rotation to -180', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.initialize(new PointService(5, 5));
    SHAPE.setDestination(new PointService(11, 17));
    SHAPE.findAndSetProperties();
    expect(SHAPE.getRotation()).toEqual(0);
    SHAPE.rotate(195);
    expect(SHAPE.instruction).toEqual('M18.57441610644027,19.55463172835959 A3 , 6 165 1, 0 18.57441610644027 19.55463172835959' +
                                      '  A3 , 6 165 0, 0 18.57441610644027 19.55463172835959 ');
    expect(SHAPE.getRotation()).toEqual(-165);
  });
  it('call to detectRectangleIntersection after rotate(1) on Ellipse init(5,5) dest(11,17) and rectangle (1,1), (1,3), (3,1), (3,3) should return true', () => {
    const SHAPE: Ellipse = new Ellipse(1, '000000', '000000');
    SHAPE.initialize(new PointService(1, 1));
    SHAPE.setDestination(new PointService(3, 3));
    SHAPE.findAndSetProperties();
    SHAPE.rotate(1);
    const RECTANGLE = new Rectangle(1, '#000000', '#000000');
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
    RECTANGLE.setLines(LINESR1);
    expect(SHAPE.detectRectangleIntersection(RECTANGLE)).toBeTruthy();
  });
});
