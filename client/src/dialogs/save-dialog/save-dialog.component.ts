import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material';
import { ConfigEnvService } from 'src/services/config/config-env.service';

const UNDEFINED = 'undefined';
const PNG_MIME_TYPE = 'image/png';
const B64_PNG_HEADER = 'data:image/svg+xml;base64,';

@Component({
    selector: 'save-dialog',
    templateUrl: './save-dialog.component.html',
    styleUrls: []
})

export class SaveDialog implements AfterViewInit {
    drawingName: string;
    drawing: any;
    labels: string[] = [];
    pngImage: string;

    @ViewChild('Canvas', { static: false, read: ElementRef }) canvas: ElementRef<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D;

    @ViewChild('Preview', { static: false, read: ElementRef }) preview: ElementRef;

    constructor(
        public dialogRef: MatDialogRef<SaveDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
        private configEnv: ConfigEnvService) {
        this.drawing = data.drawing;
    }

    ngAfterViewInit(): void {
        this.ctx = (this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
        this.canvas.nativeElement.height = this.configEnv.height;
        this.canvas.nativeElement.width = this.configEnv.width;
        this.drawDrawing();
    }

    drawDrawing(): void {
        if (typeof this.drawing !== UNDEFINED) {

            const xml = new XMLSerializer().serializeToString(this.drawing);

            const svg64 = btoa(xml);
            const b64Start = B64_PNG_HEADER;

            const image64 = b64Start + svg64;
            const image = new Image();

            image.onload = () => {
                this.ctx.drawImage(image, 0, 0);
                const pngSrc = this.canvas.nativeElement.toDataURL(PNG_MIME_TYPE);
                this.preview.nativeElement.src = pngSrc;
                this.pngImage = pngSrc;
                this.canvas.nativeElement.style.display = 'none';
            };
            image.src = image64;
        }
    }

    addLabelClick(value: string): void {
        if (!this.labels.includes(value)) {
            this.labels.push(value);
        }
    }

    removeLabelClick(value: string): void {

        for (let i = 0; i < this.labels.length; i++) {
            if (this.labels[i] === value) {
                this.labels.splice(i, 1);
            }
        }
    }

    closeDialog(result: boolean): void {
        const instructions: string[] = this.getInstructions(this.drawing.children[0].innerHTML);
        this.dialogRef.close({
            instructs: instructions,
            res: result,
            name: this.drawingName,
            labels: this.labels,
            image: this.pngImage
        });
    }

    getInstructions(svg: string): string[] {
        const instructions: string[] = svg.split('<path');
        for (let i = 1; i < instructions.length; i++) {
            instructions[i] = '<path' + instructions[i];
        }
        return instructions;
    }
}
