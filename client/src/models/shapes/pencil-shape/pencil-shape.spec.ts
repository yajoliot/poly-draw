import { PointService } from 'src/services/point/point.service';
import { LineShape } from '../line/line';
import { PencilShape } from '../pencil-shape/pencil-shape';
import { Rectangle } from '../rectangle/rectangle';

describe('PencilShape', () => {
  it('call to initialize should instanciate attribute lastPoint to the current point as well as set instruction to "",'
  + ' lines should also be instantiated ', () => {
    const SHAPE: PencilShape = new PencilShape(1, '000000', '000000');
    SHAPE.initialize(new PointService(1, 1));
    expect(SHAPE.instruction).toEqual(' ');
    expect(SHAPE.getLastPoint()).toEqual(new PointService(1, 1));
    expect(SHAPE.getNumberOfLines()).toEqual(0);
  });
  it('call to drawLine should add a new line in attribute lines and should also affect the instruction attribute ', () => {
    const SHAPE: PencilShape = new PencilShape(1, '000000', '000000');
    SHAPE.initialize(new PointService(1, 1));
    SHAPE.drawLine(new PointService(2, 2));
    expect(SHAPE.instruction).toEqual(' M1,1L2,2');
    expect(SHAPE.getLastPoint()).toEqual(new PointService(2, 2));
    expect(SHAPE.getNumberOfLines()).toEqual(1);
  });
  /* it('call to addLine should add a new line in attribute lines and should also affect the lastPoint attribute ', () => {
    const SHAPE1: PencilShape = new PencilShape(1, '000000', '000000');
    SHAPE1.initialize(new PointService(1, 1));
    SHAPE1.drawLine(new PointService(2, 2));
    const SHAPE: PencilShape = new PencilShape(1, '000000', '000000');
    const LINE: LineShape = new LineShape(1, '000000', '000000');
    LINE.generateLine(new PointService(1, 1), new PointService(2, 2));
    SHAPE.addLine(LINE);
    expect(SHAPE.instruction).toEqual(SHAPE1.instruction);
    expect(SHAPE.getLastPoint()).toEqual(new PointService(2, 2));
    expect(SHAPE.getNumberOfLines()).toEqual(1);
    expect(SHAPE.getLastLine()).toEqual(LINE);
  }); */
  it('call to removeLine should remove the last line in attribute lines and should also affect the lastPoint attribute ', () => {
    const SHAPE: PencilShape = new PencilShape(1, '', '');
    SHAPE.initialize(new PointService(3, 3));
    SHAPE.drawLine(new PointService(4, 4));
    const LINE: LineShape = new LineShape(1, '', '');
    LINE.generateLine(new PointService(1, 1), new PointService(2, 2));
    SHAPE.addLine(LINE);
    SHAPE.removeLine();
    expect(SHAPE.getLastPoint()).toEqual(new PointService(4, 4));
    expect(SHAPE.getNumberOfLines()).toEqual(1);
  });
  it('call to findExtremums should update the old values contained in the shape ', () => {
    const SHAPE: PencilShape = new PencilShape(1, '', '');
    SHAPE.setMaximum(new PointService(33, 33));
    SHAPE.setMinimum(new PointService(66, 66));
    const LINE1: LineShape = new LineShape(1, '', '');
    LINE1.setOrigin(new PointService(100, 100));
    LINE1.setDestination(new PointService(150, 124));
    const LINE2: LineShape = new LineShape(1, '', '');
    LINE2.setOrigin(new PointService(150, 124));
    LINE2.setDestination(new PointService(10, 10000));
    const LINE3: LineShape = new LineShape(1, '', '');
    LINE3.setOrigin(new PointService(10, 10000));
    LINE3.setDestination(new PointService(370, 1));
    const LINE4: LineShape = new LineShape(1, '', '');
    LINE4.setOrigin(new PointService(370, 1));
    LINE4.setDestination(new PointService(1, 0.5));
    /* let LINES = new Array<LineShape>();
    LINES.push(LINE1);
    LINES.push(LINE2);
    LINES.push(LINE3);
    LINES.push(LINE4);
    SHAPE.setLines(LINES); */
    SHAPE.setLines([LINE1, LINE2, LINE3, LINE4]);
    SHAPE.findExtremums();
    expect(SHAPE.getMaximum().getPositionX()).toEqual(370);
    expect(SHAPE.getMaximum().getPositionY()).toEqual(10000);
    expect(SHAPE.getMinimum().getPositionX()).toEqual(1);
    expect(SHAPE.getMinimum().getPositionY()).toEqual(0.5);
  });

  it('translate should reset the extremum  and translate the line', () => {
    const SHAPE: PencilShape = new PencilShape(1, '000000', '000000');
    SHAPE.initialize(new PointService(1, 1));
    const LINE1: LineShape = new LineShape(1, '', '');
    LINE1.setOrigin(new PointService(1, 0));
    LINE1.setDestination(new PointService(1, 1));
    SHAPE.addLine(LINE1);
    spyOn(SHAPE, 'resetExtremums');
    SHAPE.translate(1, 1);
    expect(SHAPE.resetExtremums).toHaveBeenCalled();
    expect(SHAPE.getLines()[0].getDestination().getPositionX()).toEqual(2);
    expect(SHAPE.getLines()[0].getDestination().getPositionY()).toEqual(2);
  });

  it('CASE 1 resetExtremums if position x of line is less than position x of minimum ', () => {
    const min = 1000000;
    const SHAPE: PencilShape = new PencilShape(1, '000000', '000000');
    SHAPE.initialize(new PointService(1, 1));
    const LINE1: LineShape = new LineShape(1, '', '');
    LINE1.setOrigin(new PointService(1, 0));
    LINE1.setDestination(new PointService(1, 1));
    SHAPE.addLine(LINE1);
    const point = new PointService(1, min);
    spyOn(SHAPE, 'setMinimum').withArgs(point);
    SHAPE.resetExtremums();
    expect(SHAPE.setMinimum).toHaveBeenCalledWith(point);
  });

  it('CASE 2 resetExtremums if position y of line is less than position y of minimum ', () => {
    const min = 1000000;
    const SHAPE: PencilShape = new PencilShape(1, '000000', '000000');
    SHAPE.initialize(new PointService(1, 1));
    const LINE1: LineShape = new LineShape(1, '', '');
    LINE1.setOrigin(new PointService(min + 1, 0));
    LINE1.setDestination(new PointService(1, 1));
    SHAPE.addLine(LINE1);
    const point = new PointService(min, 0);
    spyOn(SHAPE, 'setMinimum').withArgs(point);
    SHAPE.resetExtremums();
    expect(SHAPE.setMinimum).toHaveBeenCalledWith(point);
  });

  it('CASE 3 resetExtremums if position x of line is greater than position x of minimum and maximum ', () => {
    const max = 0;
    const min = 1000000;
    const SHAPE: PencilShape = new PencilShape(1, '000000', '000000');
    SHAPE.initialize(new PointService(1, 1));
    const LINE1: LineShape = new LineShape(1, '', '');
    LINE1.setOrigin(new PointService(min + 1, (min + 1)));
    LINE1.setDestination(new PointService(1, 1));
    SHAPE.addLine(LINE1);
    const point = new PointService(min + 1, max);
    spyOn(SHAPE, 'setMaximum').withArgs(point);
    SHAPE.resetExtremums();
    expect(SHAPE.setMaximum).toHaveBeenCalledWith(point);
  });

  // tslint:disable-next-line: max-line-length
  it('call to detectRectangleIntersection on Rectangle 1: (1,1), (1,3), (3,1), (3,3) and Pencil-shape: (2,2) -> (3,3) -> (4,4) -> (5,5) should return true', () => {
    const RECTANGLE = new Rectangle(1, '', '');
    const LINE1R = new LineShape(1, '', '');
    const LINE2R = new LineShape(1, '', '');
    const LINE3R = new LineShape(1, '', '');
    const LINE4R = new LineShape(1, '', '');
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
    const SHAPE = new PencilShape(1, '', '');
    const LINE2S = new LineShape(1, '', '');
    const LINE3S = new LineShape(1, '', '');
    const LINE4S = new LineShape(1, '', '');
    SHAPE.initialize(new PointService(2, 2));
    SHAPE.drawLine(new PointService(3, 3));
    LINE2S.setOrigin(new PointService(3, 3));
    LINE2S.setDestination(new PointService(4, 4));
    LINE3S.setOrigin(new PointService(4, 4));
    LINE3S.setDestination(new PointService(5, 5));
    LINE4S.setOrigin(new PointService(5, 5));
    LINE4S.setDestination(new PointService(6, 6));
    SHAPE.addLine(LINE2S);
    SHAPE.addLine(LINE3S);
    SHAPE.addLine(LINE4S);
    expect(SHAPE.detectRectangleIntersection(RECTANGLE)).toBeTruthy();
  });

  /* it('CASE 4 resetExtremums if x > min and y > max ', () => {
    const max = 0;
    const min = 1000000;
    const SHAPE: PencilShape = new PencilShape(1, '000000', '000000');
    SHAPE.initialize(new PointService(1, 1));
    const LINE1: LineShape = new LineShape(1, '', '');
    LINE1.setOrigin(new PointService(min + 1, min + 1));
    LINE1.setDestination(new PointService(1, 1));
    SHAPE.addLine(LINE1);
    const point = new PointService(max, min + 1);
    spyOn(SHAPE, 'setMaximum').withArgs(point);
    SHAPE.resetExtremums();
    expect(SHAPE.setMaximum).toHaveBeenCalledWith(point);
  }); */

});
