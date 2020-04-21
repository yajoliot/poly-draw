import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
// Components

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component';
import { DrawComponent } from './components/draw/draw.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { UserguideComponent } from './components/userguide/userguide.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { ServerSelectComponent } from './components/server-select/server-select.component'


// Dialogs
import { ColorPickerDialog } from '../dialogs/color-picker/color-picker-dialog.component'
import { ConfirmDialog } from '../dialogs/confirm/confirm-dialog.component';
import { CreationDialog } from '../dialogs/creation/creation-dialog.component';
import { InfoDialog } from '../dialogs/info/info-dialog.component';
import { SaveDialog } from '../dialogs/save-dialog/save-dialog.component';


// material
import { MatButtonModule} from '@angular/material'
import { MatSidenavModule } from '@angular/material'
import { MatToolbarModule } from '@angular/material'
import { MatGridListModule } from '@angular/material'
import { MatCardModule } from '@angular/material'
import { MatDialogModule } from '@angular/material'
import { MatIconModule } from '@angular/material'
import { MatFormFieldModule } from '@angular/material'
import { MatSelectModule } from '@angular/material'
import { MatInputModule } from '@angular/material'
import { MatDividerModule } from '@angular/material'
import { MatListModule } from '@angular/material'
import { MatSnackBarModule } from '@angular/material'
import { MatTooltipModule } from '@angular/material'
import { MatExpansionModule } from '@angular/material'
import { MatSliderModule } from '@angular/material'
import { MatTabsModule } from '@angular/material'
import { ExporterDialogComponent } from 'src/dialogs/exporter-dialog/exporter-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material';

// Models

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ToolbarComponent,
        DrawingComponent,
        MenuComponent,
        DrawComponent,
        WorkspaceComponent,
        UserguideComponent,
        ServerSelectComponent,
        ExporterDialogComponent,

        InfoDialog,
        ConfirmDialog,
        CreationDialog,
        ColorPickerDialog,
        SaveDialog
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        AppRoutingModule,
        MatGridListModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDividerModule,
        MatListModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatExpansionModule,
        MatSliderModule,
        FormsModule,
        MatTabsModule,
        MatProgressSpinnerModule
    ],
    providers: [HttpClientModule],
    bootstrap: [
        AppComponent
    ],
    entryComponents: [
        InfoDialog, ConfirmDialog, CreationDialog, ColorPickerDialog, ExporterDialogComponent, SaveDialog
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {}
