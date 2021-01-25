import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoterPage } from './noter.page';

const routes: Routes = [
  {
    path: '',
    component: NoterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoterPageRoutingModule {}
