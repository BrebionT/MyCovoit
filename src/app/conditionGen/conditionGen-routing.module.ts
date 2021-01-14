import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConditionGenPage } from './conditionGen.page';

const routes: Routes = [
  {
    path: '',
    component: ConditionGenPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConditionGenPageRoutingModule {}