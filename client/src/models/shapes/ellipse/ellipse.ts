import { PointService } from 'src/services/point/point.service';
import { SvgWorkerService } from 'src/services/svgWorker/svg-worker.service';
import { LineShape } from '../line/line';
import { Rectangle } from '../rectangle/rectangle';
import { Shape } from '../shape/shape';
const MAX = 1000000;
const PI = 180;
export class Ellipse extends Shape {
    protected center: PointService;
    protected radii: PointService;
    private initial: PointService;
    private destination: PointService;
    private svgWorker: SvgWorkerService;
    private rotation: number;
    private northPole: PointService;
    private southPole: PointService;
    private boundingRect: Rectangle;
    initialRect: PointService;
    shiftPressed: boolean;
    constructor(width: number, mainColor: string, secondaryColor: string) {
        super(width, mainColor, secondaryColor);
        this.fill = secondaryColor;
        this.radii = new PointService(0, 0);
        this.center = new PointService(0, 0);
        this.northPole = new PointService(0, 0);
        this.southPole = new PointService(0, 0);
        this.rotation = 0;
        this.svgWorker = new SvgWorkerService();
        this.shiftPressed = false;
        this.boundingRect = new Rectangle(1, '', '');
    }

    initialize(initial: PointService): void {
        this.initial = initial;
    }
    getInitial(): PointService {
        return this.initial;
    }
    setDestination(destination: PointService): void {
        this.destination = destination;
    }
    getDestination(): PointService {
        return this.destination;
    }
    getCenter(): PointService {
        return this.center;
    }
    getRaddii(): PointService {
        return this.radii;
    }
    getRotation(): number {
        return this.rotation;
    }
    generateCirle(radius: number, center: PointService): void {
        this.minimum.setPositionX(center.getPositionX() - radius);
        this.minimum.setPositionY(center.getPositionY() - radius);
        this.maximum.setPositionX(center.getPositionX() + radius);
        this.maximum.setPositionY(center.getPositionY() + radius);
        this.initialize(this.minimum);
        this.setDestination(this.maximum);
        this.radii.setPositionX(radius);
        this.radii.setPositionY(radius);
        this.center.setPositionX(center.getPositionX());
        this.center.setPositionY(center.getPositionY());
        const SOUTHPOLE = new PointService(center.getPositionX(), center.getPositionY() - radius);
        const NORTHPOLE = new PointService(center.getPositionX(), center.getPositionY() + radius);
        this.instruction = this.svgWorker.move(NORTHPOLE);
        this.instruction += this.svgWorker.hemiLeftArc(this.radii, SOUTHPOLE);
        this.instruction += this.svgWorker.move(NORTHPOLE);
        this.instruction += this.svgWorker.hemiRightArc(this.radii, SOUTHPOLE);
    }

    private setCenterAndRadii(): void {
        const WIDTHDISPLACEMENT = Math.floor(this.getWidth() / 2);
        const RX = (this.maximum.getPositionX() - this.minimum.getPositionX()) / 2;
        const RY = (this.maximum.getPositionY() - this.minimum.getPositionY()) / 2;
        this.radii.setPositionX(RX - WIDTHDISPLACEMENT);
        this.radii.setPositionY(RY - WIDTHDISPLACEMENT);
        this.center.setPositionX(this.minimum.getPositionX() + RX);
        this.center.setPositionY(this.minimum.getPositionY() + RY);
    }

    findExtremums(): void {
        if (this.initial.getPositionX() < this.destination.getPositionX()) {
            this.minimum.setPositionX(this.initial.getPositionX());
            this.maximum.setPositionX(this.destination.getPositionX());
        } else {
            this.minimum.setPositionX(this.destination.getPositionX());
            this.maximum.setPositionX(this.initial.getPositionX());
        }
        if (this.initial.getPositionY() < this.destination.getPositionY()) {
            this.minimum.setPositionY(this.initial.getPositionY());
            this.maximum.setPositionY(this.destination.getPositionY());
        } else {
            this.minimum.setPositionY(this.destination.getPositionY());
            this.maximum.setPositionY(this.initial.getPositionY());
        }
    }

    findAndSetProperties(): void {
        this.findExtremums();
        this.setCenterAndRadii();
    }
    generateEllipse(): void {
        const WIDTHDISPLACEMENT = Math.floor(this.getWidth() / 2);
        const SOUTHPOLE = new PointService(this.maximum.getPositionX() - this.radii.getPositionX(),
                                           this.maximum.getPositionY() - WIDTHDISPLACEMENT);
        const NORTHPOLE = new PointService(this.minimum.getPositionX() + this.radii.getPositionX(),
                                           this.minimum.getPositionY() + WIDTHDISPLACEMENT);
        this.instruction = this.svgWorker.move(NORTHPOLE);
        this.instruction += this.svgWorker.hemiLeftArc(this.radii, SOUTHPOLE);
        this.instruction += this.svgWorker.move(NORTHPOLE);
        this.instruction += this.svgWorker.hemiRightArc(this.radii, SOUTHPOLE);
        this.northPole = NORTHPOLE;
        this.southPole = SOUTHPOLE;
        console.log('RADII');
        console.log(this.radii);
    }
    detectLineIntersection(line: LineShape): boolean {
        let toReturn = false;
        if (this.isLineHorizontal(line)) {
            toReturn = this.findHorizontalLineIntersection(line);
        } else if (this.isLineVertical(line)) {
            toReturn = this.findVerticalLineIntersection(line);
        }
        return toReturn;
    }
    /*
        Equation of an ellipse centered at (h,k) with radii (a,b): (x-h)^2/a^2 + (y-k)^2/b^2 = 1
                                                                        XTERM  +    YTERM    = 1
    */
    findHorizontalLineIntersection(line: LineShape): boolean {
        let borneX: PointService;
        const Y = line.getDestination().getPositionY();
        if (line.getDestination().getPositionX() > line.getOrigin().getPositionX()) {
            borneX = new PointService(line.getOrigin().getPositionX(), line.getDestination().getPositionX());
        } else {
            borneX = new PointService(line.getDestination().getPositionX(), line.getOrigin().getPositionX());
        }
        const YTERM = Math.pow((Y - (this.center.getPositionY())), 2) / (Math.pow(this.radii.getPositionY(), 2));
        const XTERM = 1 - YTERM;
        const XMINUSH = this.radii.getPositionX() * Math.sqrt(XTERM);
        const POSITIVEX = this.center.getPositionX() + XMINUSH;
        const NEGATIVEX = this.center.getPositionX() - XMINUSH;
        if (POSITIVEX >= borneX.getPositionX() && POSITIVEX <= borneX.getPositionY()) {
            return true;
        } else if (NEGATIVEX >= borneX.getPositionX() && NEGATIVEX <= borneX.getPositionY()) {
            return true;
        } else {
            return false;
        }
    }
    generate(): void {
        if (this.shiftPressed) {
            this.generateAnchoredCircle();
        } else {
            this.generateEllipse();
        }
    }
    generateAnchoredCircle(): void {
        const WIDTH = this.getMaximum().getPositionX() - this.getMinimum().getPositionX();
        const HEIGHT = this.getMaximum().getPositionY() - this.getMinimum().getPositionY();
        this.initialize(this.getMinimum());
        if (WIDTH > HEIGHT) {
            const NEWDESTINATION = new PointService(this.getMinimum().getPositionX() + HEIGHT, this.getMinimum().getPositionY() + HEIGHT);
            this.setDestination(NEWDESTINATION);
        } else {
            const NEWDESTINATION = new PointService(this.getMinimum().getPositionX() + WIDTH, this.getMinimum().getPositionY() + WIDTH);
            this.setDestination(NEWDESTINATION);
        }
        this.findAndSetProperties();
        this.generateEllipse();
    }
    rotate(degree: number): void {
        if (this.rotation + degree >= PI ) {
            const SURPLUS = (this.rotation + degree) - PI;
            this.rotation = -PI;
            this.rotation += SURPLUS;
        } else {
            this.rotation += degree;
        }
        this.generateRotatedEllipse(degree);
    }
    rotateAroundPoint(degree: number, point: PointService): void {
        this.maximum.rotateAboutPoint(degree, point);
        this.minimum.rotateAboutPoint(degree, point);
        this.generate();
    }
    generateRotatedEllipse(degree: number): void {
        const NORTHPOLE = this.northPole;
        const SOUTHPOLE = this.southPole;
        NORTHPOLE.rotateAboutPoint(degree, this.center);
        SOUTHPOLE.rotateAboutPoint(degree, this.center);
        this.minimum = new PointService(MAX, MAX);
        this.maximum = new PointService(0, 0);
        this.findRotatedExtremums();
        this.instruction = this.svgWorker.noFloorMove(this.southPole);
        this.instruction += this.svgWorker.rotatedHemiLeftArc(this.radii, this.northPole, -this.rotation);
        this.instruction += this.svgWorker.rotatedHemiRightArc(this.radii, this.southPole, -this.rotation);
    }
    findRotatedExtremums(): void {
        const WIDTHDISPLACEMENT = Math.floor(this.getWidth() / 2);
        const XT0 = Math.atan(-(this.radii.getPositionY() * Math.tan(this.degreeToRadian(this.rotation)) / this.radii.getPositionX()));
        const XT1 = XT0 + Math.PI;
        const YT0 = Math.atan(this.radii.getPositionY() / this.radii.getPositionX() *
                              Math.cos(this.degreeToRadian(this.rotation)) / Math.sin(this.degreeToRadian(this.rotation)));
        const YT1 = YT0 + Math.PI;
        let X0 = this.center.getPositionX() + this.radii.getPositionX() * Math.cos(XT0) * Math.cos(this.degreeToRadian(this.rotation))
                    - this.getRaddii().getPositionY() * Math.sin(XT0) * Math.sin(this.degreeToRadian(this.rotation));
        let Y0 = this.center.getPositionY() + this.radii.getPositionX() * Math.cos(YT0) * Math.sin(this.degreeToRadian(this.rotation))
                    + this.getRaddii().getPositionY() * Math.cos(this.degreeToRadian(this.rotation)) * Math.sin(YT0);
        let X1 = this.center.getPositionX() + this.radii.getPositionX() * Math.cos(XT1) * Math.cos(this.degreeToRadian(this.rotation))
                    - this.getRaddii().getPositionY() * Math.sin(XT1) * Math.sin(this.degreeToRadian(this.rotation));
        let Y1 = this.center.getPositionY() + this.radii.getPositionX() * Math.cos(YT1) * Math.sin(this.degreeToRadian(this.rotation))
                    + this.getRaddii().getPositionY() * Math.cos(this.degreeToRadian(this.rotation)) * Math.sin(YT1);
        if (X1 > X0) {
            X1 += WIDTHDISPLACEMENT;
            X0 -= WIDTHDISPLACEMENT;
        } else {
            X1 -= WIDTHDISPLACEMENT;
            X0 += WIDTHDISPLACEMENT;
        }
        if (Y1 > Y0) {
            Y1 += WIDTHDISPLACEMENT;
            Y0 -= WIDTHDISPLACEMENT;
        } else {
            Y1 -= WIDTHDISPLACEMENT;
            Y0 += WIDTHDISPLACEMENT;
        }
        const EXTREMUM0 = new PointService(X0, Y0);
        const EXTREMUM1 = new PointService(X1, Y1);
        this.updateExtremums(EXTREMUM0);
        this.updateExtremums(EXTREMUM1);
        this.boundingRect.initialize(this.minimum);
        this.boundingRect.setLastPoint(this.maximum);
        this.boundingRect.setMinimum(this.minimum);
        this.boundingRect.setMaximum(this.maximum);
        this.boundingRect.generateRectangle();
    }
    degreeToRadian(toConvert: number): number {
        return toConvert * Math.PI / PI;
    }
    /*
        Equation of an ellipse centered at (h,k) with radii (a,b): (x-h)^2/a^2 + (y-k)^2/b^2 = 1
                                                                        XTERM  +    YTERM    = 1
    */
    findVerticalLineIntersection(line: LineShape): boolean {
        let borneY: PointService;
        const X = line.getDestination().getPositionX();
        if (line.getDestination().getPositionY() > line.getOrigin().getPositionY()) {
            borneY = new PointService(line.getOrigin().getPositionY(), line.getDestination().getPositionY());
        } else {
            borneY = new PointService(line.getDestination().getPositionY(), line.getOrigin().getPositionY());
        }
        const XTERM = Math.pow(X - this.center.getPositionX(), 2) / (Math.pow(this.radii.getPositionX(), 2));
        const YTERM = 1 - XTERM;
        const YMINUSK = this.radii.getPositionY() * Math.sqrt(YTERM);
        const POSITIVEY = this.center.getPositionY() + YMINUSK;
        const NEGATIVEY = this.center.getPositionY() - YMINUSK;
        if ((POSITIVEY >= borneY.getPositionX() && POSITIVEY <= borneY.getPositionY()) ||
             (NEGATIVEY >= borneY.getPositionX() && NEGATIVEY <= borneY.getPositionY())) {
            return true;
        } else {
            return false;
        }
    }
    detectRectangleIntersection(rectangleToCheck: Rectangle): boolean {
        if (this.rotation === 0) {
            let i = 0;
            for (; i < rectangleToCheck.lines.length; i++) {
                const SELECTLINE = rectangleToCheck.lines[i];
                if (this.detectLineIntersection(SELECTLINE)) {
                    return true;
                }
            }
            return false;
        } else {
            return this.boundingRect.detectRectangleIntersection(rectangleToCheck);
        }
    }
    isLineVertical(line: LineShape): boolean {
        return line.getOrigin().getPositionX() === line.getDestination().getPositionX();
    }
    isLineHorizontal(line: LineShape): boolean {
        return line.getOrigin().getPositionY() === line.getDestination().getPositionY();
    }

    translate(xTranslation: number, yTranslation: number): void {
        this.initial.setPositionX(this.initial.getPositionX() + xTranslation);
        this.initial.setPositionY(this.initial.getPositionY() + yTranslation);
        this.destination.setPositionX(this.destination.getPositionX() + xTranslation);
        this.destination.setPositionY(this.destination.getPositionY() + yTranslation);
        this.findAndSetProperties();
        this.generateEllipse();
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
}
