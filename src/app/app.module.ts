import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { HttpModule } from '@angular/http';
import { HttpClientModule,  } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms'

import { AppComponent } from './app.component';
import { AnimeComponent } from './anime/anime.component';
import { DetalleComponent } from './detalle/detalle.component';


@NgModule({
  declarations: [
    AppComponent,
    AnimeComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    
    FormsModule,
   //  HttpModule,
    HttpClientModule,
    
    
    RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
