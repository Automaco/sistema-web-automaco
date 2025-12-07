# 📦 Sistema Frontend Privado

Proyecto construido con:

* **React**
* **Vite + SWC**
* **TypeScript**
* **TailwindCSS v4**
* Arquitectura modular y escalable

---

# 📂 Estructura del Proyecto

```
src/
├── assets/               # Imágenes del proyecto si es necesario
├── api/                  # Solicitudes HTTP por módulo (auth.api, users.api...)
├── services/             # Lógica de negocio (usa api/)
├── features/             # Módulos funcionales (auth, dashboard, dtes, settings)
├── components/           # Componentes reutilizables
├── layouts/              # Layouts globales
├── store/                # Estado global 
├── hooks/                # Custom hooks
├── utils/                # Utilidades puras (http-client, helpers, formatters)
├── constants/            # Rutas, enums, roles, constantes
├── router/               # Enrutamiento principal
├── main.tsx
└── App.tsx
```

---

# 🧩 Estándares de nombrado

* **Componentes** → PascalCase
* **Funciones** → camelCase
* **Archivos** → kebab-case
* **Carpetas** → kebab-case
* **Interfaces** → PascalCase
* **Constantes** → UPPER_SNAKE_CASE

---

# 🔗 Cliente HTTP Genérico

Las peticiones se realizan mediante un cliente reutilizable ubicado en:

```
src/utils/http-client.ts
```

Este archivo expone métodos:

* `httpClient.get()`
* `httpClient.post()`
* `httpClient.put()`
* `httpClient.delete()`

De esta manera, las APIs quedan limpias y sin repetición de código.

---

# ⚙️ TailwindCSS v4

Importar simplemente:

```css
@import "tailwindcss";
```

No requiere archivo de configuración a menos que se desee personalizar.

---
