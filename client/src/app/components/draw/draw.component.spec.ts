import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule, MatSidenavModule, MatIconModule, MatFormFieldModule,
   MatSelectModule, MatDialogModule, MatSnackBarModule, MatInputModule } from '@angular/material';
import { DrawComponent } from './draw.component';
import { HeaderComponent } from '../header/header.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { WorkspaceComponent} from '../workspace/workspace.component';
import { DrawingComponent } from '../drawing/drawing.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DrawComponent', () => {
  let component: DrawComponent;
  let fixture: ComponentFixture<DrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, BrowserAnimationsModule, RouterTestingModule, MatToolbarModule, MatSidenavModule,
         MatIconModule, MatFormFieldModule, MatSelectModule, MatDialogModule, MatSnackBarModule, MatInputModule, HttpClientTestingModule],
      declarations: [ DrawComponent, HeaderComponent, ToolbarComponent, WorkspaceComponent, DrawingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
