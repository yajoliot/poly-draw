import { PointService } from 'src/services/point/point.service';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { ControlPoint } from '../controlPoint/control-point';
import { Ellipse } from '../ellipse/ellipse';
import { Rectangle } from '../rectangle/rectangle';
import { SelectionRectangle } from './selection-rectangle';

describe('SelectionRectangle', () => {
  it('should be created', () => {
    const SHAPE = new SelectionRectangle(1, '', '');
    expect(SHAPE).toBeTruthy();
    expect(SHAPE.getControlPoints().length).toEqual(4);
    expect(SHAPE.getControlPoints()[0]).toEqual(new ControlPoint(1, '#000000', 'none'));
    expect(SHAPE.getControlPoints()[1]).toEqual(new ControlPoint(1, '#000000', 'none'));
    expect(SHAPE.getControlPoints()[2]).toEqual(new ControlPoint(1, '#000000', 'none'));
    expect(SHAPE.getControlPoints()[3]).toEqual(new ControlPoint(1, '#000000', 'none'));
    expect(SHAPE.null).toBeTruthy();
  });
  it('call to generateControlPoints should set the control points extremums as well as instructions', () => {
    const SHAPE = new SelectionRectangle(1, '', '');
    SHAPE.initialize(new PointService(10, 10));
    SHAPE.setLastPoint(new PointService(100, 100));
    SHAPE.generateRectangle();
    expect(SHAPE.getControlPoints()[0].instruction).toEqual('M52,10L58,10L58,4L52,4L52,10');
    expect(SHAPE.getControlPoints()[1].instruction).toEqual('M100,52L106,52L106,58L100,58L100,52');
    expect(SHAPE.getControlPoints()[2].instruction).toEqual('M52,100L58,100L58,106L52,106L52,100');
    expect(SHAPE.getControlPoints()[3].instruction).toEqual('M10,52L4,52L4,58L10,58L10,52');
  });
  it('call to translate (5,5) should translate the rectangle as well as the control Points and their extremums', () => {
    const SHAPE = new SelectionRectangle(1, '', '');
    SHAPE.initialize(new PointService(10, 10));
    SHAPE.setLastPoint(new PointService(100, 100));
    SHAPE.generateRectangle();
    SHAPE.translate(5, 5);
    expect(SHAPE.getControlPoints()[0].instruction).toEqual('M57,15L63,15L63,9L57,9L57,15');
    expect(SHAPE.getControlPoints()[1].instruction).toEqual('M105,57L111,57L111,63L105,63L105,57');
    expect(SHAPE.getControlPoints()[2].instruction).toEqual('M57,105L63,105L63,111L57,111L57,105');
    expect(SHAPE.getControlPoints()[3].instruction).toEqual('M15,57L9,57L9,63L15,63L15,57');
    expect(SHAPE.instruction).toEqual('M15,15L105,15L105,105L15,105L15,15');
  });
  it('call to setExtremums should retrieve the correct extremums from the selected shapes', () => {
    const SHAPE = new SelectionRectangle(1, '', '');
    SHAPE.initialize(new PointService(10, 10));
    SHAPE.setLastPoint(new PointService(100, 100));
    const SHAPECONTAINER = new ShapesContainerService();
    const MOCKSHAPE1 = new Rectangle(1, '', '');
    MOCKSHAPE1.setSelect(true);
    MOCKSHAPE1.setMinimum(new PointService(1, 3));
    MOCKSHAPE1.setMaximum(new PointService(100, 100));
    const MOCKSHAPE2 = new Ellipse(1, '', '');
    MOCKSHAPE2.setSelect(false);
    MOCKSHAPE1.setMinimum(new PointService(0, 0));
    MOCKSHAPE1.setMaximum(new PointService(99, 101));
    SHAPECONTAINER.addShape(MOCKSHAPE1);
    SHAPECONTAINER.addShape(MOCKSHAPE2);
    SHAPE.setExtremums(SHAPECONTAINER);
    expect(SHAPE.getMinimum()).toEqual(MOCKSHAPE1.getMinimum());
    expect(SHAPE.getMaximum()).toEqual(MOCKSHAPE1.getMaximum());
  });
  it('call to updateExtremum((2,0)) on SHAPE with minimum (1,1) and maximum (2,2) should update the minimum', () => {
    const SHAPE = new SelectionRectangle(1, '', '');
    SHAPE.setMinimum(new PointService(1, 1));
    SHAPE.setMaximum(new PointService(2, 2));
    SHAPE.updateExtremums(new PointService(2, 0));
    expect(SHAPE.getMinimum()).toEqual(new PointService(1, 0));
  });
  it('call to updateExtremum((0,2)) on SHAPE with minimum (1,1) and maximum (2,2) should update the minimum', () => {
    const SHAPE = new SelectionRectangle(1, '', '');
    SHAPE.setMinimum(new PointService(1, 1));
    SHAPE.setMaximum(new PointService(2, 2));
    SHAPE.updateExtremums(new PointService(0, 2));
    expect(SHAPE.getMinimum()).toEqual(new PointService(0, 1));
  });
  it('call to updateExtremum((2,0)) on SHAPE with minimum (0,0) and maximum (1,1) should update the minimum', () => {
    const SHAPE = new SelectionRectangle(1, '', '');
    SHAPE.setMinimum(new PointService(1, 1));
    SHAPE.setMaximum(new PointService(2, 2));
    SHAPE.updateExtremums(new PointService(3, 0));
    expect(SHAPE.getMaximum()).toEqual(new PointService(3, 2));
  });
  it('call to updateExtremum((0,2)) on SHAPE with minimum (0,0) and maximum (1,1) should update the minimum', () => {
    const SHAPE = new SelectionRectangle(1, '', '');
    SHAPE.setMinimum(new PointService(1, 1));
    SHAPE.setMaximum(new PointService(2, 2));
    SHAPE.updateExtremums(new PointService(0, 3));
    expect(SHAPE.getMaximum()).toEqual(new PointService(2, 3));
  });
});
