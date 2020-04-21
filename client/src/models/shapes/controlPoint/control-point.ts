import { Rectangle } from '../rectangle/rectangle';

export class ControlPoint extends Rectangle {

  constructor(width: number, mainColor: string, secondaryColor: string) {
    super(width, secondaryColor, mainColor);
  }

  translate(xTranslation: number, yTranslation: number): void {
    super.translate(xTranslation, yTranslation);

  }
}
