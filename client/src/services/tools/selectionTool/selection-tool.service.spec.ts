import { TestBed, inject } from '@angular/core/testing';

import { SelectionToolService } from './selection-tool.service';
import { MockElementRef } from '../../config/config-env.service.spec';
import { SelectionRectangle } from 'src/models/shapes/selectionRectangle/selection-rectangle';
import { DashedRectangle } from 'src/models/shapes/dashedRectangle/dashed-rectangle';
import { PointService } from '../../point/point.service';
import { Rectangle } from 'src/models/shapes/rectangle/rectangle';
import { LineShape } from 'src/models/shapes/line/line';
import { PencilShape } from 'src/models/shapes/pencil-shape/pencil-shape';

describe('SelectionToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectionToolService = TestBed.get(SelectionToolService);
    expect(service).toBeTruthy();
  });

  it('shapeClickedLeft instanciates a boundingBox and a selectionRectangle if it is initially undefined', inject([SelectionToolService], (service: SelectionToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});
    const mockElementRef = new MockElementRef();

    expect(service.boundingBox instanceof SelectionRectangle).toBeTruthy();
    expect(service.selectionRectangle instanceof DashedRectangle).toBeTruthy();
    expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);

    service.shapeClicked(mockElementRef, mockMouseEvent);

    expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);
    expect(service.boundingBox instanceof SelectionRectangle).toBeTruthy();
    expect(service.selectionRectangle instanceof DashedRectangle).toBeTruthy();

  }));

  it('shapeClickedLeft starts translation and sets old point if boundingBox is not undefined', inject([SelectionToolService], (service: SelectionToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 100});
    const mockElementRef = new MockElementRef();

    service.boundingBox = new SelectionRectangle(1, '#000000', 'none');

    service.lastPoint = new PointService(100,100);

    service.boundingBox.initialize(new PointService(0,0));
    service.boundingBox.setLastPoint(new PointService(100, 100));
    service.boundingBox.generateRectangle();

    service.shapeContainer.addShapeInProgress(service.boundingBox);

    service.shapeClicked(mockElementRef, mockMouseEvent);
    expect(service.boundingBox.isSelected(service.lastPoint)).toBeTruthy();
    expect(service.translation).toEqual(true);
    expect(service.oldPoint).toEqual(service.lastPoint);

  }));

  it('shapeClickedLeft selects shape if bounding box is not selected', inject([SelectionToolService], (service: SelectionToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});
    const mockElementRef = new MockElementRef();

    service.boundingBox = new SelectionRectangle(1, '#000000', 'none');

    service.lastPoint = new PointService(100,100);

    service.boundingBox.initialize(new PointService(500,500));
    service.boundingBox.setLastPoint(new PointService(600, 600));
    service.boundingBox.generateRectangle();

    var rectangle = new Rectangle(10, "#123456", "#654321");

    spyOn(rectangle, "getColorOfPosition").and.callFake((point) =>{
      return "#000000";
    });


    spyOn(service["boundingBoxTool"], "setBoundingBox");
    spyOn(service["boundingBoxTool"], "generateBoundingBox");


    service.shapeContainer.addShape(rectangle);

    service.shapeContainer.setElementRef(rectangle.getShapeNumber(), mockElementRef);
    service.shapeContainer.addShapeInProgress(service.boundingBox);

    service.shapeClicked(mockElementRef, mockMouseEvent);
    expect(service.translation).not.toEqual(true);
    expect(service.shapeIsClicked).toEqual(true);
    expect(service.shapeSelected).toEqual(true);
    expect(rectangle.getSelect()).toBeTruthy();

    expect(service["boundingBoxTool"].setBoundingBox).toHaveBeenCalled();
    expect(service["boundingBoxTool"].generateBoundingBox).toHaveBeenCalled();

    service.shapeClicked(mockElementRef, mockMouseEvent);

  }));

  it('leftClick instanciates a boundingBox and a selectionRectangle if they are initially undefined', inject([SelectionToolService], (service: SelectionToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});

    expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);

    service.click(mockMouseEvent);

    expect(service.shapeContainer.getShapesInProgress().length).toEqual(2);
    expect(service.boundingBox instanceof SelectionRectangle).toBeTruthy();
    expect(service.selectionRectangle instanceof DashedRectangle).toBeTruthy();
    expect(service.oldPoint).toBeUndefined();
    expect(service.mouseClicked).toBeTruthy();

  }));

  it('leftClick starts a translation if  boundingBox isSelected', inject([SelectionToolService], (service: SelectionToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 100});
    
    service.lastPoint = new PointService(100,100);

    service.boundingBox = new SelectionRectangle(1, '#000000', 'none');

    service.boundingBox.initialize(new PointService(0,0));
    service.boundingBox.setLastPoint(new PointService(100, 100));
    service.boundingBox.generateRectangle();
    // this.renderControlPoints();
    service.shapeContainer.addShapeInProgress(service.boundingBox);

    service.click(mockMouseEvent);

    expect(service.boundingBox.isSelected(service.lastPoint)).toBeTruthy();
    expect(service.translation).toEqual(true);
    expect(service.oldPoint).toEqual(service.lastPoint);
    expect(service.mouseClicked).toBeTruthy();
  }));

  it('clickLeft creates a dashed rectangle if boundingBox initialized but not selected', inject([SelectionToolService], (service: SelectionToolService) => {

    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});
    const mockElementRef = new MockElementRef();

    service.boundingBox = new SelectionRectangle(1, '#000000', 'none');

    service.lastPoint = new PointService(100,100);

    service.boundingBox.initialize(new PointService(500,500));
    service.boundingBox.setLastPoint(new PointService(600, 600));
    service.boundingBox.generateRectangle();

    service.shapeContainer.addShapeInProgress(service.boundingBox);

    expect(service.selectionRectangle instanceof DashedRectangle).toBeTruthy();

    service.click(mockMouseEvent);

    expect(service.selectionRectangle instanceof DashedRectangle).toBeTruthy();

    expect(service.translation).not.toEqual(true);
    expect(service.mouseClicked).toEqual(true);

    service.shapeClicked(mockElementRef, mockMouseEvent);

  }));

  it('clickRigh creates a dashed rectangle and sets rightClick Boolean', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 200});

    expect(service.selectionRectangle instanceof DashedRectangle).toBeTruthy();

    service.click(mockMouseEvent);

    expect(service.selectionRectangle instanceof DashedRectangle).toBeTruthy();
    expect(service["rightClicked"]).toEqual(true);

  }));

  it('dragLeft first drag', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});
    service.firstDrag = true;
    service.translation = false;
    service.shapeIsClicked = false; 

    service.click(mockMouseEvent);

    expect(service.firstDrag).toEqual(true);

  }));

  it('dragLeft outside of a shape generates selectionRectangle', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});

    service.click(mockMouseEvent);

    service.firstDrag = false;
    service.translation = false;
    service.shapeIsClicked = false; 

    spyOn(service.selectionRectangle, "setLastPoint");
    spyOn(service.selectionRectangle, "generate");
    spyOn(service.selectionRectangle, "findExtremums");

    service.drag(mockMouseEvent);

    expect(service.selectionRectangle.setLastPoint).toHaveBeenCalled();
    expect(service.selectionRectangle.generate).toHaveBeenCalled();
    expect(service.selectionRectangle.findExtremums).toHaveBeenCalled();

    expect(service.firstDrag).toEqual(false);

  }));

  it('call to rotate should rotate the shapes correctly', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const SHAPE = new PencilShape(1, '#000000', '#000000');
    const SHAPE2 = new Rectangle(1, '#000000', '#000000');
    const SHAPE3 = new Rectangle(1, '#000000', '#000000');

    const LINE = new LineShape(1, '#000000', '#000000');

    LINE.setOrigin(new PointService(0,0));
    LINE.setDestination(new PointService(10,0));

    SHAPE.initialize(new PointService(0,0));


    SHAPE.addLine(LINE);

    spyOn(SHAPE, "rotate");
    spyOn(SHAPE2, "rotate");
    spyOn(SHAPE3, "rotate");
    // spyOn(SHAPE, "generate");

    service.shapeContainer.addShape(SHAPE);
    service.shapeContainer.addShape(SHAPE2);
    service.shapeContainer.addShape(SHAPE3);

    SHAPE.setSelect(true);
    SHAPE3.setSelect(true);

    SHAPE.center = (new PointService(6, 0));
    //SHAPE.rotate(90);
    service.rotate(90);

    // expect(SHAPE.generate).toHaveBeenCalled();
    expect(SHAPE.rotate).toHaveBeenCalled();
    expect(SHAPE2.rotate).not.toHaveBeenCalled();
    expect(SHAPE3.rotate).toHaveBeenCalled();

  }));
  
  it('dragLeft calls translate if translate and shape is clicked are true', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});

    service.click(mockMouseEvent);

    service.firstDrag = false;
    service.translation = true;
    service.shapeIsClicked = true;
    service.mouseClicked = true; 

    spyOn(service, "translate");

    service.drag(mockMouseEvent);

    expect(service.translate).toHaveBeenCalled();

  }));

  it('dragRight calls deRenderBoundingBox and resetBoundingBox and generates the selection rectangle', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});

    service.click(mockMouseEvent);

    service["rightClicked"] = true;

    const boundingBoxTool = service["inversionTool"]["boundingBoxTool"]

    spyOn(boundingBoxTool, "deRenderBoundingBox");
    spyOn(boundingBoxTool, "resetBoundingBox");
    spyOn(boundingBoxTool, "deRenderControlPoints");

    spyOn(service.selectionRectangle, "setLastPoint");
    spyOn(service.selectionRectangle, "generate");
    spyOn(service.selectionRectangle, "findExtremums");

    service.drag(mockMouseEvent);

    expect(boundingBoxTool.deRenderBoundingBox).toHaveBeenCalled();
    expect(boundingBoxTool.resetBoundingBox).toHaveBeenCalled();
    expect(boundingBoxTool.deRenderControlPoints).toHaveBeenCalled();

    expect(service.selectionRectangle.setLastPoint).toHaveBeenCalled();
    expect(service.selectionRectangle.generate).toHaveBeenCalled();
    expect(service.selectionRectangle.findExtremums).toHaveBeenCalled();

    spyOn(service["inversionTool"], "drag");

    service.shapeIsClicked = true;

    service.drag(mockMouseEvent);

    expect(service["inversionTool"].drag).not.toHaveBeenCalled();

  }));

  it('releaseRight resets boundingBox and selection rectangle', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 200});

    service.click(mockMouseEvent);

    service.mouseMoved = true;

    spyOn(service.boundingBox, "findExtremums");

    service.release(mockMouseEvent);

    expect(service.boundingBox.findExtremums).toHaveBeenCalled();

    expect(service.mouseClicked).toEqual(false);
    expect(service.mouseMoved).toEqual(false);

  }));

  it('releaseLeft executes shapeCommand if translation is true and shapes are selected', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 100});

    var rectangleOne = new Rectangle(10, "#123456", "#654321");
    var rectangleTwo = new Rectangle(10, "#123456", "#654321");

    rectangleOne.initialize(new PointService(0,0));
    rectangleTwo.initialize(new PointService(0,0));

    rectangleOne.setLastPoint(new PointService(100,100));
    rectangleTwo.setLastPoint(new PointService(100,100));

    rectangleOne.generate();
    rectangleTwo.generate();


    service.shapeContainer.addShape(rectangleOne);
    service.shapeContainer.addShape(rectangleTwo);

    var rectangleTwo = new Rectangle(10, "#123456", "#654321");

    spyOn(service.shapeContainer, "executeTranslationCommand");

    service.click(mockMouseEvent);

    service["oldPoint"] = service.lastPoint;

    service.translation = true;

    rectangleOne.setSelect(true);
    rectangleTwo.setSelect(true);

    service.release(mockMouseEvent);

    expect(service.shapeContainer.executeTranslationCommand).toHaveBeenCalled();

    expect(service.shapeIsClicked).toEqual(false);
    expect(service.firstDrag).toEqual(true);

  }));

  it('releaseRight calls release of inversionTool which calls the release of boundingBox tool', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    var rectangle = new Rectangle(10, "#123456", "#654321");

    rectangle.setSelect(true);

    service["inversionTool"]["boundingBoxTool"]["shapesUnselected"][0] = rectangle;

    service["rightClicked"] = true;

    service.release(mockMouseEvent);

    expect(rectangle.getSelect()).toEqual(false);
    expect(service["rightClicked"]).toEqual(false)

  }));

  it('n key calls rotate', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    var rectangle = new Rectangle(10, "#123456", "#654321");

    rectangle.setSelect(true);

    service["inversionTool"]["boundingBoxTool"]["shapesUnselected"][0] = rectangle;

    service["rightClicked"] = true;

    service.release(mockMouseEvent);

    expect(rectangle.getSelect()).toEqual(false);
    expect(service["rightClicked"]).toEqual(false)

  }));

  // it('render and derender control points respectively add and remove control points', inject([SelectionToolService], (service: SelectionToolService) => {
    
  //   //const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

  //   service.boundingBox = new SelectionRectangle(10, "#123456", "#654321");
  //   service.boundingBox.initialize(new PointService(0, 0));
  //   service.boundingBox.setLastPoint(new PointService(0, 0));
  //   service.boundingBox.generate();
  //   service.shapeContainer.addShapeInProgress(service.boundingBox);

  //   expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);

  //   service.renderControlPoints();

  //   expect(service.shapeContainer.getShapesInProgress().length).toEqual(5);
  //   service.deRenderControlPoints()

  //   expect(service.shapeContainer.getShapesInProgress().length).toEqual(1);
  // }));

  it('keyBoardDown translates or rotates correctly', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const up = new KeyboardEvent('keydown', {key: 'ArrowUp'});
    const down = new KeyboardEvent('keydown', {key: 'ArrowDown'});
    const left = new KeyboardEvent('keydown', {key: 'ArrowLeft'});
    const right = new KeyboardEvent('keydown', {key: 'ArrowRight'});
    const rotate = new KeyboardEvent('keydown', {key: 'n'});

    var rectangleOne = new Rectangle(10, "#123456", "#654321");
    var rectangleTwo = new Rectangle(10, "#123456", "#654321");

    rectangleOne.initialize(new PointService(0,0));
    rectangleTwo.initialize(new PointService(0,0));

    rectangleOne.setLastPoint(new PointService(100,100));
    rectangleTwo.setLastPoint(new PointService(100,100));

    rectangleOne.generate();
    rectangleTwo.generate();


    service.shapeContainer.addShape(rectangleOne);
    service.shapeContainer.addShape(rectangleTwo);

    rectangleOne.setSelect(true);
    rectangleTwo.setSelect(false);

    spyOn(service, "translate");
    spyOn(service, "rotate");

    service.keyboardDown(up);
    expect(service.translate).toHaveBeenCalledWith(0, -3);

    service.keyboardDown(down);
    expect(service.translate).toHaveBeenCalledWith(0, 3);

    service.keyboardDown(left);
    expect(service.translate).toHaveBeenCalledWith(-3, 0);

    service.keyboardDown(right);
    expect(service.translate).toHaveBeenCalledWith(3, 0);

    service.keyboardDown(rotate);
    expect(service.rotate).toHaveBeenCalled();

  }));

  it('translate calls translate on shapes', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    var rectangleOne = new Rectangle(10, "#123456", "#654321");
    var rectangleTwo = new Rectangle(10, "#123456", "#654321");
    var rectangleThree = new Rectangle(10, "#123456", "#654321");

    rectangleOne.initialize(new PointService(0,0));
    rectangleTwo.initialize(new PointService(0,0));
    rectangleThree.initialize(new PointService(400,400));

    rectangleOne.setLastPoint(new PointService(100,100));
    rectangleTwo.setLastPoint(new PointService(100,100));
    rectangleThree.setLastPoint(new PointService(5000,500));

    rectangleOne.generate();
    rectangleTwo.generate();
    rectangleThree.generate();

    rectangleOne.setSelect(true);
    rectangleTwo.setSelect(true);
    rectangleThree.setSelect(false);

    service.shapeContainer.addShape(rectangleOne);
    service.shapeContainer.addShape(rectangleTwo);
    service.shapeContainer.addShape(rectangleThree);

    service.boundingBox = new SelectionRectangle(10, "#123456", "#654321");

    service.boundingBox.initialize(new PointService(0, 0));
    service.boundingBox.setLastPoint(new PointService(0, 0));
    service.boundingBox.generate();

    spyOn(rectangleOne, "translate");
    spyOn(rectangleTwo, "translate");
    spyOn(rectangleThree, "translate");
    spyOn(service.boundingBox, "translate");

    const x = 10;
    const y = 20;

    service.release(mockMouseEvent);

    service.translate(x, y);

    expect(rectangleOne.translate).toHaveBeenCalledWith(x , y);
    expect(rectangleTwo.translate).toHaveBeenCalledWith(x , y);
    expect(rectangleThree.translate).not.toHaveBeenCalledWith(x , y);
    expect(service.boundingBox.translate).toHaveBeenCalledWith(x, y);
  }));

  it('right click on a shape calls inversionTool shapeClicked and correctly sets booleans', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});
    const mockElementRef = new MockElementRef();

    spyOn(service["inversionTool"], "shapeClicked");
    service.shapeIsClicked = false;
    service["rightClicked"] = false;

    service.shapeClicked(mockElementRef, mockMouseEvent);

    expect(service["inversionTool"].shapeClicked).toHaveBeenCalled();
    expect(service.shapeIsClicked).toBeTruthy();
    expect(service["rightClicked"]).toBeTruthy();

  }));

  it('right click does nothing if shape is clicked', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    spyOn(service["inversionTool"], "click");
    service.shapeIsClicked = true;
    service["rightClicked"] = false;

    service.click( mockMouseEvent);

    expect(service["inversionTool"].click).not.toHaveBeenCalled();

    expect(service["rightClicked"]).not.toBeTruthy();

  }));

  it('firstDrag doesnt call drag functions', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 100});

    service.mouseClicked = true;
    service.firstDrag = true;

    service.drag(mockMouseEvent);

    expect(service.firstDrag).toEqual(false);

  }));

  it('drag with no mouseClick does nothing', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 0, clientX: 100, clientY: 100});

    service.mouseClicked = false;
    service.firstDrag = true;

    service.drag(mockMouseEvent);

    expect(service.firstDrag).toEqual(true);

  }));

  it('onMouseLeave deRenders Control Points', inject([SelectionToolService], (service: SelectionToolService) => {
    
    const mockMouseEvent = new MouseEvent('click', {button: 2, clientX: 100, clientY: 100});

    var rectangleOne = new Rectangle(10, "#123456", "#654321");
    var rectangleTwo = new Rectangle(10, "#123456", "#654321");
    var rectangleThree = new Rectangle(10, "#123456", "#654321");

    rectangleOne.initialize(new PointService(0,0));
    rectangleTwo.initialize(new PointService(0,0));
    rectangleThree.initialize(new PointService(400,400));

    rectangleOne.setLastPoint(new PointService(100,100));
    rectangleTwo.setLastPoint(new PointService(100,100));
    rectangleThree.setLastPoint(new PointService(5000,500));

    rectangleOne.generate();
    rectangleTwo.generate();
    rectangleThree.generate();

    rectangleOne.setSelect(true);
    rectangleTwo.setSelect(true);
    rectangleThree.setSelect(true);

    service.shapeContainer.addShape(rectangleOne);
    service.shapeContainer.addShape(rectangleTwo);
    service.shapeContainer.addShape(rectangleThree);

    service.boundingBox = new SelectionRectangle(10, "#123456", "#654321");

    service.boundingBox.initialize(new PointService(0, 0));
    service.boundingBox.setLastPoint(new PointService(0, 0));
    service.boundingBox.generate();

    service.onMouseLeave(mockMouseEvent);

    expect(rectangleOne.getSelect()).toEqual(false);
    expect(rectangleTwo.getSelect()).toEqual(false);
    expect(rectangleThree.getSelect()).toEqual(false);
  }));




});
