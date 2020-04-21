import { TestBed, inject } from '@angular/core/testing';
import { PipetteToolService } from './pipette-tool.service';
import { ElementRef } from '@angular/core';
import { Rectangle } from 'src/models/shapes/rectangle/rectangle';
import { PointService } from '../../point/point.service';

export class MockElementRef extends ElementRef {
  constructor() { super(null); }
}

describe('PipetteToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PipetteToolService = TestBed.get(PipetteToolService);
    expect(service).toBeTruthy();
  });

  it('click calls getBackgroundColor and sets shapeIsClicked to false', inject([PipetteToolService], (service: PipetteToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});

    service['shapeIsClicked'] = true;

    spyOn(service['configEnv'], 'getBackgroundColor');

    service.click(mockMouseEvent);

    expect(service['configEnv'].getBackgroundColor).toHaveBeenCalled();
    expect(service['shapeIsClicked']).toBe(false);
  }));

  it('left click calls next and addPrimaryColor if !shapeIsClicked ', inject([PipetteToolService], (service: PipetteToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});

    service['shapeIsClicked'] = false;

    spyOn(service['toolUtil'], 'addPrimaryColor');
    spyOn(service['pipetteSource'], 'next');

    service.click(mockMouseEvent);

    expect(service['toolUtil'].addPrimaryColor).toHaveBeenCalled();
    expect(service['pipetteSource'].next).toHaveBeenCalled();
  }));

  it('right click calls next and addSecondaryColor if !shapeIsClicked ', inject([PipetteToolService], (service: PipetteToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 200});

    service['shapeIsClicked'] = false;

    spyOn(service['toolUtil'], 'addSecondaryColor');
    spyOn(service['pipetteSource'], 'next');

    service.click(mockMouseEvent);

    expect(service['toolUtil'].addSecondaryColor).toHaveBeenCalled();
    expect(service['pipetteSource'].next).toHaveBeenCalled();
  }));

  it('clicks dont call anything if shapeIsClicked ', inject([PipetteToolService], (service: PipetteToolService) => {

    const mockMouseEventLeft = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});
    const mockMouseEventRight = new MouseEvent('click', {button: 2, clientX: 100, clientY: 200});

    service['shapeIsClicked'] = true;

    spyOn(service['toolUtil'], 'addPrimaryColor');
    spyOn(service['pipetteSource'], 'next');

    spyOn(service['toolUtil'], 'addSecondaryColor');

    service.click(mockMouseEventLeft);

    service['shapeIsClicked'] = true;

    service.click(mockMouseEventRight);

    expect(service['toolUtil'].addSecondaryColor).not.toHaveBeenCalled();
    expect(service['pipetteSource'].next).not.toHaveBeenCalled();

    expect(service['toolUtil'].addPrimaryColor).not.toHaveBeenCalled();
    expect(service['pipetteSource'].next).not.toHaveBeenCalled();
  }));

  it('shapeClickedLeft calls addPrimaryColor and pipetteSource.next', inject([PipetteToolService], (service: PipetteToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});
    const mockElementRef = new MockElementRef();

    const rectangle = new Rectangle(10, '#123456', '#654321');

    const point = new PointService(0,0);

    spyOn(rectangle, 'getColorOfPosition').and.callFake((point) =>{
      return '#000000';
    });

    spyOn(service['toolUtil'], 'addPrimaryColor');
    spyOn(service['pipetteSource'], 'next');

    service.shapeContainer.addShape(rectangle);

    service.shapeContainer.setElementRef(rectangle.getShapeNumber() ,mockElementRef);

    expect(service.shapeContainer.elementRefMap.get(mockElementRef)).toEqual(0);

    expect(service.shapeContainer.getShape(0)).toEqual(rectangle);
    expect(rectangle.getColorOfPosition(point)).toEqual('#000000');

    service.shapeClicked(mockElementRef, mockMouseEvent);

    expect(service['toolUtil'].addPrimaryColor).toHaveBeenCalled();
    expect(service['pipetteSource'].next).toHaveBeenCalled();
  }));

  it('shapeClickedright calls addSecondaryColor and pipetteSource.next', inject([PipetteToolService], (service: PipetteToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 200});
    const mockElementRef = new MockElementRef();

    const rectangle = new Rectangle(10, '#123456', '#654321');

    const point = new PointService(0,0);

    spyOn(rectangle, 'getColorOfPosition').and.callFake((point) =>{
      return '#000000';
    });

    spyOn(service['toolUtil'], 'addSecondaryColor');
    spyOn(service['pipetteSource'], 'next');

    service.shapeContainer.addShape(rectangle);

    service.shapeContainer.setElementRef(rectangle.getShapeNumber() ,mockElementRef);

    expect(service.shapeContainer.elementRefMap.get(mockElementRef)).toEqual(0);

    expect(service.shapeContainer.getShape(0)).toEqual(rectangle);
    expect(rectangle.getColorOfPosition(point)).toEqual('#000000');

    service.shapeClicked(mockElementRef, mockMouseEvent);

    expect(service['toolUtil'].addSecondaryColor).toHaveBeenCalled();
    expect(service['pipetteSource'].next).toHaveBeenCalled();
  }));

  it('shapeNumber is undefined calls nothing', inject([PipetteToolService], (service: PipetteToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 200});
    const mockElementRef = new MockElementRef();

    const rectangle = new Rectangle(10, '#123456', '#654321');

    spyOn(rectangle, 'getColorOfPosition').and.callFake((point) =>{
      return '#000000';
    });

    spyOn(service['toolUtil'], 'addSecondaryColor');
    spyOn(service['pipetteSource'], 'next');

    service.shapeContainer.addShape(rectangle);

    rectangle.setShapeNumber(undefined);

    service.shapeContainer.setElementRef(rectangle.getShapeNumber() ,mockElementRef);

    service.shapeClicked(mockElementRef, mockMouseEvent);

    expect(service['toolUtil'].addSecondaryColor).not.toHaveBeenCalled();
    expect(service['pipetteSource'].next).not.toHaveBeenCalled();
  }));
});
