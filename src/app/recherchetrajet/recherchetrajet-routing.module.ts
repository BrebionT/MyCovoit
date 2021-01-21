import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecherchetrajetPage } from './recherchetrajet.page';

const routes: Routes = [
  {
    path: '',
    component: RecherchetrajetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecherchetrajetPageRoutingModule {}