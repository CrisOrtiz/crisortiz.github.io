import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'admin', loadComponent: () => import('./components/admin-panel/admin-panel.component').then((c) => c.AdminPanelComponent)},   
    {path: '**', pathMatch: 'full', redirectTo: ''},
];
