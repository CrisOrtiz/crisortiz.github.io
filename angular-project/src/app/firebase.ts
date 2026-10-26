import { InjectionToken, inject } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { DocumentReference, Firestore, getFirestore, onSnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { environment } from '../assets/environments/environment';

// The plain Firebase SDK behind injection tokens. @angular/fire has no stable release for
// Angular 22 yet, and the site only needs Firestore (plus Auth on the admin page).
export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP', {
  providedIn: 'root',
  factory: () => initializeApp(environment.firebase),
});

export const FIRESTORE = new InjectionToken<Firestore>('FIRESTORE', {
  providedIn: 'root',
  factory: () => getFirestore(inject(FIREBASE_APP)),
});

/** Live data of a document: emits on every change, undefined while it does not exist. */
export function docData<T = any>(ref: DocumentReference): Observable<T | undefined> {
  return new Observable<T | undefined>(subscriber =>
    onSnapshot(ref, snap => subscriber.next(snap.data() as T | undefined), err => subscriber.error(err))
  );
}
