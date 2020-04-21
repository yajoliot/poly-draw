import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MatToolbarModule, MatIconModule, MatSliderModule, MatFormFieldModule, MatSnackBar, MatInputModule} from '@angular/material';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CreationDialog } from './creation-dialog.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('CreationDialog', () => {
  const DIALOGMOCK = {
    close: () => { }
   };

   const SNACKBARMOCK = {
    open: () => { }
   };

  let component: CreationDialog;
  let fixture: ComponentFixture<CreationDialog>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            MatToolbarModule, 
            MatDialogModule, 
            MatIconModule,MatSliderModule, 
            FormsModule, MatFormFieldModule, 
            MatInputModule, 
            BrowserAnimationsModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: DIALOGMOCK
          },{
            provide: MAT_DIALOG_DATA,
            useValue: {}
          },{
            provide: MatSnackBar,
            useValue: SNACKBARMOCK
          },
          CreationDialog
       ],
        declarations: [ CreationDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationDialog);
    component = fixture.componentInstance;

    component.minRGB = 0;
    component.maxRGB = 255;
    component.redRGB = 255;
    component.greenRGB = 255;
    component.blueRGB = 255;
    component.opacity = 255;
    component.width = 2;
    component.height = 2;

    fixture.detectChanges();
  });

  it('should create', inject([MAT_DIALOG_DATA], () => {
    expect(component).toBeTruthy();
  }));

  it('if all attributes are correct should close dialogRef', inject([MAT_DIALOG_DATA], () => {
    const DIALOGREFSPY = spyOn(component.dialogRef, 'close');
    component.confirm();

    let creationRes = {
        r: component.redRGB,
        g: component.greenRGB,
        b: component.blueRGB,
        o: component.opacity,
        width: component.width,
        height: component.height
    }

    expect(DIALOGREFSPY).toHaveBeenCalledWith(creationRes);
  }));

  it('if one attribute is incorrect should not close dialogRef', inject([MAT_DIALOG_DATA], () => {
    const DIALOGREFSPY = spyOn(component.dialogRef, 'close');
    component.opacity = 256;
    component.confirm();

    expect(DIALOGREFSPY).toHaveBeenCalledWith(null);
  }));

  it('if cancel method is called close dialog', inject([MAT_DIALOG_DATA], () => {
    const DIALOGREFSPY = spyOn(component.dialogRef, 'close');

    component.cancel();

    expect(DIALOGREFSPY).toHaveBeenCalledWith(null);
  }));

  it('onresize should resize window', inject([MAT_DIALOG_DATA], () => {
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;

    component.onResize();

    expect(component.height).toBe(HEIGHT - 85);
    expect(component.width).toBe(WIDTH - 75);
  }));
});