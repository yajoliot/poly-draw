import { PointService } from 'src/services/point/point.service';
import { LineShape } from '../line/line';
import { Shape } from '../shape/shape';
const MAX = 1000000;
const NUMBEROFLINES = 4;
export class Rectangle extends Shape {
    lines: LineShape[];
    vertices: PointService[];
    protected initialPoint: PointService;
    protected lastPoint: PointService;
    shiftPressed: boolean;

    constructor(width: number, mainColor: string, secondaryColor: string) {
        super(width, secondaryColor, mainColor);
        this.shiftPressed = false;
        this.lines = [];
    }

    isSelected(point: PointService): boolean {
        let minX: number;
        let maxX: number;
        let minY: number;
        let maxY: number;
        const POSITIONX = point.getPositionX();
        const POSITIONY = point.getPositionY();
        const STROKESIZE = this.getWidth() / 2;
        if (this.initialPoint.getPositionX() < this.lastPoint.getPositionX()) {
            minX = this.initialPoint.getPositionX() - STROKESIZE;
            maxX = this.lastPoint.getPositionX() + STROKESIZE;
        } else {
            minX = this.lastPoint.getPositionX() - STROKESIZE;
            maxX = this.initialPoint.getPositionX() + STROKESIZE;
        }
        if (this.initialPoint.getPositionY() < this.lastPoint.getPositionY()) {
            minY = this.initialPoint.getPositionY() - STROKESIZE;
            maxY = this.lastPoint.getPositionY() + STROKESIZE;
        } else {
            minY = this.lastPoint.getPositionY() - STROKESIZE;
            maxY = this.initialPoint.getPositionY() + STROKESIZE;
        }
        if (POSITIONX < maxX && POSITIONX > minX && POSITIONY < maxY && POSITIONY > minY) {

            return true;
        } else {
            return false;
        }
    }

    getColorOfPosition(point: PointService): string {
        let minX: number;
        let maxX: number;
        let minY: number;
        let maxY: number;
        const POSITIONX = point.getPositionX();
        const POSITIONY = point.getPositionY();
        const HALFSTROKE = this.getWidth() / 2;

        if (this.initialPoint.getPositionX() < this.lastPoint.getPositionX()) {
            minX = this.initialPoint.getPositionX();
            maxX = this.lastPoint.getPositionX();
        } else {
            minX = this.lastPoint.getPositionX();
            maxX = this.initialPoint.getPositionX();
        }

        if (this.initialPoint.getPositionY() < this.lastPoint.getPositionY()) {
            minY = this.initialPoint.getPositionY();
            maxY = this.lastPoint.getPositionY();
        } else {
            minY = this.lastPoint.getPositionY();
            maxY = this.initialPoint.getPositionY();
        }

        if (POSITIONX < maxX - HALFSTROKE && POSITIONX > minX + HALFSTROKE &&
            POSITIONY < maxY - HALFSTROKE && POSITIONY > minY + HALFSTROKE) {
            return this.getSecondaryColor();
        } else {
            return this.getMainColor();
        }
    }

    initialize(point: PointService): void {
        this.initialPoint = point;
        this.instruction = '';
    }

    setLastPoint(point: PointService): void {
        this.lastPoint = point;
    }

    setLines(lines: LineShape[]): void {
        this.lines = lines;
    }
    getLastPoint(): PointService {
        return this.lastPoint;
    }

    getInitialPoint(): PointService {
        return this.initialPoint;
    }

    generate(): void {
        if (this.shiftPressed) {
            this.generateSquare();
        } else {
            this.generateRectangle();
        }
    }

    generateSquare(): void {
        let sideX = this.lastPoint.getPositionX() - this.initialPoint.getPositionX();
        let sideY = this.lastPoint.getPositionY() - this.initialPoint.getPositionY();
        let verticeOppositeToInitial;
        let verticeVerticallyAdjacentToInitial;
        let verticeHorizontallyAdjacentToInitial;
        const XDISPLACEMENT = this.lastPoint.getPositionX() - this.initialPoint.getPositionX();
        const YDISPLACEMENT = this.lastPoint.getPositionY() - this.initialPoint.getPositionY();
        if (Math.abs(sideY) <= Math.abs(sideX)) {
            if (XDISPLACEMENT > 0 && YDISPLACEMENT < 0 || XDISPLACEMENT < 0 && YDISPLACEMENT > 0) {
                sideY = -sideY;
            }
            verticeOppositeToInitial = new PointService(this.initialPoint.getPositionX() + sideY, this.lastPoint.getPositionY());
            verticeVerticallyAdjacentToInitial = new PointService(this.initialPoint.getPositionX(), this.lastPoint.getPositionY());
            verticeHorizontallyAdjacentToInitial = new PointService(this.initialPoint.getPositionX() + sideY,
                this.initialPoint.getPositionY());
        } else {
            if (XDISPLACEMENT > 0 && YDISPLACEMENT < 0 || XDISPLACEMENT < 0 && YDISPLACEMENT > 0) {
                sideX = -sideX;
            }
            verticeOppositeToInitial = new PointService(this.lastPoint.getPositionX(), this.initialPoint.getPositionY() + sideX);
            this.lastPoint = verticeOppositeToInitial;
            verticeVerticallyAdjacentToInitial = new PointService(this.initialPoint.getPositionX(),
                this.initialPoint.getPositionY() + sideX);
            verticeHorizontallyAdjacentToInitial = new PointService(this.lastPoint.getPositionX(), this.initialPoint.getPositionY());
        }
        const leftOrRightEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const rightOrLeftEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const topOrBottomEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const bottomOrTopEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        topOrBottomEdge.generateLine(this.initialPoint, verticeHorizontallyAdjacentToInitial);
        leftOrRightEdge.generateRelativeLine(verticeHorizontallyAdjacentToInitial, verticeOppositeToInitial);
        bottomOrTopEdge.generateRelativeLine(verticeOppositeToInitial, verticeVerticallyAdjacentToInitial);
        rightOrLeftEdge.generateRelativeLine(verticeVerticallyAdjacentToInitial, this.initialPoint);
        this.instruction = topOrBottomEdge.instruction;
        this.instruction += leftOrRightEdge.instruction;
        this.instruction += bottomOrTopEdge.instruction;
        this.instruction += rightOrLeftEdge.instruction;
        super.setFill();
        this.setLines([topOrBottomEdge, leftOrRightEdge, bottomOrTopEdge, rightOrLeftEdge]);
        this.vertices = [this.initialPoint, verticeVerticallyAdjacentToInitial,
            verticeOppositeToInitial, verticeHorizontallyAdjacentToInitial];
    }

    generateRectangle(): void {
        const leftOrRightEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const rightOrLeftEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const topOrBottomEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const bottomOrTopEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const verticeOppositeToInitial = new PointService(this.lastPoint.getPositionX(), this.lastPoint.getPositionY());
        const verticeVerticallyAdjacentToInitial = new PointService(this.initialPoint.getPositionX(), this.lastPoint.getPositionY());
        const verticeHorizontallyAdjacentToInitial = new PointService(this.lastPoint.getPositionX(), this.initialPoint.getPositionY());
        topOrBottomEdge.generateLine(this.initialPoint, verticeHorizontallyAdjacentToInitial);
        leftOrRightEdge.generateRelativeLine(verticeHorizontallyAdjacentToInitial, verticeOppositeToInitial);
        bottomOrTopEdge.generateRelativeLine(verticeOppositeToInitial, verticeVerticallyAdjacentToInitial);
        rightOrLeftEdge.generateRelativeLine(verticeVerticallyAdjacentToInitial, this.initialPoint);
        this.instruction = topOrBottomEdge.instruction;
        this.instruction += leftOrRightEdge.instruction;
        this.instruction += bottomOrTopEdge.instruction;
        this.instruction += rightOrLeftEdge.instruction;
        this.setFill();
        this.setLines([topOrBottomEdge, leftOrRightEdge, bottomOrTopEdge, rightOrLeftEdge]);
        this.vertices = [this.initialPoint, verticeVerticallyAdjacentToInitial,
            verticeOppositeToInitial, verticeHorizontallyAdjacentToInitial];
    }

    detectRectangleIntersection(rectangleToCheck: Rectangle): boolean {
        let i = 0;
        for (; i < rectangleToCheck.lines.length; i++) {
            let j = 0;
            const SELECTLINE = rectangleToCheck.lines[i];
            for (; j < this.lines.length; j++) {
                const LINE = this.lines[j];
                if (SELECTLINE.detectLineIntersection(LINE)) {
                    return true;
                }
            }
        }
        return false;
    }

    detectRectangleInclusion(rectangleToCheckIfInside: Rectangle): boolean {
        return (this.maximum.getPositionX() > rectangleToCheckIfInside.maximum.getPositionX() &&
            this.minimum.getPositionX() < rectangleToCheckIfInside.minimum.getPositionX() &&
            this.maximum.getPositionY() > rectangleToCheckIfInside.maximum.getPositionY() &&
            this.minimum.getPositionY() < rectangleToCheckIfInside.minimum.getPositionY());
    }

    findExtremums(): void {
        this.minimum = new PointService(MAX, MAX);
        this.maximum = new PointService(0, 0);
        for (const LINE of this.lines) {
            LINE.findExtremums();
            if (LINE.getMinimum().getPositionY() < this.minimum.getPositionY()) {
                this.minimum.setPositionY(LINE.getMinimum().getPositionY());
            }
            if (LINE.getMinimum().getPositionX() < this.minimum.getPositionX()) {
                this.minimum.setPositionX(LINE.getMinimum().getPositionX());
            }
            if (LINE.getMaximum().getPositionY() > this.maximum.getPositionY()) {
                this.maximum.setPositionY(LINE.getMaximum().getPositionY());
            }
            if (LINE.getMaximum().getPositionX() > this.maximum.getPositionX()) {
                this.maximum.setPositionX(LINE.getMaximum().getPositionX());
            }
        }
    }

    getDash(): string {
        return this.dash;
    }

    translate(xTranslation: number, yTranslation: number): void {
        this.instruction = '';
        const firstEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const secondeEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const thirdEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const fourthEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        for (const VERTICE of this.vertices) {
            VERTICE.setPositionX(VERTICE.getPositionX() + xTranslation);
            VERTICE.setPositionY(VERTICE.getPositionY() + yTranslation);
        }
        firstEdge.generateLine(this.vertices[0], this.vertices[1]);
        secondeEdge.generateRelativeLine(this.vertices[1], this.vertices[2]);
        thirdEdge.generateRelativeLine(this.vertices[2], this.vertices[NUMBEROFLINES - 1]);
        fourthEdge.generateRelativeLine(this.vertices[NUMBEROFLINES - 1], this.vertices[0]);
        this.setLines([firstEdge, secondeEdge, thirdEdge, fourthEdge]);
        this.instruction += this.lines[0].instruction + this.lines[1].instruction +
                            this.lines[2].instruction + this.lines[NUMBEROFLINES - 1].instruction;
        this.initialPoint = this.lines[0].getOrigin();
        this.lastPoint = this.lines[1].getDestination();
        this.findExtremums();
    }

    generateVertices(){
        const firstEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const secondeEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const thirdEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const fourthEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());

        firstEdge.generateLine(this.vertices[0], this.vertices[1]);
        secondeEdge.generateRelativeLine(this.vertices[1], this.vertices[2]);
        thirdEdge.generateRelativeLine(this.vertices[2], this.vertices[3]);
        fourthEdge.generateRelativeLine(this.vertices[3], this.vertices[0]);

        this.setLines([firstEdge, secondeEdge, thirdEdge, fourthEdge]);

        this.instruction += this.lines[0].instruction + this.lines[1].instruction + this.lines[2].instruction + this.lines[3].instruction;

        this.initialPoint = this.lines[0].getOrigin();
        this.lastPoint = this.lines[1].getDestination();

        this.findExtremums();
    }

    rotate(degree: number){
        const YDISPLACEMENT = this.initialPoint.getPositionY() - this.lastPoint.getPositionY();
        const XDISPLACEMENT = this.lastPoint.getPositionX() - this.initialPoint.getPositionX();
        const LINECENTERDISPLACEMENT = new PointService(XDISPLACEMENT / 2, YDISPLACEMENT / 2);
        const LINECENTER = new PointService(
            this.initialPoint.getPositionX() + LINECENTERDISPLACEMENT.getPositionX(),
            this.initialPoint.getPositionY() - LINECENTERDISPLACEMENT.getPositionY());

        this.instruction = '';
        for (const VERTICE of this.vertices) {
            VERTICE.rotateAboutPoint(degree, LINECENTER);
        }
        const firstEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const secondeEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const thirdEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const fourthEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        firstEdge.generateLine(this.vertices[0], this.vertices[1]);
        secondeEdge.generateRelativeLine(this.vertices[1], this.vertices[2]);
        thirdEdge.generateRelativeLine(this.vertices[2], this.vertices[NUMBEROFLINES - 1]);
        fourthEdge.generateRelativeLine(this.vertices[NUMBEROFLINES - 1], this.vertices[0]);
        this.setLines([firstEdge, secondeEdge, thirdEdge, fourthEdge]);
        this.instruction += this.lines[0].instruction + this.lines[1].instruction +
                            this.lines[2].instruction + this.lines[NUMBEROFLINES - 1].instruction;
        this.initialPoint = this.lines[0].getOrigin();
        this.lastPoint = this.lines[1].getDestination();
        this.findExtremums();
    }

    getCenter(){
        return this.center;
    }

    setCenter() {
        this.findExtremums();
        const deltaX = this.maximum.getPositionX() - this.minimum.getPositionX();
        const deltaY = this.maximum.getPositionY() - this.minimum.getPositionY();
        this.center = new PointService(this.minimum.getPositionX() + deltaX / 2, this.minimum.getPositionY() + deltaY / 2);
    }

    rotateAboutPoint(degree: number, point: PointService){
        this.instruction = '';
        for (const VERTICE of this.vertices) {
            VERTICE.rotateAboutPoint(degree, point);
        }
        const firstEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const secondeEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const thirdEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        const fourthEdge = new LineShape(this.getWidth(), this.getMainColor(), this.getSecondaryColor());
        firstEdge.generateLine(this.vertices[0], this.vertices[1]);
        secondeEdge.generateRelativeLine(this.vertices[1], this.vertices[2]);
        thirdEdge.generateRelativeLine(this.vertices[2], this.vertices[NUMBEROFLINES - 1]);
        fourthEdge.generateRelativeLine(this.vertices[NUMBEROFLINES - 1], this.vertices[0]);
        this.setLines([firstEdge, secondeEdge, thirdEdge, fourthEdge]);
        this.instruction += this.lines[0].instruction + this.lines[1].instruction +
                            this.lines[2].instruction + this.lines[NUMBEROFLINES - 1].instruction;
        this.initialPoint = this.lines[0].getOrigin();
        this.lastPoint = this.lines[1].getDestination();
        this.findExtremums();
    }

}
