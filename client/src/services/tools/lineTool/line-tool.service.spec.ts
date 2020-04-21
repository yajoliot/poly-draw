import { inject, TestBed } from '@angular/core/testing';

import { LineShape } from 'src/models/shapes/line/line';
import { LinePointShape } from 'src/models/shapes/linePointShape/line-point-shape';
import { PointService } from '../../point/point.service';
import { LineToolService } from './line-tool.service';
import { PencilShape } from 'src/models/shapes/pencil-shape/pencil-shape';

describe('LineToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
     const service: LineToolService = TestBed.get(LineToolService);
     expect(service).toBeTruthy();
  });

  it('first click calls the correct functions if point is true', inject([LineToolService], (service: LineToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 200});
    service.point = true;

    const point = new PointService(100 - service.offset, 200 - service.offset);

    spyOn(service.shapeContainer, 'addShapeInProgress');

    if (service.shapeInProgress != null) {
      expect(service.shapeInProgress.getLines().length).toEqual(0);
    }

    service.click(mockMouseEvent);

    if(service.shapeInProgress != null){
      expect(service.shapeInProgress.getLines().length).toEqual(1);
    }

    expect(service.shapeContainer.addShapeInProgress).toHaveBeenCalled();
    expect(service.shapeInProgress instanceof LinePointShape).toBeTruthy();
    expect(service.temporaryLine instanceof LineShape).toBeTruthy();
    expect(service.origin).toEqual(point);

    const mockNewMouseEvent = new MouseEvent('mousemove', {clientX: 200, clientY: 300});

    service.drag(mockNewMouseEvent);
    // tslint:disable-next-line: no-magic-numbers
    expect(service.mousePosition.getPositionX()).toBe(200 - service.offset);
    // tslint:disable-next-line: no-magic-numbers
    expect(service.mousePosition.getPositionY()).toBe(300 - service.offset);
  }));

  it('first click calls the correct functions if point is false', inject([LineToolService], (service: LineToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 200});
    service.point = true;

    const point = new PointService(100 - service.offset, 200 - service.offset);

    spyOn(service.shapeContainer, 'addShapeInProgress');

    if (service.shapeInProgress != null) {
      expect(service.shapeInProgress.getLines().length).toEqual(0);
    }

    service.click(mockMouseEvent);

    if(service.shapeInProgress != null){
      expect(service.shapeInProgress.getLines().length).toEqual(1);
    }

    expect(service.shapeContainer.addShapeInProgress).toHaveBeenCalled();
    expect(service.shapeInProgress instanceof PencilShape).toBeTruthy();
    expect(service.temporaryLine instanceof LineShape).toBeTruthy();
    expect(service.origin).toEqual(point)

    const mockNewMouseEvent = new MouseEvent('mousemove', {clientX: 200, clientY: 300});

    service.drag(mockNewMouseEvent);
    // tslint:disable-next-line: no-magic-numbers
    expect(service.mousePosition.getPositionX()).toBe(200 - service.offset);
    // tslint:disable-next-line: no-magic-numbers
    expect(service.mousePosition.getPositionY()).toBe(300 - service.offset);
  }));

  it('second click calls the correct functions', inject([LineToolService], (service: LineToolService) => {

    const mockMouseEvent = new MouseEvent('mousedown', {clientX: 100, clientY: 200});
    service.point = true;

    service.click(mockMouseEvent);

    const mockNewMouseEvent = new MouseEvent('mousedown', {clientX: 200, clientY: 300});

    const tempLine = service.temporaryLine;

    if (tempLine instanceof LineShape){
      spyOn(tempLine, 'generate');
      spyOn(tempLine, 'getAngleMultiple');
    }

    expect(tempLine instanceof LineShape).toBeTruthy();

    service.click(mockNewMouseEvent);

    if (tempLine instanceof LineShape) {
      expect(tempLine.generate).toHaveBeenCalled();
      expect(tempLine.getAngleMultiple).toHaveBeenCalled();
    }

    expect(tempLine).not.toEqual(service.temporaryLine);
  }));

  it('if temporaryShape and shapeInProgress are instaciated, drag', inject([LineToolService], (service: LineToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 100, clientY: 200});
    service.point = true;

    service.click(mockMouseEvent);

    const mockNewMouseEvent = new MouseEvent('mousemove', {clientX: 200, clientY: 300});

    if(service.temporaryLine instanceof LineShape){
      spyOn(service.temporaryLine, 'generateLine');
    }

    if(service.shapeInProgress instanceof LinePointShape || service.shapeInProgress instanceof PencilShape){
      spyOn(service.shapeInProgress, 'generate');
    }

    service.drag(mockNewMouseEvent);

    if(service.temporaryLine instanceof LineShape){
      expect(service.temporaryLine.generateLine).toHaveBeenCalled();
    }

    if(service.shapeInProgress instanceof LinePointShape || service.shapeInProgress instanceof PencilShape){
      expect(service.shapeInProgress.generate).toHaveBeenCalled();
    }

    // tslint:disable-next-line: no-magic-numbers
    expect(service.mousePosition.getPositionX()).toBe(200 - service.offset);
    // tslint:disable-next-line: no-magic-numbers
    expect(service.mousePosition.getPositionY()).toBe(300 - service.offset);
  }));

  it('if shapeInProgress and temporaryLine are equal to null, do not drag', inject([LineToolService], (service: LineToolService) => {

    service.point = true;

    const mockNewMouseEvent = new MouseEvent('mousemove', {clientX: 200, clientY: 300});

    const oldPosition = new PointService(0, 0);

    service.shapeInProgress = null;
    service.temporaryLine = null;

    service.mousePosition = oldPosition;

    service.drag(mockNewMouseEvent);

    expect(service.mousePosition).toEqual(oldPosition);

    service.temporaryLine =  new LineShape(1, '#123456', '#654321');
    service.shapeInProgress = null;

    service.mousePosition = oldPosition;

    service.drag(mockNewMouseEvent);

    expect(service.mousePosition).toEqual(oldPosition);

    service.temporaryLine =  null;
    service.shapeInProgress = new LinePointShape(1, '#123456', '#654321');

    service.mousePosition = oldPosition;

    service.drag(mockNewMouseEvent);

    expect(service.mousePosition).toEqual(oldPosition);

    service.temporaryLine =  new LineShape(1, '#123456', '#654321');
    service.shapeInProgress = new LinePointShape(1, '#123456', '#654321');

    service.temporaryLine.setOrigin(oldPosition);

    spyOn(service.shapeInProgress, 'generate');

    service.mousePosition = oldPosition;

    service.drag(mockNewMouseEvent);

    expect(service.mousePosition).not.toEqual(oldPosition);

  }));


  it('Release does nothing', inject([LineToolService], (service: LineToolService) => {
    const mockMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 300});
    service.release(mockMouseEvent);
  }));

  it('Pressing Shift key changes temporaryLine.angleMultiple', inject([LineToolService], (service: LineToolService) => {
    const mockMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 300});

    service.click(mockMouseEvent);

    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'Shift'});

    service.keyboardDown(mockKeyboardEvent);

    if (service.temporaryLine != null) {
        // tslint:disable-next-line: no-magic-numbers
        expect(service.temporaryLine.getAngleMultiple()).toBe(45);
    }
  }));

  it('Pressing backspace key does not remove a line if there is only one left',
   inject([LineToolService], (service: LineToolService) => {
    const mockMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 300});
    service.click(mockMouseEvent);
    expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);
    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'Backspace'});
    service.keyboardDown(mockKeyboardEvent);
    expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);
  }));

  it('Pressing backspace key removes a line', inject([LineToolService], (service: LineToolService) => {
    const mockMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 300});

    service.point = false;

    service.click(mockMouseEvent);

    const shapeOne = service.temporaryLine;

    const mockNewMouseEvent = new MouseEvent('click', {clientX: 300, clientY: 400});

    service.click(mockNewMouseEvent);

    expect(service.temporaryLine).not.toEqual(shapeOne);

    expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);

    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'Backspace'});

    service.keyboardDown(mockKeyboardEvent);

    expect(service.temporaryLine).toEqual(shapeOne);

    expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);
  }));

  it('Pressing any key does nothing if objects are null', inject([LineToolService], (service: LineToolService) => {
    const mockMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 300});

    service.point = false;

    service.click(mockMouseEvent);

    expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);

    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'shift'});

    if (service.temporaryLine instanceof LineShape) {
      spyOn(service.temporaryLine, 'generate');
    }

    service.shapeInProgress = null;

    service.keyboardDown(mockKeyboardEvent);
    if (service.temporaryLine instanceof LineShape) {
      expect(service.temporaryLine.generate).not.toHaveBeenCalled();
    }

  }));

  it('Releasing shift sets temporaryLine.angleMultiple to 1', inject([LineToolService], (service: LineToolService) => {
    const mockMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 300});

    service.click(mockMouseEvent);

    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'Shift'});

    service.keyboardDown(mockKeyboardEvent);

    if (service.temporaryLine != null) {
        // tslint:disable-next-line: no-magic-numbers
        expect(service.temporaryLine.getAngleMultiple()).toBe(45);
    }

    const mockNewKeyboardEvent = new KeyboardEvent('keyup', {key: 'Shift'});

    service.keyboardUp(mockNewKeyboardEvent);

    if (service.temporaryLine != null) {
        expect(service.temporaryLine.getAngleMultiple()).toBe(1);
    }
  }));

  it('Releasing a key other than shift does not set angle multiple to one', inject([LineToolService], (service: LineToolService) => {
    const mockMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 300});

    service.click(mockMouseEvent);

    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'Shift'});

    service.keyboardDown(mockKeyboardEvent);

    if (service.temporaryLine != null) {
        // tslint:disable-next-line: no-magic-numbers
        expect(service.temporaryLine.getAngleMultiple()).toBe(45);
    }

    const mockNewKeyboardEvent = new KeyboardEvent('keyup', {key: 'down'});

    service.keyboardUp(mockNewKeyboardEvent);

    if (service.temporaryLine != null) {
        expect(service.temporaryLine.getAngleMultiple()).toBe(45);
    }
  }));

  it('Releasing shift does nothing if attributes are null', inject([LineToolService], (service: LineToolService) => {
    const mockMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 300});

    service.click(mockMouseEvent);

    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'Shift'});

    service.keyboardDown(mockKeyboardEvent);

    if (service.temporaryLine != null) {
        // tslint:disable-next-line: no-magic-numbers
        expect(service.temporaryLine.getAngleMultiple()).toBe(45);
    }

    const mockNewKeyboardEvent = new KeyboardEvent('keyup', {key: 'shift'});

    service.shapeInProgress = null;

    service.keyboardUp(mockNewKeyboardEvent);

    if (service.temporaryLine != null) {
        expect(service.temporaryLine.getAngleMultiple()).toBe(45);
    }
  }));

  it('MouseLeave does nothing', inject([LineToolService], (service: LineToolService) => {
    service.onMouseLeave();
  }));

  it('onDblClick stops shape in progress', inject([LineToolService], (service: LineToolService) => {
    const mockMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 300})
    service.click(mockMouseEvent);
    const mockNewMouseEvent = new MouseEvent('click', {clientX: 300, clientY: 400});

    service.click(mockNewMouseEvent);

    expect(service.shapeContainer.getShapesInProgress().length).toBe(1);

    const mockDblMouseEvent = new MouseEvent('dblclick', {clientX: 300, clientY: 400});

    service.onDblClick(mockDblMouseEvent);

    expect(service.shapeContainer.getShapesInProgress().length).toBe(0);

    expect(service.shapeInProgress).toBe(null);
    expect(service.temporaryLine).toBe(null);
  }));




  it('onDblClick connects with origin if in a 3 pixel radius of origin', inject([LineToolService], (service: LineToolService) => {
    const mockMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 300});

    service.click(mockMouseEvent);
    service.point = false;

    const mockNewMouseEvent = new MouseEvent('mousemove', {clientX: 300, clientY: 400});

    service.click(mockNewMouseEvent);

    if (service.shapeInProgress != null) {
      expect(service.shapeInProgress.getNumberOfLines()).toBe(2);
    }

    const mockDblMouseEvent = new MouseEvent('dblclick', {clientX: 200, clientY: 301});

    // tslint:disable-next-line: no-magic-numbers
    const point = new PointService(200 - service.offset, 301 - service.offset);

    const mockThirdMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 301});

    service.click(mockThirdMouseEvent);
    service.click(mockThirdMouseEvent);

    expect(service.isInsideCircle(point)).toBe(true);
    var shape = service.shapeInProgress;

    service.onDblClick(mockDblMouseEvent);
    if (shape instanceof PencilShape) {
      expect(service.origin).toEqual(shape.getLastLine().getDestination());
    }

    expect(service.shapeInProgress).toBe(null);
    expect(service.temporaryLine).toBe(null);
  }));

  it('isInsideCircle returns false if point is outside 3 pixels of line origin', inject([LineToolService], (service: LineToolService) => {
    const mockMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 300});

    service.click(mockMouseEvent);
    // tslint:disable-next-line: no-magic-numbers
    const point = new PointService(300, 400);

    expect(service.isInsideCircle(point)).toBe(false);

  }));

  it('Pressing escape Key removes object and temporary line', inject([LineToolService], (service: LineToolService) => {

    const mockMouseEvent = new MouseEvent('click', {clientX: 200, clientY: 300});

    service.click(mockMouseEvent);

    const mockNewMouseEvent = new MouseEvent('click', {clientX: 300, clientY: 400});

    service.click(mockNewMouseEvent);

    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'Escape'});

    expect(service.shapeInProgress).toBeDefined();
    expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);

    service.keyboardDown(mockKeyboardEvent);

    expect(service.shapeInProgress).toBe(null);
    expect(service.temporaryLine).toBe(null);
    expect(service.shapeContainer.getShapesInProgress().length).toEqual(0);

 }));

});
