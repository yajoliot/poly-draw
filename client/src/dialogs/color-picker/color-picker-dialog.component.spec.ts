import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MatToolbarModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatTabChangeEvent} from '@angular/material';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ColorPickerDialog } from './color-picker-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolUtilService } from 'src/services/toolUtil/toolUtil.service';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { ElementRef } from '@angular/core';

describe('DrawComponent', () => {

  let component: ColorPickerDialog;
  let fixture: ComponentFixture<ColorPickerDialog>;
  let toolUtil: ToolUtilService;
  let configEnv: ConfigEnvService
  const DIALOGMOCK = {
    close: () => { }
   };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            MatToolbarModule,
            MatDialogModule,
            MatIconModule,
            FormsModule, MatFormFieldModule,
            MatInputModule,
            MatTabsModule,
            BrowserAnimationsModule
          ],
        providers: [
          {
            provide: MatDialogRef,
            useValue: DIALOGMOCK
          }, {
            provide: MAT_DIALOG_DATA,
            useValue: {}
          },
          ColorPickerDialog,
          ToolUtilService,
          ConfigEnvService
       ],
        declarations: [ ColorPickerDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerDialog);
    component = fixture.componentInstance;
    toolUtil = TestBed.get(ToolUtilService);
    configEnv = TestBed.get(ConfigEnvService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngAfterViewInit', () => {
    component.ngAfterViewInit();
  });

  it('addPipettemod', () => {

    toolUtil.colors[0] = '#000000';
    toolUtil.colors[1] = '#0000FF';
    component.addPipetteModifications();
    expect(component.primaryColor).toBe(toolUtil.colors[0]);
    expect(component.secondaryColor).toBe(toolUtil.colors[1]);

  });

  it('confirm selectedTab calls', () => {

    spyOn(configEnv, 'changeBackgroundColor');

    configEnv.drawingElement = new ElementRef(1);

    component.selectedTab = 0;
    component.confirm();
    component.selectedTab = 1;
    component.confirm();
    component.selectedTab = 2;
    component.confirm();

    expect(configEnv.changeBackgroundColor).toHaveBeenCalled();
  });

  it('addPrimaryColor', () => {
    component.addPrimaryColor('#000000');
    expect(toolUtil.getPrimaryColor()).toBe('#000000')
  });

  it('addSecondaryColor', () => {
    component.addSecondaryColor('#0000FF');
    expect(toolUtil.getSecondaryColor()).toBe('#0000FF')
  });

  it('cancel call', () => {
    component.cancel();
  });
  it('tabChange', () => {
    component.tabChanged(new MatTabChangeEvent());
  });

  it('inputChange', () => {
    component.primaryColor = '#000000';
    component.secondaryColor = '#000000';

    component.selectedTab = 0;
    component.inputChange();
    expect(component.colorPreview.nativeElement.style.color).toBe('rgb(0, 0, 0)');

    component.selectedTab = 1;
    component.inputChange();
    expect(component.colorPreview2.nativeElement.style.color).toBe('rgb(0, 0, 0)');

    component.selectedTab = 2;
    component.inputChange();

    expect(component.selectedWidth).toBe(0);
  });

  it('iconClick()', () => {
    component.primaryColor = 'rgb(0,0,0)';
    component.secondaryColor = 'rgb(1,1,1)';
    const mockEvent = {srcElement: {style: { color: 'rgb(255,255,255)'}}};

    component.selectedTab = 0;
    component.iconClick(mockEvent);
    expect(component.colorPreview.nativeElement.style.color).toBe('rgb(255, 255, 255)');

    component.selectedTab = 1;
    component.iconClick(mockEvent);

    expect(component.colorPreview2.nativeElement.style.color).toBe('rgb(255, 255, 255)');

    component.selectedTab = 2;
    component.iconClick(mockEvent);

    component.selectedTab = 3;
    component.iconClick(mockEvent);

  });

  it('drawColorPalette()', () => {
    component.drawColorPalette();
  });

  it('mouseUp', () => {
    component.onMouseUp();
    expect(component.mousedown).toBe(false);
  });

  it('mouseDowm', () => {
    component.onMouseDown(new MouseEvent('mousedown'));
    expect(component.mousedown).toBe(true);
    expect(component.opacity).toBe(1);
  });

  it('mouseMouve', () => {
    component.mousedown = false;
    component.onMouseMove(new MouseEvent('mousemove'));
    component.mousedown = true;
    component.onMouseMove(new MouseEvent('mousemove'));
  });

  it('setColor', () => {
    component.selectedTab = 0;
    component.setColor(1, 1)
    component.selectedTab = 1;
    component.setColor(1, 1);
    component.selectedTab = 2;
    component.setColor(1,1);
  });

  it('getColorAtPosition', () => {
    component.getColorAtPos(1, 1);
  });

  it('switch', () => {
    component.switch()
  });

  it('if selected tab is 0 addPrimaryColor', () => {
    inject([ToolUtilService], (toolUtil: ToolUtilService) => {
      const DIALOGREFSPY = spyOn(component.dialogRef, 'close');
      spyOn(toolUtil, 'addPrimaryColor');
      component.selectedTab = 0;
      component.confirm();
      expect(toolUtil.addPrimaryColor).toHaveBeenCalled();

      const  rgbRes = {
        primary: toolUtil.colors[0],
        secondary: toolUtil.colors[1]
      };
      expect(DIALOGREFSPY).toHaveBeenCalledWith(rgbRes);
    });

  });

  it('if selected tab is 1 addSecondaryColor', () => {
    inject([ToolUtilService], (toolUtil: ToolUtilService) => {
      spyOn(toolUtil, 'addSecondaryColor');
      const DIALOGREFSPY = spyOn(component.dialogRef, 'close');

      component.selectedTab = 1;
      component.confirm();
      expect(toolUtil.addSecondaryColor).toHaveBeenCalled();

      const rgbRes = {
        primary: toolUtil.colors[0],
        secondary: toolUtil.colors[1]
      };

      expect(DIALOGREFSPY).toHaveBeenCalledWith(rgbRes);
    });

  });

  it('if selected tab is 2 changeBackgroundColor', () => {
    inject([ConfigEnvService, ToolUtilService], (configEnv: ConfigEnvService, toolUtil: ToolUtilService) => {
      spyOn(configEnv, 'changeBackgroundColor');
      const DIALOGREFSPY = spyOn(component.dialogRef, 'close');

      component.selectedTab = 2;
      component.confirm();
      expect(configEnv.changeBackgroundColor).toHaveBeenCalled();

      const rgbRes = {
        primary: toolUtil.colors[0],
        secondary: toolUtil.colors[1]
      };

      expect(DIALOGREFSPY).toHaveBeenCalledWith(rgbRes);
    });
  });

  it('cancel closes dialog with null', () => {
    const DIALOGREFSPY = spyOn(component.dialogRef, 'close');

    component.cancel();

    expect(DIALOGREFSPY).toHaveBeenCalledWith(null);
  });

  it('ngAfterViewInit method launches function draw', () => {
    spyOn(component, 'drawColorPalette');

    component.ngAfterViewInit();
    expect(component.drawColorPalette).toHaveBeenCalled();
  });

  it('tabChanged changes tab and launches draw', () => {
    spyOn(component, 'drawColorPalette');

    const mockTabChange = new MatTabChangeEvent();
    mockTabChange.index = 5000;

    component.tabChanged(mockTabChange);

    expect(component.selectedTab).toBe(5000);
    expect(component.drawColorPalette).toHaveBeenCalled();
  });

  it('in input change if selected tab is 0 change primary color and color preview', () => {
    spyOn(component, 'drawColorPalette');
    component.selectedTab = 0;
    component.inputChange();
    expect(component.primaryColor).toBe(`rgb(${component.red},${component.green},${component.blue},${component.opacity})`);
    expect(component.secondaryColor).toBeUndefined();
    expect(component.backgroundColor).toBeUndefined();
    expect(component.drawColorPalette).toHaveBeenCalled();
  });

  it('in input change if selected tab is 1 change secondary color and color preview', () => {
    spyOn(component, 'drawColorPalette');
    component.selectedTab = 1;
    component.inputChange();
    expect(component.primaryColor).toBeUndefined();
    expect(component.secondaryColor).toBe(`rgb(${component.red},${component.green},${component.blue},${component.opacity})`);
    expect(component.backgroundColor).toBeUndefined();
    expect(component.drawColorPalette).toHaveBeenCalled();
  });

  it('in input change if selected tab is 2 change background color and color preview', () => {
    spyOn(component, 'drawColorPalette');
    component.selectedTab = 2;
    component.inputChange();
    expect(component.primaryColor).toBeUndefined();
    expect(component.secondaryColor).toBeUndefined();
    expect(component.backgroundColor).toBe(`rgb(${component.red},${component.green},${component.blue},${component.opacity})`);
    expect(component.drawColorPalette).toHaveBeenCalled();
  });

  it('in iconClick method if selected tab is  0 change primary color and colorpreview', () => {
    component.selectedTab = 0;

    const mockEvent = {srcElement: { style: { color: 'nothing' }}};

    component.iconClick(mockEvent);

    expect(component.primaryColor).toBe(`rgb(${component.red},${component.green},${component.blue},${component.opacity})`);
    expect(component.secondaryColor).toBeUndefined();
    expect(component.backgroundColor).toBeUndefined();
  });

  it('in iconClick method if selected tab is  1 change secondary color and colorpreview', () => {
    component.selectedTab = 1;

    const mockEvent = {srcElement:{ style:{ color: 'nothing' }}}

    component.iconClick(mockEvent);

    expect(component.primaryColor).toBeUndefined();
    expect(component.secondaryColor).toBe(`rgb(${component.red},${component.green},${component.blue},${component.opacity})`);
    expect(component.backgroundColor).toBeUndefined();
  });

  it('in iconClick method if selected tab is  2 change background color and colorpreview', () => {
    component.selectedTab = 2;

    const mockEvent = {srcElement:{ style:{ color: 'nothing' }}}

    component.iconClick(mockEvent);
    expect(component.primaryColor).toBeUndefined();
    expect(component.secondaryColor).toBeUndefined();
    expect(component.backgroundColor).toBe(`rgb(${component.red},${component.green},${component.blue},${component.opacity})`);
  });

  it('in draw if ctx not null ver¢ification works', () => {
    component.drawColorPalette();
    expect(component.ctx == null).toBe(false);
    expect(component.ctx).toBe((<CanvasRenderingContext2D>component.canvas.nativeElement.getContext('2d')));
  });

  it('draw() calls 1', () => {

    spyOn(component.ctx, 'beginPath');
    spyOn(component.ctx, 'rect')
    spyOn(component.ctx, 'fill');
    spyOn(component.ctx, 'closePath');

    component.drawColorPalette();
    expect(component.ctx.beginPath).toHaveBeenCalled();
    expect(component.ctx.rect).toHaveBeenCalled();
    expect(component.ctx.fill).toHaveBeenCalled();
    expect(component.ctx.closePath).toHaveBeenCalled();
  });

  it('draw() calls 2', () => {
    component.selectedWidth = 50;
    spyOn(component.ctx, 'beginPath');
    spyOn(component.ctx, 'rect')
    spyOn(component.ctx, 'stroke');
    spyOn(component.ctx, 'closePath');

    component.drawColorPalette();
    expect(component.ctx.beginPath).toHaveBeenCalled();
    expect(component.ctx.rect).toHaveBeenCalled();
    expect(component.ctx.stroke).toHaveBeenCalled();
    expect(component.ctx.closePath).toHaveBeenCalled();
    expect(component.ctx.lineWidth).toBe(5);
    expect(component.ctx.strokeStyle).toBe('#000000');
  });

  it('inputChangeRedHex', () => {
    component.red = 1;
    component.green = 2;
    component.blue = 3;
    component.redHex = 'a';
    component.greenHex = 'b';
    component.blueHex = 'c';

    component.inputChangeHexRed();

    expect(component.red).toBe(parseInt(component.redHex, 16) || 0);
    expect(component.greenHex).toBe(component.green.toString(16));
    expect(component.blueHex).toBe(component.blue.toString(16));
  });

  it('inputChangeGreenHex', () => {
    component.red = 1;
    component.green = 2;
    component.blue = 3;
    component.redHex = 'a';
    component.greenHex = 'b';
    component.blueHex = 'c';

    component.inputChangeHexRed();

    expect(component.green).toBe(parseInt(component.greenHex, 16) || 0);
    expect(component.redHex).toBe(component.red.toString(16));
    expect(component.blueHex).toBe(component.blue.toString(16));
  });

  it('inputChangeRedHex', () => {
    component.red = 1;
    component.green = 2;
    component.blue = 3;
    component.redHex = 'a';
    component.greenHex = 'b';
    component.blueHex = 'c';

    component.inputChangeHexRed();

    expect(component.blue).toBe(parseInt(component.blueHex, 16) || 0);
    expect(component.greenHex).toBe(component.green.toString(16));
    expect(component.redHex).toBe(component.red.toString(16));
  });

  it('switch', () => {
    inject([ToolUtilService], ( toolUtil: ToolUtilService) => {
    spyOn(component.dialogRef, 'close');
    spyOn(toolUtil, 'switch');
    component.switch()
    expect(toolUtil.switch).toHaveBeenCalled();
    expect(component.dialogRef.close).toHaveBeenCalled();
    });

  });

});
