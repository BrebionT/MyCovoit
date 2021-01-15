import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RechercherPage } from './rechercher.page';

const routes: Routes = [
  {
    path: '',
    component: RechercherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RechercherPageRoutingModule {}