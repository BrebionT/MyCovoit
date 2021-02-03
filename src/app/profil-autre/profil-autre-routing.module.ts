import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilAutrePage } from './profil-autre.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilAutrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilAutrePageRoutingModule {}
