import { TestBed } from '@angular/core/testing';
import { PointService } from '../point/point.service';
import { SvgWorkerService } from './svg-worker.service';

describe('SvgToolboxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SvgWorkerService = TestBed.get(SvgWorkerService);
    expect(service).toBeTruthy();
  });

  it('line method should return correct line path instruction', () => {
    const point = new PointService(200, 300);

    const SVGWORKER = new SvgWorkerService();
    expect(SVGWORKER.line(point)).toBe('L200,300');
  });

  it('move method should return correct path move instruction', () => {
    const point = new PointService(200, 300);

    const SVGWORKER = new SvgWorkerService();
    expect(SVGWORKER.move(point)).toBe('M200,300');
  });

});
