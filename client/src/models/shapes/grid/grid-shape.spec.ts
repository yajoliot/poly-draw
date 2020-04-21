import { GridShape } from './grid-shape';
import { PointService } from 'src/services/point/point.service';

describe('GridShape', () => {

  it('should create an instance', () => {
    expect(new GridShape(10, '#000000', '#000000')).toBeTruthy();
  });

  it('drawline should add a line', () => {
    const GRID = new GridShape(10, '#000000', '#000000');

    expect(GRID['lines']).toEqual([]);
    expect(GRID['instruction']).toEqual('');

    const origin = new PointService(0 , 0);
    const destination = new PointService(10, 10);

    GRID.drawLine(origin, destination);

    expect(GRID['lines'].length).toEqual(1);
    expect(GRID['instruction']).not.toEqual('');
  });

  it('reset should reset instruction and lines', () => {
    const GRID = new GridShape(10, '#000000', '#000000');

    const origin = new PointService(0 , 0);
    const destination = new PointService(10, 10);

    GRID.drawLine(origin, destination);

    GRID.reset();

    expect(GRID['lines'].length).toEqual(0);
    expect(GRID['instruction']).toEqual('');
  });

  it('setOpacity should set new opacity', () => {
    const GRID = new GridShape(10, '#000000', '#000000');

    const oldOpacity = GRID.getOpacity();

    GRID.setOpacity('0.5');

    expect(oldOpacity).not.toEqual(GRID.getOpacity());
    expect(GRID.getOpacity()).toEqual('0.5');
  });

  it('generate should add all lines instructions', () => {
    const GRID = new GridShape(10, '#000000', '#000000');

    
    const origin = new PointService(0 , 0);
    const destination = new PointService(10, 10);

    const originTwo = new PointService(0 , 0);
    const destinationTwo = new PointService(20, 20);

    GRID.drawLine(origin, destination);
    GRID.drawLine(originTwo, destinationTwo);

    const instruction = GRID['instruction'];

    GRID.instruction = '';

    expect(GRID.instruction).toEqual('');

    GRID.generate();

    expect(GRID.instruction).toEqual(instruction);

  });
});
