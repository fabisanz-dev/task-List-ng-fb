import { AuthService } from './servicios/auth.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TaskCrudComponent } from './task-crud/task-crud.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBTFbFpvqCIeyBRfzhXm1qCFg0QMLdVbwo",
  authDomain: "portaf-test.firebaseapp.com",
  databaseURL: "https://portaf-test.firebaseio.com",
  projectId: "portaf-test",
  storageBucket: "portaf-test.appspot.com",
  messagingSenderId: "905229328346"
};

@NgModule({
  declarations: [
    AppComponent,
    TaskCrudComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [AngularFireDatabase, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
