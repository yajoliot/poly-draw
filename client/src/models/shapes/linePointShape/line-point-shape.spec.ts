import { PointService } from 'src/services/point/point.service';
import { LineShape } from '../line/line';
import { Rectangle } from '../rectangle/rectangle';
import { LinePointShape } from './line-point-shape';

const CENT = 100;
describe('LinePointShape', () => {
  // tslint:disable-next-line: max-line-length
  it('call to initialize should instanciate attribute lastPoint to the current point as well as set instruction to the empty string, lines aswell as circles should also be instantiated', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));
    expect(LINEPOINT.getLastPoint()).toEqual(new PointService(1, 1));
    expect(LINEPOINT.instruction).toEqual(' ');
    expect(LINEPOINT.getNumberOfCircles()).toEqual(0);
    expect(LINEPOINT.getNumberOfLines()).toEqual(0);
  });
  it('call to drawLine should affect the instruction corresponding to the line + circle', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));
    LINEPOINT.drawLine(new PointService(CENT, CENT));
    expect(LINEPOINT.instruction).toEqual(' M1,1L100,100');
    expect(LINEPOINT.getNumberOfCircles()).toEqual(1);
  });
  it('call to generate should affect each circles instruction and add it to the line-point instruction', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));
    LINEPOINT.drawLine(new PointService(CENT, CENT));
    LINEPOINT.generate();
    // expect(LINEPOINT.instruction).toEqual('M1,1L100,100M 100 100m -5, 0a 5,5 0 1,0 10,0a 5,5 0 1,0 -10,0');
    expect(LINEPOINT.getNumberOfCircles()).toEqual(1);
  });
  // tslint:disable-next-line: max-line-length
  it('call to addLine should increase the number of circles, the number of lines as well as generating the corresponding instruction to the current instance', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));
    const LINESHAPE = new LineShape(1, '#000000', '#000000' );
    const DEST = 3;
    LINESHAPE.generateLine(new PointService(2, 2), new PointService(DEST, DEST));
    LINEPOINT.addLine(LINESHAPE);
    // expect(LINEPOINT.instruction).toEqual('M2,2L3,3M 2 2m -5, 0a 5,5 0 1,0 10,0a 5,5 0 1,0 -10,0');
    expect(LINEPOINT.getNumberOfCircles()).toEqual(1);
  });
  it('call to removeLine should decrease the number of circles, the number of lines as well as generating the corresponding '
  + 'instruction to the current instance', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));
    LINEPOINT.drawLine(new PointService(CENT, CENT));
    const LINESHAPE = new LineShape(1, '#000000', '#000000' );
    const DEST = 3;
    LINESHAPE.generateLine(new PointService(2, 2), new PointService(DEST, DEST));
    LINEPOINT.addLine(LINESHAPE);
    LINEPOINT.removeLine();
   // expect(LINEPOINT.instruction).toEqual('M1,1L100,100M 100 100m -5, 0a 5,5 0 1,0 10,0a 5,5 0 1,0 -10,0');
    expect(LINEPOINT.getNumberOfCircles()).toEqual(1);
    expect(LINEPOINT.getNumberOfLines()).toEqual(1);
  });
  it('call to getLastLine should return the lastLine in the array', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));
    LINEPOINT.drawLine(new PointService(CENT, CENT));
    const LINESHAPE = new LineShape(1, '#000000', '#000000' );
    const DEST = 3;
    LINESHAPE.generateLine(new PointService(2, 2), new PointService(DEST, DEST));
    LINEPOINT.addLine(LINESHAPE);
    expect(LINEPOINT.getLastLine()).toEqual(LINESHAPE);
  });

  it('call to translate should call generate ', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(CENT, CENT));
    LINEPOINT.addLine(LINE1);
    spyOn(LINEPOINT, 'generate');
    LINEPOINT.translate(1, 1);
    expect(LINEPOINT.generate).toHaveBeenCalled();
  });

  it('call to addLine should increase the number of circles, the number of lines as well as generating the corresponding instruction to the current instance', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));
    const LINESHAPE = new LineShape(1, '#000000', '#000000' );
    expect(LINEPOINT.instruction).toEqual(' ');
    LINESHAPE.generateLine(new PointService(2, 2), new PointService(3, 3));
    LINEPOINT.addLine(LINESHAPE);
    expect(LINEPOINT.instruction).not.toEqual(' ');
    expect(LINEPOINT.getNumberOfCircles()).toEqual(1);
  });

  it('call to removeLine should decrease the number of circles, the number of lines as well as generating the corresponding instruction to the current instance', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));

    expect(LINEPOINT.instruction).toEqual(' ');

    LINEPOINT.drawLine(new PointService(100, 100));
    const LINESHAPE = new LineShape(1, '#000000', '#000000' );
    LINESHAPE.generateLine(new PointService(2, 2), new PointService(3, 3));
    LINEPOINT.addLine(LINESHAPE);
    LINEPOINT.removeLine();
    expect(LINEPOINT.instruction).not.toEqual(' ');
    expect(LINEPOINT.getNumberOfCircles()).toEqual(1);
    expect(LINEPOINT.getNumberOfLines()).toEqual(1);
  });

  it('call to generate should affect each circles instruction and add it to the line-point instruction', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));
    expect(LINEPOINT.instruction).toEqual(' ');
    LINEPOINT.drawLine(new PointService(100, 100));
    LINEPOINT.generate();
    expect(LINEPOINT.instruction).not.toEqual(' ');
    expect(LINEPOINT.getNumberOfCircles()).toEqual(1);
  });

  it('setCircles should reinitialize circle array to given value', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));
    LINEPOINT.drawLine(new PointService(100, 100));
    LINEPOINT.generate();
    expect(LINEPOINT['circles']).not.toEqual([]);

    expect(LINEPOINT.getNumberOfCircles()).toEqual(1);

    LINEPOINT.setCircles([]);

    expect(LINEPOINT['circles']).toEqual([]);

    expect(LINEPOINT.getNumberOfCircles()).toEqual(0);
  });

  it('detectRectangleIntersection should return true if intersecion is detected', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));
    LINEPOINT.drawLine(new PointService(100, 100));
    LINEPOINT.generate();
    expect(LINEPOINT['circles']).not.toEqual([]);

    var rectangle = new Rectangle(1, '', '');
    rectangle.initialize(new PointService(1, 1));
    rectangle.setLastPoint(new PointService(100, 100));
    rectangle.generate();

    expect(LINEPOINT.detectRectangleIntersection(rectangle)).toEqual(true);
  });

  it('detectRectangleIntersection should return false if no intersecion is detected', () => {
    const LINEPOINT = new LinePointShape(1, '#000000', '#000000' );
    LINEPOINT.initialize(new PointService(1, 1));
    LINEPOINT.drawLine(new PointService(1, 2));
    LINEPOINT.generate();
    expect(LINEPOINT['circles']).not.toEqual([]);

    const rectangle = new Rectangle(1, '', '');
    rectangle.initialize(new PointService(400, 400));
    rectangle.setLastPoint(new PointService(500, 500));
    rectangle.generate();

    expect(LINEPOINT.detectRectangleIntersection(rectangle)).toEqual(false);
  });


});

