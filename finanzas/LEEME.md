# Mis Finanzas — PWA local

App web instalable (Android, iPhone, PC). Funciona sin conexión. Tus datos se guardan **solo en tu dispositivo** (IndexedDB). No hay servidor ni cuentas.

## Publicarla (gratis, 2 min)
Una PWA necesita HTTPS para instalarse. Opción más rápida:

**Netlify Drop**
1. Entra a https://app.netlify.com/drop
2. Arrastra la carpeta `finanzas` completa.
3. Abre la URL que te da en el teléfono.

**GitHub Pages** (alternativa)
1. Crea un repo y sube el contenido de esta carpeta.
2. Settings → Pages → Branch `main` / root → Save.

El hosting solo sirve los archivos de la app. Tus movimientos nunca salen del dispositivo.

## Instalar
- **Android / Chrome / Edge:** Ajustes de la app → "Instalar", o menú ⋮ → "Instalar app".
- **iPhone / iPad:** Safari → Compartir ⬆️ → "Agregar a pantalla de inicio".

## Cuenta (recomendado)
- Al abrir por primera vez: **Crear cuenta** (usuario + contraseña), **Ya tengo cuenta** o **Continuar sin cuenta**.
- Inicia sesión con el mismo usuario en otro dispositivo y los datos aparecen solos.
- La contraseña nunca sale del dispositivo: se derivan una llave de acceso y una de cifrado (PBKDF2 310k + HKDF).
- Supabase guarda solo una huella bcrypt de la llave de acceso y los datos cifrados. 5 intentos fallidos → bloqueo de 5 min.
- Olvidar la contraseña = la copia de la nube no se puede descifrar (los datos del dispositivo siguen ahí).

## Sincronización con código (alternativa)
1. En un dispositivo: Ajustes → Sincronización → **Activar aquí**. Copia el código (24 caracteres).
2. En el otro: Ajustes → Sincronización → **Tengo un código** y pégalo.
3. Listo: los cambios viajan solos en segundos (al guardar, al abrir la app y cada 20 s).

- Cifrado AES-256-GCM en el dispositivo; la llave sale del código y nunca se envía.
- Servidor: proyecto Supabase `mis-finanzas` (tabla `vaults`), solo guarda texto cifrado.
- Guarda el código en un lugar seguro. Sin él, la copia de la nube no se puede descifrar.
- Tema y tipografía son por dispositivo; nombre, moneda, movimientos, categorías y presupuestos se sincronizan.

## Perfiles (varias personas en un dispositivo)
- Ajustes → Perfiles → **Nuevo perfil**. Cada perfil tiene sus datos, su PIN de 4 dígitos, su tema y su sincronización.
- Al abrir la app se elige perfil y se escribe el PIN. Se bloquea sola tras 1 min en segundo plano.
- 5 PIN fallidos → espera de 30 s. "Olvidé mi PIN" borra ese perfil del dispositivo (recuperable con el código de sincronización).
- El PIN es un candado de privacidad entre personas, no cifrado fuerte de los datos en el dispositivo.

## Respaldo
Cada dispositivo guarda sus propios datos. Ajustes → **Exportar** (.json) e **Importar**. Importar **combina** con tus datos actuales; no duplica ni borra. Si desinstalas la app o borras datos del navegador, se pierden sin respaldo.

## Archivos
- `index.html` — app completa (UI + lógica)
- `manifest.json` — metadatos de instalación
- `sw.js` — service worker (offline). Al cambiar `index.html`, sube `CACHE` a `finanzas-v2`.
- `icons/` — íconos
- `fonts/` — Manrope, Plus Jakarta Sans, Outfit, DM Sans y Caveat (OFL), incluidas para uso sin conexión
