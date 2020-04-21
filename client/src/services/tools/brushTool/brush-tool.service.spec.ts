import { inject, TestBed } from '@angular/core/testing';

import { PointService } from '../../point/point.service';
import { BrushToolService } from './brush-tool.service';

const DEFAULT_VALUE = 100;
describe('BrushToolService', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrushToolService = TestBed.get(BrushToolService);
    expect(service).toBeTruthy();
  });

  it('mouseclick should return true ', inject([BrushToolService], (service: BrushToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 100});
    service.mouseClicked = false;
    service.click(mockMouseEvent);
    expect(service.mouseClicked).toBe(true);
  }));

  it('mouseclick should initiate the spray shape ', inject([BrushToolService], (service: BrushToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 100});
    service.click(mockMouseEvent);
    expect(service.shapeInProgress).toBeDefined();
  }));

  it('mouseclick should generate instruction in spray shape ', inject([BrushToolService], (service: BrushToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 100});
    service.click(mockMouseEvent);
    expect(service.shapeInProgress.instruction).not.toEqual('');
  }));

  it('mouseclick should define the container ', inject([BrushToolService], (service: BrushToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 100});
    service.click(mockMouseEvent);
    expect(service.shapeContainer).toBeDefined();
  }));

  it('mousedrag should generate spray of clicked before ', inject([BrushToolService], (service: BrushToolService) => {

    const mockMouseEvent = new MouseEvent('drag', {clientX: 100, clientY: 100});
    const mockPoint = new PointService(DEFAULT_VALUE, DEFAULT_VALUE);
    service.click(mockMouseEvent);
    spyOn(service.shapeInProgress, 'generateSpray').withArgs(mockPoint);
    service.drag(mockMouseEvent);
    expect(service.shapeInProgress.generateSpray).toHaveBeenCalledWith(mockPoint);
  }));

  it('mousedrag should not generate spray if not clicked before ', inject([BrushToolService], (service: BrushToolService) => {

    const mockMouseEvent = new MouseEvent('drag', {clientX: 100, clientY: 100});
    const mockPoint = new PointService(DEFAULT_VALUE, DEFAULT_VALUE);
    service.click(mockMouseEvent);
    service.mouseClicked = false;
    spyOn(service.shapeInProgress, 'generateSpray').withArgs(mockPoint);
    service.drag(mockMouseEvent);
    expect(service.shapeInProgress.generateSpray).not.toHaveBeenCalledWith(mockPoint);
  }));

  it('MouseReleased should return true ', inject([BrushToolService], (service: BrushToolService) => {

    const mockMouseEvent = new MouseEvent('release', {clientX: 100, clientY: 100});
    service.click(mockMouseEvent);
    service.release(mockMouseEvent);
    expect(service.mouseClicked).toBe(false);
  }));

  it('MouseReleased should generate final pattern ', inject([BrushToolService], (service: BrushToolService) => {

    const mockMouseEvent = new MouseEvent('release', {clientX: 100, clientY: 100});
    service.click(mockMouseEvent);
    const mockPoint = new PointService(DEFAULT_VALUE, DEFAULT_VALUE);
    const mockShape = service.shapeInProgress;
    spyOn(mockShape, 'generateSpray');
    service.release(mockMouseEvent);
    expect(mockShape.generateSpray).toHaveBeenCalledWith(mockPoint);
  }));

  it('setRadius should change the radious of the pattern in the shape', inject([BrushToolService], (service: BrushToolService) => {

    const mockMouseEvent = new MouseEvent('mouseclick', {clientX: 100, clientY: 100});
    service.click(mockMouseEvent);
    const rad = 5;
    service.setRadius(rad);
    expect(service.shapeInProgress.radius).toEqual(rad);
  }));

  it('mouseLeave should generate final pattern ', inject([BrushToolService], (service: BrushToolService) => {
     const mockMouseEvent = new MouseEvent('mouseLeave', {clientX: 100, clientY: 100});
     service.mouseClicked = true;
     service.onMouseLeave(mockMouseEvent);
     expect(service.mouseClicked).toBe(false);
   }));

  });
