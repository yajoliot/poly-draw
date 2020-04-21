import { Shape } from 'src/models/shapes/shape/shape';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { Command } from '../command/command';

export class ColorCommand extends Command {
    private shape: Shape;
    private color: string;

    constructor(shape: Shape, private shapeContainer: ShapesContainerService, color: string) {
        super();
        this.shape = shape;
        this.color = color;
    }

    execute(): void {
        const TEMP_COLOR = this.shape.getSecondaryColor();
        const TEMP_SHAPE = this.shape;

        this.shapeContainer.removeShape(this.shape);

        this.shape.setSecondaryColor(this.color);
        this.shape.setFill();

        this.shapeContainer.addShape(this.shape);

        this.shape = TEMP_SHAPE;
        this.color = TEMP_COLOR;
    }

    execute2(): void {

        const TEMP_COLOR = this.shape.getMainColor();
        const TEMP_SHAPE = this.shape;
        if (TEMP_COLOR !== 'none') {
            this.shapeContainer.removeShape(this.shape);
            this.shape.setMainColor(this.color);
            this.shape.setFill();
            this.shapeContainer.addShape(this.shape);

            this.shape = TEMP_SHAPE;
            this.color = TEMP_COLOR; }}

    cancel(): void {
        const TEMP_COLOR = this.shape.getSecondaryColor();
        const TEMP_SHAPE = this.shape;

        this.shapeContainer.removeShape(this.shape);

        this.shape.setSecondaryColor(this.color);
        this.shape.setFill();

        this.shapeContainer.addShape(this.shape);

        this.shape = TEMP_SHAPE;
        this.color = TEMP_COLOR;
    }
}
