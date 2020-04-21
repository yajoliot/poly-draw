import {TestBed } from '@angular/core/testing';
import { PointService } from '../../point/point.service';
import { EllipseToolService } from './ellipse-tool.service';

describe('EllipseToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  it('should be created', () => {
    const service: EllipseToolService = TestBed.get(EllipseToolService);
    expect(service).toBeTruthy();
  });
  // tslint:disable-next-line: max-line-length
  it('call to click should initialize the shapeInProgress and rectangleInProgress, and add them to shapesInProgress in shape container', () => {
    const service: EllipseToolService = TestBed.get(EllipseToolService);
    const MOCKMOUSEVENT = new MouseEvent('click', { clientX: 100, clientY: 200 });
    service.click(MOCKMOUSEVENT);
    expect(service.mouseClicked).toBeTruthy();
    expect(service.shapeInProgress).toBeDefined();
    expect(service.rectangleInProgress).toBeDefined();
    expect(service.shapeInProgress.getInitial()).toEqual(new PointService(25, 125));
    expect(service.shapeInProgress.initialRect).toEqual(new PointService(25, 125));
    expect(service.shapeContainer.getShapesInProgress()[0]).toEqual(service.shapeInProgress);
    expect(service.shapeContainer.getShapesInProgress()[1]).toEqual(service.rectangleInProgress);
    expect(service.rectangleInProgress.getInitialPoint()).toEqual(new PointService(25, 125));
  });
  it('call to drag with not prior click should do nothing', () => {
    const service: EllipseToolService = TestBed.get(EllipseToolService);
    const MOCKMOUSEVENT = new MouseEvent('drag', { clientX: 200, clientY: 350 });
    service.drag(MOCKMOUSEVENT);
    expect(service.mouseClicked).toBeFalsy();
    expect(service.mouseLeftWhileClicked).toBeFalsy();
  });
  it('call to drag should generate the dashedRectangle, as well as generating and finding extremums for the ellipse', () => {
    const service: EllipseToolService = TestBed.get(EllipseToolService);
    const MOCKMOUSEVENT1 = new MouseEvent('click', { clientX: 100, clientY: 200 });
    const MOCKMOUSEVENT2 = new MouseEvent('drag', { clientX: 200, clientY: 350 });
    service.click(MOCKMOUSEVENT1);
    service.drag(MOCKMOUSEVENT2);
    expect(service.shapeInProgress.getInitial()).toEqual(service.shapeInProgress.initialRect);
    expect(service.rectangleInProgress.getLastPoint()).toEqual(new PointService(125, 275));
    expect(service.shapeInProgress.getMinimum()).toEqual(new PointService(25, 125));
    expect(service.shapeInProgress.getMaximum()).toEqual(new PointService(125, 275));
    expect(service.shapeInProgress.instruction).toEqual('M75,125 A50 , 75 0 0, 1 75 275 M75,125 A50 , 75 0 0, 0 75 275 ');
    expect(service.rectangleInProgress.instruction).toEqual('M25,125L125,125L125,275L25,275L25,125');
  });
  it('call to drag with not prior click should do nothing', () => {
    const service: EllipseToolService = TestBed.get(EllipseToolService);
    const MOCKMOUSEVENT = new MouseEvent('release');
    service.release(MOCKMOUSEVENT);
    expect(service.mouseClicked).toBeFalsy();
    expect(service.mouseLeftWhileClicked).toBeFalsy();
  });
  it('call to release should empty shapesInProgress and add its content to shapes in shapeContainer', () => {
    const service: EllipseToolService = TestBed.get(EllipseToolService);
    const MOCKMOUSEVENT1 = new MouseEvent('click', { clientX: 100, clientY: 200 });
    const MOCKMOUSEVENT2 = new MouseEvent('drag', { clientX: 200, clientY: 350 });
    const MOCKMOUSEVENT3 = new MouseEvent('release', { clientX: 201, clientY: 351 });
    service.click(MOCKMOUSEVENT1);
    service.drag(MOCKMOUSEVENT2);
    const ELLIPSE = service.shapeInProgress;
    service.release(MOCKMOUSEVENT3);
    expect(service.shapeContainer.getShapesInProgress()).toEqual([]);
    expect(service.shapeContainer.getShapes().get(0)).toEqual(ELLIPSE);
    expect(service.mouseClicked).toEqual(false);
    expect(service.shapeInProgress.instruction).toEqual('');
  });
  // tslint:disable-next-line: max-line-length
  it('call to keyBoardDown after click and drag should generate the correponding circle instruction without having drag to be called again, also, the extremum should follow appropriately ', () => {
    const service: EllipseToolService = TestBed.get(EllipseToolService);
    const MOCKMOUSEVENT1 = new MouseEvent('click', { clientX: 100, clientY: 200 });
    const MOCKMOUSEVENT2 = new MouseEvent('drag', { clientX: 200, clientY: 350 });
    const MOCKKEYBOARDEVENT = new KeyboardEvent('keydown', {
      code: '16',
      cancelable: true
    });
    service.click(MOCKMOUSEVENT1);
    service.drag(MOCKMOUSEVENT2);
    expect(service.shapeInProgress.getMinimum()).toEqual(new PointService(25, 125));
    expect(service.shapeInProgress.getMaximum()).toEqual(new PointService(125, 275));
    expect(service.shapeInProgress.instruction).toEqual('M75,125 A50 , 75 0 0, 1 75 275 M75,125 A50 , 75 0 0, 0 75 275 ');
    service.keyboardDown(MOCKKEYBOARDEVENT);
    expect(service.shapeInProgress.instruction).toEqual('M75,125 A50 , 75 0 0, 1 75 275 M75,125 A50 , 75 0 0, 0 75 275 ');
    expect(service.shapeInProgress.getMinimum()).toEqual(new PointService(25, 125));
    expect(service.shapeInProgress.getMaximum()).toEqual(new PointService(125, 275));
  });
  // tslint:disable-next-line: max-line-length
  it('call to keyBoardUp after click and drag should generate the correponding circle instruction without having drag to be called again, also, the extremum should follow appropriately ', () => {
    const service: EllipseToolService = TestBed.get(EllipseToolService);
    const MOCKMOUSEVENT1 = new MouseEvent('click', { clientX: 100, clientY: 200 });
    const MOCKMOUSEVENT2 = new MouseEvent('drag', { clientX: 200, clientY: 350 });
    // const MOCKKEYBOARDEVENT = new KeyboardEvent('KeyDown');
    const MOCKKEYBOARDEVENT1 = new KeyboardEvent('keydown', {
      key: 'Shift',
      cancelable: true
    });
    const MOCKKEYBOARDEVENT2 = new KeyboardEvent('keyup', {
      key: 'Shift',
      cancelable: true
    });
    service.click(MOCKMOUSEVENT1);
    service.drag(MOCKMOUSEVENT2);
    service.keyboardDown(MOCKKEYBOARDEVENT1);
    expect(service.shapeInProgress.instruction).toEqual('M75,125 A50 , 50 0 0, 1 75 225 M75,125 A50 , 50 0 0, 0 75 225 ');
    expect(service.shapeInProgress.getMinimum()).toEqual(new PointService(25, 125));
    expect(service.shapeInProgress.getMaximum()).toEqual(new PointService(125, 225));
    service.keyboardUp(MOCKKEYBOARDEVENT2);
    // expect(service.shapeInProgress.instruction).toEqual('M75,125 A50 , 75 0 0, 1 75 275 M75,125 A50 , 75 0 0, 0 75 275 ');
  });
  it('call to keyBoardUp with no prior click and drag should do nothing', () => {
    const service: EllipseToolService = TestBed.get(EllipseToolService);
    const MOCKKEYBOARDEVENT = new KeyboardEvent('keyup', {
      key: 'Ctrl',
      cancelable: true
    });
    const MOCKMOUSEVENT1 = new MouseEvent('click', { clientX: 100, clientY: 200 });
    const MOCKMOUSEVENT2 = new MouseEvent('drag', { clientX: 200, clientY: 350 });
    service.click(MOCKMOUSEVENT1);
    service.drag(MOCKMOUSEVENT2);
    service.keyboardUp(MOCKKEYBOARDEVENT);
    expect(service.shapeInProgress.shiftPressed).toBeFalsy();
  });
  it('call to keyBoardUp with event.key = shift  should set shiftPressed to true for shapeInProgress', () => {
    const service: EllipseToolService = TestBed.get(EllipseToolService);
    // const MOCKKEYBOARDEVENT = new KeyboardEvent('KeyDown');
    const MOCKKEYBOARDEVENT1 = new KeyboardEvent('keydown', {
      key: 'Shift',
      cancelable: true
    });
    const MOCKKEYBOARDEVENT2 = new KeyboardEvent('keyup', {
      key: 'Shift',
      cancelable: true
    });
    const MOCKMOUSEVENT1 = new MouseEvent('click', { clientX: 100, clientY: 200 });
    const MOCKMOUSEVENT2 = new MouseEvent('drag', { clientX: 200, clientY: 350 });
    service.click(MOCKMOUSEVENT1);
    service.drag(MOCKMOUSEVENT2);
    service.keyboardDown(MOCKKEYBOARDEVENT1);
    service.keyboardUp(MOCKKEYBOARDEVENT2);
    expect(service.shapeInProgress.shiftPressed).toBeFalsy();
  });
  it('call to onMouseLeave shoud do empty shapesInProgress, reset shapeInProgress, as well as the state variables', () => {
    const service: EllipseToolService = TestBed.get(EllipseToolService);
    const MOCKMOUSELEAVE = new MouseEvent('release');
    const MOCKMOUSEVENT1 = new MouseEvent('click', { clientX: 100, clientY: 200 });
    const MOCKMOUSEVENT2 = new MouseEvent('drag', { clientX: 200, clientY: 350 });
    service.click(MOCKMOUSEVENT1);
    service.drag(MOCKMOUSEVENT2);
    service.onMouseLeave(MOCKMOUSELEAVE);
    expect(service.shapeContainer.getShapesInProgress()).toEqual([]);
    expect(service.shapeInProgress.instruction).toEqual('');
    expect(service.mouseClicked).toBeFalsy();
    expect(service.mouseMoved).toBeFalsy();
  });
});
