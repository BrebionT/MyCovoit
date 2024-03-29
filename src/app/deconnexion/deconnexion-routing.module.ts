import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeconnexionPage } from './deconnexion.page';

const routes: Routes = [
  {
    path: '',
    component: DeconnexionPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeconnexionPageRoutingModule {}