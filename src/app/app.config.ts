import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { firebaseProviders } from './firebase.config'; // Importa firebaseProviders
import { provideServiceWorker } from '@angular/service-worker';
import { addIcons } from 'ionicons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideIonicAngular({}),
    firebaseProviders, // Llama a la función para configurar los providers
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
