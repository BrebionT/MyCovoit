import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'historique',
        loadChildren: () => import('../historique/historique.module').then(m => m.HistoriquePageModule)
      },
      
      {
        path: 'proposer',
        loadChildren: () => import('../proposer/proposer.module').then(m => m.ProposerPageModule)
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

        path: 'tableaubord',
        loadChildren: () => import('../tableaubord/tableaubord.module').then(m => m.TableaubordPageModule)
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
        path: 'rechercher',
        loadChildren: () => import('../rechercher/rechercher.module').then( m => m.RechercherPageModule)
      },
      {
        path: 'recherchetrajet',
        loadChildren: () => import('../recherchetrajet/recherchetrajet.module').then( m => m.RecherchetrajetPageModule)
      },
      {
        path: 'noter',
        loadChildren: () => import('../noter/noter.module').then( m => m.NoterPageModule)
      },
      {
        path: 'liste-avis',
        loadChildren: () => import('../liste-avis/liste-avis.module').then( m => m.ListeAvisPageModule)
      },
      {
        path: 'profil-autre',
        loadChildren: () => import('../profil-autre/profil-autre.module').then( m => m.ProfilAutrePageModule)
      },
      {

        path: '',
        redirectTo: '/connexion',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/connexion',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
