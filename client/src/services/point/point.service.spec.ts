import { TestBed } from '@angular/core/testing';

import { PointService } from './point.service';

describe('PointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('call to getPositionX should return the x value for the calling point' , () => {
    const POINT = new PointService(1, 1);
    expect(POINT.getPositionX()).toEqual(1);
  });
  it('call to getPositionY should return the y value for the calling point' , () => {
    const POINT = new PointService(1, 2);
    expect(POINT.getPositionY()).toEqual(2);
  });
});
