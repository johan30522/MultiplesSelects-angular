import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [

  {
    path: 'selector',
    loadChildren: () =>
      import('./modules/paises/paises.module').then(
        (module) => module.PaisesModule
      )
  },
  {
    path:'**',
    redirectTo:'selector'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,    {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
