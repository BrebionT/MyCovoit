import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'connexion',
    loadChildren: () => import('./connexion/connexion.module').then(m => m.ConnexionPageModule)
  },
  {
    path: 'inscription',
    loadChildren: () => import('./inscription/inscription.module').then( m => m.InscriptionPageModule)
  },
  {
    path: 'infos-perso',
    loadChildren: () => import('./infos-perso/infos-perso.module').then( m => m.InfosPersoPageModule)
  },
  {
    path: 'conversation',
    loadChildren: () => import('./conversation/conversation.module').then( m => m.ConversationPageModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
  },
  {
    path: 'motdepasseoublie',
    loadChildren: () => import('./motdepasseoublie/motdepasseoublie.module').then( m => m.MotdepasseoubliePageModule)
  },
  {
    path: 'motdepasseoublie',
    loadChildren: () => import('./motdepasseoublie/motdepasseoublie.module').then( m => m.MotdepasseoubliePageModule)
  },
  {
    path: 'noter',
    loadChildren: () => import('./noter/noter.module').then( m => m.NoterPageModule)
  },
  {
    path: 'liste-avis',
    loadChildren: () => import('./liste-avis/liste-avis.module').then( m => m.ListeAvisPageModule)
  },
  {
    path: 'profil-autre',
    loadChildren: () => import('./profil-autre/profil-autre.module').then( m => m.ProfilAutrePageModule)
  },
  {
    path: 'infos-trajet',
    loadChildren: () => import('./infos-trajet/infos-trajet.module').then( m => m.InfosTrajetPageModule)
  }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
