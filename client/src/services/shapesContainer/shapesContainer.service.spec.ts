import { TestBed } from '@angular/core/testing';
import { Rectangle } from '../../models/shapes/rectangle/rectangle';
import {ShapesContainerService } from './shapesContainer.service';
import { PointService } from '../point/point.service';
import { ElementRef } from '@angular/core';


describe('ShapesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShapesContainerService = TestBed.get(ShapesContainerService);
    expect(service).toBeTruthy();
  });

  it ('getShapes', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    const rect = new Rectangle(1, '#000000', '#000000');
    service.getShapes().set(0, rect);
    const res = service.getShape(0);
    expect(res).toBe(rect);

  });

  it('undo redo', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    service.executeShapeCommand(new Rectangle(1, '#000000', '#000000'));
    service.undo();
    service.redo();
  });

  it('executeShapeCommand()', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    service.executeShapeCommand(new Rectangle(1, '#000000', '#000000'));
  });

  it('executeColorCommand()', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    service.executeColorCommand(new Rectangle(1, '#000000', '#000000'), '#0000FF');
  });

  it('executeTranslationCommand()', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    const rectArray = [new Rectangle(1, '#000000', '#000000'), new Rectangle(1,'#000000', '#000000')]
    service.executeTranslationCommand(rectArray, new PointService(1, 1));

  });

  it('addShapes', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    service.addShape(new Rectangle(1, '#000000', '#000000'))
    expect(service.getNumberOfShapesCreated()).toBe(1);
  });

  it('addShapes', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    service.addShape(new Rectangle(1, '#000000', '#000000'))
    service.addShape(new Rectangle(1, '#000000', '#000000'))
    expect(service.getNumberOfShapesCreated()).toBe(2);
  });

  it('addShapes defined', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    const rectMock = new Rectangle(1, '#000000', '#000000');
    rectMock.setShapeNumber(1);
    service.addShape(rectMock)
    expect(service.getNumberOfShapesCreated()).toBe(0);
  });

  it('addShapes undefined', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    const rectMock = new Rectangle(1, '#000000', '#000000');
    rectMock.setShapeNumber(undefined);
    service.addShape(rectMock)
    expect(service.getNumberOfShapesCreated()).toBe(1);
  });

  it('shapes in progress', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    service.addShapeInProgress(new Rectangle(1, '#000000', '#000000'));
    expect(service.getShapesInProgress().length).toBe(1);
    service.removeShapeInProgress();
    expect(service.getShapesInProgress().length).toBe(0);
  });

  it('specefic shape in progress', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    const rect = new Rectangle(1, '#000000', '#000000')
    service.addShapeInProgress(rect);
    expect(service.getShapesInProgress().length).toBe(1);
    service.removeSpecificShapeInProgress(rect);
    expect(service.getShapesInProgress().length).toBe(0);
  });

  it('specefic shape in progress -1', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    const rect = new Rectangle(1, '#000000', '#000000')
    expect(service.getShapesInProgress().length).toBe(0);
    service.removeSpecificShapeInProgress(rect);
  });

  it ('emptyShapes()', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    service.addShape(new Rectangle(1, '#000000', '#000000'));
    service.addShape(new Rectangle(1, '#000000', '#000000'));
    service.addShape(new Rectangle(1, '#000000', '#000000'));

    expect(service.getShapes().size).toBe(3);
    service.emptyShapes()
    expect(service.getShapes().size).toBe(0);
  });

  it('removeShape()', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    const rect = new Rectangle(1, '#000000', '#000000')
    service.addShape(rect);
    service.removeShape(rect);
  });

  it('removeShape()', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    const rect = new Rectangle(1, '#000000', '#000000');
    rect.setShapeNumber(null);
    service.removeShape(rect);
  });

  it('shapesInProgress', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    service.addShapeInProgress(new Rectangle(1, '#000000', '#000000'));
    service.removeShapeInProgress();
    expect(service.getShapesInProgress().length).toBe(0)
  })

  it('rando functs', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    service.getShapesToAdd();
    service.getShapesInProgress();
    service.getShapesToRemove();
    service.removeShapeToAdd();
    service.removeShapeToRemove();
    service.getNumberOfShapesCreated();
    const mockEl = new ElementRef(1);
    service.setElementRef(0, mockEl);
  });

  it('getShape()', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    const rect = new Rectangle(1, '#000000', '#000000')
    service.addShape(rect);
    expect(service.getShape(0)).toBe(rect);
  });

  it('selectionAll()', () => {
    const service: ShapesContainerService = new ShapesContainerService();
    service.addShape(new Rectangle(1, '#000000', '#000000'));
    service.addShape(new Rectangle(1, '#000000', '#000000'));
    service.addShape(new Rectangle(1, '#000000', '#000000'));
    service.selectionAll(true);

  });

});
