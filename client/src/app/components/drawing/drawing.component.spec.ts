import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigEnvService } from '../../../services/config/config-env.service';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { DrawingComponent } from './drawing.component';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { Rectangle } from 'src/models/shapes/rectangle/rectangle';
import { ToolboxService } from 'src/services/toolbox/toolbox.service';
import { PointService } from 'src/services/point/point.service';

describe('DrawingComponent', () => {
  let component: DrawingComponent;
  let fixture: ComponentFixture<DrawingComponent>;
  let configEnv: ConfigEnvService;
  let shapeContainer: ShapesContainerService;
  let toolbox: ToolboxService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrawingComponent],
      imports: [],
      providers: [ConfigEnvService, ShapesContainerService, ToolboxService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingComponent);
    component = fixture.componentInstance;
    configEnv = TestBed.get(ConfigEnvService);
    shapeContainer = TestBed.get(ShapesContainerService);
    toolbox = TestBed.get(ToolboxService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    spyOn(component, 'createDrawing');
    component.ngAfterViewInit();
    expect(component.createDrawing).toHaveBeenCalled();
  });

  it('ngOnInit', () => {
    component.ngAfterViewInit();
  });

  it('createDrawingUndefined', () => {
    configEnv.backgroundColor = '#000000';
    configEnv.height = 10;
    configEnv.width = 20;
    component.createDrawing();
    expect(component.drawing.nativeElement.style.backgroundColor).toBe('rgb(0, 0, 0)');
    expect(component.drawing.nativeElement.style.width).toBe('20px');
    expect(component.drawing.nativeElement.style.height).toBe('10px');
  });

  it('createDrawingnotUndefined', () => {
    const mockDrawing = {
      r: 100,
      g: 100,
      b: 100,
      o: 100,
      width: 50,
      height: 50
    }

    component.drawingData = mockDrawing;
    component.createDrawing();
    expect(component.drawing.nativeElement.style.backgroundColor).toBe('rgba(100, 100, 100, 0.392)');
    expect(component.drawing.nativeElement.style.width).toBe('50px');
    expect(component.drawing.nativeElement.style.height).toBe('50px');

  });

  it('addShapes()', () => {
    shapeContainer.addShape(new Rectangle(1, '#000000', '#000000'));
    shapeContainer.addShape(new Rectangle(1, '#000000', '#000000'));
    component.addShapes();
  });

  it('onShapeCLick()', () => {
    configEnv.blockKeyEvents = true;
    component.onShapeClick(new ElementRef(1), new MouseEvent('mousedown'));
    configEnv.blockKeyEvents = false;
    component.onShapeClick(new ElementRef(1), new MouseEvent('mousedown'));
    toolbox.selectTool('Rectangle');
    component.onShapeClick(new ElementRef(1), new MouseEvent('mousedown'));

  });

  it('removeShapes()', () => {
    component.removeShapes();
    shapeContainer.removeShape(new Rectangle(1, '#000000', '#000000'));
    shapeContainer.removeShape(new Rectangle(1, '#000000', '#000000'));
    component.removeShapes();
  });

  it('erase()', () => {
    shapeContainer.addShape(new Rectangle(1, '#000000', '#000000'));
    component.erase();
    expect(shapeContainer.getShapes().size).toBe(0);
  });

  it('click()', () => {
    configEnv.blockKeyEvents = true;
    component.click(new MouseEvent('mousedown'));
    configEnv.blockKeyEvents = false;
    component.click(new MouseEvent('mousedown'));
    toolbox.selectTool('Pencil');
    component.click(new MouseEvent('mousedown'));

  });
  it('drag()', () => {
    configEnv.blockKeyEvents = true;
    component.drag(new MouseEvent('mousemove'));
    configEnv.blockKeyEvents = false;
    component.drag(new MouseEvent('mousemove'));
    toolbox.selectTool('Pencil');
    component.drag(new MouseEvent('mousemove'));

  });

  it('release()', () => {

    configEnv.blockKeyEvents = true;
    component.release(new MouseEvent('mouseup'));
    configEnv.blockKeyEvents = false;
    component.release(new MouseEvent('mouseup'));

    toolbox.selectTool('Rectangle');
    const rectMock = new Rectangle(1, '#000000', '#000000');
    rectMock.setLastPoint(new PointService(1, 1));
    rectMock.initialize(new PointService(1, 2));
    toolbox.getTool().shapeInProgress = rectMock;

    component.release(new MouseEvent('mouseup'));

  });

  it('keyDown()', () => {
    toolbox.selectTool('Rectangle');
    const rectMock: Rectangle = new Rectangle(1, '#000000', '#000000');
    rectMock.initialize(new PointService(1, 1));
    rectMock.setLastPoint(new PointService(1, 1));
    toolbox.getTool().shapeInProgress = rectMock;
    configEnv.blockKeyEvents = false;
    let keyboardMock = new KeyboardEvent('keydown', { key: 'Shift' });
    component.keyDown(keyboardMock);

    keyboardMock = new KeyboardEvent('keydown', { key: 'Backspace' });
    component.keyDown(keyboardMock);

    keyboardMock = new KeyboardEvent('keydown', { key: 'Escape' });
    component.keyDown(keyboardMock);

    keyboardMock = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    component.keyDown(keyboardMock);

    keyboardMock = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    component.keyDown(keyboardMock);

    keyboardMock = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    component.keyDown(keyboardMock);

    keyboardMock = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    component.keyDown(keyboardMock);

    keyboardMock = new KeyboardEvent('keydown', { key: 'p' });
    component.keyDown(keyboardMock);

    shapeContainer.executeShapeCommand(new Rectangle(1, "#000000", '#000000'));

    keyboardMock = new KeyboardEvent('keydown', { key: 'u' });
    component.keyDown(keyboardMock);

    keyboardMock = new KeyboardEvent('keydown', { key: 'r' });
    component.keyDown(keyboardMock);

    keyboardMock = new KeyboardEvent('keydown', { key: 'z' });
    component.keyDown(keyboardMock);
  });

  it('shiftUp', () => {

    const keyboardMock = new KeyboardEvent('keyup', { key: 'Shift' });
    const rectMock = new Rectangle(1, '#00000', '#000000');
    rectMock.initialize(new PointService(1, 1));
    rectMock.setLastPoint(new PointService(1, 1))
    toolbox.selectTool('Rectangle');
    toolbox.getTool().shapeInProgress = rectMock;

    configEnv.blockKeyEvents = true;
    component.keyUp(keyboardMock);
    configEnv.blockKeyEvents = false;
    component.keyUp(keyboardMock);
  });

  it('mouseOut()', () => {
    const mouseMock = new MouseEvent('mouseleave');
    toolbox.selectTool('Rectangle');
    const rectMock = new Rectangle(1, '#00000', '#000000');
    rectMock.initialize(new PointService(1, 1));
    rectMock.setLastPoint(new PointService(1, 1))
    toolbox.getTool().shapeInProgress = rectMock;

    configEnv.blockKeyEvents = true;
    component.mouseOut(mouseMock);

    configEnv.blockKeyEvents = false;
    component.mouseOut(mouseMock);

  });

  it('dblClick()', () => {
    const mouseMock = new MouseEvent('dlbclick');

    configEnv.blockKeyEvents = true;
    component.mouseOut(mouseMock);

    configEnv.blockKeyEvents = false;
    component.mouseOut(mouseMock);
  });

  it('configEnv DrawingContinuClicked', () => {
    component['configEnv'].continuDrawingClicked = true;
    component.ngAfterViewInit();
    expect(component['configEnv'].continuDrawingClicked).toBe(false);
  });

  it('loadCache drawing null', () => {
    window.localStorage.clear();
    component.loadCached();
  });

  it('loadCache svg null', () => {

    window.localStorage.clear();

    window.localStorage.setItem('drawing', JSON.stringify({
      width: '100px',
      height: '100px',
      backgroundColor: '#000000'
    }));

    component.loadCached();
    expect(component.drawing.nativeElement.style.backgroundColor).toBe('rgb(0, 0, 0)')
    expect(component.drawing.nativeElement.style.width).toBe('100px');
    expect(component.drawing.nativeElement.style.height).toBe('100px');
  });

  it('loadCache', () => {

    window.localStorage.clear();

    window.localStorage.setItem('drawing', JSON.stringify({
      width: '100px',
      height: '100px',
      backgroundColor: '#000000'
    }));

    window.localStorage.setItem('svgNum', '2');

    component.loadCached();
    expect(component.drawing.nativeElement.style.backgroundColor).toBe('rgb(0, 0, 0)')
    expect(component.drawing.nativeElement.style.width).toBe('100px');
    expect(component.drawing.nativeElement.style.height).toBe('100px');
  });

  it('load from server', () => {

    configEnv.backgroundColor = '#000000';
    configEnv.height = 10;
    configEnv.width = 20;
    component['configEnv'].openFromServerClicked = true;
    component.createDrawing();
    expect(component.drawing.nativeElement.style.backgroundColor).toBe('rgb(0, 0, 0)');
    expect(component.drawing.nativeElement.style.width).toBe('20px');
    expect(component.drawing.nativeElement.style.height).toBe('10px');
  });
});
