import { ElementRef, Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import { ShapesContainerService } from '../../shapesContainer/shapesContainer.service';
import { ToolUtilService } from '../../toolUtil/toolUtil.service';
import { ToolService } from '../tool/tool.service';
@Injectable({
  providedIn: 'root'
})

export class ColorToolService extends ToolService {
  private pipetteSource = new Subject<any>();
  pipette$ = this.pipetteSource.asObservable();

  constructor(sharedShapes: ShapesContainerService, private toolUtil: ToolUtilService) {
    super(sharedShapes);
  }

  shapeClicked(ref: ElementRef, event: MouseEvent): void {
    console.log('we did something');
    const shapeNumber = this.shapeContainer.elementRefMap.get(ref);
    if (shapeNumber != undefined) {
      const shape = this.shapeContainer.getShapes().get(shapeNumber);
      if (shape != undefined) {
        switch (event.which) {
          case 1:
            this.shapeContainer.executeColorCommand(shape, this.toolUtil.getPrimaryColor());
            break;
          case 2:
            alert('Middle Mouse button pressed.');
            break;
          case 3:
            this.shapeContainer.executeColorCommand2(shape, this.toolUtil.getSecondaryColor());
            break;
        }
      }
    }
  }

  click(event: MouseEvent): void {
    // Abstraction not needed
  }
  drag(event: MouseEvent): void {
    // Abstraction not needed
  }

  release(event: MouseEvent): void {
    // Abstraction not needed
  }

}
