import { ElementRef, Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigEnvService } from '../../config/config-env.service';
import { PointService } from '../../point/point.service';
import { ShapesContainerService } from '../../shapesContainer/shapesContainer.service';
import { ToolService } from '../tool/tool.service';
import { ToolUtilService } from '../../toolUtil/toolUtil.service';

const OFFSET = 75;
@Injectable({
  providedIn: 'root'
})
export class PipetteToolService extends ToolService {
  private pipetteSource = new Subject<any>();
  private shapeIsClicked: boolean;
  pipette$ = this.pipetteSource.asObservable();

  constructor(sharedShapes: ShapesContainerService, private toolUtil: ToolUtilService, private configEnv: ConfigEnvService) {
    super(sharedShapes);
    this.shapeIsClicked = false;
  }

  shapeClicked(ref: ElementRef, event: MouseEvent): void {
    this.shapeIsClicked = true;
    const shapeNumber = this.shapeContainer.elementRefMap.get(ref);
    if (shapeNumber != undefined) {
      const shape = this.shapeContainer.getShapes().get(shapeNumber);
      const pointClicked = new PointService(event.clientX - OFFSET, event.clientY - OFFSET);
      if (shape != undefined) {
        const color = shape.getColorOfPosition(pointClicked);
        switch (event.button) {
          case 0:
            this.toolUtil.addPrimaryColor(color);
            this.pipetteSource.next();
            break;
          case 2:
            this.toolUtil.addSecondaryColor(color);
            this.pipetteSource.next();
            break;
        }
      }
    }
  }

  click(event: MouseEvent): void {
    const COLOUR = this.configEnv.getBackgroundColor();
    switch (event.button) {
      case 0: {
        if (!this.shapeIsClicked) {
          this.toolUtil.addPrimaryColor(COLOUR);
          this.pipetteSource.next();
        }
        break;
      }
      case 2: {
        if (!this.shapeIsClicked) {
          this.toolUtil.addSecondaryColor(COLOUR);
          this.pipetteSource.next();
        }
        break;
      }
    }
    this.shapeIsClicked = false;
  }
  drag(event: MouseEvent): void {}

  release(event: MouseEvent): void {}

  keyboardDown(event: KeyboardEvent): void {
  }

  keyboardUp(event: KeyboardEvent): void {
  }

  onMouseLeave(event: MouseEvent): void {
  }

  onDblClick(event: MouseEvent): void {
  }
}
