import { PointService } from 'src/services/point/point.service';
import { SvgWorkerService } from 'src/services/svgWorker/svg-worker.service';
import { Shape } from '../shape/shape';

const TWOXPI = 360;
const PI = 180;
const LARGE_NUM = 10000;
export class LineShape extends Shape {
    private origin: PointService;
    private destination: PointService;
    private angleMultiple: number;
    isRelative: boolean;

    constructor(width: number, mainColor: string, secondaryColor: string) {
        super(width, mainColor, secondaryColor);
        this.angleMultiple = 1;
        this.isRelative = false;
    }

    generateRelativeLine(origin: PointService, destination: PointService): void {
        this.origin = origin;
        this.destination = destination;
        const SVGWORKER = new SvgWorkerService();
        this.instruction = SVGWORKER.line(destination);
        this.isRelative = true;
        this.findExtremums();
    }

    setOriginandDest(origin: PointService, dest: PointService): void {
        this.origin = origin;
        this.destination = dest;
    }

    generateLine(origin: PointService, destination: PointService): void {
        this.origin = origin;
        if (this.angleMultiple === 1) {
            this.destination = destination;
            const SVGWORKER = new SvgWorkerService();
            this.instruction = SVGWORKER.move(origin);
            this.instruction += SVGWORKER.line(destination);
        } else {
            const YDISPLACEMENT = origin.getPositionY() - destination.getPositionY();
            const XDISPLACEMENT = destination.getPositionX() - origin.getPositionX();
            const lineLength = Math.sqrt((Math.pow(YDISPLACEMENT, 2) + Math.pow(XDISPLACEMENT, 2)));
            let angle = Math.atan2(YDISPLACEMENT, XDISPLACEMENT) * PI / Math.PI;
            if (angle < 1) {
                angle = TWOXPI + angle;
            }
            const ANGLERATIO = Math.round(angle / this.angleMultiple);
            const NEWANGLE = this.angleMultiple * ANGLERATIO;
            const NEWYDISPLACEMENT = lineLength * Math.sin(NEWANGLE * Math.PI / PI);
            const NEWXDISPLACEMENT = lineLength * Math.cos(NEWANGLE * Math.PI / PI);
            const NEWXDESTINATION = origin.getPositionX() + NEWXDISPLACEMENT;
            const NEWYDESTINATION = origin.getPositionY() - NEWYDISPLACEMENT;
            const NEWDESTINATION = new PointService(Math.floor(NEWXDESTINATION), Math.floor(NEWYDESTINATION));
            this.destination = NEWDESTINATION;
            const SVGWORKER = new SvgWorkerService();
            this.instruction = SVGWORKER.move(origin);
            this.instruction += SVGWORKER.line(NEWDESTINATION);
        }
        this.findExtremums();
    }

    generate(): void {
        this.generateLine(this.origin, this.destination);
    }

    generateRelative(): void {
        this.generateRelativeLine(this.origin, this.destination);
    }

    getOrigin(): PointService {
        return this.origin;
    }

    setOrigin(newOrigin: PointService): void {
        this.origin = newOrigin;
    }

    getDestination(): PointService {
        return this.destination;
    }

    setDestination(newDestination: PointService): void {
        this.destination = newDestination;
    }

    setAngleMultiple(angleMultiple: number): void {
        this.angleMultiple = Math.round(angleMultiple) % TWOXPI;
    }

    getAngleMultiple(): number {
        return this.angleMultiple;
    }

    detectPointIntersection(pointToCheck: PointService): boolean {
        this.findExtremums();
        const A = (this.destination.getPositionY() - this.origin.getPositionY()) /
            (this.destination.getPositionX() - this.origin.getPositionX());
        const B = this.origin.getPositionY() - A * this.origin.getPositionX();
        return pointToCheck.getPositionY() === A * pointToCheck.getPositionX() + B;
    }

    detectLineIntersection(lineToCheck: LineShape): boolean {
        const DIRECTIONALVECTOR = this.substract(this.destination, this.origin);
        const DIRECTIONALVECTORTOCHECK = this.substract(lineToCheck.destination, lineToCheck.origin);
        const NUMERATOR = this.crossProduct2D(this.substract(lineToCheck.origin, this.origin), DIRECTIONALVECTOR);
        const DENOMINATOR = this.crossProduct2D(DIRECTIONALVECTOR, DIRECTIONALVECTORTOCHECK);
        if (NUMERATOR === 0 && DENOMINATOR === 0) { // Colinear
            if (this.equalPoints(this.origin, lineToCheck.origin) || this.equalPoints(this.origin, lineToCheck.destination) ||
                this.equalPoints(this.destination, lineToCheck.origin) || this.equalPoints(this.destination, lineToCheck.destination)) {
                return true;
            }
            const XOVERLAP = (lineToCheck.origin.getPositionX() - this.origin.getPositionX() < 0) ===
                (lineToCheck.origin.getPositionX() - this.destination.getPositionX() < 0) ===
                (lineToCheck.destination.getPositionX() - this.origin.getPositionX() < 0) ===
                (lineToCheck.destination.getPositionX() - this.destination.getPositionX() < 0);
            const YOVERLAP = (lineToCheck.origin.getPositionX() - this.origin.getPositionX() < 0) ===
                (lineToCheck.origin.getPositionX() - this.destination.getPositionX() < 0) ===
                (lineToCheck.destination.getPositionX() - this.origin.getPositionX() < 0) ===
                (lineToCheck.destination.getPositionX() - this.destination.getPositionX() < 0);
            return !(XOVERLAP && YOVERLAP);
        }
        if (DENOMINATOR === 0) {
            return false;
        }
        const U = NUMERATOR / DENOMINATOR;
        const T = this.crossProduct2D(this.substract(lineToCheck.origin, this.origin), DIRECTIONALVECTORTOCHECK) / DENOMINATOR;
        return (T >= 0) && (T <= 1) && (U >= 0) && (U <= 1);
    }

    substract(point1: PointService, point2: PointService): PointService {
        return new PointService(point1.getPositionX() - point2.getPositionX(), point1.getPositionY() - point2.getPositionY());
    }

    crossProduct2D(vector1: PointService, vector2: PointService): number {
        return vector1.getPositionX() * vector2.getPositionY() - vector1.getPositionY() * vector2.getPositionX();
    }

    equalPoints(point1: PointService, point2: PointService): boolean {
        return point1.getPositionX() === point2.getPositionX() && point1.getPositionY() === point2.getPositionY();
    }

    findExtremums(): void {
        this.maximum = new PointService(0, 0);
        this.minimum = new PointService(LARGE_NUM, LARGE_NUM);

        this.updateExtremums(this.destination);
        this.updateExtremums(this.origin);
    }

    translate(xTranslation: number, yTranslation: number): void {

        this.destination.setPositionX(this.destination.getPositionX() + xTranslation);
        this.destination.setPositionY(this.destination.getPositionY() + yTranslation);

        if (this.isRelative) {
            this.generateRelative();
        } else {
            this.generate();
        }

    }

    rotateAboutPoint(degree: number, point: PointService): void {

        this.origin.rotateAboutPoint(degree, point);
        this.destination.rotateAboutPoint(degree, point);

        if (this.isRelative) {
            this.generateRelative();
        } else {
            this.generate();
        }

    }
}
