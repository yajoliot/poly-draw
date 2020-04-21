import { TestBed } from '@angular/core/testing';
import { ToolboxService } from './toolbox.service';
import { ElementRef } from '@angular/core';

describe('ToolboxService', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolboxService = TestBed.get(ToolboxService);
    expect(service).toBeTruthy();
  });

  it('selectTool()', () => {
    const service: ToolboxService = TestBed.get(ToolboxService);
    service.selectTool('Rectangle');
    expect(service.currentTool).toBe('Rectangle');
  });

  it('getTool',() => {
    const service: ToolboxService = TestBed.get(ToolboxService);
    service.selectTool('Rectangle');
    service.getTool();
    service.selectTool('Pencil');
    service.getTool();
    service.selectTool('Line');
    service.getTool();
    service.selectTool('Brush');
    service.getTool();
    service.selectTool('Ellipse');
    service.getTool();
    service.selectTool('Polygon');
    service.getTool();
    service.selectTool('Selection');
    service.getTool();
    service.selectTool('Spray');
    service.getTool();
    service.selectTool('Pipette');
    service.getTool();
    service.selectTool('Color');
    service.getTool();
    service.selectTool('Grid');
    service.getTool();
  });

  it('generateGrid()', () => {
    const service: ToolboxService = TestBed.get(ToolboxService);
    service.generateGrid(1, 1);
  });

  it('changeTransparency()', () => {
    const service: ToolboxService = TestBed.get(ToolboxService);
    service.changeTransparancy();
  });

  it('ResizeGrid()', () => {
    const service: ToolboxService = TestBed.get(ToolboxService);
    service.resizeGrid(true);
  });

  it('ShapeClicked()', () => {

    const service: ToolboxService = TestBed.get(ToolboxService);

    const elemMock = new ElementRef(1);
    const mouseMock = new MouseEvent('1');
    service.selectTool('Pipette');
    service.shapeClicked(elemMock, mouseMock);
    service.selectTool('Selection');
    service.shapeClicked(elemMock, mouseMock);
    service.selectTool('Color')
    service.shapeClicked(elemMock, mouseMock);
  });

});
