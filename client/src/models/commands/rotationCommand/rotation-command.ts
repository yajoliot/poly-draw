import { Command } from '../command/command';
import { Shape } from 'src/models/shapes/shape/shape';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { PointService } from 'src/services/point/point.service';

export class RotationCommand extends Command {

    private shapes: Shape[];
    private degree: number;
    private point: PointService;
    private isRelative: boolean;

    constructor(shapes: Shape[], degree: number, point: PointService, isRelative : boolean, private shapeContainer: ShapesContainerService) {
      super();
      this.shapes = shapes;
      this.degree = degree;
      this.point = point;
      this.isRelative = isRelative;
    }

    execute(): void {
    if(this.isRelative){
        for (const SHAPE of this.shapes) {

            SHAPE.rotateAboutPoint(this.degree, this.point);
    
            this.shapeContainer.removeShape(SHAPE);
            this.shapeContainer.addShape(SHAPE);
            }
    }else{
        for (const SHAPE of this.shapes) {

            SHAPE.rotate(this.degree);
    
            this.shapeContainer.removeShape(SHAPE);
            this.shapeContainer.addShape(SHAPE);
            }
    }

    }

    cancel(): void {
        if(this.isRelative){
            for (const SHAPE of this.shapes) {
        
                SHAPE.rotateAboutPoint(-this.degree, this.point);
                this.shapeContainer.removeShape(SHAPE);
                this.shapeContainer.addShape(SHAPE);
              }
        }else{
            for (const SHAPE of this.shapes) {
        
                SHAPE.rotate(-this.degree);
                this.shapeContainer.removeShape(SHAPE);
                this.shapeContainer.addShape(SHAPE);
              }
        }
      
    }
}
