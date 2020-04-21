import { Shape } from 'src/models/shapes/shape/shape';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { Command } from '../command/command';

export class EraserCommandService extends Command {
  private shapes: Shape[];

  constructor(shapes: Shape[], private shapeContainer: ShapesContainerService) {
    super();
    this.shapes = shapes;
  }

  execute(): void {
    for (const SHAPE of this.shapes) {
      this.shapeContainer.removeShape(SHAPE);
    }
  }

  cancel(): void {
    for (const SHAPE of this.shapes) {
      this.shapeContainer.addShape(SHAPE);
    }
  }
}