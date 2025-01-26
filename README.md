## Compilación y Ejecución en Android/iOS (Capacitor)

Esta aplicación utiliza Capacitor para la compilación en plataformas nativas.

**Requisitos Previos:**

*   [Node.js](https://nodejs.org/) (v18 o superior) y npm instalados.
*   [Ionic CLI](https://ionicframework.com/docs/cli) instalado globalmente: `npm install -g @ionic/cli`
*   **Android:** [Android Studio](https://developer.android.com/studio) con el SDK de Android y las herramientas de compilación necesarias.
*   **iOS:** [Xcode](https://developer.apple.com/xcode/) (última versión estable) instalado. Se necesita macOS.

**Pasos para la Compilación:**

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/AngelGiraldoS/my-test-app.git)
    cd my-test-app
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Compilar el proyecto Angular para producción:**
    ```bash
    ionic build --prod
    ```

4.  **Sincronizar con Capacitor:**
    ```bash
    npx cap sync
    ```

**Ejecutar en Android:**

1.  **Abrir el proyecto en Android Studio:**
    ```bash
    npx cap open android
    ```
2.  En Android Studio, selecciona un dispositivo virtual (AVD) o un dispositivo físico conectado.
3.  Haz clic en el botón "Run" (icono de play verde).

**Ejecutar en iOS:**

1.  **Abrir el proyecto en Xcode:**
    ```bash
    npx cap open ios
    ```
2.  En Xcode, selecciona un simulador o un dispositivo físico conectado.
3.  Haz clic en el botón "Build and then run" (icono de play).

**Nota:** Para ejecutar en un dispositivo iOS físico, necesitarás una cuenta de desarrollador de Apple y configurar la firma de código en Xcode.

**Actualizaciones del código:**

Después de hacer cambios en el código de la aplicación Angular:

1.  Compila de nuevo: `ionic build --prod`
2.  Sincroniza con Capacitor: `npx cap sync`
3.  Reejecuta la aplicación desde Android Studio o Xcode.
