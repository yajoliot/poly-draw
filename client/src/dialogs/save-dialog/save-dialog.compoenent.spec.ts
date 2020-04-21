import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatIconModule, MatToolbarModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { SaveDialog } from './save-dialog.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElementRef } from '@angular/core';

describe('InfoDialog', () => {
  const DIALOGMOCK = {
    close: () => {}
   };

  const htmlElements: any = {};
  document.getElementById = jasmine.createSpy('HTML Element').and.callFake((ID) => {
  if (!htmlElements[ID]) {
     const newElement = document.createElement('div');
     htmlElements[ID] = newElement;
  }
  return htmlElements[ID];
  });

  let component: SaveDialog;
  let fixture: ComponentFixture<SaveDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [MatToolbarModule, MatDialogModule, MatIconModule, 
          FormsModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: DIALOGMOCK
          }, {
            provide: MAT_DIALOG_DATA,
            useValue: { data: {
              drawing: new ElementRef(1)
            }}
          },
          SaveDialog
       ],
        declarations: [ SaveDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', inject([MAT_DIALOG_DATA], () => {
    expect(component).toBeTruthy();
  }));

  it('should close', inject([MAT_DIALOG_DATA], () => {
    const DIALOGREFSPY = spyOn(component.dialogRef, 'close');
    component.drawing = {children: [{innerHTML: ''}]};

    component.closeDialog(false);
    expect(DIALOGREFSPY).toHaveBeenCalled();
  }));

  it('ng afterViewinit()', () => {
    component.ngAfterViewInit();
    expect(typeof component.ctx).toBe('object');
  });

  it('drawDrawing()', () => {
    component.drawing = undefined;
    component.drawDrawing();
  });

  it('drawDrawing()', () => {
    const elMock = document.getElementById('1');
    component.drawing = elMock;
    component.drawDrawing();
  });

  it('addLabelClick()', ()=> {
    component.addLabelClick('label');
    expect(component.labels.length).toBe(1);
    component.addLabelClick('label');
    expect(component.labels.length).toBe(1);
  });

  it('removeLabelClick()', ()=> {
    component.addLabelClick('label')
    component.removeLabelClick('label1');
    expect(component.labels.length).toBe(1);
    component.removeLabelClick('label');
    expect(component.labels.length).toBe(0);
  });

  it('close', () => {
    component.drawing = {children: [{innerHTML: ''}]};
    component.closeDialog(true);
  });

  it('getInstrctions', () => {
    component.drawing = {children: [{innerHTML: ''}]};

    expect(component.getInstructions('<path >allo1</path><path >allo2</path>')).toEqual(['', '<path >allo1</path>', '<path >allo2</path>']);
  });

});
