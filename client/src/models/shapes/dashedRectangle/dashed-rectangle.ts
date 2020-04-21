import { Rectangle } from '../rectangle/rectangle';

export class DashedRectangle extends Rectangle {

  constructor(width: number, mainColor: string, secondaryColor: string) {
    super(width, secondaryColor, mainColor);
    this.dash = '10,10';
  }
}
