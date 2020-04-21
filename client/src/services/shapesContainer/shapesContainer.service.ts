import { ElementRef, Injectable } from '@angular/core';
import { ColorCommand } from 'src/models/commands/colorCommand/color-command';
import { Command } from 'src/models/commands/command/command';
import { ShapeCommand } from 'src/models/commands/shapeCommand/shape-command';
import { TranslationCommand } from '../../models/commands/translationCommand/translation-command';
import { PointService } from '../point/point.service';
import { EraserCommandService } from 'src/models/commands/eraserCommand/eraser-command.service';
import { Shape } from 'src/models/shapes/shape/shape';
import { DashedRectangle } from 'src/models/shapes/dashedRectangle/dashed-rectangle';
import { SelectionRectangle } from 'src/models/shapes/selectionRectangle/selection-rectangle';
import { RotationCommand } from 'src/models/commands/rotationCommand/rotation-command';
import { PasteCommand } from 'src/models/commands/pasteCommand/paste-command';

@Injectable({
  providedIn: 'root'
})
export class ShapesContainerService {
  private shapes: Map<number, Shape>;
  private shapesInProgress: Shape[];
  private shapesToAdd: Shape[];
  private shapesToRemove: Shape[];
  private shapesInClipboard: Shape[];
  elementRefMap: Map<ElementRef, number>;

  // invoker
  private commandsExecuted: Command[];
  private commandsCanceled: Command[];

  private numberOfShapesCreated: number;
  constructor() {
    this.shapes = new Map();
    this.elementRefMap = new Map();
    this.shapesToAdd = [];
    this.shapesToRemove = [];
    this.shapesInProgress = [];
    this.commandsExecuted = [];
    this.commandsCanceled = [];
    this.numberOfShapesCreated = 0;
  }

  getShapes(): Map<number, Shape> {
    return this.shapes;
  }

  undo(): void {
    const COMMANDSEXCUTEDLENGTH = this.commandsExecuted.length;
    const LASTCOMMANDEXCUTED = this.commandsExecuted[COMMANDSEXCUTEDLENGTH - 1];

    LASTCOMMANDEXCUTED.cancel();

    this.commandsExecuted.pop();
    this.commandsCanceled.push(LASTCOMMANDEXCUTED);
  }

  redo(): void {
    const COMMANDSCANCELLEDLENGTH = this.commandsCanceled.length;
    const LASTCOMMANDCANCELLED = this.commandsCanceled[COMMANDSCANCELLEDLENGTH - 1];

    LASTCOMMANDCANCELLED.execute();

    this.commandsCanceled.pop();
    this.commandsExecuted.push(LASTCOMMANDCANCELLED);
  }

  executeShapeCommand(shape: Shape): void {
    const COMMAND = new ShapeCommand(shape, this);
    this.commandsExecuted.push(COMMAND);
    COMMAND.execute();
  }

  executePasteCommand(shapes: Shape[]): void {
    const COMMAND = new PasteCommand(shapes, this);
    this.commandsExecuted.push(COMMAND);
    COMMAND.execute();
  }

  executeColorCommand(shape: Shape, color: string): void {
    const COMMAND = new ColorCommand(shape, this, color);
    this.commandsExecuted.push(COMMAND);
    COMMAND.execute();
  }

  executeColorCommand2(shape: Shape, color: string): void {
    const COMMAND = new ColorCommand(shape, this, color);
    this.commandsExecuted.push(COMMAND);
    COMMAND.execute2();
  }

  executeTranslationCommand(shapes: Shape[], position: PointService): void {
    const COMMAND = new TranslationCommand(shapes, this, position);
    this.commandsExecuted.push(COMMAND);
  }

  executeEraserCommand(shapes: Shape[]): void {
    const COMMAND = new EraserCommandService(shapes, this);
    this.commandsExecuted.push(COMMAND);
  }

  executeRotationCommand(shapes: Shape[], degree: number, point: PointService, isRelative: boolean): void{
    const COMMAND = new RotationCommand(shapes, degree, point, isRelative, this);
    COMMAND.execute();
    this.commandsExecuted.push(COMMAND);
  }

  addShape(shape: Shape): void {
    if (shape.getShapeNumber() === undefined) {
      this.shapesToAdd.push(shape);
      this.shapes.set(this.numberOfShapesCreated, shape);
      shape.setShapeNumber(this.numberOfShapesCreated);
      this.numberOfShapesCreated++;
    } else {
      this.shapesToAdd.push(shape);
      this.shapes.set(shape.getShapeNumber(), shape);
    }
  }

  addShapeInProgress(shape: Shape): void {
    this.shapesInProgress.push(shape);
  }

  removeShapeInProgress(): void {
    this.shapesInProgress.pop();
  }

  removeSpecificShapeInProgress(shape: Shape): void {

    const index = this.shapesInProgress.indexOf(shape);
    if (index >= 0) {
      this.shapesInProgress.splice(index, 1);
    }
  }

  getShapesInProgress(): Shape[] {
    return this.shapesInProgress;
  }

  getShapesInClipboard(): Shape[] {
    return this.shapesInClipboard;
  }

  emptyShapeInprogress(): void {
    this.shapesInProgress = new Array<Shape>();
  }

  removeShape(shape: Shape): void {
    if (this.shapes.get(shape.getShapeNumber())) {
      this.shapes.delete(shape.getShapeNumber());
      this.shapesToRemove.push(shape);
    }
  }

  removeShapeToAdd(): void {
    this.shapesToAdd.pop();
  }

  removeShapeToRemove(): void {
    this.shapesToRemove.pop();
  }

  emptyShapes(): void {
    this.shapes = new Map();
  }

  getShapesToAdd(): Shape[] {
    return this.shapesToAdd;
  }

  getShapesToRemove(): Shape[] {
    return this.shapesToRemove;
  }

  getNumberOfShapesCreated(): number {
    return this.numberOfShapesCreated;
  }

  getShape(shapeKey: number): Shape | undefined {
    return this.shapes.get(shapeKey);
  }

  setElementRef(shapeNumber: number, shapeElementRef: ElementRef): void {
    this.elementRefMap.set(shapeElementRef, shapeNumber);
  }

  selectionAll(newSelectionState: boolean): void {
    for (const FINISHEDSHAPE of this.shapes.values()) {
      FINISHEDSHAPE.setSelect(newSelectionState);
    }
    for (const TEMPORARYSHAPE of this.shapesInProgress) {
      if (!(TEMPORARYSHAPE instanceof DashedRectangle || TEMPORARYSHAPE instanceof SelectionRectangle)) {
        TEMPORARYSHAPE.setSelect(newSelectionState);
      }
    }
  }
}
