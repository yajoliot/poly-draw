import { inject, TestBed } from '@angular/core/testing';
import { Rectangle } from 'src/models/shapes/rectangle/rectangle';
import { EraserToolService } from './eraser-tool.service';
import { PointService } from '../../point/point.service';

// const OFFSET = 75;

describe('EraserToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EraserToolService = TestBed.get(EraserToolService);
    expect(service).toBeTruthy();
  });

  it('eraser changes size with input ', inject([EraserToolService], (service: EraserToolService) => {
    const INPUT = 5;
    service.setEraserSize(INPUT);
    expect(service.eraserSize).toEqual(INPUT);
  }));

  it('mouseclick should erase shape if selected before ', inject([EraserToolService], (service: EraserToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 100});
    const RECTANGLE =  new Rectangle(1, '#000000', '#000000');
    service.currentShape = RECTANGLE;
    service.currentShape.setSelect(true);
    spyOn(service.shapeContainer, 'removeShape').withArgs(RECTANGLE);
    service.click(mockMouseEvent);
    expect(service.shapeContainer.removeShape).toHaveBeenCalledWith(RECTANGLE);
  }));

  it('mouseclick should not erase shape if shape is not selected ', inject([EraserToolService], (service: EraserToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 100});
    const RECTANGLE =  new Rectangle(1, '#000000', '#000000');
    service.currentShape = RECTANGLE;
    service.currentShape.setSelect(false);
    spyOn(service.shapeContainer, 'removeShape').withArgs(RECTANGLE);
    service.click(mockMouseEvent);
    expect(service.shapeContainer.removeShape).not.toHaveBeenCalledWith(RECTANGLE);
  }));

  it('renderBoundingBox should find extremum of the eraser', inject([EraserToolService], (service: EraserToolService) => {

    service.eraserSquare = new Rectangle(1, '#ffffff', '#000000');
    spyOn(service.eraserSquare, 'findExtremums');
    service.renderBoundingBox();
    expect(service.eraserSquare.findExtremums).toHaveBeenCalled();
  }));

  it('renderBoundingBox should find extremum of the eraser', inject([EraserToolService], (service: EraserToolService) => {

    service.eraserSquare = new Rectangle(1, '#ffffff', '#000000');
    spyOn(service.eraserSquare, 'findExtremums');
    service.renderBoundingBox();
    expect(service.eraserSquare.findExtremums).toHaveBeenCalled();
  }));

  it('mouseDrag should render box', inject([EraserToolService], (service: EraserToolService) => {

    const mockMouseEvent = new MouseEvent('drag', {clientX: 100, clientY: 100});
    spyOn(service, 'renderBoundingBox');

    service.currentShape = new Rectangle(1, '#ffffff', '#000000');

    service.drag(mockMouseEvent);
    expect(service.renderBoundingBox).toHaveBeenCalled();
  }));

  it('mouseDrag should generate the eraser', inject([EraserToolService], (service: EraserToolService) => {

    const mockMouseEvent = new MouseEvent('drag', {clientX: 100, clientY: 100});
    service.eraserSquare =  new Rectangle(1, '#ffffff', '#000000');

    expect(service.eraserSquare.instruction).toEqual('');

    service.currentShape = new Rectangle(1, '#ffffff', '#000000');

    service.drag(mockMouseEvent);
    expect(service.eraserSquare.instruction).not.toEqual('');
  }));

  it('renderBoundingBox should find eraserSquare extremums', inject([EraserToolService], (service: EraserToolService) => {

    service.eraserSquare =  new Rectangle(1, '#ffffff', '#000000');

    const origin = new PointService(0, 0);
    const destination = new PointService(100, 100);

    service.eraserSquare.initialize(origin);
    service.eraserSquare.setLastPoint(destination);
    service.eraserSquare.generate();

    spyOn(service.eraserSquare, 'findExtremums');

    const shape = new Rectangle(1, '#ffffff', '#000000');
    shape.initialize(origin);
    shape.setLastPoint(destination);
    shape.generate();

    service.shapeContainer.addShape(shape);

    service.renderBoundingBox();

    expect(service.eraserSquare.findExtremums).toHaveBeenCalled();
  }));

  it('renderBoundingBox should add shape to currentShape', inject([EraserToolService], (service: EraserToolService) => {

    service.eraserSquare =  new Rectangle(1, '#ffffff', '#000000');

    const origin = new PointService(0, 0);
    const destination = new PointService(100, 100);

    service.eraserSquare.initialize(origin);
    service.eraserSquare.setLastPoint(destination);
    service.eraserSquare.generate();

    spyOn(service.eraserSquare, 'findExtremums');

    const shape = new Rectangle(1, '#ffffff', '#000000');
    shape.initialize(origin);
    shape.setLastPoint(destination);
    shape.generate();

    spyOn(shape, 'setSelect');

    service.shapeContainer.addShape(shape);

    service.renderBoundingBox();

    expect(shape.setSelect).toHaveBeenCalledWith(true);

    expect(service.currentShape).toEqual(shape);

    expect(service.shapeContainer.getShapesInProgress().length).toEqual(2);
    expect(service.eraserSquare.findExtremums).toHaveBeenCalled();
  }));

  it('renderBoundingBox should removeSelected shape if not detected by eraserShape',
   inject([EraserToolService], (service: EraserToolService) => {

    service.eraserSquare =  new Rectangle(1, '#ffffff', '#000000');

    const origin = new PointService(10000000, 0);
    const destination = new PointService(200, 200);
    const originTwo = new PointService(2000, 2000);
    const destinationTwo = new PointService(2000, 2000);

    service.eraserSquare.initialize(origin);
    service.eraserSquare.setLastPoint(destination);
    service.eraserSquare.generate();

    service.eraserSquare.setMaximum(new PointService(-1111111,-111111));
    service.eraserSquare.setMinimum(new PointService(-111111,-11111));

    spyOn(service.eraserSquare, 'findExtremums');

    const shape = new Rectangle(1, '#ffffff', '#000000');
    shape.initialize(originTwo);
    shape.setLastPoint(destinationTwo);
    shape.generate();
    shape.setSelect(true);

    const SHAPERECT = new Rectangle(1, '', '');
    SHAPERECT.initialize(shape.getMinimum());
    SHAPERECT.setLastPoint(shape.getMaximum());
    SHAPERECT.findExtremums();

    service.shapeSelected = 2;

    service.shapeContainer.addShape(shape);

    service.currentShape = new Rectangle(1, '', '') ;

    service.renderBoundingBox();

    expect(shape.getSelect()).toBeTruthy();

    expect(shape.detectRectangleIntersection(service.eraserSquare)).toEqual(false);
    expect(SHAPERECT.detectRectangleInclusion(service.eraserSquare)).toEqual(false);
    expect(service.eraserSquare.detectRectangleInclusion(SHAPERECT)).toEqual(false);

  }));

  it('renderBoundingBox should remove currentShape if shapeselected is 1', inject([EraserToolService], (service: EraserToolService) => {

    service.eraserSquare =  new Rectangle(1, '#ffffff', '#000000');

    const origin = new PointService(0, 0);
    const destination = new PointService(100, 100);

    service.eraserSquare.initialize(origin);
    service.eraserSquare.setLastPoint(destination);
    service.eraserSquare.generate();

    spyOn(service.shapeContainer, 'removeSpecificShapeInProgress');

    const shape = new Rectangle(1, 'rgb(255,0,0,1)', 'rgb(255,0,0,1)');
    shape.initialize(origin);
    shape.setLastPoint(destination);
    shape.generate();

    shape.setSelect(false);

    service.shapeSelected = 1;

    service.shapeContainer.addShape(shape);

    service.currentShape = new Rectangle(1, 'rgb(255,0,0,1)', 'rgb(255,0,0,1)');

    service.renderBoundingBox();

    expect(service.shapeContainer.removeSpecificShapeInProgress).toHaveBeenCalled();

  }));

  it('renderBoundingBox should change color to red currentShape if shapeselected is 0',
   inject([EraserToolService], (service: EraserToolService) => {

    service.eraserSquare =  new Rectangle(1, '#ffffff', '#000000');

    const origin = new PointService(0, 0);
    const destination = new PointService(100, 100);

    service.eraserSquare.initialize(origin);
    service.eraserSquare.setLastPoint(destination);
    service.eraserSquare.generate();

    spyOn(service.eraserSquare, 'findExtremums');

    const shape = new Rectangle(1, 'rgb(255,0,0,1)', 'rgb(255,0,0,1)');
    shape.initialize(origin);
    shape.setLastPoint(destination);
    shape.generate();

    shape.setSelect(false);

    service.shapeSelected = 0;

    service.shapeContainer.addShape(shape);

    service.currentShape = new Rectangle(1, 'rgb(255,0,0,1)', 'rgb(255,0,0,1)');

    service.renderBoundingBox();

    expect(shape.getMainColor()).toEqual('rgb(200,0,0)');
  }));

  it('release sets isClicked to false', inject([EraserToolService], (service: EraserToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 100});

    service.isClicked = true;

    service.release(mockMouseEvent);

    expect(service.isClicked).toEqual(false);
  }));

  it('renderBoundingBox does nothing if getSelect = false and eraserRectangle does not detect anything',
   inject([EraserToolService], (service: EraserToolService) => {

    service.eraserSquare =  new Rectangle(1, '#ffffff', '#000000');

    const origin = new PointService(10000000, 0);
    const destination = new PointService(200, 200);
    const originTwo = new PointService(2000, 2000);
    const destinationTwo = new PointService(2000, 2000);

    service.eraserSquare.initialize(origin);
    service.eraserSquare.setLastPoint(destination);
    service.eraserSquare.generate();

    service.eraserSquare.setMaximum(new PointService(-1111111,-111111));
    service.eraserSquare.setMinimum(new PointService(-111111,-11111));

    spyOn(service.eraserSquare, 'findExtremums');;

    const shape = new Rectangle(1, '#ffffff', '#000000');
    shape.initialize(originTwo);
    shape.setLastPoint(destinationTwo);
    shape.generate();
    shape.setSelect(false);

    const SHAPERECT = new Rectangle(1, '', '');
    SHAPERECT.initialize(shape.getMinimum());
    SHAPERECT.setLastPoint(shape.getMaximum());
    SHAPERECT.findExtremums();

    service.shapeSelected = 2;

    service.shapeContainer.addShape(shape);

    service.currentShape = new Rectangle(1, '', '') ;

    service.renderBoundingBox();

    expect(shape.getSelect()).toBeTruthy();

    expect(shape.detectRectangleIntersection(service.eraserSquare)).toEqual(false);
    expect(SHAPERECT.detectRectangleInclusion(service.eraserSquare)).toEqual(false);
    expect(service.eraserSquare.detectRectangleInclusion(SHAPERECT)).toEqual(false);

  }));

  it('renderBoundingBox should change color to red currentShape if shapeselected is 0',
   inject([EraserToolService], (service: EraserToolService) => {

    service.eraserSquare =  new Rectangle(1, '#ffffff', '#000000');

    const origin = new PointService(0, 0);
    const destination = new PointService(100, 100);

    service.eraserSquare.initialize(origin);
    service.eraserSquare.setLastPoint(destination);
    service.eraserSquare.generate();

    spyOn(service.eraserSquare, 'findExtremums');

    const shape = new Rectangle(1, 'rgb(255,0,0,1)', 'rgb(255,0,0,1)');
    shape.initialize(origin);
    shape.setLastPoint(destination);
    shape.generate();

    shape.setSelect(false);

    service.shapeSelected = 3;

    service.shapeContainer.addShape(shape);

    service.currentShape = new Rectangle(1, 'rgb(255,0,0,1)', 'rgb(255,0,0,1)');

    service.renderBoundingBox();

    expect(shape.getMainColor()).toEqual('rgb(255,0,0,1)');
  }));
});
