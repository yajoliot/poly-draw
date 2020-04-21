import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkspaceComponent } from './workspace.component';
import { DrawingComponent } from '../drawing/drawing.component';
import { MatToolbarModule, MatSliderModule, MatIconModule, MatFormFieldModule, MatSnackBar, MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CreationDialog } from '../../../dialogs/creation/creation-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WorkspaceComponent', () => {

  let component: WorkspaceComponent;
  let fixture: ComponentFixture<WorkspaceComponent>;
  let configEnv: ConfigEnvService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatDialogModule, MatIconModule,
         MatToolbarModule, MatSliderModule, MatDialogModule, FormsModule, MatFormFieldModule],
      declarations: [ WorkspaceComponent, DrawingComponent, CreationDialog],
      providers: [ MatDialogModule, MatSnackBar, CreationDialog, ConfigEnvService],
      schemas: [ NO_ERRORS_SCHEMA ]

    }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ CreationDialog] } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceComponent);
    component = fixture.componentInstance;
    configEnv = TestBed.get(ConfigEnvService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('windowresize', () => {
    let windowResizeMock = {
      target: {
        innerWidth: 100,
        innerHeight: 150
      }
    }
    component.onResize(windowResizeMock);
    expect(component.windowHeight !== null).toBe(windowResizeMock.target.innerHeight !== null);
    expect(component.windowWidth !== null).toBe(windowResizeMock.target.innerWidth !== null);
  });

  it('OnInit', () => {

    component.ngOnInit();
    expect(component.windowHeight).toBe(window.innerHeight);
    expect(component.windowWidth).toBe(window.innerWidth);
  });

  it('createDrawingClick sets blockKeyEvents to true', () => {

    component["configEnv"].blockKeyEvents = false;
    component.createDrawingClick();
    expect(component["configEnv"].blockKeyEvents).toEqual(true);

  });

  it('keyDown2 calls createDrawingClick if blockKeyEvents = false and if key is o', () => {

    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'o'});

    spyOn(component, "createDrawingClick");

    component["configEnv"].blockKeyEvents = false;

    component.keyDown2(mockKeyboardEvent);

    expect(component.createDrawingClick).toHaveBeenCalled();

  });

  it('keyDown2 does not call createDrawingClick if blockKeyEvents = true or if event.key is not o', () => {

    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'o'});

    spyOn(component, "createDrawingClick");

    component["configEnv"].blockKeyEvents = true;

    component.keyDown2(mockKeyboardEvent);

    expect(component.createDrawingClick).not.toHaveBeenCalled();

    component["configEnv"].blockKeyEvents = false;

    const mockKeyboardEvent2 = new KeyboardEvent('keydown', {key: 'p'});

    component.keyDown2(mockKeyboardEvent2);

    expect(component.createDrawingClick).not.toHaveBeenCalled();

  });

  it('keyDown sets cntrlFlag to true if event.key is "Control"', () => {

    const mockKeyboardEvent = new KeyboardEvent('keydown', {key: 'bloublou'});

    component["ctrlFlag"] = false;

    component.keyDown(mockKeyboardEvent);

    expect(component["ctrlFlag"]).toEqual(false);

    const mockKeyboardEvent2 = new KeyboardEvent('keydown', {key: 'Control'});

    component.keyDown(mockKeyboardEvent2);

    expect(component["ctrlFlag"]).toEqual(true);

  });

  it('ngOnInit set the window attributes', () => {

    component["windowHeight"] = 0;
    component["windowWidth"] = 0;

    component.ngOnInit();

    expect(component["windowHeight"]).toEqual(window.innerHeight);
    expect(component["windowWidth"]).toEqual(window.innerWidth);

  });

  it('onResizes, resizes attributes', () => {

    const mockKeyboardEvent: any = {target: { innerHeight: 830, innerWidth: 1200}};

    component["windowHeight"] = 0;
    component["windowWidth"] = 0;

    component.onResize(mockKeyboardEvent);

    expect(component["windowHeight"] !== null).toEqual(window.innerHeight !== null);
    expect(component["windowWidth"] !== null).toEqual(window.innerWidth !== null);

  });

  // calls
  it('keyDown()', () => {
    component.keyDown(new KeyboardEvent('keydown', {key : 'bad'}));
    expect(component.ctrlFlag).toBe(false);
    component.keyDown(new KeyboardEvent('keydown', {key : 'Control'}));
    expect(component.ctrlFlag).toBe(true);
  });

  it('keyDown2()', () => {
    configEnv.blockKeyEvents = true;
    component.keyDown2(new KeyboardEvent('keyup', {key : 'bad'}));
    configEnv.blockKeyEvents = false;
    component.keyDown2(new KeyboardEvent('keyup', {key : 'bad'}));
    component.keyDown2(new KeyboardEvent('keyup', {key : 'o'}));

    expect(configEnv.blockKeyEvents).toBe(true);
  });

  it('keyUp()', () => {
    component.keyUp(new KeyboardEvent('keyup', {key : 'bad'}));
    component.keyUp(new KeyboardEvent('keyup', {key : 'Control'}));
    expect(component.ctrlFlag).toBe(false);
  });

  it('CheckIfLocalStorage()', () => {
    window.localStorage.clear();
    component['configEnv'].continuDrawingClicked = true;
    window.localStorage.setItem('drawing', JSON.stringify({
      width: '100px',
      height: '100px',
      backgroundColor: '#000000'
    }));

    component['configEnv'].drawingInProgress = false;

    component.checkIfLocalStorage();

    expect(component['configEnv'].drawingInProgress).toBe(true);
  });

  it('CheckIfLocalStorage() no drawing', () => {
    window.localStorage.clear();

    component['configEnv'].drawingInProgress = false;

    component.checkIfLocalStorage();

    expect(component['configEnv'].drawingInProgress).toBe(false);
  });

  it('autoSave', ()=> {

    window.localStorage.clear();

    component['configEnv'].backgroundColor = 'rgb(1, 1, 1)';
    component['configEnv'].width = 100;
    component['configEnv'].height = 100;

    component.autoSave({
      nativeElement: {
        innerHTML: '<path d>svg1</path><path d> svg2 </path><path d>svg</path>'
      }
    });

    expect(window.localStorage.getItem('svgNum')).toBe('4');

    expect(window.localStorage.getItem('svg1')).toBe('<path d>svg1</path>');

    expect(window.localStorage.getItem('drawing')).toBe('{"width":100,"height":100,"backgroundColor":"rgb(1, 1, 1)"}');

  })

});
