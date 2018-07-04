import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _afAuth: AngularFireAuth
  ) { }

  loginGoogle(){
    return this._afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  getAuth() {
    return this._afAuth.authState.pipe(
      map(auth => auth)
    );
  }

  logout() {
    return this._afAuth.auth.signOut();
  }
}
