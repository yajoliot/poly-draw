import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatGridListModule, MatToolbarModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, MatExpansionModule, MatSnackBarModule, MatDialog} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ServerSelectComponent } from './server-select.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
 import { Drawing } from '../../../models/shapes/drawing/drawing';
import { SnackBarService } from 'src/services/snackbar/snackbar.service';
import { ServerReqService } from 'src/services/http/server-req.service';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { ConfirmDialog } from 'src/dialogs/confirm/confirm-dialog.component';


let router = {
  navigate: jasmine.createSpy('navigate')
}

describe('ServerSelectComponent', () => {
  let component: ServerSelectComponent;
  let fixture: ComponentFixture<ServerSelectComponent>;
  let configEnv: ConfigEnvService;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatGridListModule, MatToolbarModule, MatDialogModule,
        MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, MatProgressSpinnerModule,
        MatExpansionModule, HttpClientTestingModule, MatSnackBarModule, BrowserAnimationsModule],
      declarations: [ ServerSelectComponent ],
      providers: [{ provide: Router, useValue: router }, ConfigEnvService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerSelectComponent);
    component = fixture.componentInstance;
    configEnv = TestBed.get(ConfigEnvService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigate to menu', () => {
    component.navigateMenuClick();
    expect(router.navigate).toHaveBeenCalledWith(['app-menu']);
  });

  it('undoFilterClick', () => {
    spyOn(component, 'ngOnInit');
    component.undoFilterClick();
    expect(component.undoFilterClick).toHaveBeenCalled();
  });

  it('ngOnInit tests', () => {
    inject([ServerReqService], (injectServerReq: ServerReqService) => {
      spyOn(injectServerReq, 'getDrawings');
      component.drawingMap = new Map();
      const d1 = new Drawing('lol', 0, 0, '', 'lol', ['aaa', 'bbb'], [], 'abc', []);
      component.drawingMap.set('1', d1);
      expect(component.drawingMap.size).toBe(1);
      component.loading = true;
      component.ngOnInit();

      expect(component.drawingMap.size).toBe(0);
      expect(component.loading).toBe(false);
      expect(injectServerReq.getDrawings).toHaveBeenCalled();

    });
  });

  it('ngOnInit tests function calls', ()=> {
    component.loading = false;
    component.ngOnInit();
    expect(component.loading).toBe(true);

  });

  it('OpenDrawingClick() navigate 1', ()=> {
    component.drawingMap = new Map();
    const d1 = new Drawing('lol', 0, 0, '', 'lol', ['aaa', 'bbb'], [], 'abc', []);
    component.drawingMap.set('1', d1);
    component.openDrawingClick('1');
    expect(router.navigate).toHaveBeenCalledWith(['app-draw']);
  });

  it ('OpenDrawingClick() injectConfigEnv.drawingInProgress = true', () => {
    inject([ConfigEnvService, MatDialog], (injectConfigEnv: ConfigEnvService, injectMatDialog: MatDialog) => {

      component.drawingMap = new Map();
      const d1 = new Drawing('lol', 0, 0, '', 'lol', ['aaa', 'bbb'], [], 'abc', []);
      component.drawingMap.set('1', d1);
      injectConfigEnv.drawingInProgress = true;
      spyOn(injectMatDialog, 'open');
      component.openDrawingClick('1');

      expect(injectConfigEnv.backgroundColor).toBe(component.drawingMap.get('1').backgroundColor);
      expect(injectConfigEnv.width).toBe(component.drawingMap.get('1').width)
      expect(injectConfigEnv.height).toBe(component.drawingMap.get('1').height);

      expect(injectMatDialog).toHaveBeenCalledWith(ConfirmDialog, {
        width: '40%',
        data: {
          title: 'Warning',
          content: 'You have a drawing in progress. Are you sure you want to overwrite it?'
        }
      });
    });
  });

  it ('OpenDrawingClick() injectConfigEnv.drawingInProgress = false', () => {
    inject([ConfigEnvService], (injectConfigEnv: ConfigEnvService) => {

      component.drawingMap = new Map();
      const d1 = new Drawing('lol', 0, 0, '', 'lol', ['aaa', 'bbb'], [], 'abc', []);
      component.drawingMap.set('1', d1);
      injectConfigEnv.drawingInProgress = false;
      component.openDrawingClick('1');

      expect(injectConfigEnv.backgroundColor).toBe(component.drawingMap.get('1').backgroundColor);
      expect(injectConfigEnv.width).toBe(component.drawingMap.get('1').width)
      expect(injectConfigEnv.height).toBe(component.drawingMap.get('1').height);

    });
  });

  it('openDrawwing click false', () => {
    configEnv.drawingInProgress = false;
    component.openDrawingClick('1');
    configEnv.drawingInProgress = true;
    component.openDrawingClick('1');
  });

  it('undoFilter throws ngOnInit', ()=> {
    spyOn(component, 'ngOnInit');
    component.undoFilterClick();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('undoFilter throws ngOnInit', () => {
    component.undoFilterClick();
  });

  it('applyClick by name', () => {

    const d1 = new Drawing('lol', 0, 0, '', 'lol', ['aaa', 'bbb'], [], 'abc', []);
    const d2 = new Drawing('name', 0, 0, '', 'lol', ['allo', 'bonjour'], [], 'abc', []);
    const d3 = new Drawing('abc', 0, 0, '', 'lol', ['zaza', 'baba'], [], 'abc', []);

    component.drawingMap = new Map();

    expect(component.drawingMap.size).toEqual(0);
    component.drawingMap.set(1, d1);
    component.drawingMap.set(2, d2);
    component.drawingMap.set(3, d3);
    component.loading = false;

    component.applyClick();

    expect(component.drawingMap.size).toEqual(3);

    component.filterByName = 'name';
    component.applyClick();

    expect(component.drawingMap.size).toEqual(1);

  });

  it('applyClick by label', () => {

    component.applyClick();

    const d1 = new Drawing('lol', 0, 0, '', 'lol', ['aaa', 'bbb'], [], 'abc', []);
    const d2 = new Drawing('name', 0, 0, '', 'lol', ['allo', 'bonjour'], [], 'abc', []);
    const d3 = new Drawing('abc', 0, 0, '', 'lol', ['zaza', 'baba'], [], 'abc', []);
    const d4 = new Drawing('abc', 0, 0, '', 'lol', [], [], 'abc' ,[]);

    component.drawingMap = new Map();

    expect(component.drawingMap.size).toEqual(0);

    component.drawingMap.set(1, d1);
    component.drawingMap.set(2, d2);
    component.drawingMap.set(3, d3);
    component.drawingMap.set(4, d4);

    component.loading = false;

    component.applyClick();

    expect(component.drawingMap.size).toEqual(4);

    component.filterByLabel = 'z';
    component.applyClick();
    expect(component.drawingMap.size).toEqual(1);

    component.filterByName = 'hhh';
    component.applyClick();

  });

  it('delete drawing called on deleteDrawingClick()', () => {
    inject([SnackBarService, ServerReqService], (injectSnackBar: SnackBarService, injectServerReq: ServerReqService) => {
      spyOn(injectServerReq, 'deleteDrawing');
      spyOn(injectSnackBar, 'openSnackBar');
      spyOn(component.drawingMap, 'delete');
      component.deleteDrawingClick('1');
      expect(injectServerReq.deleteDrawing).toHaveBeenCalled();
      expect(injectSnackBar.openSnackBar).toHaveBeenCalled();
      expect(component.drawingMap.delete).toHaveBeenCalled();

    });
  });

  it('deleteDrawing call', () => {
    component.deleteDrawingClick('1');
  });

});
