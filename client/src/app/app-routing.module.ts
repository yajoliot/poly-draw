import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawComponent } from './components/draw/draw.component';
import { MenuComponent } from './components/menu/menu.component';
import { UserguideComponent } from './components/userguide/userguide.component';
import { ServerSelectComponent } from './components/server-select/server-select.component';

const routes: Routes = [
  { path: '', redirectTo: '/app-menu', pathMatch: 'full'},
  { path: 'app-menu', component: MenuComponent },
  { path: 'app-draw', component: DrawComponent },
  { path: 'app-userguide', component: UserguideComponent },
  { path: 'app-server-select', component: ServerSelectComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
