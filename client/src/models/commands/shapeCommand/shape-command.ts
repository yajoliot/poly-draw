import { Shape } from 'src/models/shapes/shape/shape';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { Command } from '../command/command';

export class ShapeCommand extends Command{
    private shape: Shape;

    constructor(shape: Shape, private shapeContainer: ShapesContainerService){
        super();
        this.shape = shape;
    }

    execute(): void {
        this.shapeContainer.addShape(this.shape);
    }

    cancel(): void {
        this.shapeContainer.removeShape(this.shape);
    }
}
