import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposerPage } from './proposer.page';

const routes: Routes = [
  {
    path: '',
    component: ProposerPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposerPageRoutingModule {}
