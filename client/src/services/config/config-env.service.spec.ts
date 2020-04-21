import {  Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import {  ShapesContainerService } from '../../services/shapesContainer/shapesContainer.service'
import { ConfigEnvService } from './config-env.service';

@Injectable()
export class MockElementRef {
  nativeElement: {
    style: {
      backgroundColor: ''
    }
  };
}

describe('ConfigEnvService', () => {

  beforeEach(() => {TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const service: ConfigEnvService = TestBed.get(ConfigEnvService);
    expect(service).toBeTruthy();
  });

  it('rgbToHexColor255', () => {
    const service: ConfigEnvService = TestBed.get(ConfigEnvService);
    expect(service.rgbToStringColor(255, 255, 255, 255))
    .toBe(`rgb(255,255,255,${255 / 255})`)
  });

  it('rgbToHexColor100', () => {
    const service: ConfigEnvService = TestBed.get(ConfigEnvService);

    expect(service.rgbToStringColor(100, 100, 100, 100))
    .toBe(`rgb(100,100,100,${100 / 255})`);
  });

  it('rgbToHexColor-1', () => {
    const service: ConfigEnvService = TestBed.get(ConfigEnvService);
    expect(service.rgbToStringColor(-1, 100, 100, 100))
    .toBe('rgb(0,0,0,1)');
  });

  it('rgbToHexColor256', () => {
    const service: ConfigEnvService = TestBed.get(ConfigEnvService);
    expect(service.rgbToStringColor(100, 100, 256, 100))
    .toBe('rgb(255,255,255,1)');
  });

  it('saveDrawingBackgroud', () => {

    const service: ConfigEnvService = TestBed.get(ConfigEnvService);
    const elRefMock = {nativeElement: { style: { backgroundColor: ' '}}};
    service.drawingElement = elRefMock;
    service.changeBackgroundColor('rgb(100,100,100,1)');
    expect(service.getBackgroundColor()).toEqual('rgb(100,100,100,1)');
  });

  it('empty shapes', () => {
    const service: ConfigEnvService = TestBed.get(ConfigEnvService);
    inject([ShapesContainerService], (injectService: ShapesContainerService) => {
      spyOn(injectService, 'emptyShapes');
      service.overwriteShapes();
      expect(injectService.emptyShapes).toHaveBeenCalled();
    });
  });

  it('empty shapes', () => {
    const service: ConfigEnvService = TestBed.get(ConfigEnvService);
    service.serverInstructions = ['', '<path >allo1</path>', '<path >allo2</path>'];
    const elemMock = {nativeElement: {innerHTML: ''}};
    service.loadFromServer(elemMock);
    expect(elemMock).toEqual({nativeElement: {innerHTML: '<path >allo1</path><path >allo2</path>'}});
  });

});
