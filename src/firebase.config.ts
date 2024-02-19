import { importProvidersFrom, EnvironmentProviders } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';

const firebaseProviders: EnvironmentProviders = importProvidersFrom([
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore())
]);

export { firebaseProviders };