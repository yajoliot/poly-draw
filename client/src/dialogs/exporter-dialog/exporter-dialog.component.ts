import { AfterViewInit, Component, ElementRef, Inject, ViewChild,   } from '@angular/core';
import { MAT_DIALOG_DATA , MatDialogRef } from '@angular/material';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { ServerReqService } from '../../services/http/server-req.service';
import { SnackBarService } from '../../services/snackbar/snackbar.service';

const PNG_MIME_TYPE = 'image/png';
const JPEG_MIME_TYPE = 'image/jpeg';
const UNDEFINED = 'undefined';
const SVG = 'svg';
const JPEG = 'jpeg';
const B64_SVG_HEADER = 'data:image/svg+xml;base64,';
const MAIL = 'mail';
const LOCAL = 'local';
const NONE = 'none';
const NONE_FILTER = 'invert(0%)';
const BLUR_FILTER = 'blur(4px)';
const INVERT_FILTER = 'invert(100%)';
const GRAYSCALE_FILTER = 'grayscale(50%)';
const SEPIA_FILTER = 'sepia(100%)';
const SATURATE_FILTER = 'saturate(20%)';

@Component({
  selector: 'app-exporter-dialog',
  templateUrl: './exporter-dialog.component.html',
  styleUrls: ['./exporter-dialog.component.scss']
})

export class ExporterDialogComponent implements AfterViewInit {
  imageData: string;
  emailTo: string;
  exportMethod: string;

  drawingName: string;
  drawing: any;
  pngImage: string;
  format: string;
  ctx: CanvasRenderingContext2D;
  @ViewChild('Canvas', { static: false, read: ElementRef }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('Preview', { static: false, read: ElementRef }) preview: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ExporterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private configEnv: ConfigEnvService,
    private serverReq: ServerReqService, private snackbar: SnackBarService) {
    this.exportMethod = LOCAL;
    this.drawing = data.drawing;
  }

  ngAfterViewInit(): void {
    this.ctx = (this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
    this.canvas.nativeElement.height = this.configEnv.height;
    this.canvas.nativeElement.width = this.configEnv.width;
    this.viewPreview();
  }

  viewPreview(): void {
    if (typeof this.drawing !== UNDEFINED) {

      const xml = new XMLSerializer().serializeToString(this.drawing);

      const svg64 = btoa(xml);
      const b64Start = B64_SVG_HEADER;

      const image64 = b64Start + svg64;
      const image = new Image();

      image.onload = () => {
          this.ctx.drawImage(image, 0, 0);
          const pngSrc = this.canvas.nativeElement.toDataURL(PNG_MIME_TYPE);
          this.preview.nativeElement.src = pngSrc;
          this.pngImage = pngSrc;
          this.canvas.nativeElement.style.display = NONE;

      };
      image.src = image64;
    }
  }

  exportTo(value: string): void {
    if (value === MAIL) {
      this.exportMethod = MAIL;

    } else if (value === LOCAL) {
      this.exportMethod = LOCAL;
    }

  }

  filter(chosenFilter: string): void {
    switch (chosenFilter) {
       case 'none':
          this.ctx.filter = NONE_FILTER;
          break;
        case 'blur':
          this.ctx.filter = BLUR_FILTER;
          break;
        case 'grayscale':
          this.ctx.filter = GRAYSCALE_FILTER;
          break;
        case 'invert':
          this.ctx.filter = INVERT_FILTER;
          break;
        case 'sepia':
          this.ctx.filter = SEPIA_FILTER;
          break;
        case 'saturate':
          this.ctx.filter = SATURATE_FILTER;
          break;
    }
    this.viewPreview();
  }

  formatType(chosenFormat: string): void {
    this.format = chosenFormat;
  }

  export(): void {
    const a = document.createElement('a');
    document.body.appendChild(a);

    if (this.format === SVG) {
      document.body.getElementsByTagName('a')[0].style.width = '100%';
      document.body.getElementsByTagName('a')[0].style.height = '100%';
      const xml = new XMLSerializer().serializeToString(this.drawing);

      const svg64 = btoa(xml);
      const b64Start = B64_SVG_HEADER;
      const image64 = b64Start + svg64;

      a.href = image64;

    } else if (this.format === JPEG) {
      a.href = this.canvas.nativeElement.toDataURL(JPEG_MIME_TYPE);
    } else {
      a.href = this.canvas.nativeElement.toDataURL(PNG_MIME_TYPE);
    }

    if (this.exportMethod === MAIL) {
      this.imageData = a.href;
    } else if (this.exportMethod === LOCAL) {
      a.download = this.drawingName;
      a.click();
    }
    document.body.removeChild(a);
  }

  mailExport(): void {

    this.export();
    const data: object = {
      email: this.emailTo,
      image: this.imageData,
      fileName: this.drawingName
    };

    this.serverReq.sendMail(data).subscribe((res) => {
      if (res) {
        this.snackbar.openSnackBar('Mail Sent', 'OK');
        this.dialogRef.close();
      } else {
        this.snackbar.openSnackBar('Error sending mail', 'OK');
      }
    });
  }

  localExport(): void {
    this.export();
    this.dialogRef.close();
  }

}
