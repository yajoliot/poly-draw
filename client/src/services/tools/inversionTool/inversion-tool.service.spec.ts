import { TestBed, inject } from '@angular/core/testing';

import { InversionToolService } from './inversion-tool.service';
import { SelectionRectangle } from 'src/models/shapes/selectionRectangle/selection-rectangle';
import { DashedRectangle } from 'src/models/shapes/dashedRectangle/dashed-rectangle';
import { BoundingBoxToolService } from '../boundingBoxTool/bounding-box-tool.service';
import { MockElementRef } from 'src/services/config/config-env.service.spec';

describe('InversionToolService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
        {provide: SelectionRectangle, useclass: SelectionRectangle},
        {provide: DashedRectangle, useclass: DashedRectangle}
      ]
  }));

  it('should be created', () => {
    const service: InversionToolService = TestBed.get(InversionToolService);
    expect(service).toBeTruthy();
  });

  it('click should setLast point and call correct functions', inject([InversionToolService], (service: InversionToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});

    service['boundingBox'] = new SelectionRectangle(1, '#000000', 'none');
    service['selectionRectangle'] = new SelectionRectangle(1, '#000000', 'none');

    spyOn(service['selectionRectangle'], 'initialize');
    spyOn(service['shapeContainer'], 'addShapeInProgress');

    expect(service['lastPoint']).toBeUndefined();

    service.click(mockMouseEvent);

    expect(service['lastPoint']).not.toBeUndefined();
    expect(service['selectionRectangle'].initialize).toHaveBeenCalled();

    expect(service['shapeContainer'].addShapeInProgress).toHaveBeenCalled();

  }));

  it('click should setLast point and call correct functions', inject([InversionToolService], (service: InversionToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});

    service['boundingBox'] = new SelectionRectangle(1, '#000000', 'none');
    service['selectionRectangle'] = new SelectionRectangle(1, '#000000', 'none');

    spyOn(service['selectionRectangle'], 'initialize');
    spyOn(service['shapeContainer'], 'addShapeInProgress');

    expect(service['lastPoint']).toBeUndefined();

    service.click(mockMouseEvent);

    expect(service['lastPoint']).not.toBeUndefined();
    expect(service['selectionRectangle'].initialize).toHaveBeenCalled();

    expect(service['shapeContainer'].addShapeInProgress).toHaveBeenCalled();

  }));

  it('drag should resetBoundingBox', inject([InversionToolService], (service: InversionToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});

    service['boundingBox'] = new SelectionRectangle(1, '#000000', 'none');
    service['selectionRectangle'] = new SelectionRectangle(1, '#000000', 'none');

    service['boundingBoxTool'] = new BoundingBoxToolService(service['shapeContainer'],
     service['boundingBox'], service['selectionRectangle']);
    service['boundingBoxTool'].initialize(service['boundingBox']);

    spyOn(service['boundingBoxTool'], 'resetBoundingBox');

    service.click(mockMouseEvent);

    service.drag(mockMouseEvent);

    expect(service['boundingBoxTool'].resetBoundingBox).toHaveBeenCalled();

  }));

  it('release should call release on the boundingBoxTool', inject([InversionToolService], (service: InversionToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});

    service['boundingBox'] = new SelectionRectangle(1, '#000000', 'none');
    service['selectionRectangle'] = new SelectionRectangle(1, '#000000', 'none');

    service['boundingBoxTool'] = new BoundingBoxToolService(service['shapeContainer'],
     service['boundingBox'], service['selectionRectangle']);
    service['boundingBoxTool'].initialize(service['boundingBox']);

    spyOn(service['boundingBoxTool'], 'release');

    service.click(mockMouseEvent);

    service.drag(mockMouseEvent);

    service.release(mockMouseEvent);

    expect(service['boundingBoxTool'].release).toHaveBeenCalled();

  }));

  it('shapeClicked should call release on the boundingBoxTool', inject([InversionToolService], (service: InversionToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});
    const mockElementRef = new MockElementRef();

    service['boundingBox'] = new SelectionRectangle(1, '#000000', 'none');
    service['selectionRectangle'] = new SelectionRectangle(1, '#000000', 'none');

    service['boundingBoxTool'] = new BoundingBoxToolService(service['shapeContainer'],
     service['boundingBox'], service['selectionRectangle']);
    service['boundingBoxTool'].initialize(service['boundingBox']);

    spyOn(service['boundingBoxTool'], 'release');

    service.shapeClicked(mockElementRef, mockMouseEvent);

    expect(service['boundingBoxTool'].release).toHaveBeenCalled();

  }));

  it('empty function calls', inject([InversionToolService], (service: InversionToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});
    const down = new KeyboardEvent('keydown', {key: 'ArrowDown'});

    service.onDblClick(mockMouseEvent);
    service.keyboardDown(down);
    service.keyboardUp(down);
    service.onMouseLeave(mockMouseEvent);

  }));

});
