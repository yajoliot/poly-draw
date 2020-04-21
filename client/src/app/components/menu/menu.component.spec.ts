import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MatGridListModule, MatToolbarModule, MatCardModule, MatDialogModule, MatIconModule, MatDialog } from '@angular/material'
import { MenuComponent } from './menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ConfigEnvService } from 'src/services/config/config-env.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialog }from '../../../dialogs/confirm/confirm-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';



let router = {
  navigate: jasmine.createSpy('navigate')
}



describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let configService: ConfigEnvService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatGridListModule, MatToolbarModule, MatCardModule, MatDialogModule, BrowserAnimationsModule, MatIconModule],
      declarations: [ MenuComponent, ConfirmDialog ],
      providers: [{ provide: Router, useValue: router }, ConfigEnvService]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ConfirmDialog] } });
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    configService = TestBed.get(ConfigEnvService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigate to newDrawing', () => {
    component.newDrawingClick();
    expect(router.navigate).toHaveBeenCalledWith(['app-draw']);
  });

  it('navigate to guide', () => {
    component.guideClick();
    expect(router.navigate).toHaveBeenCalledWith(['app-userguide']);
  });

  it ('navigate calls', ()=> {
    component.continueDrawingClick();
    component.guideClick();
    component.newDrawingClick();
    component.openDrawingClick();
  });

  it('dialog open', ()=> {
    inject([ConfigEnvService, MatDialog], (injectConfigEnv: ConfigEnvService, injectMatDialog: MatDialog) => {
    
      injectConfigEnv.drawingInProgress = true;
      spyOn(injectMatDialog, 'open');
      component.newDrawingClick();

      expect(injectMatDialog).toHaveBeenCalledWith(ConfirmDialog, {
        width: '40%',
        data: {
          title: 'Attention',
          content: 'Vous avez un dessin en cours. Voulez-vous vraiment écraser?'
        }
      });

      injectMatDialog.closeAll();

    });
  })

  it('other branches of navigations', ()=> {
    configService.drawingInProgress = true;

    component.newDrawingClick();

    configService.drawingInProgress = false;
    component.newDrawingClick();
  })

  it('navigate to continu drawing', () => {
    inject([ConfigEnvService], (injectService: ConfigEnvService) => {
      injectService.drawingInProgress == true;
      component.continueDrawingClick();
      expect(router.navigate).toHaveBeenCalledWith(['app-draw']);
    });
  });


  it('newDrawing with inProgress true', () => {
    inject([ConfigEnvService], (injectService: ConfigEnvService,) => {
      injectService.drawingInProgress == false;
      component.newDrawingClick();
      expect(router.navigate).not.toHaveBeenCalledWith(['app-draw']);

    });

  });

  
});
