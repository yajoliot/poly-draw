import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatIconModule, MatToolbarModule} from '@angular/material';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { InfoDialog } from './info-dialog.component';
// import { of } from 'rxjs';

describe('InfoDialog', () => {
  const DIALOGMOCK = {
    close: () => { }// remplacer par quoi  ne peut pas etre vide
   };
  let component: InfoDialog;
  let fixture: ComponentFixture<InfoDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [MatToolbarModule, MatDialogModule, MatIconModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: DIALOGMOCK
          }, {
            provide: MAT_DIALOG_DATA,
            useValue: {}
          },
          InfoDialog
       ],
        declarations: [ InfoDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', inject([MAT_DIALOG_DATA], () => {
    expect(component).toBeTruthy();
  }));

  it('should close()', inject([MAT_DIALOG_DATA], () => {
    const DIALOGREFSPY = spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(DIALOGREFSPY).toHaveBeenCalled();
  }));
});
