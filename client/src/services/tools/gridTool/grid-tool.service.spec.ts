import { TestBed, inject } from '@angular/core/testing';

import { GridToolService } from './grid-tool.service';

describe('GridToolService', () => {

  it('should be created', () => {
    const service: GridToolService = TestBed.get(GridToolService);
    expect(service).toBeTruthy();
  });

  it('generate method sets the attributes correctly', inject([GridToolService], (service: GridToolService) => {

    const NUMBER = 10;

    service.generate(NUMBER, NUMBER, NUMBER);

    expect(service.width === NUMBER).toBeTruthy();
    expect(service.height === NUMBER).toBeTruthy();
    expect(service.squareSize === NUMBER).toBeTruthy();

    const HEIGHT = 15;
    const WIDTH = 20;
    const SQUARE_SIZE = 25;

    service.generate(WIDTH, HEIGHT, SQUARE_SIZE);

    expect(service.width === WIDTH).toBeTruthy();
    expect(service.height === HEIGHT).toBeTruthy();
    expect(service.squareSize === SQUARE_SIZE).toBeTruthy();

  }));

  it('generate() calls reset() if grid is active', inject([GridToolService], (service: GridToolService) => {

    const NUMBER = 10;

    service.isActive = true;

    spyOn(service.shapeInProgress, 'reset');

    service.generate(NUMBER, NUMBER, NUMBER);

    expect(service.shapeInProgress.reset).toHaveBeenCalled();
    expect(!service.isActive).toBeTruthy();

  }));

  it('generate() instantiates new gridShape is !isActive', inject([GridToolService], (service: GridToolService) => {

    const NUMBER = 10;

    service.isActive = false;

    spyOn(service.shapeContainer, 'removeShapeInProgress');
    spyOn(service.shapeContainer, 'addShapeInProgress');
    spyOn(service, 'generateGrid');

    service.generate(NUMBER, NUMBER, NUMBER);
    expect(service.shapeContainer.removeShapeInProgress).toHaveBeenCalled();
    expect(service.shapeContainer.addShapeInProgress).toHaveBeenCalledWith(service.shapeInProgress);
    expect(service.generateGrid).toHaveBeenCalledWith(NUMBER, NUMBER, NUMBER);

    expect(service.isActive).toBeTruthy();

  }));

  it('changeTransparency() resets shape and generates grid', inject([GridToolService], (service: GridToolService) => {

    const NUMBER = 10;

    spyOn(service.shapeInProgress, 'reset');
    spyOn(service, 'generateGrid');

    service.generate(NUMBER, NUMBER, NUMBER);
    service.changeTransparency();

    expect(service.shapeInProgress.reset).toHaveBeenCalled();
    expect(service.generateGrid).toHaveBeenCalledWith(NUMBER, NUMBER, NUMBER);
  }));

  it('resize() makes squares bigger if isPositive', inject([GridToolService], (service: GridToolService) => {
    const SQUAREDELTA = 5;
    const NUMBER = 10;

    spyOn(service.shapeInProgress, 'reset');
    spyOn(service, 'generateGrid');

    service.generate(NUMBER, NUMBER, NUMBER);

    const INITIAL_SQUARE_SIZE = service.squareSize;

    service.resize(true);

    expect(service.shapeInProgress.reset).toHaveBeenCalled();
    expect(service.generateGrid).toHaveBeenCalledWith(NUMBER, NUMBER, NUMBER);
    expect(service.squareSize).toEqual(INITIAL_SQUARE_SIZE + SQUAREDELTA);
  }));

  it('resize() makes squares smaller if isPositive', inject([GridToolService], (service: GridToolService) => {
    const SQUAREDELTA = 5;
    const NUMBER = 10;

    spyOn(service.shapeInProgress, 'reset');
    spyOn(service, 'generateGrid');

    service.generate(NUMBER, NUMBER, NUMBER);

    const INITIAL_SQUARE_SIZE = service.squareSize;

    service.resize(false);

    expect(service.shapeInProgress.reset).toHaveBeenCalled();
    expect(service.generateGrid).toHaveBeenCalledWith(NUMBER, NUMBER, NUMBER);
    expect(service.squareSize).toEqual(INITIAL_SQUARE_SIZE - SQUAREDELTA);
  }));

  it('generateGrid calls setOpacity', inject([GridToolService], (service: GridToolService) => {

    const NUMBER = 10;

    spyOn(service.shapeInProgress, 'setOpacity');

    service.generateGrid(NUMBER, NUMBER, NUMBER);

    expect(service.shapeInProgress.setOpacity).toHaveBeenCalled();

  }));

  it('generateGrid drawsLines and calls shapeInProgress.generate()', inject([GridToolService], (service: GridToolService) => {

    const NUMBER = 10;

    spyOn(service.shapeInProgress, 'drawLine');
    spyOn(service.shapeInProgress, 'generate');

    service.generateGrid(NUMBER, NUMBER, NUMBER);

    expect(service.shapeInProgress.drawLine).toHaveBeenCalled();
    expect(service.shapeInProgress.generate).toHaveBeenCalled();

  }));

});
