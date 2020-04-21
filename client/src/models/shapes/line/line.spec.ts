import { PointService } from 'src/services/point/point.service';
import { LineShape } from './line';
const CENT = 100;
describe('Line', () => {
  it('call to generateRelativeLine should set the origin of the LineShape as well as setting the corresponding instruction', () => {
    const LINE = new LineShape(1, '#000000', '#000000');
    LINE.generateRelativeLine(new PointService(1, 1), new PointService(2, 2));
    expect(LINE.getOrigin()).toEqual(new PointService(1, 1));
    expect(LINE.instruction).toEqual('L2,2');
  });
  // tslint:disable-next-line: max-line-length
  it('call to generateLine angleMultiple = 1 should set the origin of the LineShape as well as setting the corresponding instruction', () => {
    const LINE = new LineShape(1, '#000000', '#000000');
    LINE.setAngleMultiple(1);
    LINE.generateLine(new PointService(1, 1), new PointService(2, 2));
    expect(LINE.getAngleMultiple()).toEqual(1);
    expect(LINE.getOrigin()).toEqual(new PointService(1, 1));
    expect(LINE.instruction).toEqual('M1,1L2,2');
  });
  // tslint:disable-next-line: max-line-length
  it('call to generateLine angleMultiple > 1 angle >= 1 should set the origin of the LineShape as well as setting the corresponding instruction', () => {
    const LINE = new LineShape(1, '#000000', '#000000');
    LINE.setAngleMultiple(CENT);
    // tslint:disable-next-line: no-magic-numbers
    LINE.generateLine(new PointService(156, 131), new PointService(187, 162));
    // tslint:disable-next-line: no-magic-numbers
    expect(LINE.getOrigin()).toEqual(new PointService(156, 131));
    expect(LINE.instruction).toEqual('M156,131L177,168');
  });
  it('call to generateLine angleMultiple > 1 angle < 1 should set the origin of the LineShape as well as'
  + ' setting the corresponding instruction', () => {
    const LINE = new LineShape(1, '#000000', '#000000');
    LINE.setAngleMultiple(CENT);
    // tslint:disable-next-line: no-magic-numbers
    LINE.generateLine(new PointService(103, 56), new PointService(278, 56));
    // tslint:disable-next-line: no-magic-numbers
    expect(LINE.getOrigin()).toEqual(new PointService(103, 56));
    expect(LINE.instruction).toEqual('M103,56L237,-57');
  });
  // tslint:disable-next-line: max-line-length
  it('call to generateLine angleMultiple > 1 angle < 1 should set the origin of the LineShape as well as setting the corresponding instruction', () => {
    const LINE = new LineShape(1, '#000000', '#000000');
    LINE.setAngleMultiple(CENT);
    // tslint:disable-next-line: no-magic-numbers
    LINE.generateLine(new PointService(241, 204), new PointService(256, 204));
    // tslint:disable-next-line: no-magic-numbers
    expect(LINE.getOrigin()).toEqual(new PointService(241, 204));
    expect(LINE.instruction).toEqual('M241,204L252,194');
  });
  it('call to generate should set the corresponding instruction', () => {
    const LINE = new LineShape(1, '#000000', '#000000');
    LINE.setOrigin(new PointService(1, 1));
    LINE.setDestination(new PointService(2, 2));
    LINE.generate();
    expect(LINE.getOrigin()).toEqual(new PointService(1, 1));
    expect(LINE.getDestination()).toEqual(new PointService(2, 2));
    expect(LINE.instruction).toEqual('M1,1L2,2');
  });
  it('call to detectLineIntersection on vector (1,1)->(2,2), (1,1)->(3,3) should return true', () => {
    const LINE1 = new LineShape(1, '#000000', '#000000');
    const LINE2 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(2, 2));
    LINE2.setOrigin(new PointService(1, 1));
    const x  = 3;
    const y = 3;
    LINE2.setDestination(new PointService(x, y));
    expect(LINE1.detectLineIntersection(LINE2)).toBeTruthy();
  });
  it('call to detectLineIntersection on vector (1,1)->(2,2), (3,3)->(4,4) should return false', () => {
    const LINE1 = new LineShape(1, '#000000', '#000000');
    const LINE2 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(2, 2));
    const x = 3;
    const y = 3;
    LINE2.setOrigin(new PointService(x, y));
    LINE2.setDestination(new PointService(x + 1, x + 1));
    expect(LINE1.detectLineIntersection(LINE2)).toBeFalsy();
  });
  it('call to detectLineIntersection on vector (1,1)->(CENT,CENT), (1,CENT)->(CENT,1) should return true', () => {
    const LINE1 = new LineShape(1, '#000000', '#000000');
    const LINE2 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(0, 0));
    LINE1.setDestination(new PointService(CENT, CENT));
    LINE2.setOrigin(new PointService(0, CENT));
    LINE2.setDestination(new PointService(CENT, 0));
    expect(LINE1.detectLineIntersection(LINE2)).toBeTruthy();
  });
  it('call to detectLineIntersection on vector (1,1)->(CENT,CENT), (1,98)->(CENT,1) should return true', () => {
    const LINE1 = new LineShape(1, '#000000', '#000000');
    const LINE2 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(CENT, CENT));
    const y = 98;
    LINE2.setOrigin(new PointService(1, y));
    LINE2.setDestination(new PointService(CENT, 0));
    expect(LINE1.detectLineIntersection(LINE2)).toBeTruthy();
  });

  it('call to translate should generate relative line if relative', () => {
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(CENT, CENT));
    LINE1.isRelative = true;
    spyOn(LINE1, 'generateRelative');
    LINE1.translate(CENT, CENT);
    expect(LINE1.generateRelative).toHaveBeenCalled();
  });
  it('call to translate should generate line if not relative', () => {
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(CENT, CENT));
    LINE1.isRelative = false;
    spyOn(LINE1, 'generate');
    LINE1.translate(CENT, CENT);
    expect(LINE1.generate).toHaveBeenCalled();
  });

  it('call to generateRelative should call generateRelate line ', () => {
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(CENT, CENT));
    spyOn(LINE1, 'generateRelativeLine').withArgs(LINE1.getOrigin(), LINE1.getDestination());
    LINE1.generateRelative();
    expect(LINE1.generateRelativeLine).toHaveBeenCalledWith(LINE1.getOrigin(), LINE1.getDestination());
  });

  it('call to detectPointIntersection should return true if the point is on the line ', () => {
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(CENT, CENT));
    expect(LINE1.detectPointIntersection(new PointService(CENT, CENT))).toBe(true);
  });

  it('call to detectPointIntersection should return false if the point is not on the line ', () => {
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(CENT, CENT));
    expect(LINE1.detectPointIntersection(new PointService(2 * CENT, CENT))).toBe(false);
  });

  it('call to detectLineIntersection should return false if the denominator is 0 ', () => {
    const LINE1 = new LineShape(1, '#000000', '#000000');
    const LINE2 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(0, 0));
    LINE1.setDestination(new PointService(0, 0));
    LINE2.setOrigin(new PointService(0, CENT));
    LINE2.setDestination(new PointService(CENT, CENT));
    expect(LINE1.detectLineIntersection(LINE2)).toEqual(false);
  });

  it('call to rotateAboutPoint should rotateLine about a point test 1', () => {
    const LINE = new LineShape(1, '#000000', '#000000');

    LINE.setOrigin(new PointService(0, 0));
    LINE.setDestination(new PointService(10, 0));

    const squareCenter = new PointService(5,5);

    LINE.rotateAboutPoint(90, squareCenter);

    expect(Math.round(LINE.getOrigin().getPositionX())).toEqual(-0);
    expect(Math.round(LINE.getOrigin().getPositionY())).toEqual(10);

    expect(Math.round(LINE.getDestination().getPositionX())).toEqual(0);
    expect(Math.round(LINE.getDestination().getPositionY())).toEqual(-0);


  });

  it('call to rotateAboutPoint should rotateLine about a point test 2', () => {
    const LINE = new LineShape(1, '#000000', '#000000');

    LINE.setOrigin(new PointService(10, 0));
    LINE.setDestination(new PointService(10, 10));

    const squareCenter = new PointService(5,5);

    LINE.rotateAboutPoint(90, squareCenter);

    expect(Math.round(LINE.getOrigin().getPositionX())).toEqual(0);
    expect(Math.round(LINE.getOrigin().getPositionY())).toEqual(-0);

    expect(Math.round(LINE.getDestination().getPositionX())).toEqual(10);
    expect(Math.round(LINE.getDestination().getPositionY())).toEqual(0);


  });

  it('call to rotateAboutPoint should rotateLine about a point test 3', () => {
    const LINE = new LineShape(1, '#000000', '#000000');

    LINE.setOrigin(new PointService(10, 10));
    LINE.setDestination(new PointService(0, 10));

    const squareCenter = new PointService(5,5);

    LINE.rotateAboutPoint(90, squareCenter);

    expect(Math.round(LINE.getOrigin().getPositionX())).toEqual(10);
    expect(Math.round(LINE.getOrigin().getPositionY())).toEqual(0);

    expect(Math.round(LINE.getDestination().getPositionX())).toEqual(10);
    expect(Math.round(LINE.getDestination().getPositionY())).toEqual(10);


  });

  it('call to rotateAboutPoint should rotateLine about a point test 4', () => {
    const LINE = new LineShape(1, '#000000', '#000000');

    LINE.setOrigin(new PointService(0, 10));
    LINE.setDestination(new PointService(0, 0));

    const squareCenter = new PointService(5,5);

    LINE.rotateAboutPoint(90, squareCenter);

    expect(Math.round(LINE.getOrigin().getPositionX())).toEqual(10);
    expect(Math.round(LINE.getOrigin().getPositionY())).toEqual(10);

    expect(Math.round(LINE.getDestination().getPositionX())).toEqual(-0);
    expect(Math.round(LINE.getDestination().getPositionY())).toEqual(10);


  });


  it('call to rotateAboutPoint should rotateLine about a point test 5', () => {
    const LINE = new LineShape(1, '#000000', '#000000');

    LINE.setOrigin(new PointService(0, 0));
    LINE.setDestination(new PointService(0, 10));

    const squareCenter = new PointService(5,5);

    LINE.rotateAboutPoint(90, squareCenter);

    expect(Math.round(LINE.getOrigin().getPositionX())).toEqual(-0);
    expect(Math.round(LINE.getOrigin().getPositionY())).toEqual(10);

    expect(Math.round(LINE.getDestination().getPositionX())).toEqual(10);
    expect(Math.round(LINE.getDestination().getPositionY())).toEqual(10);


  });


  it('call to rotateAboutPoint should rotateLine about a point test 6', () => {
    const LINE = new LineShape(1, '#000000', '#000000');

    LINE.setOrigin(new PointService(0, 10));
    LINE.setDestination(new PointService(10, 10));

    const squareCenter = new PointService(5,5);

    LINE.rotateAboutPoint(90, squareCenter);

    expect(Math.round(LINE.getOrigin().getPositionX())).toEqual(10);
    expect(Math.round(LINE.getOrigin().getPositionY())).toEqual(10);

    expect(Math.round(LINE.getDestination().getPositionX())).toEqual(10);
    expect(Math.round(LINE.getDestination().getPositionY())).toEqual(0);


  });


  it('call to rotateAboutPoint should rotateLine about a point test 7', () => {
    const LINE = new LineShape(1, '#000000', '#000000');

    LINE.setOrigin(new PointService(10, 10));
    LINE.setDestination(new PointService(10, 0));

    const squareCenter = new PointService(5,5);

    LINE.rotateAboutPoint(90, squareCenter);

    expect(Math.round(LINE.getOrigin().getPositionX())).toEqual(10);
    expect(Math.round(LINE.getOrigin().getPositionY())).toEqual(0);

    expect(Math.round(LINE.getDestination().getPositionX())).toEqual(0);
    expect(Math.round(LINE.getDestination().getPositionY())).toEqual(-0);


  });

  it('call to rotateAboutPoint should rotateLine about a point test 8', () => {
    const LINE = new LineShape(1, '#000000', '#000000');

    LINE.setOrigin(new PointService(10, 0));
    LINE.setDestination(new PointService(0, 0));

    const squareCenter = new PointService(5,5);

    LINE.rotateAboutPoint(90, squareCenter);

    expect(Math.round(LINE.getOrigin().getPositionX())).toEqual(0);
    expect(Math.round(LINE.getOrigin().getPositionY())).toEqual(-0);

    expect(Math.round(LINE.getDestination().getPositionX())).toEqual(-0);
    expect(Math.round(LINE.getDestination().getPositionY())).toEqual(10);


  });

  it('call to rotateAboutPoint should rotateLine about a point test 9', () => {
    const LINE = new LineShape(1, '#000000', '#000000');

    LINE.setOrigin(new PointService(10, 10));
    LINE.setDestination(new PointService(0, 20));

    const squareCenter = new PointService(0,10);

    LINE.rotateAboutPoint(90, squareCenter);

    expect(Math.round(LINE.getOrigin().getPositionX())).toEqual(0);
    expect(Math.round(LINE.getOrigin().getPositionY())).toEqual(0);

    expect(Math.round(LINE.getDestination().getPositionX())).toEqual(10);
    expect(Math.round(LINE.getDestination().getPositionY())).toEqual(10);


  });


  
});
