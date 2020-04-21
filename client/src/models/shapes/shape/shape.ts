import { ElementRef } from '@angular/core';
import { PointService } from 'src/services/point/point.service';
import { Rectangle } from '../rectangle/rectangle';

export abstract class Shape {

  instruction: string;
  private width: number;
  private mainColor: string;
  private secondaryColor: string;
  private shapeNumber: number;
  private elementRef: ElementRef;
  private selected: boolean;
  fill: string;
  protected minimum: PointService;
  protected maximum: PointService;
  protected dash: string;
  private linecap: string;
  protected opacity: string;
  protected isGrid: boolean;
  protected center: PointService;
  svgInstructions: PointService[];

  constructor(width: number, mainColor: string, secondaryColor: string) {
    this.instruction = '';
    this.fill = secondaryColor;
    this.width = width;
    this.mainColor = mainColor;
    this.secondaryColor = secondaryColor;
    this.svgInstructions = [];
    this.minimum = new PointService(1000000, 100000);
    this.maximum = new PointService(0, 0);
    this.center = new PointService(0, 0);
    this.selected = false;
    this.dash = 'none';
    this.linecap = 'round';
    this.opacity = '1';
    this.isGrid = false;
  }

  getOpacity(): string {
    return this.opacity;
  }

  getIsGrid(): boolean {
    return this.isGrid;
  }

  getColorOfPosition(point: PointService): string {
    return this.mainColor;
  }

  isSelected(point: PointService): boolean {
    console.log('why we here?');
    return false;
  }

  getWidth(): number {
    return this.width;
  }

  getLinecap(): string {
    return this.linecap;
  }

  getMainColor(): string {
    return this.mainColor;
  }
  getSecondaryColor(): string {
    return this.secondaryColor;
  }

  setFill(): void {
    this.fill = this.secondaryColor;
  }

  setShapeNumber(shapeNumber: any): void {
    this.shapeNumber = shapeNumber;
  }

  getShapeNumber(): number {
    return this.shapeNumber;
  }
  getElementRef(): ElementRef {
    return this.elementRef;
  }

  getInstruction(): string {
    return this.instruction;
  }

  setElementRef(svg: ElementRef): void {
    this.elementRef = svg;
  }
  setInstruction(instruction: string): void {
    this.instruction = instruction;
  }

  setMainColor(mainColor: string): void {
    this.mainColor = mainColor;
  }

  setSecondaryColor(secondaryColor: string): void {
    this.secondaryColor = secondaryColor;
  }
  detectRectangleIntersection(rectangleToCheck: Rectangle): boolean {
    return false;
  }

  setSelect(selectionState: boolean): void {
    this.selected = selectionState;
  }
  getSelect(): boolean {
    return this.selected;
  }
  getMinimum(): PointService {
    return this.minimum;
  }
  setMinimum(min: PointService): void {
    this.minimum = min;
  }
  getMaximum(): PointService {
    return this.maximum;
  }
  setMaximum(max: PointService): void {
    this.maximum = max;
  }

  translate(xTranslation: number, yTranslation: number): void {
  }

  rotate(degree: number): void {
    console.log('PARENT');
  }

  rotateAboutPoint(degree: number, point: PointService): void {
    console.log('PARENT');
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
  clone(): any {
    // To be surdefined down the tree
  }
}
