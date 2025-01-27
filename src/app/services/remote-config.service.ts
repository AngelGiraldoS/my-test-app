import { Injectable, inject } from '@angular/core';
import {
  RemoteConfig,
  getValue,
  fetchAndActivate,
  getBoolean,
} from '@angular/fire/remote-config';
import { map, Observable, of, from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  private remoteConfig: RemoteConfig = inject(RemoteConfig);
  private initialized = false;

  constructor() {
    if (environment.useEmulators) {
      this.remoteConfig.settings.minimumFetchIntervalMillis = 0;
    } else {
      this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
    }
    this.remoteConfig.defaultConfig = {
      feature_flag_new_feature: false,
    };
  }

  async initialize(): Promise<boolean> {
    try {
      const result = await fetchAndActivate(this.remoteConfig);
      this.initialized = true;
      return result;
    } catch (error) {
      console.error('Error al inicializar Remote Config:', error);
      return false;
    }
  }

  isFeatureEnabled(
    featureName: string,
    defaultValue: boolean
  ): Observable<boolean> {
    return from(this.initialize()).pipe(
      map(() => {
        const value = getBoolean(this.remoteConfig, featureName);
        return value !== undefined ? value : defaultValue;
      })
    );
  }
}