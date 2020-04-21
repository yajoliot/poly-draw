import { ElementRef, Injectable, QueryList } from '@angular/core';
import { Shape } from 'src/models/shapes/shape/shape';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';

@Injectable({
  providedIn: 'root'
})
export abstract class ToolService {

  // TODO: is this still necessary now that we have shapesContainer (XB)
  shapes: Shape[];
  shapeContainer: ShapesContainerService;

  // TODO: Use by reference instead of by copy imo (XB)
  constructor(sharedShapes: ShapesContainerService) {
    this.shapeContainer = sharedShapes;
  }

  // TODO Change to virtual unimplemented (SZ)
  abstract click(event: MouseEvent, drawnShape?: QueryList<ElementRef>): void;
  abstract drag(event: MouseEvent): void;
  abstract release(event: MouseEvent): void;
  keyboardUp(event: KeyboardEvent): void {
    // Empty implementation to simulate virtuality
  }
  keyboardDown(event: KeyboardEvent): void {
    // Empty implementation to simulate virtuality
  }
  onMouseLeave(event: MouseEvent): void {
    // Empty implementation to simulate virtuality
  }
  onMouseEnter(event: MouseEvent): void {
    // Empty implementation to simulate virtuality
  }
  onDblClick(event: MouseEvent): void {
    // Empty implementation to simulate virtuality
  }
  over(event: MouseEvent): void {
    // Empty implementation to simulate virtuality
  }
}
