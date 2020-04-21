import { inject, TestBed } from '@angular/core/testing';

import { PencilShape } from 'src/models/shapes/pencil-shape/pencil-shape';
import { PointService } from '../../point/point.service';
import { PencilService } from './pencil.service';
const x = 25;
const y = 125;
describe('PencilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PencilService = TestBed.get(PencilService);
    expect(service).toBeTruthy();
  });

  it('mouseclick should return true ', inject([PencilService], (service: PencilService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 200});
    service.mouseClicked = false;
    service.click(mockMouseEvent);
    expect(service.mouseClicked).toBe(true);
  }));

  it('mouseDrag should call drawline if clicked before', inject([PencilService], (service: PencilService) => {

    const mockMouseEvent = new MouseEvent('drag', {clientX: 100, clientY: 200});
    service.mouseClicked = true;
    const point = new PointService(x, y);
    service.shapeInProgress = new PencilShape(1, '#000000FF',  '#000000FF');
    spyOn(service.shapeInProgress, 'drawLine').withArgs(point);
    service.drag(mockMouseEvent);
    expect(service.shapeInProgress.drawLine).toHaveBeenCalledWith(point);
  }));

  it('mouseDrag should not call drawline if is not clicked ', inject([PencilService], (service: PencilService) => {

    const mockMouseEvent = new MouseEvent('drag', {clientX: 100, clientY: 200});
    service.mouseClicked = false;
    const point = new PointService(x, y);
    service.shapeInProgress = new PencilShape(1, '#000000FF',  '#000000FF');
    service.shapeInProgress.initialize(point);
    spyOn(service.shapeInProgress, 'drawLine').withArgs(point);
    service.drag(mockMouseEvent);
    expect(service.shapeInProgress.drawLine).not.toHaveBeenCalledWith(point);
  }));

  it('mouseDrag should return true if moved', inject([PencilService], (service: PencilService) => {
    const mockMouseEvent = new MouseEvent('drag', {clientX: 100, clientY: 200});
    service.mouseMoved = false;
    service.mouseClicked = false;
    service.drag(mockMouseEvent);
    expect(service.mouseMoved).toBe(true);
  }));

  it('mouseLeave should stop the drawing with the pencil ', inject([PencilService], (service: PencilService) => {
    const mockMouseEvent = new MouseEvent('mouseLeave', {clientX: 100, clientY: 200});
    service.mouseClicked = true;
    service.onMouseLeave(mockMouseEvent);
    expect(service.mouseClicked).toBe(false);
  }));

  it('mouseRelease should remove last shape ', inject([PencilService], (service: PencilService) => {

    const mockMouseEvent = new MouseEvent('release', {clientX: 100, clientY: 200});
    service.shapeInProgress = new PencilShape(1, '#000000FF',  '#000000FF');
    service.click(mockMouseEvent);
    spyOn(service.shapeContainer, 'removeShapeInProgress');
    service.release(mockMouseEvent);
    expect(service.shapeContainer.removeShapeInProgress).toHaveBeenCalled();
  }));

  it('mouseRelease should return true ', inject([PencilService], (service: PencilService) => {

    const mockMouseEvent = new MouseEvent('release', {clientX: 100, clientY: 200});
    service.shapeInProgress = new PencilShape(1, '#000000FF',  '#000000FF');
    service.click(mockMouseEvent);
    service.release(mockMouseEvent);
    expect(service.mouseClicked).toEqual(false);
  }));

});
