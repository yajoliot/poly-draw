import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MatToolbarModule, MatIconModule, MatSliderModule, MatFormFieldModule, MatSnackBar, MatInputModule} from '@angular/material';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialog } from './confirm-dialog.component';


describe('CreationDialog', () => {
  const DIALOGMOCK = {
    close: () => { }
   };

   const SNACKBARMOCK = {
    open: () => { }
   };

  let component: ConfirmDialog;
  let fixture: ComponentFixture<ConfirmDialog>;
  
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
          ConfirmDialog
       ],
        declarations: [ ConfirmDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialog);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', inject([MAT_DIALOG_DATA], () => {
    expect(component).toBeTruthy();
  }));

  it('cancel closes dialog with false', inject([MAT_DIALOG_DATA], () => {
    const DIALOGREFSPY = spyOn(component.dialogRef, 'close');

    component.cancel();

    expect(DIALOGREFSPY).toHaveBeenCalledWith(false);
  }));

  it('confirm closes dialog with true', inject([MAT_DIALOG_DATA], () => {
    const DIALOGREFSPY = spyOn(component.dialogRef, 'close');
    component.confirm();

    expect(DIALOGREFSPY).toHaveBeenCalledWith(true);
  }));

  
});