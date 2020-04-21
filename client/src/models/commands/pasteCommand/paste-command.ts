import { ShapesContainerService } from '../../../services/shapesContainer/shapesContainer.service';
import { Shape } from '../../shapes/shape/shape';
import { Command } from '../command/command';

export class PasteCommand extends Command {
    private shapes: Shape[];

    constructor(shapes: Shape[], private shapeContainer: ShapesContainerService){
        super();
        this.shapes = shapes;
    }

    execute(): void {

        for (const SHAPE of this.shapes) {
            this.shapeContainer.addShape(SHAPE);
        }
    }

    cancel(): void {
        for (const SHAPE of this.shapes) {
            this.shapeContainer.removeShape(SHAPE);
        }
    }
}
