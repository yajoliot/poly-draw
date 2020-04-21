import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {  MatIconModule, MatFormFieldModule, MatSelectModule, MatDialogModule,
   MatInputModule, MatSliderModule, MatToolbarModule,  MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToolUtilService } from 'src/services/toolUtil/toolUtil.service';
import { Router } from '@angular/router';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ColorPickerDialog } from 'src/dialogs/color-picker/color-picker-dialog.component';
import { FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';

const router = {
  navigate: jasmine.createSpy('navigate')
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, BrowserAnimationsModule, MatIconModule, MatFormFieldModule, MatSelectModule,
         MatDialogModule, MatInputModule, MatSliderModule, MatToolbarModule,  MatTabsModule, FormsModule],
      declarations: [ HeaderComponent, ColorPickerDialog],
      providers: [ToolUtilService, { provide: Router, useValue: router } ]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ ColorPickerDialog] } });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    component.ngOnInit();
  });

  it('navigate to menu', () => {
    component.menuClick();
    expect(router.navigate).toHaveBeenCalledWith(['app-menu']);
  });

  it('colorClick()', () => {
    component.colorClick();
  });

  it('BrushTypesClick()', () => {
    component.brushTypeClick('Type1');
  });

  it('brushTypeClickType1', () => {
    component.brushTypeClick('Type1')
    inject([ToolUtilService], (injectService: ToolUtilService) => {
      expect(injectService.getBrushType()).toBe('Type1');
    });
  });

  it('brushTypeClickType2', () => {
    component.brushTypeClick('Type2')
    inject([ToolUtilService], (injectService: ToolUtilService) => {
      expect(injectService.getBrushType()).toBe('Type2');
    });
  });

  it('brushTypeClickType3', () => {
    component.brushTypeClick('Type3')
    inject([ToolUtilService], (injectService: ToolUtilService) => {
      expect(injectService.getBrushType()).toBe('Type3');
    });
  });

  it('brushTypeClickType4', () => {
    component.brushTypeClick('Type4')
    inject([ToolUtilService], (injectService: ToolUtilService) => {
      expect(injectService.getBrushType()).toBe('Type4');
    });
  });

  it('brushTypeClickType5', () => {
    component.brushTypeClick('Type3')
    inject([ToolUtilService], (injectService: ToolUtilService) => {
      expect(injectService.getBrushType()).toBe('Type5');
    });
  });

  it('junctionTypeCLick()', () => {
    component.junctionTypeClick(true);
  });

  it('rand', () => {
    component.updateEmission(1);
    component.updateRadius(1);
    component.colorIcon = new ElementRef({style: {color: ''}});
    component.colorIcon2 = new ElementRef({style: {color: ''}});
    component.setColorIcons();
  });

  it('stroketransparency', ()=> {
    component.transparancyInc(-1);
    component.transparancyInc(5);
    component.transparancyInc(15);
  });

  it('rand', () => {
    component.strokeSizeInc(-1);
    component.strokeSizeInc(1);
  });

  it('StrokeSize1+1', () => {
    inject([ToolUtilService], (injectService: ToolUtilService) => {
      injectService.strokeSize = 1;
      component.strokeSizeInc(1);
      expect(injectService.strokeSize).toBe(2);
    });
  });

  it('StrokeSize2-1', () => {
    inject([ToolUtilService], (injectService: ToolUtilService) => {
      injectService.strokeSize = 2;
      component.strokeSizeInc(-1);
      expect(injectService.strokeSize).toBe(1);
    });
  });

  it('StrokeSize1-1', () => {
    inject([ToolUtilService], (injectService: ToolUtilService) => {
      injectService.strokeSize = 1;
      component.strokeSizeInc(-1);
      expect(injectService.strokeSize).toBe(1);
    })
  });

  it('nbOfSidesInc correctly increments amount of sides', () => {
      component['toolUtil'].nbSides = 3;
      component.nbOfSidesInc(3);

      expect(component['toolUtil'].nbSides).toEqual(6);
  });

  it('nbOfSidesInc does not increment if condition is larger than 13', () => {
      component['toolUtil'].nbSides = 14;
      component.nbOfSidesInc(3);

      expect(component['toolUtil'].nbSides).toEqual(14);
  });

  it('typeEllipse changes ellipse type', () => {

    component['toolUtil'].typeEllipse = 'fdsa';
    component.typeEllipse('Circle');

    expect(component['toolUtil'].typeEllipse).toEqual('Circle');

  });

  it('eraserSizeInc correclty increment eraser size', () => {

    component['toolUtil'].eraserSize = 3;
    component.eraserSizeInc(3);

    expect(component['toolUtil'].eraserSize).toEqual(6);

  });

  it('eraserSizeInc does not increment if smaller than 2', () => {

    component['toolUtil'].eraserSize = 1;
    component.eraserSizeInc(5);

    expect(component['toolUtil'].eraserSize).toEqual(6);

  });

  it('setColorIcons correctly setIconColors', () => {

    component.colorIcon = new ElementRef({style:{color: ''}});
    component.colorIcon2 = new ElementRef({style:{color: ''}});
    component.setColorIcons();

    expect(component.colorIcon.nativeElement.style.color).toEqual(component['toolUtil'].getPrimaryColor());
    expect(component.colorIcon2.nativeElement.style.color).toEqual(component['toolUtil'].getPrimaryColor());

  });

});
