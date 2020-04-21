
import { PointService } from 'src/services/point/point.service';
import { LineShape } from '../line/line';
import { SprayCircle } from './spray-circle';

describe('SprayCircle', () => {
  it('should be created', () => {
    const SPRAYCIRCLE = new SprayCircle(1, '', '');
    expect(SPRAYCIRCLE).toBeTruthy();
    expect(SPRAYCIRCLE.getLines()).toEqual([]);
    expect(SPRAYCIRCLE.getMainColor()).toEqual('none');
    expect(SPRAYCIRCLE.getSecondaryColor()).toEqual('none');
  });

  it('call to initialize at point (11,11) should correctfully set extremums, center as well as SetDestination and Origin', () => {
    const SPRAYCIRCLE = new SprayCircle(1, '#000000', '#000000');
    const PT = new PointService(11, 11);
    SPRAYCIRCLE.initialize(PT);
    expect(SPRAYCIRCLE.getMinimum()).toEqual(new PointService(1, 1));
    expect(SPRAYCIRCLE.getMaximum()).toEqual(new PointService(21, 21));
    expect(SPRAYCIRCLE.getInitial()).toEqual(new PointService(1, 1));
    expect(SPRAYCIRCLE.getDestination()).toEqual(new PointService(21, 21));
    expect(SPRAYCIRCLE.getCenter()).toEqual(PT);
  });

  it('call to resetExtremums() with SHAPE.lines = (1,1) -> (1,4), (1,4) -> (4,4),'
    + ' (4,4) -> (4,1), (4,1) -> (1,1), (0,5) -> (-1,1) should set appropriate extremums', () => {
    const SPRAYCIRCLE: SprayCircle = new SprayCircle(1, '#000000', '#000000');
    const LINE1S = new LineShape(1, '#000000', '#000000');
    const LINE2S = new LineShape(1, '#000000', '#000000');
    const LINE3S = new LineShape(1, '#000000', '#000000');
    const LINE4S = new LineShape(1, '#000000', '#000000');
    const LINE5S = new LineShape(1, '#000000', '#000000');
    LINE1S.setOrigin(new PointService(1, 1));
    LINE1S.setDestination(new PointService(1, 4));
    LINE1S.findExtremums();
    LINE2S.setOrigin(new PointService(1, 4));
    LINE2S.setDestination(new PointService(0, 0));
    LINE2S.findExtremums();
    LINE3S.setOrigin(new PointService(4, 4));
    LINE3S.setDestination(new PointService(4, 1));
    LINE3S.findExtremums();
    LINE4S.setOrigin(new PointService(4, 1));
    LINE4S.setDestination(new PointService(1, 1));
    LINE4S.findExtremums();
    LINE5S.setOrigin(new PointService(5, 5));
    LINE5S.setDestination(new PointService(6, 6));
    LINE5S.findExtremums();
    const LINESP: LineShape[] = [LINE1S, LINE2S, LINE3S, LINE4S, LINE5S];
    SPRAYCIRCLE.setLines(LINESP);
    SPRAYCIRCLE.resetExtremums();
    expect(SPRAYCIRCLE.getMaximum()).toEqual(new PointService(6, 6));
    expect(SPRAYCIRCLE.getMinimum()).toEqual(new PointService(0, 0));
  });
  it('call to translate (5,5) should translate the circle, as well as reset the extremums,'
      + ' and setting the right instruction ', () => {
    const CIRCLE = new SprayCircle(1, '', '');
    CIRCLE.initialize(new PointService(100, 100));
    CIRCLE.addLine(new PointService(200, 0));
    CIRCLE.addLine(new PointService(0, 200));
    expect(CIRCLE.instruction).toEqual('M200,0L200,0M0,200L0,200');
    expect(CIRCLE.getLines()[0].getMaximum()).toEqual(new PointService(200, 0));
    expect(CIRCLE.getLines()[0].getMinimum()).toEqual(new PointService(200, 0));
    expect(CIRCLE.getLines()[1].getMaximum()).toEqual(new PointService(0, 200));
    expect(CIRCLE.getLines()[1].getMinimum()).toEqual(new PointService(0, 200));
    CIRCLE.translate(5, 5);
    expect(CIRCLE.instruction).toEqual('M205,5L205,5M5,205L5,205');
    expect(CIRCLE.getMaximum()).toEqual(new PointService(205, 205));
    expect(CIRCLE.getMinimum()).toEqual(new PointService(5, 5));
  });
});
