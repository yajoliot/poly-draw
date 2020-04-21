import { TestBed, inject } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { MockElementRef } from '../../config/config-env.service.spec';
import { ShapesContainerService } from '../../shapesContainer/shapesContainer.service';
import { ColorToolService } from './color-tool.service';

describe('ColorToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: ElementRef, useValue: new MockElementRef()}]
  }));

  it('should be created', () => {
    const service: ColorToolService = TestBed.get(ColorToolService);
    expect(service).toBeTruthy();
  });
  it('call to shapeClicked should execute Colorcommand if left clicked',
  inject([ShapesContainerService], (service: ShapesContainerService) => {
    const colourService: ColorToolService = TestBed.get(ColorToolService);
    const REF = TestBed.get(ElementRef);
    colourService.shapeClicked(REF, new MouseEvent('click', {button: 0, clientX: 100, clientY: 200}));

    spyOn(service, 'executeColorCommand');

  }));
});
