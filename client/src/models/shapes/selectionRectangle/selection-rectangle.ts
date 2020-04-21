import { PointService } from 'src/services/point/point.service';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { ControlPoint } from '../controlPoint/control-point';
import { Rectangle } from '../rectangle/rectangle';
const CONTROLPOINTWIDTH = 6;

export class SelectionRectangle extends Rectangle {
  private controlPoints: ControlPoint[];
  null: boolean;
  constructor(width: number, mainColor: string, secondaryColor: string) {
    super(width, secondaryColor, mainColor);
    this.controlPoints = [];
    const FIRSTPOINT = new ControlPoint(1, '#000000', 'none');
    const SECONDPOINT = new ControlPoint(1, '#000000', 'none');
    const THIRDPOINT = new ControlPoint(1, '#000000', 'none');
    const FOURTHPOINT = new ControlPoint(1, '#000000', 'none');
    this.controlPoints[0] = FIRSTPOINT;
    this.controlPoints[1] = SECONDPOINT;
    this.controlPoints[2] = THIRDPOINT;
    this.controlPoints[3] = FOURTHPOINT;
    this.null = true;
  }
  getControlPoints(): Rectangle[] {
    return this.controlPoints;
  }
  generateRectangle(): void {
    super.generateRectangle();
    super.findExtremums();
    /* console.log('Select');
    console.log('MIN');
    console.log(this.minimum);
    console.log('MAX');
    console.log(this.maximum); */
    this.generateControlPoints(this.minimum, this.maximum);
  }

  generateControlPoints(minimum: PointService, maximum: PointService): void {
    const MIDWIDTH = (maximum.getPositionX() - minimum.getPositionX()) / 2;
    const MIDHEIGHT = (maximum.getPositionY() - minimum.getPositionY()) / 2;
    this.controlPoints[0].initialize(new PointService(minimum.getPositionX() + MIDWIDTH - (CONTROLPOINTWIDTH / 2),
      minimum.getPositionY()));
    this.controlPoints[0].setLastPoint(new PointService(minimum.getPositionX() + MIDWIDTH + (CONTROLPOINTWIDTH / 2),
      minimum.getPositionY() - CONTROLPOINTWIDTH));
    this.controlPoints[0].generateSquare();
    this.controlPoints[0].findExtremums();

    this.controlPoints[1].initialize(new PointService(maximum.getPositionX(),
      maximum.getPositionY() - MIDHEIGHT - (CONTROLPOINTWIDTH / 2)));
    this.controlPoints[1].setLastPoint(new PointService(maximum.getPositionX() + CONTROLPOINTWIDTH,
      maximum.getPositionY() - MIDHEIGHT + (CONTROLPOINTWIDTH / 2)));
    this.controlPoints[1].generateSquare();
    this.controlPoints[1].findExtremums();

    this.controlPoints[2].initialize(new PointService(maximum.getPositionX() - MIDWIDTH - (CONTROLPOINTWIDTH / 2),
      maximum.getPositionY()));
    this.controlPoints[2].setLastPoint(new PointService(maximum.getPositionX() - MIDWIDTH + (CONTROLPOINTWIDTH / 2),
      maximum.getPositionY() + CONTROLPOINTWIDTH));
    this.controlPoints[2].generateSquare();
    this.controlPoints[2].findExtremums();

    this.controlPoints[3].initialize(new PointService(minimum.getPositionX(),
      minimum.getPositionY() + MIDHEIGHT - (CONTROLPOINTWIDTH / 2)));
    this.controlPoints[3].setLastPoint(new PointService(minimum.getPositionX() - CONTROLPOINTWIDTH,
      minimum.getPositionY() + MIDHEIGHT + (CONTROLPOINTWIDTH / 2)));
    this.controlPoints[3].generateSquare();
    this.controlPoints[3].findExtremums();

  }

  setExtremums(shapeContainer: ShapesContainerService): void {
    this.minimum = new PointService(1000000, 1000000);
    this.maximum = new PointService(0, 0);
    for (const SHAPE of shapeContainer.getShapes().values()) {
      if (SHAPE.getSelect()) {
        this.updateExtremums(SHAPE.getMinimum());
        this.updateExtremums(SHAPE.getMaximum());
      }
    }
  }

  updateExtremums(lastPoint: PointService): void {
    if (lastPoint.getPositionX() > this.maximum.getPositionX()) {
      this.maximum.setPositionX(lastPoint.getPositionX());
    }
    if (lastPoint.getPositionY() > this.maximum.getPositionY()) {
      this.maximum.setPositionY(lastPoint.getPositionY());
    }
    if (lastPoint.getPositionX() < this.minimum.getPositionX()) {
      this.minimum.setPositionX(lastPoint.getPositionX());
    }
    if (lastPoint.getPositionY() < this.minimum.getPositionY()) {
      this.minimum.setPositionY(lastPoint.getPositionY());
    }
  }

  translate(xTranslation: number, yTranslation: number): void {
    super.translate(xTranslation, yTranslation);

    for (const CP of this.controlPoints) {
      CP.translate(xTranslation, yTranslation);
    }
    this.updateExtremums(this.lastPoint);
    this.generateControlPoints(this.minimum, this.maximum);

    this.generate();
  }

}
