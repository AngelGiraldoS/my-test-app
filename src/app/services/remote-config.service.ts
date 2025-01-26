import { Injectable, inject } from '@angular/core';
import {
  RemoteConfig,
  getValue,
  fetchAndActivate,
} from '@angular/fire/remote-config';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  private remoteConfig = inject(RemoteConfig);

  constructor() {
    this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
    this.remoteConfig.defaultConfig = {
      feature_flag_new_feature: false, // Valor por defecto si no se puede obtener de Remote Config
    };
  }

  // Inicializar y activar la configuración remota
  async initialize() {
    try {
      await fetchAndActivate(this.remoteConfig);
    } catch (error) {
      console.error('Error al inicializar Remote Config:', error);
    }
  }

  // Obtener un valor booleano específico de Remote Config
  private getBooleanValue(key: string, defaultValue: boolean): Observable<boolean> {
    const value = getValue(this.remoteConfig, key);
    if (value.getSource() === 'remote') {
      return of(value.asBoolean());
    } else {
      return of(defaultValue); // Usar valor predeterminado local si no hay valor remoto
    }
  }

  // Comprobar si una característica está habilitada
  isFeatureEnabled(featureName: string, defaultValue: boolean): Observable<boolean> {
    return this.getBooleanValue(featureName, defaultValue);
  }
}