import { PointService } from '../../../services/point/point.service';
import { ShapesContainerService } from '../../../services/shapesContainer/shapesContainer.service';
import { Shape } from '../../shapes/shape/shape';
import { Command } from '../command/command';

export class TranslationCommand extends Command {
    private shapes: Shape[];
    private translation: PointService;

    constructor(shapes: Shape[], private shapeContainer: ShapesContainerService, translation: PointService){
        super();
        this.shapes = shapes;
        this.translation = translation;
    }

    execute(): void {
        // this.shapeContainer.addShape(this.shapes);
        for (const SHAPE of this.shapes) {
            SHAPE.translate(this.translation.getPositionX(), this.translation.getPositionY());
        }

        for (const SHAPE of this.shapes) {
            this.shapeContainer.removeShape(SHAPE);
            this.shapeContainer.addShape(SHAPE);
        }
    }

    cancel(): void {
        for (const SHAPE of this.shapes) {
            SHAPE.translate(-this.translation.getPositionX(), -this.translation.getPositionY());
        }
        for (const SHAPE of this.shapes) {
            this.shapeContainer.removeShape(SHAPE);
            this.shapeContainer.addShape(SHAPE);
        }
    }
}
