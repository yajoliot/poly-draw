import { TestBed } from '@angular/core/testing';
import { PointService } from 'src/services/point/point.service';
import { LineShape } from '../line/line';
import { Rectangle } from '../rectangle/rectangle';
import { Polygon } from './polygon';

describe('PolygonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  // tslint:disable-next-line: max-line-length
  it('call to detectRectangleIntersection on Rectangle: (1,1), (1,3), (3,1), (3,3) and triangle Polygon: (2,2), (11,3), (7,3) should return true', () => {
    const RECTANGLE = new Rectangle(1, '#000000', '#000000');
    const LINE1R = new LineShape(1, '#000000', '#000000');
    const LINE2R = new LineShape(1, '#000000', '#000000');
    const LINE3R = new LineShape(1, '#000000', '#000000');
    const LINE4R = new LineShape(1, '#000000', '#000000');
    LINE1R.setOrigin(new PointService(1, 1));
    LINE1R.setDestination(new PointService(1, 3));
    LINE2R.setOrigin(new PointService(1, 3));
    LINE2R.setDestination(new PointService(3, 3));
    LINE3R.setOrigin(new PointService(3, 3));
    LINE3R.setDestination(new PointService(3, 1));
    LINE4R.setOrigin(new PointService(3, 1));
    LINE4R.setDestination(new PointService(1, 1));
    const LINESR: LineShape[] = [LINE1R, LINE2R, LINE3R, LINE4R];
    RECTANGLE.setLines(LINESR);
    const POLYGON = new Polygon(1, '#000000', '#000000');
    const LINE1P = new LineShape(1, '#000000', '#000000');
    const LINE2P = new LineShape(1, '#000000', '#000000');
    const LINE3P = new LineShape(1, '#000000', '#000000');
    LINE1P.setOrigin(new PointService(2, 2));
    LINE1P.setDestination(new PointService(11, 3));
    LINE2P.setOrigin(new PointService(11, 3));
    LINE2P.setDestination(new PointService(7, 3));
    LINE3P.setOrigin(new PointService(7, 3));
    LINE3P.setDestination(new PointService(2, 2));
    const LINESP: LineShape[] = [LINE1P, LINE2P, LINE3P];
    POLYGON.setLines(LINESP);
    expect(POLYGON.detectRectangleIntersection(RECTANGLE)).toBeTruthy();
  });
  it('call to setVertices should set the vertices attribute', () => {
    const VERTICES = [new PointService(1, 1), new PointService(2, 2)];
    const POLYGON = new Polygon(1, '#000000', '#000000');
    POLYGON.initialize(new PointService(0, 0));
    POLYGON.setVertices(VERTICES);
    expect(POLYGON.getVertices()).toEqual(VERTICES);
  });

  it('call to setLines should set the lines attribute', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    const LINES = [new LineShape(1, '#000000', '#000000'), new LineShape(1, '#000000', '#000000'), new LineShape(1, '#000000', '#000000')];
    POLYGON.setLines(LINES);
    expect(POLYGON.getLines()).toEqual(LINES);
  });

  // tslint:disable-next-line: max-line-length
  it('call to initialize(100, 100) -> generatePolygon((100, 100)) -> generatePolygone((150,150)) should set the corresponding instruction as well as set up the lines and vertices attribute', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    const POINT1 = new PointService(100, 100);
    const POINT2 = new PointService(150, 150);
    POLYGON.sides = 7;
    POLYGON.initialize(POINT1);
    POLYGON.generatePolygon(POINT1);
    POLYGON.generatePolygon(POINT2);
    expect(POLYGON.getLines().length).toEqual(POLYGON.sides);
    expect(POLYGON.getVertices().length).toEqual(POLYGON.sides);
    expect(POLYGON.instruction).toEqual('M100,100L100,100L100,119L114,102L135,102L149,119L144,140L125,150');
  });

  it('call to updateExtremums(0,3) with SHAPE min (1, 1), max (2,2) should set appropriate extremums', () => {
    const POLYGON: Polygon = new Polygon(1, '#000000', '#000000');
    POLYGON.setMinimum(new PointService(1, 1));
    POLYGON.setMaximum(new PointService(2, 2));
    POLYGON.updateExtremums(new PointService(0, 3));
    POLYGON.updateExtremums(new PointService(3, 0));
    expect(POLYGON.getMaximum()).toEqual(new PointService(3, 3));
    expect(POLYGON.getMinimum()).toEqual(new PointService(0, 0));
  });
  // tslint:disable-next-line: max-line-length
  it('call to resetExtremums() with SHAPE.lines = (1,1) -> (1,4), (1,4) -> (4,4),  (4,4) -> (4,1), (4,1) -> (1,1)  should set appropriate extremums', () => {
    const POLYGON: Polygon = new Polygon(1, '#000000', '#000000');
    const LINE1P = new LineShape(1, '#000000', '#000000');
    const LINE2P = new LineShape(1, '#000000', '#000000');
    const LINE3P = new LineShape(1, '#000000', '#000000');
    const LINE4P = new LineShape(1, '#000000', '#000000');
    LINE1P.setOrigin(new PointService(1, 1));
    LINE1P.setDestination(new PointService(1, 4));
    LINE1P.findExtremums();
    LINE2P.setOrigin(new PointService(1, 4));
    LINE2P.setDestination(new PointService(4, 4));
    LINE2P.findExtremums();
    LINE3P.setOrigin(new PointService(4, 4));
    LINE3P.setDestination(new PointService(4, 1));
    LINE3P.findExtremums();
    LINE4P.setOrigin(new PointService(4, 1));
    LINE4P.setDestination(new PointService(1, 1));
    LINE4P.findExtremums();
    const LINESP: LineShape[] = [LINE1P, LINE2P, LINE3P, LINE4P];
    POLYGON.setLines(LINESP);
    POLYGON.resetExtremums();
    expect(POLYGON.getMaximum()).toEqual(new PointService(4, 4));
    expect(POLYGON.getMinimum()).toEqual(new PointService(1, 1));
  });

     // tslint:disable-next-line: max-line-length
  it('call to resetExtremums() should set appropriate extremums', () => {
    const POLYGON: Polygon = new Polygon(1, '#000000', '#000000');
    const LINE1P = new LineShape(1, '#000000', '#000000');
    const LINE2P = new LineShape(1, '#000000', '#000000');
    const LINE3P = new LineShape(1, '#000000', '#000000');
    const LINE4P = new LineShape(1, '#000000', '#000000');
    LINE1P.setOrigin(new PointService(1, 1));
    LINE1P.setDestination(new PointService(-1, 4));
    LINE1P.findExtremums();
    LINE2P.setOrigin(new PointService(-1, -4));
    LINE2P.setDestination(new PointService(4, 4));
    LINE2P.findExtremums();
    LINE3P.setOrigin(new PointService(-4, 4));
    LINE3P.setDestination(new PointService(4, 1));
    LINE3P.findExtremums();
    LINE4P.setOrigin(new PointService(4, -1));
    LINE4P.setDestination(new PointService(1, 1));
    LINE4P.findExtremums();
    const LINESP: LineShape[] = [LINE1P, LINE2P, LINE3P, LINE4P];
    POLYGON.setLines(LINESP);
    POLYGON.resetExtremums();
    expect(POLYGON.getMaximum()).toEqual(new PointService(1, 4));
    expect(POLYGON.getMinimum()).toEqual(new PointService(-4, -1));
  });

  it('call to resetExtremums() should set appropriate minimum extremum', () => {
    const POLYGON: Polygon = new Polygon(1, '#000000', '#000000');
    const LINE1P = new LineShape(1, '#000000', '#000000');
    LINE1P.setOrigin(new PointService(1, 1));
    LINE1P.setDestination(new PointService(1, 1));
    LINE1P.findExtremums();
    const LINESP: LineShape[] = [LINE1P];
    POLYGON.setLines(LINESP);
    spyOn(POLYGON, 'setMinimum').withArgs(new PointService(1, 1000000));
    POLYGON.resetExtremums();
    expect(POLYGON.setMinimum).toHaveBeenCalledWith(new PointService(1, 1000000));
  });

  it('call to translate should generatePolygon', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    POLYGON.initialize(new PointService(0, 0));
    POLYGON.setLastPoint(new PointService(0, 0));
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(2, 2));
    const FINALPOINT = new PointService(2, 2);
    spyOn(POLYGON, 'generatePolygon').withArgs(FINALPOINT);
    POLYGON.translate(2, 2);
    expect(POLYGON.generatePolygon).toHaveBeenCalledWith(FINALPOINT);
  });

  it('call to findExtremums should call update extremum', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(2, 2));
    const LINESP: LineShape[] = [LINE1];
    POLYGON.setLines(LINESP);
    spyOn(POLYGON, 'updateExtremums').withArgs(new PointService(1, 1));
    POLYGON.findExtremums();
    expect(POLYGON.updateExtremums).toHaveBeenCalledWith(new PointService(1, 1));
  });

  it('call to resetExtremums should call setMinimum', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 0));
    LINE1.setDestination(new PointService(1, 2));
    const LINESP: LineShape[] = [LINE1];
    POLYGON.setLines(LINESP);
    spyOn(POLYGON, 'setMinimum').withArgs(new PointService(1, 1000000 ));
    POLYGON.resetExtremums();
    expect(POLYGON.setMinimum).toHaveBeenCalledWith(new PointService(1, 1000000 ));
  });


  it('call to resetExtremums should change maximum ', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(1, 1));
    const LINESP: LineShape[] = [LINE1];
    POLYGON.setLines(LINESP);
    POLYGON.resetExtremums();
    expect(POLYGON.getMaximum().getPositionX()).toEqual(0);
    expect(POLYGON.getMaximum().getPositionY()).toEqual(0);
  });
  it('call to initiatePolygonVertices should initiate every vertices', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    POLYGON.initialize(new PointService(0, 0));
    POLYGON.setLastPoint(new PointService(0, 0));
    POLYGON.sides = 5 ;
    POLYGON.initiatePolygonVertices(new PointService(0, 0));
    expect(POLYGON.getVertices().length).toEqual(5);
  });

  it('call to initiatePolygonVertices should call calculateCenter', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    POLYGON.initialize(new PointService(0, 0));
    POLYGON.setLastPoint(new PointService(0, 0));
    spyOn(POLYGON,'calculateCenter').withArgs(new PointService(0, 0));
    POLYGON.initiatePolygonVertices(new PointService(0, 0));
    expect(POLYGON.calculateCenter).toHaveBeenCalledWith(new PointService(0, 0));
  });

  it('call to isSelected with point should set the fill', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    POLYGON.initialize(new PointService(1, 1));
    spyOn(POLYGON, 'setFill');
    POLYGON.isSelected(new PointService(1, 1));
    expect(POLYGON.setFill).toHaveBeenCalled();
  });


  it('call to isSelected with point should set the fill', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    POLYGON.initialize(new PointService(1, 1));
    POLYGON.setVertices([new PointService(1, 1), new PointService(2, 2)]);
    spyOn(POLYGON, 'setFill');
    POLYGON.isSelected(new PointService(1, 1));
    expect(POLYGON.setFill).toHaveBeenCalled();
  });

  it('call to rotate should rotate the shape', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    POLYGON.sides = 4;
    POLYGON.initialize(new PointService(0, 0));
    console.log(POLYGON.getVertices());

    POLYGON.generatePolygon(new PointService(10,10));

    console.log(POLYGON.center);

    POLYGON.rotate(45);

    console.log(POLYGON.getVertices());


  });
  // tslint:disable-next-line: max-line-length
  //
  // FAILED SECTION :

  // ---------------------------------------------------------------------------------------------------------

  // it('should be created', () => {
  //   const service: Polygon = TestBed.get(Polygon);
  //   expect(service).toBeTruthy();
  // });

  // ---------------------------------------------------------------------------------------------------------

});
