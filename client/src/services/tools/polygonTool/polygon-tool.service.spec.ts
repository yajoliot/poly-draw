import { inject, TestBed } from '@angular/core/testing';
// import { DashedRectangle } from 'src/models/shapes/dashedRectangle/dashed-rectangle';
// import { Polygon } from 'src/models/shapes/polygon/polygon';
import { PointService } from '../../point/point.service';
import { PolygonToolService } from './polygon-tool.service';
import { Polygon } from 'src/models/shapes/polygon/polygon';
import { LineShape } from 'src/models/shapes/line/line';


const X = 100;
const Y = 200;
describe('PolygonToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PolygonToolService = TestBed.get(PolygonToolService);
    expect(service).toBeTruthy();
  });

  it('click() call', ()=> {
    const service: PolygonToolService = TestBed.get(PolygonToolService);
    service.click(new MouseEvent('click', {}));
  })

  it('drag() call', ()=> {
    const service: PolygonToolService = TestBed.get(PolygonToolService);
    let polyMock = new Polygon(1, '#000000', '#000000');
    let lineMock = new LineShape(1, '#000000', '#000000');
    lineMock.setDestination(new PointService(1, 1));
    polyMock.setLines([lineMock])
    polyMock.setVertices([new PointService(1, 1)]);
    service.shapeInProgress = polyMock;
    service.mouseClicked = true;
    service.drag(new MouseEvent('click', {}));
    service.mouseClicked = false;
    service.drag(new MouseEvent('click', {}));
    service.release(new MouseEvent('click', {}));

  });

  it('mouseLeave calls', () => {
    const service: PolygonToolService = TestBed.get(PolygonToolService);
    service.mouseClicked = true;
    service.onMouseLeave(new MouseEvent('click', {}));
    service.mouseClicked = false;
    service.onMouseLeave(new MouseEvent('click', {}));
  });

  it('mouseclick should return true ', inject([PolygonToolService], (service: PolygonToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: X, clientY: Y});
    service.mouseClicked = false;
    service.click(mockMouseEvent);
    expect(service.mouseClicked).toBe(true);
  }));

  it('mouseRelease should return true ', inject([PolygonToolService], (service: PolygonToolService) => {

    const mockMouseEvent = new MouseEvent('release', {clientX: X, clientY: Y});
    service.click(mockMouseEvent);
    service.release(mockMouseEvent);
    expect(service.mouseClicked).toBe(false);
  }));

  it('mouseDrag should generate rectangle if clicked before', inject([PolygonToolService], (service: PolygonToolService) => {

    const mockMouseEvent = new MouseEvent('drag', {clientX: X, clientY: Y});
    service.click(mockMouseEvent);
    spyOn(service.rectangleInProgress, 'generate');
    service.drag(mockMouseEvent);
    expect(service.rectangleInProgress.generate).toHaveBeenCalled();
  }));

  it('mouseDrag should generate polygon if clicked before', inject([PolygonToolService], (service: PolygonToolService) => {

    const mockMouseEvent = new MouseEvent('drag', {clientX: X, clientY: Y});
    service.click(mockMouseEvent);
    const mockPoint = new PointService(X, Y);
    spyOn(service.shapeInProgress, 'generatePolygon').withArgs(mockPoint);
    service.drag(mockMouseEvent);
    expect(service.shapeInProgress.generatePolygon).toHaveBeenCalledWith(mockPoint);
  }));

  it('mouseRelease should remove the old shape ', inject([PolygonToolService], (service: PolygonToolService) => {

    const mockMouseEvent = new MouseEvent('release', {clientX: X, clientY: Y});
    service.click(mockMouseEvent);
    spyOn(service.shapeContainer, 'removeShapeInProgress');
    service.release(mockMouseEvent);
    expect(service.shapeContainer.removeShapeInProgress).toHaveBeenCalledTimes(2);
  }));

  it('mouseRelease should find extremum of the shape of selection ', inject([PolygonToolService], (service: PolygonToolService) => {

    const mockMouseEvent = new MouseEvent('release', {clientX: X, clientY: Y});
    service.click(mockMouseEvent);
    spyOn(service.shapeInProgress, 'findExtremums');
    service.release(mockMouseEvent);
    expect(service.shapeInProgress.findExtremums).toHaveBeenCalled();
  }));

  it('slider Should change value of number of sides ', inject([PolygonToolService], (service: PolygonToolService) => {

    const mockMouseEvent = new MouseEvent('release', {clientX: X, clientY: Y});
    service.click(mockMouseEvent);
    const initSides = 3;
    const newValue = 5;
    service.shapeInProgress.sides = initSides;
    service.setSides(newValue);
    expect(service.shapeInProgress.sides).toBe(newValue);
  }));

  it('mouseLeave if clicked before should execute command pattern ', inject([PolygonToolService], (service: PolygonToolService) => {

    const mockMouseEvent = new MouseEvent('release', {clientX: X, clientY: Y});
    service.click(mockMouseEvent);
    const currentShape = service.shapeInProgress;
    spyOn(service.shapeContainer, 'executeShapeCommand').withArgs(currentShape);
    service.onMouseLeave(mockMouseEvent);
    expect(service.shapeContainer.executeShapeCommand).toHaveBeenCalledWith(currentShape);
  }));

  it('mouseDrag should not generate polygon if not clicked before', inject([PolygonToolService], (service: PolygonToolService) => {

    const mockMouseEvent = new MouseEvent('drag', {clientX: X, clientY: Y});
    service.click(mockMouseEvent);
    service.mouseClicked = false;
    spyOn(service.rectangleInProgress, 'generate');
    service.drag(mockMouseEvent);
    expect(service.rectangleInProgress.generate).not.toHaveBeenCalled();
  }));
  it('mouseLeave if notClicked before should remove shapeInProgress ', inject([PolygonToolService], (service: PolygonToolService) => {

    const mockMouseEvent = new MouseEvent('release', {clientX: X, clientY: Y});
    service.click(mockMouseEvent);
    service.mouseClicked = false;
    spyOn(service.shapeContainer, 'removeShapeInProgress');
    service.onMouseLeave(mockMouseEvent);
  }));

});
