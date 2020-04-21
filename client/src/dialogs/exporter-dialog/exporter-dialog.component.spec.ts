import { async, ComponentFixture,inject , TestBed } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatIconModule, MatFormFieldModule, MatToolbarModule, MatSelectModule, MatInputModule, MatSnackBarModule} from '@angular/material';
import { ExporterDialogComponent } from './exporter-dialog.component';
import { ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('ExporterDialogComponent', () => {

  const DIALOGMOCK = {
    close: () => { }
   };
  var HTMLElements: any = {};
  document.getElementById = jasmine.createSpy('HTML Element').and.callFake(function(ID) {
  if(!HTMLElements[ID]) {
     var newElement = document.createElement('div');
     HTMLElements[ID] = newElement;
  }
  return HTMLElements[ID];
});

  let component: ExporterDialogComponent;
  let fixture: ComponentFixture<ExporterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExporterDialogComponent ],
      imports: [MatDialogModule, MatIconModule, MatFormFieldModule, FormsModule, BrowserAnimationsModule, MatToolbarModule, MatSelectModule, MatInputModule, HttpClientTestingModule, MatSnackBarModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: DIALOGMOCK
        }, {
          provide: MAT_DIALOG_DATA,
          useValue: { data: {
            drawing: new ElementRef(1)
          }}
        }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExporterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', inject([MAT_DIALOG_DATA], () => {
    expect(component).toBeTruthy();
  }));

  it('should close', inject([MAT_DIALOG_DATA], () => {
    const DIALOGREFSPY = spyOn(component.dialogRef, 'close');
    component.localExport();
    expect(DIALOGREFSPY).toHaveBeenCalled();
  }));
  
  it('ng afterViewinit()', () => {
    component.ngAfterViewInit();
    expect(typeof component.ctx).toBe('object')
  });

  it('drawDrawing()', () => {
    component.drawing = undefined;
    component.viewPreview();
  });

  it('drawDrawing()', () => {
    let elMock = document.getElementById('1');
    component.drawing = elMock;
    component.viewPreview();
  });

  it('formatType', () => {
    component.formatType('png');
    expect(component.format).toBe('png');
  });

  it('filter', () => {
    component.filter('none');
    component.filter('blur');
    component.filter('grayscale');
    component.filter('invert');
    component.filter('sepia');
    component.filter('saturate')
    

  })

  it('export()', () => {
    let elMock = document.getElementById('1');
    component.drawing = elMock;
    component.formatType('svg');
    component.export();
    component.formatType('jpeg');
    component.export();
    component.formatType('png');
    component.export();
    
  });

  it('exportMail ', () => {


    component.emailTo = 'lol';
    component.imageData = 'lol';
    component.drawingName = 'lol';

    component.mailExport();
    
  });

  it('export this.format == "jpeg" ', () => {
    component.format = 'jpeg';
    component.exportMethod = 'mail';
    component.export();

  });

  it('localexport this.format == "png" ', () => {
    component.format = 'png';
    component.exportMethod = 'local';
    component.localExport();

  });

  it('exportTo mail', ()=> {
    component.exportTo('mail');
    expect(component.exportMethod).toBe('mail');

  });

  it('exportTo local', ()=> {
    component.exportTo('local');
    expect(component.exportMethod).toBe('local');
    
  });



});
