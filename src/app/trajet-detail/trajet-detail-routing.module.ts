import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrajetDetailPage } from './trajet-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TrajetDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrajetDetailPageRoutingModule {}
