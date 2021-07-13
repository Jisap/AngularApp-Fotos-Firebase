import { Routes, RouterModule } from "@angular/router";
import { CargaComponent } from "./components/carga/carga.component";
import { FotosComponent } from "./components/fotos/fotos.component";


const RUTAS: Routes = [

    { path: 'fotos', component: FotosComponent },
    { path: 'carga', component: CargaComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'fotos' }

];

export const APP_ROUTES = RouterModule.forRoot(RUTAS);