import { AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import { MatDialogRef, MatTabChangeEvent } from '@angular/material';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { ToolUtilService } from '../../services/toolUtil/toolUtil.service';
import { PipetteToolService } from 'src/services/tools/pipetteTool/pipette-tool.service';

const UN = 1;
const QUATRE = 4;
const ZEROUNSEPT = 0.17;
const ZEROTROISQUATRE = 0.34;
const ZEROCINQUN = 0.51;
const ZEROSIXHUIT = 0.68;
const ZEROHUITCINQ = 0.85;
const LINEWIDTH = 5;
const UNZERO = 10;
const UNSIX = 16;
@Component({
    selector: 'color-picker-dialog',
    templateUrl: './color-picker-dialog.component.html',
    styleUrls: ['./color-picker-dialog.component.scss']
  })

export class ColorPickerDialog implements AfterViewInit {

    ctx: CanvasRenderingContext2D;
    mousedown: boolean;

    selectedWidth: number;
    selectedTab: number;

    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;

    red: number;
    green: number ;
    blue: number;
    redHex: string;
    greenHex: string;
    blueHex: string;
    opacity: number;

    @ViewChild('canvas', {read: ElementRef, static: false})
    canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvas2', {read: ElementRef, static: false})
    canvas2: ElementRef<HTMLCanvasElement>;
    @ViewChild('colorPreview', {read: ElementRef, static: false})
    colorPreview: ElementRef;
    @ViewChild('colorPreview2', {read: ElementRef, static: false})
    colorPreview2: ElementRef;
    @ViewChild('colorPreview3', {read: ElementRef, static: false})
    colorPreview3: ElementRef;
    testService: any;

    constructor(public dialogRef: MatDialogRef<ColorPickerDialog>, private toolUtil: ToolUtilService,
                private configEnv: ConfigEnvService, private pipetteTool: PipetteToolService) {
        this.selectedTab = 0;
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.redHex = '';
        this.greenHex = '';
        this.blueHex = '';
        this.opacity = 1;
        this.mousedown = false;
        this.pipetteTool.pipette$.subscribe(
            () => {
                this.addPipetteModifications();
            }
        );
    }

    ngAfterViewInit(): void {
        this.drawColorPalette();
    }

    addPipetteModifications(): void{
        this.primaryColor = this.toolUtil.getPrimaryColor();
        this.secondaryColor = this.toolUtil.getSecondaryColor();
    }

    confirm(): void {
        switch (this.selectedTab) {
            case 0:
                this.toolUtil.addPrimaryColor(this.primaryColor);
                break;
            case 1:
                this.toolUtil.addSecondaryColor(this.secondaryColor);
                break;
            case 2:
                this.configEnv.changeBackgroundColor(this.backgroundColor);
                break;
        }

        const rgbRes = {
            primary: this.toolUtil.colors[0],
            secondary: this.toolUtil.colors[1]
        };
        this.dialogRef.close(rgbRes);
    }

    addPrimaryColor(color: string): void{
        this.primaryColor = color;
        this.colorPreview.nativeElement.style.color = this.primaryColor;
        this.toolUtil.addPrimaryColor(this.primaryColor);
    }

    addSecondaryColor(color: string): void {
        this.secondaryColor = color;
        this.colorPreview.nativeElement.style.color = this.secondaryColor;
        this.toolUtil.addSecondaryColor(color);
    }

    cancel(): void {
        this.dialogRef.close(null);
    }

    tabChanged(event: MatTabChangeEvent): void {
        this.selectedTab = event.index;
        this.drawColorPalette();

    }

    inputChange(): void {
        switch (this.selectedTab) {
            case 0:
                this.primaryColor = `rgb(${this.red},${this.green},${this.blue},${this.opacity})`;
                this.colorPreview.nativeElement.style.color = this.primaryColor;
                break;
            case 1:
                this.secondaryColor = `rgb(${this.red},${this.green},${this.blue},${this.opacity})`;
                this.colorPreview2.nativeElement.style.color = this.secondaryColor;
                break;
            case 2:
                this.backgroundColor = `rgb(${this.red},${this.green},${this.blue},${this.opacity})`;
                break;
        }
        this.selectedWidth = 0;
        this.drawColorPalette();
    }

    iconClick(event: any): void {
        const DATA = event.srcElement.style.color.slice(0, -UN).slice(QUATRE).split(',');
        this.red = parseInt(DATA[0], 10);
        this.green = parseInt(DATA[1], 10);
        this.blue = parseInt(DATA[2], 10);
        switch (this.selectedTab) {
            case 0:
                this.primaryColor = `rgb(${this.red},${this.green},${this.blue},1)`;
                this.colorPreview.nativeElement.style.color = this.primaryColor;
                break;
            case 1:
                this.secondaryColor = `rgb(${this.red},${this.green},${this.blue},1)`;
                this.colorPreview2.nativeElement.style.color = this.secondaryColor;
                break;
            case 2:
                this.backgroundColor = `rgb(${this.red},${this.green},${this.blue},1)`;
                this.colorPreview3.nativeElement.style.color = this.backgroundColor;
                break;
        }
    }

    drawColorPalette(): void {

        const width: number = this.canvas.nativeElement.width;
        const height: number = this.canvas.nativeElement.height;

        if (!this.ctx) {
            this.ctx = ( this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
        }

        this.ctx.clearRect(0, 0, width, height);
        const grad = this.ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, 'rgb(255, 0, 0, 1)');
        grad.addColorStop(ZEROUNSEPT, 'rgb(255, 255, 0, 1)');
        grad.addColorStop(ZEROTROISQUATRE, 'rgb(0, 255, 0, 1)');
        grad.addColorStop(ZEROCINQUN, 'rgb(0, 255, 255, 1)');
        grad.addColorStop(ZEROSIXHUIT, 'rgb(0, 0, 255, 1)');
        grad.addColorStop(ZEROHUITCINQ, 'rgb(255, 0, 255, 1)');
        grad.addColorStop(1, 'rgb(255, 0, 0, 1)');
        this.ctx.beginPath();
        this.ctx.rect(0, 0, width, height);
        this.ctx.fillStyle = grad;
        this.ctx.fill();
        this.ctx.closePath();
        if (this.selectedWidth) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = LINEWIDTH;
            this.ctx.rect(this.selectedWidth - LINEWIDTH, 0, UNZERO, height);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(): void {
      this.mousedown = false;
    }

    onMouseDown(event: MouseEvent): void {
      this.mousedown = true;
      this.selectedWidth = event.offsetX;
      this.drawColorPalette();
      this.setColor(event.offsetX, event.offsetY);
      this.opacity = 1;
    }

    onMouseMove(event: MouseEvent): void {
      if (this.mousedown) {
        this.selectedWidth = event.offsetX;
        this.drawColorPalette();
        this.setColor(event.offsetX, event.offsetY);
      }
    }

    setColor(x: number, y: number): void {
        switch (this.selectedTab) {
            case 0:
                this.primaryColor = this.getColorAtPos(x, y);
                this.colorPreview.nativeElement.style.color = this.primaryColor;
                break;
            case 1:
                this.secondaryColor = this.getColorAtPos(x, y);
                this.colorPreview2.nativeElement.style.color = this.secondaryColor;
                break;
            case 2:
                this.backgroundColor = this.getColorAtPos(x, y);
                this.colorPreview3.nativeElement.style.color = this.backgroundColor;
                break;
        }
    }

    getColorAtPos(x: number, y: number): string {
      const imageData = this.ctx.getImageData(x, y, 1, 1).data;
      this.red = imageData[0];
      this.green = imageData[1];
      this.blue = imageData[2];
      return  `rgb(${imageData[0]},${imageData[1]},${imageData[2]},1)`;
    }

    switch(): void {
        this.toolUtil.switch();
        this.dialogRef.close();
    }

    inputChangeHexRed(): void {
        this.red = parseInt(this.redHex, 16) || 0;
        this.greenHex = this.green.toString(UNSIX);
        this.blueHex = this.blue.toString(UNSIX);
        this.inputChange();
    }
    inputChangeHexGreen(): void {
        this.redHex = this.red.toString(UNSIX);
        this.green = parseInt(this.greenHex, 16) || 0;
        this.blueHex = this.blue.toString(UNSIX);
        this.inputChange();
    }
    inputChangeHexBlue(): void {
        this.redHex = this.red.toString(UNSIX);
        this.greenHex = this.green.toString(UNSIX);
        this.blue = parseInt(this.blueHex, 16) || 0;
        this.inputChange();
    }
}
