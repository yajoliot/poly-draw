
import { Polygon } from 'src/models/shapes/polygon/polygon';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { ColorCommand } from './color-command';

describe('ColorCommand', () => {
   it('execute should set the color', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    const CONTAINER = new ShapesContainerService();
    const  COLORCOMMAND = new ColorCommand(POLYGON, CONTAINER, '#000000');
    spyOn(COLORCOMMAND['shape'], 'setFill');
    COLORCOMMAND.execute();
    expect(COLORCOMMAND['shape'].setFill).toHaveBeenCalled();
  });

   it('execute2 should set the color if not none', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    const CONTAINER = new ShapesContainerService();
    const  COLORCOMMAND = new ColorCommand(POLYGON, CONTAINER, '#000000');
    spyOn(COLORCOMMAND['shape'], 'setFill');
    COLORCOMMAND.execute2();
    expect(COLORCOMMAND['shape'].setFill).toHaveBeenCalled();
  });

   it('execute2 should not set the color if  none', () => {
    const POLYGON = new Polygon(1, 'none', 'none');
    const CONTAINER = new ShapesContainerService();
    const  COLORCOMMAND = new ColorCommand(POLYGON, CONTAINER, 'none');
    spyOn(COLORCOMMAND['shape'], 'setFill');
    COLORCOMMAND.execute2();
    expect(COLORCOMMAND['shape'].setFill).not.toHaveBeenCalled();
  });

   it('cancel should remove old shape', () => {
    const POLYGON = new Polygon(1, '#000000', '#000000');
    const CONTAINER = new ShapesContainerService();
    const  COLORCOMMAND = new ColorCommand(POLYGON, CONTAINER, '#000000');
    spyOn(COLORCOMMAND['shapeContainer'], 'removeShape').withArgs(COLORCOMMAND['shape']);
    COLORCOMMAND.cancel();
    expect(COLORCOMMAND['shapeContainer'].removeShape).toHaveBeenCalledWith(COLORCOMMAND['shape']);
  });

 });
