import { TestBed, inject } from '@angular/core/testing';

import { BoundingBoxToolService } from './bounding-box-tool.service';
import { SelectionRectangle } from 'src/models/shapes/selectionRectangle/selection-rectangle';
import { DashedRectangle } from 'src/models/shapes/dashedRectangle/dashed-rectangle';
import { Rectangle } from 'src/models/shapes/rectangle/rectangle';
import { PointService } from 'src/services/point/point.service';

describe('BoundingBoxToolService', () => {
  
  beforeEach(() => TestBed.configureTestingModule({    providers: [
    {provide: SelectionRectangle, useclass: SelectionRectangle},
    {provide: DashedRectangle, useclass: DashedRectangle}
  ]}));

  it('should be created', () => {
    const service: BoundingBoxToolService = TestBed.get(BoundingBoxToolService);
    expect(service).toBeTruthy();
  });

  it('click sets lastPoint and adds boundingBox to shapesInProgress', inject([BoundingBoxToolService], (service: BoundingBoxToolService) => {
    service['boundingBox'] = new SelectionRectangle(1, '#000000', 'none');
    service['selectionRectangle'] = new DashedRectangle(1, '#000000', 'none');

    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    expect(service['lastPoint']).toBeUndefined();
    expect(service['shapeContainer'].getShapesInProgress().length).toEqual(0);

    spyOn(service['shapeContainer'], 'addShapeInProgress').and.callThrough();

    service.click(mockMouseEvent);

    expect(service['shapeContainer'].getShapesInProgress().length).toEqual(1);

    expect(service['shapeContainer'].addShapeInProgress).toHaveBeenCalled();

    expect(service['lastPoint']).not.toBeUndefined();

   expect(service['boundingBox']).not.toBeUndefined();
   expect(service['selectionRectangle']).not.toBeUndefined();
  }));

  it('initialize initializes a selection rectangle', inject([BoundingBoxToolService], (service: BoundingBoxToolService) => {
    service['boundingBox'] = new SelectionRectangle(1, '#000000', 'none');

    expect(service['selectionRectangle']).toBeUndefined();
    
    service.initialize(new DashedRectangle(1, '#000000', 'none'));

    expect(service['selectionRectangle']).not.toBeUndefined();

  }));

  it('drag calls renderBoundingBox', inject([BoundingBoxToolService], (service: BoundingBoxToolService) => {
    service['boundingBox'] = new SelectionRectangle(1, '#000000', 'none');
    service['selectionRectangle'] = new DashedRectangle(1, '#000000', 'none');

    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    spyOn(service, 'renderBoundingBox');

    service.drag(mockMouseEvent);

    expect(service.renderBoundingBox).toHaveBeenCalled();

  }));

  it('deRenderBoundingBox adds shapes selected by rightClick selection',
   inject([BoundingBoxToolService], (service: BoundingBoxToolService) => {

    service['boundingBox'] = new SelectionRectangle(1, '#000000', 'none');

    const rectangleOne = new Rectangle(10, '#123456', '#654321');
    const rectangleTwo = new Rectangle(10, '#123456', '#654321');
    const rectangleThree = new Rectangle(10, '#123456', '#654321');

    rectangleOne.initialize(new PointService(0,0));
    rectangleTwo.initialize(new PointService(0,0));
    rectangleThree.initialize(new PointService(0,0));

    rectangleOne.setLastPoint(new PointService(100,100));
    rectangleTwo.setLastPoint(new PointService(100,100));
    rectangleThree.setLastPoint(new PointService(100,100));

    rectangleOne.generate();
    rectangleTwo.generate();
    rectangleThree.generate();

    rectangleOne.setSelect(true);
    rectangleTwo.setSelect(true);
    rectangleThree.setSelect(true);

    service.shapeContainer.addShape(rectangleOne);
    service.shapeContainer.addShape(rectangleTwo);
    service.shapeContainer.addShape(rectangleThree);

    service['selectionRectangle'] = new DashedRectangle(10, '#123456', '#654321');
    service['selectionRectangle'].initialize(new PointService(0, 0));
    service['selectionRectangle'].setLastPoint(new PointService(1000, 1000));
    service['selectionRectangle'].generate();

    service.deRenderBoundingBox();

    // service.release(mockMouseEvent);

    expect(service['shapesUnselected'].length).toEqual(3);
  }));

  it('release should reset shapesUnselected to 0', inject([BoundingBoxToolService], (service: BoundingBoxToolService) => {
    service['boundingBox'] = new SelectionRectangle(1, '#000000', 'none');

    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    const rectangleOne = new Rectangle(10, '#123456', '#654321');
    const rectangleTwo = new Rectangle(10, '#123456', '#654321');
    const rectangleThree = new Rectangle(10, '#123456', '#654321');

    rectangleOne.initialize(new PointService(0,0));
    rectangleTwo.initialize(new PointService(0,0));
    rectangleThree.initialize(new PointService(0,0));

    rectangleOne.setLastPoint(new PointService(100,100));
    rectangleTwo.setLastPoint(new PointService(100,100));
    rectangleThree.setLastPoint(new PointService(100,100));

    rectangleOne.generate();
    rectangleTwo.generate();
    rectangleThree.generate();

    rectangleOne.setSelect(true);
    rectangleTwo.setSelect(true);
    rectangleThree.setSelect(true);

    service.shapeContainer.addShape(rectangleOne);
    service.shapeContainer.addShape(rectangleTwo);
    service.shapeContainer.addShape(rectangleThree);

    service['selectionRectangle'] = new DashedRectangle(10, '#123456', '#654321');
    service['selectionRectangle'].initialize(new PointService(0, 0));
    service['selectionRectangle'].setLastPoint(new PointService(1000, 1000));
    service['selectionRectangle'].generate();

    service.deRenderBoundingBox();

    service.release(mockMouseEvent);

    expect(service['shapesUnselected'].length).toEqual(0);
  }));

  it('renderBoundingBox adds shapes selected by leftClick selection',
   inject([BoundingBoxToolService], (service: BoundingBoxToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    const rectangleOne = new Rectangle(10, '#123456', '#654321');
    const rectangleTwo = new Rectangle(10, '#123456', '#654321');
    const rectangleThree = new Rectangle(10, '#123456', '#654321');

    rectangleOne.initialize(new PointService(0,0));
    rectangleTwo.initialize(new PointService(0,0));
    rectangleThree.initialize(new PointService(0,0));

    rectangleOne.setLastPoint(new PointService(100,100));
    rectangleTwo.setLastPoint(new PointService(100,100));
    rectangleThree.setLastPoint(new PointService(100,100));

    rectangleOne.generate();
    rectangleTwo.generate();
    rectangleThree.generate();

    rectangleOne.setSelect(false);
    rectangleTwo.setSelect(false);
    rectangleThree.setSelect(false);

    service.shapeContainer.addShape(rectangleOne);
    service.shapeContainer.addShape(rectangleTwo);
    service.shapeContainer.addShape(rectangleThree);

    service['selectionRectangle'] = new DashedRectangle(10, '#123456', '#654321');
    service['selectionRectangle'].initialize(new PointService(0, 0));
    service['selectionRectangle'].setLastPoint(new PointService(1000, 1000));
    service['selectionRectangle'].generate();

    service['boundingBox'] = new SelectionRectangle(10, '#123456', '#654321');
    service['boundingBox'].initialize(new PointService(0, 0));
    service['boundingBox'].setLastPoint(new PointService(0, 0));
    service['boundingBox'].generate();

    service.renderBoundingBox();

    service.release(mockMouseEvent);
    expect(rectangleOne.getSelect()).toEqual(true);
    expect(rectangleTwo.getSelect()).toEqual(true);
    expect(rectangleThree.getSelect()).toEqual(true);
  }));

  it('renderBoundingBox adds branches', inject([BoundingBoxToolService], (service: BoundingBoxToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    const rectangleOne = new Rectangle(10, '#123456', '#654321');
    const rectangleTwo = new Rectangle(10, '#123456', '#654321');
    const rectangleThree = new Rectangle(10, '#123456', '#654321');

    rectangleOne.initialize(new PointService(-1,-1));
    rectangleTwo.initialize(new PointService(5,-5));
    rectangleThree.initialize(new PointService(-5,10));

    rectangleOne.setLastPoint(new PointService(10000000000000,10000000000));
    rectangleTwo.setLastPoint(new PointService(100,-100));
    rectangleThree.setLastPoint(new PointService(-100,100));

    rectangleOne.generate();
    rectangleTwo.generate();
    rectangleThree.generate();

    rectangleOne.setSelect(false);
    rectangleTwo.setSelect(false);
    rectangleThree.setSelect(false);

    service.shapeContainer.addShape(rectangleOne);
    service.shapeContainer.addShape(rectangleTwo);
    service.shapeContainer.addShape(rectangleThree);

    service['selectionRectangle'] = new DashedRectangle(10, '#123456', '#654321');
    service['selectionRectangle'].initialize(new PointService(0, 0));
    service['selectionRectangle'].setLastPoint(new PointService(1000, 1000));
    service['selectionRectangle'].generate();

    service['boundingBox'] = new SelectionRectangle(10, '#123456', '#654321');
    service['boundingBox'].initialize(new PointService(0, 0));
    service['boundingBox'].setLastPoint(new PointService(0, 0));
    service['boundingBox'].generate();

    service.renderBoundingBox();

    service.release(mockMouseEvent);

    expect(rectangleOne.getSelect()).toEqual(true);
    expect(rectangleTwo.getSelect()).toEqual(true);
    expect(rectangleThree.getSelect()).toEqual(true);
  }));

  it('renderBoundingBox if not included in selection rectangle', inject([BoundingBoxToolService], (service: BoundingBoxToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    const rectangleOne = new Rectangle(10, '#123456', '#654321');
    const rectangleTwo = new Rectangle(10, '#123456', '#654321');
    const rectangleThree = new Rectangle(10, '#123456', '#654321');

    rectangleOne.initialize(new PointService(1,1));
    rectangleTwo.initialize(new PointService(1,1));
    rectangleThree.initialize(new PointService(1,1));

    rectangleOne.setLastPoint(new PointService(100,100));
    rectangleTwo.setLastPoint(new PointService(100,100));
    rectangleThree.setLastPoint(new PointService(100,100));

    rectangleOne.generate();
    rectangleTwo.generate();
    rectangleThree.generate();

    rectangleOne.setSelect(false);
    rectangleTwo.setSelect(false);
    rectangleThree.setSelect(false);

    service.shapeContainer.addShape(rectangleOne);
    service.shapeContainer.addShape(rectangleTwo);
    service.shapeContainer.addShape(rectangleThree);

    service['selectionRectangle'] = new DashedRectangle(10, '#123456', '#654321');
    service['selectionRectangle'].initialize(new PointService(0, 0));
    service['selectionRectangle'].setLastPoint(new PointService(0, 0));
    service['selectionRectangle'].generate();

    service['boundingBox'] = new SelectionRectangle(10, '#123456', '#654321');
    service['boundingBox'].initialize(new PointService(0, 0));
    service['boundingBox'].setLastPoint(new PointService(0, 0));
    service['boundingBox'].generate();

    service.renderBoundingBox();

    service.release(mockMouseEvent);
    expect(rectangleOne.getSelect()).toEqual(false);
    expect(rectangleTwo.getSelect()).toEqual(false);
    expect(rectangleThree.getSelect()).toEqual(false);
  }));

  it('resetBoundingBox unselects shapes', inject([BoundingBoxToolService], (service: BoundingBoxToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    const rectangleOne = new Rectangle(10, '#123456', '#654321');
    const rectangleTwo = new Rectangle(10, '#123456', '#654321');
    const rectangleThree = new Rectangle(10, '#123456', '#654321');

    rectangleOne.initialize(new PointService(0,0));
    rectangleTwo.initialize(new PointService(0,0));
    rectangleThree.initialize(new PointService(500,500));

    rectangleOne.setLastPoint(new PointService(100,100));
    rectangleTwo.setLastPoint(new PointService(100,100));
    rectangleThree.setLastPoint(new PointService(500,500));

    rectangleOne.generate();
    rectangleTwo.generate();
    rectangleThree.generate();

    rectangleOne.setSelect(true);
    rectangleTwo.setSelect(true);
    rectangleThree.setSelect(true);

    rectangleOne.findExtremums();
    rectangleTwo.findExtremums();
    rectangleThree.findExtremums();

    service.shapeContainer.addShape(rectangleOne);
    service.shapeContainer.addShape(rectangleTwo);
    service.shapeContainer.addShape(rectangleThree);

    service['selectionRectangle'] = new DashedRectangle(10, '#123456', '#654321');
    service['selectionRectangle'].initialize(new PointService(0, 0));
    service['selectionRectangle'].setLastPoint(new PointService(300, 300));
    service['selectionRectangle'].generate();

    service['boundingBox'] = new SelectionRectangle(10, '#123456', '#654321');

    service.deRenderBoundingBox();
    service.resetBoundingBox();
    service.release(mockMouseEvent);

    expect(rectangleOne.getSelect()).toEqual(false);
    expect(rectangleTwo.getSelect()).toEqual(false);
    expect(rectangleThree.getSelect()).toEqual(true);
  }));

  it('render and derender control points respectively add and remove control points',
   inject([BoundingBoxToolService], (service: BoundingBoxToolService) => {

    service['boundingBox'] = new SelectionRectangle(10, '#123456', '#654321');
    service['boundingBox'].initialize(new PointService(0, 0));
    service['boundingBox'].setLastPoint(new PointService(0, 0));
    service['boundingBox'].generate();
    service.shapeContainer.addShapeInProgress(service['boundingBox']);

    expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);

    service.renderControlPoints();

    expect(service.shapeContainer.getShapesInProgress().length).toEqual(5);
    service.deRenderControlPoints()

    expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);
  }));

  it('resetBoundingBox does not add boundingBox if it is empty', inject([BoundingBoxToolService], (service: BoundingBoxToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    const rectangleOne = new Rectangle(10, '#123456', '#654321');
    const rectangleTwo = new Rectangle(10, '#123456', '#654321');
    const rectangleThree = new Rectangle(10, '#123456', '#654321');

    rectangleOne.initialize(new PointService(500,500));
    rectangleTwo.initialize(new PointService(500,500));
    rectangleThree.initialize(new PointService(500,500));

    rectangleOne.setLastPoint(new PointService(500,500));
    rectangleTwo.setLastPoint(new PointService(500,500));
    rectangleThree.setLastPoint(new PointService(500,500));

    rectangleOne.generate();
    rectangleTwo.generate();
    rectangleThree.generate();

    rectangleOne.setSelect(false);
    rectangleTwo.setSelect(false);
    rectangleThree.setSelect(false);

    rectangleOne.findExtremums();
    rectangleTwo.findExtremums();
    rectangleThree.findExtremums();

    service.shapeContainer.addShape(rectangleOne);
    service.shapeContainer.addShape(rectangleTwo);
    service.shapeContainer.addShape(rectangleThree);

    service['selectionRectangle'] = new DashedRectangle(10, '#123456', '#654321');
    service['selectionRectangle'].initialize(new PointService(0, 0));
    service['selectionRectangle'].setLastPoint(new PointService(300, 300));
    service['selectionRectangle'].generate();

    service['boundingBox'] = new SelectionRectangle(10, '#123456', '#654321');

    service.deRenderBoundingBox();

    spyOn(service['shapeContainer'], 'addShapeInProgress');

    service.resetBoundingBox();
    service.release(mockMouseEvent);

    expect(service['shapeContainer'].addShapeInProgress).not.toHaveBeenCalled();

  }));
});
