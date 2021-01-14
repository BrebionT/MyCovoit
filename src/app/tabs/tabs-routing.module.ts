import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'accueil',
        loadChildren: () => import('../accueil/accueil.module').then(m => m.AccueilPageModule)
      },
      {
        path: 'conversation',
        loadChildren: () => import('../conversation/conversation.module').then(m => m.ConversationPageModule)
      },
      {
        path: 'profil',
        loadChildren: () => import('../profil/profil.module').then(m => m.ProfilPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('../messages/messages.module').then(m => m.MessagesPageModule)
      },
      {
        path: 'inscription',
        loadChildren: () => import('../inscription/inscription.module').then(m => m.InscriptionPageModule)
      },
      {

        path: 'tableaubord',
        loadChildren: () => import('../tableaubord/tableaubord.module').then(m => m.TableaubordPageModule)
      },
      {
        path: 'infos-perso',
        loadChildren: () => import('../infos-perso/infos-perso.module').then( m => m.InfosPersoPageModule)
      },
      {
        path: 'motdepasseoublie',
        loadChildren: () => import('../motdepasseoublie/motdepasseoublie.module').then( m => m.MotdepasseoubliePageModule)
      },

      {
        path: 'modifProfil',
        loadChildren: () => import('../modifProfil/modifProfil.module').then( m => m.ModifProfilPageModule)
      },
      {
        path: 'deconnexion',
        loadChildren: () => import('../deconnexion/deconnexion.module').then( m => m.DeconnexionPageModule)
      },
      {
        path: 'conditionGen',
        loadChildren: () => import('../conditionGen/conditionGen.module').then( m => m.ConditionGenPageModule)
      },
      {

        path: '',
        redirectTo: '/tabs/tab2',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab2',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
