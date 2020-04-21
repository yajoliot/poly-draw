 import { LineShape } from 'src/models/shapes/line/line';
 import { PointService } from 'src/services/point/point.service';
 import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
 import { TranslationCommand } from './translation-command';

 describe('TranslationCommand', () => {
//   it('should create an instance', () => {
//     expect(new TranslationCommand()).toBeTruthy();
//   });

it('execute should translate and remove the shape', () => {
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(2, 2));
    const CONTAINER = new ShapesContainerService();
    const  COLORCOMMAND = new TranslationCommand([LINE1], CONTAINER, new PointService(1, 1));
    spyOn(COLORCOMMAND['shapeContainer'], 'removeShape').withArgs(LINE1);
    COLORCOMMAND.execute();
    expect(COLORCOMMAND['shapeContainer'].removeShape).toHaveBeenCalledWith(LINE1);
    expect(LINE1.getDestination().getPositionX()).toBe(3);
    expect(LINE1.getDestination().getPositionY()).toBe(3);
  });

it('Cancel should cancel the previous translation and remove the shape', () => {
    const LINE1 = new LineShape(1, '#000000', '#000000');
    LINE1.setOrigin(new PointService(1, 1));
    LINE1.setDestination(new PointService(2, 2));
    const CONTAINER = new ShapesContainerService();
    const  COLORCOMMAND = new TranslationCommand([LINE1], CONTAINER, new PointService(1, 1));
    spyOn(COLORCOMMAND['shapeContainer'], 'removeShape').withArgs(LINE1);
    COLORCOMMAND.cancel();
    expect(COLORCOMMAND['shapeContainer'].removeShape).toHaveBeenCalledWith(LINE1);
    expect(LINE1.getDestination().getPositionX()).toBe(1);
    expect(LINE1.getDestination().getPositionY()).toBe(1);
  });

 });
