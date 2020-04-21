import { Shape } from 'src/models/shapes/shape/shape';
import { PointService } from 'src/services/point/point.service';
import { LineShape } from '../line/line';

export class GridShape extends Shape {
    private lines: LineShape[];
    protected opacity: string;
    constructor(width: number, mainColor: string, secondaryColor: string) {
        super(width, mainColor, secondaryColor);
        this.lines = new Array<LineShape>();
        this.opacity = '0.1';
        this.isGrid = true;
    }
    generate(): void {
        this.instruction = '';
        for (const LINE of this.lines) {
            LINE.generate();
            this.instruction += LINE.instruction;
        }
    }

    drawLine(origin: PointService, destination: PointService): void {
      const LINE = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
      LINE.generateLine(origin, destination);
      this.lines.push(LINE);
      this.instruction += LINE.instruction;
    }

    reset(): void {
        this.instruction = '';
        this.lines = new Array<LineShape>();
    }
    setOpacity(newOpacity: string): void {
        this.opacity = newOpacity;
        return;
    }

}
