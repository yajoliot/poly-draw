import { /* inject, */ TestBed, inject } from '@angular/core/testing';

/* import { Rectangle } from 'src/models/shapes/rectangle/rectangle';
import { PointService } from '../point/point.service'; */
import { RectangleToolService } from './rectangle-tool.service';
import { Rectangle } from 'src/models/shapes/rectangle/rectangle';
import { PointService } from '../../point/point.service';

describe('RectangleToolService', () => {
  const OFFSET = 75;

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RectangleToolService = TestBed.get(RectangleToolService);
    expect(service).toBeTruthy();
  });

  it('mouseclick should return true ', inject([RectangleToolService], (service: RectangleToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 200});
    service.mouseClicked = false;
    service.shapeInProgress = new Rectangle(1, '#000000FF',  '#000000FF');
    const point = new PointService(25, 115);
    service.shapeInProgress.setLastPoint(point);
    service.click(mockMouseEvent);
    expect(service.mouseClicked).toBe(true);
  }));

  it('mouseRelease should return true ', inject([RectangleToolService], (service: RectangleToolService) => {

    const mockMouseEvent = new MouseEvent('release', {clientX: 100, clientY: 200});
    service.mouseClicked = true;
    service.shapeInProgress = new Rectangle(1, '#000000FF',  '#000000FF');
    const point = new PointService(25, 115);
    service.shapeInProgress.initialize(point);
    service.shapeInProgress.setLastPoint(point);
    service.release(mockMouseEvent);
    expect(service.mouseClicked).toBe(false);
  }));

  it('mouseDrag should generate instruction and setLastPoint if mouse is clicked beforehand',
   inject([RectangleToolService], (service: RectangleToolService) => {

    const mockMouseEvent = new MouseEvent('drag', {clientX: 100, clientY: 200});
    service.mouseClicked = true;

    const ORIGIN = new PointService(0,0);

    service.shapeInProgress = new Rectangle(1, '#000000FF',  '#000000FF');
    service.shapeInProgress.initialize(ORIGIN);

    spyOn(service.shapeInProgress, 'generate').withArgs();

    service.drag(mockMouseEvent);

    expect(service.shapeInProgress.getLastPoint()).toEqual(new PointService(100 - OFFSET, 200 - OFFSET));

    expect(service.shapeInProgress.generate).toHaveBeenCalledWith();
  }));

  it('mouseDrag should not generate instruction if wasnt clicked previously',
   inject([RectangleToolService], (service: RectangleToolService) => {

    const mockMouseEvent = new MouseEvent('drag', {clientX: 100, clientY: 200});
    service.mouseClicked = false;
    const point = new PointService(25, 115);
    service.shapeInProgress = new Rectangle(1, '#000000FF',  '#000000FF');
    service.shapeInProgress.setLastPoint(point);
    spyOn(service.shapeInProgress, 'generate').withArgs();
    service.drag(mockMouseEvent);
    expect(service.shapeInProgress.generate).not.toHaveBeenCalledWith();
  }));

  it('onMouseLeave should stop drawing ', inject([RectangleToolService], (service: RectangleToolService) => {

    const mockMouseEvent = new MouseEvent('drag', {clientX: 100, clientY: 200});
    service.mouseClicked = true;
    service.shapeInProgress = new Rectangle(1, '#000000FF',  '#000000FF');
    const point = new PointService(25, 115);
    service.shapeInProgress.initialize(point);
    service.shapeInProgress.setLastPoint(point);
    service.onMouseLeave(mockMouseEvent);
    expect(service.mouseClicked).toBe(false);
  }));

  it('shiftPressed should return true and generateSquare is called if shift is pressed',
   inject([RectangleToolService], (service: RectangleToolService) => {

    const mockKeyEvent = new KeyboardEvent('keydown', {key: 'Shift'});
    service.shapeInProgress = new Rectangle(1, '#000000FF',  '#000000FF');

    spyOn(service.shapeInProgress, 'generateRectangle').withArgs();
    spyOn(service.shapeInProgress, 'generateSquare').withArgs();

    service.shapeInProgress.shiftPressed = false;
    const point = new PointService(25, 115);
    service.shapeInProgress.initialize(point);
    service.shapeInProgress.setLastPoint(point);

    service.keyboardDown(mockKeyEvent);

    expect(service.shapeInProgress.shiftPressed).toBe(true);
    expect(service.shapeInProgress.generateRectangle).not.toHaveBeenCalledWith();
    expect(service.shapeInProgress.generateSquare).toHaveBeenCalledWith();

  }));

  it('an other keyEvent should not draw a square ', inject([RectangleToolService], (service: RectangleToolService) => {

    const mockKeyEvent = new KeyboardEvent('keydown', {key: 'UP'});
    service.shapeInProgress = new Rectangle(1, '#000000FF',  '#000000FF');
    service.shapeInProgress.shiftPressed = false;
    const point = new PointService(25, 115);
    service.shapeInProgress.initialize(point);

    spyOn(service.shapeInProgress, 'generateRectangle').withArgs();
    spyOn(service.shapeInProgress, 'generateSquare').withArgs();

    service.keyboardDown(mockKeyEvent);

    expect(service.shapeInProgress.generateRectangle).toHaveBeenCalledWith();
    expect(service.shapeInProgress.generateSquare).not.toHaveBeenCalledWith();

  }));

  it('shiftPressed should return false and generateRectangle is called if shift is released ',
   inject([RectangleToolService], (service: RectangleToolService) => {

    const mockKeyEvent = new KeyboardEvent('keyup', {key: 'Shift'});
    service.shapeInProgress = new Rectangle(1, '#000000FF',  '#000000FF');
    service.mouseClicked = true;
    service.shapeInProgress.shiftPressed = true;

    const point = new PointService(25, 115);

    service.shapeInProgress.initialize(point);
    service.shapeInProgress.setLastPoint(point);

    spyOn(service.shapeInProgress, 'generate').withArgs();
    spyOn(service.shapeInProgress, 'generateSquare').withArgs();

    service.keyboardUp(mockKeyEvent);

    expect(service.shapeInProgress.generate).toHaveBeenCalledWith();
    expect(service.shapeInProgress.generateSquare).not.toHaveBeenCalledWith();

    expect(service.shapeInProgress.shiftPressed).toBe(false);
  }));

  it('shiftPressed should still be true if another key is released ', inject([RectangleToolService], (service: RectangleToolService) => {

    const mockKeyEvent = new KeyboardEvent('keydown', {key: 'Yeehaw'});
    service.shapeInProgress = new Rectangle(1, '#000000FF',  '#000000FF');
    service.shapeInProgress.shiftPressed = true;

    const point = new PointService(25, 115);

    service.shapeInProgress.initialize(point);
    service.shapeInProgress.setLastPoint(point);

    spyOn(service.shapeInProgress, 'generate');
    spyOn(service.shapeInProgress, 'generateSquare').withArgs();

    service.keyboardUp(mockKeyEvent);

    expect(service.shapeInProgress.generate).toHaveBeenCalled();
    expect(service.shapeInProgress.generateSquare).not.toHaveBeenCalled();

    expect(service.shapeInProgress.shiftPressed).toBe(true);
  }));

  it('click sets mouse clicked to true and initialized a rectangle', inject([RectangleToolService], (service: RectangleToolService) => {

    const mockMouseEvent = new MouseEvent('mousedown', {clientX: 100, clientY: 200}); 

    service.mouseClicked = false;

    const point = new PointService(100 - OFFSET, 200 - OFFSET);

    spyOn(service.shapeContainer, 'addShapeInProgress');

    service.click(mockMouseEvent);

    expect(service.shapeContainer.addShapeInProgress).toHaveBeenCalled();
    expect(service.shapeInProgress.getInitialPoint()).toEqual(point);

    expect(service.mouseClicked).toBe(true);
  }));

});
