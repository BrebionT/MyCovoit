import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MotdepasseoubliePage } from './motdepasseoublie.page';

const routes: Routes = [
  {
    path: '',
    component: MotdepasseoubliePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MotdepasseoubliePageRoutingModule {}
