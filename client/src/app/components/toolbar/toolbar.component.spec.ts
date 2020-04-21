import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule,
   MatSelectModule, MatToolbarModule, MatSnackBarModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { ExporterDialogComponent } from '../../../dialogs/exporter-dialog/exporter-dialog.component';
import { SaveDialog } from '../../../dialogs/save-dialog/save-dialog.component';
import { ToolbarComponent } from './toolbar.component';
const ROUTER = {
  navigate: jasmine.createSpy('navigate')
};

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let confiEnv: ConfigEnvService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatSnackBarModule, RouterTestingModule,
                BrowserAnimationsModule, HttpClientTestingModule, MatDialogModule,
                MatFormFieldModule, MatInputModule, FormsModule, MatToolbarModule, MatSelectModule],
      declarations: [ ToolbarComponent, SaveDialog, ExporterDialogComponent ],
      providers: [{ provide: Router, useValue: ROUTER }, ConfigEnvService]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [SaveDialog, ExporterDialogComponent] } });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    confiEnv = TestBed.get(ConfigEnvService);
    fixture.detectChanges();
  });

  it('grid()', () => {
    component.setGridOn(true);
    component.grid();
    expect(component.getGridOn()).toBe(false);
    component.setGridOn(false);
    component.grid();
    expect(component.getGridOn()).toBe(true);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigate to guide', () => {
    component.guideClick();
    expect(ROUTER.navigate).toHaveBeenCalledWith(['app-userguide']);
  });

  it('navigate to guide call', () => {
    component.guideClick();
  });

  it('setGridOn', () => {
    component.setGridOn(true);
    expect(component.getGridOn()).toBe(true);
  });

  it('getGrid', () => {
    component.setGridOn(true);
    component.getGridOn();
  });

  it('selectTool', () => {
    component.selectTool('Pencil');
    expect(component.selectedButton).toBe(component['pencilRef']);
  });

  it('buttonTogglePencil', () => {
    component.buttonToggle('Pencil');
    expect(component.selectedButton).toBe(component['pencilRef']);
  });
  it('buttonToggleBrush', () => {
    component.buttonToggle('Brush');
    expect(component.selectedButton).toBe(component['brushRef']);
  });
  it('buttonToggleCircle', () => {
    component.buttonToggle('Ellipse');
    expect(component.selectedButton).toBe(component['ellipseRef']);
  });
  it('buttonToggleRectangle', () => {
    component.buttonToggle('Rectangle');
    expect(component.selectedButton).toBe(component['rectangleRef']);
  });
  it('buttonToggleLine', () => {
    component.buttonToggle('Line');
    expect(component.selectedButton).toBe(component['lineRef']);
  });
  it('buttonToggleNotGood', () => {
    component.buttonToggle('Line');
    component.buttonToggle('Bad');
    expect(component.selectedButton).toBe(component['lineRef']);
  });
  it('buttonToggle undefined', () => {
    component.selectedButton = undefined;
    component.buttonToggle('Line');
  });

  it('buttonToggle Polygone', () => {
    component.buttonToggle('Polygon');
    expect(component.selectedButton).toBe(component['polygonRef']);
  });

  it('buttonToggle Selection', () => {
    component.buttonToggle('Selection');
    expect(component.selectedButton).toBe(component['selectionRef']);
  });
  it('buttonToggle Spray', () => {
    component.buttonToggle('Spray');
    expect(component.selectedButton).toBe(component['sprayRef']);
  });
  it('buttonToggle pipette', () => {
    component.buttonToggle('Pipette');
    expect(component.selectedButton).toBe(component['pipetteRef']);
  });
  it('buttonToggle Eraser', () => {
    component.buttonToggle('Eraser');
    expect(component.selectedButton).toBe(component['eraserRef']);
  });
  it('buttonToggle Color', () => {
    component.buttonToggle('Color');
    expect(component.selectedButton).toBe(component['colorRef']);
  });
  it('buttonToggle Grid', () => {
    component.buttonToggle('Grid');
    expect(component.selectedButton).toBe(component['gridRef']);
  });

  it('saveDrawingClick()', () => {
    confiEnv.drawingElement = new ElementRef(1);
    component.saveDrawingClick();
    component.setGridOn(false);
    component.saveDrawingClick();
  });

  it('openExporterDialog()', () => {
    confiEnv.drawingElement = new ElementRef(1);
    component.openExporterDialog();
    component.setGridOn(true);
    component.openExporterDialog();
  });

  it('KeyboardDown1 block = true', () => {
    confiEnv.blockKeyEvents = true;
    const keyboardMock = new KeyboardEvent('keydown', {key: '1'});
    component.keyDown(keyboardMock);
  });

  it('KeyboardDown1 block = false', () => {
    const keyboardMock = new KeyboardEvent('keydown', {key: '1'});

    confiEnv.blockKeyEvents = true;
    component.keyDown(keyboardMock);
    confiEnv.blockKeyEvents = false;
    component.keyDown(keyboardMock);
    expect(component.selectedButton).toEqual(component['rectangleRef']);
  });

  it('KeyboardDownc', () => {
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: 'c'});
    component.keyDown(keyboardMock);
    expect(component.selectedButton).toEqual(component['pencilRef']);
  });
  it('KeyboardDownl', () => {
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: 'l'});
    component.keyDown(keyboardMock);
    expect(component.selectedButton).toEqual(component['lineRef']);
  });
  it('KeyboardDownw', () => {
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: 'w'});
    component.keyDown(keyboardMock);
    expect(component.selectedButton).toEqual(component['brushRef']);
  });
  it('KeyboardDown3', () => {
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: '3'});
    component.keyDown(keyboardMock);
    expect(component.selectedButton).toEqual(component['polygonRef']);
  });
  it('KeyboardDowna', () => {
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: 'a'});
    component.keyDown(keyboardMock);
    expect(component.selectedButton).toEqual(component['sprayRef']);
  });
  it('KeyboardDown-', () => {
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: '-'});
    component.keyDown(keyboardMock);
  });
  it('KeyboardDown+', () => {
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: '+'});
    component.keyDown(keyboardMock);
  });
  it('KeyboardDownwg', () => {
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: 'g'});
    component.setGridOn(false);
    component.keyDown(keyboardMock);
    component.setGridOn(true);
  });
  it('KeyboardDowne ctrl', () => {
    confiEnv.drawingElement = new ElementRef(1);
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: 'e', ctrlKey: true});
    component.keyDown(keyboardMock);
  });
  it('KeyboardDowns ctrl', () => {
    confiEnv.drawingElement = new ElementRef(1);
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: 's', ctrlKey: true});
    component.keyDown(keyboardMock);
  });
  it('KeyboardDowng ctrl', () => {
    confiEnv.drawingElement = new ElementRef(1);
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: 'g', ctrlKey: true});
    component.keyDown(keyboardMock);
  });
  it('KeyboardDowni', () => {
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: 'i'});
    component.keyDown(keyboardMock);
    expect(component.selectedButton).toEqual(component['pipetteRef']);
  });
  it('KeyboardDowne ctrl', () => {
    confiEnv.drawingElement = new ElementRef(1);
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: 'e', ctrlKey: true});
    component.keyDown(keyboardMock);
  });

  it('KeyboardDown e', () => {
    confiEnv.drawingElement = new ElementRef(1);
    const keyboardMock2 = new KeyboardEvent('window:keydown', {key: 'e'});
    component.keyDown(keyboardMock2);
    expect(component.selectedButton).toEqual(component['eraserRef']);
  });

  it('KeyboardDowns ctrls', () => {
    confiEnv.drawingElement = new ElementRef(1);
    confiEnv.blockKeyEvents = false;
    const keyboardMock2 = new KeyboardEvent('window:keydown', {key: 's', ctrlKey: false});
    component.keyDown(keyboardMock2);
    expect(component.selectedButton).toEqual(component['selectionRef']);
  });

  it('KeyboardDown 2', () => {
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: '2'});
    component.keyDown(keyboardMock);
    expect(component.selectedButton).toEqual(component['selectionRef']);
  });

  it('KeyboardDown b', () => {
    confiEnv.blockKeyEvents = false;
    const keyboardMock = new KeyboardEvent('window:keydown', {key: 'b'});
    component.keyDown(keyboardMock);
    expect(component.selectedButton).toEqual(component['bucketRef']);
  });
});
