import { AfterViewInit, Component , ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { ShapesContainerService } from 'src/services/shapesContainer/shapesContainer.service';
import { ToolboxService } from 'src/services/toolbox/toolbox.service';
import { PaintBucketService } from 'src/services/tools/paintBucketTool/paint-bucket.service';
const UNDEFINED = 'undefined';
const DEUXCINQCINQ = 255;
@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})
export class DrawingComponent implements AfterViewInit {

  @Output() sendEventWorkspace: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();
  @Input() drawingData: any;
  mouseCoordinates: HTMLElement | null;
  @ViewChild('drawing', {read: ElementRef, static: false})drawing: ElementRef;
  @ViewChild('methods', {read: ElementRef, static: false})methods: ElementRef;
  @ViewChild('permanentShapes', {read: ElementRef, static: false})permanentShapes: ElementRef;
  positionX: number;
  positionY: number;
  isClicked: boolean;
  isDefined: boolean;
  control: boolean;

  constructor(
    private renderer: Renderer2,
    private toolbox: ToolboxService,
    private shapeContainer: ShapesContainerService,
    private configEnv: ConfigEnvService,
    private bucket: PaintBucketService) {
      this.isDefined = true;
      this.control = false;
    }

  ngAfterViewInit(): void {
    this.createDrawing();
  }

  sendToWorkspace(): void {
    this.sendEventWorkspace.emit(this.permanentShapes);
  }

  createDrawing(): void {
    if (this.configEnv.openFromServerClicked) {
      this.configEnv.loadFromServer(this.permanentShapes);
      this.drawing.nativeElement.style.backgroundColor = this.configEnv.getBackgroundColor();
      this.drawing.nativeElement.style.width = this.configEnv.width;
      this.drawing.nativeElement.style.height = this.configEnv.height;
      this.configEnv.openFromServerClicked = false;
    } else if (this.configEnv.continuDrawingClicked) {
      this.loadCached();
      this.configEnv.continuDrawingClicked = false;
    } else if (typeof this.drawingData === UNDEFINED) {
      this.drawing.nativeElement.style.backgroundColor = this.configEnv.getBackgroundColor();
      this.drawing.nativeElement.style.width = this.configEnv.width;
      this.drawing.nativeElement.style.height = this.configEnv.height;
    } else {
      this.drawing.nativeElement.style.backgroundColor = `rgb(${this.drawingData.r},${this.drawingData.g},
                                                              ${this.drawingData.b},${this.drawingData.o / DEUXCINQCINQ})`;
      this.drawing.nativeElement.style.width = this.drawingData.width;
      this.drawing.nativeElement.style.height = this.drawingData.height;
      this.configEnv.saveDrawingBackground(this.drawingData.r, this.drawingData.g, this.drawingData.b,
                                           this.drawingData.o, this.drawingData.height, this.drawingData.width);
    }
    this.configEnv.drawingElement = this.drawing;
    this.configEnv.drawingInProgress = true;
    this.bucket.setDrawing(this.drawing);
  }
  addShapes(): void {
    const NUMBEROFSHAPESTOADD = this.shapeContainer.getShapesToAdd().length;
    if (NUMBEROFSHAPESTOADD) {
      for (let i = NUMBEROFSHAPESTOADD; i > 0; i-- ) {
        const SHAPE = this.shapeContainer.getShapesToAdd()[i - 1];
        const SVG = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(SVG, 'd', SHAPE.instruction);
        this.renderer.setAttribute(SVG, 'stroke', SHAPE.getMainColor());
        this.renderer.setAttribute(SVG, 'stroke-width', SHAPE.getWidth().toString());
        this.renderer.setAttribute(SVG, 'stroke-linecap', 'round');
        this.renderer.setAttribute(SVG, 'opacity', SHAPE.getOpacity());
        this.renderer.setAttribute(SVG, 'fill', SHAPE.fill);

        this.renderer.listen(SVG, 'mousedown', (event) => {
          this.onShapeClick(SVG, event);
        });

        this.renderer.listen(SVG, 'contextmenu', (event) => {
          this.onShapeClick(SVG, event);
        });
        this.renderer.appendChild(this.permanentShapes.nativeElement, SVG);
        SHAPE.setElementRef(SVG);
        this.shapeContainer.setElementRef(SHAPE.getShapeNumber(), SHAPE.getElementRef());
        this.shapeContainer.removeShapeToAdd();
      }
    }
  }

  onShapeClick(ref: ElementRef, mouseEvent: MouseEvent): void {
    if (!this.configEnv.blockKeyEvents && this.toolbox.getTool() !== null) {
      this.toolbox.shapeClicked(ref, mouseEvent);
    }
  }

  removeShapes(): void {
    const NUMBEROFSHAPESTOREMOVE = this.shapeContainer.getShapesToRemove().length;
    if (NUMBEROFSHAPESTOREMOVE) {
      for (let i = NUMBEROFSHAPESTOREMOVE; i > 0; i--) {
        const SHAPE = this.shapeContainer.getShapesToRemove()[i - 1];
        this.renderer.removeChild(this.drawing.nativeElement, SHAPE.getElementRef());
        this.shapeContainer.removeShapeToRemove();
      }
    }
  }

  erase(): void {
    for (const SHAPE of this.shapeContainer.getShapes().values()) {
      this.shapeContainer.removeShape(SHAPE);
    }
  }

  loadCached(): void {
    const localDrawingString: string | null = window.localStorage.getItem('drawing') ;
    let localDrawing: any;
    if (localDrawingString !== null) {
      localDrawing = JSON.parse(localDrawingString);
      this.drawing.nativeElement.style.backgroundColor = localDrawing.backgroundColor;
      this.drawing.nativeElement.style.width = localDrawing.width;
      this.drawing.nativeElement.style.height = localDrawing.height;
      this.permanentShapes.nativeElement.innerHTML = window.localStorage.getItem('svg');
      const svgNum = window.localStorage.getItem('svgNum');
      if (svgNum != null) {
        for (let i = 1; i <= parseInt(svgNum, 10); i++) {
          this.permanentShapes.nativeElement.innerHTML += window.localStorage.getItem('svg' + i);
        }
      }
    }
  }

  @HostListener('mousedown', ['$event'])
  click(event: MouseEvent): void {
    if (!this.configEnv.blockKeyEvents && this.toolbox.getTool() !== null) {
      this.toolbox.getTool().click(event);
      this.configEnv.drawingSaved = false;
    }
  }

  @HostListener('mousemove', ['$event'])
  drag(event: MouseEvent): void {
    if (!this.configEnv.blockKeyEvents && this.toolbox.getTool() != null) {
      this.toolbox.getTool().drag(event);
    }
  }

  @HostListener('mouseup', ['$event'])
  release(event: MouseEvent): void {
    if (!this.configEnv.blockKeyEvents && this.toolbox.getTool() != null) {
      this.toolbox.getTool().release(event);
      this.sendToWorkspace();
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent): void {
    if (!this.configEnv.blockKeyEvents) {
      switch (event.key) {
        case 'Control':
          this.control = true;
          break;
        case 'Shift':
          this.toolbox.getTool().keyboardDown(event);
          if (this.control) {
            this.shapeContainer.redo();
          }
          break;
        case 'Backspace':
          this.toolbox.getTool().keyboardDown(event);
          break;
        case 'Escape':
          this.toolbox.getTool().keyboardDown(event);
          break;
        case 'ArrowUp':
          this.toolbox.getTool().keyboardDown(event);
          break;
        case 'ArrowLeft':
          this.toolbox.getTool().keyboardDown(event);
          break;
        case 'ArrowRight':
          this.toolbox.getTool().keyboardDown(event);
          break;
        case 'ArrowDown':
          this.toolbox.getTool().keyboardDown(event);
          break;
        case 'n':
          this.toolbox.getTool().keyboardDown(event);
          break;
        case 'p':
          this.erase();
          break;
        case 'z':
          if (this.control) {
            this.shapeContainer.undo();
          }
          break;

      }
    }
  }

  @HostListener('mousewheel', ['$event'])
  scroll(event: MouseEvent): void {
    event.preventDefault;
    this.toolbox.scroll(event);
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent): void {
    if (!this.configEnv.blockKeyEvents && event.key === 'Shift') {
      this.toolbox.getTool().keyboardUp(event);
    } else if (!this.configEnv.blockKeyEvents && event.key === 'Control') {
      this.control = false;
    } else if (!this.configEnv.blockKeyEvents && event.key === 'Alt'){
      this.toolbox.getTool().keyboardUp(event);
    }
  }

  @HostListener('mouseleave', ['$event'])
  mouseOut(event: MouseEvent): void {
    if (!this.configEnv.blockKeyEvents && this.toolbox.getTool() !== null) {
      this.toolbox.getTool().onMouseLeave(event);
    }
  }
  @HostListener('mouseenter', ['$event'])
  mouseIn(event: MouseEvent): void {
    if (!this.configEnv.blockKeyEvents && this.toolbox.getTool() !== null) {
      this.toolbox.getTool().onMouseEnter(event);
    }
  }

  @HostListener('dblclick', ['$event'])
  onDblClick(event: MouseEvent): void {
    if (!this.configEnv.blockKeyEvents && this.toolbox.getTool() !== null) {
      this.toolbox.getTool().onDblClick(event);
    }
  }

}
