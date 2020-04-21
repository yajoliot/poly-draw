import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatExpansionModule, MatCardModule, MatAccordion} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserguideComponent } from './userguide.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';

describe('UserguideComponent', () => {
  let component: UserguideComponent;
  let fixture: ComponentFixture<UserguideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, RouterTestingModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatExpansionModule, MatCardModule],
      providers: [MatAccordion, Location],
      declarations: [ UserguideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(inject([MatAccordion], (Accordion: MatAccordion) => {
    fixture = TestBed.createComponent(UserguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('ngOnInit', () => {
    component.ngOnInit();
    expect(component.index).toBe(1);

  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cancel should call location.back', inject([Location], (location: Location) => {
    spyOn(location, 'back');
    component.cancel();
    expect(location.back).toHaveBeenCalled();
  }));

  it('toggleExpandState should close all accordions if it is false', inject([MatAccordion], (Accordion: MatAccordion) => {
    component.allExpandState = false;
    component.toggleExpandState();
    expect(component.allExpandState).toBe(true);
  }));

  it('Attribute the tool index', () => {
    component.selectTool(2);
    expect(component.index).toBe(2);
  });
  it('eraseGuide', () => {
    spyOn(component, 'eraseGuide');
    component.selectTool(2);
    expect(component.eraseGuide).toHaveBeenCalled();
  });

  it('cancel call',() => {
    component.cancel();
  });

  it('toggleExpandState call', () => {
    component.allExpandState = false;
    component.toggleExpandState();
    component.allExpandState = true;
    component.toggleExpandState();
  });

  it('selectTool call', () => {
    component.selectTool(1);
  });

  it('visiblePrevious', () => {
    component.index = 1;
    expect(component.visiblePrevious()).toBe(false);
    component.index = 2;
    expect(component.visiblePrevious()).toBe(true);
  });

  it('visibleNext', () => {
    component.index = 10;
    expect(component.visibleNext()).toBe(true);
    component.index = 19;
    expect(component.visibleNext()).toBe(false);
  });

  it('next', () => {
    component.index = 10;
    component.next();
    expect(component.index).toBe(11);
    component.index = 19;
    component.next();
    expect(component.index).toBe(1);
  });

  it('buttonToggle undefined', () => {
    component.selectedButton = undefined;
    component.buttonToggle(1);

  });

  it('buttonToggle', () => {

    component.buttonToggle(1);
    expect(component.selectedButton).toBe(component.welcomeRef);

    component.buttonToggle(2);
    expect(component.selectedButton).toBe(component.sauvegarderRef);

    component.buttonToggle(3);
    expect(component.selectedButton).toBe(component.galerieRef);

    component.buttonToggle(4);
    expect(component.selectedButton).toBe(component.filtrageRef);

    component.buttonToggle(5);
    expect(component.selectedButton).toBe(component.exporterRef);

    component.buttonToggle(6);
    expect(component.selectedButton).toBe(component.pencilRef);

    component.buttonToggle(7);
    expect(component.selectedButton).toBe(component.brushRef);

    component.buttonToggle(8);
    expect(component.selectedButton).toBe(component.lineRef);

    component.buttonToggle(9);
    expect(component.selectedButton).toBe(component.effaceRef);

    component.buttonToggle(10);
    expect(component.selectedButton).toBe(component.selectionRef);

    component.buttonToggle(11);
    expect(component.selectedButton).toBe(component.deplacementselectionRef);

    component.buttonToggle(12);
    expect(component.selectedButton).toBe(component.grilleRef);

    component.buttonToggle(13);
    expect(component.selectedButton).toBe(component.annulerRef);

    component.buttonToggle(14);
    expect(component.selectedButton).toBe(component.rectangleRef);

    component.buttonToggle(15);
    expect(component.selectedButton).toBe(component.polygoneRef);

    component.buttonToggle(16);
    expect(component.selectedButton).toBe(component.ellipseRef);

    component.buttonToggle(17);
    expect(component.selectedButton).toBe(component.colorRef);

    component.buttonToggle(18);
    expect(component.selectedButton).toBe(component.applicateurRef);

    component.buttonToggle(19);
    expect(component.selectedButton).toBe(component.pipetteRef);

  });

  it('string manipulations', () => {
    component.toggleWelcome();
    component.togglePencil();
    component.toggleBrush();
    component.toggleLine();
    component.toggleRectangle();
    component.toggleColor();
    component.toggleAnnulerRefaire();
    component.toggleSauvegarder();
    component.toggleGalerie();
    component.toggleFiltrage();
    component.toggleExporter();
    component.toggleSelection();
    component.toggleDeplacementSelection();
    component.toggleEfface();
    component.toggleApplicateur();
    component.togglePipette();
    component.togglePolygone();
    component.toggleEllipse();
    component.toggleGrille();
    component.getLocation();
    component.getAccordion();
    component.eraseGuide();
    expect(component.welcomeGuide).toBe('');
    expect(component.welcomeGuide).toBe('');
    expect(component.pencilGuide).toBe('');
    expect(component.brushGuide).toBe('');
    expect(component.welcomeGuide2).toBe('');
    expect(component.pencilGuide2).toBe('');
    expect(component.welcomeGuide3).toBe('');
    expect(component.brushGuide2).toBe('');
    expect(component.lineGuide2).toBe('');
    expect(component.lineGuide).toBe('');
    expect(component.rectangleGuide).toBe('');
    expect(component.rectangleGuide2).toBe('');
    expect(component.colorGuide2).toBe('');
    expect(component.colorGuide).toBe('');
    expect(component.annulerGuide).toBe('');
    expect(component.annulerGuide2).toBe('');
    expect(component.sauvegarderGuide).toBe('');
    expect(component.sauvegarderGuide2).toBe('');
    expect(component.galerieGuide2).toBe('');
    expect(component.galerieGuide).toBe('');
    expect(component.filtrageGuide).toBe('');
    expect(component.filtrageGuide2).toBe('');
    expect(component.exporterGuide).toBe('');
    expect(component.exporterGuide2).toBe('');
    expect(component.selectionGuide).toBe('');
    expect(component.selectionGuide2).toBe('');
    expect(component.deplacementSelectionGuide).toBe('');
    expect(component.deplacementSelectionGuide2).toBe('');
    expect(component.effaceGuide).toBe('');
    expect(component.effaceGuide2).toBe('');
    expect(component.applicateurGuide).toBe('');
    expect(component.applicateurGuide2).toBe('');
    expect(component.pipetteGuide).toBe('');
    expect(component.pipetteGuide2).toBe('');
    expect(component.polygoneGuide).toBe('');
    expect(component.polygoneGuide2).toBe('');
    expect(component.ellipseGuide).toBe('');
    expect(component.ellipseGuide2).toBe('');
    expect(component.grilleGuide).toBe('');
    expect(component.grilleGuide2).toBe('');
  });
});
