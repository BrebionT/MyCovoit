import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfosTrajetPage } from './infos-trajet.page';

const routes: Routes = [
  {
    path: '',
    component: InfosTrajetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfosTrajetPageRoutingModule {}
